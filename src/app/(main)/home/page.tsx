"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TracksType } from "@/utils/types";
import { getToken } from "@/utils/cookie";
import Loading from "@/components/Loading";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [tracklist, setTracklist] = useState<Array<TracksType> | null>(null);
  const router = useRouter();
  const token = getToken();

  useEffect(() => {
    fetch(
      "https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=30",
      {
        method: "GET",
        headers: { Authorization: "Bearer " + token },
      }
    )
      .then((res) => res.json())
      .then((json: any) => {
        const tracks = json.items.map((item: any) => ({
          id: item.id,
          name: item.name,
          duration: item.duration_ms,
          artists: item.artists,
          image: item.album.images[1].url,
          album: { id: item.album.id, name: item.album.name },
        }));
        setTracklist(tracks);
      })
      .catch((err) => console.error(err));
    setLoading(false);
  }, []);

  const albumIDs = new Set();
  const filteredAlbums = tracklist?.filter((track) => {
    const isUnique = !albumIDs.has(track.album.id);
    albumIDs.add(track.album.id);
    return isUnique;
  });

  return loading ? (
    <Loading />
  ) : (
    <div className="flex flex-col gap-4 pt-16">
      {filteredAlbums && (
        <>
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-3 mb-6 px-6 text-xs sm:text-sm font-semibold text-balance cursor-pointer">
            {filteredAlbums.slice(0, 8).map((track) => (
              <div
                key={track.album.id}
                onClick={() => router.push("/album/" + track.album.id)}
                className="rounded overflow-hidden bg-[#ffffff12] hover:bg-[#ffffff33] flex gap-3 items-center transition-all"
              >
                <img src={track.image} className="size-12 lg:size-14" />
                <p className="line-clamp-2">{track.album.name}</p>
              </div>
            ))}
          </section>
          <section>
            <h1 className="mb-2 px-6 text-2xl font-bold text-white tracking-tighter">
              Recommended for today
            </h1>
            <div className="overflow-x-auto hide-scrollbar mb-4 px-3">
              <div className="flex w-0">
                {filteredAlbums
                  .slice(8, (filteredAlbums.length + 8) / 2)
                  .map((track) => (
                    <div
                      key={track.album.id}
                      onClick={() => router.push("/album/" + track.album.id)}
                      className="p-3 hover:bg-spotify-highlight rounded-md cursor-pointer"
                    >
                      <img
                        src={track.image}
                        className="rounded-md aspect-square min-w-28 md:min-w-36 lg:min-w-44"
                      />
                      <p className="line-clamp-1 tracking-tight mt-2">
                        {track.album.name}
                      </p>
                      <p className="text-sm text-spotify-gray mt-1 font-medium">
                        {track.artists[0].name}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </section>
          <section>
            <h1 className="mb-2 px-6 text-2xl font-bold text-white tracking-tighter">
              Jump back in
            </h1>
            <div className="overflow-x-auto hide-scrollbar mb-4 px-3">
              <div className="flex w-0">
                {filteredAlbums
                  .slice((filteredAlbums.length + 8) / 2, filteredAlbums.length)
                  .map((track) => (
                    <div
                      key={track.album.id}
                      onClick={() => router.push("/album/" + track.album.id)}
                      className="p-3 hover:bg-spotify-highlight rounded-md cursor-pointer"
                    >
                      <img
                        src={track.image}
                        className="rounded-md aspect-square min-w-28 md:min-w-36 lg:min-w-44"
                      />
                      <p className="line-clamp-1 tracking-tight mt-2">
                        {track.album.name}
                      </p>
                      <p className="text-sm text-spotify-gray mt-1 font-medium">
                        {track.artists[0].name}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
