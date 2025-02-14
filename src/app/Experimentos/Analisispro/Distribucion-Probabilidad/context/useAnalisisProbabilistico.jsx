import jstat from "jstat";
import { useEffect, useState, useCallback } from "react";

export default function useAnalisisProbabilistico(data) {
	const [mediaAritmetica, setMediaAritmetica] = useState(null);
	const [desviacionStandar, setDesviacionStandar] = useState(null);
	const [logMediaAritmetica, setLogMediaAritmetica] = useState(null);
	const [logDesviacionStandar, setLogDesviacionStandar] = useState(null);
	const [log10MediaAritmetica, setLog10MediaAritmetica] = useState(null);
	const [log10DesviacionStandar, setLog10DesviacionStandar] = useState(null);
	const [cs, setCs] = useState(null);

	// Calcular media aritmética y desviación estándar
	const calMediaDesvi = useCallback(() => {
		if (data.length === 0) return;
		setMediaAritmetica(jstat.mean(data));
		setDesviacionStandar(jstat.stdev(data, true)); // true para desviación estándar poblacional
	}, [data]);

	// Calcular media y desviación estándar en logaritmo natural
	const logCalMediaDesvi = useCallback(() => {
		if (data.length === 0) return;
		const logData = data.map(Math.log);
		const logMediaAritmetica = jstat.mean(logData);
		const logDesviacionStandar = jstat.stdev(logData, true);

		setLogMediaAritmetica(logMediaAritmetica);
		setLogDesviacionStandar(logDesviacionStandar);
	}, [data]);

	// Calcular media y desviación estándar en logaritmo base 10
	const log10CalMediaDesvi = useCallback(() => {
		if (data.length === 0) return;
		const log10Data = data.map(Math.log10);
		const log10MediaAritmetica = jstat.mean(log10Data);
		const log10DesviacionStandar = jstat.stdev(log10Data, true);

		// Calcular asimetría (Cs)
		const n = data.length - 1;
		const cs = data.reduce((sum, value) => {
			const term = (Math.log10(value) - log10MediaAritmetica) / log10DesviacionStandar;
			return sum + Math.pow(term, 3);
		}, 0) * ((n + 1) / (n * (n - 1)));

		setLog10MediaAritmetica(log10MediaAritmetica);
		setLog10DesviacionStandar(log10DesviacionStandar);
		setCs(cs);
	}, [data]);

	// Ejecutar todos los cálculos
	const calculateAll = useCallback(() => {
		calMediaDesvi();
		logCalMediaDesvi();
		log10CalMediaDesvi();
	}, [calMediaDesvi, logCalMediaDesvi, log10CalMediaDesvi]);

	// Limpiar todos los valores
	const cleanAll = useCallback(() => {
		setMediaAritmetica(null);
		setDesviacionStandar(null);
		setLogMediaAritmetica(null);
		setLogDesviacionStandar(null);
		setLog10MediaAritmetica(null);
		setLog10DesviacionStandar(null);
		setCs(null);
	}, []);

	// Calcular Sn y Yn para la distribución de Gumbel
	const calculateSnYn = useCallback(() => {
		const n = data.length;
		if (n === 0) return { sn: 0, yn: 0 };

		const yi = data.map((_, j) => -Math.log(Math.log((n + 1) / (j + 1))));
		const mean_yi = jstat.mean(yi);
		const sum_squares = yi.reduce((acc, val) => acc + Math.pow(val - mean_yi, 2), 0);

		return {
			sn: Math.sqrt(sum_squares / n),
			yn: mean_yi,
		};
	}, [data]);

	// Ejecutar cálculos cuando `data` cambie
	useEffect(() => {
		calculateAll();
	}, [calculateAll]);

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
		calculateSnYn,
	};
}
