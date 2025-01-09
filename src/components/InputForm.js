import { useState } from "react";
import { calculateTemezModel } from "../utils/temez";
import Charts from './Charts';

export default function InputForm({ setResults }) {
    const [formData, setFormData] = useState({
        yearStart: 1,
        yearEnd: 1,
        basinArea: 4300,
        rainDays: 30,
        startMonth: "Enero",
        etpCoefficient: 1,
        exceedanceParam: 0.3,
        maxHumidity: 150,
        maxInfiltration: 100,
        initialSubFlow: 10,
        initialHumidity: 25,
        dischargeRate: 0.01,
        aquiferDischarge: 1,
        precipitationFile: null,
        etpFile: null,
        flowFile: null,
    });

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files[0],
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Leer archivos como texto
        const precipitationData = await formData.precipitationFile.text();
        const etpData = await formData.etpFile.text();
        const flowData = await formData.flowFile.text();

        // Calcular resultados
        const results = calculateTemezModel({
            yearStart: formData.yearStart,
            yearEnd: formData.yearEnd,
            basinArea: formData.basinArea,
            rainDays: formData.rainDays,
            startMonth: formData.startMonth,
            etpCoefficient: formData.etpCoefficient,
            exceedanceParam: formData.exceedanceParam,
            maxHumidity: formData.maxHumidity,
            maxInfiltration: formData.maxInfiltration,
            initialSubFlow: formData.initialSubFlow,
            initialHumidity: formData.initialHumidity,
            dischargeRate: formData.dischargeRate,
            aquiferDischarge: formData.aquiferDischarge,
            precipitationData,
            etpData,
            flowData,
        });

        setResults(results);
    };

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold text-gray-700 mb-6">Modelo Témez - Parámetros</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Parámetros generales */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Año Hidrológico Inicial:</label>
                        <input
                            type="number"
                            name="yearStart"
                            value={formData.yearStart}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Año Hidrológico Final:</label>
                        <input
                            type="number"
                            name="yearEnd"
                            value={formData.yearEnd}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Superficie de la Cuenca (km²):</label>
                        <input
                            type="number"
                            name="basinArea"
                            value={formData.basinArea}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Número de Días de Lluvia por Mes:</label>
                        <input
                            type="number"
                            name="rainDays"
                            value={formData.rainDays}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Mes de Inicio del Año Hidrológico:</label>
                        <select
                            name="startMonth"
                            value={formData.startMonth}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                            {["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"].map(
                                (month) => (
                                    <option key={month} value={month}>
                                        {month}
                                    </option>
                                )
                            )}
                        </select>
                    </div>
                </div>

                {/* Parámetros adicionales */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Coeficiente ETP:</label>
                        <input
                            type="number"
                            name="etpCoefficient"
                            value={formData.etpCoefficient}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Parámetro de Excedencia:</label>
                        <input
                            type="number"
                            name="exceedanceParam"
                            value={formData.exceedanceParam}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Humedad Máxima:</label>
                        <input
                            type="number"
                            name="maxHumidity"
                            value={formData.maxHumidity}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Infiltración Máxima:</label>
                        <input
                            type="number"
                            name="maxInfiltration"
                            value={formData.maxInfiltration}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Humedad Inicial:</label>
                        <input
                            type="number"
                            name="initialHumidity"
                            value={formData.initialHumidity}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Descarga del Acuífero:</label>
                        <input
                            type="number"
                            name="aquiferDischarge"
                            value={formData.aquiferDischarge}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Archivos de entrada */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Archivo de Precipitación:</label>
                        <input
                            type="file"
                            name="precipitationFile"
                            accept=".txt"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Archivo de ETP:</label>
                        <input
                            type="file"
                            name="etpFile"
                            accept=".txt"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Archivo de Caudales Observados:</label>
                        <input
                            type="file"
                            name="flowFile"
                            accept=".txt"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                    </div>
                </div>

                {/* Botón para calcular */}
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
                >
                    Calcular y Recalibrar
                </button>
            </form>
        </div>
    );
}
