import React, { useEffect, useRef } from 'react';
import { X, Settings } from 'lucide-react';
import { ExportFormat, ExportQuality } from '../../types/export';
import { EXPORT_FORMATS, EXPORT_QUALITIES } from '../../constants/export';
import { Button } from '../common/Button';
import { Checkbox } from '../common/Checkbox';
import { useClickOutside } from '../../hooks/useClickOutside';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: ExportFormat, quality: ExportQuality, filename: string) => void;
  currentFilename?: string;
  isExporting: boolean;
}

export const ExportDialog: React.FC<ExportDialogProps> = ({
  isOpen,
  onClose,
  onExport,
  currentFilename,
  isExporting
}) => {
  const [selectedFormat, setSelectedFormat] = React.useState<ExportFormat>(EXPORT_FORMATS[0]);
  const [selectedQuality, setSelectedQuality] = React.useState<ExportQuality>(EXPORT_QUALITIES[0]);
  const [filename, setFilename] = React.useState('');
  const [includeEchoTail, setIncludeEchoTail] = React.useState(true);
  const [normalizeAudio, setNormalizeAudio] = React.useState(true);
  
  const dialogRef = useRef<HTMLDivElement>(null);
  const initialFocusRef = useRef<HTMLButtonElement>(null);

  useClickOutside(dialogRef, () => {
    if (!isExporting) {
      onClose();
    }
  });

  const { handleKeyDown } = useKeyboardNavigation({
    onClose: () => !isExporting && onClose(),
    initialFocusRef
  });

  useEffect(() => {
    if (isOpen) {
      initialFocusRef.current?.focus();
      if (currentFilename) {
        setFilename(currentFilename.replace(/\.[^/.]+$/, ''));
      }
    }
  }, [isOpen, currentFilename]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const getBitrateForQuality = (quality: ExportQuality): number => {
    switch (quality.id) {
      case 'high':
        return selectedFormat.id === 'mp3' ? 320 : selectedFormat.bitrate || 1411;
      case 'medium':
        return selectedFormat.id === 'mp3' ? 256 : selectedFormat.bitrate || 1411;
      case 'low':
        return selectedFormat.id === 'mp3' ? 128 : selectedFormat.bitrate || 705;
      default:
        return selectedFormat.bitrate || 1411;
    }
  };

  const handleExport = () => {
    const processedFilename = filename.trim() || 'processed_audio';
    onExport(selectedFormat, selectedQuality, processedFilename);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onKeyDown={handleKeyDown}
    >
      <div 
        ref={dialogRef}
        className="bg-[#1a1a1a] rounded-lg shadow-xl w-full max-w-md border border-[#333] relative"
        role="dialog"
        aria-modal="true"
        aria-labelledby="export-dialog-title"
        tabIndex={-1}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#333]">
          <div className="flex items-center gap-3 text-[#a0a0a0]">
            <Settings className="w-5 h-5" />
            <h3 id="export-dialog-title" className="text-lg font-medium">Export Settings</h3>
          </div>
          <button
            ref={initialFocusRef}
            onClick={onClose}
            disabled={isExporting}
            className="absolute top-4 right-4 text-[#808080] hover:text-[#a0a0a0] transition-colors disabled:opacity-50"
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Format Selection */}
          <div className="space-y-2">
            <label className="block text-sm text-[#808080]">Format</label>
            <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Export format">
              {EXPORT_FORMATS.map((format) => (
                <button
                  key={format.id}
                  onClick={() => setSelectedFormat(format)}
                  className={`
                    px-4 py-2 rounded text-sm transition-colors
                    ${selectedFormat.id === format.id
                      ? 'bg-zinc-700 text-[#a0a0a0]'
                      : 'bg-[#1a1a1a] border-[#333] text-[#808080] border hover:bg-[#222]'
                    }
                  `}
                  role="radio"
                  aria-checked={selectedFormat.id === format.id}
                  tabIndex={0}
                >
                  {format.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quality Selection */}
          <div className="space-y-2">
            <label className="block text-sm text-[#808080]">Quality</label>
            <div className="space-y-2" role="radiogroup" aria-label="Export quality">
              {EXPORT_QUALITIES.map((quality) => (
                <button
                  key={quality.id}
                  onClick={() => setSelectedQuality(quality)}
                  className={`
                    w-full px-4 py-3 rounded text-left transition-colors
                    ${selectedQuality.id === quality.id
                      ? 'bg-zinc-700 text-[#a0a0a0]'
                      : 'bg-[#1a1a1a] border-[#333] text-[#808080] border hover:bg-[#222]'
                    }
                  `}
                  role="radio"
                  aria-checked={selectedQuality.id === quality.id}
                  tabIndex={0}
                >
                  <div className="font-medium">{quality.label}</div>
                  <div className="text-xs opacity-70">
                    {quality.sampleRate / 1000}kHz / {quality.bitDepth}-bit / {getBitrateForQuality(quality)} kbps
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Filename Input */}
          <div className="space-y-2">
            <label htmlFor="filename" className="block text-sm text-[#808080]">Filename</label>
            <div className="flex items-center space-x-2">
              <input
                id="filename"
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="Enter filename"
                className="flex-1 bg-[#2a2a2a] border border-[#333] rounded px-3 py-2 text-[#a0a0a0] focus:outline-none focus:border-zinc-600"
                aria-label="Export filename"
              />
              <div className="w-12 text-center text-[#505050]">.{selectedFormat.extension}</div>
            </div>
          </div>

          {/* Export Options */}
          <div className="space-y-2">
            <label className="block text-sm text-[#808080] mb-3">Options</label>
            <div className="grid grid-cols-2 gap-4">
              <Checkbox
                id="include-echo"
                checked={includeEchoTail}
                onChange={(e) => setIncludeEchoTail(e.target.checked)}
                label="Include echo tail"
              />
              <Checkbox
                id="normalize-audio"
                checked={normalizeAudio}
                onChange={(e) => setNormalizeAudio(e.target.checked)}
                label="Normalize audio"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#333]">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? 'Exporting...' : 'Export'}
          </Button>
        </div>
      </div>
    </div>
  );
};