import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

// this dropzone allows people to drag and drop or choose files
// the file is already restricted to 5MB or less, and can only be a jpg or png

function FileDropzone({ className, onDrop }: { className: string; onDrop: (file: File, preview: string) => void }) {
  // extend the existing File type by adding preview property (allows you to store them in one object)
  type FileWithPreview = File & {
    preview: string;
  };

  // const [file, setFile] = useState<FileWithPreview | null>(null);

  // callback prevents unnecessary rerendering or functions for optimisation
  const onDropCallback = useCallback((acceptedFiles: File[]) => {
    const maxSize = 5 * 1024 * 1024; // 5 MB in bytes

    if (!acceptedFiles?.length) {
      alert("Invalid file. Must be JPG or PNG.");
      return;
    }
    
    const uploadedFile = acceptedFiles[0] as FileWithPreview;
    
    if (uploadedFile.size > maxSize) {
      alert("File is too large. Maximum size allowed is 5 MB.");
      return;
    }

    const image = new Image();
    image.src = URL.createObjectURL(uploadedFile);

    image.onload = () => {
      if (image.width < 128 || image.height < 128) {
        alert("Image resolution is too low. Minimum required is 128x128 pixels.");
        return;
      }

      uploadedFile.preview = image.src; // Store the preview URL
      // setFile(uploadedFile);
      onDrop(uploadedFile, uploadedFile.preview); // Call the onDrop callback with the valid file & preview
    };

    // uploadedFile.preview = URL.createObjectURL(uploadedFile); // creates URL to display image
    // setFile(uploadedFile);
    // onDrop(uploadedFile); // Call the onDrop callback
  }, [onDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropCallback,
    multiple: false, // Restrict to a single file
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    }, // Only accept JPG and PNG files
  });

  return (
    <div {...getRootProps({ className: className })}>
      {/* This code has been removed so that FileDropzone is only focused on
          providing image drop handling, instead of previewing any code */}
      {/* {file && (
        <div>
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
      )} */}
      <br />
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the file here...</p>
      ) : (
        <>
          <button type="button">Upload or drag image</button>
          <p className="error-msg">Files must be JPG or PNG and under 5MB.</p>
        </>
      )}
    </div>
  );
}

export default FileDropzone;
