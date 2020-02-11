// Conway's Game Of Life
// Final Version
// Using object-oriented programming techniques

const GRID_SIZE = 20;   // represents the dimension of a square grid
const GEN_LIMIT = 25;  // represents number of generations that can be run at max

// a cell object represents a cell in Conway's Game of Life
// a cell can be alive or in a dead state
// cell position is based on coordinate system where positive x is to the right
// and positive y is downward
class Cell {
    // pre : xPos and yPos are numbers that are greater than or equal to 0
    //       bool is a boolean
    // post: creates a cell object with x and y representing the position
    //       and isAlive representing the state of the cell (true if living, false if dead)
    constructor(xPos, yPos, bool) {
        if (xPos == null || yPos == null || bool == null) {
            throw "Error - must input all parameters";
        }
        if (xPos < 0 || yPos < 0) {
            throw "Invalid Argument - positions must be positive numbers";
        }
        if (typeof(bool) !== "boolean") {
            throw "Invalid Argument - bool must be a boolean";
        }
        this.x = xPos;
        this.y = yPos;
        this.isAlive = bool;
    }
    
    live() {
        this.isAlive = true;
    }

    die() {
        this.isAlive = false;
    }

    // pre : cellA and cellB are both Cell objects
    // post: returns true if cellA and cellB have the same x and y positions
    //       otherwise returns false
    static hasSamePos(cellA, cellB) {
        if (typeof(cellA) !== "object" || typeof(cellB) !== "object") {
            throw "Invalid Argument - arguments must be Cell objects";
        }
        return (cellA.x === cellB.x) && (cellA.y === cellB.y);
    }

