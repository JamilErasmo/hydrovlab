// Normal Distribution Method
export function metodNormal(caudal, mediaAritmetica, desviacionStandar) {
	const z = (caudal - mediaAritmetica) / desviacionStandar;
	return area(z);
}

export function area(z) {
	const n = 1000;
	const a = -8;
	const d = (z - a) / (2 * n);
	let p = 0,
		j = 0,
		l = 0,
		q = 0;

	for (let c = 1; c <= n; c++) {
		const x = a + (2 * c - 1) * d;
		p += 4 * normal(x);
	}

	for (let e = 1; e < n; e++) {
		const x = a + 2 * e * d;
		j += 2 * normal(x);
	}

	l = normal(a);
	const y = normal(z);
	q = j + l + p + y;

	return (d / 3) * q;
}

export function normal(x) {
	const pi = Math.PI;
	return (1 / Math.sqrt(2 * pi)) * Math.exp(-((x * x) / 2));
}

// Log-Normal Distribution Method
export function metodLogNormal(
	caudal,
	logMediaAritmetica,
	logDesviacionStandar
) {
	const z = (Math.log(caudal) - logMediaAritmetica) / logDesviacionStandar;
	return area(z); // Reusing the area export function from Normal
}

// Pearson III Distribution Method (simplified due to complexity with CHI-SQUARE)
export function metodPersonIII(caudal, mediaAritmetica, desviacionStandar) {
	// This method is significantly simplified due to the complexity of Chi-Square calculation in JS
	// Full implementation would require additional libraries or complex math for Chi-Square distribution
	return 1 - pochisq((2 * (caudal - mediaAritmetica)) / desviacionStandar, 2);
}

// Placeholder for Chi-Square distribution; needs a library or complex calculation
export function pochisq(x, df) {
	// Simplified approximation, actual implementation requires more math
	return 1 - 1 / (Math.pow(x, df / 2) * Math.exp(-x / 2));
}

// Log-Pearson III Distribution Method
export function metodLogPersonIII(
	caudal,
	log10MediaAritmetica,
	log10DesviacionStandar,
	cs
) {
	const kt =
		(Math.log10(caudal) - log10MediaAritmetica) / log10DesviacionStandar;
	const k = cs / 6;
	const z = calZ(kt, k);
	return calculoArea(z);
}

export function calculoArea(z) {
	if (z < -5) return 0;
	if (z > 5) return 1;
	// Simplified version, you might need to expand this with more accurate calculations or use a library
	return normal(z); // Using the normal export function for approximation
}

export function calZ(kt, k) {
	let x1 = 1;
	for (let j = 0; j < 100; j++) {
		const fx =
			x1 +
			(x1 ** 2 - 1) * k +
			(1 / 3) * (x1 ** 3 - 6 * x1) * k ** 2 -
			(x1 ** 2 - 1) * k ** 3 +
			x1 * k ** 4 +
			(1 / 3) * k ** 5 -
			kt;
		const fpx =
			1 + 2 * x1 * k + k ** 2 * x1 ** 2 - 2 * k ** 2 - 2 * x1 * k ** 3 + k ** 4;
		const x2 = x1 - fx / fpx;
		if (Math.round(x1, 7) === Math.round(x2, 7)) return x1;
		x1 = x2;
	}
	return x1;
}

// Gumbel Distribution Method
export function metodGumbel(
	caudal,
	mediaAritmetica,
	desviacionStandar,
	sn,
	yn
) {
	const alfa = sn / desviacionStandar;
	const u = mediaAritmetica - yn / alfa;
	return 1 - Math.exp(-Math.exp(-(alfa * (caudal - u))));
}
