import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function middleware(req) {
  const authHeader = req.headers.get("authorization");
  const userIdHeader = req.headers.get("userid");
  
  console.log(`middleware  active
  
  
  
  
  `)

  // Validate the Authorization header
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { message: "Unauthorized. Token not provided or malformed." },
      { status: 401 }
    );
  }

  // Validate the UserId header
  if (!userIdHeader) {
    return NextResponse.json(
      { message: "Unauthorized. User ID not provided." },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);

    // Check if the userId matches the token
    if (userIdHeader !== decoded.userId.userId) {
      return NextResponse.json(
        { message: "Forbidden. User ID does not match the token information." },
        { status: 403 }
      );
    }

    return NextResponse.next();
  } catch (err) {
    switch (err.name) {
      case "TokenExpiredError":
        return NextResponse.json(
          { message: "Unauthorized. Token has expired." },
          { status: 401 }
        );
      case "JsonWebTokenError":
        return NextResponse.json(
          { message: "Unauthorized. Invalid token." },
          { status: 401 }
        );
      default:
        return NextResponse.json(
          { message: "Internal Server Error." },
          { status: 500 }
        );
    }
  }
}

export const config = {
  matcher: [
    "api/register/",
  ],
};
