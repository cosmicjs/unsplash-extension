import React from 'react'

function Button({ children, onClick }) {
  return (
    <button
      className='flex items-center justify-center bg-gray-50 border border-gray-300 rounded-md py-2 px-4 w-fit hover:bg-gray-200'
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button
