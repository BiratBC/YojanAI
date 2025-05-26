"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card , CardHeader, CardContent, CardTitle, CardDescription, CardFooter} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NextRequest } from "next/server";

export default function Home() {

  const [selectedFile, setSelectedFile] = useState(null as File | null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      console.log("Selected file:", file);
    }
  };

  const onSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedFile);
    const response = await fetch("http://localhost:3000/api/upload", {
      method: "POST",
      body: formData
    });
    if (!response.ok) {
  // Handle HTTP errors (like 404, 500)
  const text = await response.text(); // might not be JSON
  console.error("Server error:", text);
}
  };

  return (
    <>
    <div className="h-full">
        <Card>
      <CardHeader>
        <CardTitle className="text-lg">Upload your file</CardTitle>
        <CardDescription>File size should not exceed 10MB</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center space-y-4">
        <div className="w-full grid gap-0.5">
          <Label htmlFor="file">Choose a file</Label>
          <Input id="file" type="file" onChange={handleFileChange} />
        </div>
        <Button className="m-2" onClick={onSubmit}>Submit</Button>
      </CardContent>
    </Card>
    </div>
    
    </>
  );
}
