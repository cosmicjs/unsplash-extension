import React from 'react'

function EmptyState() {
  return (
    <div className='grid w-full h-[95vh] place-content-center'>
      <div className='flex flex-col items-center justify-center space-y-4'>
        <svg
          className='h-8 w-8 fill-black dark:fill-white'
          width='32'
          height='32'
          aria-labelledby='unsplash-home'
          aria-hidden='false'
          viewBox='0 0 32 32'
        >
          <path d='M10 9V0h12v9H10zm12 5h10v18H0V14h10v9h12v-9z' />
        </svg>
        <div className='text-center text-2xl font-sans text-neutral-800 dark:text-neutral-200'>
          Use the search bar above to find photos from{' '}
          <a href='https://unsplash.com' target='_blank'>
            Unsplash
          </a>
        </div>
      </div>
    </div>
  )
}

export default EmptyState
