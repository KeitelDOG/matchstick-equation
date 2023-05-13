import Term from './Term';
import Operator from './Operator';
import Digit from './Digit';
import StickChar, { Segment } from './StickChar';

export type SolutionMove = {
  [pos: string]: 'add' | 'remove',
};

export type Solution = {
  content: string,
  moves: { [index: string]: SolutionMove }
}

export type OperationArgument = {
  value : number;
  operation : (val: number) => number;
}

export interface EquationPart {
  symbol: Digit[] | string | null;
  operate(arg: OperationArgument) : OperationArgument;
}

type SolveOption = {
  operation: string,
  stickQty: number
}

class Equation {
  public input: string;
  private parts: EquationPart[] = [];

  public constructor (input: string) {
    this.input = input;
    this.parse();
  }

  private parse () : void {
    let arg = '';
    const chars = this.input.split('');

    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];
      // if not a number, push the current arg if any
      if (isNaN(parseInt(char)) && arg) {
        const term = new Term(arg);
        this.parts.push(term);
        arg = '';
      }

      if (char === ' ') {
        continue;
      }

      const operators = ['+', '-', 'x', '/', '='];
      if (operators.includes(char)) {
        const operator = new Operator(char);
        this.parts.push(operator);
        continue;
      }

      if (!isNaN(parseInt(char))) {
        // add digit next to previous digit
        arg += char;

        // if it's the last char, and it is a number, push it
        if (i === chars.length - 1) {
          const term = new Term(arg);
          this.parts.push(term);
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

    /*
    if (expressions.length > 2) {
      return 'equation must include only one equal symbol =';
    }
    */

    return '';
  }

  public getParts () : EquationPart[] {
    return this.parts;
  }

  public getAllDigits () : Digit[] {
    let dgts : Digit[] = [];
    const parts = this.getParts();
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (part instanceof Term) {
        dgts = dgts.concat(part.getDigits());
      }
    }

    return dgts;
  }

  public getStickChars () : StickChar[] {
    // return instances of Digit and Operator in equation, NOT Term
    let stickChars : StickChar[] = [];
    this.getParts().map(part => {
      if (part instanceof Term) {
        stickChars = stickChars.concat(part.getDigits());
      } else if (part instanceof Operator) {
        stickChars.push(part);
      }
    });

    return stickChars;
  }

