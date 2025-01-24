import React, {FC, memo, useCallback, useEffect, useRef, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {CategoryItem} from '~/components';
import {BrandCategory} from '~/store/query/brand';
import LinearGradient from 'react-native-linear-gradient';
import {Products, ProductsRef} from '../products/products';
import {Tabs} from '~/components/brand/tabs/tabs';
import {useLazyGetProductsQuery} from '~/store/query/product';
import {useGetBrandCtx} from '~/context/brand/hooks';
import {GLOBAL_STYLES} from '~/theme';

interface CategoriesProps {
  brandId?: number;
  onSelectCategory?: () => void;
}

const mockSkeletonData = new Array(6).fill(null);
const gradientSkeletonColors = ['rgba(68, 68, 68, 1)', 'rgba(68, 68, 68, 0)'];
const startGradient = {x: 0, y: 0};
const endGradient = {x: 0, y: 1};

const keyExtractor = (item: BrandCategory) => item.id.toString();

export const Categories: FC<CategoriesProps> = memo(
  ({brandId, onSelectCategory}) => {
    const productPageRef = useRef<ProductsRef>(null);
    const categoriesListRef = useRef<FlatList>(null);
    const [productsIsLoading, setProductsIsLoading] = useState(false);
    const [getProducts, {isLoading, isUninitialized, data: products}] =
      useLazyGetProductsQuery();
    const {setSelectedCategory, selectedTab, selectedCategory} =
      useGetBrandCtx();
    useEffect(() => {
      if (brandId) {
        setProductsIsLoading(true);
        getProducts({brandId: brandId, tab: selectedTab?.tab})
          .unwrap()
          .then(res => {
            setSelectedCategory?.(res?.types?.[0]?.id);
          })
          .finally(() => {
            setProductsIsLoading(false);
          });
      }
    }, [brandId, selectedTab]);

    useEffect(() => {
      return () => {
        setSelectedCategory?.(undefined);
      };
    }, []);

    useEffect(() => {
      const listRef = categoriesListRef?.current;
      const category = selectedCategory;

      const categoryIndex = products?.types.findIndex(
        type => type.id === category,
      );
      if (categoryIndex != null && categoryIndex !== -1) {
        listRef?.scrollToIndex({
          index: categoryIndex,
          animated: true,
          viewPosition: 0.5,
        });
      }
    }, [selectedCategory]);

    const handleSelectCategory = useCallback(
      (id: number) => {
        setSelectedCategory?.(id);
        productPageRef.current?.scrollToProduct(id);
        onSelectCategory?.();
      },
      [setSelectedCategory, onSelectCategory],
    );

    const renderSkeleton = useCallback(
      () => (
        <LinearGradient
          start={startGradient}
          end={endGradient}
          colors={gradientSkeletonColors}
          style={styles.skeleton}
        />
      ),
      [],
    );
    const renderTabSkeletons = useCallback(
      () => <View style={styles.tabSkeletonItem} />,
      [],
    );
    const renderProductSkeletons = useCallback(
      () => <View style={styles.productSkeletonItem} />,
      [],
    );

    const RenderCategories = useCallback(
      ({item}: FlatListItem<BrandCategory>) => {
        return (
          <CategoryItem
            id={item.id}
            rewardAvailable={item.rewardAvailable}
            isSelected={item.id === selectedCategory}
            name={item.name}
            uri={item?.image?.url}
            selectCategory={handleSelectCategory}
          />
        );
      },
      [handleSelectCategory, selectedCategory],
    );

    if (isLoading || isUninitialized) {
      return (
        <View style={GLOBAL_STYLES.horizontal_20}>
          <FlatList
            style={styles.categoryListSkeleton}
            data={mockSkeletonData}
            renderItem={renderSkeleton}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          />
          <FlatList
            showsHorizontalScrollIndicator={false}
            style={styles.tabSkeletonsContainer}
            horizontal
            data={mockSkeletonData}
            renderItem={renderTabSkeletons}
          />
          <FlatList
            showsHorizontalScrollIndicator={false}
            style={styles.productSkeletonsContainer}
            horizontal
            data={mockSkeletonData}
            renderItem={renderProductSkeletons}
          />
        </View>
      );
    }

    return (
      <>
        <View style={GLOBAL_STYLES.horizontal_20}>
          <FlatList
            ref={categoriesListRef}
            style={styles.categoryList}
            data={products?.types}
            renderItem={RenderCategories}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            keyExtractor={keyExtractor}
          />
          <Tabs brandId={brandId} />
        </View>

        <Products
          ref={productPageRef}
          brandId={brandId}
          products={products?.products}
          isLoading={productsIsLoading}
        />
      </>
    );
  },
);

const styles = StyleSheet.create({
  categoryListSkeleton: {
    marginTop: vp(24),
    marginBottom: vp(24),
  },
  categoryList: {
    flexGrow: 0,
    marginBottom: 22,
    overflow: 'visible',
  },
  skeleton: {
    width: vp(64),
    height: vp(64),
    borderRadius: 22,
    marginRight: vp(14),
    marginBottom: vp(22),
    paddingTop: vp(25),
  },
  tabSkeletonsContainer: {
    marginBottom: vp(23),
  },
  tabSkeletonItem: {
    borderRadius: 12,
    width: vp(130),
    height: vp(43),
    paddingHorizontal: vp(25),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginRight: vp(8),
    backgroundColor: '#333333',
  },
  productSkeletonsContainer: {
    marginTop: vp(37),
  },
  productSkeletonItem: {
    width: vp(293),
    height: vp(330),
    borderWidth: 1,
    borderColor: 'rgba(102, 102, 102, 0.7)',
    borderRadius: 25,
    marginRight: vp(20),
    backgroundColor: 'black',
  },
});
