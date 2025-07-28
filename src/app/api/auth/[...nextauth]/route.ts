
// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import type { JWT } from "next-auth/jwt"

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

          if (!res.ok) {
            // Forward the error message from the backend
            throw new Error(response.message || "An error occurred during login.");
          }
          
          if (response.user && response.token) {
            return {
                ...response.user,
                apiToken: response.token
            };
          } else {
            return null;
          }
        } catch (error: any) {
            console.error("Authorize error:", error);
            // Throw the error to be caught by NextAuth and displayed to the user
            throw new Error(error.message || "Échec de l'autorisation.");
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
    error: '/login', // Redirect to login page on error, which will display the error message.
  }
})

export { handler as GET, handler as POST }
