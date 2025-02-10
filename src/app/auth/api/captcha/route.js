import { v4 as uuidv4 } from 'uuid';
import Captcha from '@/models/Captcha';
import connectDB from '@/config/db';
import { createCanvas } from 'canvas'; // Uncomment this to generate the captcha image

// Function to generate captcha code
const generateCaptchaCode = () =>  (Math.floor(1000 + Math.random() * 9000)).toString();
export const dynamic = "force-dynamic";
export async function GET(req) {
  // Ensure database connection
  await connectDB();
  
  
  // Generate a new captcha code and ID
  const captchaCode = generateCaptchaCode();
  const captchaId = uuidv4();


  // Save captcha to the database
  const newCaptcha = new Captcha({ captchaId, captchaCode });
  await newCaptcha.save();


  // Generate captcha image (using canvas)
  const canvas = createCanvas(100, 40);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#f2f2f2';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = '30px Arial';
  ctx.fillStyle = '#333';
  ctx.fillText(captchaCode, 10, 30);
  

  // Return captchaId and captcha image as base64 data
  return new Response(
    JSON.stringify({ captchaId, captchaImage: canvas.toDataURL() }),
    //JSON.stringify({ captchaId, captchaImage: captchaId }),
    { headers: { 'Content-Type': 'application/json' } }
  );
}
