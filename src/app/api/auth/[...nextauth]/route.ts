// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { JWT } from "next-auth/jwt"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: {  label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
            method: 'POST',
            body: JSON.stringify({ email: credentials.email, password: credentials.password }),
            headers: { "Content-Type": "application/json" }
          });

          const response = await res.json();
          
          if (res.ok && response.user) {
            return {
                ...response.user,
                apiToken: response.token
            };
          } else {
            return null;
          }
        } catch (error) {
            console.error("Authorize error:", error);
            return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      // Persist the user info and token from the backend
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.apiToken = user.apiToken;
      }
      return token;
    },
    async session({ session, token }) {
      // Pass the user info and token to the session object
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.apiToken = token.apiToken as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  }
})

export { handler as GET, handler as POST }