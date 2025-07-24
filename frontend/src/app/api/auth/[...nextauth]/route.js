import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import NextAuth from "next-auth";
import { createClient } from "@supabase/supabase-js";

// Creating the supabase clietn
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const authOptions = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      authorization: {
        params: {
          scope: "openid email profile",
        },
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        const { data: existingUser, error } = await supabase
          .from("users")
          .select("*")
          .eq("email", user.email)
          .maybeSingle(); // will return null if not found

        if (error) {
          console.error("Error checking user in Supabase:", error);
          // Still allow login even if check fails
          return true;
        }

        if (!existingUser) {
          const { error: insertError } = await supabase.from("users").insert([
            {
              email: user.email,
              name: user.name,
              image: user.image,
              oauth_provider: account.provider,
            },
          ]);

          if (insertError) {
            console.error("Error inserting user into Supabase:", insertError);
            // Still allow login even if insert fails
            return true;
          }
        }

        return true; // Allow login
      } catch (err) {
        console.error("Unexpected signIn error:", err);
        return true; // Don't block login
      }
    },
  },
});

export { authOptions as GET, authOptions as POST };
