import React from 'react'
import { Github } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const Login = () => {
  return (
    <>
    <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-25">
      <div className="max-w-5xl ">
        <div className="mb-8 mt-8">
          <Image src='/icons/logo.png' width={150} height={150} alt='logo'/>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5 h-140 flex items-center">
          <div className="grid md:grid-cols-2 gap-8 items-center mb-1">
            
            {/* Left Side - Logo and Illustration */}
            <div className="flex justify-center">
              {/* Calendar Illustration */}
              <div className="bg-gradient-to-b rounded-xl p-2 mb-4">
                <Image src='/media/home_image.svg' alt='image' height={600} width={500}/>
              </div>
            </div>

            {/* Right Side - Content and Buttons */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-medium text-gray-800 mb-4">
                  YojanAI is here to help you to schedule your Whole Semester
                </h3>
                
                <div className="space-y-3 text-gray-600 mb-6">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                    <span>Connect your Notion & Google Calendars.</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                    <span>Upload your Class Routine & Subject List.</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                    <span>Get your ideal routine throughout the week.</span>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="text-xs text-gray-500 leading-relaxed">
                By selecting "Agree & sign up" below I agree to the YojanAI Terms.<br />
                Learn about how we use & protect your data in our Privacy Policy.
              </div>

              {/* Sign up buttons */}
              <div className="space-y-3">
                <Link href='/onboarding/user/welcome' className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 rounded-lg py-3 px-4 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-red-500 rounded text-white flex items-center justify-center text-sm font-bold">
                    G
                  </div>
                  Agree & Sign up with Google
                </Link>
                
                <Link href={'/api/auth/signin'} className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 rounded-lg py-3 px-4 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors">
                  <Github className="w-6 h-6" />
                  Agree & Sign up with Github
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    </>
  )
}

export default Login
