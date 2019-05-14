import { Clock } from "./clock";
import { Speaker } from "./speaker";

export class CPU {
  public drawFlag = false;
  public gfx = new Uint8Array(64 * 32);
  public key = new Uint8Array(16);
  private pc = 0x200;
  private opcode = 0;
  private I = 0;
  private sp = 0;
  private memory = new Uint8Array(4069);
  private V = new Uint8Array(16);
  private delayTimer = 0;
  private soundTimer = 0;
  private stack = new Uint16Array(16);
  private speaker = new Speaker();
  private timerRef: number | undefined;
  private clock = new Clock(60);

  constructor(program: Uint8Array) {
    this.loadFontsetIntoMemory();
    this.loadProgramIntoMemory(program);
    this.updateTimer();
  }

  public cycle() {
    this.opcode = this.memory[this.pc] << 8 | this.memory[this.pc + 1];
    this.handleOpcode();
  }

  public setKeys(keys: Uint8Array) {
    this.key = keys;
  }

  public killTimer() {
    if (this.timerRef) {
      clearInterval(this.timerRef);
    }
  }

  private handleOpcode() {
    const X = (this.opcode & 0x0F00) >> 8;
    const Y = (this.opcode & 0x00F0) >> 4;
    this.pc += 2;
    switch (this.opcode & 0xF000) {
      case (0x0000): {
        switch (this.opcode) {
          case (0x00E0): { // 00E0
            for (let i = 0; i < 0x800; i++) {
              this.gfx[i] = 0;
            }
            this.drawFlag = true;
            break;
          }
          case (0x00EE): { // 00EE
            this.pc = this.stack[--this.sp];
            break;
          }
          default: {
            console.log(`Unknown opcode [0x0000]: ${this.opcode}`);
          }
        }
        break;
      }
      case (0x1000): { // 1NNN
        this.pc = this.opcode & 0x0FFF;
        break;
      }
      case (0x2000): { // 2NNN
        this.stack[this.sp] = this.pc;
        this.sp += 1;
        this.pc = this.opcode & 0x0FFF;
        break;
      }
      case (0x3000): { // 3XNN
        if (this.V[X] === (this.opcode & 0x00FF)) {
          this.pc += 2;
        }
        break;
      }
      case (0x4000): { // 4XNN
        if (this.V[X] !== (this.opcode & 0x00FF)) {
          this.pc += 2;
        }
        break;
      }
      case (0x5000): { // 5XY0
        if (this.V[X] === this.V[Y]) {
          this.pc += 2;
        }
        break;
      }
      case (0x6000): { // 6XNN
        this.V[X] = (this.opcode & 0x00FF);
        break;
      }
      case (0x7000): { // 7XNN
        this.V[X] += (this.opcode & 0x00FF);
        break;
      }
      case (0x8000): {
        switch (this.opcode & 0x000F) {
          case (0x0000): { // 8XY0
            this.V[X] = this.V[Y];
            break;
          }
          case (0x0001): { // 8XY1
            this.V[X] = this.V[X] | this.V[Y];
            break;
          }
          case (0x0002): { // 8XY2
            this.V[X] = this.V[X] & this.V[Y];
            break;
          }
          case (0x0003): { // 8XY3
            this.V[X] = this.V[X] ^ this.V[Y];
            break;
          }
          case (0x0004): { // 8XY4
            this.V[X] += this.V[Y];
            this.V[0xF] = +(this.V[X] > 0xFF);
            break;
          }
          case (0x0005): { // 8XY5
            this.V[0xF] = +(this.V[X] > this.V[Y]);
            this.V[X] -= this.V[Y];
            break;
          }
          case (0x0006): { // 8XY6
            this.V[0x0F] = (this.V[X] & 0x01);
            this.V[X] = this.V[X] >> 1;
            break;
          }
          case (0x0007): { // 8XY7
            this.V[0xF] = +(this.V[Y] > this.V[X]);
            this.V[X] = this.V[Y] - this.V[X];
            break;
          }
          case (0x000E): { // 8XYE
            this.V[0xF] = +(this.V[X] & 0x80);
            this.V[X] = this.V[X] << 1;
            break;
          }
          default: {
            console.log(`Unknown opcode [0x8000]: ${this.opcode}`);
            break;
          }
        }
        break;
      }
      case (0x9000): { // 9XY0
        if (this.V[X] !== this.V[Y]) {
          this.pc += 2;
        }
        break;
      }
      case (0xA000): { // ANNN
        this.I = this.opcode & 0x0FFF;
        break;
      }
      case (0xB000): { // BNNN
        this.pc = (this.opcode & 0x0FFF) + this.V[0];
        break;
      }
      case (0xC000): { // CXNN
        this.V[X] = Math.floor(Math.random() * 0x00FF) & (this.opcode & 0x00FF);
        break;
      }
      case (0xD000): { // DXYN
        const x = this.V[X];
        const y = this.V[Y];
        const height = this.opcode & 0x000F;
        let pixel: number;
        this.V[0xF] = 0;
        for (let yline = 0; yline < height; yline++) {
          pixel = this.memory[this.I + yline];
          for (let xline = 0; xline < 8; xline++) {
            if ((pixel & (0x80 >> xline)) !== 0) {
              if (this.gfx[(x + xline + ((y + yline) * 64))] === 1) {
                this.V[0xF] = 1;
              }
              this.gfx[x + xline + ((y + yline) * 64)] ^= 1;
            }
          }
        }
        this.drawFlag = true;
        break;
      }
      case (0xE000): {
        switch (this.opcode & 0x00FF) {
          case (0x009E): { // EX9E
            if (this.key[this.V[X]]) {
              this.pc += 2;
            }
            break;
          }
          case (0x00A1): { // EXA1
            if (!this.key[this.V[X]]) {
              this.pc += 2;
            }
            break;
          }
          default: {
            console.log(`Unknown opcode [0xE000]: ${this.opcode}`);
            break;
          }
        }
        break;
      }
      case (0xF000): {
        switch (this.opcode & 0x00FF) {
          case (0x0007): { // FX07
            this.V[X] = this.delayTimer;
            break;
          }
          case (0x000A): { // FX0A
            let keyPress = false;
            for (let i = 0; i < 16; i++) {
              if (this.key[i] !== 0) {
                this.V[X] = i;
                keyPress = true;
              }
            }
            if (!keyPress) {
              this.pc -= 2;
              return;
            }
            break;
          }
          case (0x0015): { // FX15
            this.delayTimer = this.V[X];
            break;
          }
          case (0x0018): { // FX18
            this.soundTimer = this.V[X];
            break;
          }
          case (0x001E): { // FX1E
            this.I += this.V[X];
            break;
          }
          case (0x0029): { // FX29
            this.I = this.V[X] * 5;
            break;
          }
          case (0x0033): { // FX33
            let value = this.V[X];
            this.memory[this.I + 2] = (value % 10);
            value /= 10;
            this.memory[this.I + 1] = (value % 10);
            value /= 10;
            this.memory[this.I] = (value % 10);
            break;
          }
          case (0x0055): { // FX55
            for (let i = 0; i <= X; i++) {
              this.memory[this.I + i] = this.V[i];
            }
            break;
          }
          case (0x0065): { // FX65
            for (let i = 0; i <= X; i++) {
              this.V[i] = this.memory[this.I + i];
            }
            break;
          }
          default: {
            console.log(`Unknown opcode [0xF000]: ${this.opcode}`);
            break;
          }
        }
        break;
      }
      default: {
        console.log(`Unknown opcode: ${this.opcode}`);
        break;
      }
    }
  }

