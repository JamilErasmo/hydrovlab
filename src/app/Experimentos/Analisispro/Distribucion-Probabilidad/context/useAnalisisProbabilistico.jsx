import jstat from "jstat";
import { useEffect, useState } from "react";

export default function useAnalisisProbabilistico(data) {
	const [mediaAritmetica, setMediaAritmetica] = useState(null);
	const [desviacionStandar, setDesviacionStandar] = useState(null);
	const [logMediaAritmetica, setLogMediaAritmetica] = useState(null);
	const [logDesviacionStandar, setLogDesviacionStandar] = useState(null);
	const [log10MediaAritmetica, setLog10MediaAritmetica] = useState(null);
	const [log10DesviacionStandar, setLog10DesviacionStandar] = useState(null);
	const [cs, setCs] = useState(null);

	// Calculate arithmetic mean and standard deviation
	const calMediaDesvi = () => {
		const n = data.length;
		if (n === 0) return;
		const mean = jstat.mean(data);
		setMediaAritmetica(mean);
		const stdDev = jstat.stdev(data, true); // true for population standard deviation
		setDesviacionStandar(stdDev);
	};

	// Calculate log mean and log standard deviation (natural log)
	const logCalMediaDesvi = () => {
		let n = data.length - 1; // Equivalent to UBound in VB.NET
		let s = 0;
		for (let i = 0; i <= n; i++) {
			s += Math.log(data[i]);
		}
		let logMediaAritmetica = s / (n + 1); // n is incremented by 1 as in VB.NET

		let su = 0;
		for (let j = 0; j <= n; j++) {
			su += Math.pow(Math.log(data[j]) - logMediaAritmetica, 2);
		}
		let logDesviacionStandar = Math.sqrt(su / (n + 1)); // n1 is n in this case, incremented by 1

		setLogMediaAritmetica(logMediaAritmetica);
		setLogDesviacionStandar(logDesviacionStandar);
	};

	// Calculate log10 mean and log10 standard deviation
	const log10CalMediaDesvi = () => {
		const log10Data = data.map(Math.log10);
		const log10MediaAritmetica = jstat.mean(log10Data)
		const log10DesviacionStandar = jstat.stdev(log10Data, true)
		// Calculate skewness 
		let n = data.length - 1; // Equivalent to UBound in VB.NET
		let s = 0;
		for (let i = 0; i <= n; i++) {
			let term = (Math.log10(data[i]) - log10MediaAritmetica) / log10DesviacionStandar;
			s += Math.pow(term, 3);
		}
		let cs = ((n + 1) / ((n) * (n - 1))) * s; // Adjust for n+1 in the numerator to match VB.NET

		setLog10MediaAritmetica(log10MediaAritmetica);
		setLog10DesviacionStandar(log10DesviacionStandar);
		setCs(cs);
	};

	useEffect(() => {
		calculateAll();
	}, [data]);

	// Trigger all calculations
	const calculateAll = () => {
		calMediaDesvi();
		logCalMediaDesvi();
		log10CalMediaDesvi();
	};

	const cleanAll = () => {
		setMediaAritmetica(null);
		setDesviacionStandar(null);
		setLogMediaAritmetica(null);
		setLogDesviacionStandar(null);
		setLog10MediaAritmetica(null);
		setLog10DesviacionStandar(null);
		setCs(null);
	};

	// Helper for Gumbel distribution
	const calculateSnYn = () => {
		const n = data.length;
		if (n === 0) return { sn: 0, yn: 0 };
		const yi = data.map((_, j) => -Math.log(Math.log((n + 1) / (j + 1))));
		const mean_yi = jstat.mean(yi);
		const sum_squares = yi.reduce((acc, val) => acc + Math.pow(val - mean_yi, 2), 0);
		return {
			sn: Math.sqrt(sum_squares / n),
			yn: mean_yi,
		};
	};

	return {
		mediaAritmetica,
		desviacionStandar,
		logMediaAritmetica,
		logDesviacionStandar,
		log10MediaAritmetica,
		log10DesviacionStandar,
		cs,
		calculateAll,
		cleanAll,
		calculateSnYn, // Added for Gumbel distribution
	};
}