// import { NextRequest, NextResponse } from 'next/server';
// export async function GET(request : NextRequest) {
//   const { searchParams } = new URL(request.url);
//   const email = searchParams.get('email');

//   if (!email) {
//     return NextResponse.json(
//       { error: 'Email parameter is required' },
//       { status: 400 }
//     );
//   }

//   try {
//     const djangoBackendUrl ='http://localhost:8000';
//     const backendResponse = await fetch(
//       `${djangoBackendUrl}/extract-subject-list?email=${encodeURIComponent(email)}`,
//       {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           // Add authentication if needed
//         },
//       }
//     );

//     if (!backendResponse.ok) {
//       const errorData = await backendResponse.json().catch(() => ({}));
//       return NextResponse.json(
//         {
//           error: errorData.error || 'Failed to extract subjects',
//           details: errorData
//         },
//         { status: backendResponse.status }
//       );
//     }

//     const data = await backendResponse.json();
//     return NextResponse.json(data);

//   } catch (error : any) {
//     console.error('Error calling Django backend:', error);
//     return NextResponse.json(
//       { 
//         error: 'Internal server error',
//         message: error.message 
//       },
//       { status: 500 }
//     );
//   }
// }