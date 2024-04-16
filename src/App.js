import { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProtectAdminRoute } from './components/ProtectRoute/ProtectAdminRoute';
import { AuthContext } from './contexts/AuthContextProvider';
import { AdminLayout } from './layouts/AdminLayout';
import { adminRoutes, userRoutes } from './routes';
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserLayout } from './layouts/UserLayout';
function App() {
  const [token, currentUser] = useContext(AuthContext);

  // console.log(token);

  return (
    <Router>
      <div className="App">
        <Routes>
          {adminRoutes.map((route, index) => {
            const Page = route.component;
            let Layout = AdminLayout;
            if (route.layout) {
              Layout = route.layout;
            }
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <ProtectAdminRoute user={currentUser} token={token}>
                    <Layout>
                      <Page />
                    </Layout>
                  </ProtectAdminRoute>
                }
              />
            );
          })}
          {userRoutes.map((route, index) => {
            const Page = route.component;
            let Layout = UserLayout;
            if (route.layout) {
              Layout = route.layout;
            }
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            );
          })}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
