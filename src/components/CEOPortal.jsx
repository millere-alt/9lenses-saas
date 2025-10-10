import React, { useState } from 'react';
import { Upload, File, Folder, X, Check } from 'lucide-react';

function CEOPortal() {
  const [uploadedFiles, setUploadedFiles] = useState([
    { name: 'Financial Report Q4 2024.pdf', size: '2.4 MB', category: 'Financial', date: '2024-12-15' },
    { name: 'Strategic Plan 2025.docx', size: '856 KB', category: 'Strategy', date: '2024-12-10' },
    { name: 'Team Structure Chart.xlsx', size: '124 KB', category: 'People', date: '2024-12-05' },
  ]);

  const categories = [
    'Market',
    'People',
    'Financial',
    'Strategy',
    'Operations',
    'Execution',
    'Expectations',
    'Governance',
    'Entity',
  ];

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newFiles = files.map((file) => ({
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      category: 'Uncategorized',
      date: new Date().toISOString().split('T')[0],
    }));
    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  const handleRemoveFile = (index) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Upload Files</h1>
        <p className="text-gray-600 mt-1">Upload and organize documents by lens category</p>
      </div>

      {/* Upload Area */}
      <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12">
        <div className="text-center">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Files</h3>
          <p className="text-gray-600 mb-6">Drag and drop files here, or click to browse</p>
          <label className="inline-block">
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
            <span className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 cursor-pointer inline-block">
              Choose Files
            </span>
          </label>
        </div>
      </div>

      {/* Category Folders */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((category) => {
            const fileCount = uploadedFiles.filter((f) => f.category === category).length;
            return (
              <div
                key={category}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Folder className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-900">{category}</p>
                    <p className="text-sm text-gray-500">{fileCount} files</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Uploaded Files */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Uploads</h2>
        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
          {uploadedFiles.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No files uploaded yet
            </div>
          ) : (
            uploadedFiles.map((file, index) => (
              <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <File className="w-8 h-8 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {file.size} • {file.category} • {file.date}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default CEOPortal;
