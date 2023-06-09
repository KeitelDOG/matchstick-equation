import React from 'react';
import Equation, { Solution } from '../scr/Equation';
import EquationBoard from '../scr/views/EquationBoard';

export default function Home() {
  const styles = useStyles();

  const [equationStr, setEquationStr] = React.useState<string>('');
  const [stickQty, setStickQty] = React.useState<number>(1);
  const [operation, setOperation] = React.useState<string>('move');
  const [solutions, setSolutions] = React.useState<Solution[]>([]);

  React.useEffect(() => {
      const eq = new Equation(equationStr);
      const validationError = eq.validateInput();
      if (!validationError && eq.isValid()) {
        console.log('equation is valid');
        const solutions = eq.solve({
          operation,
          stickQty
        });
        setSolutions(solutions);
      }
  }, [equationStr, operation, stickQty]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEquationStr(event.currentTarget.value);
  }

  const handleChangeStickQty = (event: React.SyntheticEvent<HTMLSelectElement>) => {
    setStickQty(parseInt(event.currentTarget.value));
  }

  const handleChangeOperation = (event: React.SyntheticEvent<HTMLSelectElement>) => {
    setOperation(event.currentTarget.value);
  }

  /*
  // TODO: setup solve button if Matchstick Engine is moving to server side
  const handleSolve = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setDisplay(true);
  }
  */

  const containerStyle = {
    margin: '20px 0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  };

  // group by equation string solution
  const group = solutions.reduce((acc, sol) => {
    acc[sol.content] = acc[sol.content] || [];
    acc[sol.content].push(sol);
    return acc;
  }, {} as {[key: string]: Solution[] });

  return (
    <div style={styles.container}>
      <main style={styles.main}>
        <h1 style={styles.title}>Match Stick Equation Solver</h1>
        <div style={styles.optionsContainer}>
          <div style={styles.option}>
            <span>operation:</span>
            <select style={styles.select} onChange={handleChangeOperation}>
              <option>move</option>
              <option>remove</option>
              <option>add</option>
            </select>
          </div>
          <div style={styles.option}>
            <span>qty:</span>
            <select style={styles.select} onChange={handleChangeStickQty}>
              <option>1</option>
              <option>2</option>
              <option>3</option>
            </select>
          </div>
        </div>
        <div style={styles.inputContainer}>
          <div style={styles.wrapper}>
            <input style={styles.input} placeholder="enter equation. Ex: 1 + 2 + 3 + 8 = 21" onChange={handleChange} />
          </div>

          {/*<button style={styles.button} onClick={handleSolve}>Solve</button>*/}
        </div>

        <div style={containerStyle as React.CSSProperties}>
          <EquationBoard input={equationStr} />
        </div>

        <h3 style={styles.subtitle}>Solutions ({operation} {stickQty} {stickQty > 1 ?'sticks' : 'stick'}):</h3>

        {solutions.length ? (
          Object.keys(group).map((grpKey, grpInd) => {
            // grpKey is the equation string
            const sols = group[grpKey];
            const firstSol = sols.shift() as Solution;
            return (
              <div key={`group-${grpInd}`} style={styles.group} >
                <span style={styles.groupText}>{grpKey}</span>
                <div
                  style={containerStyle as React.CSSProperties}
                >
                  <EquationBoard input={firstSol.content} moves={firstSol.moves} />
                </div>

                {/* Multiple combination of stick moves can achieve the same equation.
                show them later if necessary. Only 1st one is shown for now.
                sols.map((sol, ind) => (
                  <div
                    key={`solution-${ind}`}
                    style={containerStyle as React.CSSProperties}
                  >
                    <EquationBoard input={sol.content} moves={sol.moves} />
                  </div>
                ))*/}
              </div>
            );
          })
        ) : (
          <span>no solution</span>
        )}

        {/*solutions.length ? (
          solutions.map((sol, ind) => (
            <div
              key={`solution-${ind}`}
              style={containerStyle as React.CSSProperties}
            >
              <EquationBoard input={sol.content} moves={sol.moves} />
            </div>
          ))
        ) : (
          <span>no solution</span>
        )*/}
      </main>
    </div>
  )
}

const useStyles: Function = () : object => ({
  container: {
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    maxWidth: 800,
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  title: {
    color: '#44A',
    fontWeight: 500,
  },
  subtitle: {
    color: '#44A',
  },
  optionsContainer: {
    padding: 5,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  option: {
   marginRight: 40,
  },
  inputContainer: {
    padding: 5,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 520,
    border: '1px solid #ccc',
    borderRadius: 5,
    height: 60,
  },
  wrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    height: '100%',
  },
  input: {
    margin: '0 10px',
    flex: 1,
    fontSize: 20,
    border: 'none',
    outline: 'none',
  },
  select: {
    marginLeft: 10,
    padding: 5,
    height: '100%',
    color: '#44c',
    fontSize: 16,
    border: '1px solid #44c',
    borderRadius: 5,
    cursor: 'pointer',
  },
  button: {
    padding: 5,
    // flex: 1,
    width: 100,
    height: '100%',
    color: '#fff',
    fontSize: 16,
    backgroundColor: '#44c',
    border: '1px solid #44c',
    borderRadius: 5,
    cursor: 'pointer',
  },
  groupText: {
    cursor: 'pointer',
  }
});
