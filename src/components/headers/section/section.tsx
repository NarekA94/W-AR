import React, {FC} from 'react';
import {AppText} from '~/components';
import {TextVariant} from '~/theme';

interface SectionHeaderProps {
  title: string;
  textVariant?: TextVariant;
  marginTop?: number;
  marginBottom?: number;
}

export const SectionHeader: FC<SectionHeaderProps> = ({
  marginBottom = 7,
  marginTop = 17,
  ...props
}) => {
  return (
    <AppText style={{marginBottom, marginTop}} variant={props.textVariant}>
      {props.title}
    </AppText>
  );
};
