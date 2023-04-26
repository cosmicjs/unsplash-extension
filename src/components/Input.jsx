import React from "react";

function Input({ onKeyUp }) {
  return (
    <div className="w-full md:w-1/2 lg:w-1/3">
      <input
        className="w-full rounded-lg border-2 border-[#EBF2F5] bg-[#F7FBFC] p-2 text-neutral-700 selection:text-neutral-700 placeholder:text-neutral-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#2AAAE2] dark:border-[#29373D] dark:bg-[#11171A] dark:text-neutral-200 selection:dark:text-neutral-300"
        id="search-input"
        placeholder="Search free high-resolution photos"
        onKeyUp={onKeyUp}
      />
    </div>
  );
}

export default Input;
