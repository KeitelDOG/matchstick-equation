export type Segment = 'up' | 'down' | 'middle' | 'leftUp' | 'leftDown' | 'rightUp' | 'rightDown' | 'vertical' | 'minorDiagonal' | 'majorDiagonal';

interface Positions {
  [key: string]: Array<Segment>
}

interface Segments {
  [key: string]: 0 | 1
}

class StickChar {
  public type: string = '';
  public symbol: string | null;
  protected segments: Segments = {};

  protected symbols: Positions = {}

  public constructor (symbol : string) {
    this.symbol = symbol;
  }

  protected parse (symbol: string) : void {
    this.symbols[symbol].forEach((segment: string) => {
      this.segments[segment] = 1;
    });
  }

  public getSegments () : Segments {
    return this.segments;
  }

  private getSymbol (segments: Segments) : string | null {
    function arraysEqual(a1: string[], a2: string[]) {
      return (
        a1.length === a2.length && new Set([...a1, ...a2]).size === a1.length)
        ? true
        : false;
    }

    // only take positions equal to 1
    const segmentPos = Object.keys(segments).filter(s => segments[s] === 1);

    let foundSymb = null;
    const symbols = Object.keys(this.symbols);

    for (let i = 0; i < symbols.length; i++) {
      const symbol = symbols[i];
      const pos = this.symbols[symbol];
      if (arraysEqual(segmentPos, pos)) {
        foundSymb = symbol;
      }
    }

    return foundSymb;
  }

  public removeSegment (segment: Segment) : void {
    // console.log('removing segment for', this.symbol, segment);
    if (this.segments[segment] === 0) {
      throw Error(`StickChar ${this.symbol} has no segment ${segment}`);
    }

    this.segments[segment] = 0;
    this.symbol = this.getSymbol(this.segments);
  }

  public addSegment (segment: Segment) : void {
    // console.log('adding segment for', this.symbol, segment);
    if (this.segments[segment] === 1) {
      throw Error(`StickChar ${this.symbol} already has segment ${segment}`);
    }

    this.segments[segment] = 1;
    this.symbol = this.getSymbol(this.segments);
  }
}

export default StickChar;