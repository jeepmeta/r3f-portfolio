import fs from "fs";
import { createCanvas, loadImage } from "canvas";

const FRAME_SIZE = 30;
const FRAMES = 4;

async function extract() {
  const img = await loadImage("public/jeep.png");

  const canvas = createCanvas(FRAME_SIZE, FRAME_SIZE);
  const ctx = canvas.getContext("2d");

  const allFrames = [];

  for (let f = 0; f < FRAMES; f++) {
    const frameX = f * FRAME_SIZE;

    ctx.clearRect(0, 0, FRAME_SIZE, FRAME_SIZE);
    ctx.drawImage(img, frameX, 0, FRAME_SIZE, FRAME_SIZE, 0, 0, FRAME_SIZE, FRAME_SIZE);

    const imageData = ctx.getImageData(0, 0, FRAME_SIZE, FRAME_SIZE).data;

    const frame = [];

    for (let y = 0; y < FRAME_SIZE; y++) {
      const row = [];

      for (let x = 0; x < FRAME_SIZE; x++) {
        const idx = (y * FRAME_SIZE + x) * 4;
        const r = imageData[idx];
        const g = imageData[idx + 1];
        const b = imageData[idx + 2];
        const a = imageData[idx + 3];

        row.push([r, g, b, a]);
      }

      frame.push(row);
    }

    allFrames.push(frame);
  }

  fs.writeFileSync("app/data/dog_pixels.json", JSON.stringify(allFrames, null, 2));
  console.log("dog_pixels.json created!");
}

extract();
