import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { RootState, useSelector } from '@services';
import { useParams } from 'react-router-dom';

const ingredientIdSelector = (id: string) => (state: RootState) =>
  state.ingredients.ingredients.find((val) => val._id === id);

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();

  const ingredientData = useSelector(ingredientIdSelector(id!));

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
