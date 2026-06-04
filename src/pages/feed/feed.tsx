import { useDispatch, useSelector } from '@services';
import { feedsGet, feedsSelector, isLoadingFeedsSelector } from '@slices';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const orders = useSelector(feedsSelector);

  const isLoading = useSelector(isLoadingFeedsSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(feedsGet());
  }, []);

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(feedsGet());
      }}
    />
  );
};
