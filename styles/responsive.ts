import { width } from '../src/constants/styleConst';

let startButtonFontSize = width * 0.08;

if (width > 600) {
  startButtonFontSize = (width / 3) * 0.08;
}

export { startButtonFontSize };
