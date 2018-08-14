export class Speaker {
  constructor() {
    this.beep();
  }
  public beep() {
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "triangle";
    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start();
    oscillator.stop(0.1);
  }
}
