import fs from "fs";
import path from "path";

const BASE_UPLOAD_DIR = path.resolve(__dirname, "../../../", "uploads");

const uploadFile = async (
  subPath: string,
  fileName: string,
  fileContent: Buffer | string
) => {
  // Create the directory if it does not exist
  const targetDir = path.join(BASE_UPLOAD_DIR, subPath);

  // Create the directory if it does not exist
  await fs.promises.mkdir(targetDir, { recursive: true });

  // Complete path for the file
  const fullPath = path.join(targetDir, fileName);

  // Write the file to disk
  await fs.promises.writeFile(fullPath, fileContent);

  return fullPath;
};

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.promises.access(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

const deleteFile = async (filePath: string) => {
  const checkIfFileExists = await fileExists(filePath);

  if (!checkIfFileExists) return Promise.resolve();

  return fs.promises.unlink(filePath);
};

export { uploadFile, deleteFile };
