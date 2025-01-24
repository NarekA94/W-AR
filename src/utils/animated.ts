import {createAnimatedPropAdapter, processColor} from 'react-native-reanimated';

export const svgFillColorAdapter = createAnimatedPropAdapter(
  props => {
    if (Object.keys(props).includes('fill')) {
      props.fill = {type: 0, payload: processColor(props.fill as string)};
    }
    if (Object.keys(props).includes('stroke')) {
      props.stroke = {type: 0, payload: processColor(props.stroke as string)};
    }
  },
  ['fill', 'stroke'],
);
