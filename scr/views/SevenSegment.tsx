import React from 'react';
import Image from 'next/image'
import Digit from '../Digit';

type PropsType = {
  digit: Digit,
  solMoves?: { [segment: string]: string }
};

export default function SevenSegment(props: PropsType) {
  const { digit, solMoves = {} } = props;
  const segments = digit.getSegments();
  const height: number = 80;
  const width: number = 48;
  const thickness: number = Math.floor(height/10);
  const midPos: number = Math.floor((height/2) - (thickness/2));

  const styles = useStyles(height, width, thickness, midPos);

  return (
    <div style={styles.root}>
      <div style={styles.container as React.CSSProperties}>
        {Object.keys(segments).map((segment: string, ind: number) => {
          let keyStyle = 'segment';

          if (solMoves[segment] === 'add') {
            keyStyle = 'segmentAdded';
          } else if (solMoves[segment] === 'remove') {
            keyStyle = 'segmentRemoved';
          }

          if (segments[segment] === 1 || solMoves[segment]) {
            return (
              <div
                key={`segment-${ind}`}
                style={{ ...styles[segment], ...styles.segmentWrapper} as React.CSSProperties}
              >
                <div style={styles[keyStyle]} data-segment={segment}
                data-keystyle={keyStyle}>
                </div>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}

const useStyles: Function = (height: number, width: number, thickness: number, midPos: number) : object => ({
  root: {
    // backgroundColor: '#eee'
  },
  container: {
    position: 'relative',
    height,
    width,
  },
  up: {
    paddingLeft: thickness,
    paddingRight: thickness,
    position: 'absolute',
    top: 0,
    left: 0,
    height: thickness,
    width: '100%',
  },
  down: {
    paddingLeft: thickness,
    paddingRight: thickness,
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: thickness,
    width: '100%',
  },
  middle: {
    paddingLeft: thickness,
    paddingRight: thickness,
    position: 'absolute',
    top: midPos,
    left: 0,
    height: thickness,
    width: '100%',
  },
  leftUp: {
    paddingTop: thickness,
    paddingBottom: thickness/2,
    position: 'absolute',
    top: 0,
    left: 0,
    height: '50%',
    width: thickness,
  },
  leftDown: {
    paddingTop: thickness/2,
    paddingBottom: thickness,
    position: 'absolute',
    top: '50%',
    left: 0,
    height: '50%',
    width: thickness,
  },
  rightUp: {
    paddingTop: thickness,
    paddingBottom: thickness/2,
    position: 'absolute',
    top: 0,
    right: 0,
    height: '50%',
    width: thickness,
  },
  rightDown: {
    paddingTop: thickness/2,
    paddingBottom: thickness,
    position: 'absolute',
    top: '50%',
    right: 0,
    height: '50%',
    width: thickness,
  },
  segmentWrapper: {
    display: 'flex',
  },
  segment: {
    flex: 1,
    backgroundColor: '#e44',
    borderRadius: '20%',
  },
  segmentAdded: {
    flex: 1,
    backgroundColor: '#a00',
    borderRadius: '20%',
  },
  segmentRemoved: {
    flex: 1,
    backgroundColor: '#eaeaea',
    borderRadius: '20%',
  },
});