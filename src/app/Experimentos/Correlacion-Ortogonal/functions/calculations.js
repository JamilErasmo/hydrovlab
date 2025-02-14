// Helper function to extract station data
function extractStationData(data, stationName) {
	const stationData = [];
	const station = data[stationName];
	if (station) {
		Object.entries(station.data).forEach(([year, yearData]) => {
			stationData.push(...yearData.monthly);
		});
	}
	return stationData;
}

// Main calculation function
export function calculateAllResults(data, baseStation, analysisStation) {
	const data1 = extractStationData(data, baseStation);
	const data2 = extractStationData(data, analysisStation);

	const pairedData = data1
		.map((val, i) => [val, data2[i]])
		.filter((pair) => pair[0] !== -100 && pair[1] !== -100);

	const n = pairedData.length;
	const meanX = pairedData.reduce((sum, pair) => sum + pair[0], 0) / n;
	const meanY = pairedData.reduce((sum, pair) => sum + pair[1], 0) / n;

	const varianceX =
		pairedData.reduce((sum, pair) => sum + Math.pow(pair[0] - meanX, 2), 0) / n;
	const varianceY =
		pairedData.reduce((sum, pair) => sum + Math.pow(pair[1] - meanY, 2), 0) / n;
	const covariance =
		pairedData.reduce(
			(sum, pair) => sum + (pair[0] - meanX) * (pair[1] - meanY),
			0
		) / n;

	const lambda1 =
		(varianceX +
			varianceY +
			Math.sqrt(
				Math.pow(varianceX + varianceY, 2) -
					4 * (varianceX * varianceY - Math.pow(covariance, 2))
			)) /
		2;
	const lambda2 =
		(varianceX +
			varianceY -
			Math.sqrt(
				Math.pow(varianceX + varianceY, 2) -
					4 * (varianceX * varianceY - Math.pow(covariance, 2))
			)) /
		2;
	const lambda = Math.max(lambda1, lambda2);

	const slope = covariance / (lambda - varianceY);
	const pearson = covariance / Math.sqrt(varianceX * varianceY);

	const intercept = meanY - slope * meanX;
	const parabolicBase = meanY / meanX;
	const parabolicExponent = (slope * meanX) / meanY;

	// Fill missing data in analysisStation based on baseStation
	const filledData2 = data2.map((val, i) => {
		if (val === -100 && data1[i] !== -100) {
			return data1[i] >= meanX
				? intercept + slope * data1[i] // Linear equation
				: parabolicBase * Math.pow(data1[i], parabolicExponent); // Parabolic equation
		}
		return val;
	});

	// Format filled data back into the original structure
	const filledData = [];
	const analysisStationData = data[analysisStation];
	let dataIndex = 0;

	Object.entries(analysisStationData.data).forEach(([year, yearData]) => {
		const monthlyData = yearData.monthly.map(() => filledData2[dataIndex++]);
		const total = monthlyData.reduce(
			(sum, val) => sum + (val !== -100 ? val : 0),
			0
		);

		filledData.push({
			xutm: analysisStationData.coordinates[0],
			yutm: analysisStationData.coordinates[1],
			code: analysisStation,
			dataType: null, // Adjust if you have a specific data type
			year: parseInt(year, 10),
			data: monthlyData,
			total: total === -100 ? -100 : total,
		});
	});

	return {
		baseStationMean: meanX,
		analysisStationMean: meanY,
		baseStationVariance: varianceX,
		analysisStationVariance: varianceY,
		covariance,
		lambdaCoefficient: lambda,
		slope,
		pearsonCoefficient: pearson,
		equation1: `y = ${intercept.toFixed(15)} + ${slope.toFixed(15)} * x`,
		equation2: `y = ${parabolicBase.toFixed(
			15
		)} * x^${parabolicExponent.toFixed(15)}`,
		filledData,
	};
}
