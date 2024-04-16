import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
function ProtectUserRoute({ user, token, children }) {
  const nav = useNavigate();

  useEffect(() => {
    if (token === undefined) {
      nav('/signin');
    } else {
      if (user) {
        // console.log(user.role);
        // if (user.role === 1) {
        //   nav('/signin');
        // }
      }
    }
  }, [token, user]);

  return children;
}
export default ProtectUserRoute;
