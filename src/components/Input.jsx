import React from 'react'

function Input({ onKeyUp }) {
  return (
    <div className='w-full md:w-1/2 lg:w-1/3'>
      <input
        className='w-full p-2 border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#2AAAE2] focus:border-transparent rounded-md selection:text-neutral-700 selection:dark:text-neutral-300'
        id='search-input'
        placeholder='Search free high-resolution photos'
        onKeyUp={onKeyUp}
      />
    </div>
  )
}

export default Input
