import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { NextResponse } from "next/server";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma/prisma";


export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  // providers: [GitHub],
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.includes("/dashboard");
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false;
      } else if (!isLoggedIn && isOnDashboard) {
        return NextResponse.redirect(new URL("/api/auth/signin", nextUrl));
      }
      return true;
    },
  },
});


function GitHubProvider(arg0: { clientId: string | undefined; clientSecret: string | undefined; }): import("@auth/core/providers").Provider {
	throw new Error("Function not implemented.");
}
// import NextAuth from "next-auth";
// import GitHubProvider from "next-auth/providers/github";
// import { PrismaAdapter } from "@auth/prisma-adapter";
// import { prisma } from "./prisma/prisma";

// export default NextAuth({
//   adapter: PrismaAdapter(prisma),
//   providers: [
//     GitHubProvider({
//       clientId: process.env.GITHUB_CLIENT_ID,
//       clientSecret: process.env.GITHUB_CLIENT_SECRET,
//     }),
//   ],
//   session: {
//     strategy: "jwt",
//   },
//   callbacks: {
//     async redirect({ url, baseUrl }) {
//       if (url.startsWith(baseUrl)) return url;
//       return baseUrl;
//     },
//     async session({ session, token }) {
// 	  //@ts-ignore
//       session.user.id = token.id; // Example: Adding user ID to session
//       return session;
//     },
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// });
