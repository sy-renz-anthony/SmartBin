import React from 'react'

const Header = ({pageTitle}) => {
  return (
    <div className='fixed top-0 left-25 w-screen h-20 flex items-center bg-white shadow text-black z-10'>
        <h1 className="mx-5 font-bold text-gray-800 text-2xl">{pageTitle}</h1>
    </div>
  )
}

export default Header