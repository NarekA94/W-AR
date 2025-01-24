import React, {forwardRef, useEffect, useRef, useState} from 'react';
import {
  Animated,
  FlatList,
  FlatListProps,
  Platform,
  View,
  ViewToken,
} from 'react-native';
import {ITEM_SIZE, styles} from './styles';
interface CarouselProps extends FlatListProps<any> {
  data: any[];
  renderItem: (item: any, index?: number) => React.ReactElement;
  onSnapToItem?: (value: number | null) => void;
}

const decelerationRate = Platform.OS === 'ios' ? 0 : 0.98;

export const Carousel = React.memo(
  forwardRef<FlatList, CarouselProps>(
    ({renderItem, onSnapToItem, data, ...props}, ref) => {
      const [dataAndEmpty, setDataAndEmpty] = useState<any[]>([]);

      const viewableItemsChanged = useRef(
        ({
          viewableItems,
          changed,
        }: {
          viewableItems: ViewToken[];
          changed: ViewToken[];
        }) => {
          if (
            Array.isArray(viewableItems) &&
            viewableItems.length === 1 &&
            viewableItems?.[0]?.item?.key !== 'empty'
          ) {
            const index = viewableItems?.[0]?.index || 1;
            const changedIndex = changed?.[0]?.index;
            if (index === changedIndex) {
              onSnapToItem?.(index - 1);
            }
          }
        },
      ).current;

      const viewConfig = useRef({
        viewAreaCoveragePercentThreshold: 70,
        waitForInteraction: true,
      }).current;

      useEffect(() => {
        if (data) {
          setDataAndEmpty([{key: 'empty'}, ...data, {key: 'empty'}]);
        }
      }, [data]);

      const renderItemAndEmpty = ({item, index}: any) => {
        if (item.key === 'empty') {
          return <View style={styles.empty} />;
        }
        return <View style={styles.item}>{renderItem(item, index + 1)}</View>;
      };

      return (
        <View>
          <Animated.FlatList
            {...props}
            ref={ref}
            showsHorizontalScrollIndicator={false}
            data={dataAndEmpty}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            bounces={false}
            decelerationRate={decelerationRate}
            renderToHardwareTextureAndroid
            snapToInterval={ITEM_SIZE}
            snapToAlignment="start"
            scrollEventThrottle={16}
            renderItem={renderItemAndEmpty}
            pagingEnabled={true}
            onViewableItemsChanged={viewableItemsChanged}
            viewabilityConfig={viewConfig}
          />
        </View>
      );
    },
  ),
);
