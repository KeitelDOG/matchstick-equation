import Term from '../../scr/Term';
import Operator from '../../scr/Operator';
import Equation, { EquationPart, SolutionMove } from '../../scr/Equation';
import SevenSegment from '../../scr/views/SevenSegment';
import SymbolSegment from '../../scr/views/SymbolSegment';

type PropsType = {
  input: string,
  moves?: { [digitIndex: string]: SolutionMove }
};


export default function EquationBoard(props: PropsType) {
  const { input, moves = {} } = props;
  const equation = new Equation(input);

  const spanStyle = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    fontSize: 32,
  };

  const validation = equation.validateInput();
  if (validation) {
    return (
      <div style={{ display: 'flex', flexDirection: 'row'}}>
        <span>{validation}</span>
      </div>
    )
  }

  // track indexes for Digits only while traversing
  // mixed (Terms and Operators in getFullParts() : EquationPart)
  let digitIndex = -1;

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      {equation.getFullParts().map((part : EquationPart, ind: number) => {
        if (part instanceof Term) {
          return (
            <div key={`digit-${ind}`} style={{ display: 'flex' }}>
              {part.content.map((digit, ind2) => {
                // increment digitIndex only when accessing a digit
                digitIndex += 1;

                let solMoves = {};
                if (moves[digitIndex]) {
                  solMoves = moves[digitIndex];
                }

                return (
                  <div key={`segment-${ind2}`} style={{ padding: 5 }} >
                    <SevenSegment digit={digit} solMoves={solMoves} />
                  </div>
                );
              })}
            </div>
          );
        }

        if (part instanceof Operator) {
          const operator = part as Operator;
          // increment digitIndex only when accessing a digit
          let solMoves = {};
          if (moves[ind]) {
            solMoves = moves[ind];
          }

          return (
            <div key={`operator-${ind}`} style={{ display: 'flex' , alignItems: 'center'}}>
              <div key={`segment-${ind}`} style={{ padding: 5 }} >
                <SymbolSegment operator={operator} solMoves={solMoves} />
              </div>
            </div>
          );
        }

        /*
        const operator = part as Operator;
        return <span key={`left-operator-${ind}`} style={spanStyle as React.CSSProperties}>{operator.content}</span>;
        */
      })}
    </div>
  )
}
