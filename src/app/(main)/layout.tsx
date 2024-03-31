import Player from "@/components/Player";
import Sidebar from "@/components/Sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-screen h-[100dvh] p-2 flex flex-col gap-2 bg-black">
      <div className="flex gap-2 h-full">
        <Sidebar />
        <main className="w-full">{children}</main>
      </div>
      <Player />
    </div>
  );
}
