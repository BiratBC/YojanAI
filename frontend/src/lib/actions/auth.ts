"use client"

import { signIn, signOut } from "next-auth/react"

export const GithubLogin = async () => {
    await signIn("github", {redirect : true, callbackUrl : "/onboarding/user/welcome"})
}
export const GoogleLogin = async () => {
    await signIn("google", {redirect : true, callbackUrl : "/onboarding/user/welcome"})
}
export const logout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" })
}