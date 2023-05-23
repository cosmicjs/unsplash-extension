import React from "react";
import { HeartIcon } from "@heroicons/react/20/solid";

function NavIcons() {
  return (
    <div className="flex w-[104px] items-center justify-end space-x-4">
      <a href="https://cosmicjs.com" target="_blank" className="shrink-0">
        <img src="https://cosmicjs.com/images/logo.svg" className="h-6 w-6" />
      </a>
      <HeartIcon width={20} height={20} className="shrink-0 fill-red-500" />
      <a href="https://unsplash.com" target="_blank" className="shrink-0">
        <svg
          className="h-6 w-6 fill-black hover:fill-gray-800 dark:fill-white hover:dark:fill-gray-200"
          aria-labelledby="unsplash-home"
          aria-hidden="false"
          viewBox="0 0 32 32"
        >
          <path d="M10 9V0h12v9H10zm12 5h10v18H0V14h10v9h12v-9z" />
        </svg>
      </a>
    </div>
  );
}

export default NavIcons;
