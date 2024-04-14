export type UserType = {
  id: string;
  name: string;
  email: string;
  image: string;
};

export type ArtistsType = {
  id: string;
  name: string;
};

export type AlbumType = {
  id: string;
  name: string;
  artists: Array<ArtistsType>;
  image: string;
  release_date: string;
  total_tracks: number;
  tracks: Array<{
    id: string;
    name: string;
    artists: Array<ArtistsType>;
    duration: number;
    track_number: number;
  }>;
};

export type PlaylistType = {
  id: string;
  name: string;
  owner: string;
  image: string;
  followers: number;
  tracks: Array<{
    id: string;
    name: string;
    image: string;
    artists: Array<ArtistsType>;
    album: { id: string; name: string };
    duration: number;
    added_at: string;
  }>;
  total_tracks: number;
};

export type ArtistType = {
  name: string;
  image: string;
  albums: {
    id: string;
    name: string;
    image: string;
    artists: Array<ArtistsType>;
    release_date: string;
  }[];
  topTracks: {
    id: string;
    name: string;
    duration: number;
    artists: Array<ArtistsType>;
    image: string;
  }[];
};
