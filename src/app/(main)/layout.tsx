"use client";
import { getToken } from "@/utils/cookie";
import Player from "@/components/Player";
import Sidebar from "@/components/Sidebar";
import { UserType } from "@/utils/types";
import { useEffect, useState } from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        <main className="w-full">{children}</main>
      </div>
      <Player />
    </div>
  );
}
