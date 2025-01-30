import jstat from "jstat";

// Normal Distribution Inverse
export function calculateNormalDistributionInv(
	returnPeriod,
	mediaAritmetica,
	desviacionStandar
) {
	const p1 = 1 / returnPeriod;
	const pro = 1 - p1;
	const z = jstat.normal.inv(pro, 0, 1);
	const qq = desviacionStandar * z + mediaAritmetica;

	return {
		value: qq,
		probability: p1 * 100,
		returnPeriod: returnPeriod,
		params: {
			"x": qq?.toFixed(4),
			"z": z?.toFixed(4),
			"P(X ≥ x)": p1?.toFixed(8),
			"P(X ≤ x)": pro?.toFixed(8),
			"μ": mediaAritmetica?.toFixed(4),
			"S": desviacionStandar?.toFixed(4),
		},
	};
}

// Log-Normal Distribution Inverse
export function calculateLogNormalDistributionInv(
	returnPeriod,
	logMediaAritmetica,
	logDesviacionStandar
) {
	const p1 = 1 / returnPeriod;
	const pro = 1 - p1;
	const z = jstat.normal.inv(pro, 0, 1);
	const qq = Math.exp(logDesviacionStandar * z + logMediaAritmetica);

	return {
		value: qq,
		probability: p1 * 100,
		returnPeriod: returnPeriod,
		params: {
			"x": qq?.toFixed(4),
			"z": z?.toFixed(4),
			"μ": logMediaAritmetica?.toFixed(4),
			"S": logDesviacionStandar?.toFixed(4),
			"z": z?.toFixed(4),
			"P(X ≥ x)": p1?.toFixed(8),
			"P(X ≤ x)": pro?.toFixed(8),
		},
	};
}

// Pearson III Inverse
export function calculatePearsonIIIInv(
	returnPeriod,
	data,
	mediaAritmetica,
	desviacionStandar
) {
	let n = data.length - 1;
	let s = 0;

	for (let i = 0; i <= n; i++) {
		let d1 = data[i];
		let lamda =
			Math.abs(Math.pow(d1 - mediaAritmetica, 3) / (n + 1)) /
			Math.pow(desviacionStandar, 3);
		s += lamda;
	}

	let b1 = Math.pow(2 / s, 2);
	let al1 = desviacionStandar / Math.sqrt(b1);
	let del1 = mediaAritmetica - al1 * b1;
	let df = Math.round(Math.abs(2 * b1));
	let pro = 1 / returnPeriod;
	let pro1 = 1 - pro;
	// let x2 = Inv_CHI(pro1, df);
	let x2 = jstat.chisquare.inv(pro1, df);
	let y = x2 / 2;
	let qu = y * al1 + del1;

	return {
		value: qu,
		probability: pro * 100,
		returnPeriod: returnPeriod,
		params: {
			"x": qu?.toFixed(4),
			"skew": s?.toFixed(4),
			"β": b1?.toFixed(4),
			"α": al1?.toFixed(4),
			"δ": del1?.toFixed(4),
			"df": df,
			"y": y?.toFixed(4),
			"x2": x2?.toFixed(4),
			"P(X ≥ x)": pro?.toFixed(8),
			"P(X ≤ x)": pro1?.toFixed(8),
		},
	};
}

// Log-Pearson III Inverse
export function calculateLogPearsonIIIInv(
	returnPeriod,
	log10MediaAritmetica,
	log10DesviacionStandar,
	cs
) {
	const p1 = 1 / returnPeriod;
	const pro = 1 - p1;
	const z = jstat.normal.inv(pro, 0, 1);
	const k = cs / 6;
	const kt =
		z +
		(z * z - 1) * k +
		((z * z * z - 6 * z) * (k * k)) / 3 -
		(z * z - 1) * (k * k * k) +
		z * (k * k * k * k) +
		(k * k * k * k * k) / 3;
	const y = log10DesviacionStandar * kt + log10MediaAritmetica;
	const qq = Math.pow(10, y);

	return {
		value: qq,
		probability: p1 * 100,
		returnPeriod: returnPeriod,
		params: {
			"x": qq?.toFixed(4),
			"y": y?.toFixed(4),
			"kt": kt?.toFixed(4),
			"k": k?.toFixed(4),
			"z": z?.toFixed(4),
			"μ_log10": log10MediaAritmetica?.toFixed(4),
			"σ_log10": log10DesviacionStandar?.toFixed(4),
			"cs": cs?.toFixed(4),
			"P(X ≥ x)": p1?.toFixed(8),
			"P(X ≤ x)": pro?.toFixed(8),
		},
	};
}

// Gumbel Distribution Inverse - Note: `calculateSnYn` function is not provided here, you need to implement or import it.
export function calculateGumbelInv(
	returnPeriod,
	mediaAritmetica,
	desviacionStandar,
	calculateSnYn
) {
	const { sn, yn } = calculateSnYn(); // Assumes calculateSnYn returns an object with `sn` and `yn`
	const alfa = sn / desviacionStandar;
	const u = mediaAritmetica - yn / alfa;
	const p1 = 1 / returnPeriod;
	const pro1 = 1 - p1;
	const b = -Math.log(-Math.log(pro1)); // Inverse of Gumbel CDF
	const cau = b / alfa + u;

	return {
		value: cau,
		probability: p1 * 100,
		returnPeriod: returnPeriod,
		params: {
			"x": cau?.toFixed(4),
			"α": alfa?.toFixed(4),
			"u": u?.toFixed(4),
			"sn": sn?.toFixed(4),
			"yn": yn?.toFixed(4),
			"P(X ≥ x)": p1?.toFixed(8),
			"P(X ≤ x)": pro1?.toFixed(8),
		},
	};
}
