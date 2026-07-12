import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import Discord from "next-auth/providers/discord";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authConfig } from "./auth.config";

// Allow HTTP in production by setting AUTH_URL to http:// or NEXTAUTH_URL_INTERNAL
const useSecureCookies = process.env.NODE_ENV === "production" &&
  !process.env.AUTH_URL?.startsWith("http://") &&
  process.env.NEXTAUTH_SECURE_COOKIES !== "false";

// Session timeout in seconds (720 hours = 30 days)
// Note: This value is read from environment or uses default.
// The admin setting 'session_timeout_hours' requires server restart to take effect.
const SESSION_MAX_AGE = parseInt(process.env.SESSION_TIMEOUT_SECONDS || String(720 * 60 * 60));

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: SESSION_MAX_AGE,
  },
  trustHost: true,
  cookies: {
    sessionToken: {
      name: useSecureCookies ? "__Secure-next-auth.session-token" : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
    callbackUrl: {
      name: useSecureCookies ? "__Secure-next-auth.callback-url" : "next-auth.callback-url",
      options: {
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
    csrfToken: {
      name: useSecureCookies ? "__Host-next-auth.csrf-token" : "next-auth.csrf-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
    pkceCodeVerifier: {
      name: useSecureCookies ? "__Secure-next-auth.pkce.code_verifier" : "next-auth.pkce.code_verifier",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
    state: {
      name: useSecureCookies ? "__Secure-next-auth.state" : "next-auth.state",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
    nonce: {
      name: useSecureCookies ? "__Secure-next-auth.nonce" : "next-auth.nonce",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
  },
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    // Override session callback to always fetch fresh user data and validate session version
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;

        // Fetch fresh user data from database
        if (token.email) {
          try {
            const dbUser = await prisma.user.findUnique({
              where: { email: token.email as string },
              select: {
                id: true,
                email: true,
                name: true,
                image: true,
                username: true,
                embark_id: true,
                discord_username: true,
                sessionVersion: true,
                role: true,
                banned: true,
              },
            });

            // If the user no longer exists (deleted), invalidate the session
            if (!dbUser) {
              return { ...session, user: undefined } as any;
            }

            // Validate session version - if mismatch, mark session as invalid
            if (typeof token.sessionVersion === 'number' && typeof dbUser.sessionVersion === 'number') {
              if (dbUser.sessionVersion !== token.sessionVersion) {
                // Return empty session to indicate invalid session without throwing
                return { ...session, user: undefined } as any;
              }
            }

            // Check if user is banned
            if (dbUser.banned) {
              return { ...session, user: undefined } as any;
            }

            // Update session with fresh data from database
            session.user.email = dbUser.email || '';
            session.user.name = dbUser.name || '';
            session.user.image = dbUser.image || '';
            // Add custom fields to session
            (session.user as any).username = dbUser.username;
            (session.user as any).embark_id = dbUser.embark_id;
            (session.user as any).discord_username = dbUser.discord_username;
            (session.user as any).role = dbUser.role;
            (session.user as any).banned = dbUser.banned;
          } catch (error) {
            // On database error, return session with token data only (don't invalidate)
            console.error('Session callback database error:', error);
          }
        }
      }
      return session;
    },
  },
  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true, // Allow Discord to link with existing accounts via email
      async profile(profile) {
        // Check if user exists and get their banned status
        let existingUser = null;
        if (profile.email) {
          existingUser = await prisma.user.findUnique({
            where: { email: profile.email },
            select: { id: true, banned: true, sessionVersion: true, role: true },
          });
        }

        // If user is banned, prevent login
        if (existingUser?.banned) {
          throw new Error("BANNED");
        }

        const userRole = existingUser?.role ?? 'USER';

        return {
          id: profile.id,
          name: profile.global_name ?? profile.username,
          email: profile.email,
          image: profile.avatar
            ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
            : null,
          username: profile.username,
          discord_username: `${profile.username}${profile.discriminator && profile.discriminator !== "0" ? `#${profile.discriminator}` : ""}`,
          banned: existingUser?.banned ?? false,
          sessionVersion: existingUser?.sessionVersion ?? 0,
          role: userRole,
        };
      },
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const email = credentials.email as string;

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        // Check if user is banned
        if (user.banned) {
          throw new Error("BANNED");
        }

        const isPasswordValid = await compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          sessionVersion: user.sessionVersion,
          role: user.role,
        };
      },
    }),
  ],
  events: {
    async createUser({ user }) {
      // After a user is created via OAuth, update with additional fields if needed
      if (user.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (dbUser) {
          // Generate a username from email if not set
          let updateData: { username?: string; emailVerified?: Date } = {};

          if (!dbUser.username) {
            const emailUsername = user.email.split("@")[0];
            let username = emailUsername;
            let counter = 1;

            // Ensure username is unique
            while (await prisma.user.findUnique({ where: { username } })) {
              username = `${emailUsername}${counter}`;
              counter++;
            }
            updateData.username = username;
          }

          // Auto-verify email for OAuth users (Discord verifies emails)
          if (!dbUser.emailVerified) {
            updateData.emailVerified = new Date();
          }

          if (Object.keys(updateData).length > 0) {
            await prisma.user.update({
              where: { id: dbUser.id },
              data: updateData,
            });
          }
        }
      }
    },
    async linkAccount({ user, account, profile }) {
      // When an account is linked (e.g., Discord), update user with provider-specific info
      if (account.provider === "discord" && profile && user.email) {
        const discordProfile = profile as any;
        const discord_username = `${discordProfile.username}${discordProfile.discriminator && discordProfile.discriminator !== "0" ? `#${discordProfile.discriminator}` : ""}`;

        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (dbUser && !dbUser.discord_username) {
          await prisma.user.update({
            where: { id: dbUser.id },
            data: { discord_username },
          });
        }
      }
    },
  },
});