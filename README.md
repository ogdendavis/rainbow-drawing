This is an "etch-a-sketch" app for [The Odin Project](https://www.theodinproject.com/).

It's written in vanilla JavaScript, with a basic HTML5 index page, and styling in CSS3. Most DOM elements are created and modified with JavaScript, as the index page is basically a simple structure to receive what the JavaScript creates.

The app is displayed using the HTML canvas element. This presented a challenge in that resizing the grid for different screen sizes and different numbers of cells per row was difficult -- the math didn't play nice with canvas when decimals were involved. I solved this issue by drawing the canvas at a standard size of 40 pixels square per cell, and then scaling the canvas to fit the screen.

There's a media query in the CSS that resizes the canvas for mobile devices, and a touch handler so the app can be used with touch devices as well as mouse devices, but it's still not a fully mobile-friendly app -- on iPhone, the canvas zooms in weirdly after the user resizes it. I am not taking the time to fix this issue, simply because I've spent plenty of time on this project, it already exceeds the requirements of the assignment, and I need to move on! Maybe I'll come back at a later date and fix the zoom issue so that the app is fully mobile-friendly.
