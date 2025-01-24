import {
  defaultSystemFonts,
  HTMLContentModel,
  HTMLElementModel,
} from 'react-native-render-html';
import {fontFamily} from '~/theme/utils/font-family';
const fontElementModel = HTMLElementModel.fromCustomModel({
  tagName: 'font',
  contentModel: HTMLContentModel.mixed,
  getUADerivedStyleFromAttributes({face, color, size}) {
    let style: any = {};
    if (face) {
      style.fontFamily = face;
    }
    if (color) {
      style.color = color;
    }
    if (size) {
      // handle size such as specified in the HTML4 standard. This value
      // IS NOT in pixels. It can be absolute (1 to 7) or relative (-7, +7):
      // https://www.w3.org/TR/html4/present/graphics.html#edef-FONT
      // implement your solution here
    }

    return style;
  },
});
export const customHTMLElementModels = {font: fontElementModel};
export const systemFonts = [
  ...defaultSystemFonts,
  ...Object.values(fontFamily),
];
