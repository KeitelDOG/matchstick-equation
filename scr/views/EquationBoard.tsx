import Equation, { EquationPart, SolutionMove } from '../Equation';
import SevenSegment from '../../scr/views/SevenSegment';
import SymbolSegment from '../../scr/views/SymbolSegment';
import StickChar from '../StickChar';
import Digit from '../Digit';
import Operator from '../Operator';

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

  const validationError = equation.validateInput();
  if (validationError) {
    return (
      <div style={{ display: 'flex', flexDirection: 'row'}}>
        <span>{validationError}</span>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      {equation.getStickChars().map((stickChar : StickChar, ind: number) => {
        let solMoves = {};
        if (moves[ind]) {
          solMoves = moves[ind];
        }

        return (
          <div key={`stickchar-${ind}`} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ padding: 5 }} >
              {stickChar instanceof Digit && (
                <SevenSegment digit={stickChar} solMoves={solMoves} />
              )}

              {stickChar instanceof Operator && (
                <SymbolSegment operator={stickChar} solMoves={solMoves} />
              )}
            </div>
          </div>
        );
      })}
    </div>
  )
}
