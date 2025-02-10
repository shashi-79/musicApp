import crypto from "crypto";
import base64url from "base64url";

const generateChallenge = () => base64url.encode(crypto.randomBytes(32));
export default generateChallenge
