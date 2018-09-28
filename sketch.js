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

  createCanvas();

  const settingsIcon = document.querySelector('.settings-icon');
  settingsIcon.addEventListener('click', toggleSettingsModal);
}

/* ********** 'Game' state, logic, and display ********** */

const state = { // object to track all information about the canvas that needs to persist
  startingOpacity: 0,
  opacityBump: 0.5,
  colors: ['#9400D3', '#4B0082', '#0000FF', '#00FF00', '#FFFF00', '#FF7F00', '#FF0000'],
  grid: {},
  gridSize: 16,
  cellLength: 0,
  target: ''
}

const createCanvas = (n = state.gridSize) => { // function to draw canvas. Takes param for number of rows/columns
  const canvas = document.querySelector('canvas');
  if (canvas.getContext) { // if browser supports canvas, define context for drawing
    const ctx = canvas.getContext('2d');
  } else { // if browser doesn't support canvas, no need to draw. So get out of here!
    return;
  }

  // Size and center the canvas
  const viewWidth = window.innerWidth || document.documentElement.clientWidth;
  const viewHeight = window.innerHeight || document.documentElement.clientHeight;
  const canvasViewLength = Math.min(viewWidth, viewHeight) - 40;
  canvas.width = canvasViewLength;
  canvas.height = canvasViewLength;
  canvas.style.marginLeft = `${(viewWidth - canvasViewLength) / 2}px`;
  canvas.style.marginTop = `${(viewHeight - canvasViewLength) / 2}px`;

  // Add css class for styling
  canvas.classList.add('canvas');

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
    opacity: state.startingOpacity
  };
}

const drawGrid = () => {
  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  for (let cell in state.grid) {
    ctx.fillStyle = state.grid[cell].color;
    ctx.globalAlpha = state.grid[cell].opacity;
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
    setNewTargetCell(mouseTarget);
    reDrawCell(mouseTarget);
  }
}

const setNewTargetCell = (cell) => {
  // Update target flag in state
  state.target = cell;
  // Now update actual entry for target cell in grid object in state
  const targetCell = state.grid[cell];
  if (targetCell.opacity < 1) {
    targetCell.opacity = targetCell.opacity + state.opacityBump;
  } else if (targetCell.opacity === 1) {
    targetCell.color = state.colors[Math.floor(Math.random() * state.colors.length)];
    targetCell.opacity = state.startingOpacity;
  }
}

const reDrawCell = (cell) => {
  // Use updated grid object to redraw target cell
  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const targetCell = state.grid[cell];

  ctx.clearRect(targetCell.x, targetCell.y, targetCell.length, targetCell.length);
  ctx.fillStyle = targetCell.color;
  ctx.globalAlpha = targetCell.opacity;
  ctx.fillRect(targetCell.x, targetCell.y, targetCell.length, targetCell.length);
}

/* **********  Now for Settings! ********** */

const toggleSettingsModal = (event) => {
  console.log('toggle fired');
  const settingsModal = document.querySelector('.settings-modal');
  if (settingsModal) {
    // if the modal exists
    // REMOVE EVENT LISTENERS FROM ALL SETTINGS MODAL ELEMENTS HERE

    settingsModal.remove();
  } else {
    // if it doesn't exist, draw it!
    createSettingsModal();
  }
}

const createSettingsModal = () => {
  const settingsModal = document.createElement('div');
  settingsModal.classList.add('settings-modal');

  // Form Container
  const settingsContainer = document.createElement('form');
    settingsContainer.classList.add('settings-form');

  // Clear Grid
  const clearGridDiv = document.createElement('div');
  const clearGridButton = document.createElement('button');
    clearGridButton.textContent = 'Clear All';
    clearGridButton.addEventListener('click', clearGrid);
  clearGridDiv.appendChild(clearGridButton);


  /*
  // Change Size
  const sizeChangeDiv = document.createElement('div');
  const enterNewSize = document.createElement('input');
    enterNewSize.type = 'number';
    enterNewSize.min = 2;
    enterNewSize.max = 128;
  const submitNewSize = document.createElement('button');
    submitNewSize.textContent = 'Confirm';
  */

  settingsContainer.appendChild(clearGridDiv);

  settingsModal.appendChild(settingsContainer);

  const header = document.querySelector('header');
  header.appendChild(settingsModal);
}

const clearGrid = () => {
  // Set variables for canvas
  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');

  // Reset state -- don't redraw whole grid, since size didn't change -- just re-randomize colors and reset opacity
  state.active = '';
  console.log(state.grid);
  for (let cell in state.grid) {
    state.grid[cell].opacity = state.startingOpacity;
    state.grid[cell].color = state.colors[Math.floor(Math.random() * state.colors.length)];
  }

  // Clear already drawn rectangles
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
