import React, { useState } from 'react';
import { Upload, FileText, Users, Database, Link as LinkIcon, CheckCircle, AlertCircle, Loader, X, Plus } from 'lucide-react';
import PageInstructions from './PageInstructions';

const DataSourceManager = () => {
  const [dataSources, setDataSources] = useState([]);
  const [uploadingFiles, setUploadingFiles] = useState({});

  // Data source types
  const sourceTypes = [
    {
      id: 'document',
      name: 'Documents',
      icon: FileText,
      description: 'Upload PDFs, Word docs, spreadsheets',
      color: 'from-primary-500 to-primary-600',
      accepts: '.pdf,.doc,.docx,.xls,.xlsx,.csv',
      examples: ['Financial statements', 'Strategic plans', 'HR reports', 'Customer surveys']
    },
    {
      id: 'survey',
      name: 'Survey Responses',
      icon: Users,
      description: 'Collect input from team members',
      color: 'from-orange-500 to-orange-600',
      examples: ['Employee assessments', 'Customer feedback', 'Board input', 'Stakeholder surveys']
    },
    {
      id: 'database',
      name: 'Database Connection',
      icon: Database,
      description: 'Connect to existing data systems',
      color: 'from-secondary-500 to-secondary-600',
      examples: ['CRM data', 'ERP systems', 'Analytics platforms', 'Financial databases']
    },
    {
      id: 'api',
      name: 'API Integration',
      icon: LinkIcon,
      description: 'Pull data from external APIs',
      color: 'from-purple-500 to-purple-600',
      examples: ['Salesforce', 'QuickBooks', 'Google Analytics', 'HubSpot']
    }
  ];

  // Lens mapping for documents
  const lensMapping = [
    { lens: 'Market', sublenses: ['Market Characteristics', 'Competition', 'Customer', 'Positioning', 'Timing'], color: 'primary' },
    { lens: 'People', sublenses: ['Employee Characteristics', 'Culture', 'Leadership', 'Organizational Design'], color: 'primary' },
    { lens: 'Finance', sublenses: ['Accounting', 'Capital Structure', 'Financial Model', 'Forecasting', 'Historical Performance'], color: 'primary' },
    { lens: 'Strategy', sublenses: ['Delivery Outlets', 'General Strategy', 'Offerings', 'Pricing', 'Promotion'], color: 'orange' },
    { lens: 'Operations', sublenses: ['General Operations', 'Infrastructure', 'Processes', 'Systems'], color: 'orange' },
    { lens: 'Execution', sublenses: ['Measurement', 'Performance Tracking'], color: 'orange' },
    { lens: 'Expectation', sublenses: ['Stakeholder Management', 'Communication', 'Alignment'], color: 'secondary' },
    { lens: 'Governance', sublenses: ['Principles', 'Structure', 'Practices'], color: 'secondary' },
    { lens: 'Entity', sublenses: ['Entity Characteristics', 'Contracts', 'Intellectual Property', 'Liability and Risk'], color: 'secondary' }
  ];

  const handleFileUpload = async (sourceType, files) => {
    const fileArray = Array.from(files);
    const uploadId = Date.now();

    setUploadingFiles(prev => ({ ...prev, [uploadId]: { files: fileArray, progress: 0, status: 'uploading' } }));

    // Simulate upload and AI processing
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setUploadingFiles(prev => ({
        ...prev,
        [uploadId]: { ...prev[uploadId], progress: i }
      }));
    }

    // Add to data sources
    const newSources = fileArray.map(file => ({
      id: `${uploadId}-${file.name}`,
      type: sourceType,
      name: file.name,
      size: file.size,
      uploadedAt: new Date(),
      status: 'processed',
      mappedLenses: [], // Will be filled by AI
      confidence: Math.random() * 0.3 + 0.7 // 70-100% confidence
    }));

    setDataSources(prev => [...prev, ...newSources]);
    setUploadingFiles(prev => {
      const updated = { ...prev };
      delete updated[uploadId];
      return updated;
    });
  };

  const removeDataSource = (sourceId) => {
    setDataSources(prev => prev.filter(s => s.id !== sourceId));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-5xl font-display font-bold bg-gradient-to-r from-primary-600 via-secondary-600 to-orange-600 bg-clip-text text-transparent mb-3">
          Data Source Manager
        </h1>
        <p className="text-lg text-neutral-600 mb-4">
          Gather insights from multiple sources - documents, surveys, databases, and APIs
        </p>

        {/* Quick Guide */}
        <div className="bg-gradient-to-r from-secondary-50 to-primary-50 border-l-4 border-secondary-500 rounded-lg p-4 max-w-4xl">
          <div className="flex items-start gap-3">
            <Upload className="w-5 h-5 text-secondary-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-secondary-900 mb-1">How It Works:</h3>
              <p className="text-sm text-secondary-800">
                <span className="font-semibold">1.</span> Choose a data source type
                <span className="mx-2">•</span>
                <span className="font-semibold">2.</span> Upload files or connect systems
                <span className="mx-2">•</span>
                <span className="font-semibold">3.</span> AI automatically maps data to the right lenses
                <span className="mx-2">•</span>
                <span className="font-semibold">4.</span> Review and adjust if needed
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Source Types */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sourceTypes.map(source => {
          const Icon = source.icon;
          return (
            <div key={source.id} className="group">
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all border-2 border-neutral-200 hover:border-primary-300">
                <div className={`w-14 h-14 bg-gradient-to-br ${source.color} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-xl font-bold text-neutral-900 mb-2">{source.name}</h3>
                <p className="text-sm text-neutral-600 mb-4">{source.description}</p>

                {source.id === 'document' ? (
                  <label className="block">
                    <input
                      type="file"
                      multiple
                      accept={source.accepts}
                      onChange={(e) => handleFileUpload(source.id, e.target.files)}
                      className="hidden"
                    />
                    <div className={`cursor-pointer px-4 py-2 bg-gradient-to-r ${source.color} text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all text-center`}>
                      Upload Files
                    </div>
                  </label>
                ) : (
                  <button className={`w-full px-4 py-2 bg-gradient-to-r ${source.color} text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all`}>
                    Connect
                  </button>
                )}

                {/* Examples */}
                <div className="mt-4 pt-4 border-t border-neutral-200">
                  <p className="text-xs font-semibold text-neutral-500 mb-2">Examples:</p>
                  <div className="flex flex-wrap gap-1">
                    {source.examples.slice(0, 2).map((example, idx) => (
                      <span key={idx} className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded">
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Uploading Files */}
      {Object.keys(uploadingFiles).length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-secondary-200">
          <h3 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
            <Loader className="w-5 h-5 animate-spin text-secondary-600" />
            Processing Files...
          </h3>
          {Object.entries(uploadingFiles).map(([id, upload]) => (
            <div key={id} className="space-y-2 mb-4">
              {upload.files.map((file, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-neutral-700">{file.name}</span>
                    <span className="text-sm text-neutral-500">{upload.progress}%</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${upload.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Connected Data Sources */}
      {dataSources.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-neutral-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-primary-600" />
              Connected Data Sources ({dataSources.length})
            </h3>
          </div>

          <div className="space-y-3">
            {dataSources.map(source => (
              <div key={source.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-neutral-900">{source.name}</p>
                    <p className="text-sm text-neutral-600">
                      {formatFileSize(source.size)} • Uploaded {source.uploadedAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-semibold">
                      {Math.round(source.confidence * 100)}% confidence
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Processed
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => removeDataSource(source.id)}
                  className="ml-4 p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Lens Mapping Preview */}
      {dataSources.length > 0 && (
        <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-6 border-2 border-primary-200">
          <h3 className="text-xl font-bold text-neutral-900 mb-4">AI Lens Mapping Preview</h3>
          <p className="text-sm text-neutral-600 mb-4">
            Our AI has analyzed your data sources and mapped them to the following lenses:
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            {lensMapping.map(lens => (
              <div key={lens.lens} className={`bg-white rounded-lg p-4 border-2 border-${lens.color}-200`}>
                <h4 className={`font-bold text-${lens.color}-900 mb-2`}>{lens.lens}</h4>
                <div className="space-y-1">
                  {lens.sublenses.slice(0, 3).map((sublens, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-neutral-600">
                      <div className={`w-2 h-2 rounded-full bg-${lens.color}-500`}></div>
                      <span>{sublens}</span>
                    </div>
                  ))}
                  {lens.sublenses.length > 3 && (
                    <p className="text-xs text-neutral-500 ml-4">+{lens.sublenses.length - 3} more</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Help Instructions */}
      <PageInstructions
        title="Data Source Manager Guide"
        steps={[
          "Choose the type of data source you want to add (Documents, Surveys, Database, or API)",
          "For documents: Click 'Upload Files' and select your files (PDFs, Word docs, spreadsheets, etc.)",
          "For surveys: Click 'Connect' to set up participant surveys",
          "For databases/APIs: Click 'Connect' and follow the integration wizard",
          "Our AI automatically analyzes and maps your data to the appropriate lenses and sublenses",
          "Review the AI mapping and adjust if needed",
          "Data from all sources is combined with expert-weighted participant input for comprehensive analysis"
        ]}
        tips={[
          "Upload multiple files at once - AI processes them in parallel",
          "Financial documents automatically map to Finance lens, strategic plans to Strategy, etc.",
          "AI confidence scores show how certain we are about the mapping (aim for 80%+)",
          "You can combine document data with survey responses for richer insights",
          "Experts in each lens/sublens will review and validate AI mappings",
          "All data is encrypted and stored securely"
        ]}
      />
    </div>
  );
};

export default DataSourceManager;
