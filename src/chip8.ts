import { CPU } from "./cpu";
import { GFX } from "./gfx";
import { Keyboard } from "./keyboard";

let systemRunning = false;
let isSystemLoopKilled = true;
const cpuHz = 1000 / 500;
const getRom = new XMLHttpRequest();
const keyboard = new Keyboard();
const canvas = (document.getElementById("chip-screen") as HTMLCanvasElement);
const romSelect = (document.getElementById("rom-select") as HTMLSelectElement);

romSelect.value = "BREAKOUT";
romSelect.onchange = () => {
  systemRunning = false;
  romSelect.blur();
  const requestInterval = setInterval(() => {
    if (isSystemLoopKilled) {
      clearInterval(requestInterval);
      requestRom();
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

requestRom();

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

function requestRom() {
  getRom.open("GET", `roms/${romSelect.value}`, true);
  getRom.responseType = "arraybuffer";
  getRom.send();
}
