"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLibrary } from "@/context/libraryContext";
import { usePlayback } from "@/context/playbackContext";
import { FastAverageColor } from "fast-average-color";
import { AlbumType } from "@/utils/types";
import { getToken } from "@/utils/cookie";
import Loading from "@/components/Loading";
import Time from "@/assets/time.svg";
import Play from "@/assets/play.svg";
import Save from "@/assets/save.svg";
import Saved from "@/assets/saved.svg";

export default function Album({ params }: { params: { id: string } }) {
  const { data, setData } = useLibrary();
  const { setQueue } = usePlayback();
  const [album, setAlbum] = useState<AlbumType | null>(null);
  const [color, setColor] = useState<any>(null);
  const token = getToken();

  useEffect(() => {
    if (!album) {
      fetch(`https://api.spotify.com/v1/albums/${params.id}`, {
        method: "GET",
        headers: { Authorization: "Bearer " + token },
      })
        .then((res) => res.json())
        .then(
          ({
            id,
            name,
            artists,
            images,
            release_date,
            total_tracks,
            tracks,
          }) => {
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
        )
        .catch((err) => console.error(err));
    }
  }, []);

  useEffect(() => {
    if (album) {
      const fac = new FastAverageColor();
      fac.getColorAsync(album.image).then((color) => setColor(color));
    }
  }, [album]);

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

  const playAlbum = () => {
    fetch("https://api.spotify.com/v1/me/player/play", {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        context_uri: `spotify:album:${params.id}`,
        position_ms: 0,
      }),
    }).catch((err) => console.error(err));
  };

  const saveAlbum = () => {
    fetch(`https://api.spotify.com/v1/me/albums?ids=${album?.id}`, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids: [album?.id] }),
    })
      .then(() =>
        setData((prev) => ({
          ...prev,
          albums: [
            ...prev.albums,
            {
              id: album!.id,
              name: album!.name,
              artist: album!.artists[0].name,
              image: album!.image,
            },
          ],
        }))
      )
      .catch((err) => console.error(err));
  };

  const removeAlbum = () => {
    fetch(`https://api.spotify.com/v1/me/albums?ids=${album?.id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids: [album?.id] }),
    })
      .then(() =>
        setData((prev) => ({
          ...prev,
          albums: prev.albums.filter((item) => item.id !== album!.id),
        }))
      )
      .catch((err) => console.error(err));
  };

  const addTrackToQueue = (i: number) => {
    const track = album?.tracks[i];
    fetch(
      `https://api.spotify.com/v1/me/player/queue?uri=spotify%3Atrack%3A${track?.id}`,
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      }
    )
      .then(() => {
        setQueue((prev) => {
          const q = prev;
          q?.unshift({
            id: track!.id,
            name: track!.name,
            artists: track!.artists,
            duration: track!.duration,
            album: { id: album!.id, name: album!.name },
            image: album!.image,
          });
          return q;
        });
      })
      .catch((err) => console.error(err));
  };

  return album ? (
    <div>
      <div style={{ backgroundColor: color ? color.hex : "" }}>
        <div
          className="flex items-end p-6 pt-20"
          style={{
            background: "linear-gradient(transparent 0%, rgba(0,0,0,0.5) 95%)",
          }}
        >
          <img
            src={album.image}
            className="rounded mr-6 size-40 md:size-44 lg:size-56"
            style={{ boxShadow: "0 4px 60px rgba(0,0,0,.5)" }}
          />
          <div>
            <p className="text-sm">Album</p>
            <p className="py-2 text-3xl md:text-5xl lg:text-7xl font-black tracking-tight text-balance">
              {album.name}
            </p>
            <div className="text-sm mt-2">
              {album.artists.map((artist) => (
                <Link
                  key={artist.id}
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
        <div className="relative flex items-center gap-7 p-6 pb-2">
          <button
            onClick={playAlbum}
            className="size-14 rounded-full bg-spotify-green hover:scale-105"
          >
            <Play className="size-5 m-auto" />
          </button>
          {data.albums.some((i) => i.id === album.id) ? (
            <button onClick={removeAlbum} className="size-8 hover:scale-105">
              <Saved className="size-8 fill-spotify-green" />
            </button>
          ) : (
            <button onClick={saveAlbum} className="size-8 hover:scale-105">
              <Save className="size-8 fill-spotify-gray hover:fill-white" />
            </button>
          )}
        </div>
        <div className="mb-4 pt-5 px-6 relative">
          <div className="grid grid-cols-[16px_1fr_16px] gap-4 items-center h-9 pl-4 pr-12 text-spotify-gray font-medium">
            <span className="place-self-center">#</span>
            <span className="text-sm">Title</span>
            <Time className="size-4 fill-spotify-gray" />
          </div>
          <hr className="opacity-25 border-spotify-gray" />
        </div>
        <div className="relative px-6 pb-6">
          {album.tracks.map((track, i) => (
            <div
              key={track.id}
              onDoubleClick={() => addTrackToQueue(i)}
              className="grid grid-cols-[16px_minmax(200px,1fr)_40px] gap-4 h-14 items-center rounded pl-4 pr-12 text-spotify-gray hover:bg-white hover:bg-opacity-10"
            >
              <p className="place-self-center font-medium">
                {track.track_number}
              </p>
              <div className="overflow-hidden">
                <p className="leading-[22px] text-white line-clamp-1">
                  {track.name}
                </p>
                <div className="flex text-sm">
                  {track.artists.map((artist, i) => (
                    <p key={artist.id} className="whitespace-nowrap">
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
    </div>
  ) : (
    <Loading />
  );
}
