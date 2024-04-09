"use client";
import { useEffect, useState } from "react";
import { getToken } from "@/utils/cookie";
import { ArtistsType } from "@/utils/types";
import Search from "@/assets/search.svg";

type AlbumType = {
  id: string;
  name: string;
  image: string;
  artists: ArtistsType[];
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

type resultsType = {
  albums: AlbumType[];
  playlists: PlaylistType[];
  tracks: TrackType[];
};

export default function page() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<resultsType | null>(null);
  const token = getToken();

  useEffect(() => {
    if (token && search.length > 0) {
      fetch(
        `https://api.spotify.com/v1/search?q=${search}&type=album%2Ctrack%2Cplaylist&limit=5`,
        {
          method: "GET",
          headers: { Authorization: "Bearer " + token },
        }
      )
        .then((res) => res.json())
        .then(({ albums, tracks, playlists }) => {
          const albumsRes = albums.items.map((album: any) => ({
            id: album.id,
            name: album.name,
            artists: album.artists,
            image: album.images[1].url,
          }));
          const tracksRes = tracks.items.map((track: any) => ({
            id: track.id,
            name: track.name,
            artists: track.artists,
            image: track.album.images[2].url,
            duration: track.duration,
          }));
          const playlistsRes = playlists.items.map((list: any) => ({
            id: list.id,
            name: list.name,
            owner: list.owner.display_name,
            image: list.images[0].url,
          }));
          setResults({
            albums: albumsRes,
            tracks: tracksRes,
            playlists: playlistsRes,
          });
        })
        .catch((err) => console.error(err));
    } else setResults(null);
  }, [search]);

  return (
    <div>
      <div className="flex items-center max-w-96 p-3.5 bg-[#242424] hover:bg-[#2a2a2a] rounded-full group focus-within:ring-2 ring-white">
        <Search className="w-5 h-5 fill-spotify-subtle group-hover:fill-white group-focus-within:fill-white" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="What do you want to play?"
          className="ml-2 bg-transparent w-full text-sm text-white placeholder:text-neutral-500"
        />
      </div>
      {results &&
        results.albums.length === 0 &&
        results.playlists.length === 0 &&
        results.tracks.length === 0 && (
          <div>No results found for "{search}"</div>
        )}
    </div>
  );
}
