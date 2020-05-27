//number of columns and rows of the grid
const columns = 45;
const rows = 30;

//width and height of each square of the grid;
const squareW = 15;
const squareH = 15;

//position of the grid from (0, 0) of the canvas
const gridX = 0;
const gridY = 100;

//width and height of the canvas
const canvasW = squareW * columns + gridX;
const canvasH = squareH * rows + gridY;

//Initializing the grid
let grid = new Grid(columns, rows, squareW, squareH, gridX, gridY); 
grid.initMaze();

//boolean for dialog box initializing
let isDialogBox = true;

//buttons
let stepByStep;
let resumeSearch;
let clearSearch;
let resetMaze;
let genRanMaze;
let wallBuilder;
let diagonale;
let start;
let goal;

//sliders
let heuristicSlider;

//variables for event handlers
let isLooping = false;
let isWallBuilder = false;
let isCreatingStart = false;

//functions for event handlers 
function mouseDragged() {
    if (mouseX > 0 && mouseX < canvasW && mouseY > 0 && mouseY < canvasH && isWallBuilder) {
        for (let i = 1; i < columns - 1; i++) {
            for (let j = 1; j < rows - 1; j++) {
                grid.thisGrid[i][j].mouseDraggingSquare(mouseX, mouseY, grid);
            }
        }
    }
}

function mouseMoved() {
    if (mouseX > 0 && mouseX < canvasW && mouseY > 0 && mouseY < canvasH) {
        if (isWallBuilder) {
            for (let i = 1; i < columns - 1; i++) {
                for (let j = 1; j < rows - 1; j++) {
                    grid.thisGrid[i][j].mouseMovingSquare(mouseX, mouseY, 100, grid);
                }
            }
        }
        /* else if (isCreatingStart) {
            for (let i = 1; i < columns - 1; i++) {
                for (let j = 1; j < rows - 1; j++) {
                    grid.thisGrid[i][j].mouseMovingSquare(mouseX, mouseY, color(0, 255, 0), grid);
                }
            }
        }
        else if (isCreatingGoal) {

        } */
    }
}

//For the start button
/* function mousePressed() {
    if (mouseX > 0 && mouseX < canvasW && mouseY > 0 && mouseY < canvasH) {
        if (isCreatingStart) {
            for (let i = 1; i < columns - 1; i++) {
                for (let j = 1; j < rows - 1; j++) {
                    startS = grid.thisGrid[i][j].mousePressingSquare(mouseX, mouseY, color(0, 255, 0), grid);
                    openList.push(startS);
                    isCreatingStart = false;
                }
            }
        }
    }
} */

function resetMouseState() {
    isWallBuilder = false;
}

//color functions
function redGradient(coeff) {
    return color(255, 240 * (1 - coeff / (columns + rows)), 240 * (1 - coeff / (columns + rows)));
}
function greenGradient(coeff) {
    return color(240 * (1 - coeff / (columns + rows)), 255, 240 * (1 - coeff / (columns + rows)));
}
function blueGradient(coeff) {
    return color(240 * (1 - coeff / (columns + rows)), 240 * (1 - coeff / (columns + rows)), 255);
}

//initialising A*
let openList = [];
let closeList = [];

let startS;
let goalS;
let current;

startS = grid.thisGrid[1][1];
goalS = grid.thisGrid[columns-2][rows-2];


startS.g = 0;
startS.h = heuristic(startS, goalS, 1);

current = startS;
openList.push(current);

//heuristics
function heuristic(current, goal, which) {
    //manhattan
    if (which == 0) {
        return Math.abs(current.x - goal.x) + Math.abs(current.y - goal.y);
    }
    //euclidian
    else if (which == 1) {
        return Math.sqrt(
        (current.x - goal.x)*(current.x - goal.x) 
        + (current.y - goal.y)*(current.y - goal.y));
    }
    
}

//reconstruction of the best path found
function reconstructPath() {
    let bestPath = [current];
    while (current.cameFrom != null) {
        current = current.cameFrom;
        bestPath.push(current)
    }
    for (let i=0, len = bestPath.length; i<len; i++) {
        bestPath[i].squareColor = blueGradient(bestPath[i].g);
    }
}


