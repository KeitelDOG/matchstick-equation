import { EquationPart, OperationArgument } from "./Equation";
import Digit from "./Digit";

class Term implements EquationPart {
  public content: Digit[];

  public constructor (numStr : string) {
    // split num: '747'.split('') => ['7', '4', '7']
    this.content = numStr.split('').map((n: string) => new Digit(parseInt(n)));
  }

  public operate (arg: OperationArgument) {
    // when a Term (number) receive a value and function
    // it must call the function with:
    // - passed value as 1st variable
    // - its value as 2nd variable
    // and return that value with a function that will add or remove the next Term value from the current value
    const numStr = this.content.map(dig => dig.num).join('');
    const number = parseInt(numStr);
    const newValue = arg.operation(number);

    const keepSame = (val: number) => {
      return newValue;
    }

    return { value: newValue, operation: keepSame };
  }

  public getDigits () : Digit[] {
    return this.content;
  }

  public getNum () : number | null {
    const numStr = this.content.map(d => d.num).join('');
    const parsed = parseInt(numStr);
    if (!isNaN(parsed)) {
      return parsed;
    }
    return null;
  }
}

export default Term;