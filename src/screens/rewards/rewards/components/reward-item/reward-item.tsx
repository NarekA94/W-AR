import React, {FC, memo, useCallback, useEffect, useRef, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {
  AppText,
  BottomSheet,
  BottomSheetRef,
  Box,
  Button,
  CartProductItem,
  HR,
  Points,
  RewardStatus,
  RewardTab,
} from '~/components';
import {
  Details,
  Reward,
  RewardState,
  useCancelRewardMutation,
} from '~/store/query/rewards';
import {
  ButtonVariant,
  FontWeight,
  GLOBAL_STYLES,
  TextColors,
  TextVariant,
} from '~/theme';
import {QrIcon} from '../qr-icon/qr-icon';
import {DispensaryStatus, RowItem} from '~/components/dispensary';
import Clipboard from '@react-native-clipboard/clipboard';
import LocationIcon from '~/assets/images/zip/location.svg';
import AlarmIcon from '~/assets/images/alarm.svg';
import {useNavigation} from '@react-navigation/native';
import {UserScreenNavigationProp, UserStackRoutes} from '~/navigation';
import {styles} from './styles';
import moment from 'moment';
import {useIntl} from 'react-intl';
import {QueryStatus} from '@reduxjs/toolkit/dist/query';
import {DeleteSheet} from '~/screens/product-cart/product-cart/components';
import CancelOrderIcon from '~/assets/images/rewards/cancel.png';

interface RewardItemProps {
  reward: Reward;
  needToShowAll: boolean;
}

const snapPoints = ['61%'];
export const RewardItem: FC<RewardItemProps> = memo(
  ({reward, needToShowAll}) => {
    const isReward = !!reward.sumBrandPoints;
    const intl = useIntl();
    const [showAll, setShowAll] = useState<boolean>(false);
    const [cancelReward, {isLoading: cancelInProgress, status}] =
      useCancelRewardMutation();

    const isDelivery = !!reward.deliveryAddress;
    const navigation = useNavigation<UserScreenNavigationProp>();
    const handlePressCopy = useCallback((copyText: string) => {
      Clipboard.setString(copyText);
    }, []);
    const bottomSheetModalRef = useRef<BottomSheetRef>(null);

    const changeScreenMode = useCallback(() => {
      setShowAll(!showAll);
    }, [showAll]);

    const handlePressCancel = useCallback(() => {
      bottomSheetModalRef.current?.open();
    }, []);

    const handleDelete = useCallback(() => {
      bottomSheetModalRef.current?.close();
      cancelReward({id: reward.id});
    }, [cancelReward, reward]);

    const closeDeleteSheet = useCallback(() => {
      bottomSheetModalRef.current?.close();
    }, []);

    const handlePressQr = useCallback(() => {
      navigation.navigate(UserStackRoutes.RewardQr, {
        dispensaryName: reward.dispensary?.name,
        qr: reward.qrCode?.url,
        orderNumber: reward.number,
      });
    }, [reward, navigation]);

    const renderProducts = useCallback((item: Details) => {
      return (
        <CartProductItem
          key={item.id}
          name={item.product.name}
          thc={item.product.thc}
          gramWeight={item.product.gramWeight}
          ounceWeight={item.product.ounceWeight}
          imageUri={item.product.images?.[0]?.file?.url}
          quantity={item.quantity}
        />
      );
    }, []);
    useEffect(() => {
      if (needToShowAll) {
        setShowAll(true);
      }
    }, [needToShowAll]);
    return (
      <>
        <Box containerStyle={styles.boxStyle} radius={25}>
          <View style={styles.root}>
            <View>
              <View style={[GLOBAL_STYLES.row_between, styles.horizontal_16]}>
                <View style={GLOBAL_STYLES.row_vertical_center}>
                  <AppText variant={TextVariant.S_R} color={TextColors.A060}>
                    {intl.formatMessage({
                      id: 'phrases.order',
                      defaultMessage: 'Order',
                    })}
                    :{' '}
                  </AppText>
                  <AppText variant={TextVariant.M_R} color={TextColors.A100}>
                    {reward.number}
                  </AppText>
                </View>
                <RewardStatus
                  color={reward.stateStyle.textColor}
                  backgroundColor={reward.stateStyle.background}
                  title={reward.stateName}
                />
              </View>
              {showAll && (
                <AppText style={styles.createdDate} variant={TextVariant.P_M}>
                  {moment(reward.createdAt).format('MMMM DD, YYYY hh:mm a')}
                </AppText>
              )}
              <View style={styles.productSection}>
                <View>
                  {!showAll && (
                    <>
                      <RewardTab
                        timeTypeText={reward.typeInfo.timeTypeText}
                        typeText={reward.typeInfo.typeText}
                        containerStyles={styles.rewardTab}
                        tab={reward.tab}
                      />
                      <View style={GLOBAL_STYLES.row_vertical_center}>
                        <AppText
                          style={styles.orderCost}
                          size={12}
                          variant={TextVariant.S_R}
                          color={TextColors.A060}>
                          {intl.formatMessage({
                            id: isReward
                              ? 'phrases.paid_by'
                              : 'phrases.order_cost',
                            defaultMessage: isReward ? 'Paid by' : 'Order cost',
                          })}
                          :
                        </AppText>
                        {isReward ? (
                          <Points
                            points={reward.sumBrandPoints}
                            size={18}
                            iconSize={10}
                          />
                        ) : (
                          <AppText
                            variant={TextVariant.H_5}
                            fontWeight={FontWeight.W500}
                            color={TextColors.A100}>
                            ${reward.sumDollar}
                          </AppText>
                        )}
                      </View>
                    </>
                  )}
                </View>
                <View>
                  {reward.state !== RewardState.COMPLETED &&
                    reward.state !== RewardState.CANCELED && (
                      <QrIcon
                        onPress={handlePressQr}
                        disabled={!reward.qrCode}
                      />
                    )}
                </View>
              </View>
            </View>
            {showAll && (
              <View style={styles.footer}>
                <View style={GLOBAL_STYLES.horizontal_20}>
                  {reward.details.map(renderProducts)}
                </View>
                <HR style={styles.hr} />
                <View style={[GLOBAL_STYLES.row_between, styles.horizontal_16]}>
                  <AppText variant={TextVariant.S_L} color={TextColors.G090}>
                    {isDelivery ? 'Delivery address' : 'Dispensary info'}
                  </AppText>
                  <DispensaryStatus
                    isThirdParty={reward?.dispensary?.isThirdParty}
                  />
                </View>
                {!isDelivery && (
                  <AppText
                    style={styles.dispensaryName}
                    variant={TextVariant.B_B}
                    color={TextColors.A100}>
                    {reward?.dispensary.name}
                  </AppText>
                )}
                <View style={styles.dispensaryBlock}>
                  <RowItem
                    titleStyles={styles.titleStyles}
                    title={
                      isDelivery
                        ? reward?.deliveryAddress
                        : reward?.dispensary?.address
                    }
                    icon={<LocationIcon width={vp(20)} />}
                    withCopy={!isDelivery}
                    onPress={handlePressCopy}
                  />
                  <AppText
                    style={styles.infoText}
                    variant={TextVariant.S_L}
                    color={TextColors.G090}>
                    {reward.infoText}
                  </AppText>
                  <RewardTab
                    fontWeight={FontWeight.W500}
                    iconSize={20}
                    containerStyles={styles.rewardTabShowAll}
                    textSize={15}
                    tab={reward.tab}
                    timeTypeText={reward.typeInfo.timeTypeText}
                    typeText={reward.typeInfo.typeText}
                  />
                  {reward?.waitingTime && (
                    <RowItem
                      titleStyles={styles.workDays}
                      title={reward.waitingTime}
                      icon={<AlarmIcon width={vp(20)} />}
                    />
                  )}
                  <View style={styles.priceBox}>
                    <AppText variant={TextVariant.S_L} color={TextColors.G090}>
                      {intl.formatMessage({
                        id: 'phrases.total_quantity',
                        defaultMessage: 'Total quantity',
                      })}
                    </AppText>
                    <AppText size={18} variant={TextVariant.H2_A}>
                      {reward?.details.reduce(
                        (n, {quantity}) => n + quantity,
                        0,
                      )}
                    </AppText>
                  </View>
                  {!isReward && (
                    <>
                      <View style={styles.priceBox}>
                        <AppText
                          variant={TextVariant.S_L}
                          color={TextColors.G090}>
                          {intl.formatMessage({
                            id: 'phrases.product_price',
                            defaultMessage: 'Product price',
                          })}
                        </AppText>
                        <AppText size={18} variant={TextVariant.H2_A}>
                          ${reward?.productSumDollar}
                        </AppText>
                      </View>
                      {!!reward?.deliveryFee && (
                        <View style={styles.priceBox}>
                          <AppText
                            variant={TextVariant.S_L}
                            color={TextColors.G090}>
                            {intl.formatMessage({
                              id: 'phrases.delivery_fee',
                              defaultMessage: 'Delivery fee',
                            })}
                          </AppText>
                          <AppText size={18} variant={TextVariant.H2_A}>
                            ${reward?.deliveryFee}
                          </AppText>
                        </View>
                      )}

                      <HR style={styles.hr2} />
                      <View style={styles.priceBox}>
                        <AppText
                          variant={TextVariant.S_L}
                          color={TextColors.G090}>
                          {intl.formatMessage({
                            id: 'phrases.total_amount',
                            defaultMessage: 'Total amount',
                          })}
                        </AppText>
                        <AppText variant={TextVariant.H2_A}>
                          ${reward?.sumDollar}
                        </AppText>
                      </View>
                    </>
                  )}
                  {isReward && (
                    <View style={GLOBAL_STYLES.row_vertical_center}>
                      <AppText
                        // size={12}
                        variant={TextVariant.S_R}
                        color={TextColors.A060}>
                        {intl.formatMessage({
                          id: 'phrases.paid_by',
                          defaultMessage: 'Paid by',
                        })}
                        :{' '}
                      </AppText>
                      <Points
                        points={reward.sumBrandPoints}
                        size={20}
                        iconSize={12}
                      />
                    </View>
                  )}
                </View>
              </View>
            )}
            <View style={styles.seeAll}>
              {showAll &&
                reward.state !== RewardState.COMPLETED &&
                reward.state !== RewardState.CANCELED && (
                  <View style={styles.cancelButton}>
                    <Button
                      onPress={handlePressCancel}
                      isLoading={cancelInProgress}
                      disabled={status === QueryStatus.fulfilled}
                      variant={ButtonVariant.RED}
                      title={intl.formatMessage({
                        id: 'global.cancel',
                        defaultMessage: 'Cancel',
                      })}
                      width={'100%'}
                    />
                  </View>
                )}
              <TouchableOpacity onPress={changeScreenMode} hitSlop={20}>
                <AppText variant={TextVariant.S_L}>
                  {showAll ? 'Hide All' : 'See All'}
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        </Box>
        <BottomSheet ref={bottomSheetModalRef} snapPoints={snapPoints}>
          <DeleteSheet
            icon={CancelOrderIcon}
            title={intl.formatMessage({
              id: 'screens.reward.cancel.title',
              defaultMessage: 'Cancel order',
            })}
            message={intl.formatMessage({
              id: 'screens.reward.cancel.info',
              defaultMessage: 'Are you certain about canceling this order?',
            })}
            onPressDelete={handleDelete}
            close={closeDeleteSheet}
            confirmText={intl.formatMessage({
              id: 'global.yes',
              defaultMessage: 'Yes',
            })}
            cancelText={intl.formatMessage({
              id: 'global.no',
              defaultMessage: 'No',
            })}
          />
        </BottomSheet>
      </>
    );
  },
);
