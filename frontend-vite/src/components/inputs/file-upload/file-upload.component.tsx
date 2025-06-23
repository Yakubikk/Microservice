import React, { useRef, useState } from 'react';
import { Button } from '@/components/inputs/button';
import { showToast } from '@/components/data-display/toast';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onUpload: (file: File) => Promise<unknown>;
  accept?: string;
  disabled?: boolean;
  className?: string;
  uploadText?: string;
  selectText?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  onUpload,
  accept = '.csv',
  disabled = false,
  className = '',
  uploadText = 'Загрузить',
  selectText = 'Выбрать файл',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      showToast.error('Пожалуйста, выберите файл для загрузки');
      return;
    }

    setIsUploading(true);
    try {
      await onUpload(selectedFile);
      showToast.success('Файл успешно загружен');
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      showToast.error('Не удалось загрузить файл');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSelectClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />
      
      <Button
        variant="outline"
        onClick={handleSelectClick}
        disabled={disabled}
        className="min-w-32"
      >
        {selectText}
      </Button>
      
      {selectedFile && (
        <span className="text-sm text-gray-600 truncate max-w-48">
          {selectedFile.name}
        </span>
      )}
      
      <Button
        onClick={handleUpload}
        disabled={!selectedFile || isUploading || disabled}
        className="min-w-24"
      >
        {isUploading ? 'Загрузка...' : uploadText}
      </Button>
    </div>
  );
};
