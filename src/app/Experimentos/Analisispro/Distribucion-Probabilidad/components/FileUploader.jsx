import React from 'react';

const FileUploader = ({ onUpload }) => {

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileContent = event.target.result.split('\n').map(Number);
        onUpload(fileContent);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="bg-white/60 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-lg p-6 max-w-lg mx-auto hover:shadow-xl transition-all">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">📂 Datos de Entrada</h2>

      <label className="block text-gray-700 font-medium mb-3 text-lg">
        Ruta del Archivo:
        <input
          type="file"
          onChange={handleFileChange}
          className="mt-3 block w-full text-gray-900 border border-gray-300 rounded-lg cursor-pointer
                 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-none
                 file:bg-gradient-to-r file:from-blue-500 file:to-indigo-500 
                 file:text-white hover:file:opacity-80 transition-all"
        />
      </label>
    </div>


  );
};

export default FileUploader;