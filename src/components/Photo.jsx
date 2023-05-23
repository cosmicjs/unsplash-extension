import React from "react";
import { Loader } from "semantic-ui-react";
import { ArrowUpRightIcon } from "@heroicons/react/20/solid";

function Photo({ url, children, id }) {
  return (
    <>
      <img
        src={`${url}`}
        className={`relative z-10 h-64 w-full overflow-hidden rounded-2xl object-cover`}
      />
      <div className="absolute top-40 z-0 w-full text-center">
        <Loader active inline size="large" />
      </div>
      <div className="absolute bottom-4 z-20 flex w-full items-center justify-center space-x-4 text-center">
        {children}
        <a
          href={"https://unsplash.com/photos/" + id}
          target="_blank"
          className="group flex w-max items-center justify-center rounded-md border border-gray-300 bg-gray-50 px-4 py-2 hover:bg-gray-200 group-hover:text-gray-700 group-hover:shadow-md dark:group-hover:text-gray-400"
        >
          <span className="mr-2">Unsplash</span>
          <ArrowUpRightIcon
            width={20}
            height={20}
            className="transform text-gray-700 transition-all duration-200 ease-in-out group-hover:translate-x-1 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-400"
          />
        </a>
      </div>
    </>
  );
}

export default Photo;
