import { Clock } from "./clock";
import { CPU } from "./cpu";
import { GFX } from "./gfx";
import { Keyboard } from "./keyboard";

let systemRunning = false;
let isSystemLoopKilled = true;
const getRom = new XMLHttpRequest();
const keyboard = new Keyboard();
const canvas = (document.getElementById("chip-screen") as HTMLCanvasElement | undefined);
if (!canvas || canvas.tagName !== "CANVAS") {
  throw new Error("Could not find canvas with id chip-screen!");
}
const romSelect = (document.getElementById("rom-select") as HTMLSelectElement | undefined);
if (!romSelect || romSelect.tagName !== "SELECT") {
  throw new Error("Could not find select with id rom-select!");
}

romSelect.value = "PONG";
romSelect.onchange = () => {
  systemRunning = false;
  romSelect.blur();
  const requestInterval = setInterval(() => {
    if (isSystemLoopKilled) {
      clearInterval(requestInterval);
      requestRom(romSelect);
    }
  }, 5);
};

getRom.onload = () => {
  if (getRom.response) {
    const cpu = new CPU(new Uint8Array(getRom.response));
    const gfx = new GFX(canvas, 10);
    const clock = new Clock(4200000);
    systemRunning = true;
    systemLoop(cpu, gfx, clock);
  }
};

requestRom(romSelect);

function systemLoop(cpu: CPU, gfx: GFX, clock: Clock) {
  if (!systemRunning) {
    isSystemLoopKilled = true;
    cpu.killTimer();
    return;
  }
  setTimeout(() => {
    isSystemLoopKilled = false;
    cpu.setKeys(keyboard.key);
    for (let i = 0; i < 10; i++) {
      if (clock.shouldTick()) {
        cpu.cycle();
      }
    }
    if (cpu.drawFlag) {
      gfx.render(cpu.gfx);
    }
    systemLoop(cpu, gfx, clock);
  });
}

function requestRom(rs: HTMLSelectElement) {
  getRom.open("GET", `roms/${rs.value}`, true);
  getRom.responseType = "arraybuffer";
  getRom.send();
}
