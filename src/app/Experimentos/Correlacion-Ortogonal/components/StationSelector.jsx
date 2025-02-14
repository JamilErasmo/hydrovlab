'use client';
import React, { useContext, useState } from 'react';
import { AppContext } from '../page';

function StationSelector() {
  const { stations, setSelectedStation } = useContext(AppContext);
  const [selected, setSelected] = useState(null);

  const handleChange = (e) => {
    setSelected(e.target.value);
    setSelectedStation(e.target.value);
  };

  return (
    <select
      onChange={handleChange}
      value={selected || ""}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
    >
      <option value="">Seleccionar Estación</option>
      {stations.map((station, index) => (
        <option key={index} value={station}>{station}</option>
      ))}
    </select>

  );
}

export default StationSelector;