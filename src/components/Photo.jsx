import React from 'react'
import { Loader } from 'semantic-ui-react'
import { ArrowUpRightIcon } from '@heroicons/react/20/solid'

function Photo({ url, children, id }) {
  return (
    <>
      <img
        src={`${url}`}
        className={`object-cover w-full h-96 rounded-2xl overflow-hidden relative z-10`}
      />
      <div className='text-center z-0 absolute top-64 w-full'>
        <Loader active inline size='large' />
      </div>
      <div className='absolute z-20 text-center w-full bottom-8  items-center justify-center flex space-x-4'>
        {children}
        <a
          href={'https://unsplash.com/photos/' + id}
          target='_blank'
          className='flex items-center justify-center bg-gray-50 border border-gray-300 rounded-md py-2 px-4 w-max hover:bg-gray-200 group-hover:text-gray-700 dark:group-hover:text-gray-400 group-hover:shadow-md group'
        >
          <span className='mr-2'>Unsplash</span>
          <ArrowUpRightIcon
            width={20}
            height={20}
            className='text-gray-700 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-400 group-hover:translate-x-1 transition-all duration-200 ease-in-out transform'
          />
        </a>
      </div>
    </>
  )
}

export default Photo
