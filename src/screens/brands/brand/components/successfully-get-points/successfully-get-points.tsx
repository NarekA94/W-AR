import React, {FC, memo, useCallback, useEffect, useState} from 'react';
import {StyleSheet, View, Modal} from 'react-native';
import {AppText, Button, RadialGradient} from '~/components';
import {WIDTH} from '~/constants/layout';
import {BlurView} from '@react-native-community/blur';
import GotPointsIcon from '~/assets/images/qrscanner/gotPoints.svg';
import {ButtonVariant, TextColors, TextVariant} from '~/theme';
import {useIntl} from 'react-intl';
import {
  useCheckQrCodeMutation,
  useQrCodeRedeemMutation,
} from '~/store/query/qrcode';
import {AlertApiError} from '~/store/utils';
import {authenticModel} from '~/storage/models/authentic';
import {logger} from '~/utils';
import {usePrefetch} from '~/store/query/brand';
import {productApi} from '~/store/query/product';
import {useGetBrandCtx} from '~/context/brand/hooks';

interface SuccessfullyGetPointsModalProps {
  token?: string;
  onGetBrandId?: (brandId: number) => void;
  brandId?: number;
  gameId?: string;
  redeemed?: boolean;
}

const contentRadialGradient = ['rgba(35, 35, 35, 1)', 'rgba(0, 0, 0, 1)'];

export const SuccessfullyGetPointsModal: FC<SuccessfullyGetPointsModalProps> =
  memo(({token, onGetBrandId, brandId, gameId, redeemed}) => {
    const prefetchBrand = usePrefetch('getBrand');
    const prefetchProducts = productApi.usePrefetch('getProducts');
    const [qrCodeRedeem] = useQrCodeRedeemMutation();
    const cachedToken = authenticModel.getAuthenticToken();
    const cachedRedeemed = authenticModel.getIsAuthenticTokenRedeemed();

    const [checkQrCode] = useCheckQrCodeMutation();
    const {lastPoints, setPendingPoints} = useGetBrandCtx();
    const [isVisible, setIsVisible] = useState(false);
    const [pointsForQr, setPointsForQr] = useState(0);

    const intl = useIntl();
    const open = useCallback(() => setIsVisible(true), []);
    const close = useCallback(() => setIsVisible(false), []);

    useEffect(() => {
      if (token) {
        checkQrCode({uniqueString: token})
          .unwrap()
          .then(res => {
            onGetBrandId?.(res.brand.id);
            prefetchBrand({id: res.brand.id});
            if (!res.used && !redeemed && !cachedRedeemed) {
              setPointsForQr(res.brandPoints);
              open();
            } else {
              if (cachedToken) {
                authenticModel.removeAuthenticTokenAndStatus();
              }
            }
          });
      }
    }, [token]);

    useEffect(() => {
      if (gameId) {
        open();
      }
    }, [gameId]);
    const onPressOk = useCallback(() => {
      const uniqueString = token;
      if (uniqueString) {
        close();
        qrCodeRedeem({uniqueString: token})
          .unwrap()
          .then(() => {
            if (brandId) {
              setPendingPoints?.((lastPoints || 0) + pointsForQr);
              prefetchBrand({id: brandId}, {force: true});

              prefetchProducts({brandId: brandId}, {force: true});
            }
            close();
          })
          .catch(e => {
            logger.warn(e);
            AlertApiError(e);
            close();
          });
        if (cachedToken) {
          authenticModel.removeAuthenticTokenAndStatus();
        }
      }
    }, [
      brandId,
      token,
      cachedToken,
      pointsForQr,
      lastPoints,
      setPendingPoints,
    ]);

    const onPressOkGame = useCallback(() => {
      close();
      if (gameId && brandId) {
        prefetchBrand({id: brandId}, {force: true});
        prefetchProducts({brandId: brandId}, {force: true});
      }
    }, [gameId, brandId]);

    return (
      <Modal style={styles.modal} transparent={true} visible={isVisible}>
        <View style={styles.root}>
          <RadialGradient
            width={WIDTH - 40}
            height={vp(444)}
            colors={contentRadialGradient}>
            <View style={styles.body}>
              <GotPointsIcon />
              <AppText
                style={styles.title}
                variant={TextVariant.H3_A}
                withGradient>
                {intl.formatMessage({
                  id: 'authentic.brend.success.title',
                  defaultMessage: 'Congrats!',
                })}
              </AppText>
              <AppText
                style={styles.info}
                color={TextColors.G090}
                variant={TextVariant.S_R}>
                {intl.formatMessage({
                  id: 'authentic.brend.success.info',
                  defaultMessage:
                    'You successfully got points on your personal account. Use it to get free products!',
                })}
              </AppText>
              <Button
                containerStyle={styles.button}
                onPress={gameId ? onPressOkGame : onPressOk}
                title={'Ok'}
                variant={ButtonVariant.GRAY}
                width={'65%'}
              />
            </View>
          </RadialGradient>
          <BlurView blurType="dark" blurAmount={10} style={styles.blur} />
        </View>
      </Modal>
    );
  });

const styles = StyleSheet.create({
  modal: {margin: 0},
  root: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  blur: {
    zIndex: -9,
    ...StyleSheet.absoluteFillObject,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: vp(50),
  },
  title: {
    marginTop: vp(20),
    marginBottom: vp(17),
  },
  button: {
    marginTop: vp(43),
  },
  info: {
    textAlign: 'center',
    lineHeight: 20,
  },
});
