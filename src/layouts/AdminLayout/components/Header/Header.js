import React from 'react';
// import { BiChat, BiSearch, BiUserCircle } from 'react-icons/bi';
import { BsFillBarChartFill } from 'react-icons/bs';

function Header() {
  return (
    <div className=" fixed w-full h-16 py-6 bg-[#F0F5F5]  items-center flex px-12 z-50 drop-shadow-md	">
      {/* search */}
      {/* <div className="w-full lg:flex hidden space-x-4 items-center justify-start py-2   ">
        <BiSearch className="w-4 h-4" />
        <input type="text" placeholder="Search anything..." className="bg-transparent outline-none" />
      </div> */}
      {/* logo */}
      <div className="items-center w-full justify-center flex space-x-4">
        <BsFillBarChartFill className="w-6 h-6" />
        <h1 className="text-xl text-gray-900 font-medium ">Furniture Store - Admin</h1>
      </div>
      {/* icons */}
      {/* <div className="items-center justify-end space-x-6 flex w-full">
        <BsFillBellFill className="header-icon w-5 h-5" />
        <BiChat className="header-icon w-5 h-5" />
        <BiUserCircle className="header-icon w-5 h-5" />
      </div> */}
    </div>
  );
}

export default Header;
