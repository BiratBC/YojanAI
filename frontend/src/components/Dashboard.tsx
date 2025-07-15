"use client"
import React from 'react'
import { logout } from "@/lib/actions/auth";

const Dashboard = ({session}: any) => {
  return (
    <div>
      <div>
      Only access if user is logged in and set to onboard = true,{" "}
      {session?.user?.name}
      <div className="secondary-nav hidden lg:flex gap-5 items-center">
        <img
          src={
            session?.user?.image ??
            "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
          }
          alt=""
          width={48}
          height={48}
          className="rounded-3xl"
        />
        {session?.user?.name}
        <button
          onClick={() => logout()}
          className="group inline-flex h-12 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-200 hover:text-gray-900"
        >
          Logout
        </button>
      </div>
    </div>
    </div>
  )
}

export default Dashboard
