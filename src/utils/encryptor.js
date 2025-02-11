import fs from "fs";
import path from "path";
import crypto from "crypto";
import { exec } from "child_process";

const CHUNK_DURATION = 10; // Duration of each chunk in seconds

/**
 * Encrypts and generates a DASH manifest using FFmpeg.
 * @param {string} inputFilePath - Path to the input audio file.
 * @param {string} outputDir - Directory to save the encrypted files and manifest.
 * @param {string} musicId - Unique identifier for the music file.
 * @returns {Promise<string>} - Path to the generated manifest file.
 */
export const encryptAndGenerateManifest = async (inputFilePath, outputDir) => {
  return new Promise((resolve, reject) => {
    try {
      // Ensure output directory exists
      fs.mkdirSync(outputDir, { recursive: true });

      const encryptionKey = crypto.randomBytes(16).toString("hex"); // AES-128 key
      const keyPath = path.join(outputDir, "encryption.key");
      const iv = crypto.randomBytes(16).toString("hex"); // Initialization Vector (IV)

      // Save the encryption key
      fs.writeFileSync(keyPath, encryptionKey);

      // FFmpeg command to encrypt and generate DASH manifest
      const ffmpegCmd = `ffmpeg -i "${inputFilePath}" -c:a aac -b:a 128k -f dash -seg_duration ${CHUNK_DURATION} \
      -encryption_key ${encryptionKey} -encryption_iv ${iv} -use_template 1 -use_timeline 1 \
      -adaptation_sets "id=0,streams=a" "${path.join(outputDir, "manifest.mpd")}"`;

      // Execute the FFmpeg command
      exec(ffmpegCmd, (error,/* stdout, stderr */) => {
        if (error) {
          console.error("Error running FFmpeg:", error);
          return reject(error);
        }
        // Return the path to the manifest file
        resolve(path.join(outputDir, "manifest.mpd"));
      });
    } catch (error) {
      console.error("Error in encryptAndGenerateManifest:", error);
      reject(error);
    }
  });
};
