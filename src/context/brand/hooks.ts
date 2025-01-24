import {Context, useContext, useMemo} from 'react';
import {BrandContext} from './brand-context';
import {IBrandContext} from './types';

export const useGetSelectedBrandTab = (
  context: Context<IBrandContext> = BrandContext,
) => {
  const {selectedTab, setSelectedTab} = useContext(context);
  return useMemo(
    () => ({
      selectedTab,
      setSelectedTab,
    }),
    [selectedTab, setSelectedTab],
  );
};

export const useGetBrandCtx = () => {
  const brandCtx = useContext(BrandContext);
  return brandCtx;
};
