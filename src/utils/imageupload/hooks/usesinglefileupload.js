'use client';

import { useState, useCallback } from 'react';

/**
 * Hook for handling single file upload (not limited to images)
 * @param {Function} onFileChange - Callback when file changes
 * @param {Object} validationOptions - Validation options like maxSize, allowedTypes
 */
export const useSingleFileUpload = (onFileChange, validationOptions = {}) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = useCallback(
    (event) => {
      const selectedFile = event.target.files[0];
      setError(null);

      if (!selectedFile) {
        clearFile();
        return;
      }

      // Optional validation
      if (validationOptions.maxSize && selectedFile.size > validationOptions.maxSize) {
        setError(`File size should be less than ${validationOptions.maxSize / 1024 / 1024} MB`);
        return;
      }

      if (
        validationOptions.allowedTypes &&
        !validationOptions.allowedTypes.includes(selectedFile.type)
      ) {
        setError(`File type "${selectedFile.type}" is not allowed`);
        return;
      }

      setIsLoading(true);
      setFile(selectedFile);
      setFileName(selectedFile.name);

      if (onFileChange) onFileChange(selectedFile);

      setIsLoading(false);
    },
    [onFileChange, validationOptions]
  );

  const clearFile = useCallback(() => {
    setFile(null);
    setFileName(null);
    setError(null);

    if (onFileChange) onFileChange(null);
  }, [onFileChange]);

  return {
    file,
    fileName,
    isLoading,
    error,
    handleFileChange,
    clearFile,
  };
};
