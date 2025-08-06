import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
);

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    signIn: "/signup"
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!user?.email) {
        console.error("No email found for user");
        return false;
      }

      const { data: existingUser, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", user.email)
        .maybeSingle();

      if (error) {
        console.error("Supabase select error:", error);
        return false;
      }

      if (!existingUser) {
        const { error: insertError } = await supabase.from("users").insert([
          {
            email: user.email,
            name: user.name,
            image: user.image,
            oauth_provider: account?.provider || null,
            is_verified: false,
          },
        ]);

        if (insertError) {
          console.error("Insert error:", insertError);
          return false;
        }
      }

      return true;
    },

    async jwt({ token}) {
      if (token?.email) {
        const { data, error } = await supabase
          .from("users")
          .select("is_verified")
          .eq("email", token.email)
          .maybeSingle();

        if (!error && data) {
          token.is_verified = data.is_verified;
        }
      }
      return token;
    },

    async session({ session, token }) {
      session.user.is_verified = token.is_verified;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