    // post: returns a white square if cell is alive, black square if cell is dead
    toString() {
        if (this.isAlive) {
            return "⬜";
        } else {
            return "⬛";
        }
    }
}

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
    constructor(initialState) {
        this.cells = [];     // a sorted array that stores all cell information
        this.gridSize = GRID_SIZE;  // a number that represents the length of a square grid
        this.genNum = 0;  // stores the number of generations ran
        this.initialState;   // an array that stores the positions of initial live cells

        if (initialState == null) {
            throw "Invalid Argument - user must input an initial state for the game";
        } else {
            this.initialState = initialState.slice();
        }

        this.build();
    }

    // post: starts game, running up to the number of generations specified by GEN_LIMIT
    start() {
        let self = this;
        console.log("Generation #: " + self.genNum);
        console.log(self.toString());
        // updates and prints game
        // on a delay of 0.5 seconds per each generation
        let timer = setInterval(function() {
            if (self.genNum === GEN_LIMIT) {
                clearInterval(timer);
            }
            console.log("Generation #: " + self.genNum);
            self.update();
            console.log(self.toString());
        }, 500);
    }

    // post: initializes values in grid
    build() {
        for (let x = 0; x < this.gridSize; x++) {
            for (let y = 0; y < this.gridSize; y++) {
                let newCell = new Cell(x, y, false);
                // setting cells to live state depending if those cells were 
                // in intial state array
                // NOTE: skips cells in intial state that are beyond bounds of grid
                if (this.initialState
                    .filter((cell) => Cell.hasSamePos(cell, newCell))
                    .length !== 0) {
                    newCell.live();
                }
                this.cells.push(newCell);
            }
        }
    }

    // NOTE: can be optimized to avoid going through every element
    // post: updates the grid to the next generation and increments generation count
    update() {
        let lastUpdatedCells = [];  // an array that stores cells that will be updated

        // need to check first then update cells
        // not check cell, update, check next cell, update, etc.
        // change in cell state should caused by state of grid at that generation
        for (let cell of this.cells) {
            if (this.checkNeighbors(cell.x, cell.y)) {
                // if current cell is dead but will be alive in next generation
                if (!cell.isAlive) {
                    lastUpdatedCells.push(cell);    
                }
            } else {
                // if current cell is alive but will be dead in next generation
                if (cell.isAlive) {
                    lastUpdatedCells.push(cell);
                }
            }
        }

        for (let cell of lastUpdatedCells) {
            // flipping the states of cells that have been updated
            if (cell.isAlive) {
                cell.die();
            } else {
                cell.live();
            }
        }
        this.genNum++;
    }

    /*
    // post: resets game to initial state
    reset() {
        this(this.initialState);
    }
    */

    // pre : checks the cells surrounding the specified position
    //       (horizontally, vertically, and diagonally)
    // post: returns a boolean; true if cell will survive, false if cell will die
    checkNeighbors(x, y) {
        let indexOfCell = this.findIndexOfCell(x, y);
        let indexOfNeighbor;
        let liveCellCount = 0;

        // checking from left to right, up to down
        for (let deltaX = -1; deltaX <= 1; deltaX++) {
            for (let deltaY = -1; deltaY <= 1; deltaY++) {
                indexOfNeighbor = this.findIndexOfCell(x + deltaX, y + deltaY);
                // skipping position x, y since it is not neighboring cell
                // also skipping out of bound cells
                if ((deltaX === 0 && deltaY === 0) || indexOfNeighbor === -1) {
                    continue;
                }
                if (this.cells[indexOfNeighbor].isAlive) {
                    liveCellCount++;
                }
            }
        }

        // don't forget boolean zen
        if (this.cells[indexOfCell].isAlive) {
            return liveCellCount >= 2 && liveCellCount < 4;
        } else {    // when cell at position x, y is dead
            return liveCellCount === 3;
        }
    }

    /*
    // post: sorting elements in cells array based on position, in ascending order
    sortCells() {
        this.cells.sort((cellA, cellB) => { 
            if (cellA.x === cellB.x) {
                return cellA.y - cellB.y; 
            } else { 
                return cellA.x - cellB.x;
            }
        })
    }
    */
    
    // pre : checks position if it is valid position on grid
    // post: returns a boolean; true if position is valid, false otherwise
    validateCoordinate(x, y) {
        return (x >= 0 && x < this.gridSize) && (y >= 0 && y < this.gridSize);
    }

    // pre : x and y are positions
    // post: returns the index of the Cell with those positions;
    // returns -1 if Cell not found
    findIndexOfCell(x, y) {
        // out of bound coordinates
        if (!this.validateCoordinate(x, y)) {
            return -1;
        }
        return (x * this.gridSize) + y;
    }

    // post: returns the string representation of the game
    toString() {
        // need to set default value to empty string, 
        // otherwise function will use 0
        return this.cells.reduce((result, cell) => {
            if (cell.y === this.gridSize - 1) {
                result += cell.toString() + "\n";
            // left most cell and middle cells
            } else {
                result += cell.toString() + " ";
            }
            return result;
        }, "") + "\n";
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////
// initial game states 
const BOAT_PATTERN = [new Cell(3, 3, true), new Cell(4, 3, true), 
    new Cell(3, 4, true), new Cell(5, 4, true), new Cell(4, 5, true)];

const BLICKER_PATTERN = [new Cell(5, 4, true), new Cell(5, 5, true), new Cell(5, 6, true)];

const GLIDER_PATTERN = [new Cell(4, 4, true), new Cell(6, 4, true), 
      new Cell(5, 5, true), new Cell(6, 5, true), new Cell(5, 6, true)];

const PULSAR_PATTERN = [new Cell(3, 1, true), new Cell(4, 1, true), new Cell(5, 1, true),
                        new Cell(9, 1, true), new Cell(10, 1, true), new Cell(11, 1, true),
                        new Cell(1, 3, true), new Cell(6, 3, true), new Cell(8, 3, true),
                        new Cell(13, 3, true), new Cell(1, 4, true), new Cell(6, 4, true),
                        new Cell(8, 4, true), new Cell(13, 4, true), new Cell(1, 5, true),
                        new Cell(6, 5, true), new Cell(8, 5, true), new Cell(13, 5, true),
                        new Cell(3, 6, true), new Cell(4, 6, true), new Cell(5, 6, true),
                        new Cell(9, 6, true), new Cell(10, 6, true), new Cell(11, 6, true),
                        new Cell(3, 8, true), new Cell(4, 8, true), new Cell(5, 8, true),
                        new Cell(9, 8, true), new Cell(10, 8, true), new Cell(11, 8, true),
                        new Cell(1, 9, true), new Cell(6, 9, true), new Cell(8, 9, true),
                        new Cell(13, 9, true), new Cell(1, 10, true), new Cell(6, 10, true),
                        new Cell(8, 10, true), new Cell(13, 10, true), new Cell(1, 11, true),
                        new Cell(6, 11, true), new Cell(8, 11, true), new Cell(13, 11, true),
                        new Cell(3, 13, true), new Cell(4, 13, true), new Cell(5, 13, true),
                        new Cell(9, 13, true), new Cell(10, 13, true), new Cell(11, 13, true)];

const RANDOM_PATTERN = [new Cell(4, 1, true), new Cell(6, 1, true), new Cell(9, 1, true), 
                        new Cell(3, 3, true), new Cell(3, 9, true), new Cell(2, 6, true),
                        new Cell(9, 2, true), new Cell(3, 5, true), new Cell(9, 3, true),
                        new Cell(10, 11, true), new Cell(9, 11, true), new Cell(10, 9, true),
                        new Cell(5, 2, true), new Cell(3, 2, true), new Cell(3, 7, true),
                        new Cell(10, 5, true), new Cell(10, 10, true), new Cell(8, 7, true),
                        new Cell(19, 2, true), new Cell(19, 3, true), new Cell(18, 2, true)]

// Note: uncomment each block of code and run it

// const game1 = new GameOfLife(BOAT_PATTERN);
// console.log(game1.toString());
// game1.start();

// troubleshooting elements in cells array
// console.log(game1.cells);

// const game2 = new GameOfLife(BLICKER_PATTERN);
// console.log(game2.toString());
// game2.start();

// const game3 = new GameOfLife(GLIDER_PATTERN);
// console.log(game3.toString());
// game3.start();

const game4 = new GameOfLife(PULSAR_PATTERN);
console.log(game4.toString());
game4.start();

// const game5 = new GameOfLife(RANDOM_PATTERN);
// console.log(game5.toString());
// game5.start();
