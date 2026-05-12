import { Express } from "express";

/**
 * Uploads a file to Camel Cloud storage.
 * 
 * @param file - The file object from Multer (in memory)
 * @param folderPath - The destination folder path in Camel Cloud
 * @returns The remote file path/URL
 */
export const uploadToCamelCloud = async (
  file: Express.Multer.File,
  folderPath: string
): Promise<string> => {
  const uploadUrl = process.env.storageUploadUrl;

  if (!uploadUrl) {
    throw new Error("storageUploadUrl is not defined in environment variables");
  }

  const uniqueFileName = `${
    file.originalname.split('.')[0]
  }_${Date.now()}-${Math.floor(100000 + Math.random() * 900000)}`;
 
  const formData = new FormData();
 
  // Create a blob from the file buffer
  const blob = new Blob([new Uint8Array(file.buffer)], { type: file.mimetype });
 
  formData.append('file', blob, file.originalname);
  formData.append('folderPath', folderPath);
  formData.append('fileName', uniqueFileName);
 
  const response = await fetch(uploadUrl, {
    method: 'POST',
    body: formData,
  });
 
  if (!response.ok) {
    throw new Error(
      `Failed to upload ${file.originalname} (${response.status})`
    );
  }
 
  const data = (await response.json()) as { filePath?: string };
 
  if (!data?.filePath) {
    throw new Error(`Invalid upload response for ${file.originalname}`);
  }
 
  return data.filePath;
};
