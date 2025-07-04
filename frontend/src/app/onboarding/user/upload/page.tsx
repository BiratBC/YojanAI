"use client";
import React, { useState } from "react";
import { User, Upload, FileText, BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ProgressBar from "@ramonak/react-progress-bar";
import { useSession } from "next-auth/react";

interface UploadState {
  classRoutine: File | null;
  subjectList: File | null;
}

const UploadPage = () => {
  const { data: session } = useSession();
  
  const [uploads, setUploads] = useState<UploadState>({
    classRoutine: null,
    subjectList: null
  });

  const handleFileUpload = (type: keyof UploadState, file: File | null) => {
    setUploads(prev => ({
      ...prev,
      [type]: file
    }));
  };

  const handleFileInputChange = (type: keyof UploadState) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    handleFileUpload(type, file);
  };

  const triggerFileInput = (inputId: string) => {
    const input = document.getElementById(inputId) as HTMLInputElement;
    input?.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-3">
      <div className="max-w-6xl w-full">
        <div className="mb-3">
          <Image src="/icons/logo.png" width={120} height={120} alt="logo" />
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 relative">
          {/* Header with User Icon */}
          <div className="flex justify-end items-start mb-4">
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
              {session?.user?.image ? (
                <img
                  className="rounded-full"
                  src={session.user.image}
                  height={40}
                  width={40}
                  alt="user-profile"
                />
              ) : (
                <User className="w-6 h-6 text-white" />
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left Side - Upload Content */}
            <div className="space-y-4">
              <div>
                <h1 className="text-3xl font-medium text-gray-800 mb-3">
                  Now, Upload your Class Routine and Subjects of your Semester
                </h1>
              </div>

              {/* Upload Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Upload Class Routine */}
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-purple-400 transition-colors">
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <FileText className="w-12 h-12 text-gray-400" />
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-800 mb-2">
                        Upload your Class Routine
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        Click here for sample
                      </p>
                    </div>

                    <button
                      onClick={() => triggerFileInput('classRoutineInput')}
                      className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                    >
                      <Upload className="w-4 h-4" />
                      Upload
                    </button>

                    <input
                      id="classRoutineInput"
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={handleFileInputChange('classRoutine')}
                      className="hidden"
                    />

                    {uploads.classRoutine && (
                      <div className="mt-2 text-xs text-green-600 bg-green-50 p-2 rounded">
                        ✓ {uploads.classRoutine.name}
                      </div>
                    )}
                  </div>
                </div>

                {/* Upload Subject List */}
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-purple-400 transition-colors">
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <BookOpen className="w-12 h-12 text-gray-400" />
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-800 mb-2">
                        Upload your Subject List
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        Click here for sample
                      </p>
                    </div>

                    <button
                      onClick={() => triggerFileInput('subjectListInput')}
                      className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                    >
                      <Upload className="w-4 h-4" />
                      Upload
                    </button>

                    <input
                      id="subjectListInput"
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={handleFileInputChange('subjectList')}
                      className="hidden"
                    />

                    {uploads.subjectList && (
                      <div className="mt-2 text-xs text-green-600 bg-green-50 p-2 rounded">
                        ✓ {uploads.subjectList.name}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Visual Illustration */}
            <Image
              src="/media/Schedule.gif"
              alt="Home Setup Illustration"
              height={380}
              width={380}
            />
          </div>

          {/* Progress Bar */}
          <div className="space-y-3 mt-6">
            <ProgressBar
              completed={80}
              animateOnRender
              customLabel=" "
              height="8px"
              bgColor="#9333ea"
              baseBgColor="#e5e7eb"
            />
          </div>

          {/* Continue Button */}
          <div className="flex justify-end mt-8">
            <Link
              href="/dashboard"
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-8 rounded-xl transition-colors"
            >
              Continue
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
