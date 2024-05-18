"use client";
import Link from "next/link";
import { useEffect } from "react";
import { usePlayback } from "@/context/playbackContext";
import Play from "@/assets/play.svg";

export default function Queue({ token }: { token: string }) {
  const { playback, queue, setQueue } = usePlayback();

  useEffect(() => {
    if (!queue) {
      fetch("https://api.spotify.com/v1/me/player/queue", {
        method: "GET",
        headers: { Authorization: "Bearer " + token },
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.queue) {
            const q = json.queue.map((item: any) => ({
              id: item.id,
              name: item.name,
              duration: item.duration_ms,
              artists: item.artists,
              image: item.album.images[2].url,
              album: { id: item.album.id, name: item.album.name },
            }));
            setQueue(q);
          }
        })
        .catch((err) => console.error(err));
    }
  }, []);

  return (
    <div className="min-w-72 2xl:min-w-80 ml-2 bg-spotify-base rounded-lg">
      <h1 className="px-4 py-2 font-bold my-3">Queue</h1>
      <div className="p-2 pt-0 h-[calc(100%-64px)] overflow-y-auto hide-scrollbar">
        {playback && (
          <div>
            <div>
              <p className="p-2 font-bold">Currently playing</p>
              <div className="flex justify-between items-center p-2 hover:bg-spotify-elevated-highlight rounded group">
                <div className="flex items-center">
                  <div className="mr-3 size-12 min-w-10 min-h-10 rounded relative overflow-hidden">
                    <img src={playback.track.image} />
                  </div>
                  <div className="flex flex-col justify-center gap-0.5 w-48 2xl:w-56 overflow-hidden">
                    <p className="leading-5 tracking-tight whitespace-nowrap text-spotify-green">
                      {playback.track.name}
                    </p>
                    <div className="flex text-sm leading-4 whitespace-nowrap text-spotify-gray font-medium">
                      {playback.track.artists.map((artist, i) => (
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {queue ? (
              <div>
                <p className="p-2 font-bold">Next up</p>
                {queue.map((track, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center p-2 hover:bg-spotify-elevated-highlight rounded group"
                  >
                    <div className="flex items-center">
                      <div className="mr-3 size-12 min-w-10 min-h-10 rounded relative overflow-hidden">
                        <img src={track.image} />
                        <Play className="size-12 p-3 fill-white absolute top-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100" />
                      </div>
                      <div className="flex flex-col justify-center gap-0.5 w-48 2xl:w-56 overflow-hidden">
                        <p className="leading-5 tracking-tight whitespace-nowrap">
                          {track.name}
                        </p>
                        <div className="flex text-sm leading-4 whitespace-nowrap text-spotify-gray font-medium">
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
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>Spotify Premium users only</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
