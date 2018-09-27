'use strict';

window.onload = () => { // add blank 640x640 canvas when content is loaded
  const main = document.querySelector('.main');
  const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 640;

  const canvasErrorMessage = document.createElement('div');
    canvasErrorMessage.classList.add('error');
    canvasErrorMessage.textContent = 'Your browser doesn\'t support HTML canvas elements. Please consider switching to a more modern browser! Here are some suggestions:';
    const linkList = document.createElement('ul');
      const firefoxLink = document.createElement('a');
        firefoxLink.href = 'https://www.mozilla.org/firefox';
        firefoxLink.textContent = 'Mozilla Firefox';
      const chromeLink = document.createElement('a');
        chromeLink.href = 'https://www.google.com/chrome/';
        chromeLink.textContent = 'Google Chrome';
      const ieIsABadIdeaLink = document.createElement('a');
        ieIsABadIdeaLink.href = 'https://www.ezcomputersolutions.com/blog/stop-using-internet-explorer/';
        ieIsABadIdeaLink.textContent = 'Internet Explorer';
      const listItem1 = document.createElement('li');
        listItem1.appendChild(firefoxLink);
      const listItem2 = document.createElement('li');
        listItem2.appendChild(chromeLink);
      const listItem3 = document.createElement('li');
        listItem3.appendChild(ieIsABadIdeaLink);
      linkList.appendChild(listItem1);
      linkList.appendChild(listItem2);
      linkList.appendChild(listItem3);
    canvasErrorMessage.appendChild(linkList);
  canvas.appendChild(canvasErrorMessage);

  const accessibilityMessage = document.createElement('div');
    accessibilityMessage.classList.add('hidden');
    accessibilityMessage.textContent = 'This site is a visual representation inspired by the Etch-a-Sketch children\'s toy. If you are using a screen reader or other non-visual device to access this website, I\'m sorry to say that you won\'t be able to access or interact with the content.';
  canvas.appendChild(accessibilityMessage);

  main.appendChild(canvas);

  createCanvas(16);
}

const grid = {
  //empty object to hold information about squares drawn on the canvas -- Since canvas elements don't remember what they've drawn, I'll have to keep information separately in order to modify individual cells and redraw the grid
}

// hex codes for colors to use when filling
const colors = ['#9400D3', '#4B0082', '#0000FF', '#00FF00', '#FFFF00',
    '#FF7F00', '#FF0000'];

const createCanvas = (n = 16) => { // function to draw canvas. Takes param for number of rows/columns
  const canvas = document.querySelector('canvas');
  if (canvas.getContext) { // if browser supports canvas, define context for drawing
    const ctx = canvas.getContext('2d');
  } else { // if browser doesn't support canvas, no need to draw. So get out of here!
    return;
  }

  // Size and center the canvas
  canvas.classList.add('canvas');
  const viewWidth = Math.max(document.documentElement.clientWidth || window.innerWidth || 0);
  const viewHeight = Math.max(document.documentElement.clientHeight || window.innerHeight || 0);
  const squareLength = Math.min(viewWidth, viewHeight) - 40;
  canvas.width = squareLength;
  canvas.height = squareLength;
  canvas.style.marginLeft = `${(viewWidth - squareLength) / 2}px`;
  canvas.style.marginTop = `${(viewHeight - squareLength) / 2}px`;

  // Create the data that remembers the squares
  createGrid(n);

  // Use the data to draw the canvas
  drawCanvas();
}

const createGrid = (n) => {
  const cellLength = 640 / n; //because canvas is always scaled from 640x640
  for (let yPos = 0; yPos < 640; yPos += cellLength) {
    for (let xPos = 0; xPos < 640; xPos += cellLength) {
      grid[`${xPos},${yPos}`] = createCell(xPos, yPos, cellLength);
    }
  }
}

const createCell = (x=0, y=0, length=0) => {
  return {
    x: x,
    y: y,
    length: length,
    color: colors[Math.floor(Math.random() * colors.length)],
    opacity: 1
  };
}

const drawCanvas = () => {
  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  for (let cell in grid) {
    ctx.fillStyle = grid[cell].color;
    ctx.fillRect(grid[cell].x, grid[cell].y, grid[cell].length, grid[cell].length);
  }
}
