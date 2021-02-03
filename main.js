const imageInput = document.getElementById("imageInput");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const red = document.getElementById("red");
const green = document.getElementById("green");
const blue = document.getElementById("blue");
const brightness = document.getElementById("brightness");
const contrast = document.getElementById("contrast");
const grayscale = document.getElementById("grayscale");

const selectedImage = new Image;

imageInput.onchange = e => {
  if (e.target.files && e.target.files[0]) {
    selectedImage.src = URL.createObjectURL(e.target.files[0]);
  }
};

let imageData = null;
let originalPixels = null;
let currentPixels = null;

selectedImage.onload = () => {
  canvas.width = selectedImage.width;
  canvas.height = selectedImage.height;
  ctx.drawImage(selectedImage, 0, 0, selectedImage.width, selectedImage.height);
  imageData = ctx.getImageData(0, 0, selectedImage.width, selectedImage.height);
  originalPixels = imageData.data.slice();
};

const clampRGBValue = value => Math.max(0, Math.min(Math.floor(value), 255));

const getIndex = (x, y) => (x + y * selectedImage.width) * 4;

const B_OFFSET = 2;

const addBlue = (x, y, value) => {
  const index = getIndex(x, y) + B_OFFSET;
  const currentValue = currentPixels[index];
  currentPixels[index] = clampRGBValue(currentValue + value);
};

const runPipeline = () => {
  currentPixels = originalPixels.slice();

  const blueFilterInputValue = Number(blue.value);

  for (let i = 0; i < selectedImage.height; i++) {
    for (let j = 0; j < selectedImage.width; j++) {
      // Add blue to pixel (j, i) according to selected value

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
blue.onchange = runPipeline;
green.onchange = runPipeline;
grayscale.onchange = runPipeline;
contrast.onchange = runPipeline;
brightness.onchange = runPipeline;


