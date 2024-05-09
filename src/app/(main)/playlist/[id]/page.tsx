"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FastAverageColor } from "fast-average-color";
import { PlaylistType } from "@/utils/types";
import { getToken } from "@/utils/cookie";
import Loading from "@/components/Loading";
import Time from "@/assets/time.svg";
import Note from "@/assets/note.svg";
import Play from "@/assets/play.svg";

export default function Playlist({ params }: { params: { id: string } }) {
  const [playlist, setPlaylist] = useState<PlaylistType | null>(null);
  const [color, setColor] = useState<any>(null);
  const token = getToken();

  useEffect(() => {
    if (!playlist) {
      fetch(`https://api.spotify.com/v1/playlists/${params.id}`, {
        method: "GET",
        headers: { Authorization: "Bearer " + token },
      })
        .then((res) => res.json())
        .then(({ id, name, images, owner, followers, tracks }) => {
          const tracklist = tracks.items.map((item: any) => ({
            id: item.id,
            name: item.track.name,
            image: item.track.album.images[2].url,
            artists: item.track.artists,
            album: { id: item.track.album.id, name: item.track.album.name },
            duration: item.track.duration_ms,
            added_at: item.added_at,
          }));
          setPlaylist({
            id,
            name,
            image: images ? images[0].url : null,
            owner: owner.display_name,
            followers: followers.total,
            total_tracks: tracks.total,
            tracks: tracklist,
          });
        })
        .catch((err) => console.error(err));
    }
  }, []);

  useEffect(() => {
    if (playlist) {
      const fac = new FastAverageColor();
      fac.getColorAsync(playlist.image).then((color) => setColor(color));
    }
  }, [playlist]);

  const totalDuration = useMemo(() => {
    if (playlist) {
      const total = playlist.tracks.reduce(
        (sum, curr) => sum + curr.duration,
        0
      );
      const hr = Math.floor(total / 3600000);
      const min = Math.floor(total / 60000) % 60;
      return `${hr}hr ${min}min`;
    }
    return "0h 0m";
  }, [playlist]);

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

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  const playPlaylist = () => {
    fetch("https://api.spotify.com/v1/me/player/play", {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        context_uri: `spotify:playlist:${params.id}`,
        position_ms: 0,
      }),
    }).catch((err) => console.error(err));
  };

  return playlist ? (
    <div>
      <div style={{ backgroundColor: color ? color.hex : "" }}>
        <div
          className="flex items-end p-6 pt-20"
          style={{
            background: "linear-gradient(transparent 0%, rgba(0,0,0,0.5) 95%)",
          }}
        >
          {playlist.image ? (
            <img
              src={playlist.image}
              className="rounded mr-6 size-40 md:size-44 lg:size-56"
              style={{ boxShadow: "0 4px 60px rgba(0,0,0,.5)" }}
            />
          ) : (
            <Note
              className="rounded mb-4 sm:mr-6 sm:mb-0 size-40 md:size-44 lg:size-56 p-12 lg:p-20 fill-[#7f7f7f] bg-[#282828]"
              style={{ boxShadow: "0 4px 60px rgba(0,0,0,.5)" }}
            />
          )}
          <div>
            <p className="text-sm">Playlist</p>
            <p className="py-2 text-3xl md:text-5xl lg:text-7xl font-black tracking-tight text-balance">
              {playlist.name}
            </p>
            <div className="text-sm mt-2">
              <span>{playlist.owner}</span>
              <span className="before:content-['_•_'] after:content-['_•_']">
                {playlist.followers} like
              </span>
              <span>{playlist.total_tracks} songs, </span>
              <span>{totalDuration}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="relative">
        <div
          className="w-full h-56 absolute top-0"
          style={{ backgroundColor: color ? color.hex : "" }}
        >
          <div
            className="size-full"
            style={{
              background: "linear-gradient(rgba(0,0,0,.6), #121212)",
            }}
          />
        </div>
        <div className="relative p-6 pb-2">
          <button
            onClick={playPlaylist}
            className="size-14 rounded-full bg-spotify-green hover:scale-105"
          >
            <Play className="size-6 m-auto" />
          </button>
        </div>
        <div className="mb-4 pt-5 px-6 relative">
          <div className="grid grid-cols-[16px_1fr_16px] lg:grid-cols-[16px_40px_2fr_1fr_88px_1fr] gap-4 items-center h-9 pl-4 pr-12 text-spotify-gray font-medium">
            <span className="place-self-center">#</span>
            <span className="text-sm lg:col-span-2">Title</span>
            <span className="hidden text-sm lg:block">Album</span>
            <span className="hidden text-sm lg:block">Date added</span>
            <Time className="size-4 fill-spotify-gray place-self-end self-center" />
          </div>
          <hr className="opacity-25 border-spotify-gray" />
        </div>
        <div className="relative px-6 pb-6">
          {playlist.tracks.map((track, i) => (
            <div
              key={i}
              className="grid grid-cols-[16px_40px_minmax(200px,1fr)_40px] lg:grid-cols-[16px_40px_2fr_1fr_88px_1fr] gap-4 h-14 items-center rounded pl-4 pr-12 text-spotify-gray hover:bg-white hover:bg-opacity-10"
            >
              <p className="place-self-center font-medium">{i + 1}</p>
              <img src={track.image} className="rounded" />
              <div>
                <p className="leading-[22px] text-white line-clamp-1">
                  {track.name}
                </p>
                <div className="flex text-sm">
                  {track.artists.map((artist, i) => (
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
              <Link
                href={"/album/" + track.album.id}
                className="hidden lg:block text-sm hover:underline hover:text-white"
              >
                <span className="line-clamp-1">{track.album.name}</span>
              </Link>
              <p className="hidden text-sm lg:block">
                {formatDate(track.added_at)}
              </p>
              <p className="text-sm text-right">{format(track.duration)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
}
