import Player from "@/components/Player";
import Sidebar from "@/components/Sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-2 w-screen bg-black">
      <div className="flex gap-2">
        <Sidebar />
        <main>{children}</main>
      </div>
      <Player />
    </div>
  );
}
