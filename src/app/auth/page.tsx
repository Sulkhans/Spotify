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
  ) : token ? (
    <div>yay</div>
  ) : (
    <div>
      <Spotify className=" fill-white" />
      <button onClick={handleConnect}>connect</button>
    </div>
  );
}
