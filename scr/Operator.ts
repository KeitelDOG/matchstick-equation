import { EquationPart, OperationArgument } from "./Equation";

export type OperatorSegment = 'up' | 'down' | 'middle' | 'vertical' | 'minorDiagonal' | 'majorDiagonal';

interface OperatorPositions {
  [key: string]: Array<OperatorSegment>
}

interface OperatorSegments {
  [key: string]: 0 | 1
}

class Operator implements EquationPart {
  public content: string | null;
  private segments: OperatorSegments = {
    up: 0,
    down: 0,
    middle: 0,
    vertical: 0,
    minorDiagonal: 0,
    majorDiagonal: 0,
  };

  private static symbols: OperatorPositions = {
    '+': ['vertical', 'middle'],
    '-': ['middle'],
    'x': ['minorDiagonal', 'majorDiagonal'],
    '/': ['minorDiagonal'],
    '=': ['up', 'down'],
  }

  public constructor (symbol : string) {
    // + or - or x or /
    this.content = symbol;
    this.parse(symbol);
  }

  private parse (symbol: string) : void {
    Operator.symbols[symbol].forEach((segment: string) => {
      this.segments[segment] = 1;
    });
  }

  public getSegments () : OperatorSegments {
    return this.segments;
  }

  public static getSymbol (segments: OperatorSegments) : string | null {
    function arraysEqual(a1: string[], a2: string[]) {
      return (
        a1.length === a2.length && new Set([...a1, ...a2]).size === a1.length)
        ? true
        : false;
    }

    // only take positions equal to 1
    const segmentPos = Object.keys(segments).filter(s => segments[s] === 1);

    let foundSymb = null;
    const symbols = Object.keys(Operator.symbols);

    for (let i = 0; i < symbols.length; i++) {
      const symbol = symbols[i];
      const pos = Operator.symbols[symbol];
      if (arraysEqual(segmentPos, pos)) {
        foundSymb = symbol;
      }
    }

    return foundSymb;
  }

  public removeSegment (segment: OperatorSegment) {
    // console.log('removing segment for', this.num, segment);
    if (this.segments[segment] === 0) {
      throw Error(`Digit ${this.content} has no segment ${segment}`);
    }

    this.segments[segment] = 0;
    this.content = Operator.getSymbol(this.segments);
  }

  public addSegment (segment: OperatorSegment) {
    // console.log('removing segment for', this.num, segment);
    if (this.segments[segment] === 1) {
      throw Error(`Digit ${this.content} already has segment ${segment}`);
    }

    this.segments[segment] = 1;
    this.content = Operator.getSymbol(this.segments);
  }

  public operate (arg: OperationArgument) : OperationArgument {
    // when an Operator (+ or -) receive a value and function
    // it must call the function with:
    // - passed value as 1st variable
    // - its value as 2nd variable
    // and return that value with a function that return same value
    const newValue = arg.operation(arg.value);
    const applyOperation = (val : number) : number => {
      if (this.content === '+') {
        return newValue + val;
      } else if (this.content === '-') {
        return newValue - val;
      } else if (this.content === 'x') {
        return newValue * val;
      } else if (this.content === '/') {
        return newValue / val;
      }
      return 0;
    }

    return ({ value: newValue, operation: applyOperation });
  }
}

export default Operator;