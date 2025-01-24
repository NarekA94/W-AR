import React, {memo, FC, useCallback, useEffect, useMemo, Context} from 'react';
import {FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {AppText} from '~/components';
import {BrandContext, IBrandContext} from '~/context/brand';
import {useGetSelectedBrandTab} from '~/context/brand/hooks';
import {useAppSelector} from '~/store/hooks';
import {BrandTab, useLazyGetBrandQuery} from '~/store/query/brand';
import {selectStatusForHiddenUi} from '~/store/reducers';
import {FontWeight, TextVariant, useTheme} from '~/theme';

interface TabsProps {
  brandId?: number;
  context?: Context<IBrandContext>;
}

export const Tabs: FC<TabsProps> = memo(({brandId, context}) => {
  const {selectedTab, setSelectedTab} = useGetSelectedBrandTab(
    context || BrandContext,
  );
  const [getBrand, {data}] = useLazyGetBrandQuery();
  const {theme} = useTheme();
  const shouldBeHidden = useAppSelector(selectStatusForHiddenUi);

  useEffect(() => {
    if (brandId) {
      getBrand({id: brandId})
        .unwrap()
        .then(res => {
          setSelectedTab(res?.tabs?.[0]);
        });
    }
  }, [brandId, getBrand]);

  const handlePressTab = useCallback((item: BrandTab) => {
    setSelectedTab(item);
  }, []);

  const tabsData = useMemo(() => {
    if (!data) {
      return [];
    }
    if (shouldBeHidden) {
      return [data.tabs[0]];
    }
    return data?.tabs;
  }, [data, shouldBeHidden]);

  const renderItem = useCallback(
    ({item}: FlatListItem<BrandTab>) => {
      return (
        <TouchableOpacity
          disabled={data?.tabs.length === 1}
          onPress={() => handlePressTab(item)}
          style={[
            styles.tab,
            {
              backgroundColor:
                item.tab === selectedTab?.tab
                  ? theme.colors.primary
                  : theme.colors.background.gray,
            },
          ]}>
          <AppText variant={TextVariant.P_M} fontWeight={FontWeight.W500}>
            {item.name}
          </AppText>
        </TouchableOpacity>
      );
    },
    [handlePressTab, selectedTab, theme, data],
  );

  return (
    <>
      <FlatList
        showsHorizontalScrollIndicator={false}
        style={styles.root}
        horizontal
        data={tabsData}
        renderItem={renderItem}
      />
    </>
  );
});

const styles = StyleSheet.create({
  root: {
    marginBottom: vp(23),
    overflow: 'visible',
  },
  tab: {
    borderRadius: 12,
    height: vp(43),
    paddingHorizontal: vp(25),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginRight: vp(8),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333333',
  },
});
