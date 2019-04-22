export class Keyboard {
  public key: Uint8Array;
  constructor() {
    this.key = new Uint8Array(16);
    document.onkeydown = this.handleKeyDown.bind(this);
    document.onkeyup = this.handleKeyUp.bind(this);
  }

  private handleKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case ("1"): {
        this.key[0x1] = 1;
        break;
      }
      case ("2"): {
        this.key[0x2] = 1;
        break;
      }
      case ("3"): {
        this.key[0x3] = 1;
        break;
      }
      case ("4"): {
        this.key[0xC] = 1;
        break;
      }
      case ("q"): {
        this.key[0x4] = 1;
        break;
      }
      case ("w"): {
        this.key[0x5] = 1;
        break;
      }
      case ("e"): {
        this.key[0x6] = 1;
        break;
      }
      case ("r"): {
        this.key[0xD] = 1;
        break;
      }
      case ("a"): {
        this.key[0x7] = 1;
        break;
      }
      case ("s"): {
        this.key[0x8] = 1;
        break;
      }
      case ("d"): {
        this.key[0x9] = 1;
        break;
      }
      case ("f"): {
        this.key[0xE] = 1;
        break;
      }
      case ("z"): {
        this.key[0xA] = 1;
        break;
      }
      case ("x"): {
        this.key[0x0] = 1;
        break;
      }
      case ("c"): {
        this.key[0xB] = 1;
        break;
      }
      case ("v"): {
        this.key[0xF] = 1;
        break;
      }
    }
  }

  private handleKeyUp(event: KeyboardEvent) {
    switch (event.key) {
      case ("1"): {
        this.key[0x1] = 0;
        break;
      }
      case ("2"): {
        this.key[0x2] = 0;
        break;
      }
      case ("3"): {
        this.key[0x3] = 0;
        break;
      }
      case ("4"): {
        this.key[0xC] = 0;
        break;
      }
      case ("q"): {
        this.key[0x4] = 0;
        break;
      }
      case ("w"): {
        this.key[0x5] = 0;
        break;
      }
      case ("e"): {
        this.key[0x6] = 0;
        break;
      }
      case ("r"): {
        this.key[0xD] = 0;
        break;
      }
      case ("a"): {
        this.key[0x7] = 0;
        break;
      }
      case ("s"): {
        this.key[0x8] = 0;
        break;
      }
      case ("d"): {
        this.key[0x9] = 0;
        break;
      }
      case ("f"): {
        this.key[0xE] = 0;
        break;
      }
      case ("z"): {
        this.key[0xA] = 0;
        break;
      }
      case ("x"): {
        this.key[0x0] = 0;
        break;
      }
      case ("c"): {
        this.key[0xB] = 0;
        break;
      }
      case ("v"): {
        this.key[0xF] = 0;
        break;
      }
    }
  }
}
