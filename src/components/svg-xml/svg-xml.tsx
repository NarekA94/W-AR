import React, {memo} from 'react';
import {SvgXml as DefSvg, XmlProps} from 'react-native-svg';
import * as Xmls from '~/assets/svg-xml';

export type SvgXmlType = keyof typeof Xmls;

interface LocalProps extends XmlProps {
  xml: SvgXmlType;
  svgProps?: {[key: string]: any};
}

export const SvgXml = memo(({xml, svgProps, ...otherProps}: LocalProps) => {
  const xm: any = Xmls;
  const image: SvgXmlType | Function = xm[xml];
  return (
    <DefSvg
      xml={typeof image === 'function' ? image(svgProps) : image}
      {...otherProps}
    />
  );
});
