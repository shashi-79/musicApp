"use client";

import { useEffect, useState } from "react"; // Import useEffect

import Suggestion from "./home/suggestion/page";
import Search from "./home/search/page";
import Upload from "./home/upload/page";
import Profile from "./home/profile/page";
import Setting from "./setting/page";

// Define the types for the tabs
type ActiveTab = "home" | "search" | "favorites" | "profile" | "upload";

const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("home");

  
  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <Suggestion />;
      case "search":
        return <Search />;
      case "favorites":
        return (
          <div className="text-center text-gray-700">
            <h2 className="text-2xl font-semibold">Favorites</h2>
            <p className="mt-2">Your saved favorites are here.</p>
          </div>
        );
      case "profile":
        return (
          <>
            <Profile />
            <Setting />
          </>
        );
      case "upload":
        return <Upload />;
      default:
        return null;
    }
  };

  return (
    <div className="flex w-full bg-black h-90">
      

      {/* side Navigation Bar for large screens */}
      <nav className="flex-none top-0  text-white shadow-lg md:flex hidden flex-col">
        <div className="flex flex-col py-3">
          <button
            onClick={() => setActiveTab("home")}
            className={`transition p-3 ${
              activeTab === "home"
                ? "text-blue-500 bg-gray-700"
                : "text-gray-400 hover:text-blue-300"
            } inline-block`}
          >
            <span className="text-xl">🏠</span> Home
          </button>
          <button
            onClick={() => setActiveTab("search")}
            className={`transition p-3 ${
              activeTab === "search"
                ? "text-blue-500 bg-gray-700"
                : "text-gray-400 hover:text-blue-300"
            } inline-block`}
          >
            <span className="text-xl">🔍</span> Search
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={`transition p-3 ${
              activeTab === "upload"
                ? "text-blue-500 bg-gray-700"
                : "text-gray-400 hover:text-blue-300"
            } inline-block`}
          >
            <span className="text-xl">➕</span> Upload
          </button>
          <button
            onClick={() => setActiveTab("favorites")}
            className={`transition p-3 ${
              activeTab === "favorites"
                ? "text-blue-500 bg-gray-700"
                : "text-gray-400 hover:text-blue-300"
            } inline-block`}
          >
            <span className="text-xl">❤️</span> Favorites
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`transition p-3 ${
              activeTab === "profile"
                ? "text-blue-500 bg-gray-700"
                : "text-gray-400 hover:text-blue-300"
            } inline-block`}
          >
            <span className="text-xl">👤</span> Profile
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 w-3/4 align-middle items-center mb-[50px] animate-fade-in">
        {renderContent()}
      </div>

      {/* Bottom Navigation Bar for small screens */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-gray-800 text-white shadow-lg">
        <div className="flex justify-around py-3">
          <button
            onClick={() => setActiveTab("home")}
            className={`transition ${
              activeTab === "home"
                ? "text-blue-500 scale-110"
                : "text-gray-400 hover:text-blue-300"
            } inline-block`}
          >
            <span className="text-xl">🏠</span>
          </button>
          <button
            onClick={() => setActiveTab("search")}
            className={`transition ${
              activeTab === "search"
                ? "text-blue-500 scale-110"
                : "text-gray-400 hover:text-blue-300"
            } inline-block`}
          >
            <span className="text-xl">🔍</span>
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={`transition ${
              activeTab === "upload"
                ? "text-blue-500 scale-110"
                : "text-gray-400 hover:text-blue-300"
            } inline-block`}
          >
            <span className="text-xl">➕</span>
          </button>
          <button
            onClick={() => setActiveTab("favorites")}
            className={`transition ${
              activeTab === "favorites"
                ? "text-blue-500 scale-110"
                : "text-gray-400 hover:text-blue-300"
            } inline-block`}
          >
            <span className="text-xl">❤️</span>
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`transition ${
              activeTab === "profile"
                ? "text-blue-500 scale-110"
                : "text-gray-400 hover:text-blue-300"
            } inline-block`}
          >
            <span className="text-xl">👤</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Home;
