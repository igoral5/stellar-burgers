import { useDispatch, useSelector } from '@services';
import { getUser, isLoadingUserSelector, userSelector } from '@slices';
import { Preloader } from '@ui';
import { FC, ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

type ProtectedRouteProps = {
  children: ReactNode;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  onlyUnAuth
}) => {
  const isLoading = useSelector(isLoadingUserSelector);

  const user = useSelector(userSelector);

  const location = useLocation();

  const dispatch = useDispatch();

  useEffect(() => {
    if (!user && !onlyUnAuth) {
      dispatch(getUser());
    }
  }, []);

  if (isLoading) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  if (onlyUnAuth && user) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  return children;
};
