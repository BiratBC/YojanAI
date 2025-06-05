import Navbar from "@/components/Navbar";
import SessionWrapper from "@/components/SessionWrapper";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="">
  
        <div className="navbar fixed top-0 z-50 w-full bg-white shadow-md">
            <Navbar/>
        </div>
      {children}
    </main>
  );
}
