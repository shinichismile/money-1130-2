import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

interface AvatarUploaderProps {
  currentAvatar?: string;
  onAvatarChange: (base64: string) => void;
}

export default function AvatarUploader({ currentAvatar, onAvatarChange }: AvatarUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState(currentAvatar);
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
      onAvatarChange(base64);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="relative w-24 h-24 rounded-full bg-gray-50 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden group">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="プロフィール画像"
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
          プロフィール画像をアップロード
        </button>
        <p className="text-xs text-gray-500 mt-1">
          2MB以下のJPG、PNG、GIF形式
        </p>
      </div>
    </div>
  );
}