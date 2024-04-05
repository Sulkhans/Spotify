"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Previous from "@/assets/previous.svg";
import Next from "@/assets/next.svg";
import Pause from "@/assets/pause.svg";
import Play from "@/assets/play.svg";
import Shuffle from "@/assets/shuffle.svg";
import Repeat from "@/assets/repeat.svg";

type PlayerProps = {
  token: string | null;
};

type PlaybackType = {
  is_playing: boolean;
  progress: number;
  track: {
    id: string;
    name: string;
    image: string;
    duration: number;
    artists: { id: string; name: string }[];
    album_id: string;
  };
};

export default function Player({ token }: PlayerProps) {
  const [playback, setPlayback] = useState<PlaybackType | null>(null);
  const fetchPlayback = () => {
    fetch("https://api.spotify.com/v1/me/player", {
      method: "GET",
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then(({ is_playing, progress_ms, item }) => {
        let artists: any = [];
        item.artists.forEach((artist: any) =>
          artists.push({ id: artist.id, name: artist.name })
        );
        setPlayback({
          is_playing,
          progress: progress_ms,
          track: {
            id: item.id,
            name: item.name,
            image: item.album.images[2].url,
            duration: item.duration_ms,
            artists,
            album_id: item.album.id,
          },
        });
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (token) fetchPlayback();
  }, [token]);

  const format = (ms: any) => {
    if (ms) {
      const min = Math.floor(ms / 60000);
      const sec = Math.floor((ms % 60000) / 1000)
        .toFixed(0)
        .padStart(2, "0");
      return min + ":" + sec;
    }
    return "0:00";
  };

  return (
    <footer className="min-h-[72px] flex justify-between items-center">
      <div className="flex grow items-center">
        <img src={playback?.track.image} className="w-14 h-14 rounded mx-2" />
        <div className="ml-2 font-medium">
          <Link
            href={"/album/" + playback?.track.album_id}
            className="text-sm hover:underline"
          >
            {playback?.track.name}
          </Link>
          <div className="flex text-xs text-spotify-gray">
            {playback?.track.artists.map((artist, i) => (
              <p key={artist.id}>
                {i > 0 && <span className="mr-1">,</span>}
                <Link
                  href={"/artist/" + artist.id}
                  className="hover:underline hover:text-white"
                >
                  {artist.name}
                </Link>
              </p>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col grow">
        <div className="flex mb-2 m-auto">
          <button className="size-8 p-2 group">
            <Shuffle className="fill-spotify-subtle group-hover:fill-white" />
          </button>
          <button className="size-8 p-2 ml-2 group">
            <Previous className="fill-spotify-subtle group-hover:fill-white" />
          </button>
          <button className="size-8 p-2 mx-4 bg-white rounded-full hover:scale-105">
            {playback?.is_playing ? <Pause /> : <Play />}
          </button>
          <button className="size-8 p-2 mr-2 group">
            <Next className="fill-spotify-subtle group-hover:fill-white" />
          </button>
          <button className="size-8 p-2 group">
            <Repeat className="fill-spotify-subtle group-hover:fill-white" />
          </button>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-spotify-subtle">
          <span>{format(playback?.progress)}</span>
          <div className="w-full h-1 rounded-full bg-[#4d4d4d] group">
            <div className="h-full w-20 rounded-full bg-white group-hover:bg-spotify-green relative">
              <div className="hidden group-hover:block size-3 rounded-full bg-white absolute -top-1 -right-1.5" />
            </div>
          </div>
          <span>{format(playback?.track.duration)}</span>
        </div>
      </div>
      <div className="grow"></div>
    </footer>
  );
}
