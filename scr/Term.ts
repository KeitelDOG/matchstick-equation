import { EquationPart, OperationArgument } from "./Equation";
import Digit from "./Digit";

class Term implements EquationPart {
  public symbol: Digit[];

  public constructor (numStr : string) {
    // split num: '747'.split('') => ['7', '4', '7']
    this.symbol = numStr.split('').map((n: string) => new Digit(n));
  }

  public getDigits () : Digit[] {
    return this.symbol;
  }

  public getNum () : string | null {
    const numStr = this.symbol.map(d => d.symbol).join('');
    const parsed = parseInt(numStr);
    if (!isNaN(parsed)) {
      return numStr;
    }
    return null;
  }

  public operate (arg: OperationArgument) {
    // when a Term (number) receive a value and function
    // it must call the function with:
    // - passed value as 1st variable
    // - its value as 2nd variable
    // and return that value with a function that will add or remove the next Term value from the current value
    const numStr = this.symbol.map(dig => dig.symbol).join('');
    const number = parseInt(numStr);
    const newValue = arg.operation(number);

    const keepSame = (val: number) => {
      return newValue;
    }

    return { value: newValue, operation: keepSame };
  }
}

export default Term;