import React, { useState } from 'react';
import { X, Download, Share2, Tag, FileText, Image as ImageIcon, Code, File } from 'lucide-react';
import { LENSES } from '../data/nineLensesSchema';

const DocumentViewer = ({ document, onClose, onUpdateTags }) => {
  const [tags, setTags] = useState(document?.tags || []);
  const [newTag, setNewTag] = useState('');

  if (!document) return null;

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()];
      setTags(updatedTags);
      if (onUpdateTags) {
        onUpdateTags(document.id, updatedTags);
      }
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    const updatedTags = tags.filter(t => t !== tagToRemove);
    setTags(updatedTags);
    if (onUpdateTags) {
      onUpdateTags(document.id, updatedTags);
    }
  };

  const getFilePreview = () => {
    const ext = document.name.split('.').pop().toLowerCase();

    // PDF Preview
    if (ext === 'pdf') {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-red-50">
          <FileText className="w-24 h-24 text-red-500 mb-4" />
          <p className="text-gray-700 font-semibold mb-2">PDF Document</p>
          <p className="text-gray-500 text-sm mb-4">Preview not available</p>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Download to View</span>
          </button>
        </div>
      );
    }

    // Excel/CSV Preview
    if (['xls', 'xlsx', 'csv'].includes(ext)) {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-green-50">
          <Code className="w-24 h-24 text-green-600 mb-4" />
          <p className="text-gray-700 font-semibold mb-2">Spreadsheet</p>
          <p className="text-gray-500 text-sm mb-4">Preview shows sample data</p>
          <div className="bg-white p-4 rounded-lg shadow-md max-w-2xl overflow-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Product Line</th>
                  <th className="border border-gray-300 px-4 py-2">Revenue</th>
                  <th className="border border-gray-300 px-4 py-2">Margin</th>
                  <th className="border border-gray-300 px-4 py-2">Growth</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Product A</td>
                  <td className="border border-gray-300 px-4 py-2">$1.2M</td>
                  <td className="border border-gray-300 px-4 py-2">35%</td>
                  <td className="border border-gray-300 px-4 py-2">+12%</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Product B</td>
                  <td className="border border-gray-300 px-4 py-2">$890K</td>
                  <td className="border border-gray-300 px-4 py-2">28%</td>
                  <td className="border border-gray-300 px-4 py-2">+8%</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Product C</td>
                  <td className="border border-gray-300 px-4 py-2">$650K</td>
                  <td className="border border-gray-300 px-4 py-2">22%</td>
                  <td className="border border-gray-300 px-4 py-2">-3%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // Word/Text Preview
    if (['doc', 'docx', 'txt'].includes(ext)) {
      return (
        <div className="p-8 bg-white h-full overflow-auto">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-gray-900">
              {document.name.replace(/\.[^/.]+$/, '')}
            </h1>

            <div className="prose prose-lg">
              <p className="text-gray-700 leading-relaxed mb-4">
                This is a preview of the document content. In a production environment, this would display
                the actual parsed content from the uploaded file.
              </p>

              {document.documentType === 'strategy' && (
                <>
                  <h2 className="text-2xl font-bold mt-8 mb-4">Executive Summary</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Strategic overview and key initiatives for the upcoming fiscal period, aligned with
                    organizational objectives and market opportunities.
                  </p>

                  <h2 className="text-2xl font-bold mt-8 mb-4">Strategic Objectives</h2>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li>Expand market share in key segments</li>
                    <li>Launch innovative product lines</li>
                    <li>Optimize operational efficiency</li>
                    <li>Strengthen competitive positioning</li>
                  </ul>
                </>
              )}

              {document.documentType === 'marketing' && (
                <>
                  <h2 className="text-2xl font-bold mt-8 mb-4">Marketing Strategy Overview</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Comprehensive marketing plan including digital campaigns, content strategy, and
                    customer acquisition initiatives.
                  </p>

                  <h2 className="text-2xl font-bold mt-8 mb-4">Budget Allocation</h2>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li>Digital Advertising: 40%</li>
                    <li>Content Marketing: 25%</li>
                    <li>Events & Sponsorships: 20%</li>
                    <li>Brand Development: 15%</li>
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>
      );
    }

    // Default Preview
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50">
        <File className="w-24 h-24 text-gray-400 mb-4" />
        <p className="text-gray-700 font-semibold mb-2">{document.name}</p>
        <p className="text-gray-500 text-sm">Preview not available for this file type</p>
      </div>
    );
  };

  const lensInfo = LENSES.find(l => l.name === document.lens);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-6xl w-full h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-gray-900 truncate">{document.name}</h2>
            <div className="flex items-center space-x-3 mt-2">
              {document.lens && (
                <span
                  className="px-3 py-1 rounded-lg text-sm font-medium"
                  style={{
                    backgroundColor: lensInfo?.color + '20',
                    color: lensInfo?.color
                  }}
                >
                  {document.lens}
                  {document.subLens && ` → ${document.subLens}`}
                </span>
              )}
              <span className="text-sm text-gray-600">{document.documentType}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 ml-4">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {getFilePreview()}
        </div>

        {/* Footer - Tags */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-start space-x-4">
            <Tag className="w-5 h-5 text-gray-600 mt-1" />

            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-2 hover:text-blue-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  placeholder="Add tag..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={addTag}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Tag
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;
