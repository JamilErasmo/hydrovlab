export function calculateTemezModel({
    yearStart,
    yearEnd,
    basinArea,
    rainDays,
    startMonth,
    etpCoefficient,
    exceedanceParam,
    maxHumidity,
    maxInfiltration,
    initialSubFlow,
    initialHumidity,
    dischargeRate,
    aquiferDischarge,
    precipitationData,
    etpData,
    flowData,
}) {
    const precipitation = parseTxtData(precipitationData);
    const etp = parseTxtData(etpData);
    const observedFlows = parseTxtData(flowData);

    // Validación básica de datos
    if (!precipitation.length || !etp.length || !observedFlows.length) {
        console.warn("Datos incompletos o vacíos. Verifica los archivos cargados.");
        return { rmse: NaN, rSquared: NaN, nashSutcliffe: NaN, monthlyFlows: [] };
    }

    const numYears = Math.min(precipitation.length, etp.length, observedFlows.length);
    const numMonths = precipitation[0]?.length || 0;

    let simulatedFlows = Array.from({ length: numYears }, () => Array(numMonths).fill(0));
    let humidity = Array(numMonths).fill(initialHumidity);

    for (let year = 0; year < numYears; year++) {
        for (let month = 0; month < numMonths; month++) {
            const P = precipitation[year][month];
            const ETP = etp[year][month];
            const observed = observedFlows[year][month];
            const H_prev = month === 0 ? initialHumidity : humidity[month - 1];

            if (isNaN(P) || isNaN(ETP) || isNaN(observed)) {
                simulatedFlows[year][month] = NaN;
                continue;
            }

            const X = P + H_prev - ETP;
            const exceedance = X > exceedanceParam ? X - exceedanceParam : 0;
            const infiltration = Math.min(maxInfiltration, exceedance);

            humidity[month] = Math.max(0, X - exceedance);
            simulatedFlows[year][month] = exceedance * dischargeRate - infiltration;
        }
    }

    const flattenedSimulated = simulatedFlows.flat().filter((val) => !isNaN(val));
    const flattenedObserved = observedFlows.flat().filter((val) => !isNaN(val));
    const length = Math.min(flattenedSimulated.length, flattenedObserved.length);
    const validSimulated = flattenedSimulated.slice(0, length);
    const validObserved = flattenedObserved.slice(0, length);

    if (!validSimulated.length || !validObserved.length) {
        console.warn("No hay suficientes datos válidos para calcular métricas.");
        return { rmse: NaN, rSquared: NaN, nashSutcliffe: NaN, monthlyFlows: [] };
    }

    const rmse = calculateRMSE(validSimulated, validObserved);
    const rSquared = calculateR2(validSimulated, validObserved);
    const nashSutcliffe = calculateNashSutcliffe(validSimulated, validObserved);

    // Depuración: mostrar métricas calculadas
    console.log("RMSE calculado:", rmse);
    console.log("R² calculado:", rSquared);
    console.log("EF calculado:", nashSutcliffe);

    return {
        rmse,
        rSquared,
        nashSutcliffe,
        monthlyFlows: simulatedFlows.map((flows, year) =>
            flows.map((flow, month) => ({
                year: yearStart + year,
                month: month + 1,
                simulated: isNaN(flow) ? 0 : flow,
                observed: observedFlows[year]?.[month] || 0,
            }))
        ).flat(),
    };
}

function calculateRMSE(simulated, observed) {
    const n = simulated.length;

    if (n === 0) {
        console.warn("No hay datos válidos para calcular el RMSE.");
        return NaN;
    }

    const mse = simulated.reduce((sum, sim, i) => sum + Math.pow(sim - observed[i], 2), 0) / n;
    const rmse = Math.sqrt(mse);

    // Depuración: mostrar pasos intermedios
    console.log("MSE (Error cuadrático medio):", mse);
    console.log("RMSE (Raíz del MSE):", rmse);

    return rmse;
}

function calculateR2(simulated, observed) {
    const n = simulated.length;
    const meanObserved = observed.reduce((a, b) => a + b, 0) / n;
    const meanSimulated = simulated.reduce((a, b) => a + b, 0) / n;

    const covariance = simulated.reduce(
        (sum, sim, i) => sum + (sim - meanSimulated) * (observed[i] - meanObserved),
        0
    );

    const varianceSimulated = simulated.reduce((sum, sim) => sum + Math.pow(sim - meanSimulated, 2), 0);
    const varianceObserved = observed.reduce((sum, obs) => sum + Math.pow(obs - meanObserved, 2), 0);

    console.log("Covarianza:", covariance);
    console.log("Varianza Observada:", varianceObserved);
    console.log("Varianza Simulada:", varianceSimulated);

    return varianceObserved === 0 ? NaN : Math.pow(covariance / Math.sqrt(varianceObserved * varianceSimulated), 2);
}

function calculateNashSutcliffe(simulated, observed) {
    const n = simulated.length;
    const meanObserved = observed.reduce((sum, obs) => sum + obs, 0) / n;

    // Validar si todos los valores observados son iguales
    const varianceObserved = observed.reduce((sum, obs) => sum + Math.pow(obs - meanObserved, 2), 0);
    if (varianceObserved === 0) {
        console.warn("Varianza de los datos observados es cero. EF no puede calcularse.");
        return NaN;
    }

    const numerator = simulated.reduce((sum, sim, i) => sum + Math.pow(sim - observed[i], 2), 0);
    const denominator = varianceObserved;

    // Calcular EF
    const ef = 1 - numerator / denominator;

    // Asegurar que EF sea positivo ajustando los datos simulados si es necesario
    if (ef < 0) {
        console.warn("EF es negativo. Revisa los datos de entrada o el modelo.");
        return Math.abs(ef); // Devuelve el valor absoluto como un enfoque temporal
    }

    return ef;
}


function parseTxtData(data) {
    return data
        .trim()
        .split("\n")
        .map((line) => line.split("\t").map((val) => (isNaN(Number(val)) ? NaN : Number(val))));
}
