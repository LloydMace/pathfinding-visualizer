class Grid {
    constructor(c, r, w, h, x, y) {
        this.columns = c;
        this.rows = r;
        this.squareW = w;
        this.squareH = h;
        this.gridX = x;
        this.gridY = y;
        this.grid = [];
    }

    get thisGrid() {
        return this.grid;
    }

    initMaze() {
        for (var i = 0; i < this.columns; i++) {
            this.grid[i] = [];
            for (var j = 0; j < this.rows; j++) {
                this.grid[i][j] = new Square(i, j);
            }
        }
        for (var i = 0; i < this.columns; i++) {
            for (var j = 0; j < this.rows; j++) {
                this.grid[i][j].addAdj(this);
                if (i == 0 || i == this.columns - 1 || j == 0 || j == this.rows - 1) {
                    this.grid[i][j].isPath = false;
                }
            }
        }
    }
    
    showGrid() {
        for (var i = 0; i < this.columns; i++) {
            for (var j = 0; j < this.rows; j++) {
                this.grid[i][j].show(this);
            }
        }
    }

    clearSearch() {
        for (let i = 0; i<arguments.length; i++) {
            arguments[i].length = 0;
        }
        for (let i = 1; i < this.columns - 1; i++) {
            for (let j = 1; j < this.rows - 1; j++) {
                this.grid[i][j].cameFrom = null;
                this.grid[i][j].g = Infinity;
                this.grid[i][j].squareColor = 255;
            }
        }
    }
    
    resetMaze() {
        for (let i = 0; i<arguments.length; i++) {
            arguments[i].length = 0;
        }
        for (let i = 1; i < this.columns - 1; i++) {
            for (let j = 1; j < this.rows - 1; j++) {
                this.grid[i][j].isPath = true;
                this.grid[i][j].cameFrom = null;
                this.grid[i][j].g = Infinity;
                this.grid[i][j].squareColor = 255;
            }
        }
    }

    genRanMaze() {
        for (let i = 0; i<arguments.length; i++) {
            arguments[i].length = 0;
        }
        for (let i = 1; i < this.columns - 1; i++) {
            for (let j = 1; j < this.rows - 1; j++) {
                this.grid[i][j].genWall(grid);
                this.grid[i][j].cameFrom = null;
                this.grid[i][j].g = Infinity;
                this.grid[i][j].squareColor = 255;
            }
        }
    }
}