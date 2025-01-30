import jstat from "jstat";

// Normal Distribution
export function calculateZ(caudal, mediaAritmetica, desviacionStandar) {
	return (caudal - mediaAritmetica) / desviacionStandar;
}

export const calculateNormalDistribution = (
	value,
	mediaAritmetica,
	desviacionStandar
) => {
	const z = calculateZ(value, mediaAritmetica, desviacionStandar);
	const pro = jstat.normal.cdf(value, mediaAritmetica, desviacionStandar);

	if (pro >= 0.9999) {
		console.warn("Probability too close to 1 for Normal distribution");
		return null;
	}

	const P_menor_x = pro;
	const P_mayor_x = 1 - P_menor_x;
	const returnPeriod = 1 / P_mayor_x;

	return {
		probability: P_mayor_x * 100,
		returnPeriod: returnPeriod,
		params: {
			"x": value?.toFixed(4),
			"z": z?.toFixed(4),
			"μ": mediaAritmetica?.toFixed(4),
			"S": desviacionStandar?.toFixed(4),
			"P(X ≥ x)": P_mayor_x?.toFixed(8),
			"P(X ≤ x)": P_menor_x?.toFixed(8),
		},
	};
};

// Log-Normal Distribution
export const calculateLogNormalDistribution = (
	value,
	logMediaAritmetica,
	logDesviacionStandar
) => {
	const logValue = Math.log(value);
	const pro = jstat.normal.cdf(
		logValue,
		logMediaAritmetica,
		logDesviacionStandar
	);

	if (pro >= 0.9999) {
		console.warn("Probability too close to 1 for Log-Normal distribution");
		return null;
	}

	const P_menor_x = pro;
	const P_mayor_x = 1 - P_menor_x;
	const returnPeriod = 1 / P_mayor_x;

	return {
		probability: P_mayor_x * 100,
		returnPeriod: returnPeriod,
		params: {
			"x": value?.toFixed(4),
			"z": calculateZ(
				logValue,
				logMediaAritmetica,
				logDesviacionStandar
			)?.toFixed(4),
			"μ_ln": logMediaAritmetica?.toFixed(4),
			"S_ln": logDesviacionStandar?.toFixed(4),
			"P(X ≥ x)": P_mayor_x?.toFixed(8),
			"P(X ≤ x)": P_menor_x?.toFixed(8),
		},
	};
};

// Constants for chi-square calculation
const Z_MAX = 6; // Maximum meaningful z value
const BIGX = 20;
const LOG_SQRT_PI = 0.5723649429247;
const I_SQRT_PI = 0.564189583547756;

// Pearson III Calculation
export function calculatePearsonIII(
	value,
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
	let y = (value - del1) / al1;
	let x2 = 2 * y;
	let df = 2 * b1;
	let pro = pochisq(x2, df);

	return {
		probability: (1 - pro) * 100,
		returnPeriod: 1 / (1 - pro),
		params: {
			"x": value.toFixed(4),
			"skew": s.toFixed(4),
			"β": b1.toFixed(4),
			"α": al1.toFixed(4),
			"δ": del1.toFixed(4),
			"df": df,
			"P(X ≥ x)": pro.toFixed(8),
			"P(X ≤ x)": (1 - pro).toFixed(8),
		},
	};
}

// Chi-Square CDF
function pochisq(x, df) {
	if (x <= 0 || df < 1) return 1;

	let a = 0.5 * x;
	let bolEven = df % 2 === 0;
	let y = Math.exp(-a);
	let s;

	if (bolEven) {
		s = y;
	} else {
		s = 2 * poz(-Math.sqrt(x));
	}

	if (df > 2) {
		let xVal = 0.5 * df - 1;
		let z = bolEven ? 1 : 0.5;

		if (a > BIGX) {
			let e = bolEven ? 0 : LOG_SQRT_PI;
			let c = Math.log(a);
			while (z <= xVal) {
				e += Math.log(z);
				s += Math.exp(c * z - a - e);
				z++;
			}
		} else {
			let e = bolEven ? 1 : I_SQRT_PI / Math.sqrt(a);
			let c = 0;
			while (z <= xVal) {
				e = e * (a / z);
				c += e;
				z++;
			}
			s = c * y + s;
		}
	}

	return 1 - s;
}

