import React, { useContext, useState } from 'react';
// import { BiChat, BiSearch, BiUserCircle } from 'react-icons/bi';
import { BsFillCartFill } from 'react-icons/bs';
import { RiProfileLine, RiLockPasswordLine, RiMenuFill } from 'react-icons/ri';
import { FaUserAlt } from 'react-icons/fa';
import { HiOutlineClipboardList } from 'react-icons/hi';
import { Link, useNavigate } from 'react-router-dom';
import HeadlessTippy from '@tippyjs/react/headless';

import configFile from '~/config';
import { AuthContext } from '~/contexts/AuthContextProvider';
import useCartContext from '~/hooks/useCartContext';
import { Search } from '../Search';
import images from '~/assets/images';

const MENU = [
  {
    icon: RiProfileLine,
    href: configFile.routes.profile,
    title: 'My Profile',
  },
  {
    icon: HiOutlineClipboardList,
    href: configFile.routes.orderHistory,
    title: 'My Orders',
  },
  {
    icon: RiLockPasswordLine,
    href: configFile.routes.changePassword,
    title: 'Change Password',
  },
];
function Header({ setMenu }) {
  const nav = useNavigate();
  const [token, currentUser, setToken, setCurrentUser] = useContext(AuthContext);
  const [stateCart, dispatchCart] = useCartContext();

  const [showTippy, setShowTippy] = useState(false);
  const handleLogin = () => {
    nav('/signin');
  };
  const handleSignOut = () => {
    localStorage.removeItem('userInfo');
    setCurrentUser('');
    nav('/');
  };
  const tokens = localStorage.getItem('userInfo');
  const showOnClick = () => {
    setShowTippy(!showTippy);
  };
  return (
    <div className="z-50 top-0 sticky w-full">
      <header className="flex py-4 shadow-sm bg-white h-24 ">
        <div className="container flex items-center justify-between">
          <Link to={configFile.routes.home}>
            <img src={images.logoDefault} alt="Logo" className="w-32" />
          </Link>

          <div className="w-full max-w-xl lg:w-full md:w-2/3 sm:w-2/3 relative flex px-2">
            <Search />
          </div>

          <div className="flex items-center space-x-1 sm:space-x-4">
            <Link
              to={configFile.routes.cart}
              className="text-center text-gray-700 hover:text-primary transition relative mr-4"
            >
              <BsFillCartFill className="w-[40px] h-[40px]" />

              <div className="absolute -right-3 -top-1 w-[10px] h-[10px] sm:w-5 sm:h-5 sm:text-xs text-[10px] rounded-full flex items-center justify-center bg-red-500 text-white ">
                {stateCart ? stateCart.length : 0}
              </div>
            </Link>
            <HeadlessTippy
              interactive
              visible={showTippy}
              onClickOutside={() => setShowTippy(false)}
              render={(attrs) => (
                <div
                  className="flex flex-col w-64  rounded-lg border border-slate-700 p-2 bg-white"
                  tabIndex="-1"
                  {...attrs}
                >
                  {MENU.map((menu, index) => (
                    <Link
                      key={index}
                      to={menu.href}
                      className="flex justify-start items-center w-full py-2 px-3 text-lg hover:bg-slate-500 hover:text-white"
                    >
                      <menu.icon className="font-bold text-3xl flex-[0.3]" />
                      <div className="text-lg font-semibold flex-[0.7]">{menu.title}</div>
                    </Link>
                  ))}
                </div>
              )}
            >
              <div className=" flex items-center text-gray-700 hover:text-blue-700 transition relative">
                <button className="border-none outline-none" onClick={showOnClick}>
                  <FaUserAlt className="w-7 h-7" />
                </button>
              </div>
            </HeadlessTippy>
          </div>
        </div>
      </header>
      <nav className="bg-gray-800 z-[9] relative">
        <div className="container flex">
          <div className="flex items-center justify-between flex-grow px-2 py-2 md:!py-4 md:px-12 text-[14px] sm:text-[16px] md:text-xl">
            <div className="flex items-center space-x-2 sm:space-x-6 capitalize">
              <button className=" text-white lg:hidden" onClick={() => setMenu((pre) => !pre)}>
                <RiMenuFill className="w-[25px] h-[25px]" />
              </button>
              <Link to={configFile.routes.home} className="text-gray-300 hover:text-white transition">
                Home
              </Link>
              <Link to={configFile.routes.aboutUs} className="text-gray-300 hover:text-white transition">
                About us
              </Link>
              <Link to={configFile.routes.aboutUs} className="text-gray-300 hover:text-white transition">
                Contact us
              </Link>
            </div>
            {tokens ? (
              <button onClick={handleSignOut} className="text-gray-300 hover:text-white transition">
                Sign out
              </button>
            ) : (
              <button onClick={handleLogin} className="text-gray-200 hover:text-white transition">
                Sign in/Sign up
              </button>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Header;
