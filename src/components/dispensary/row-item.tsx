import React, {FC, memo, useCallback} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  StyleProp,
  TextStyle,
} from 'react-native';
import {AppText} from '~/components';
import {TextVariant} from '~/theme';
import CopyIcon from '~/assets/images/copy.svg';
import {formatPhoneNumber} from '~/utils/form';

interface RowItemProps {
  icon: JSX.Element;
  title?: string;
  active?: boolean | undefined;
  onPress?: (body: string) => void;
  withCopy?: boolean;
  titleStyles?: StyleProp<TextStyle>;
  phoneMask?: boolean;
  onLongPress?: (body: string) => void;
}

export const RowItem: FC<RowItemProps> = memo(props => {
  const handlePress = useCallback(() => {
    if (props.title) {
      props.onPress?.(props.title);
    }
  }, [props.title]);

  const handleLongPress = useCallback(() => {
    if (props.title) {
      props.onLongPress?.(props.title);
    }
  }, [props.title]);

  return (
    <View style={styles.root}>
      {props.icon}
      <TouchableOpacity
        disabled={props.active !== undefined ? !props.active : true}
        onPress={handlePress}
        onLongPress={handleLongPress}
        hitSlop={30}>
        <AppText
          style={[styles.title, props.titleStyles]}
          variant={TextVariant.P_M}>
          {props.phoneMask
            ? formatPhoneNumber(props?.title || '')
            : props.title}
          {props.withCopy && <CopyIcon width={vp(20)} />}
        </AppText>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  title: {
    marginLeft: vp(14),
    lineHeight: 20,
    flexShrink: 1,
    alignSelf: 'center',
  },
  root: {
    flexDirection: 'row',
    marginBottom: vp(15),
  },
});
