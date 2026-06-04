import { useDispatch, useSelector } from '@services';
import {
  isLoadingOrdersSelector,
  ordersProfile,
  ordersSelector
} from '@slices';
import { Preloader } from '@ui';
import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const orders = useSelector(ordersSelector);

  const isLoading = useSelector(isLoadingOrdersSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(ordersProfile());
  }, []);

  if (isLoading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