  public isValid () : boolean {
    const stickChars = this.getStickChars();

    let isValid = true;
    for (let i = 0; i < stickChars.length; i++) {
      const stickChar = stickChars[i];
      if (stickChar.symbol === null) {
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
    // equation can be like:
    // 3 + 0 = 3, or 3 = 3, or 3 = 3 = 3
    const parts : EquationPart[][] = [];
    parts.push([] as EquationPart[]);

    this.parts.forEach(part => {
      if (part instanceof Operator && part.symbol === '=') {
        parts.push([] as EquationPart[]);
      } else {
        parts[parts.length - 1].push(part);
      }
    });

    // if parts length is 1, then no = symbol was found (not an equation)
    if (parts.length <= 1) {
      return false;
    }

    if (parts.some(ep => !ep.length)) {
      return false;
    }

    const values = parts.map(ep => this.evaluateParts(ep));

    // console.log('left vs right', left, right);
    return values.every(val => val === values[0]);
  }

  public toString () : string {
    // return equation string like original input string
    return this.getParts().map(part => {
      if (part instanceof Term) {
        return part.getNum();
      } else if (part instanceof Operator) {
        return part.symbol;
      }
    }).join(' ');
  }

  public solve (option: SolveOption) : Solution[] {
    // TODO: consider segmentCount to allow moving 2 or more matchsticks
    const { operation, stickQty } = option;

    const stkChars = this.getStickChars();
    // console.log('stkChars', stkChars);

    /*
    exemple: add 2 sticks to solve 95 / 6 = 15
    format of solution: {
      content: '96 / 6 = 16',
      moves: {
        '1': { 'leftDown': 'add' },
        '6': { 'leftDown': 'add' }
      }
    }
    */
    const solutions : Solution[] = [];
    let sol: Solution = { content: '', moves: {} };

    type RemovedItem = { index: number, pos: Segment };
    let remItems: RemovedItem[] = [];

    // counter represent the qty of match sticks we already have added.
    // - counter starts at 0 when we only adding sticks
    // - counter increases by 1 each time we remove a stick
    //   so we can add them back if using "remove" operation
    let counter = stickQty - 1;

    const removing = (stickChars : StickChar[]) => {
      // REMOVE ONLY SEGMENTS THAT EXIST (segment === 1)
      for (let i = 0; i < stickChars.length; i++) {
        const stickChar = stickChars[i];
        const segments = stickChar.getSegments();
        // console.log('removing on -----', stickChar.symbol, i);
        // only take positions equal to 1
        const segPos = Object.keys(segments).filter(s => segments[s] === 1);
        for (let s = 0; s < segPos.length; s++) {
          const pos = segPos[s] as Segment;

          // 3 operations for permutation on removing segment
          // 1- Remove the segment
          // 2- proceed to adding segment at other place
            // (even in same Digit, but not at same position)
          // 3- Add segment back

          // 1-
          stickChar.removeSegment(pos);

          // 2-
          sol.moves[i] = sol.moves[i] || {};
          sol.moves[i][pos] = 'remove';
          // add removed item
          remItems.push({ index: i, pos });

          // continue to remove N amount of segment until it's N segment
          if (counter > 0) {
            counter -= 1;
            removing(stickChars);
            counter += 1;
          } else {
            // if operation is remove only, we don't need to add the removed segments
            if (operation === 'remove') {
              // search directly for solution now:
              // check equation validity
              if (this.isValid()) {
                const equationStr = this.toString();
                // console.log('printed:', equationStr);
                if (this.evaluate()) {
                  sol.content = equationStr;

                  // NB: Pass a new copy of solution to avoid referenced change
                  // on further manipulation
                  const newSol = JSON.parse(JSON.stringify(sol));
                  solutions.push(newSol);

                  console.log('SOLUTION 🎉🎉🎉 :', equationStr);
                  console.log(newSol);
                  // remove last added move from solution object
                  sol.content = '';
                }
              }
            } else {
              // console.log('segments removed, now adding:', this.toString());
              adding(stickChars, remItems);
            }
          }

          // 3-
          // remove last move
          delete sol.moves[i][pos];
          // remove the last item put as removed
          remItems.pop();
          stickChar.addSegment(pos);
        }
      }
    }

    const adding = (stickChars: StickChar[], removedItems: RemovedItem[]) => {
      // ADD ONLY IN SEGMENTS THAT DOES NOT EXIST (segment === 0)
      for (let i = 0; i < stickChars.length; i++) {
        // add 1 segment in digit or operator
        const stickChar = stickChars[i];
        // console.log('adding on', stickChar.symbol, i);

        const segments = stickChar.getSegments();
        // only take positions equal to 0
        const segPos = Object.keys(segments).filter(s => segments[s] === 0);
        for (let s = 0; s < segPos.length; s++) {
          const pos = <Segment> segPos[s];

          // skip from adding segment back to same digit it was removed
          const isSameDigitSegment : boolean = removedItems.some(ritem => ritem.index === i && ritem.pos === pos);
          if (isSameDigitSegment) {
            continue;
          }

          // 3 operations for permutation on adding segment
          // 1- Add the segment
          // 2- if equation is valid, evaluate equation for solution
          // 3- Remove segment back

          // 1-
          stickChar.addSegment(pos);

          sol.moves[i] = sol.moves[i] || {};
          sol.moves[i][pos] = 'add';

          // 2-
          // continue to add N amount of segment until it's 1 segment
          if (counter < stickQty - 1) {
            counter += 1;
            adding(stickChars, removedItems);
            counter -= 1;
          } else {
            // check equation validity
            if (this.isValid()) {
              const equationStr = this.toString();
              // console.log('printed:', equationStr);
              if (this.evaluate()) {
                sol.content = equationStr;

                // NB: Pass a new copy of solution to avoid referenced change
                // on further manipulation
                const newSol = JSON.parse(JSON.stringify(sol));
                solutions.push(newSol);

                console.log('SOLUTION 🎉🎉🎉 :', equationStr);
                console.log(newSol);
                // remove last added move from solution object
                sol.content = '';
              }
            }
          }

          // 3-
          // remove last move
          delete sol.moves[i][pos];
          stickChar.removeSegment(pos);
        }
      }
    }

    // if we only add sticks, then skip the removing permutations
    if (operation === 'add') {
      // if we are only adding, then put the counter to 1
      counter = 0;
      adding(stkChars, remItems);
    } else {
      // operations move and remove require the removing permutations
      removing(stkChars);
    }


    return solutions;
  }
}

export default Equation;