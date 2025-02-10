import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
export const generateAccessToken = (userId) => 
  jwt.sign(
    { userId }, 
    process.env.JWT_ACCESS_TOKEN_SECRET, 
    { expiresIn: '15m'}//process.env.JWT_ACCESS_TOKEN_EXPIRATION }
  );

export const generateRefreshToken = (userId) => 
  jwt.sign(
    { userId }, 
    process.env.JWT_REFRESH_SECRET, 
    { expiresIn:'7d'}// process.env.JWT_REFRESH_EXPIRATION }
  );
