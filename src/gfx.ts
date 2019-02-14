export class GFX {
  private canvas: HTMLCanvasElement;
  private rows = 32;
  private columns = 64;
  private ctx: CanvasRenderingContext2D | null;

  constructor(
    canvas: HTMLCanvasElement,
    scale: number,
  ) {
    this.canvas = canvas;
    this.canvas.width = this.columns * scale;
    this.canvas.height = this.rows * scale;
    this.ctx = this.canvas.getContext("2d");
    if (!this.ctx) {
      throw new Error("Could not get context 2d from canvas!");
    }
    this.ctx.scale(scale, scale);
  }

  public render(gfx: Uint8Array) {
    if (!this.ctx) {
      return;
    }
    for (let i = 0; i < (this.columns * this.rows); i++) {
      const x = (i % this.columns);
      const y = Math.floor(i / this.columns);
      if (gfx[i]) {
        this.ctx.fillStyle = "#FFF";
        this.ctx.fillRect(x, y, 1, 1);
      } else {
        this.ctx.fillStyle = "#000";
        this.ctx.fillRect(x, y, 1, 1);
      }
    }
  }
}
