
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface FileUploaderProps {
  onFileSelect: (file: string) => void;
  currentImage?: string;
  label?: string;
}

export function FileUploader({ onFileSelect, currentImage, label = "Imagem" }: FileUploaderProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem.');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      onFileSelect(result);
    };
    reader.readAsDataURL(file);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="cursor-pointer"
            id="file-upload"
          />
        </div>
        {preview && (
          <Button 
            type="button" 
            variant="outline"
            onClick={() => {
              setPreview(null);
              onFileSelect('');
            }}
          >
            Remover
          </Button>
        )}
      </div>
      
      {preview && (
        <div className="mt-2">
          <p className="text-sm text-gray-500 mb-2">Preview:</p>
          <div className="border border-gray-200 rounded-md p-4 bg-white flex justify-center">
            <img 
              src={preview} 
              alt="Preview" 
              className="max-h-40 object-contain" 
            />
          </div>
        </div>
      )}
    </div>
  );
}
