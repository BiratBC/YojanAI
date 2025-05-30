"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const Upload = () => {
  const [message, setMessage] = useState({
    message: "",
  });

  const getResponse = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/upload/");
      console.log(response.data);
      setMessage(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      <button onClick={getResponse}>Click Here</button>
      <div className="response">{message?.message}</div>
    </div>
  );
};

export default Upload;
