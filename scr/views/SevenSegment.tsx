import React from 'react';
import Image from 'next/image'
import Digit from '../Digit';

type PropsType = {
  digit: Digit,
  size?: number,
  solMoves?: { [segment: string]: string }
};

export default function SevenSegment(props: PropsType) {
  const { digit, size = 80, solMoves = {} } = props;
  const segments = digit.getSegments();

  const height: number = Math.floor(size * 1.8);
  const width: number = size;
  const thickness: number = Math.floor(height/16);
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
    paddingBottom: thickness,
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
    border: '2px dotted #88cc88'
  },
  segmentRemoved: {
    flex: 1,
    height: '100%',
    width: '100%',
    border: '2px dotted #ddbbbb'
  },
});