"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArtistsType, TracksType } from "@/utils/types";
import Previous from "@/assets/previous.svg";
import Next from "@/assets/next.svg";
import Pause from "@/assets/pause.svg";
import Play from "@/assets/play.svg";
import Shuffle from "@/assets/shuffle.svg";
import Repeat from "@/assets/repeat.svg";
import Queue from "@/assets/queue.svg";
import Devices from "@/assets/device.svg";
import Volume from "@/assets/volume.svg";

type PlayerProps = {
  token: string | null;
  showQueue: boolean;
  setShowQueue: React.Dispatch<React.SetStateAction<boolean>>;
  queue: TracksType[] | null;
  setQueue: React.Dispatch<React.SetStateAction<TracksType[] | null>>;
};

type PlaybackType = {
  is_playing: boolean;
  progress: number;
  track: {
    id: string;
    name: string;
    image: string;
    duration: number;
    artists: ArtistsType[];
    album_id: string;
  };
};

export default function Player({
  token,
  showQueue,
  setShowQueue,
  queue,
  setQueue,
}: PlayerProps) {
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

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (playback && playback.is_playing) {
      if (playback.progress < playback.track.duration - 1000) {
        interval = setInterval(() => {
          setPlayback((prev) =>
            prev ? { ...prev, progress: prev.progress + 1000 } : null
          );
        }, 1000);
      } else {
        fetchPlayback();
        if (queue) setQueue(() => queue.slice(1));
      }
    }
    return () => clearInterval(interval);
  }, [playback]);

  const pausePlayback = () => {
    fetch("https://api.spotify.com/v1/me/player/pause", {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    }).catch((err) => console.error(err));
    setPlayback((prev) => (prev ? { ...prev, is_playing: false } : null));
  };

  const skipToNext = () => {
    fetch("https://api.spotify.com/v1/me/player/next", {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(() => fetchPlayback())
      .catch((err) => console.error(err));
  };

  const skipToPrevious = () => {
    fetch("https://api.spotify.com/v1/me/player/previous", {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(() => fetchPlayback())
      .catch((err) => console.error(err));
  };

  const format = (ms: any) => {
    if (ms) {
      const min = Math.floor(ms / 60000);
      const sec = Math.floor((ms % 60000) / 1000)
        .toFixed(0)
        .padStart(2, "0");
      return min + ":" + sec;
    }
    return "-:--";
  };

  return (
    <footer className="min-h-[72px] flex justify-between items-center">
      <div className="flex items-center min-w-44 w-[30%]">
        {playback?.track && (
          <>
            <img
              src={playback?.track.image}
              className="w-14 h-14 rounded mx-2"
            />
            <div className="ml-2 font-medium w-[calc(100%-110px)] overflow-hidden">
              <Link
                href={"/album/" + playback?.track.album_id}
                className="text-sm hover:underline text-nowrap"
              >
                {playback?.track.name}
              </Link>
              <div className="flex text-xs text-spotify-gray">
                {playback?.track.artists.map((artist, i) => (
                  <p key={artist.id} className="text-nowrap">
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
          </>
        )}
      </div>
      <div className="flex flex-col w-[40%]">
        <div className="flex mb-2 m-auto">
          <button className="size-8 p-2 group">
            <Shuffle
              className={`fill-spotify-subtle 
              ${playback?.track ? "group-hover:fill-white" : "opacity-35"}`}
            />
          </button>
          <button onClick={skipToPrevious} className="size-8 p-2 ml-2 group">
            <Previous
              className={`fill-spotify-subtle 
              ${playback?.track ? "group-hover:fill-white" : "opacity-35"}`}
            />
          </button>{" "}
          {playback?.is_playing ? (
            <button
              className={`size-8 p-2 mx-4 bg-white rounded-full hover:scale-105
              ${!playback?.track && "opacity-35"}`}
              onClick={pausePlayback}
            >
              <Pause />
            </button>
          ) : (
            <button
              className={`size-8 p-2 mx-4 bg-white rounded-full hover:scale-105
              ${!playback?.track && "opacity-35"}`}
            >
              <Play />
            </button>
          )}
          <button onClick={skipToNext} className="size-8 p-2 mr-2 group">
            <Next
              className={`fill-spotify-subtle 
              ${playback?.track ? "group-hover:fill-white" : "opacity-35"}`}
            />
          </button>
          <button className="size-8 p-2 group">
            <Repeat
              className={`fill-spotify-subtle 
              ${playback?.track ? "group-hover:fill-white" : "opacity-35"}`}
            />
          </button>
        </div>
        <div className="flex justify-center items-center gap-2 text-xs font-medium text-spotify-subtle">
          <span>{format(playback?.progress)}</span>
          <div className="w-[80%] h-1 mx-0.5 rounded-full bg-[#4d4d4d] group">
            {playback?.track && (
              <div
                className="h-full w-0 rounded-full bg-white group-hover:bg-spotify-green relative"
                style={{
                  width:
                    (playback.progress / playback.track.duration) * 100 + "%",
                }}
              >
                <div className="hidden group-hover:block size-3 rounded-full bg-white absolute -top-1 -right-1.5" />
              </div>
            )}
          </div>
          <span className="text-nowrap whitespace-nowrap">
            {format(playback?.track.duration)}
          </span>
        </div>
      </div>
      <div className="w-[30%] flex justify-end pr-4">
        <button
          className="size-8 p-2 group"
          onClick={() => setShowQueue(!showQueue)}
        >
          <Queue
            className={
              showQueue
                ? "fill-spotify-green"
                : "fill-spotify-subtle group-hover:fill-white"
            }
          />
        </button>
        <button className="size-8 p-2 group">
          <Devices
            className={`fill-spotify-subtle 
              ${playback?.track ? "group-hover:fill-white" : "opacity-35"}`}
          />
        </button>
        <div className="flex items-center">
          <button className="size-8 p-2 group">
            <Volume
              className={`fill-spotify-subtle 
              ${playback?.track ? "group-hover:fill-white" : "opacity-35"}`}
            />
          </button>
          <div className="w-20 h-1 mx-0.5 rounded-full bg-[#4d4d4d] group">
            {playback?.track && (
              <div className="h-full w-full rounded-full bg-white group-hover:bg-spotify-green relative">
                <div className="hidden group-hover:block size-3 rounded-full bg-white absolute -top-1 -right-1.5" />
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
