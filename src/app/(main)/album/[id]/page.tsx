export default function Album({ params }: { params: { id: string } }) {
  return <div>My Post: {params.id}</div>;
}
