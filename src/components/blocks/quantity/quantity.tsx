import React, {FC, memo, useState} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {TextVariant, useTheme} from '~/theme';
import {AppText} from '~/components';
import PlusIcon from '~/assets/images/plus.svg';
import MinusIcon from '~/assets/images/minus.svg';

const HitSlop = {top: 20, left: 20, right: 20, bottom: 20};

const DefaultValue = 1;

interface QuantityBlockProps {
  onChangeState?: (e: number) => void;
}

export const QuantityBlock: FC<QuantityBlockProps> = memo(props => {
  const [count, setCount] = useState<number>(DefaultValue);
  const {theme} = useTheme();

  const increase = () => {
    const newCount = count + 1;
    setCount(newCount);
    props.onChangeState?.(newCount);
  };

  const decrease = () => {
    if (count <= DefaultValue) {
      return;
    }
    const newCount = count - 1;
    setCount(newCount);
    props.onChangeState?.(newCount);
  };

  return (
    <View style={[styles.root, {borderColor: theme.colors.border.E01}]}>
      <TouchableOpacity hitSlop={HitSlop} onPress={decrease}>
        <MinusIcon />
      </TouchableOpacity>
      <AppText variant={TextVariant.M_R}>{count}</AppText>
      <TouchableOpacity hitSlop={HitSlop} onPress={increase}>
        <PlusIcon />
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    height: 48,
  },
});
