"use client";
import Link from "next/link";
import Home from "@/assets/home.svg";
import Search from "@/assets/search.svg";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const path = usePathname();
  return (
    <aside className="flex flex-col gap-2 min-w-[280px]">
      <nav className="flex flex-col justify-around px-3 py-2 min-h-28 bg-spotify-base rounded-lg text-spotify-subtle font-bold">
        <Link
          href="/home"
          className={`flex gap-5 px-3 py-1 group hover:text-white transition-all duration-500 
          ${path === "/home" && "text-white"}`}
        >
          <Home
            className={`w-6 h-6 group-hover:fill-white transition-all duration-500
            ${path === "/home" ? "fill-white" : "fill-spotify-subtle"}`}
          />
          Home
        </Link>
        <Link
          href="/search"
          className={`flex gap-5 px-3 py-1 group hover:text-white transition-all duration-500
          ${path === "/search" && "text-white"}`}
        >
          <Search
            className={`w-6 h-6 group-hover:fill-white transition-all duration-500
            ${path === "/search" ? "fill-white" : "fill-spotify-subtle"}`}
          />
          Search
        </Link>
      </nav>
      <div className="flex flex-col h-full bg-spotify-base rounded-lg">
        <div></div>
        <div></div>
      </div>
    </aside>
  );
}
