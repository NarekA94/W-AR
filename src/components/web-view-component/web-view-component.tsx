import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import {WebView} from 'react-native-webview';
import {ScreenWrapper} from '~/components';

interface WebViewComponentProp {
  uri: string;
}

export const WebViewComponent: FC<WebViewComponentProp> = ({uri}) => {
  const [isLoading, setIsloading] = React.useState<boolean>(true);
  return (
    <ScreenWrapper withHeader>
      <View style={styles.container}>
        <WebView
          source={{uri: uri}}
          style={isLoading ? styles.webViewLoading : styles.webviewLoaded}
          showsVerticalScrollIndicator={false}
          onLoadEnd={() => {
            setTimeout(() => {
              setIsloading(false);
            }, 250);
          }}
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webviewLoaded: {
    flex: 1,
    backgroundColor: 'black',
    marginBottom: vp(10),
    opacity: 1,
  },
  webViewLoading: {
    flex: 1,
    opacity: 0,
  },
});
