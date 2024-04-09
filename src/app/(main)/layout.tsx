"use client";
import { useRouter } from "next/navigation";
import { getToken, removeToken } from "@/utils/cookie";
import Player from "@/components/Player";
import Sidebar from "@/components/Sidebar";
import { UserType } from "@/utils/types";
import { useEffect, useState } from "react";
import Arrow from "@/assets/arrow.svg";
import Link from "next/link";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const route = useRouter();
  const token = getToken();
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    if (token) {
      fetch("https://api.spotify.com/v1/me", {
        method: "GET",
        headers: { Authorization: "Bearer " + token },
      })
        .then((res) => res.json())
        .then(({ id, display_name, email, images }) =>
          setUser({ id, name: display_name, email, image: images[1].url })
        )
        .catch((err) => console.error(err));
    }
  }, [token]);

  return (
    <div className="w-screen h-[100dvh] p-2 flex flex-col gap-2 bg-black">
      <div className="flex gap-2 h-[calc(100%-80px)]">
        <Sidebar token={token} user={user} />
        <div className="w-full h-full rounded-lg relative bg-spotify-base">
          <header className="flex justify-between py-4 px-5">
            <div>
              <button
                onClick={() => route.back()}
                className="size-8 p-2 mr-2 rounded-full bg-[rgba(0,0,0,.7)]"
              >
                <Arrow className="fill-white" />
              </button>
              <button
                onClick={() => route.forward()}
                className="size-8 p-2 rounded-full bg-[rgba(0,0,0,.7)]"
              >
                <Arrow className="fill-white rotate-180" />
              </button>
            </div>
            {user ? (
              <button className="flex justify-center items-center size-8 rounded-full bg-[rgba(0,0,0,.7)] relative group">
                <div
                  style={{ backgroundImage: `url(${user?.image})` }}
                  className="size-6 bg-center bg-cover rounded-full"
                />
                <div className="absolute top-10 right-0 hidden rounded w-32 p-1 text-sm bg-[#282828] group-focus-within:flex flex-col">
                  <a
                    href="https://www.spotify.com/account/overview/"
                    className="p-2.5 rounded text-start hover:bg-[#3e3e3e]"
                  >
                    Account
                  </a>
                  <div
                    onClick={() => {
                      removeToken();
                      route.replace("/");
                    }}
                    className="p-2.5 rounded text-start hover:bg-[#3e3e3e]"
                  >
                    Log out
                  </div>
                </div>
              </button>
            ) : (
              <div>
                <a
                  href="https://www.spotify.com/signup"
                  className="font-bold text-spotify-gray hover:text-white p-2 mr-6"
                >
                  Sign up
                </a>
                <Link
                  href={"/"}
                  className="px-6 py-2 rounded-full font-bold text-black bg-white hover:scale-105"
                >
                  Log in
                </Link>
              </div>
            )}
          </header>
          <main className="max-h-[calc(100%-64px)] px-5 py-2 overflow-y-auto hide-scrollbar">
            {children}
          </main>
        </div>
      </div>
      <Player token={token} />
    </div>
  );
}
