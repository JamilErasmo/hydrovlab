'use client';

import React, { useEffect, useState } from "react";
import FileUploader from "./components/FileUploader";
import InputForm from "./components/InputForm";
import ResultsTable from "./components/ResultsTable";
import useAnalisisProbabilistico from "./context/useAnalisisProbabilistico";
import {
  calculateGumbel,
  calculateLogNormalDistribution,
  calculateLogPearsonIII,
  calculateNormalDistribution,
  calculatePearsonIII
} from "./functions/FuncionesProbabilidad";
import { calculateGumbelInv, calculateLogNormalDistributionInv, calculateLogPearsonIIIInv, calculateNormalDistributionInv, calculatePearsonIIIInv } from "./functions/FuncionesProbabilidadInv";

const DistribucionProbabilidad = () => {
  const [results, setResults] = useState([]);
  const [data, setData] = useState([NaN]);
  const [value, setValue] = useState(7500);
  const [option, setOption] = useState('A'); // 'A' or 'B'
  const [inputType, setInputType] = useState('caudal');
  const {
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
  } = useAnalisisProbabilistico(data);

  useEffect(() => {
    cleanAll();
    setValue(option === 'A' ? 7500 : 60);
    setResults([]);
    setData([NaN]);

  }, [option]);

  useEffect(() => {
    if (data.length <= 0) {
      setData([NaN]);
      return;
    }
    calculateAll();
    handleCalculate(inputType, value);

  }, [data]);

  const formatResult = (methodName, { probability, returnPeriod, value, params }) => ({
    method: methodName,
    probability: probability?.toFixed(4),
    returnPeriod: returnPeriod?.toFixed(1),
    value: value?.toFixed(4),
    params: params,
  });

  const handleCalculate = (inputType, inputValue) => {
    setInputType(inputType);
    setValue(inputValue);

    let newResults = [];
    if (option === 'A') {
      newResults = [
        calculateNormalDistribution(inputValue, mediaAritmetica, desviacionStandar),
        calculateLogNormalDistribution(inputValue, logMediaAritmetica, logDesviacionStandar),
        calculatePearsonIII(inputValue, data, mediaAritmetica, desviacionStandar),
        calculateLogPearsonIII(inputValue, log10MediaAritmetica, log10DesviacionStandar, cs),
        calculateGumbel(inputValue, mediaAritmetica, desviacionStandar, calculateSnYn),
      ];
    } else if (option === 'B') {
      newResults = [
        calculateNormalDistributionInv(inputValue, mediaAritmetica, desviacionStandar),
        calculateLogNormalDistributionInv(inputValue, logMediaAritmetica, logDesviacionStandar),
        calculatePearsonIIIInv(inputValue, data, mediaAritmetica, desviacionStandar),
        calculateLogPearsonIIIInv(inputValue, log10MediaAritmetica, log10DesviacionStandar, cs),
        calculateGumbelInv(inputValue, mediaAritmetica, desviacionStandar, calculateSnYn),
      ];
    }

    const formattedResults = newResults
      .map((result, index) =>
        formatResult(
          ["Normal", "Log-Normal", "Pearson III", "Log-Pearson III", "Gumbel"][index],
          result || {
            method: NaN,
            probability: NaN,
            returnPeriod: NaN,
            value: NaN,
            params: NaN,
          }
        )
      );

    setResults(formattedResults);
  };

  const handleClean = () => {
    cleanAll();
    setResults([]);
    setData([NaN]);
    setOption('A');
    setValue(7500);
  };

  const handleExampleClick = () => {
    const exampleData = [
      2230, 3220, 2246, 1804, 2737, 2070, 3682, 4240, 2367, 7061, 2489, 2350,
      3706, 2675, 6267, 5971, 4744, 6000, 4060, 6900, 5565, 3130, 2414, 1796,
      7430,
    ];

    setData(exampleData);
  };

  const renderExampleData = () => (
    <div>
      {data.map((item, index) => (
        <span key={index}>
          {item}
          {index < data.length - 1 ? ", " : ""}
        </span>
      ))}
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">

      <h1 className="text-2xl font-bold text-center mb-6 uppercase text-blue-600">
        Funciones de Distribución de Probabilidad
      </h1>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        <div className="p-3 bg-white border border-gray-200 rounded-lg shadow-md">
          <FileUploader onUpload={setData} />
        </div>


        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md">
          <InputForm
            onExample={handleExampleClick}
            onCalculate={handleCalculate}
            option={option}
            setOption={setOption}
            inputType={inputType}
            setInputType={setInputType}
            value={value}
            setValue={setValue}
          />
        </div>
      </div>

      <div className="py-4">
        <div className="flex items-center gap-4 py mb-6 bg-gray-100 border border-gray-300 rounded-lg p-4 shadow-md">
          <h3 className="text-lg font-semibold text-gray-800">📊 Datos:</h3>
          <div className="overflow-x-auto">
            {data.length > 0 ? renderExampleData() : <span className="text-gray-500">No hay datos cargados</span>}
          </div>
        </div>
      </div>


      <ResultsTable
        isData={data.length > 0 && !isNaN(data[0])}
        results={results}
        onClean={handleClean}
        option={option} // Pasar opción para cambiar los encabezados de la tabla
      />
    </div>

  );
};

export default DistribucionProbabilidad;