import React, { useState } from 'react';
import { Download, FileText, Table } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ExportButton = ({ data, type, filename, onExport }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleExport = async (format) => {
    setIsExporting(true);
    setShowMenu(false);

    try {
      if (onExport) {
        await onExport(format);
      }
      toast.success(`Exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Export failed');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={isExporting}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Download className="w-4 h-4" />
        {isExporting ? 'Exporting...' : 'Export'}
      </button>

      {showMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
          <button
            onClick={() => handleExport('pdf')}
            className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3 transition-colors"
          >
            <FileText className="w-4 h-4 text-blue-600" />
            <span className="text-gray-700">Export as PDF</span>
          </button>
          <button
            onClick={() => handleExport('excel')}
            className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3 transition-colors"
          >
            <Table className="w-4 h-4 text-green-600" />
            <span className="text-gray-700">Export as Excel</span>
          </button>
        </div>
      )}

      {showMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
};

export default ExportButton;
