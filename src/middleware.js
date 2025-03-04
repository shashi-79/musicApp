import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req) {
  const authHeader = req.headers.get("authorization");
  const userIdHeader = req.headers.get("userid");

  console.log("Middleware active for:", req.url);
  //console.log(req.headers);
 // console.log(userIdHeader)
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
  
  const secret = new TextEncoder().encode(process.env.JWT_ACCESS_TOKEN_SECRET);
  try {
    const { payload } = await jwtVerify(token, secret);

    // Check if the userId matches the token
    console.log('payload',payload);
    console.log(userIdHeader)
    if (userIdHeader !==( payload.userId.userId|| payload.userId)) {
      return NextResponse.json(
        { message: "Forbidden. User ID does not match the token information." },
        { status: 403 }
      );
    }

    return NextResponse.next();
  } catch (err) {
    console.log("before switch    "+err+ " before switch end");
    console.log("err name :  "+err.code)
    switch (err.code) {

      case "ERR_JWT_EXPIRED":
          return NextResponse.json(
            { message: "Unauthorized. Token has expired."},
            { status: 401 }
          );

      case "ERR_JWT_INVALID":
        return NextResponse.json(
          { message: "Unauthorized. Invalid token." },
          { status: 401 }
        );

      case "ERR_JWS_SIGNATURE_VERIFICATION_FAILED":
        return NextResponse.json(
          { message: "Unauthorized. Token signature verification failed." },
          { status: 401 }
        );

      case "ERR_JWT_MALFORMED":
        return NextResponse.json(
          { message: "Unauthorized. Malformed token." },
          { status: 401 }
        );

      case "ERR_JWS_INVALID":
        return NextResponse.json(
          { message: "Unauthorized. Invalid JWT algorithm." },
          { status: 401 }
        );

      case "ERR_JWT_CLAIM_INVALID":
        return NextResponse.json(
          { message: "Unauthorized. Missing or invalid claim in JWT." },
          { status: 401 }
        );

      case "ERR_JWK_INVALID":
        return NextResponse.json(
          { message: "Internal Server Error. Invalid JWK key." },
          { status: 500 }
        );

      case "ERR_JWS_VERIFICATION_FAILED":
        return NextResponse.json(
          { message: "Unauthorized. JWT verification failed." },
          { status: 401 }
        );

      default:
        console.log("default case");
        return NextResponse.json(
          { message: "Internal Server Error."},
          { status: 500 }
        );
    }
  }
}

export const config = {
  matcher: ["/home/profile/api/profile/:path*"],
  matcher: ["/home/upload/api/:path*"],
};