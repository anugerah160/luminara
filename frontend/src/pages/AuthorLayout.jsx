import React from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "../components/Author/Sidebar"
import Header from "../components/Author/Header"

export default function AuthorLayout() {
  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
