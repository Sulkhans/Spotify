"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getToken } from "@/utils/cookie";
import { ArtistsType } from "@/utils/types";
import SearchSVG from "@/assets/search.svg";
import Play from "@/assets/play.svg";
import Artist from "@/assets/artist.svg";
import Loading from "@/components/Loading";

type AlbumType = {
  id: string;
  name: string;
  image: string;
  artists: ArtistsType[];
  date: string;
};

type PlaylistType = {
  id: string;
  name: string;
  image: string;
  owner: string;
};

type TrackType = {
  id: string;
  name: string;
  artists: ArtistsType[];
  image: string;
  duration: number;
};

type ArtistType = {
  id: string;
  name: string;
  image: string;
};

type resultsType = {
  albums: AlbumType[];
  playlists: PlaylistType[];
  tracks: TrackType[];
  artists: ArtistType[];
};

export default function Search() {
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<resultsType | null>(null);
  const token = getToken();
  const router = useRouter();

  useEffect(() => {
    if (token && search.replaceAll(" ", "").length > 0) {
      setLoading(true);
      setResults(null);
      fetch(
        `https://api.spotify.com/v1/search?q=${search}&type=album%2Ctrack%2Cplaylist%2Cartist&limit=5`,
        {
          method: "GET",
          headers: { Authorization: "Bearer " + token },
        }
      )
        .then((res) => res.json())
        .then(({ albums, tracks, playlists, artists }) => {
          const albumsRes = albums.items.map((album: any) => ({
            id: album.id,
            name: album.name,
            artists: album.artists,
            image: album.images[1].url,
            date: album.release_date,
          }));
          const tracksRes = tracks.items.map((track: any) => ({
            id: track.id,
            name: track.name,
            artists: track.artists,
            image: track.album.images[2].url,
            duration: track.duration_ms,
          }));
          const playlistsRes = playlists.items.map((list: any) => ({
            id: list.id,
            name: list.name,
            owner: list.owner.display_name,
            image: list.images[0].url,
          }));
          const artistsRes = artists.items.map((artist: any) => ({
            id: artist.id,
            name: artist.name,
            image: artist.images.length > 1 ? artist.images[1].url : null,
          }));
          setResults({
            albums: albumsRes,
            tracks: tracksRes,
            playlists: playlistsRes,
            artists: artistsRes,
          });
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    } else setResults(null);
  }, [search]);

  const format = (ms: number) => {
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000)
      .toFixed(0)
      .padStart(2, "0");
    return min + ":" + sec;
  };

  return (
    <div>
      <div className="flex items-center max-w-96 p-3.5 mb-4 bg-[#242424] hover:bg-[#2a2a2a] rounded-full group focus-within:ring-2 ring-white">
        <SearchSVG className="w-5 h-5 fill-spotify-subtle group-hover:fill-white group-focus-within:fill-white" />
        <input
          autoFocus
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="What do you want to play?"
          className="ml-2 bg-transparent w-full text-sm text-white placeholder:text-neutral-500"
        />
      </div>
      {loading && <Loading />}
      {results?.tracks && results.tracks.length > 0 && (
        <section>
          <h1 className="mb-2 text-2xl font-bold text-white tracking-tighter">
            Songs
          </h1>
          <div>
            {results.tracks.map((track) => (
              <div
                key={track.id}
                className="flex justify-between items-center p-2 hover:bg-spotify-elevated-highlight rounded group"
              >
                <div className="flex items-end">
                  <div className="mr-3 size-10 min-w-10 min-h-10 rounded relative overflow-hidden">
                    <img src={track.image} />
                    <Play className="size-10 p-2.5 fill-white absolute top-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100" />
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
                <p className="text-sm text-spotify-gray font-medium">
                  {format(track.duration)}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
      {results?.artists && results.artists.length > 0 && (
        <section className="mt-8">
          <h1 className="mb-2 text-2xl font-bold text-white tracking-tighter">
            Artists
          </h1>
          <div className="flex">
            {results.artists.map((artist) => (
              <div
                key={artist.id}
                onClick={() => router.push("/artist/" + artist.id)}
                className="flex-1 p-3 hover:bg-spotify-highlight rounded-md max-w-52 cursor-pointer"
              >
                {artist.image ? (
                  <img
                    src={artist.image}
                    className="rounded-full min-w-20 aspect-square object-cover"
                  />
                ) : (
                  <div className="flex justify-center items-center rounded-full aspect-square bg-[#333333]">
                    <Artist className="fill-white size-8 md:size-12 lg:size-16" />
                  </div>
                )}
                <p className="line-clamp-1 tracking-tight mt-2">
                  {artist.name}
                </p>
                <span className="text-sm text-spotify-gray">Artist</span>
              </div>
            ))}
          </div>
        </section>
      )}
      {results?.albums && results.albums.length > 0 && (
        <section className="mt-8">
          <h1 className="mb-2 text-2xl font-bold text-white tracking-tighter">
            Albums
          </h1>
          <div className="flex">
            {results.albums.map((album) => (
              <div
                key={album.id}
                onClick={() => router.push("/album/" + album.id)}
                className="p-3 hover:bg-spotify-highlight rounded-md max-w-52 cursor-pointer"
              >
                <img src={album.image} className="rounded-md min-w-20" />
                <p className="line-clamp-1 tracking-tight mt-2">{album.name}</p>
                <span className="text-sm text-spotify-gray font-medium">
                  <span>{album.date.substring(0, 4)} • </span>
                  {album.artists.map((artist, i) => (
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
            ))}
          </div>
        </section>
      )}
      {results?.playlists && results.playlists.length > 0 && (
        <section className="mt-8">
          <h1 className="mb-2 text-2xl font-bold text-white tracking-tighter">
            Playlists
          </h1>
          <div className="flex">
            {results.playlists.map((list) => (
              <div
                key={list.id}
                onClick={() => router.push("/playlist/" + list.id)}
                className="flex gap-2 flex-col flex-1 p-3 hover:bg-spotify-highlight rounded-md max-w-52 cursor-pointer"
              >
                <img
                  src={list.image}
                  className="rounded-md min-w-20 aspect-square object-cover"
                />
                <p className="line-clamp-1 tracking-tight">{list.name}</p>
                <span className="text-sm text-spotify-gray font-medium">
                  By {list.owner}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
      {!loading &&
        results?.albums.length === 0 &&
        results.playlists.length === 0 &&
        results.tracks.length === 0 && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center">
            <p className="text-2xl font-bold mb-2">
              No results found for "{search}"
            </p>
            <p>
              Please make sure your words are spelled correctly, or use fewer or
              different keywords.
            </p>
          </div>
        )}
    </div>
  );
}
