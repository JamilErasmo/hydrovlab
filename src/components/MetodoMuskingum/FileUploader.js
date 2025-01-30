const FileUploader = ({ onDataLoad }) => {
    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (!file) return;
  
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        const parsedData = content
          .split('\n')
          .filter((line) => line.trim())
          .map((line) => {
            const [Qe, Qs] = line.split('\t').map(Number);
            return { Qe, Qs, Tiempo: null, S: 0, X1: 0, X2: 0, X3: 0, X4: 0 };
          });
        onDataLoad(parsedData);
      };
      reader.readAsText(file);
    };
  
    return (
      <div>
        <input type="file" accept=".txt" onChange={handleFileUpload} />
      </div>
    );
  };
  
  export default FileUploader;
  