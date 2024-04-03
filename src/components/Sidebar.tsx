"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getToken } from "@/utils/cookie";
import { PlaylistType, UserType } from "@/utils/types";
import Link from "next/link";
import Home from "@/assets/home.svg";
import Search from "@/assets/search.svg";
import Library from "@/assets/library.svg";
import Plus from "@/assets/plus.svg";
import Note from "@/assets/note.svg";

type SidebarProps = {
  user: UserType | null;
};

type AlbumType = {
  id: string;
  name: string;
  image: string;
  artist: string;
};

export default function Sidebar({ user }: SidebarProps) {
  const token = getToken();
  const path = usePathname();
  const [playlists, setPlaylists] = useState<Array<PlaylistType>>([]);
  const [albums, setAlbums] = useState<Array<AlbumType>>([]);
  const [full, setFull] = useState(true);
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchPlaylists = () => {
    fetch("https://api.spotify.com/v1/me/playlists?limit=20", {
      method: "GET",
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then(({ items }) => {
        let list: PlaylistType[] = [];
        items.forEach((item: any) =>
          list.push({
            id: item.id,
            name: item.name,
            image: item.images ? item.images[0].url : null,
            owner: item.owner.display_name,
          })
        );
        setPlaylists(list);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (token && playlists.length === 0) fetchPlaylists();
    if (token && albums.length === 0) {
      fetch("https://api.spotify.com/v1/me/albums?limit=20", {
        method: "GET",
        headers: { Authorization: "Bearer " + token },
      })
        .then((res) => res.json())
        .then(({ items }) => {
          let list: AlbumType[] = [];
          items.forEach((item: any) =>
            list.push({
              id: item.album.id,
              name: item.album.name,
              image: item.album.images[2].url,
              artist: item.album.artists[0].name,
            })
          );
          setAlbums(list);
        })
        .catch((err) => console.error(err));
    }
  }, [token]);

  const createNewPlaylist = () => {
    const body = {
      name: "New Playlist",
      description: "",
      public: true,
    };
    fetch(`https://api.spotify.com/v1/users/${user?.id}/playlists`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then(() => fetchPlaylists())
      .catch((err) => console.error(err));
  };

  const filteredPlaylists = playlists.filter((playlist) =>
    playlist.name.toLowerCase().includes(search.toLowerCase())
  );
  const filteredAlbums = albums.filter((album) =>
    album.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside
      className={`flex flex-col gap-2 
      ${full ? "min-w-[280px]" : "min-w-[72px]"}`}
    >
      <nav className="flex flex-col justify-around px-3 py-2 h-28 bg-spotify-base rounded-lg text-spotify-subtle font-bold">
        <Link
          href="/home"
          className={`flex gap-5 px-3 py-1 group hover:text-white transition-all duration-500 
          ${path === "/home" && "text-white"}`}
        >
          <Home
            className={`w-6 h-6 group-hover:fill-white transition-all duration-500
            ${path === "/home" ? "fill-white" : "fill-spotify-subtle"}`}
          />
          {full && <span>Home</span>}
        </Link>
        <Link
          href="/search"
          className={`flex gap-5 px-3 py-1 group hover:text-white transition-all duration-500
          ${path === "/search" && "text-white"}`}
        >
          <Search
            className={`w-6 h-6 group-hover:fill-white transition-all duration-500
            ${path === "/search" ? "fill-white" : "fill-spotify-subtle"}`}
          />
          {full && <span>Search</span>}
        </Link>
      </nav>
      <div className="flex flex-col h-[calc(100%-120px)] bg-spotify-base rounded-lg">
        <div className="flex items-center justify-between gap-2 min-h-14 px-4">
          <button
            onClick={() => setFull(!full)}
            className="flex gap-2.5 px-2 py-1 font-bold text-spotify-subtle hover:text-white group transition-all duration-500"
          >
            <Library className="w-6 h-6 fill-spotify-subtle group-hover:fill-white transition-all duration-500" />
            {full && <span>Your Library</span>}
          </button>
          {full && (
            <button
              onClick={createNewPlaylist}
              className="p-2 rounded-full hover:bg-spotify-highlight group"
            >
              <Plus className="w-4 h-4 fill-spotify-subtle group-hover:fill-white" />
            </button>
          )}
        </div>
        <div
          className={`overflow-y-auto hide-scrollbar
          ${full ? "p-2 pt-0" : "p-1"}`}
        >
          {full && (
            <button className="flex items-center w-fit ml-2 mb-2 focus-within:rounded focus-within:bg-[#2a2a2a] group">
              <div
                onClick={() => inputRef.current!.focus()}
                className="w-8 h-8 rounded-full p-[7px] hover:bg-[#2a2a2a]"
              >
                <Search className="fill-spotify-subtle group-hover:fill-white" />
              </div>
              <input
                ref={inputRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search in Your Library"
                className="w-0 bg-transparent font-bold text-xs text-spotify-subtle placeholder:text-spotify-subtle group-focus-within:w-36 transition-all duration-300"
              />
            </button>
          )}
          {playlists || albums ? (
            <>
              {filteredPlaylists.map((list) => (
                <Link
                  key={list.id}
                  href={"/playlist/" + list.id}
                  className={`flex gap-3 p-2 rounded hover:bg-spotify-highlight active:bg-black
                  ${path === "/playlist/" + list.id && "bg-[#232323]"}`}
                >
                  {list.image ? (
                    <img src={list.image} className="rounded w-12 h-12" />
                  ) : (
                    <Note className="rounded w-12 h-12 p-3 fill-[#b0b0b0] bg-[#282828]" />
                  )}
                  {full && (
                    <div className="flex flex-col justify-center gap-0.5">
                      <p className="text-[15px]">{list.name}</p>
                      <p className="text-xs text-spotify-gray font-semibold">
                        Playlist • {list.owner}
                      </p>
                    </div>
                  )}
                </Link>
              ))}
              {filteredAlbums.map((album) => (
                <Link
                  key={album.id}
                  href={"/album/" + album.id}
                  className={`flex gap-3 p-2 rounded hover:bg-spotify-highlight active:bg-black
                    ${path === "/album/" + album.id && "bg-[#232323]"}`}
                >
                  <img src={album.image} className="rounded w-12 h-12" />
                  {full && (
                    <div className="flex flex-col justify-center gap-0.5">
                      <p className="text-[15px]">{album.name}</p>
                      <p className="text-xs text-spotify-gray font-semibold">
                        Album • {album.artist}
                      </p>
                    </div>
                  )}
                </Link>
              ))}
            </>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </aside>
  );
}
