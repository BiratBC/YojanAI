
"use client"
import React, {useEffect, useState} from 'react'
import { getSignedFileUrl } from '@/lib/helpers';
import { useSession } from 'next-auth/react';

const ClassRoutineComponent = () => {
  const { data: session, status } = useSession();
       const sanitizedEmail = session?.user?.email?.replace(/[@.]/g, '_');
      const [fileUrls, setFileUrls] = useState<{
         classRoutine: string | null;
       }>({
         classRoutine: null,
       });
     
     useEffect(() => {
     if (session?.user?.email) {
       loadUserFiles();
     }
   }, [session])
   const loadUserFiles = async () => {
     try {
       // Get signed URLs for both files
       const classRoutineUrl = await getSignedFileUrl(`${sanitizedEmail}/classRoutine.png`);
       
       setFileUrls({
         classRoutine: classRoutineUrl,
       });
     } catch (error) {
       console.error('Error loading files:', error);
     }
   };
     
   return (
     <>
 <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-3xl font-bold text-blue-600 mb-2">Class Routine</h3>

      </div>
 
       {/* Embed PDF in iframe (optional) */}
       {fileUrls.classRoutine && (
         <iframe
           src={fileUrls.classRoutine}
           width="100%"
           height="600px"
           title="Class Routine"
         />
       )}
     
     </>
   )
}

export default ClassRoutineComponent
