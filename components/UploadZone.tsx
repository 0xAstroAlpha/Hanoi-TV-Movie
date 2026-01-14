import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadedFile } from '../types';
import { fileToBase64 } from '../services/fileUtils';

interface UploadZoneProps {
  label: string;
  subLabel: string;
  file: UploadedFile | null;
  onFileSelect: (file: UploadedFile | null) => void;
  accept?: string;
  id: string;
  minimal?: boolean;
  compact?: boolean; // New prop for mobile
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  label,
  subLabel,
  file,
  onFileSelect,
  accept = "image/*",
  id,
  minimal = false,
  compact = false
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      try {
        const base64 = await fileToBase64(selectedFile);
        onFileSelect({
          file: selectedFile,
          previewUrl: URL.createObjectURL(selectedFile),
          base64: base64,
          mimeType: selectedFile.type
        });
      } catch (err) {
        console.error("File processing error", err);
      }
    }
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Show header - compact for minimal mode */}
      <div className={compact ? "mb-1" : minimal ? "mb-1" : "mb-3"}>
        <h3 className={`font-display font-bold text-feudal-gold tracking-wide ${compact ? 'text-[10px]' : minimal ? 'text-xs' : 'text-sm'}`}>{label}</h3>
        {!minimal && <p className="text-xs text-zinc-500 font-serif italic">{subLabel}</p>}
        {minimal && subLabel && <p className={`text-zinc-600 ${compact ? 'text-[9px]' : 'text-[10px]'}`}>{subLabel}</p>}
      </div>

      <div
        onClick={() => inputRef.current?.click()}
        className={`
          relative flex-1 group cursor-pointer 
          border border-dashed rounded-lg transition-all duration-300
          overflow-hidden ${compact ? 'min-h-[80px]' : 'min-h-[120px]'}
          ${file
            ? 'border-feudal-gold/50 bg-black/40'
            : 'border-zinc-700 bg-black/20 hover:border-feudal-gold/40 hover:bg-black/30'
          }
        `}
      >
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleFileChange}
        />

        <AnimatePresence mode="wait">
          {file ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center p-2"
            >
              <img
                src={file.previewUrl}
                alt="Preview"
                className="w-full h-full object-contain rounded-lg"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                <button
                  onClick={clearFile}
                  className="flex items-center gap-2 px-3 py-1.5 bg-feudal-red/80 text-white rounded-full text-xs font-serif border border-feudal-gold/30 hover:bg-feudal-red"
                >
                  <X size={14} /> Thay Ảnh
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-zinc-600"
            >
              <div className="w-10 h-10 rounded-full border border-zinc-700 flex items-center justify-center group-hover:border-feudal-gold/50 group-hover:text-feudal-gold transition-colors">
                <Upload size={18} />
              </div>
              <p className="text-xs font-serif italic group-hover:text-zinc-400">Tải ảnh lên</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};