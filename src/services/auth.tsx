import React from "react";

interface ModoProps {
  openNav: () => void;
}

export const Mode: React.FC<ModoProps> = ({ openNav }) => {
  return (
    <button
      onClick={openNav}
      className="text-black px-4 py-2 bg-white cursor-pointer"
    >
      ☰
    </button>
  );
};
