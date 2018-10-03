import { CPU } from "./cpu";
import { GFX } from "./gfx";
import { Keyboard } from "./keyboard";

let systemRunning = false;
let isSystemLoopKilled = true;
const cpuHz = 1000 / 500;
const getRom = new XMLHttpRequest();
const keyboard = new Keyboard();
const canvas = (document.getElementById("chip-screen") as HTMLCanvasElement | null);
if (!canvas || canvas.tagName !== "CANVAS") {
  throw new Error("Could not find canvas with id chip-screen!");
}
const romSelect = (document.getElementById("rom-select") as HTMLSelectElement | null);
if (!romSelect || romSelect.tagName !== "SELECT") {
  throw new Error("Could not find select with id rom-select!");
}

romSelect.value = "BREAKOUT";
romSelect.onchange = () => {
  systemRunning = false;
  romSelect.blur();
  const requestInterval = setInterval(() => {
    if (isSystemLoopKilled) {
      clearInterval(requestInterval);
      requestRom(romSelect);
    }
  }, cpuHz * 2);
};

getRom.onload = () => {
  if (getRom.response) {
    const cpu = new CPU(new Uint8Array(getRom.response));
    const gfx = new GFX(canvas, 10);
    systemRunning = true;
    systemLoop(cpu, gfx);
  }
};

requestRom(romSelect);

function systemLoop(cpu: CPU, gfx: GFX) {
  if (!systemRunning) {
    isSystemLoopKilled = true;
    return;
  }
  setTimeout(() => {
    isSystemLoopKilled = false;
    cpu.cycle();
    if (cpu.drawFlag) {
      gfx.render(cpu.gfx);
    }
    cpu.setKeys(keyboard.key);
    systemLoop(cpu, gfx);
  }, cpuHz);
}

function requestRom(rs: HTMLSelectElement) {
  getRom.open("GET", `roms/${rs.value}`, true);
  getRom.responseType = "arraybuffer";
  getRom.send();
}
