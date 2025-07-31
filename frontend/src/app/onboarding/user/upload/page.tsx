"use client";
import React, { useState, useEffect } from "react";
import { User, Upload, FileText, BookOpen } from "lucide-react";
import Image from "next/image";
import ProgressBar from "@ramonak/react-progress-bar";
import { useSession } from "next-auth/react";
import { UploadState } from "@/lib/types";
import { uploadFileToStorage } from "@/lib/helpers";

const UploadPage = () => {
  const { data: session, status } = useSession();
  const [buttonEnabled, setButtonEnabled] = useState(false);

  const [uploads, setUploads] = useState<UploadState>({
    classRoutine: null,
    subjectList: null,
  });

  const handleFileUpload = (type: keyof UploadState, file: File | null) => {
    setUploads((prev) => ({
      ...prev,
      [type]: file,
    }));
  };

  const handleFileInputChange =
    (type: keyof UploadState) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] || null;
      handleFileUpload(type, file);
    };

  const triggerFileInput = (inputId: string) => {
    const input = document.getElementById(inputId) as HTMLInputElement;
    input?.click();
  };

  const handleContinue = async () => {
    if (!session?.user?.email) {
      console.error("No user email found");
      return;
    }

    try {
      const uploadPromises = [];

      // Upload classRoutine
      if (uploads.classRoutine) {
        console.log("Uploading classRoutine...");
        uploadPromises.push(
          uploadFileToStorage(
            uploads.classRoutine,
            "classRoutine",
            session.user.email
          )
        );
      }

      // Upload subjectList
      if (uploads.subjectList) {
        console.log("Uploading subjectList...");
        uploadPromises.push(
          uploadFileToStorage(
            uploads.subjectList,
            "subjectList",
            session.user.email
          )
        );
      }

      // Wait for all uploads to complete
      const results = await Promise.allSettled(uploadPromises);

      // Check results
      results.forEach((result, index) => {
        const fileType = index === 0 ? "classRoutine" : "subjectList";
        if (result.status === "rejected") {
          console.error(`Failed to upload ${fileType}:`, result.reason);
        } else if (result.value === null) {
          console.error(`Upload returned null for ${fileType}`);
        } else {
          console.log(`Successfully uploaded ${fileType}: ${result.value}`);
        }
      });

      // Continue to next page regardless of upload status
      // (you might want to add more sophisticated error handling here)
      console.log("Upload process complete. Redirecting...");
      window.location.href = "/onboarding/user/preferences";
    } catch (error) {
      console.error("Error during upload process:", error);
      // Decide whether to continue or show error to user
      // For now, continue to next page
      window.location.href = "/onboarding/user/preferences";
    }
  };

  useEffect(() => {
    if (uploads.classRoutine !== null && uploads.subjectList !== null) {
      setButtonEnabled(true);
    }
  }, [uploads]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-3">
      <div className="max-w-6xl w-full">
        <div className="mb-3">
          <Image src="/icons/logo.png" width={120} height={120} alt="logo" />
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 relative">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 relative">
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
                        onClick={() => triggerFileInput("classRoutineInput")}
                        className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                      >
                        <Upload className="w-4 h-4" />
                        Upload
                      </button>

                      <input
                        id="classRoutineInput"
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={handleFileInputChange("classRoutine")}
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
                        onClick={() => triggerFileInput("subjectListInput")}
                        className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                      >
                        <Upload className="w-4 h-4" />
                        Upload
                      </button>

                      <input
                        id="subjectListInput"
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={handleFileInputChange("subjectList")}
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
              {buttonEnabled ? (
                <>
                  <button
                    onClick={() => {
                      handleContinue();
                      window.location.href = "/onboarding/user/preferences";
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
                      window.location.href = "/onboarding/user/preferences";
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
    </div>
  );
};

export default UploadPage;
