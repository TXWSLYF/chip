import { Chip8 } from "chip8";
import { memory } from "chip8/chip8_bg.wasm";
import keyMap from "./keyMap";

const videoWidth = Chip8.video_width();
const videoHeight = Chip8.video_height();
const fileInputEl = document.getElementById("file-input");
const screenEl = document.getElementById("screen");
const screenContext = screenEl.getContext("2d");

const drawScreenToCanvas = (screenData, width, height) => {
  const imageData = new ImageData(width, height);

  for (let i = 0; i < screenData.length; i++) {
    const dataIndex = i * 4;

    if (screenData[i] === 0) {
      imageData.data[dataIndex] = 0;
      imageData.data[dataIndex + 1] = 0;
      imageData.data[dataIndex + 2] = 0;
      imageData.data[dataIndex + 3] = 255;
    } else if (screenData[i] === 1) {
      imageData.data[dataIndex] = 255;
      imageData.data[dataIndex + 1] = 255;
      imageData.data[dataIndex + 2] = 255;
      imageData.data[dataIndex + 3] = 255;
    }
  }

  screenContext.putImageData(imageData, 0, 0);
};

fileInputEl.addEventListener("change", (e) => {
  const file = e.target.files && e.target.files[0];
  if (file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      const result = e.target.result;
      const rom = new Uint8Array(result);
      const chip8 = Chip8.new();
      chip8.load_rom(rom);

      window.addEventListener("keydown", (e) => {
        const key = e.key;
        const index = keyMap.findIndex((i) => i === key);

        if (index !== -1) {
          chip8.set_keypad(index, true);
        }
      });

      window.addEventListener("keyup", (e) => {
        const key = e.key;
        const index = keyMap.findIndex((i) => i === key);

        if (index !== -1) {
          chip8.set_keypad(index, false);
        }
      });

      const renderLoop = () => {
        const chipScreenPtr = chip8.screen();
        const chipScreen = new Uint8Array(
          memory.buffer,
          chipScreenPtr,
          videoWidth * videoHeight
        );
        drawScreenToCanvas(chipScreen, videoWidth, videoHeight);

        for (let i = 0; i < 12; i++) {
          chip8.cycle();
        }

        chip8.update_timers();
        requestAnimationFrame(renderLoop);
      };

      renderLoop();
    };

    reader.readAsArrayBuffer(file);
  }
});
