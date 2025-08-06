"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getSignedFileUrl } from "@/lib/helpers";

const SubjectListComponent = () => {
  const { data: session } = useSession();
  const [subjectList, setSubjectList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sanitizedEmail = session?.user?.email?.replace(/[@.]/g, "_");
  const [fileUrls, setFileUrls] = useState<{ subjectList: string | null }>({
    subjectList: null,
  });

  useEffect(() => {
    if (session?.user?.email) {
      loadUserFiles();
    }
  }, [session]);

  const getSubjectList = async (email: string) => {
    if (!email) {
      setError("Email is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:8080/api/extract-subject-list?email=${email}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to extract subjects");
      }

      const data = await response.json();
      console.log("Raw response data:", data);
      const parsedSubjectList = JSON.parse(data.data)
      setSubjectList(parsedSubjectList); // Only expect array of subject objects
      console.log(data.data);
  
      
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Error extracting subjects:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadUserFiles = async () => {
    if (!sanitizedEmail) return;

    try {
      const subjectListUrl = await getSignedFileUrl(
        `${sanitizedEmail}/subjectList.png`
      );

      setFileUrls({
        subjectList: subjectListUrl,
      });
    } catch (error) {
      console.error("Error loading files:", error);
    }
  };

  const handleExtractSubjects = () => {
    if (session?.user?.email) {
      getSubjectList(session.user.email);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      

      {/* Extract Button */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Extract Subject Information</h3>
        <p className="text-gray-600 mb-4">
          Click below to extract subject information from your uploaded document.
        </p>
        <button
          onClick={handleExtractSubjects}
          disabled={loading || !session?.user?.email}
          className={`px-6 py-3 rounded-lg font-medium text-white transition-colors ${
            loading || !session?.user?.email
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Extracting..." : "Extract Subjects"}
        </button>
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">Error: {error}</p>
          </div>
        )}
      </div>

      {/* Displaying Extracted subjects in card format */}
      {Array.isArray(subjectList) && subjectList.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-green-700 mb-4">
            Extracted Subjects
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subjectList.map((subject, index) => (
              <div
                key={index}
                className="border p-4 rounded-lg bg-gray-50 shadow-sm"
              >
                <h4 className="font-semibold text-gray-800 mb-1">
                  {subject["Subject"] || "Unnamed Subject"}
                  {console.log(subject)}
                  
                </h4>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Code:</span>{" "}
                  {subject["Subject Code"] || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Credit:</span>{" "}
                  {subject["Credit"] ?? "N/A"}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <p className="text-blue-600 font-semibold">
              Total Subjects: {subjectList.length}
            </p>
          </div>
        </div>
      )}

      {/* raw json format for debuggin */}
      {/* {subjectList.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Raw JSON</h3>
          <pre className="bg-gray-50 p-4 rounded text-sm text-gray-800 overflow-auto max-h-96">
            {JSON.stringify(subjectList, null, 2)}
          </pre>
        </div>
      )} */}


      {/* file preview */}
      {fileUrls.subjectList && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Subject List Document</h3>
          <a
            href={fileUrls.subjectList}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline mb-4 block"
          >
            View Subject List Document
          </a>
        </div>
      )}

      {loading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Processing your document...</p>
        </div>
      )}
    </div>
  );
};

export default SubjectListComponent;