//setup
function setup() {
    //Dialog box
    alert("Hello and welcome to the A* pathfinding visualizer!"
    + "\nThe starting square is at the top left corner of the grid, and the goal square is at the botton right corner of the grid.");
    alert("Click on 'Wall builder' to build some walls and 'Resume search' to start searching."
    + "\nEnjoy!");
    
    isDialogBox = false;
    //canvas
    let cnv = createCanvas(canvasW, canvasH);
    cnv.position(350, 150);

    //buttons
    stepByStep = createButton('Step by step');
    //stepByStep.size(25, 25);
    stepByStep.position(350, 100);
    stepByStep.mousePressed((e) => {
        resetMouseState();
        isLooping = false;
        loop();
    });

    resumeSearch = createButton('Resume search');
    resumeSearch.size(200, 50);
    resumeSearch.position(450, 100);
    resumeSearch.mousePressed((e) => {
        resetMouseState();
        isLooping = true;
        loop();
    });

    clearSearch = createButton('Clear search');
    clearSearch.position(0, 0);
    clearSearch.mousePressed((e) => {
        resetMouseState();
        grid.clearSearch(openList, closeList);
        startS.g = 0;
        startS.squareColor = greenGradient(startS.g);
        openList = [startS];
        isLooping = false;
        grid.showGrid();
    });

    resetMaze = createButton('Reset grid');
    resetMaze.position(0, 25);
    resetMaze.mousePressed((e) => {
        resetMouseState();
        grid.resetMaze(openList, closeList);
        startS.g = 0;
        startS.squareColor = greenGradient(startS.g);
        openList = [startS];
        isLooping = false;
        grid.showGrid();
    });

    genRanMaze = createButton('Generate random maze');
    genRanMaze.position(0, 50);
    genRanMaze.mousePressed((e) => {
        resetMouseState();
        grid.genRanMaze(openList, closeList);
        startS.isPath = true;
        startS.g = 0;
        startS.squareColor = greenGradient(startS.g);
        openList = [startS];
        goalS.isPath = true;
        isLooping = false;
        grid.showGrid(255);
    });

    wallBuilder = createButton('Wall builder');
    wallBuilder.position(0, 75);
    wallBuilder.mousePressed((e) => {
        resetMouseState();
        isWallBuilder = true;
    });

    //For the start button
    /* start = createButton('Start');
    start.position(0, 100);
    start.mousePressed(() => {
        resetMouseState();
        startS.squareColor = 255;
        openList.length = 0;
        isCreatingStart = true;
    }) */

    //sliders
    heuristicSlider = createSlider(0, 3, 1, 0);
    heuristicSlider.position(350, 175);
}


//draw
function draw() {  
    isLooping ? loop() : noLoop();
    background(255);
    textSize(20);
    fill(0);
    text("heuristic coefficient : f = g + " + heuristicSlider.value().toFixed(2) + " * h", 150, 40);

    grid.showGrid();

    //A* algorithm
    let tentativeG;

    if (openList.length > 0) {
        let iBest = 0;
        for (let i=0, len = openList.length; i<len; i++) {
            if (openList[i].fValue(heuristicSlider.value()) < openList[iBest].fValue(heuristicSlider.value())) {
                iBest = i;
            }
        }
        
        current = openList[iBest];
        current.squareColor = redGradient(current.g);
        closeList.push(current);
        openList.splice(iBest, 1);

        if (current === goalS) {
            reconstructPath();
            console.log("DONE");
            grid.showGrid();
            noLoop();
        }
        
        for (let i=0; i<current.adj.length; i++) {
            tentativeG = current.g + heuristic(current, current.adj[i], 1);
            if (current.adj[i].isPath && tentativeG < current.adj[i].g) {
                current.adj[i].g = tentativeG;
                current.adj[i].h = heuristic(current.adj[i], goalS, 1);
                current.adj[i].cameFrom = current;
                current.adj[i].squareColor = greenGradient(tentativeG);
                openList.push(current.adj[i]);
            }
        }
    }
    else {
        noLoop();
    }
}