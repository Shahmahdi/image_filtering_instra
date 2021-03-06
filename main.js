const imageInput = document.getElementById("imageInput");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const red = document.getElementById("red");
const green = document.getElementById("green");
const blue = document.getElementById("blue");
const brightness = document.getElementById("brightness");
const contrast = document.getElementById("contrast");
const grayscale = document.getElementById("grayscale");

const selectedImage = new Image();

let imageData = null;
let originalPixels = null;
let currentPixels = null;

imageInput.onchange = e => {
  if (e.target.files && e.target.files[0]) {
    selectedImage.src = URL.createObjectURL(e.target.files[0]);
  }
};

selectedImage.onload = () => {
  canvas.width = selectedImage.width;
  canvas.height = selectedImage.height;
  ctx.drawImage(selectedImage, 0, 0, selectedImage.width, selectedImage.height);
  imageData = ctx.getImageData(0, 0, selectedImage.width, selectedImage.height);
  originalPixels = imageData.data.slice();
};

const clampRGBValue = value => Math.max(0, Math.min(Math.floor(value), 255));

const getIndex = (x, y) => (x + y * selectedImage.width) * 4;

const RED_OFFSET = 0;
const GREEN_OFFSET = 1;
const BLUE_OFFSET = 2;

const addRed = (x, y, value) => {
  const index = getIndex(x, y) + RED_OFFSET;
  const currentValue = currentPixels[index];
  currentPixels[index] = clampRGBValue(currentValue + value);
};

const addGreen = (x, y, value) => {
  const index = getIndex(x, y) + GREEN_OFFSET;
  const currentValue = currentPixels[index];
  currentPixels[index] = clampRGBValue(currentValue + value);
};

const addBlue = (x, y, value) => {
  const index = getIndex(x, y) + BLUE_OFFSET;
  const currentValue = currentPixels[index];
  currentPixels[index] = clampRGBValue(currentValue + value);
};

const addBrightness = (x, y, value) => {
  addRed(x, y, value);
  addGreen(x, y, value);
  addBlue(x, y, value);
};

const setGrayscale = (i, j) => {
  const redIndex = getIndex(i, j) + RED_OFFSET;
  const greenIndex = getIndex(i, j) + GREEN_OFFSET;
  const blueIndex = getIndex(i, j) + BLUE_OFFSET;

  const redValue = currentPixels[redIndex];
  const greenValue = currentPixels[greenIndex];
  const blueValue = currentPixels[blueIndex];

  const mean = (redValue + greenValue + blueValue) / 3;

  currentPixels[redIndex] = clampRGBValue(mean);
  currentPixels[greenIndex] = clampRGBValue(mean);
  currentPixels[blueIndex] = clampRGBValue(mean);
};

const addContrast = (x, y, value) => {
  const redIndex = getIndex(x, y) + RED_OFFSET;
  const greenIndex = getIndex(x, y) + GREEN_OFFSET;
  const blueIndex = getIndex(x, y) + BLUE_OFFSET;

  const redValue = currentPixels[redIndex];
  const greenValue = currentPixels[greenIndex];
  const blueValue = currentPixels[blueIndex];

  const contrastRate = (value + 255) / 255;

  const updatedRed = contrastRate * (redValue - 128) + 128;
  const updatedGreen = contrastRate * (greenValue - 128) + 128;
  const updatedBlue = contrastRate * (blueValue - 128) + 128;

  currentPixels[redIndex] = clampRGBValue(updatedRed);
  currentPixels[greenIndex] = clampRGBValue(updatedGreen);
  currentPixels[blueIndex] = clampRGBValue(updatedBlue);
}

const runPipeline = () => {
  currentPixels = originalPixels.slice();

  const redFilterInputValue = Number(red.value);
  const greenFilterInputValue = Number(green.value);
  const blueFilterInputValue = Number(blue.value);
  const brightnessFilterInputValue = Number(brightness.value);
  const contrastFilterInputValue = Number(contrast.value);
  const grayscaleFilter = grayscale.checked;

  for (let i = 0; i < selectedImage.height; i++) {
    for (let j = 0; j < selectedImage.width; j++) {
      if (grayscaleFilter) {
        setGrayscale(j, i);
      }

      addBrightness(j, i, brightnessFilterInputValue);
      addContrast(j, i, contrastFilterInputValue);

      addRed(j, i, redFilterInputValue);
      addGreen(j, i, greenFilterInputValue);
      addBlue(j, i, blueFilterInputValue);
    }
  }

  // Draw updated image
  for (let i = 0; i < imageData.data.length; i++) {
    imageData.data[i] = currentPixels[i];
  }
  ctx.putImageData(imageData, 0, 0, 0, 0, selectedImage.width, selectedImage.height);
};

red.onchange = runPipeline;
green.onchange = runPipeline;
blue.onchange = runPipeline;
brightness.onchange = runPipeline;
grayscale.onchange = runPipeline;
contrast.onchange = runPipeline;


