type ResizerProps = {
  setWidth: React.Dispatch<React.SetStateAction<number>>;
};

export default function Resizer({ setWidth }: ResizerProps) {
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
    if (newWidth >= 280 && newWidth <= 420) {
      setWidth(newWidth);
    } else if (newWidth <= 80) setWidth(72);
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
