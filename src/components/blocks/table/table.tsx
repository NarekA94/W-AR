import React from 'react';
import {View} from 'react-native';
import {RadialGradient} from '~/components/gradient';
import {WIDTH} from '~/constants/layout';

export const DefaultRowHeight = vp(48);

interface TableProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  rowHeight?: number;
}

export const Table = <T extends unknown>({
  rowHeight = DefaultRowHeight,
  ...props
}: TableProps<T>) => {
  return (
    <View>
      <RadialGradient
        height={vp(rowHeight * props.data.length)}
        width={WIDTH - 48}
        colors={['#fbfcff', '#e4ecfe']}>
        {props.data?.map(props.renderItem)}
      </RadialGradient>
    </View>
  );
};
