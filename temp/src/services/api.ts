import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

// Utility function to handle errors
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleError = (error: any) => {
  if (error.response) {
    console.error("Response error:", error.response.data);
    throw new Error(error.response.data.error || "Server responded with an error");
  } else if (error.request) {
    console.error("Request error:", error.request);
    throw new Error("No response received from the server");
  } else {
    console.error("Error:", error.message);
    throw new Error(error.message);
  }
};

const uploadFiles = async (files: File[], onProgress: (progress: number) => void) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  onProgress(30);
  console.log("Sending upload request to http://127.0.0.1:8000/upload...");
  try {
    const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    onProgress(100);
    return response.data;
  } catch (error) {
    handleError(error);
    return {};
  }
};

// Updated preprocess function to handle column-specific strategies
const preprocessData = async (
  files: File[],
  missingStrategy: string | Record<string, string>,
  scaling: boolean,
  encoding: string | Record<string, string>,
  targetColumn = "",
  onProgress: (progress: number) => void
) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  formData.append("missing_strategy", JSON.stringify(missingStrategy));
  formData.append("scaling", scaling.toString());
  formData.append("encoding", JSON.stringify(encoding));
  if (targetColumn) {
    formData.append("target_column", targetColumn);
  }

  onProgress(40);
  console.log("Sending preprocess request to http://127.0.0.1:8000/preprocess...");
  try {
    const response = await axios.post(`${API_BASE_URL}/preprocess`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 30000,
    });
    onProgress(100);
    return response.data;
  } catch (error) {
    handleError(error);
    return {};
  }
};

const trainModel = async (
  files: File[],
  targetColumn: string,
  taskType: string,
  modelType: string,
  onProgress: (progress: number) => void
) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  formData.append("target_column", targetColumn || "");
  formData.append("task_type", taskType);
  formData.append("model_type", modelType);

  onProgress(30);
  console.log("Sending train request to http://127.0.0.1:8000/train...");
  try {
    const response = await axios.post(`${API_BASE_URL}/train`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 60000,
    });
    onProgress(100);
    return response.data;
  } catch (error) {
    handleError(error);
    return {};
  }
};

const getDownloadModelUrl = (filename: string) => {
  return `${API_BASE_URL}/download-model/${filename}`;
};

const getDownloadPreprocessedUrl = (filename: string) => {
  return `${API_BASE_URL}/download-preprocessed/${filename}`;
};

const trainModelWithPreprocessed = async (
  preprocessedFilenames: string[],
  targetColumn: string,
  taskType: string,
  modelType: string,
  onProgress: (progress: number) => void
) => {
  const formData = new FormData();
  preprocessedFilenames.forEach((filename) => formData.append("preprocessed_filenames", filename));
  formData.append("target_column", targetColumn || "");
  formData.append("task_type", taskType);
  formData.append("model_type", modelType);

  onProgress(30);
  console.log("Sending train request to http://127.0.0.1:8000/train...");
  try {
    const response = await axios.post(`${API_BASE_URL}/train`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 60000,
    });
    onProgress(100);
    return response.data;
  } catch (error) {
    handleError(error);
    return {};
  }
};

export {
  uploadFiles,
  preprocessData,
  trainModel,
  getDownloadModelUrl,
  getDownloadPreprocessedUrl,
  trainModelWithPreprocessed,
};