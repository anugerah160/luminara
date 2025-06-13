import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Author/Sidebar";
import Header from "../components/Author/Header";

export default function AuthorLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Fungsi untuk toggle sidebar
    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
    };

    // Effect untuk menangani responsiveness
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) { // Sembunyikan di tablet dan mobile
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };
        
        handleResize(); // Atur state awal
        window.addEventListener('resize', handleResize);
        
        // Cleanup listener saat komponen dibongkar
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="flex w-full min-h-screen bg-gray-100 font-sans">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header toggleSidebar={toggleSidebar} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}