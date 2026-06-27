import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { getPrisma } from "@/lib/prisma";

function getAdminEmails() {
  return new Set(
    (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function getAuthOptions(): NextAuthOptions {
  const prisma = getPrisma();
  const adminEmails = getAdminEmails();

  return {
    adapter: prisma ? PrismaAdapter(prisma) : undefined,
    providers: [
      EmailProvider({
        server: process.env.EMAIL_SERVER,
        from: process.env.EMAIL_FROM,
      }),
    ],
    pages: {
      signIn: "/api/auth/signin",
      verifyRequest: "/admin/check-email",
    },
    callbacks: {
      async signIn({ user }) {
        const email = user.email?.toLowerCase();
        return Boolean(email && (adminEmails.size === 0 || adminEmails.has(email)));
      },
      async session({ session }) {
        const email = session.user?.email?.toLowerCase();
        if (email && session.user) {
          session.user.role = adminEmails.has(email) ? "owner" : "editor";
        }
        return session;
      },
    },
    session: {
      strategy: prisma ? "database" : "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET,
  };
}
