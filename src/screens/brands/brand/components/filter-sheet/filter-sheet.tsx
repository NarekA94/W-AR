import React, {FC, memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, CheckBox, Chip} from '~/components';
import {useListBottomSafeAreaInset} from '~/hooks/useListBottomSafeAreaInset';
import {ButtonVariant, GLOBAL_STYLES} from '~/theme';

interface FilterSheetProps {}

export const FilterSheet: FC<FilterSheetProps> = memo(() => {
  const {bottom} = useListBottomSafeAreaInset();
  return (
    <>
      <View style={GLOBAL_STYLES.flex_1}>
        <View style={styles.effects}>
          <Chip title="Concentration" />
        </View>
        <View style={styles.effects}>
          <CheckBox isSelected={true} />
        </View>
        <View style={GLOBAL_STYLES.flex_1} />
        <View style={[GLOBAL_STYLES.row_between, {paddingBottom: bottom}]}>
          <Button
            title="Reset"
            // onPress={handleCancel}
            width="48%"
            variant={ButtonVariant.GRAY}
          />
          <Button
            // onPress={handleLogout}
            title="Confirm"
            width="48%"
            withImageBackground
          />
        </View>
      </View>
    </>
  );
});

const styles = StyleSheet.create({
  effects: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
