import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { RootState, useSelector } from '@services';
import { useParams } from 'react-router-dom';
import { isLoadingSelector } from '@slices';
import { NotFound404 } from '@pages';

const ingredientIdSelector = (id: string) => (state: RootState) =>
  state.ingredients.ingredients.find((val) => val._id === id);

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();

  const ingredientData = useSelector(ingredientIdSelector(id!));

  const isLoading = useSelector(isLoadingSelector);

  if (isLoading) {
    return <Preloader />;
  }

  if (!ingredientData) {
    return <NotFound404 />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
