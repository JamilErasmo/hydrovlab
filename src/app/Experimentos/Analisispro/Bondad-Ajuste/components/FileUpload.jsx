import React from 'react';

const FileUpload = ({ onFileSelected }) => {
	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file && file.type === 'text/plain') {
			const reader = new FileReader();
			reader.onload = (event) => {
				const text = event.target.result;
				onFileSelected(text.split('\n').map(Number).filter(n => !isNaN(n)));
			};
			reader.readAsText(file);
		} else {
			alert('Please select a .txt file');
		}
	};

	return (
		<input type="file" onChange={handleFileChange} accept=".txt" />
	);
};

export default FileUpload;