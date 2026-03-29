import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "nathaniel.g.cowan@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin-password";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        if (
          credentials.email === ADMIN_EMAIL &&
          credentials.password === ADMIN_PASSWORD
        ) {
          return {
            id: "1",
            name: "Admin",
            email: ADMIN_EMAIL,
            role: "admin",
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role || "user";
      }
      return token;
    },
    async session({ session, token }) {
      const role = (token as any).role;
      if (session.user) session.user.role = role;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};
