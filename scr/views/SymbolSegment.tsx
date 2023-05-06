import React from 'react';
import Image from 'next/image'
import Operator from '../Operator';

type PropsType = {
  operator: Operator,
  size?: number,
  solMoves?: { [segment: string]: string }
};

export default function SymbolSegment(props: PropsType) {
  const { operator, size = 80, solMoves = {} } = props;
  const segments = operator.getSegments();

  const height: number = size;
  const width: number = size;
  const thickness: number = Math.floor(height/10);
  const midPos: number = Math.floor((height/2)) - Math.floor(thickness/2);

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

          return (
            <div
              key={`segment-${ind}`}
              style={{ ...styles[segment], ...styles.segmentWrapper} as React.CSSProperties}
            >
              {segments[segment] === 1 && (
                <>
                  {['up', 'middle', 'down'].includes(segment) ? (
                    <img src="/matchstick-hor.png" alt="matchstick red" width={width - thickness*2} height={thickness} style={styles.segment} />
                  ) : (
                    <img src="/matchstick-vert.png" alt="matchstick red" width={thickness} height={width - thickness*2} style={styles.segment} />
                  )}
                </>
              )}

              {solMoves[segment] && (
                <div style={styles[keyStyle]} ></div>
              )}
            </div>
          );
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
    top: '20%',
    left: 0,
    height: thickness,
    width: '100%',
  },
  down: {
    paddingLeft: thickness,
    paddingRight: thickness,
    position: 'absolute',
    bottom: '20%',
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
  vertical: {
    paddingTop: thickness,
    paddingBottom: thickness,
    position: 'absolute',
    top: 0,
    left: '50%',
    width: thickness,
  },
  minorDiagonal: {
    paddingTop: thickness,
    paddingBottom: thickness,
    position: 'absolute',
    bottom: 0,
    left: '50%',
    width: thickness,
    transform: 'rotate(45deg)',
  },
  majorDiagonal: {
    paddingTop: thickness,
    paddingBottom: thickness,
    position: 'absolute',
    bottom: 0,
    left: '50%',
    width: thickness,
    transform: 'rotate(-45deg)',
  },
  segmentWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  segment: {
    flex: 1,
  },
  segmentAdded: {
    position: 'absolute',
    flex: 1,
    height: '100%',
    width: '100%',
    border: '1px dotted #88cc88'
  },
  segmentRemoved: {
    flex: 1,
    height: '100%',
    width: '100%',
    border: '1px dotted #ddbbbb'
  },
});