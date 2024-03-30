"use client";
import { useEffect, useState } from "react";
import { setToken, getToken } from "@/cookie.js";
import Loading from "@/components/Loading";
//@ts-ignore
import Spotify from "@/assets/spotify.svg";

export default function Auth() {
  const [loading, setLoading] = useState(true);
  const token = getToken();

  useEffect(() => {
    if (!token) {
      const getTokenFromHash = () => {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        return params.get("access_token");
      };
      const accessToken = getTokenFromHash();
      if (accessToken) setToken(accessToken);
    }
    setLoading(false);
  }, []);

  const handleConnect = () => {
    const url = "https://accounts.spotify.com/authorize";
    const clientID = "8152586828ad44c49d71071b08e811b2";
    const redirectURL = "http://localhost:3000/auth/";
    const scope = [
      "user-read-email",
      "user-read-private",
      "user-modify-playback-state",
      "user-read-playback-state",
      "user-read-currently-playing",
      "user-read-recently-played",
      "user-read-playback-position",
      "user-top-read",
    ];
    window.location.href = `${url}?client_id=${clientID}&redirect_uri=${redirectURL}&scope=${scope.join(
      " "
    )}&response_type=token&show_daialog=true`;
  };
  return loading ? (
    <Loading />
  ) : (
    <div className="p-8 md:px-12 h-screen">
      <Spotify className="w-20 md:w-32 fill-white" />
      <main className="py-8 h-[90%] flex flex-col items-center md:justify-center">
        {token ? (
          <></>
        ) : (
          <>
            <p className="text-3xl font-bold md:text-5xl">Log in to Spotify</p>
            <button
              onClick={handleConnect}
              className="w-full md:max-w-80 rounded-full p-3 px-8 my-8 md:mt-10 bg-spotify-green active:bg-spotify-press hover:scale-105 text-black font-semibold"
            >
              Connect to Spotify
            </button>
            <a
              href="https://accounts.spotify.com/en/password-reset"
              className="underline"
            >
              Forgot your password?
            </a>
            <hr className="w-full md:w-2/3 my-8 border-[#292929]" />
            <p className="text-spotify-gray mb-1">Don't have an account?</p>
            <a href="https://www.spotify.com/ge/signup" className="underline">
              Sign up for Spotify
            </a>
          </>
        )}
      </main>
    </div>
  );
}
