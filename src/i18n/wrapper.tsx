import React from 'react';
import {IntlProvider} from 'react-intl';
import en from './languages/en.json';

interface I18nWrapperProps {
  children: React.ReactNode;
}

export const I18nWrapper: React.FC<I18nWrapperProps> = props => {
  return (
    <IntlProvider messages={en} defaultLocale="en" locale={'en'}>
      {props.children}
    </IntlProvider>
  );
};
