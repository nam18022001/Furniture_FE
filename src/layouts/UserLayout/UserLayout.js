import { Fragment, useEffect, useState } from 'react';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { SideBar } from './components/SideBar';

function UserLayout({ children }) {
  const pathName = window.location.pathname;
  const [showSideBar, setShowSideBar] = useState();
  const [menu, setMenu] = useState();

  useEffect(() => {
    if (pathName !== '/') {
      setShowSideBar(false);
    } else {
      setShowSideBar(true);
    }
  }, [pathName]);
  return (
    <Fragment>
      {menu && (
        <div
          className="fixed z-[80] w-screen h-screen bg-slate-600 bg-opacity-50 lg:hidden"
          onClick={() => setMenu(false)}
        ></div>
      )}
      <div className="flex flex-col w-full">
        <Header setMenu={setMenu} />
        {showSideBar === true ? (
          <div className="container grid grid-cols-4 gap-6 pt-4 pb-16 items-start">
            <SideBar menu={menu} setMenu={setMenu} />
            {children}
          </div>
        ) : (
          children
        )}
        <Footer />
      </div>
    </Fragment>
  );
}

export default UserLayout;
