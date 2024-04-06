export default function Playlist({ params }: { params: { id: string } }) {
  return <div>My Post: {params.id}</div>;
}
