import {useCallback} from 'react';
import {useAppSelector} from '~/store/hooks';
import {selectStatusForHiddenUi} from '~/store/reducers';

export const useHiddenUi = () => {
  const shouldBeHidden = useAppSelector(selectStatusForHiddenUi);
  const checkStatusForHiddenUi = useCallback(
    <T>(currentContent: T, updatedContent: T) => {
      if (shouldBeHidden) {
        return updatedContent;
      }
      return currentContent;
    },
    [shouldBeHidden],
  );
  return checkStatusForHiddenUi;
};
