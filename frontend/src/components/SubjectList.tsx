"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getSignedFileUrl } from "@/lib/helpers";

const SubjectListComponent = () => {
  const { data: session, status } = useSession();
  const [subjectList, setSubjectList] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sanitizedEmail = session?.user?.email?.replace(/[@.]/g, "_");
  const [fileUrls, setFileUrls] = useState<{
    subjectList: string | null;
  }>({
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
      // Use your Next.js API endpoint instead of calling Django directly
      const djangoBackendUrl = 'http://localhost:8080';
      const response = await fetch(
        `${djangoBackendUrl}/api/extract-subject-list?email=${email}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials : "include"
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to extract subjects");
      }

      const data = await response.json();
      setSubjectList(data.data); // Assuming the extracted data is in data.data
      console.log("Extracted subjects:", data.data);
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
      // Get signed URLs for files
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

  const renderExtractedSubjects = () => {
    if (!subjectList) return null;

    // Handle different data structures
    if (Array.isArray(subjectList)) {
      return (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-3">Extracted Subjects:</h4>
          <div className="space-y-2">
            {subjectList.map((subject: any, index: number) => (
              <div key={index} className="p-2 bg-white rounded border">
                {typeof subject === 'string' ? subject : subject.name || JSON.stringify(subject)}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Handle object structure
    return (
      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <h4 className="font-semibold text-green-800 mb-3">Extracted Subjects:</h4>
        <pre className="bg-white p-3 rounded border text-sm overflow-auto">
          {JSON.stringify(subjectList, null, 2)}
        </pre>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="space-y-6">
        {/* File Display Section */}
        {fileUrls.subjectList && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Subject List Document</h3>
            <div className="space-y-4">
              <a
                href={fileUrls.subjectList}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-blue-600 hover:underline"
              >
                View Subject List Document
              </a>
              
              {/* Embed document in iframe */}
              <div className="border rounded-lg overflow-hidden">
                <iframe
                  src={fileUrls.subjectList}
                  width="100%"
                  height="600px"
                  title="Subject List"
                  className="border-0"
                />
              </div>
            </div>
          </div>
        )}

        {/* Extract Subjects Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Extract Subject Information</h3>
          <p className="text-gray-600 mb-4">
            Click the button below to automatically extract subject information from your uploaded document.
          </p>
          
          <button
            onClick={handleExtractSubjects}
            disabled={loading || !session?.user?.email}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              loading || !session?.user?.email
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
            } text-white`}
          >
            {loading ? 'Extracting...' : 'Extract Subjects'}
          </button>

          {/* Error Display */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">Error: {error}</p>
            </div>
          )}

          {/* Success Display */}
          {renderExtractedSubjects()}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Processing your document...</p>
          </div>
        )}

        {/* No session warning */}
        {!session?.user?.email && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">Please log in to extract subjects from your documents.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectListComponent;