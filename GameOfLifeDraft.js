// Conway's Game Of Life
// Draft Version
// Implemented using arrays

// const readline = require("readline-async");

// initial states 
const BOAT_PATTERN = [[4, 4], [5, 4], [4, 5], [6, 5], [5, 6]];
const BLICKER_PATTERN = [[5, 4], [5, 5], [5, 6]];
const GLIDER_PATTERN = [[4, 4], [6, 4], [5, 5], [6, 5], [5, 6]];

const GRID_SIZE = 10;   // represents the dimension of a square grid

/*
    Conway's Game of Life
    A zero player game that is deterministic in how in it plays, based
    on the initial state of a square grid and the state of a cell and its
    surrounding neighbors.
    Each square (known as a cell) on that grid can be alive or dead,
    represented by the values 1 and 0 respectively.
    There are four rules to this game:
        1. If a dead cell has 2 or 3 live neighboring cells, it will become alive
        2. If a live cell has less than 2 live neighboring cells, it will die
        3. If a live cell has more than 3 live neighboring cells, it will die
        4. If a dead cell has less than 2 live neighboring cells, it will stay dead
*/
class GameOfLife {
    // initializes Conway's Game of Life
    // pre : initialState is an array that contains coordinates of living cells
    //       in the inital state of the game
    // post: runs Game of Life in console as a square grid
    constructor(initalState) {
        this.grid = [];     // multidimensional array that stores all cell information
        this.gridSize = GRID_SIZE;  // a number that represents the length of a square grid
        this.genNum = 0;  // stores the number of generations ran
        this.initalState;   // an array that stores the positions of initial live cells

        if (initalState == null) {
            throw "Invalid Argument - user must input an initial state for the game";
        } else {
            this.initalState = initalState.slice();
        }
        this.build();
    }
    /*
    set setGridSize(newSize) {
        if (typeof(newSize) !== "number") {
            throw "Invalid Argument - grid size must be a number";
        }
        if (newSize <= 0) {
            throw "Invalid Argument - grid size must be greater than 0";
        }
        this.gridSize = newSize;
    }

    get gridSize() {
        return this.gridSize;
    }
    
    set setGenNum(newNum) {
        if (typeof(newNum) !== "number" || newNum < 0) {
            throw "Invalid Argument - generation number must be a positive number";
        }
        this.genNum = newNum;
    }

    get genNum() {
        return this.genNum;
    }
    */

    // post: starts game
    start() {
        while (true) {
            this.update();
            this.toString();
        } 
    }

    // post: initializes values in grid
    build() {
        let initStateIndex = 0;
        for (let x = 0; x < this.gridSize; x++) {
            this.grid.push([]);
            for (let y = 0; y < this.gridSize; y++) {
                if (x === this.intialState[initStateIndex][0] && y === this.initalState[null]) {
                    // let 1 represent living cells
                    this.grid[i].push(1);
                    initStateIndex++;
                } else {
                    // let 0 represent dead cells
                    this.grid[x].push(0);
                }
            }
        }
    }
    // can be optimized instead of going through every element
    // post: updates the grid to the next generation
    update() {
        for (let x = 0; x < this.gridSize; x++) {
            for (let y = 0; y < this.gridSize; y++) {
                if (this.checkNeighbors(x, y)) {
                    this.grid[x][y] = 1;
                } else {
                    this.grid[x][y] = 0;
                }
            }
        }
        this.genNum++;
    }

    // post: resets game to initial state
    reset() {
        this(this.intialState);
    }

    // pre : x and y are positions
    // post: sets cell at that position to 1 
    addLiveCell(x, y) {
        if (this.validateCoordinate(x, y)) {
            this.grid[x][y] = 1;
        } else {
            throw "Error - Cannot add live cell";
        }
    }
    
    // pre : x and y are position
    // post: sets cell at that position to 0
    addDeadCell(x, y) {
        if (this.validateCoordinate(x, y)) {
            this.grid[x][y] = 0;
        } else {
            throw "Error - Cannot add dead cell";
        }
    }

    // pre : checks the cells surrounding the specified position
    //       (horizontally, vertically, and diagonally)
    // post: returns a boolean; true if cell will survive, false if cell will die
    checkNeighbors(x, y) {
        let liveCellCount = 0;
        // checking left
        for (let deltaX = -1; deltaX <= 1; deltaX++) {
            for (let deltaY = -1; deltaY <= 1; deltaY++) {
                // for cells that are on the edge of grid, 
                // they are missing neighboring cells
                if (this.grid[x + deltaX] === 'undefined' || 
                        this.grid[x + deltaX][y + deltaY] === 'undefined') {
                    continue;
                }
                if (this.grid[x + deltaX][y + deltaY] === 1) {
                    liveCellCount++;
                }
                // skipping position x, y since it is not neighboring cell
                if (deltaX === 0 && deltaY === 0) {
                    deltaY++;
                }
            }
        }
        if (this.grid[x, y] === 1) {
            if (liveCellCount >= 2 && liveCellCount < 4) {
                return true;
            }
            return false;
        } else {    // when cell at position x, y is dead
            if (liveCellCount === 3) {
                return true;
            } else {
                return false;
            }
        }
    }

    // pre : checks position if it is valid position on grid
    // post: returns a boolean; true if position is valid, false otherwise
    validateCoordinate(x, y) {
        return (x >= 0 && x <= this.gridSize) && (y >= 0 && y <= this.gridSize);
    }

    // post: returns the string representation of the game
    toString() {
        // adding top border
        let result = "+";
        for (let i = 0; i < this.gridSize * 3; i++) {
            result += "-";
        }
        result += "+\n";

        // adding actual cells
        for (let i = 0; i < this.gridSize; i++) {
            result += "| ";
            for (let j = 0; j < this.gridSize - 1; j++) {
                result += this.grid[i][j] + "  ";
            }
            result += this.grid[i][this.gridSize - 1] + " |\n";
        }
        
        // adding bottom border
        result += "+";
        for (let i = 0; i < this.gridSize * 3; i++) {
            result += "-";
        }
        return result + "+\n";
    }

    // post: returns the string representation of the game
    toStringASCII() {
        // adding top border
        let result = "+";
        for (let i = 0; i < this.gridSize * 3; i++) {
            result += "-";
        }
        result += "+\n";

        // adding actual cells
        result += this.cells.reduce((result, cell) => {
            // left most cell
            if (cell.y === 0) {
                result += "| " + cell.toString() + "  ";
            // right most cell
            } else if (cell.y === this.gridSize - 1) {
                result += cell.toString() + " |\n";
            // middle cells
            } else {
                result += cell.toString() + "  ";
            }
            return result;
        }, "");     // need to set default value to empty string, otherwise function will use 0

        // adding bottom border
        result += "+";
        for (let i = 0; i < this.gridSize * 3; i++) {
            result += "-";
        }
        return result + "+\n";
    }
}

// another approach to the Game of Life is to create a cell object
// that stores cell position and state
// that way you can put all of these cell objects into an array and 
// utilize filter() and map() methods for searching and sorting

const game = new GameOfLife();
console.log(game.toString());
console.log(game.start());