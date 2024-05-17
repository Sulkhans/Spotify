"use client";
import { createContext, useContext, useState } from "react";

type contextType = {
  data: {
    playlists: PlaylistType[];
    albums: AlbumType[];
  };
  setData: React.Dispatch<
    React.SetStateAction<{
      playlists: PlaylistType[];
      albums: AlbumType[];
    }>
  >;
};

const LibraryContext = createContext<contextType>({
  data: {
    playlists: [],
    albums: [],
  },
  setData: () => {},
});

export type PlaylistType = {
  id: string;
  name: string;
  image: string;
  owner: string;
};

export type AlbumType = {
  id: string;
  name: string;
  image: string;
  artist: string;
};

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<{
    playlists: PlaylistType[];
    albums: AlbumType[];
  }>({ playlists: [], albums: [] });
  return (
    <LibraryContext.Provider value={{ data, setData }}>
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  return useContext(LibraryContext);
}
