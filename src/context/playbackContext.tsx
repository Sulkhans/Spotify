"use client";
import { createContext, useContext, useState } from "react";
import { ArtistsType, TracksType } from "@/utils/types";

type contextType = {
  playback: PlaybackType | null;
  setPlayback: React.Dispatch<React.SetStateAction<PlaybackType | null>>;
  queue: TracksType[] | null;
  setQueue: React.Dispatch<React.SetStateAction<TracksType[] | null>>;
};

const PlaybackContext = createContext<contextType>({
  playback: null,
  setPlayback: () => {},
  queue: null,
  setQueue: () => {},
});

type PlaybackType = {
  is_playing: boolean;
  progress: number;
  track: {
    id: string;
    name: string;
    image: string;
    duration: number;
    artists: ArtistsType[];
    album_id: string;
  };
  shuffle: boolean;
  repeat: boolean;
};

export function PlaybackProvider({ children }: { children: React.ReactNode }) {
  const [playback, setPlayback] = useState<PlaybackType | null>(null);
  const [queue, setQueue] = useState<TracksType[] | null>(null);
  return (
    <PlaybackContext.Provider
      value={{ playback, setPlayback, queue, setQueue }}
    >
      {children}
    </PlaybackContext.Provider>
  );
}

export function usePlayback() {
  return useContext(PlaybackContext);
}
