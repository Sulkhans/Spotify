export type UserType = {
  id: string;
  name: string;
  email: string;
  image: string;
};

type ArtistsType = {
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
