import { EquationPart, OperationArgument } from "./Equation";
import Digit from "./Digit";

class Operator implements EquationPart {
  public content: string;

  public constructor (operator : string) {
    // + or - or * or /
    this.content = operator;
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
      }
      return 0;
    }

    return ({ value: newValue, operation: applyOperation });
  }
}

export default Operator;