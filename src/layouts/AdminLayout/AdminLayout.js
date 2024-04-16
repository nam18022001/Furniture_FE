import { Header } from './components/Header';
import { SideBar } from './components/SideBar';

function AdminLayout({ children }) {
  return (
    <div className="flex" style={{ height: '100vh' }}>
      <Header />
      <div className="flex w-full h-full pt-16">
        <SideBar />
        {children}
      </div>
    </div>
  );
}

export default AdminLayout;
