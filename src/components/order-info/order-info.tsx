import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { RootState, useDispatch, useSelector } from '@services';
import { useParams } from 'react-router-dom';
import { ingredientsSelector, ordersProfile } from '@slices';
import { NotFound404 } from '@pages';

const ordersByNumSelector = (num: number) => (state: RootState) =>
  state.orders.orders.find((val) => val.number === num);

export const OrderInfo: FC = () => {
  /** TODO: взять переменные orderData и ingredients из стора */
  const { number } = useParams();

  const numberInt = parseInt(number!);

  const orderData = useSelector(ordersByNumSelector(numberInt));

  const ingredients = useSelector(ingredientsSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(ordersProfile());
  }, []);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  if (Number.isNaN(numberInt) || !orderData) {
    return <NotFound404 />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
