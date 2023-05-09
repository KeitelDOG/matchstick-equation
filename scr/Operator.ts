import StickChar from './StickChar';
import { EquationPart, OperationArgument } from './Equation';

class Operator extends StickChar implements EquationPart {
  public constructor (symbol : string) {
    // + or - or x or /
    super(symbol);
    this.type = 'operator';

    this.symbols = {
      '+': ['vertical', 'middle'],
      '-': ['middle'],
      'x': ['minorDiagonal', 'majorDiagonal'],
      '/': ['minorDiagonal'],
      '=': ['up', 'middle'],
    };

    this.segments = {
      up: 0,
      middle: 0,
      vertical: 0,
      minorDiagonal: 0,
      majorDiagonal: 0,
    };

    this.parse(symbol);
  }

  public operate (arg: OperationArgument) : OperationArgument {
    // when an Operator (+ or -) receive a value and function
    // it must call the function with:
    // - passed value as 1st variable
    // - its value as 2nd variable
    // and return that value with a function that return same value
    const newValue = arg.operation(arg.value);
    const applyOperation = (val : number) : number => {
      if (this.symbol === '+') {
        return newValue + val;
      } else if (this.symbol === '-') {
        return newValue - val;
      } else if (this.symbol === 'x') {
        return newValue * val;
      } else if (this.symbol === '/') {
        return newValue / val;
      }
      return 0;
    }

    return ({ value: newValue, operation: applyOperation });
  }
}

export default Operator;