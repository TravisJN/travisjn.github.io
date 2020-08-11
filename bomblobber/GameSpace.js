import Utils from './Utils.js';

export default class GameSpace {
    constructor(width, height) {
        this.canvas = document.getElementById("canvas");
        this.context = canvas.getContext("2d");

        this.canvas.width = width;
        this.canvas.height = height;

        this.grid = Utils.getNewGrid(width, height, 1, 1);
    }

    drawPiece({ x, y, radius }) {
        this.context.save();
        this.context.StrokeStyle = "red";
        this.context.beginPath();
        this.context.arc(x, y, radius, 0, 2 * Math.PI, true);
        this.context.stroke();
        this.context.restore();
    }

    drawWaypoint({ x, y, radius }) {
        this.context.save();
        this.context.StrokeStyle = "black";
        this.context.beginPath();
        this.context.arc(x, y, radius, 0, 2 * Math.PI, true);
        this.context.stroke();
        this.context.restore();
    }

    drawAgent({ x, y, radius, color, rotation, cannonWidth, cannonHeight }) {
        this.context.save();

        this.context.fillStyle = color;
        this.context.strokeStyle = "black";
        this.context.beginPath();
        this.context.arc(x, y, radius, 0, 2*Math.PI, true);
       // this.context.stroke();
        this.context.fill();

        this.context.translate(x, y);
        this.context.rotate(rotation + Math.PI / 2);
        this.context.fillRect(-cannonWidth / 2, 0, cannonWidth, -cannonHeight);
        this.context.strokeRect(-cannonWidth / 2, 0, cannonWidth, -cannonHeight);

        this.context.restore();
    }

    /**
     * This is pretty fugly. Looping through each section of the grid and then checking
     * if the waypoint is destroyed before drawing it.
     * This function also filters out the waypoints that were destroyed on the previous frame
     */
    drawWaypoints() {
        Object.keys(this.grid).forEach((x) => {
            Object.keys(this.grid[x]).forEach((y) => {
                this.grid[x][y] = this.grid[x][y].filter((aWaypoint) => {
                    if (!aWaypoint.isDestroyed) {
                        this.drawWaypoint(aWaypoint);
                        return true;
                    }
                    return false;
                });
            });
        });
    }

    // todo: use
    drawPieces(pieces) {
        pieces.forEach((piece) => {
            this.drawPiece(piece);
        })
    }

    screenShake() {
        let timer = setInterval(() => {
            this.canvas.className = (this.canvas.className === "default") ? "offset" : "default";
        }, 50);

        setTimeout(() => {
            clearInterval(timer);
            this.canvas.className = "default";
        }, 200);
    }
}