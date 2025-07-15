"use client";
import React, { useEffect, useState } from "react";
import { User } from "lucide-react";
import Image from "next/image";
import ProgressBar from "@ramonak/react-progress-bar";
import Link from "next/link";
import { useSession } from "next-auth/react";
const REDIRECT_URI = "http://localhost:3000/onboarding/user/connect";

const Connect = () => {
  const { data: session, status } = useSession();
  const [notionToken, setNotionToken] = useState("");
  const [calendarToken, setCalendarToken] = useState("");
  const [buttonEnable, setButtonEnable] = useState(false);


  // Notion Button
  const ConnectWithNotion = async () => {
    window.location.href = `https://api.notion.com/v1/oauth/authorize?client_id=${process
      .env
      .NEXT_PUBLIC_NOTION_CLIENT_ID!}&response_type=code&owner=user&redirect_uri=${REDIRECT_URI}`;
  };


  // Google Calendar Button
  const ConnectWithGoogleCalendar = async () => {
    const GOOGLE_CALENDAR_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token&scope=https://www.googleapis.com/auth/calendar&include_granted_scopes=true&prompt=consent`;
    window.location.href = GOOGLE_CALENDAR_URL;
  };


  // Use Effect //
  useEffect(() => {
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  const googleAccessToken = hashParams.get("access_token");
  const urlParams = new URLSearchParams(window.location.search);
  const notionCode = urlParams.get("code");

  // Handle Notion
  if (notionCode) {
    fetch("http://localhost:8000/api/notion/exchange-code/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code: notionCode }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Notion Access token:", data.access_token);
        localStorage.setItem("notion_access_token", data.access_token);
        setNotionToken(data.access_token);
      });
  }

  // Handle Google Calendar
   if (googleAccessToken) {
      console.log("Google Access Token:", googleAccessToken);
      localStorage.setItem("google_access_token", googleAccessToken);
      setCalendarToken(googleAccessToken);
    } else {
      console.log("No access token found in URL.");
    }

    // Enable button if notion and calendar both are connected
    if (localStorage.getItem("google_access_token") != undefined && localStorage.getItem("notion_access_token") != undefined) {
      setButtonEnable(true)
    }
    console.log(buttonEnable);
}, []);


  return (
    <>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-6xl w-full">
          <div className="mb-8">
            <Image src="/icons/logo.png" width={150} height={150} alt="logo" />
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 relative h-150">
            {/* Header with Logo and User Icon */}
            <div className="flex justify-end items-start mb-6">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                <img
                  className="rounded-3xl"
                  src={
                    session?.user?.image ??
                    `${(<User className="w-6 h-6 text-white" />)}`
                  }
                  height={48}
                  width={48}
                  alt="user-profile"
                ></img>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Left Side - Content */}
              <div className="space-y-8">
                <div>
                  <h1 className="text-4xl font-medium text-gray-800 mb-8">
                    How about you connect your Notion and Google Calendar for
                    better access?
                  </h1>

                  {/* Connection Cards */}
                  <div className="grid md:grid-cols-2 gap-2">
                    {/* Notion Card */}
                    <div className="border-2 border-gray-200 rounded-xl p-4 text-center bg-gray-50">
                      <h3 className="font-semibold text-gray-800 mb-2">
                        Connect with Notion
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Create your own workspace by connecting to Notion
                      </p>
                      <button
                        onClick={ConnectWithNotion}
                        className="w-full bg-white border-2 border-gray-300 rounded-lg py-2 px-4 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors flex items-center justify-center gap-2"
                      >
                        <div className="w-5 h-5 bg-black rounded text-white flex items-center justify-center text-xs font-bold">
                          N
                        </div>
                        Connect with Notion
                      </button>
                    </div>

                    {/* Google Calendar Card */}
                    <div className="border-2 border-gray-200 rounded-xl p-4 text-center bg-gray-50">
                      <h3 className="font-semibold text-gray-800 mb-2">
                        Connect with Google Calendar
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Access your routine from everywhere
                      </p>
                      <button
                        onClick={ConnectWithGoogleCalendar}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 via-red-500 via-yellow-500 to-green-500 rounded-full"></div>
                        </div>
                        Connect with Google
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Illustration */}
              <div className="flex justify-center">
                <div className="bg-gradient-to-b rounded-xl w-80 h-64 flex items-center justify-center">
                  <Image
                                    src="/media/Schedule.gif"
                                    alt="Home Setup Illustration"
                                    height={600}
                                    width={500}
                                  />
                </div>
              </div>
            </div>
            {/* Progress Bar */}
            <div className="space-y-4 mt-18">
              <ProgressBar
                completed={40}
                animateOnRender
                customLabel=" "
                height="10px"
                ariaValuemin={20}
              />
            </div>
            {/* Continue Button */}
            <div className="flex justify-end mt-8">
              {buttonEnable ? (
                <>
                  <button
                    onClick={() => {
                      window.location.href = "/onboarding/user/upload";
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-8 rounded-xl transition-colors cursor-pointer"
                  >
                    Continue
                  </button>{" "}
                </>
              ) : (
                <>
                  <button
                    disabled
                    onClick={() => {
                      window.location.href = "/onboarding/user/upload";
                    }}
                    className="bg-gray-400 text-white font-medium py-3 px-8 rounded-xl transition-colors cursor-not-allowed"
                  >
                    Continue
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Connect;
