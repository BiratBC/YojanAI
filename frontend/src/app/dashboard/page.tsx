import React from "react";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import DashboardComponent from "@/components/Dashboard";

const Dashboard = async () => {
  const session: any = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }
  return (
    <>
    <DashboardComponent session={session}/>
    </>
  );
};

export default Dashboard;
