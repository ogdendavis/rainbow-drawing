'use strict';

window.onload = () => {
  const main = document.querySelector('.main');
  const canvas = document.createElement('canvas');

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

const state = { // object to track all information that needs to persist
  startingOpacity: 0,
  opacityBump: 0.25,
  colors: ['#9400D3', '#4B0082', '#0000FF', '#00FF00', '#FFFF00', '#FF7F00', '#FF0000'],
  grid: {},
  gridSize: 16,
  cellLength: 40, //Does not change!
  target: ''
}

const createCanvas = (n = state.gridSize) => {
  const canvas = document.querySelector('canvas');
  if (!canvas.getContext) {
    return
  }

  /*
  Sizing canvas here for coordinate purposes only. I originally tried to size it
  relative to the viewport and then draw, but JavaScript doesn't play nice with
  decimals, so it kept on breaking. Solution is to draw the canvas at 40 pixels
  per cell (enough that corners appear sharp), and then determine the actual
  display size with CSS. Note that this means I have to account for scaling when
  finding the correct cell to change from the user's mouse/touch position.
  */
  canvas.width = n * 40;
  canvas.height = n * 40;

  canvas.classList.add('canvas');

  createGrid(n);
  drawGrid();

  canvas.addEventListener('mousemove', getTargetCell);
  canvas.addEventListener('touchmove', getTargetCell);
}

const createGrid = (n) => {
  const canvas = document.querySelector('canvas');
  const cellLength = state.cellLength;
  const canvasLength = n * cellLength;
  for (let yPos = 0; yPos < canvasLength; yPos += cellLength) {
    for (let xPos = 0; xPos < canvasLength; xPos += cellLength) {
      state.grid[`${xPos},${yPos}`] = createCell(xPos, yPos);
    }
  }
}

const createCell = (x=0, y=0) => {
  return {
    x: x,
    y: y,
    color: state.colors[Math.floor(Math.random() * state.colors.length)],
    opacity: state.startingOpacity
  };
}

const drawGrid = () => {
  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const cellLength = state.cellLength;
  ctx.beginPath();
  ctx.globalAlpha = state.startingOpacity;
  for (let cell in state.grid) {
    ctx.fillStyle = state.grid[cell].color;
    ctx.fillRect(state.grid[cell].x, state.grid[cell].y, cellLength, cellLength);
  }
}

/* ********** For mouse tracking and re-drawing ********** */

const getMousePosition = (event) => { // Also handles touches
  const canvas = document.querySelector('canvas');
  const canvasArea = canvas.getBoundingClientRect();
  const scale = canvas.width / canvasArea.width;
  let positionX, positionY;
  if (event.changedTouches) {
    positionX = event.changedTouches[0].clientX;
    positionY = event.changedTouches[0].clientY;
  }
  else {
    positionX = event.clientX;
    positionY = event.clientY;
  }
  return {
    x: (positionX - canvasArea.left) * scale,
    y: (positionY - canvasArea.top) * scale
  };
}

const getTargetCell = (event) => {
  const currentTarget = state.target;
  const mousePosition = getMousePosition(event);
  let mouseTargetX = mousePosition.x - (mousePosition.x % state.cellLength);
  let mouseTargetY = mousePosition.y - (mousePosition.y % state.cellLength);
  let mouseTarget = `${mouseTargetX},${mouseTargetY}`;
  if (mouseTarget !== currentTarget) {
    setNewTargetCell(mouseTarget);
    reDrawCell(mouseTarget);
  }
}

const setNewTargetCell = (cell) => {
  state.target = cell;
  const targetCell = state.grid[cell];
  if (targetCell.opacity < 1) {
    targetCell.opacity = targetCell.opacity + state.opacityBump;
  }
}

const reDrawCell = (cell) => {
  const ctx = document.querySelector('canvas').getContext('2d');
  const targetCell = state.grid[cell];
  const cellLength = state.cellLength;

  ctx.clearRect(targetCell.x, targetCell.y, cellLength, cellLength);
  ctx.fillStyle = targetCell.color;
  ctx.globalAlpha = targetCell.opacity;
  ctx.fillRect(targetCell.x, targetCell.y, cellLength, cellLength);
}

/* **********  Now for Settings! ********** */

const toggleSettingsModal = (event) => {
  const settingsModal = document.querySelector('.settings-modal');
  if (settingsModal) {
    // REMOVE EVENT LISTENERS FROM ALL SETTINGS MODAL ELEMENTS HERE
    const clearGridButton = document.getElementById('clearGridButton');
      clearGridButton.removeEventListener('click', clearGrid);
    const newSizeButton = document.getElementById('newSizeButton');
      newSizeButton.removeEventListener('click', changeGridSize);
    const colorChangeButton = document.getElementById('colorChangeButton');
      colorChangeButton.removeEventListener('click', changeColors);
    settingsModal.removeEventListener('click', shouldSettingsModalToggle);
    settingsModal.remove();
  } else {
    createSettingsModal();
  }
}

const shouldSettingsModalToggle = (event) => {
  if (event.target.classList.contains('settings-modal')) {
    toggleSettingsModal();
  }
}

const createSettingsModal = () => {
  const clearGridDiv = document.createElement('div');
    const clearGridButton = document.createElement('button');
      clearGridButton.textContent = 'Clear All';
      clearGridButton.id = 'clearGridButton';
      clearGridButton.addEventListener('click', clearGrid);
    clearGridDiv.appendChild(clearGridButton);

  const sizeChangeDiv = document.createElement('div');
    const sizeChangeFieldset = document.createElement('fieldset');
      const sizeChangeLegend = document.createElement('legend');
        sizeChangeLegend.textContent = 'Change Grid Size:';
      const enterNewSize = document.createElement('input');
        enterNewSize.type = 'number';
        enterNewSize.min = 2;
        enterNewSize.max = 128;
        enterNewSize.value = state.gridSize;
      const newSizeButton = document.createElement('button');
        newSizeButton.textContent = 'Confirm';
        newSizeButton.id = 'newSizeButton';
        newSizeButton.addEventListener('click', changeGridSize);
      sizeChangeFieldset.appendChild(sizeChangeLegend);
      sizeChangeFieldset.appendChild(enterNewSize);
      sizeChangeFieldset.appendChild(newSizeButton);
    sizeChangeDiv.appendChild(sizeChangeFieldset);

  const colorChangeDiv = document.createElement('div');
    colorChangeDiv.classList.add('colorChangeDiv');
    const colorChangeFieldset = document.createElement('fieldset');
      const colorChangeLegend = document.createElement('legend');
        colorChangeLegend.textContent = 'Change Colors'
      colorChangeFieldset.classList.add('colorChangeFieldset');
      const rainbowDiv = document.createElement('div');
        rainbowDiv.classList.add('colorChangeFieldset__container');
        const rainbowButton = document.createElement('input');
          rainbowButton.type = 'radio';
          rainbowButton.id = 'rainbowButton';
          rainbowButton.value = 'rainbow';
          rainbowButton.name = 'colorSelector';
        const rainbowLabel = document.createElement('label');
          rainbowLabel.for = 'rainbowButton';
          rainbowLabel.textContent = 'Rainbow';
        rainbowDiv.appendChild(rainbowButton);
        rainbowDiv.appendChild(rainbowLabel);
      const grayScaleDiv = document.createElement('div');
        grayScaleDiv.classList.add('colorChangeFieldset__container');
        const grayScaleButton = document.createElement('input');
          grayScaleButton.type = 'radio';
          grayScaleButton.id = 'grayScaleButton';
          grayScaleButton.value = 'grayScale';
          grayScaleButton.name = 'colorSelector';
        const grayScaleLabel = document.createElement('label');
          grayScaleLabel.for = 'grayScaleButton';
          grayScaleLabel.textContent = 'Grayscale';
        grayScaleDiv.appendChild(grayScaleButton);
        grayScaleDiv.appendChild(grayScaleLabel);
      const beachDiv = document.createElement('div');
        beachDiv.classList.add('colorChangeFieldset__container');
        const beachButton = document.createElement('input');
          beachButton.type = 'radio';
          beachButton.id = 'beachButton';
          beachButton.value = 'beach';
          beachButton.name = 'colorSelector';
        const beachLabel = document.createElement('label');
          beachLabel.for = 'beachButton';
          beachLabel.textContent = 'Beach';
        beachDiv.appendChild(beachButton);
        beachDiv.appendChild(beachLabel);
      const neonDiv = document.createElement('div');
        neonDiv.classList.add('colorChangeFieldset__container');
        const neonButton = document.createElement('input');
          neonButton.type = 'radio';
          neonButton.id = 'neonButton';
          neonButton.value = 'neon';
          neonButton.name = 'colorSelector';
        const neonLabel = document.createElement('label');
          neonLabel.for = 'neonButton';
          neonLabel.textContent = 'Neon';
        neonDiv.appendChild(neonButton);
        neonDiv.appendChild(neonLabel);
      const silverAndBlueDiv = document.createElement('div');
        silverAndBlueDiv.classList.add('colorChangeFieldset__container');
        const silverAndBlueButton = document.createElement('input');
          silverAndBlueButton.type = 'radio';
          silverAndBlueButton.id = 'silverAndBlueButton';
          silverAndBlueButton.value = 'silverAndBlue';
          silverAndBlueButton.name = 'colorSelector';
        const silverAndBlueLabel = document.createElement('label');
          silverAndBlueLabel.for = 'silverAndBlueButton';
          silverAndBlueLabel.textContent = 'Silver & Blue';
        silverAndBlueDiv.appendChild(silverAndBlueButton);
        silverAndBlueDiv.appendChild(silverAndBlueLabel);
      const colorChangeButton = document.createElement('button');
        colorChangeButton.textContent = 'Confirm';
        colorChangeButton.id = 'colorChangeButton';
        colorChangeButton.addEventListener('click', changeColors);
      colorChangeFieldset.appendChild(colorChangeLegend);
      colorChangeFieldset.appendChild(rainbowDiv);
      colorChangeFieldset.appendChild(grayScaleDiv);
      colorChangeFieldset.appendChild(beachDiv);
      colorChangeFieldset.appendChild(neonDiv);
      colorChangeFieldset.appendChild(silverAndBlueDiv);
      colorChangeFieldset.appendChild(colorChangeButton);
    colorChangeDiv.appendChild(colorChangeFieldset);

  const firstActiveColor = state.colors[0];
  let activeColorsetId = '';
  switch (firstActiveColor) {
    case '#9400D3':
      activeColorsetId = 'rainbowButton';
      break;
    case '#222':
      activeColorsetId = 'grayScaleButton';
      break;
    case '#EAE7AF':
      activeColorsetId = 'beachButton';
      break;
    case '#FF0099':
      activeColorsetId = 'neonButton';
      break;
    case '#003594':
      activeColorsetId = 'silverAndBlueButton';
      break;
  }
  window.setTimeout(() => {
    const activeColorsetButton = document.getElementById(activeColorsetId);
    activeColorsetButton.checked = true;
  }, 10);


  const settingsContainer = document.createElement('div');
    settingsContainer.classList.add('settings-container');
    settingsContainer.appendChild(colorChangeDiv);
    settingsContainer.appendChild(sizeChangeDiv);
    settingsContainer.appendChild(clearGridDiv);

  const settingsModal = document.createElement('div');
    settingsModal.classList.add('settings-modal');
    settingsModal.appendChild(settingsContainer);
    settingsModal.addEventListener('click', shouldSettingsModalToggle);

  const header = document.querySelector('header');
    header.appendChild(settingsModal);
}

const clearGrid = (event) => {
  drawNewGrid(state.gridSize);
  toggleSettingsModal();
}

const changeGridSize = (event) => {
  const newSize = document.querySelector('input[type="number"]').value;
  drawNewGrid(newSize);
  toggleSettingsModal();
}

const drawNewGrid = (newSize) => {
  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = newSize * state.cellLength;
  canvas.height = newSize * state.cellLength;

  state.target = '';
  state.grid = {};
  state.gridSize = newSize;

  createGrid(newSize);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
}

const changeColors = (event) => {
  const colorOptions = {
    rainbow: ['#9400D3', '#4B0082', '#0000FF', '#00FF00', '#FFFF00', '#FF7F00', '#FF0000'],
    grayScale: ['#222'],
    beach: ['#EAE7AF', '#FBC88A', '#40CAEE', '#40CAEE', '#FF7ABC'],
    neon: ['#FF0099', '#F3F315', '#83F52C', '#FF6600', '#6E0DD0'],
    silverAndBlue: ['#003594', '#003594', '#041E42', '#869397', '#7F9695']
  }

  const colorChangeFieldsetElements = document.querySelector('.colorChangeFieldset').elements;
  let newColors;
  for (let element in colorChangeFieldsetElements) {
    if (colorChangeFieldsetElements[element].checked === true) {
      newColors = colorChangeFieldsetElements[element].value;
    }
  }

  state.colors = colorOptions[newColors];
  drawNewGrid(state.gridSize);
  toggleSettingsModal();
}
