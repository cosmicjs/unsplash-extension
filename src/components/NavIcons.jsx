import React from 'react'
import { HeartIcon } from '@heroicons/react/20/solid'

function NavIcons() {
  return (
    <div className='flex w-max items-center space-x-4 mr-2 lg:mr-0'>
      <a href='https://cosmicjs.com' target='_blank' className="shrink-0">
        <img src='https://cosmicjs.com/images/logo.svg' className='w-6 h-6' />
      </a>
      <HeartIcon width={20} height={20} className='fill-red-500 shrink-0' />
      <a href='https://unsplash.com' target='_blank' className="shrink-0">
        <svg
          className='h-6 w-6 fill-black dark:fill-white hover:fill-gray-800 hover:dark:fill-gray-200'
          aria-labelledby='unsplash-home'
          aria-hidden='false'
          viewBox='0 0 32 32'
        >
          <path d='M10 9V0h12v9H10zm12 5h10v18H0V14h10v9h12v-9z' />
        </svg>
      </a>
    </div>
  )
}

export default NavIcons
