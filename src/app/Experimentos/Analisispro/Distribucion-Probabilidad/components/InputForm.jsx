import React from 'react';

const InputForm = ({ onExample, onCalculate, option, setOption, inputType, setInputType, value, setValue }) => {
  const getLabelText = () => {
    if (option === 'A') {
      switch (inputType) {
        case 'caudal':
          return 'Ingrese el valor del caudal (m³/s)';
        case 'intensidad':
          return 'Ingrese el valor de la intensidad (mm/h)';
        case 'pmax24h':
          return 'Ingrese el valor de la precipitación (mm)';
        default:
          return '';
      }
    } else if (option === 'B') {
      return 'Ingrese el periodo de retorno (años)';
    }
    return '';
  };

  const getOptionText = (opt) => {
    switch (inputType) {
      case 'caudal':
        return opt === 'A' ? 'Dado el caudal, calcular el periodo de retorno' : 'Dado el periodo de retorno, calcular el caudal';
      case 'intensidad':
        return opt === 'A' ? 'Dado la intensidad, calcular el periodo de retorno' : 'Dado el periodo de retorno, calcular la intensidad';
      case 'pmax24h':
        return opt === 'A' ? 'Dado la precipitación, calcular el periodo de retorno' : 'Dado el periodo de retorno, calcular la precipitación';
      default:
        return '';
    }
  };

  return (
    <div className="p-6 bg-white border border-gray-300 rounded-lg shadow-lg max-w-lg mx-auto">
    {/* Selector de Tipo */}
    <div className="mb-4">
      <select 
        value={inputType} 
        onChange={(e) => setInputType(e.target.value)}
        className="w-full border p-2 rounded-lg"
      >
        <option value="caudal">Caudal</option>
        <option value="intensidad">Intensidad</option>
        <option value="pmax24h">P. Max. 24h</option>
      </select>
    </div>
  
    {/* Opciones de Radio */}
    <div className="mb-4 flex gap-4">
      <label className="flex items-center gap-2">
        <input 
          type="radio" 
          value="A" 
          checked={option === 'A'} 
          onChange={(e) => setOption(e.target.value)}
          className="accent-blue-500"
        />
        Opción A: {getOptionText('A')}
      </label>
      <label className="flex items-center gap-2">
        <input 
          type="radio" 
          value="B" 
          checked={option === 'B'} 
          onChange={(e) => setOption(e.target.value)}
          className="accent-blue-500"
        />
        Opción B: {getOptionText('B')}
      </label>
    </div>
  
    {/* Etiqueta e Input */}
    <div className="mb-4">
      <label className="block text-gray-700 font-medium mb-2">{getLabelText()}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full border p-2 rounded-lg"
      />
    </div>
  
    {/* Botones de Acción */}
    <div className="flex justify-between">
      <button 
        onClick={onExample} 
        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
      >
        EJEMPLO
      </button>
      <button 
        onClick={() => onCalculate(inputType, parseFloat(value))} 
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        EJECUTAR ANÁLISIS
      </button>
    </div>
  </div>
  
  );
};

export default InputForm;