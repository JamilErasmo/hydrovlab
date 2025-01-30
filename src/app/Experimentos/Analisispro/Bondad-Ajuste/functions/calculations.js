export const calculateGoodnessOfFit = (data, alpha) => {
	// Simplified placeholder for calculation
	return {
		normal: { dMax: 0.0909, rank: 2 },
		logNormal: { dMax: 0.1146, rank: 5 },
		pearsonIII: { dMax: 0.1114, rank: 4 },
		logPearsonIII: { dMax: 0.0919, rank: 3 },
		gumbel: { dMax: 0.0569, rank: 1 },
	};
};

export const getCriticalValue = (n, alpha) => {
	const criticalValues = {
		"0.10": { 5: 0.51, 10: 0.37, 15: 0.3, 20: 0.26 },
		"0.05": { 5: 0.56, 10: 0.41, 15: 0.34, 20: 0.29 },
		"0.01": { 5: 0.67, 10: 0.49, 15: 0.4, 20: 0.35 },
	};
	return (
		criticalValues[alpha][n] ||
		`1.${
			alpha === "0.10" ? "224" : alpha === "0.05" ? "358" : "628"
		}/Math.sqrt(${n})`
	);
};
