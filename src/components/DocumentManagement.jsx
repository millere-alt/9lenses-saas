import React, { useState } from 'react';
import { FileText, FolderOpen, Upload, Search, Filter, Download, Eye, Trash2, Tag, Calendar, BarChart3 } from 'lucide-react';
import DocumentUpload from './DocumentUpload';
import { LENSES } from '../data/nineVectorsSchema';

const DocumentManagement = ({ documents: externalDocuments, onDocumentsUpdate }) => {
  const [documents, setDocuments] = useState(externalDocuments || []);
  const [selectedLens, setSelectedLens] = useState('all');
  const [selectedSubLens, setSelectedSubLens] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [documentType, setDocumentType] = useState('all');
  const [showUpload, setShowUpload] = useState(false);

  React.useEffect(() => {
    if (externalDocuments) {
      setDocuments(externalDocuments);
    }
  }, [externalDocuments]);

  const documentTypes = [
    { id: 'all', name: 'All Documents' },
    { id: 'financial', name: 'Financial Statements', icon: '💰' },
    { id: 'strategy', name: 'Strategy Documents', icon: '🎯' },
    { id: 'marketing', name: 'Marketing Plans', icon: '📊' },
    { id: 'operations', name: 'Operations Manuals', icon: '⚙️' },
    { id: 'contracts', name: 'Contracts & Legal', icon: '📝' },
    { id: 'reports', name: 'Reports & Analytics', icon: '📈' },
    { id: 'other', name: 'Other Documents', icon: '📄' }
  ];

  const handleUpload = (files) => {
    const newDocs = files.map(file => ({
      ...file,
      lens: selectedLens !== 'all' ? selectedLens : null,
      subLens: selectedSubLens !== 'all' ? selectedSubLens : null,
      documentType: documentType !== 'all' ? documentType : 'other',
      tags: [],
      correlations: []
    }));

    const updatedDocs = [...newDocs, ...documents];
    setDocuments(updatedDocs);
    if (onDocumentsUpdate) {
      onDocumentsUpdate(updatedDocs);
    }
    setShowUpload(false);
  };

  const deleteDocument = (docId) => {
    const updatedDocs = documents.filter(d => d.id !== docId);
    setDocuments(updatedDocs);
    if (onDocumentsUpdate) {
      onDocumentsUpdate(updatedDocs);
    }
  };

  const selectedLensData = LENSES.find(l => l.name === selectedLens);

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLens = selectedLens === 'all' || doc.lens === selectedLens;
    const matchesSubLens = selectedSubLens === 'all' || doc.subLens === selectedSubLens;
    const matchesType = documentType === 'all' || doc.documentType === documentType;

    return matchesSearch && matchesLens && matchesSubLens && matchesType;
  });

  const getDocumentTypeInfo = (type) => {
    return documentTypes.find(t => t.id === type) || documentTypes[0];
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto">

        {/* Filters and Upload Button */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Lens Filter */}
            <select
              value={selectedLens}
              onChange={(e) => {
                setSelectedLens(e.target.value);
                setSelectedSubLens('all');
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Lenses</option>
              {LENSES.map(lens => (
                <option key={lens.id} value={lens.name}>{lens.name}</option>
              ))}
            </select>

            {/* Sub-Lens Filter */}
            <select
              value={selectedSubLens}
              onChange={(e) => setSelectedSubLens(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={selectedLens === 'all'}
            >
              <option value="all">All Sub-Lenses</option>
              {selectedLensData?.subLenses.map(subLens => (
                <option key={subLens.id} value={subLens.name}>{subLens.name}</option>
              ))}
            </select>

            {/* Document Type Filter */}
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {documentTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.icon} {type.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowUpload(!showUpload)}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg flex items-center justify-center space-x-2"
          >
            <Upload className="w-5 h-5" />
            <span>{showUpload ? 'Hide Upload' : 'Upload New Documents'}</span>
          </button>
        </div>

        {/* Upload Section */}
        {showUpload && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <DocumentUpload
              onUpload={handleUpload}
              selectedLens={selectedLens !== 'all' ? selectedLens : null}
              selectedSubLens={selectedSubLens !== 'all' ? selectedSubLens : null}
            />
          </div>
        )}

        {/* Documents List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Documents ({filteredDocuments.length})
            </h2>
          </div>

          {filteredDocuments.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No documents found</p>
              <p className="text-gray-400 text-sm">Upload documents to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDocuments.map(doc => {
                const typeInfo = getDocumentTypeInfo(doc.documentType);
                const lensInfo = LENSES.find(l => l.name === doc.lens);

                return (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all hover:border-blue-300"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="text-3xl">{typeInfo.icon}</div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{doc.name}</h3>

                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(doc.uploadedAt)}
                          </span>

                          {doc.lens && (
                            <span
                              className="px-2 py-1 rounded text-xs font-medium"
                              style={{
                                backgroundColor: lensInfo?.color + '20',
                                color: lensInfo?.color
                              }}
                            >
                              {doc.lens}
                              {doc.subLens && ` → ${doc.subLens}`}
                            </span>
                          )}

                          <span className="text-gray-500">{typeInfo.name}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <Download className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => deleteDocument(doc.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentManagement;
