import React, {FC} from 'react';
import {StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  Placeholder,
  PlaceholderLine,
  Fade,
  PlaceholderMedia,
} from 'rn-placeholder';

export const Loader: FC = () => {
  return (
    <SafeAreaView style={styles.root}>
      <Placeholder Animation={Fade}>
        <PlaceholderLine
          style={styles.alignSelf_end}
          height={20}
          color="white"
          width={vp(20)}
        />
        <PlaceholderLine height={20} width={20} />
        <PlaceholderLine width={90} height={10} />
      </Placeholder>
      <Placeholder
        style={styles.top}
        Animation={Fade}
        Left={() => <PlaceholderMedia style={styles.left} />}>
        <PlaceholderLine width={80} />
        <PlaceholderLine />
        <PlaceholderLine width={30} />
      </Placeholder>
      <Placeholder
        style={styles.top}
        Animation={Fade}
        Left={() => <PlaceholderMedia style={styles.left} />}>
        <PlaceholderLine width={80} />
        <PlaceholderLine />
        <PlaceholderLine width={30} />
      </Placeholder>
      <Placeholder style={styles.top} Animation={Fade}>
        <PlaceholderLine height={20} />
        <PlaceholderLine height={20} />
        <PlaceholderLine height={20} />
      </Placeholder>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 24,
    marginTop: 20,
  },
  alignSelf_end: {
    alignSelf: 'flex-end',
  },
  top: {
    marginTop: vp(40),
  },
  left: {width: vp(65), height: vp(65), marginRight: vp(20)},
});
