import StickChar from './StickChar';

class Digit extends StickChar {
  public constructor (symbol : string) {
    super(symbol);
    this.type = 'digit';

    this.symbols = {
      '0': ['up', 'down', 'leftUp', 'leftDown', 'rightUp', 'rightDown'],
      '1': ['rightUp', 'rightDown'],
      '2': ['up', 'down', 'middle', 'leftDown', 'rightUp'],
      '3': ['up', 'down', 'middle', 'rightUp', 'rightDown'],
      '4': ['middle', 'leftUp', 'rightUp', 'rightDown'],
      '5': ['up', 'down', 'middle', 'leftUp', 'rightDown'],
      '6': ['up', 'down', 'middle', 'leftUp', 'leftDown', 'rightDown'],
      '7': ['up', 'rightUp', 'rightDown'],
      '8': ['up', 'down', 'middle', 'leftUp', 'leftDown', 'rightUp', 'rightDown'],
      '9': ['up', 'down', 'middle', 'leftUp', 'rightUp', 'rightDown'],
    };

    this.segments = {
      up: 0,
      down: 0,
      middle: 0,
      leftUp: 0,
      leftDown: 0,
      rightUp: 0,
      rightDown: 0,
    };

    this.parse(symbol);
  }
}

export default Digit;