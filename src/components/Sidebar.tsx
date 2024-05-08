"use client";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { UserType } from "@/utils/types";
import Link from "next/link";
import Resizer from "./Resizer";
import Home from "@/assets/home.svg";
import HomeFilled from "@/assets/homeFilled.svg";
import Search from "@/assets/search.svg";
import LibraryFull from "@/assets/libraryFilled.svg";
import Library from "@/assets/library.svg";
import Plus from "@/assets/plus.svg";
import Note from "@/assets/note.svg";
import List from "@/assets/list.svg";

type SidebarProps = {
  token: string | null;
  user: UserType | null;
};

type PlaylistType = {
  id: string;
  name: string;
  image: string;
  owner: string;
};

type AlbumType = {
  id: string;
  name: string;
  image: string;
  artist: string;
};

export default function Sidebar({ token, user }: SidebarProps) {
  const path = usePathname();
  const [width, setWidth] = useState(280);
  const [data, setData] = useState<{
    playlists: PlaylistType[];
    albums: AlbumType[];
  }>({ playlists: [], albums: [] });
  const [playlists, setPlaylists] = useState<Array<PlaylistType>>([]);
  const [albums, setAlbums] = useState<Array<AlbumType>>([]);
  const [sortBy, setSortBy] = useState("Recents");
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
        setData((prev) => ({ ...prev, playlists: list }));
        setPlaylists(list);
      })
      .catch((err) => console.error(err));
  };

  const fetchAlbums = () => {
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
        setData((prev) => ({ ...prev, albums: list }));
        setAlbums(list);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (token) {
      fetchPlaylists();
      fetchAlbums();
    }
  }, [token]);

  const createNewPlaylist = () => {
    if (user) {
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
    }
  };

  useMemo(() => {
    setPlaylists(
      data.playlists.filter((playlist) =>
        playlist.name.toLowerCase().includes(search.toLowerCase())
      )
    );
    setAlbums(
      data.albums.filter((album) =>
        album.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search]);

  useMemo(() => {
    const { playlists, albums } = data;
    if (sortBy === "Alphabetical") {
      setPlaylists([...playlists].sort((a, b) => a.name.localeCompare(b.name)));
      setAlbums([...albums].sort((a, b) => a.name.localeCompare(b.name)));
    } else {
      setPlaylists(playlists);
      setAlbums(albums);
    }
  }, [sortBy]);

  return (
    <div className="flex relative">
      <aside className="flex flex-col gap-2" style={{ minWidth: `${width}px` }}>
        <nav className="flex flex-col justify-around px-3 py-2 h-28 bg-spotify-base rounded-lg text-spotify-subtle font-bold">
          <Link
            href="/home"
            className={`flex gap-5 px-3 py-1 group hover:text-white transition-all duration-500 
            ${path === "/home" && "text-white"}`}
          >
            {path === "/home" ? (
              <HomeFilled className="w-6 h-6 fill-white" />
            ) : (
              <Home className="w-6 h-6 fill-spotify-subtle group-hover:fill-white transition-all duration-500" />
            )}
            {width != 72 && <span>Home</span>}
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
            {width != 72 && <span>Search</span>}
          </Link>
        </nav>
        <div className="flex flex-col h-[calc(100%-120px)] bg-spotify-base rounded-lg">
          <div
            className={`flex items-center justify-between gap-2 px-4 
            ${width != 72 ? "min-h-14" : "min-h-10 mt-2 mb-0.5"}`}
          >
            <button
              onClick={() => (width === 72 ? setWidth(280) : setWidth(72))}
              className="flex gap-2.5 px-2 py-1 font-bold text-spotify-subtle hover:text-white group transition-all duration-500"
            >
              {width != 72 ? (
                <LibraryFull className="w-6 h-6 fill-spotify-subtle group-hover:fill-white transition-all duration-500" />
              ) : (
                <Library className="w-6 h-6 fill-spotify-subtle group-hover:fill-white transition-all duration-500" />
              )}
              {width != 72 && <span>Your Library</span>}
            </button>
            {width != 72 && (
              <button
                onClick={createNewPlaylist}
                className="p-2 rounded-full hover:bg-spotify-highlight group"
              >
                <Plus className="w-4 h-4 fill-spotify-subtle group-hover:fill-white" />
              </button>
            )}
          </div>
          <div
            className={`overflow-y-auto min-h-60 hide-scrollbar rounded-xl
            ${width != 72 ? "p-2 pt-0" : "p-1"}`}
          >
            {user && width != 72 && (
              <div className="relative flex items-center justify-between mb-2 pl-2">
                <button className="flex relative z-10 items-center w-fit rounded-full focus-within:rounded focus-within:bg-spotify-elevated-highlight group">
                  <div
                    onClick={() => inputRef.current!.focus()}
                    className="w-8 h-8 rounded-full p-[7px] hover:bg-spotify-elevated-highlight"
                  >
                    <Search className="fill-spotify-subtle group-hover:fill-white" />
                  </div>
                  <input
                    ref={inputRef}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search in Your Library"
                    className="w-0 bg-transparent font-bold text-xs text-spotify-subtle placeholder:text-spotify-subtle group-focus-within:w-[13.5rem] transition-all duration-300"
                  />
                </button>
                <div className="absolute right-4 group z-0">
                  <button className="flex items-center gap-1 h-8 hover:scale-105">
                    <p className="text-[13px] text-spotify-subtle group-hover:text-white">
                      {sortBy}
                    </p>
                    <List className="w-4 h-4 fill-spotify-subtle group-hover:fill-white" />
                  </button>
                  <div className="absolute top-9 -right-3 hidden rounded w-40 p-1 text-sm bg-[#282828] group-focus-within:flex flex-col">
                    <p className="text-xs text-spotify-subtle p-3">Sort by</p>
                    <button
                      onClick={() => setSortBy("Recents")}
                      className={`p-3 rounded text-start hover:bg-[#3e3e3e]
                      ${sortBy === "Recents" && "text-spotify-green"}`}
                    >
                      Recents
                    </button>
                    <button
                      onClick={() => setSortBy("Alphabetical")}
                      className={`p-3 rounded text-start hover:bg-[#3e3e3e]
                      ${sortBy === "Alphabetical" && "text-spotify-green"}`}
                    >
                      Alphabetical
                    </button>
                  </div>
                </div>
              </div>
            )}
            <>
              {playlists.length > 0 &&
                playlists.map((list) => (
                  <Link
                    key={list.id}
                    href={"/playlist/" + list.id}
                    className={`flex gap-3 p-2 rounded hover:bg-spotify-highlight active:bg-black
                    ${
                      path === "/playlist/" + list.id &&
                      width !== 72 &&
                      "bg-[#232323]"
                    }`}
                  >
                    {list.image ? (
                      <img src={list.image} className="rounded w-12 h-12" />
                    ) : (
                      <Note className="rounded w-12 h-12 p-3 fill-[#b0b0b0] bg-[#282828]" />
                    )}
                    {width != 72 && (
                      <div className="flex flex-col justify-center gap-0.5">
                        <p className="text-[15px] line-clamp-1">{list.name}</p>
                        <p className="text-xs text-spotify-gray font-semibold">
                          Playlist • {list.owner}
                        </p>
                      </div>
                    )}
                  </Link>
                ))}
              {albums.length > 0 &&
                albums.map((album) => (
                  <Link
                    key={album.id}
                    href={"/album/" + album.id}
                    className={`flex gap-3 p-2 rounded hover:bg-spotify-highlight active:bg-black
                    ${
                      path === "/album/" + album.id &&
                      width !== 72 &&
                      "bg-[#232323]"
                    }`}
                  >
                    <img src={album.image} className="rounded w-12 h-12" />
                    {width != 72 && (
                      <div className="flex flex-col justify-center gap-0.5">
                        <p className="text-[15px] line-clamp-1">{album.name}</p>
                        <p className="text-xs text-spotify-gray font-semibold">
                          Album • {album.artist}
                        </p>
                      </div>
                    )}
                  </Link>
                ))}
            </>
            {!user && width != 72 && (
              <div className="rounded-lg px-5 py-4 mt-2 bg-[#242424]">
                <p className="font-bold">Create your first playlist</p>
                <p className="text-sm py-2 mb-3.5">It's easy, we'll help you</p>
                <div className="my-1.5">
                  <Link
                    href={"/"}
                    className="rounded-full px-4 py-2 bg-white text-sm text-black font-bold"
                  >
                    Create playlist
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
      <Resizer minWidth={280} maxWidth={420} setWidth={setWidth} />
    </div>
  );
}
