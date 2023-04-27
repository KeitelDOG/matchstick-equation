import Term from './Term';
import Operator from './Operator';
import Digit, { Segment } from './Digit';

export type SolutionMove = {
  [pos: string]: 'add' | 'remove',
};

export type Solution = {
  content: string,
  moves: { [digitIndex: string]: SolutionMove }
}

export type OperationArgument = {
  value : number;
  operation : (val: number) => number;
}

export interface EquationPart {
  content: Digit[] | string;
  operate(arg: OperationArgument) : OperationArgument;
}

type Expression = Array<EquationPart>;

interface Sides {
  [side: string]: Expression;
}

class Equation {
  public input: string;
  private sides: Sides = { left: [], right: [] };

  public constructor (input: string) {
    this.input = input;
    this.parse();
  }

  private parse () : void {
    let arg = '';
    let side = 'left';
    const chars = this.input.split('');

    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];
      // if not a number, push the current arg if any
      if (isNaN(parseInt(char)) && arg) {
        const term = new Term(arg);
        this.sides[side].push(term);
        arg = '';
      }

      if (char === ' ') {
        continue;
      }

      if (char === '=') {
        // change side
        side = 'right';
        continue;
      }

      if (char === '+' || char === '-') {
        const operator = new Operator(char);
        this.sides[side].push(operator);
        continue;
      }

      if (!isNaN(parseInt(char))) {
        // add digit next to previous digit
        arg += char;

        // if it's the last char, and it is a number, push it
        if (i === chars.length - 1) {
          const term = new Term(arg);
          this.sides[side].push(term);
        }
      }
    }
  }

  public validateInput () : string {
    if (this.input.length === 0) {
      return 'no equation...';
    }

    if (!this.input.includes('=')) {
      return 'equation must include equal symbol =';
    }

    if (isNaN(parseInt(this.input[0]))) {
      return '1st element in the equation must be a number';
    }

    const expressions = this.input.split('=');
    if (expressions.length === 1) {
      return 'equation must include equal symbol =';
    }

    if (expressions.length === 2) {
      if (expressions[0] === '' || expressions[1] === '') {
        return 'equation must have an expression at both left and right side';
      }
    }

    if (expressions.length > 2) {
      return 'equation must include only one equal symbol =';
    }

    return '';
  }

  public getSides () : Sides {
    return this.sides;
  }

  public getFullParts () : Expression {
    const equal: EquationPart = new Operator('=');
    return this.sides.left.concat([equal]).concat(this.sides.right);
  }

  public getAllDigits () : Digit[] {
    let dgts : Digit[] = [];
    const parts = this.getFullParts();
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (part instanceof Term) {
        dgts = dgts.concat(part.getDigits());
      }
    }

    return dgts;
  }

  public isValid () : boolean {
    const digits = this.getAllDigits();

    let isValid = true;
    for (let i = 0; i < digits.length; i++) {
      const digit = digits[i];
        if (digit.num === null) {
          isValid = false;
          break;
        }
    }

    return isValid;
  }

  public evaluateParts (parts: EquationPart[]) : number {
    let value = 0;
    let operation = (val: number) => {
      // return for the first time return the passed number
      // equivalent to sum 0 + val
      return val;
    }

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const result = part.operate({ value, operation });
      value = result.value;
      operation = result.operation;
      // console.log('value', value);
    }

    return value;
  }

  public evaluate () : boolean {
    const left = this.evaluateParts(this.sides.left);
    const right = this.evaluateParts(this.sides.right);
    // console.log('left vs right', left, right);
    return left === right;
  }

  public print () : string {
    // return equation string like original input string
    return this.getFullParts().map(part => {
      if (part instanceof Term) {
        return part.getNum();
      } else {
        return part.content;
      }
    }).join(' ');
  }

  public solve (segmentCount : number) : Solution[] {
    // TODO: consider segmentCount to allow moving 2 or more matchsticks
    const digits = this.getAllDigits();
    // console.log('digits', digits);

    const solutions : Solution[] = [];
    let sol: Solution = { content: '', moves: {} };

    type RemovedItem = { digitIndex: number, pos: Segment };

    const removing = (dgts : Digit[], count: number) => {
      // REMOVE ONLY SEGMENTS THAT EXIST (segment === 1)
      for (let i = 0; i < dgts.length; i++) {
        // remove 1 segment in digit
        const digit = dgts[i];
        // console.log('removing on -----', digit.num);

        const segments = digit.getSegments();
        // only take positions equal to 1
        const segPos = Object.keys(segments).filter(s => segments[s] === 1);
        for (let s = 0; s < segPos.length; s++) {
          const pos = <Segment> segPos[s];

          // 3 operations for permutation on removing segment
          // 1- Remove the segment
          // 2- proceed to adding segment at other place
            // (even in same Digit, but not at same position)
          // 3- Add segment back

          // 1-
          digit.removeSegment(pos);

          // 2-
          sol.moves[i] = sol.moves[i] || {};
          sol.moves[i][pos] = 'remove';
          // console.log('valid now adding:', this.print());
          adding(dgts, [{ digitIndex: i, pos }], count);
          // removed = null;
          // reset solution
          sol.moves = {};

          // 3-
          digit.addSegment(pos);
        }
      }
    }

    const adding = (dgts: Digit[], removedItems: RemovedItem[], count: number) => {
      // ADD ONLY IN SEGMENTS THAT DOES NOT EXIST (segment === 0)
      for (let i = 0; i < dgts.length; i++) {
        // remove 1 segment in digit
        const digit = dgts[i];
        // console.log('adding on', digit.num);

        const segments = digit.getSegments();
        // only take positions equal to 0
        const segPos = Object.keys(segments).filter(s => segments[s] === 0);
        for (let s = 0; s < segPos.length; s++) {
          const pos = <Segment> segPos[s];

          // skip from adding segment back to same digit it was removed
          const isSameDigitSegment : boolean = removedItems.some(ritem => ritem.digitIndex === i && ritem.pos === pos);
          if (isSameDigitSegment) {
            continue;
          }

          // 3 operations for permutation on adding segment
          // 1- Add the segment
          // 2- if equation is valid, evaluate equation for solution
          // 3- Remove segment back

          // 1-
          digit.addSegment(pos);

          // 2-
          // check equation validity
          if (this.isValid()) {
            const equationStr = this.print();
            // console.log('printed:', equationStr);
            if (this.evaluate()) {
              sol.content = equationStr;
              sol.moves[i] = sol.moves[i] || {};
              sol.moves[i][pos] = 'add';

              // NB: Pass a new copy of solution to avoid referenced change
              // on further manipulation
              const newSol = JSON.parse(JSON.stringify(sol));
              solutions.push(newSol);

              console.log('SOLUTION 🎉🎉🎉 :', equationStr);
              console.log(newSol);
              // remove last added move from solution object
              sol.content = '';
              delete sol.moves[i][pos];
            }
          }

          // 3-
          digit.removeSegment(pos);
        }
      }
    }

    removing(digits, 0);

    return solutions;
  }
}

export default Equation;