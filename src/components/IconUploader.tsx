import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

interface IconUploaderProps {
  currentIcon?: string;
  onIconChange: (base64: string) => void;
}

export default function IconUploader({ currentIcon, onIconChange }: IconUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState(currentIcon);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // ファイルサイズチェック (2MB以下)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('ファイルサイズは2MB以下にしてください');
      return;
    }

    // 画像ファイルタイプチェック
    if (!file.type.startsWith('image/')) {
      toast.error('画像ファイルを選択してください');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setPreviewUrl(base64);
      onIconChange(base64);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        アイコン
      </label>
      <div className="flex items-center space-x-4">
        <div className="relative w-16 h-16 rounded-lg bg-gray-50 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden group">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="アイコン"
              className="w-full h-full object-cover"
            />
          ) : (
            <ImageIcon className="w-8 h-8 text-gray-400" />
          )}
          <div
            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="flex-1">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            画像をアップロード
          </button>
          <p className="text-xs text-gray-500 mt-1">
            2MB以下のJPG、PNG、GIF形式
          </p>
        </div>
      </div>
    </div>
  );
}