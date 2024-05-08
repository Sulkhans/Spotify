type ResizerProps = {
  minWidth: number;
  maxWidth: number;
  setWidth: React.Dispatch<React.SetStateAction<number>>;
};

export default function Resizer({
  minWidth,
  maxWidth,
  setWidth,
}: ResizerProps) {
  const handleMouseDown = () => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };
  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };
  const handleMouseMove = (e: MouseEvent) => {
    const newWidth = e.clientX - 10;
    if (newWidth >= minWidth && newWidth <= maxWidth) setWidth(newWidth);
  };
  return (
    <div
      onMouseDown={handleMouseDown}
      className="w-2 flex justify-center items-center group cursor-grab active:cursor-grabbing"
    >
      <div className="h-[calc(100%-16px)] w-[1px] group-hover:bg-[#727272] transition-all" />
    </div>
  );
}
