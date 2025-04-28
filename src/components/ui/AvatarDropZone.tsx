import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";

interface AvatarDropzoneProps {
  avatarPreview: string | null;
  onFileSelected: (file: File) => void;
  size?: number;
}

export default function AvatarDropzone({
  avatarPreview,
  onFileSelected,
  size = 160,
}: AvatarDropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles[0]) onFileSelected(acceptedFiles[0]);
    },
    [onFileSelected]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  return (
    <div
      {...getRootProps()}
      style={{ width: size, height: size }}
      className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition overflow-hidden"
    >
      <input {...getInputProps()} />
      {avatarPreview ? (
        <img
          src={avatarPreview}
          alt="Avatar Preview"
          className="object-cover w-full h-full"
        />
      ) : (
        <div className="text-center px-2">
          <Upload className="mx-auto mb-2 w-8 h-8 text-gray-400" />
          <p className={isDragActive ? "text-blue-600" : "text-gray-700"}>
            {isDragActive ? "Drop here…" : "Browse photo or drop here"}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            A photo &gt;400px, max size 5 MB.
          </p>
        </div>
      )}
    </div>
  );
}
