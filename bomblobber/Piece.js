import Utils from './Utils.js';

var gravity = 0.2;
var bounce = -0.6;
var friction = 0.9;

export default class Piece {
    constructor(x, y, agentx, agenty) {
        this.x = x;
        this.y = y;
        this.radius = 1.5;

        this.willStop = false;
        this.isStopped = false;
        this.bufferCount = 0;
        this.stopBuffer = 60;   // number of frames to keep updating after this piece has reached its minimum velocity
                                // this is to prevent pieces from sometimes stopping suddenly

        // This ensures the pieces shoot out away from where the explosion is occurring
        if (x < agentx) {
            this.vx = Utils.getRandomFloat(2, 5);
        } else {
            this.vx = Utils.getRandomFloat(-5, 2);
        }

        if (y < agenty) {
            this.vy = Utils.getRandomFloat(2, 8);
        } else {
            this.vy = Utils.getRandomFloat(-5, 2);
        }

    }

    update(grid) {
        if (this.isStopped) {
            return;
        }

        let waypoints = Utils.getSectionFromGrid(grid, this.x, this.y);

        //check if piece is at bottom of canvas
        if (this.y > canvas.height - (this.radius + 1)) {
            this.y = canvas.height - (this.radius + 1);  //+1 to make it look nice, otherwise it's slightly clipped
            this.vy *= bounce;
            //apply friction only when piece is on the floor
            this.vx *= friction;
            this.vy *= friction;
        } else {
            this.vy += gravity;
        }
        //check if piece is hitting either side of canvas
        if (this.x > canvas.width - this.radius || this.x < 0 + this.radius) {
            this.vx *= -1;
        }

        if (waypoints) {
            // check if piece is hitting a waypoint
            waypoints.forEach((aWaypoint) => {
                if (Utils.areColliding(this.x, this.y, this.radius, aWaypoint.x, aWaypoint.y, aWaypoint.radius)) {
                    this.vx *= -1;
                    this.vy *= -1;
                    // pieces with high velocity will clip into the waypoints so we need to make sure they bounce clear of the radius of the waypoint
                    this.vx += this.radius;
                    this.vy += this.radius;
                    this.vx *= friction;
                    this.vy *= friction;
                }
            });
        }


        this.x += this.vx;
        this.y += this.vy;

        if (this.willStop) {
            // Allow this piece to update for some frames after it has stopped in order to allow for a smoother stopping animation
            if (this.bufferCount++ > this.stopBuffer) {
                this.isStopped = true;
            }
        } else if (this.vy < 0.5 && this.vx < 0.1 && this.y > 497) {
            // If this piece's velocity is (basically) 0 and the piece is at the bottom of the gamespace, stop updating
            this.willStop = true;
        }
    }
}