  private loadFontsetIntoMemory() {
    const fontset: number [] = [
      0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
      0x20, 0x60, 0x20, 0x20, 0x70, // 1
      0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2
      0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3
      0x90, 0x90, 0xF0, 0x10, 0x10, // 4
      0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5
      0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6
      0xF0, 0x10, 0x20, 0x40, 0x40, // 7
      0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8
      0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9
      0xF0, 0x90, 0xF0, 0x90, 0x90, // A
      0xE0, 0x90, 0xE0, 0x90, 0xE0, // B
      0xF0, 0x80, 0x80, 0x80, 0xF0, // C
      0xE0, 0x90, 0x90, 0x90, 0xE0, // D
      0xF0, 0x80, 0xF0, 0x80, 0xF0, // E
      0xF0, 0x80, 0xF0, 0x80, 0x80, // F
    ];

    for (let i = 0; i < fontset.length; i++) {
      this.memory[i] = fontset[i];
    }
  }

  private loadProgramIntoMemory(program: Uint8Array) {
    for (let i = 0; i < program.length; i++) {
      this.memory[0x200 + i] = program[i];
    }
  }

  private updateTimer() {
    this.timerRef = setInterval(() => {
      if (this.clock.shouldTick()) {
        if (this.delayTimer > 0) {
          this.delayTimer -= 1;
        }
        if (this.soundTimer === 1) {
          this.speaker.beep();
        }
        if (this.soundTimer > 0) {
          this.soundTimer -= 1;
        }
      }
    });
  }
}
