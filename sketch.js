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

const state = { // object to track all information about the canvas that needs to persist: the grid itself, including all cell locations & colors; the library of colors used for the cell fill, and the current target cell of the mouse
  colors: ['#9400D3', '#4B0082', '#0000FF', '#00FF00', '#FFFF00', '#FF7F00', '#FF0000'],
  grid: {},
  cellLength: 0,
  target: ''
}

const createCanvas = (n = 16) => { // function to draw canvas. Takes param for number of rows/columns
  const canvas = document.querySelector('canvas');
  if (canvas.getContext) { // if browser supports canvas, define context for drawing
    const ctx = canvas.getContext('2d');
  } else { // if browser doesn't support canvas, no need to draw. So get out of here!
    return;
  }

  // Size and center the canvas
  canvas.classList.add('canvas');
  const mainDiv = document.querySelector('main');
    const viewWidth = mainDiv.scrollWidth;
    const viewHeight = mainDiv.scrollHeight;
  const canvasViewLength = Math.min(viewWidth, viewHeight) - 40;
    canvas.width = canvasViewLength;
    canvas.height = canvasViewLength;
    canvas.style.marginLeft = `${(viewWidth - canvasViewLength) / 2}px`;
    canvas.style.marginTop = `${(viewHeight - canvasViewLength) / 2}px`;

  // Create the data that remembers the squares
  createGrid(n);

  // Use the data to draw the canvas
  drawGrid();

  // Now listen for mouse movement!
  canvas.addEventListener('mousemove', getTargetCell);
}

const createGrid = (n) => {
  const canvas = document.querySelector('canvas');
  const canvasLength = canvas.width;
  const cellLength =  canvasLength / n; //because canvas is always scaled from 640x640
  state.cellLength = cellLength; //store for future use when targeting cells
  for (let yPos = 0; yPos < canvasLength; yPos += cellLength) {
    for (let xPos = 0; xPos < canvasLength; xPos += cellLength) {
      state.grid[`${xPos},${yPos}`] = createCell(xPos, yPos, cellLength);
    }
  }
}

const createCell = (x=0, y=0, length=0) => {
  return {
    x: x,
    y: y,
    length: length,
    color: state.colors[Math.floor(Math.random() * state.colors.length)],
    opacity: 1
  };
}

const drawGrid = () => {
  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  for (let cell in state.grid) {
    ctx.fillStyle = state.grid[cell].color;
    ctx.fillRect(state.grid[cell].x, state.grid[cell].y, state.grid[cell].length, state.grid[cell].length);
  }
}

const getMousePosition = (event) => {
  const canvas = document.querySelector('canvas');
  const canvasArea = canvas.getBoundingClientRect();
  return {
    x: event.clientX - canvasArea.left,
    y: event.clientY - canvasArea.top
  };
}

const getTargetCell = (event) => {
  const currentTarget = state.target;
  const mousePosition = getMousePosition(event);
  const mouseTargetX = mousePosition.x - (mousePosition.x % state.cellLength);
  const mouseTargetY = mousePosition.y - (mousePosition.y % state.cellLength);
  const mouseTarget = `${mouseTargetX},${mouseTargetY}`;
  if (mouseTarget !== currentTarget) {
    state.target = mouseTarget;
    console.log(state.target);
    console.log(state.grid[state.target]);
  }
}