import React, { useState, useCallback } from 'react';
import { Upload, X, File, FileText, DollarSign, TrendingUp, Briefcase, CheckCircle } from 'lucide-react';

const DocumentUpload = ({ onUpload, selectedLens = null, selectedSubLens = null }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, [selectedLens, selectedSubLens]);

  const handleFileInput = useCallback((e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  }, [selectedLens, selectedSubLens]);

  const handleFiles = (files) => {
    const processedFiles = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
      uploadedAt: new Date().toISOString(),
      lens: selectedLens,
      subLens: selectedSubLens,
      status: 'uploaded'
    }));

    setUploadedFiles(prev => [...prev, ...processedFiles]);

    if (onUpload) {
      onUpload(processedFiles);
    }
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    if (['pdf'].includes(ext)) return <FileText className="w-5 h-5 text-red-500" />;
    if (['doc', 'docx'].includes(ext)) return <FileText className="w-5 h-5 text-blue-500" />;
    if (['xls', 'xlsx', 'csv'].includes(ext)) return <DollarSign className="w-5 h-5 text-green-500" />;
    if (['ppt', 'pptx'].includes(ext)) return <TrendingUp className="w-5 h-5 text-blue-500" />;
    return <File className="w-5 h-5 text-gray-500" />;
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8
          transition-all duration-200 ease-in-out
          ${isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400 bg-white'
          }
        `}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.ppt,.pptx,.txt,.json"
        />

        <div className="text-center">
          <Upload className={`mx-auto w-12 h-12 mb-4 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
          <h3 className="text-lg font-semibold mb-2">
            {isDragging ? 'Drop files here' : 'Upload Documents'}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            Drag and drop files or click to browse
          </p>
          <p className="text-xs text-gray-500">
            Supported: PDF, Word, Excel, PowerPoint, CSV, TXT, JSON
          </p>

          {selectedLens && (
            <div className="mt-4 inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm">
              <Briefcase className="w-4 h-4 inline mr-2" />
              {selectedLens}{selectedSubLens && ` → ${selectedSubLens}`}
            </div>
          )}
        </div>
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-700 mb-3">Uploaded Files ({uploadedFiles.length})</h4>
          {uploadedFiles.map(file => (
            <div
              key={file.id}
              className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-3 flex-1">
                {getFileIcon(file.name)}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{file.name}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>{formatFileSize(file.size)}</span>
                    {file.lens && (
                      <span className="text-blue-600">
                        {file.lens}{file.subLens && ` → ${file.subLens}`}
                      </span>
                    )}
                  </div>
                </div>
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              </div>

              <button
                onClick={() => removeFile(file.id)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
