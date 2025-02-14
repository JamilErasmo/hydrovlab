import React, { useContext, useState } from 'react';
import { AppContext } from '../page';

function FileUpload() {
  const { handleFileUpload } = useContext(AppContext);
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadFile = () => {
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
<div className="bg-white p-6 rounded-lg shadow-md border border-gray-300 flex flex-col items-center space-y-4">
  <input
    type="file"
    onChange={handleFileChange}
    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
  />
  <button
    onClick={uploadFile}
    className="px-5 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
  >
    Subir Archivo
  </button>
</div>

  );
}

export default FileUpload;