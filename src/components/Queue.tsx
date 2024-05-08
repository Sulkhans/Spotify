"use client";
import Link from "next/link";
import { TracksType } from "@/utils/types";
import Play from "@/assets/play.svg";

type queueProps = {
  queue: TracksType[] | null;
  setQueue: React.Dispatch<React.SetStateAction<TracksType[] | null>>;
};

export default function Queue({ queue, setQueue }: queueProps) {
  return (
    <div className="min-w-72 2xl:min-w-80 ml-2 bg-spotify-base rounded-lg">
      <h1 className="px-4 py-2 font-bold my-3">Queue</h1>
      <div className="p-2 pt-0 h-[calc(100%-64px)] overflow-y-auto hide-scrollbar">
        {queue ? (
          queue.map((track) => (
            <div
              key={track.id}
              className="flex justify-between items-center p-2 hover:bg-spotify-elevated-highlight rounded group"
            >
              <div className="flex items-center">
                <div className="mr-3 size-12 min-w-10 min-h-10 rounded relative overflow-hidden">
                  <img src={track.image} />
                  <Play className="size-12 p-2.5 fill-white absolute top-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100" />
                </div>
                <div className="flex flex-col justify-center gap-0.5">
                  <p className="leading-5 tracking-tight line-clamp-1">
                    {track.name}
                  </p>
                  <span className="text-sm leading-4 text-spotify-gray font-medium line-clamp-1">
                    {track.artists.map((artist, i) => (
                      <span key={artist.id}>
                        {i > 0 && <span className="mr-1">,</span>}
                        <Link
                          href={"/artist/" + artist.id}
                          className="hover:underline hover:text-white"
                        >
                          {artist.name}
                        </Link>
                      </span>
                    ))}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="font-bold px-2">
            Available for Spotify Premium users only
          </p>
        )}
      </div>
    </div>
  );
}
