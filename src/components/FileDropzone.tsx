import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

// this dropzone allows people to drag and drop or choose files
// the file is already restricted to 5MB or less, and can only be a jpg or png

function FileDropzone({ className }: { className: string }) {
  // extend the existing File type by adding preview property (allows you to store them in one object)
  type FileWithPreview = File & {
    preview: string;
  };

  const [file, setFile] = useState<FileWithPreview | null>(null);

  // callback prevents unnecessary rerendering or functions for optimisation
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const maxSize = 5 * 1024 * 1024; // 5 MB in bytes

    if (acceptedFiles?.length) {
      const uploadedFile = acceptedFiles[0] as FileWithPreview;

      if (uploadedFile.size > maxSize) {
        alert("File is too large. Maximum size allowed is 5 MB."); // not tested yet
        return;
      }

      uploadedFile.preview = URL.createObjectURL(uploadedFile); // creates URL to display image
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