// Normal CDF approximation
function poz(z) {
	if (z === 0) return 0;

	let y = 0.5 * Math.abs(z);
	let x;

	if (y >= Z_MAX * 0.5) {
		x = 1;
	} else if (y < 1) {
		let w = y * y;
		x =
			((((((((0.000124818987 * w - 0.001075204047) * w + 0.005198775019) * w -
				0.019198292004) *
				w +
				0.059054035642) *
				w -
				0.151968751364) *
				w +
				0.319152932694) *
				w -
				0.5319230073) *
				w +
				0.797884560593) *
			y *
			2;
	} else {
		let y1 = y - 2;
		x =
			(((((((((((((-0.000045255659 * y1 + 0.00015252929) * y1 -
				0.000019538132) *
				y1 -
				0.000676904986) *
				y1 +
				0.001390604284) *
				y1 -
				0.00079462082) *
				y1 -
				0.002034254874) *
				y1 +
				0.006549791214) *
				y1 -
				0.010557625006) *
				y1 +
				0.011630447319) *
				y1 -
				0.009279453341) *
				y1 +
				0.005353579108) *
				y1 -
				0.002141268741) *
				y1 +
				0.000535310849) *
				y1 +
			0.999936657524;
	}

	return z > 0 ? (x + 1) * 0.5 : (1 - x) * 0.5;
}

// Log-Pearson III Distribution
export const calculateLogPearsonIII = (
	value,
	log10MediaAritmetica,
	log10DesviacionStandar,
	cs
) => {
	const y = Math.log10(value);
	const kt = (y - log10MediaAritmetica) / log10DesviacionStandar;
	const k = cs / 6;

	// Solve for z using Newton's method
	const z = solveForZ(kt, k);

	// Use jstat for normal CDF since Log-Pearson III can be transformed to normal for CDF calculation poz(z)
	const pro = jstat.normal.cdf(z, 0, 1);

	if (pro >= 0.9999) {
		console.warn("Probability too close to 1 for Log-Pearson III distribution");
		return null;
	}

	const P_menor_x = pro;
	const P_mayor_x = 1 - pro;
	const returnPeriod = 1 / P_mayor_x;

	return {
		probability: P_mayor_x * 100,
		returnPeriod: returnPeriod,
		params: {
			"x": value?.toFixed(4),
			"y": y?.toFixed(4),
			"kt": kt?.toFixed(4),
			"k": k?.toFixed(4),
			"z": z?.toFixed(4),
			"μ_log10": log10MediaAritmetica?.toFixed(4),
			"σ_log10": log10DesviacionStandar?.toFixed(4),
			"cs": cs?.toFixed(4),
			"P(X ≥ x)": P_mayor_x?.toFixed(8),
			"P(X ≤ x)": P_menor_x?.toFixed(8),
		},
	};
};

// Function to solve for z using Newton's method
function solveForZ(kt, k) {
	// Define the function we want to solve (f(z) = 0 where f(z) = z + (z^2 - 1)k + (z^3 - 6z)(k^2)/3 - (z^2 - 1)(k^3) + zk^4 + k^5/3 - kt)
	const f = (z) =>
		z +
		(z * z - 1) * k +
		((z * z * z - 6 * z) * (k * k)) / 3 -
		(z * z - 1) * (k * k * k) +
		z * (k * k * k * k) +
		(k * k * k * k * k) / 3 -
		kt;

	// Define the derivative of f(z) for Newton's method
	const df = (z) =>
		1 +
		2 * z * k +
		((3 * z * z - 6) * (k * k)) / 3 -
		2 * z * (k * k * k) +
		k * k * k * k;

	let z = 0; // Initial guess
	let tolerance = 1e-6; // Tolerance for convergence
	let maxIterations = 100; // Max number of iterations to prevent infinite loop

	for (let i = 0; i < maxIterations; i++) {
		let zNext = z - f(z) / df(z);
		if (Math.abs(zNext - z) < tolerance) {
			return zNext;
		}
		z = zNext;
	}
	console.warn(
		"Newton's method did not converge within " + maxIterations + " iterations."
	);
	return z; // Return the best approximation we have
}

// Gumbel Distribution
export const calculateGumbel = (
	value,
	mediaAritmetica,
	desviacionStandar,
	calculateSnYn
) => {
	const { sn, yn } = calculateSnYn();
	const alfa = sn / desviacionStandar;
	const u = mediaAritmetica - yn / alfa;
	const pro = 1 - Math.exp(-Math.exp(-alfa * (value - u)));

	if (pro >= 0.9999) {
		console.warn("Probability too close to 1 for Gumbel distribution");
		return null;
	}

	const P_menor_x = 1 - pro;
	const P_mayor_x = pro;
	const returnPeriod = 1 / P_mayor_x;

	return {
		probability: P_mayor_x * 100,
		returnPeriod: returnPeriod,
		params: {
			"x": value?.toFixed(4),
			"α": alfa?.toFixed(4),
			"u": u?.toFixed(4),
			"sn": sn?.toFixed(4),
			"yn": yn?.toFixed(4),
			"P(X ≥ x)": P_mayor_x?.toFixed(8),
			"P(X ≤ x)": P_menor_x?.toFixed(8),
		},
	};
};
