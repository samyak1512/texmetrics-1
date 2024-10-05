import React, { useState } from 'react';
import axios from 'axios';

const DocumentUpload = ({ userId }) => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [results, setResults] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('document', file);
    formData.append('userId', userId);

    try {
      setUploadStatus('Uploading...');
      const response = await axios.post('http://localhost:5000/api/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUploadStatus('Processing...');
      checkResults(response.data.filename);
    } catch (error) {
      console.error('Error uploading document:', error);
      setUploadStatus('Upload failed');
    }
  };

  const checkResults = async (filename) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/documents/check-results/${userId}/${filename}`);
      if (response.data.status === 'processing') {
        setTimeout(() => checkResults(filename), 5000); // Check again after 5 seconds
      } else if (response.data.status === 'completed') {
        setResults(response.data);
        setUploadStatus('Processing complete');
      }
    } catch (error) {
      console.error('Error fetching results:', error);
      setUploadStatus('Processing failed');
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="file" 
          onChange={handleFileChange} 
          accept=".pdf"
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-violet-50 file:text-violet-700
            hover:file:bg-violet-100"
        />
        <button 
          type="submit" 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Upload Document
        </button>
      </form>
      {uploadStatus && <p>{uploadStatus}</p>}
      {results && (
        <div>
          <h2 className="text-xl font-bold">Results:</h2>
          <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(results, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;