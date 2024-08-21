import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

function FileDropzone({ className }: { className: string }) {
  type FileWithPreview = File & {
    preview: string;
  };

  const [file, setFile] = useState<FileWithPreview | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const maxSize = 5 * 1024 * 1024; // 5 MB in bytes

    if (acceptedFiles?.length) {
      const uploadedFile = acceptedFiles[0] as FileWithPreview;

      if (uploadedFile.size > maxSize) {
        alert("File is too large. Maximum size allowed is 5 MB.");
        return;
      }

      uploadedFile.preview = URL.createObjectURL(uploadedFile);
      setFile(uploadedFile);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false, // Restrict to a single file
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    }, // Only accept JPG and PNG files
  });

  return (
    <div {...getRootProps({ className: className })}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the file here ...</p>
      ) : (
        <p>Drag 'n drop a file here, or click to select a file</p>
      )}
      {file && (
        <div>
          <p>Uploaded file: {file.name}</p>
          {file.type.startsWith("image/") ? (
            <img
              src={file.preview}
              alt="Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "300px",
                marginTop: "10px",
              }}
            />
          ) : (
            <p>File preview is not available for this type.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default FileDropzone;
