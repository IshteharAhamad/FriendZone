import fs from "fs/promises";
import path from "path";

const upload_File = async (localFilePath, uploadDirectory) => {
  try {
    if (!localFilePath || !uploadDirectory) return null;

    await fs.mkdir(uploadDirectory, { recursive: true });

    const fileName = path.basename(localFilePath);
    const uniqueName = `${Date.now()}-${fileName}`;
    const targetPath = path.join(uploadDirectory, uniqueName);

    await fs.rename(localFilePath, targetPath);
    return targetPath;
  } catch (error) {
    console.error("Error uploading file locally:", error);

    // Delete temporary file if it exists
    try {
      await fs.unlink(localFilePath);
    } catch (unlinkError) {
      console.error("Error deleting temporary file:", unlinkError);
    }

    return { success: false, error: error.message };
  }
};

export { upload_File };

// const localFilePath = req.file.path;
//     const uploadDirectory = "./public/temp";
//     const avatar = await upload_File(localFilePath, uploadDirectory);
// controller