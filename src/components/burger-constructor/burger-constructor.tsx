import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '@services';
import {
  closeModal,
  itemsSelector,
  orderSend,
  requestDataSelector,
  requestSelector,
  userSelector
} from '@slices';
import { useLocation, useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const constructorItems = useSelector(itemsSelector);

  const orderRequest = useSelector(requestSelector);

  const orderModalData = useSelector(requestDataSelector);

  const user = useSelector(userSelector);

  const location = useLocation();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!user) {
      navigate('/login', { state: { from: location } });
    } else {
      dispatch(
        orderSend([
          constructorItems.bun._id,
          ...constructorItems.ingredients.map((val) => val._id),
          constructorItems.bun._id
        ])
      );
    }
  };

  const closeOrderModal = () => {
    dispatch(closeModal());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
