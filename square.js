class Square {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.g = Infinity;
        this.h = 0;
        this.cameFrom = null;
        this.adj = [];
        this.isPath = true;
        this.squareColor = 255
        this.hasTempColor = false;
    }

    get coord() {
        return this.x + " " + this.y;
    }

    fValue(coeff) {
        return this.g + coeff * this.h;
    }

    addAdj(grid) {
        if (this.x+1 >= 0 && this.x+1 < grid.columns) {
            this.adj.push(grid.thisGrid[this.x+1][this.y]);
        }
        if (this.x-1 >= 0 && this.x-1 < grid.columns) {
            this.adj.push(grid.thisGrid[this.x-1][this.y]);
        }
        if (this.y+1 >= 0 && this.y+1 < grid.rows) {
            this.adj.push(grid.thisGrid[this.x][this.y+1]);
        }
        if (this.y-1 >= 0 && this.y-1 < grid.rows) {
            this.adj.push(grid.thisGrid[this.x][this.y-1]);
        }
        //Allow diagonal search
        /* if (this.x+1 < grid.columns && this.y+1 < grid.rows) {
            this.adj.push(grid.thisGrid[this.x+1][this.y+1]);
        }
        if (this.x-1 > 0 && this.y-1 > 0) {
            this.adj.push(grid.thisGrid[this.x-1][this.y-1]);
        }
        if (this.x+1 < grid.columns && this.y-1 > 0) {
            this.adj.push(grid.thisGrid[this.x+1][this.y-1]);
        }
        if (this.x-1 > 0 && this.y+1 < grid.rows) {
            this.adj.push(grid.thisGrid[this.x-1][this.y+1]);
        } */
    }
    
    show(grid) {
        fill(this.squareColor);
        if (!this.isPath) {
            fill(0);
        }
        stroke(0);
        rect(this.x * grid.squareW + grid.gridX, this.y * grid.squareH + grid.gridY, 0.5 + grid.squareW, 0.5 + grid.squareH);
    }

    show2(color, grid) {
        fill(color);
        if (!this.isPath) {
            fill(0);
        }
        stroke(0);
        rect(this.x * grid.squareW + grid.gridX, this.y * grid.squareH + grid.gridY, 0.5 + grid.squareW, 0.5 + grid.squareH);
    }

    genWall(grid) {
        if (this.x < grid.columns * 1 / 10 || this.y < grid.rows * 1 / 10
            || this.x > grid.columns * 9 / 10 || this.y > grid.rows * 9 / 10) {
            this.isPath = (Math.random() > 0.15);
        }
        else if (
            (this.x >= grid.columns * 1 / 10 && this.x < grid.columns * 2 / 10)
            || (this.x <= grid.columns * (9 / 10) && this.x > grid.columns * 8 / 10)
            || (this.y >= grid.rows * 1 / 10 && this.y < grid.rows * 2 / 10)
            || (this.y <= grid.rows * 9 / 10 && this.y > grid.rows * 8 / 10)
        ) {
            this.isPath = (Math.random() > 0.25);
        }
        else {
            this.isPath = (Math.random() > 0.40);
        }
    }

    mouseDraggingSquare(px, py, grid) {
        if (px >= this.x * grid.squareW + grid.gridX
            && px < (this.x + 1) * grid.squareW + grid.gridX
            && py >= this.y * grid.squareH + grid.gridY
            && py < (this.y + 1) * grid.squareH + grid.gridY
            && this.isPath) {
            this.isPath = false;
            this.show(grid);
        }
    }

    mouseMovingSquare(px, py, color, grid) {
        if (px >= this.x * grid.squareW + grid.gridX
            && px < (this.x + 1) * grid.squareW + grid.gridX
            && py >= this.y * grid.squareH + grid.gridY
            && py < (this.y + 1) * grid.squareH + grid.gridY
            && this.isPath) {
            this.hasTempColor = true;
            this.show2(color, grid);
        }
        else {
            if (this.hasTempColor) {
                this.hasTempColor = false
                this.show(grid);
            }
        }
    }

    mousePressingSquare(px, py, color, grid) {
        if (px >= this.x * grid.squareW + grid.gridX
            && px < (this.x + 1) * grid.squareW + grid.gridX
            && py >= this.y * grid.squareH + grid.gridY
            && py < (this.y + 1) * grid.squareH + grid.gridY) {
            this.isPath = true;
            this.squareColor = color;
            this.g = 0;
            this.h = heuristic(this, goalS, 1);
            return this;
        }
        else {
            grid.thisGrid[1][1].squareColor = color;
            return grid.thisGrid[1][1];
        }
    }
}