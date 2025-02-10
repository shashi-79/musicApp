import crypto from "crypto";

export const generateKey = () => crypto.randomBytes(32).toString("hex"); // 256-bit key
