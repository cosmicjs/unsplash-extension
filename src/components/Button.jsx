function Button({ children, onClick }) {
  return (
    <button
      className='flex items-center justify-center bg-gray-50 border-gray-300 rounded-md py-2 px-4 w-fit hover:bg-gray-100'
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button
