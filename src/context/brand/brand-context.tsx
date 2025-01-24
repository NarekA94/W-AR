import React, {useCallback, useMemo} from 'react';
import {createContext, FC, PropsWithChildren, useState} from 'react';
import {OrderType} from '~/store/query/order';
import {IBrandContext} from './types';

export const BrandContext = createContext<IBrandContext>({
  selectedTab: null,
  setSelectedTab: () => {},
  selectedCategory: null,
  setSelectedCategory: () => {},
  selectedShippingMethod: null,
  setSelectedShippingMethod: () => {},
  lastPoints: null,
  setLastPoints: () => {},
  brandId: null,
  setBrandId: () => {},
  pendingPoints: null,
  setPendingPoints: () => {},
});
export const BrandSearchContext = createContext<IBrandContext>({
  selectedTab: null,
  setSelectedTab: () => {},
});

export const BrandContextProvider: FC<PropsWithChildren<{}>> = ({children}) => {
  const [selectedTab, setSelectedTab] =
    useState<IBrandContext['selectedTab']>(null);
  const [selectedCategory, setSelectedCategory] = useState<
    number | null | undefined
  >(null);
  const [selectedShippingMethod, setSelectedShippingMethod] =
    useState<OrderType | null>(null);
  const [lastPoints, setLastPoints] = useState<IBrandContext['lastPoints']>(0);
  const [pendingPoints, setPendingPoints] =
    useState<IBrandContext['pendingPoints']>(0);

  const [brandId, setStateBrandId] = useState<IBrandContext['brandId']>(null);
  const setBrandId = useCallback(
    (newBrandId: number | null) => {
      if (newBrandId !== brandId) {
        setStateBrandId(newBrandId);
        setSelectedTab(null);
        setSelectedCategory(null);
        setSelectedShippingMethod(null);
        setLastPoints(null);
        setPendingPoints(null);
      }
    },
    [brandId],
  );
  return (
    <BrandContext.Provider
      value={{
        selectedTab,
        setSelectedTab,
        selectedCategory,
        setSelectedCategory,
        selectedShippingMethod,
        setSelectedShippingMethod,
        lastPoints,
        setLastPoints,
        brandId,
        setBrandId,
        pendingPoints,
        setPendingPoints,
      }}>
      {children}
    </BrandContext.Provider>
  );
};

export const BrandSearchContextProvider: FC<PropsWithChildren<{}>> = ({
  children,
}) => {
  const [selectedTab, setSelectedTab] =
    useState<IBrandContext['selectedTab']>(null);
  const tabState = useMemo(() => {
    return {
      selectedTab,
      setSelectedTab,
    };
  }, [selectedTab, setSelectedTab]);
  return (
    <BrandSearchContext.Provider value={tabState}>
      {children}
    </BrandSearchContext.Provider>
  );
};
