import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '@services';
import { useParams } from 'react-router-dom';
import {
  ingredientsSelector,
  isLoadingOrderInfoSelector,
  orderInfoGet,
  orderInfoSelector
} from '@slices';
import { NotFound404 } from '@pages';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();

  const numberInt = parseInt(number!);

  const orderData = useSelector(orderInfoSelector);

  const isLoading = useSelector(isLoadingOrderInfoSelector);

  const ingredients = useSelector(ingredientsSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(orderInfoGet(numberInt));
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

  if (isLoading) {
    return <Preloader />;
  }

  if (Number.isNaN(numberInt) || !orderData) {
    return <NotFound404 />;
  }

  return <OrderInfoUI orderInfo={orderInfo!} />;
};
