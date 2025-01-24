import {HEIGHT, WIDTH} from '~/constants/layout';

const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

const IS_PORTAIT = HEIGHT > WIDTH;
const realWidth = IS_PORTAIT ? WIDTH : HEIGHT;
const baseWidth = IS_PORTAIT ? BASE_WIDTH : BASE_HEIGHT;
/**
 * Virtual point converter - cares of responsive layout rendering
 * Calculates the sizes depends on current screen width
 * Base width is 375 - same to UI provided
 * When to use:
 * - no way to use flex
 * - no way to use percentage
 * - you are rendering images
 * - you are using numbers for layout
 * @param size: number - the desired size in pixels for a screen of width 375px
 * @returns number - the converted size in pt
 */
const vp = (size: number): number => Math.round((size * realWidth) / baseWidth);

globalThis.vp = vp;
