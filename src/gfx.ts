export class GFX {
  private canvas: HTMLCanvasElement;
  private rows = 32;
  private columns = 64;
  private scale: number;

  constructor(
    canvas: HTMLCanvasElement,
    scale: number,
  ) {
    this.canvas = canvas;
    this.canvas.width = this.columns * scale;
    this.canvas.height = this.rows * scale;
    this.scale = scale;
  }

  public render(gfx: Uint8Array) {
    const ctx = this.canvas.getContext("2d");
    for (let i = 0; i < (this.columns * this.rows); i++) {
      const x = (i % this.columns) * this.scale;
      const y = Math.floor(i / this.columns) * this.scale;
      if (gfx[i]) {
        (ctx as CanvasRenderingContext2D).fillStyle = "#FFF";
        (ctx as CanvasRenderingContext2D).fillRect(x, y, this.scale, this.scale);
      } else {
        (ctx as CanvasRenderingContext2D).fillStyle = "#000";
        (ctx as CanvasRenderingContext2D).fillRect(x, y, this.scale, this.scale);
      }
    }
  }
}
