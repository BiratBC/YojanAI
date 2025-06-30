import SessionWrapper from "@/components/SessionWrapper";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="">
      {children}
    </main>
  );
}
