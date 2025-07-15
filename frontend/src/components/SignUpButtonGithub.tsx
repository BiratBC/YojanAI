"use client"
import { GithubLogin } from "@/lib/actions/auth";

const SignUpButtonGithub = () => {
  return (
    <button
      onClick={() => GithubLogin()}
      style={{cursor : "pointer"}}
      className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 rounded-lg py-3 px-4 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors"
    >
      <i className="fa-brands fa-github" style={{fontSize : 30}} aria-hidden></i>
      Agree & Sign up with Github
    </button>
  );
};
const LoginButtonGithub = () => {
  return (
    <button
      onClick={() => GithubLogin()}
      style={{cursor : "pointer"}}
      className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 rounded-lg py-3 px-4 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors"
    >
      <i className="fa-brands fa-github" style={{fontSize : 30}} aria-hidden></i>
      Login with Github
    </button>
  );
};

export {SignUpButtonGithub, LoginButtonGithub};
