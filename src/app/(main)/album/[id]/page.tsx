"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AlbumType } from "@/utils/types";
import { getToken } from "@/utils/cookie";
import Loading from "@/components/Loading";
import Time from "@/assets/time.svg";

export default function Album({ params }: { params: { id: string } }) {
  const [album, setAlbum] = useState<AlbumType | null>(null);
  const token = getToken();

  useEffect(() => {
    fetch(`https://api.spotify.com/v1/albums/${params.id}`, {
      method: "GET",
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then(
        ({ id, name, artists, images, release_date, total_tracks, tracks }) => {
          const tracklist = tracks.items.map((track: any) => ({
            id: track.id,
            name: track.name,
            artists: track.artists,
            duration: track.duration_ms,
            track_number: track.track_number,
          }));
          setAlbum({
            id,
            name,
            artists,
            image: images[0].url,
            release_date,
            total_tracks,
            tracks: tracklist,
          });
        }
      );
  }, []);

  const totalDuration = useMemo(() => {
    if (album) {
      const total = album.tracks.reduce((sum, curr) => sum + curr.duration, 0);
      const hr = Math.floor(total / 3600000);
      const min = Math.floor(total / 60000) % 60;
      return `${hr}hr ${min}min`;
    }
    return "0h 0m";
  }, [album]);

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

  return album ? (
    <div>
      <div className="flex flex-col items-center mb-5 sm:flex-row sm:items-end lg:mt-4">
        <img
          src={album.image}
          className="rounded mb-4 sm:mr-6 sm:mb-0 size-40 md:size-44 lg:size-56"
        />
        <div>
          <p className="text-sm">Album</p>
          <p className="py-2 text-3xl md:text-5xl lg:text-7xl font-black tracking-tight text-balance">
            {album.name}
          </p>
          <div className="text-sm mt-2">
            {album.artists.map((artist) => (
              <Link
                href={"/artist/" + artist.id}
                className="font-bold hover:underline"
              >
                {artist.name}
              </Link>
            ))}
            <span className="before:content-['_•_'] after:content-['_•_']">
              {album.release_date.substring(0, 4)}
            </span>
            <span>{album.total_tracks} songs, </span>
            <span>{totalDuration}</span>
          </div>
        </div>
      </div>
      <div className="mb-4">
        <div className="grid grid-cols-[16px_1fr_16px] gap-4 items-center h-9 pl-4 pr-12 text-spotify-gray font-medium">
          <span className="place-self-center">#</span>
          <span className="text-sm">Title</span>
          <Time className="size-4 fill-spotify-gray" />
        </div>
        <hr className="opacity-25 border-spotify-gray" />
      </div>
      <div>
        {album.tracks.map((track) => (
          <div
            key={track.id}
            className="grid grid-cols-[16px_minmax(200px,1fr)_40px] gap-4 h-14 items-center rounded pl-4 pr-12 text-spotify-gray hover:bg-white hover:bg-opacity-10"
          >
            <p className="place-self-center">{track.track_number}</p>
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
            <p className="text-sm text-right">{format(track.duration)}</p>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <Loading />
  );
}
