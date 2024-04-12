"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PlaylistType } from "@/utils/types";
import { getToken } from "@/utils/cookie";
import Loading from "@/components/Loading";
import Time from "@/assets/time.svg";

export default function Playlist({ params }: { params: { id: string } }) {
  const [playlist, setPlaylist] = useState<PlaylistType | null>(null);
  const token = getToken();

  useEffect(() => {
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
          image: images[0].url,
          owner: owner.display_name,
          followers: followers.total,
          total_tracks: tracks.total,
          tracks: tracklist,
        });
      })
      .catch((err) => console.error(err));
  }, []);

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

  return playlist ? (
    <div>
      <div className="flex flex-col items-center mb-5 sm:flex-row sm:items-end lg:mt-4">
        <img
          src={playlist.image}
          className="rounded mb-4 sm:mr-6 sm:mb-0 size-40 md:size-44 lg:size-56"
        />
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
      <div className="mb-4">
        <div className="grid grid-cols-[16px_1fr_16px] lg:grid-cols-[16px_40px_2fr_1fr_88px_1fr] gap-4 items-center h-9 pl-4 pr-12 text-spotify-gray font-medium">
          <span className="place-self-center">#</span>
          <span className="text-sm lg:col-span-2">Title</span>
          <span className="hidden text-sm lg:block">Album</span>
          <span className="hidden text-sm lg:block">Date added</span>
          <Time className="size-4 fill-spotify-gray place-self-end self-center" />
        </div>
        <hr className="opacity-25 border-spotify-gray" />
      </div>
      <div>
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
  ) : (
    <Loading />
  );
}
