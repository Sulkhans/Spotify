"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { setToken, getToken, removeToken } from "@/utils/cookie.js";
import { UserType } from "@/utils/types";
import Loading from "@/components/Loading";
import Spotify from "@/assets/spotify.svg";

export default function Auth() {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const token = getToken();

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
        .catch((err) => {
          if (token) {
            removeToken();
            router.refresh();
          }
          console.error(err);
        });
    } else {
      const getTokenFromHash = () => {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        return params.get("access_token");
      };
      const accessToken = getTokenFromHash();
      if (accessToken) {
        setToken(accessToken);
        router.replace("/");
      }
    }
    setLoading(false);
  }, [token]);

  const handleConnect = () => {
    const url = "https://accounts.spotify.com/authorize";
    const clientID = "8152586828ad44c49d71071b08e811b2";
    const redirectURL =
      "https://spotify-gsufz7mp7-sulkhans-projects.vercel.app";
    const scope = [
      "playlist-modify-private",
      "playlist-modify-public",
      "playlist-read-private",
      "user-library-modify",
      "user-library-read",
      "user-read-email",
      "user-read-private",
      "user-modify-playback-state",
      "user-read-playback-state",
      "user-read-currently-playing",
      "user-read-recently-played",
      "user-read-playback-position",
      "user-top-read",
      "streaming",
    ];
    window.location.href = `${url}?client_id=${clientID}&redirect_uri=${redirectURL}&scope=${scope.join(
      " "
    )}&response_type=token&show_daialog=true`;
  };

  const handleLogOut = () => {
    removeToken();
    window.location.reload();
  };

  return loading ? (
    <Loading />
  ) : (
    <div className="p-8 md:px-12 h-screen">
      <Spotify
        className="w-20 md:w-32 fill-white"
        onClick={() => router.push("/")}
      />
      <main className="py-8 h-[90%] flex flex-col items-center md:justify-center">
        {token ? (
          user && (
            <>
              <p className="text-3xl md:text-4xl font-bold">Logged in as</p>
              <div
                style={{ backgroundImage: `url(${user.image})` }}
                className={`size-28 bg-cover bg-center rounded-full mt-12 mb-4`}
              />
              <p>{user.name}</p>
              <button
                onClick={() => router.push("/home")}
                className="w-full md:max-w-72 rounded-full p-3 mb-8 mt-10 bg-spotify-green active:bg-spotify-press hover:scale-105 text-black font-bold tracking-wide"
              >
                Web Player
              </button>
              <button
                onClick={handleLogOut}
                className="font-semibold text-spotify-gray hover:text-white hover:scale-105"
              >
                Log Out
              </button>
            </>
          )
        ) : (
          <>
            <p className="text-3xl font-bold md:text-5xl">Log in to Spotify</p>
            <button
              onClick={handleConnect}
              className="w-full md:max-w-72 rounded-full p-3 my-8 md:mt-10 bg-spotify-green active:bg-spotify-press hover:scale-105 text-black font-semibold"
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
            <a href="https://www.spotify.com/signup" className="underline">
              Sign up for Spotify
            </a>
          </>
        )}
      </main>
    </div>
  );
}
