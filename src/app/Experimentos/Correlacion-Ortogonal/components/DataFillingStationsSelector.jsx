import React, { useState } from 'react';

const DataFillingStationsSelector = ({ stations, onSelect }) => {
  const [selectedStations, setSelectedStations] = useState([]);

  const handleStationSelect = (station) => {
    let newSelected = [...selectedStations];
    if (selectedStations.includes(station)) {
      newSelected = newSelected.filter(s => s !== station);
    } else {
      newSelected.push(station);
    }
    setSelectedStations(newSelected);
    onSelect(newSelected); // Notify parent component of changes
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Selección de Estaciones para el Relleno de Datos
      </h3>
      <ul className="space-y-2">
        {stations.map(station => (
          <li key={station} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedStations.includes(station)}
              onChange={() => handleStationSelect(station)}
              className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="text-gray-700 font-medium">{station}</label>
          </li>
        ))}
      </ul>
    </div>

  );
};

export default DataFillingStationsSelector;