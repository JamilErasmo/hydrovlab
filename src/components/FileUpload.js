import React from 'react';

const FileUpload = ({ setPrecipData, setEvapoData, setCaudalData }) => {
    const handleFileChange = (event, setData) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = e.target.result
                .split('\n') // Divide las líneas
                .map((line) => line.split('\t')) // Divide las columnas por tabulaciones
                .filter((line) => line.length > 0 && !isNaN(parseFloat(line[5]))); // Asegura que haya datos válidos en la posición 5

            console.log('Datos cargados:', data); // Verifica que los datos cargados sean correctos
            setData(data);
        };
        reader.readAsText(file);
    };

    return (
        <div className="border p-4 rounded-lg mb-6">
            <h2 className="text-lg font-semibold mb-4">Cargar Archivos</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block mb-2 font-medium">Archivo de Precipitación</label>
                    <input type="file" onChange={(e) => handleFileChange(e, setPrecipData)} />
                </div>
                <div>
                    <label className="block mb-2 font-medium">Archivo de Evapotranspiración</label>
                    <input type="file" onChange={(e) => handleFileChange(e, setEvapoData)} />
                </div>
                <div>
                    <label className="block mb-2 font-medium">Archivo de Caudales</label>
                    <input type="file" onChange={(e) => handleFileChange(e, setCaudalData)} />
                </div>
            </div>
        </div>
    );
};

export default FileUpload;
