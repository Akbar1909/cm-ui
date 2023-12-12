import { Navigate } from 'react-router-dom';
import useAuth from 'hooks/helpers/useAuth';

const PrivateRoute = ({ children }) => {
  const isAuth = useAuth();

  // if (!isAuth) {
  //   return <Navigate to="/" />;
  // }

  return children;
};

export default PrivateRoute;
