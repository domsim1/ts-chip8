export class GFX {
  private canvas: HTMLCanvasElement;
  private rows = 32;
  private columns = 64;
  private scale: number;
  private ctx: CanvasRenderingContext2D | null;

  constructor(
    canvas: HTMLCanvasElement,
    scale: number,
  ) {
    this.canvas = canvas;
    this.canvas.width = this.columns * scale;
    this.canvas.height = this.rows * scale;
    this.scale = scale;
    this.ctx = this.canvas.getContext("2d");
  }

  public render(gfx: Uint8Array) {
    if (!this.ctx) {
      return;
    }
    for (let i = 0; i < (this.columns * this.rows); i++) {
      const x = (i % this.columns) * this.scale;
      const y = Math.floor(i / this.columns) * this.scale;
      if (gfx[i]) {
        this.ctx.fillStyle = "#FFF";
        this.ctx.fillRect(x, y, this.scale, this.scale);
      } else {
        this.ctx.fillStyle = "#000";
        this.ctx.fillRect(x, y, this.scale, this.scale);
      }
    }
  }
}
