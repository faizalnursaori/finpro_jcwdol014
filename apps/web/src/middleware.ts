export {default} from "next-auth/middleware"

export const config = { matcher: ["/profile/:path*/:path*", "/cart/:path*/:path*"] }