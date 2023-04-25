import React from 'react'

function Header({ children }) {
  return <div className='flex w-full items-center justify-between space-x-4 lg:p-4'>{children}</div>
}

export default Header
