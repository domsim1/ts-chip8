
export class Clock {
  private currTime = 0.0;
  private lastTime = 0.0;
  private clockPeriod: number;

  constructor(freqHz: number) {
      this.clockPeriod = 1000 * (1 / freqHz);
      this.lastTime = performance.now();
  }

  public shouldTick(): boolean {
      this.currTime = performance.now();
      if (this.currTime - this.lastTime >= this.clockPeriod) {
          this.lastTime = this.currTime;
          return true;
      }

      return false;
  }
}
