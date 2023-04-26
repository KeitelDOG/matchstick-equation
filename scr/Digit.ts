export type Segment = 'up' | 'down' | 'middle'| 'leftUp' | 'leftDown' | 'rightUp' | 'rightDown';

interface DigitPositions {
  [key: string]: Array<Segment>
}

interface Segments {
  [key: string]: 0 | 1
}

class Digit {
  public num: number | null;
  private segments: Segments = {
    up: 0,
    down: 0,
    middle: 0,
    leftUp: 0,
    leftDown: 0,
    rightUp: 0,
    rightDown: 0,
  };

  private static nums: DigitPositions = {
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
  }

  public constructor (num : number) {
    this.num = num;
    this.parse(num);
  }

  private parse (num: number) : void {
    Digit.nums[num.toString()].forEach((segment: string) => {
      this.segments[segment] = 1;
    });
  }

  public getSegments () : Segments {
    return this.segments;
  }

  public static getNumber (segments: Segments) : number | null {
    function arraysEqual(a1: string[], a2: string[]) {
      return (
        a1.length === a2.length && new Set([...a1, ...a2]).size === a1.length)
        ? true
        : false;
    }

    // only take positions equal to 1
    const segmentPos = Object.keys(segments).filter(s => segments[s] === 1);

    let foundNum = null;
    const nums = Object.keys(Digit.nums);

    for (let i = 0; i < nums.length; i++) {
      const num = nums[i];
      const pos = Digit.nums[num];
      if (arraysEqual(segmentPos, pos)) {
        foundNum = parseInt(num);
      }
    }

    return foundNum;
  }

  public removeSegment (segment: Segment) {
    // console.log('removing segment for', this.num, segment);
    if (this.segments[segment] === 0) {
      throw Error(`Digit ${this.num} has no segment ${segment}`);
    }

    this.segments[segment] = 0;
    this.num = Digit.getNumber(this.segments);
  }

  public addSegment (segment: Segment) {
    // console.log('removing segment for', this.num, segment);
    if (this.segments[segment] === 1) {
      throw Error(`Digit ${this.num} already has segment ${segment}`);
    }

    this.segments[segment] = 1;
    this.num = Digit.getNumber(this.segments);
  }
}

export default Digit;