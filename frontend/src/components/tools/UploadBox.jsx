import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, FileText, Image, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

const FILE_ICONS = {
  "application/pdf": FileText,
  "image/jpeg": Image,
  "image/png": Image,
  "image/webp": Image,
};

export default function UploadBox({
  accept,           // { "image/*": [], "application/pdf": [] }
  maxFiles = 10,
  maxSizeMB = 10,
  onFilesSelected,
  processing = false,
  progress = 0,
}) {
  const [files, setFiles] = useState([]);

  const onDrop = useCallback(
    (accepted, rejected) => {
      if (rejected.length) {
        rejected.forEach((f) => {
          const msg = f.errors[0]?.message || "File rejected";
          toast.error(`${f.file.name}: ${msg}`);
        });
      }
      const merged = [...files, ...accepted].slice(0, maxFiles);
      setFiles(merged);
      onFilesSelected?.(merged);
    },
    [files, maxFiles, onFilesSelected]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    maxSize: maxSizeMB * 1024 * 1024,
  });

  function removeFile(name) {
    const next = files.filter((f) => f.name !== name);
    setFiles(next);
    onFilesSelected?.(next);
  }

  function formatSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }

  return (
    <div className="w-full space-y-4">
      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer
          transition-all duration-200
          ${isDragActive
            ? "border-primary-500 bg-primary-50 dark:bg-primary-950"
            : "border-gray-200 dark:border-gray-700 hover:border-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
          }
        `}
      >
        <input {...getInputProps()} />
        <Upload
          className={`mx-auto mb-4 h-10 w-10 ${
            isDragActive ? "text-primary-500" : "text-gray-400"
          }`}
        />
        {isDragActive ? (
          <p className="text-primary-600 dark:text-primary-400 font-medium">
            Drop files here…
          </p>
        ) : (
          <>
            <p className="text-gray-700 dark:text-gray-300 font-medium mb-1">
              Drag & drop files here
            </p>
            <p className="text-gray-400 text-sm">
              or{" "}
              <span className="text-primary-500 underline">browse</span> — max{" "}
              {maxFiles} file{maxFiles > 1 ? "s" : ""}, {maxSizeMB} MB each
            </p>
          </>
        )}
      </div>

      {/* File list */}
      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((file) => {
            const Icon = FILE_ICONS[file.type] || FileText;
            return (
              <li
                key={file.name}
                className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3"
              >
                <Icon className="h-5 w-5 text-primary-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-gray-800 dark:text-gray-200">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-400">{formatSize(file.size)}</p>
                </div>
                {processing ? (
                  <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                ) : (
                  <button
                    onClick={() => removeFile(file.name)}
                    className="text-gray-400 hover:text-red-500 transition-colors shrink-0"
                    aria-label="Remove file"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {/* Progress bar */}
      {processing && progress > 0 && (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-primary-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
