"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getToken } from "@/utils/cookie";
import { ArtistType } from "@/utils/types";
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";

export default function Album({ params }: { params: { id: string } }) {
  const [artist, setArtist] = useState<ArtistType | null>(null);
  const [trackCount, setTrackCount] = useState(5);
  const token = getToken();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artistRes, topTracksRes, albumsRes] = await Promise.all([
          fetch(`https://api.spotify.com/v1/artists/${params.id}`, {
            method: "GET",
            headers: { Authorization: "Bearer " + token },
          }),
          fetch(`https://api.spotify.com/v1/artists/${params.id}/top-tracks`, {
            method: "GET",
            headers: { Authorization: "Bearer " + token },
          }),
          fetch(
            `https://api.spotify.com/v1/artists/${params.id}/albums?include_groups=album&limit=50`,
            {
              method: "GET",
              headers: { Authorization: "Bearer " + token },
            }
          ),
        ]);
        const [artist, tracksJSON, albumsJSON] = await Promise.all([
          artistRes.json(),
          topTracksRes.json(),
          albumsRes.json(),
        ]);
        const topTracks = tracksJSON.tracks.map((track: any) => ({
          id: track.id,
          name: track.name,
          duration: track.duration_ms,
          image: track.album.images[2].url,
          artists: track.artists,
        }));
        const albums = albumsJSON.items.map((album: any) => ({
          id: album.id,
          name: album.name,
          image: album.images[1].url,
          artists: album.artists,
          release_date: album.release_date,
        }));
        setArtist({
          name: artist.name,
          image: artist.images[0].url,
          topTracks: topTracks,
          albums: albums,
        });
      } catch (err) {
        console.error(err);
      }
    };
    if (!artist) fetchData();
  }, []);

  const format = (ms: number) => {
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000)
      .toFixed(0)
      .padStart(2, "0");
    return min + ":" + sec;
  };

  return artist ? (
    <div>
      <div className="flex flex-col items-center p-6 pt-20 mb-5 sm:flex-row sm:items-end bg-neutral-900">
        <img
          src={artist.image}
          className="rounded-full aspect-square mb-4 sm:mr-6 sm:mb-0 size-40 md:size-44 lg:size-56"
        />
        <p className="py-2 text-3xl md:text-5xl lg:text-8xl font-black tracking-tight text-balance">
          {artist.name}
        </p>
      </div>
      <section>
        <h1 className="mb-4 px-6 text-2xl font-bold text-white tracking-tighter">
          Popular
        </h1>
        {artist.topTracks.slice(0, trackCount).map((track, i) => (
          <div
            key={track.id}
            className="grid grid-cols-[16px_40px_minmax(200px,1fr)_40px] gap-4 h-14 items-center rounded pl-4 pr-12 mx-3 text-spotify-gray hover:bg-white hover:bg-opacity-10"
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
            <p className="text-sm text-right">{format(track.duration)}</p>
          </div>
        ))}
      </section>
      <button
        onClick={() => setTrackCount(trackCount === 5 ? 10 : 5)}
        className="mb-6 ml-3 p-4 text-sm text-spotify-gray font-bold hover:text-white"
      >
        {trackCount === 5 ? "See more" : "Show less"}
      </button>
      <section>
        <h1 className="mb-2 ml-6 text-2xl font-bold text-white tracking-tighter">
          Albums
        </h1>
        <div className="overflow-x-auto hide-scrollbar mb-4 mx-3">
          <div className="flex w-0">
            {artist.albums.map((album) => (
              <div
                key={album.id}
                onClick={() => router.push("/album/" + album.id)}
                className="p-3 hover:bg-spotify-highlight rounded-md cursor-pointer"
              >
                <img
                  src={album.image}
                  className="rounded-md aspect-square min-w-28 md:min-w-36 lg:min-w-44"
                />
                <p className="line-clamp-1 tracking-tight mt-2">{album.name}</p>
                <span className="text-sm text-spotify-gray font-medium">
                  {album.release_date.substring(0, 4)} • Album
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  ) : (
    <Loading />
  );
}
