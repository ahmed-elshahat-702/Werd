import Image from "next/image";
import React from "react";

const Logo = () => {
  return (
    <div className="flex items-center gap-2 px-4 py-2">
      <div className="">
        <Image src="/logo.png" alt="Logo" width={30} height={30} />
      </div>
      <div className="flex flex-col items-start text-sm leading-tight">
        <span className="truncate font-semibold text-lg">Werd</span>
        <span className="truncate text-lg arabic-text">وِرد</span>
      </div>
    </div>
  );
};

export default Logo;
