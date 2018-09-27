'use strict';

const main = document.querySelector('.main');
const canvas = document.createElement('canvas');
  canvas.width = '100%';
  canvas.height = '100%';
  canvas.backgroundColor = 'red';

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

main.appendChild(canvas);
