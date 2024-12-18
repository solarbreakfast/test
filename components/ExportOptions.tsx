import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { Button } from './common/Button';
import { ExportDialog } from './export/ExportDialog';
import { ExportFormat, ExportQuality } from '../types/export';

interface ExportOptionsProps {
  onExport: (format: ExportFormat, quality: ExportQuality, filename: string) => void;
  currentFilename?: string;
}

export const ExportOptions: React.FC<ExportOptionsProps> = ({ onExport, currentFilename }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: ExportFormat, quality: ExportQuality, filename: string) => {
    try {
      setIsExporting(true);
      await onExport(format, quality, filename);
      setIsOpen(false);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <Button
        variant="icon"
        size="md"
        onClick={() => setIsOpen(true)}
        title="Export Audio"
      >
        <Save size={20} className="sm:w-6 sm:h-6" />
      </Button>

      <ExportDialog
        isOpen={isOpen}
        onClose={() => !isExporting && setIsOpen(false)}
        onExport={handleExport}
        currentFilename={currentFilename}
        isExporting={isExporting}
      />
    </>
  );
};