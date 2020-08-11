import Utils from "./Utils.js";

export default class Agent {

    constructor(x, y) {
        // this.color = "red";
        // this.radius = 12;
        // this.cannonWidth = 5;
        // this.cannonHeight = 15;
        this.Options = {
            ready: {
                x,
                y,
                vx: 0,
                vy: 0,
                velocityX: 0,
                velocityY: 0,
                targetx: 0,
                targety: 0,
                color: "red",
                radius: 12,
                cannonWidth: 5,
                cannonHeight: 15,
                rotation: 1.5
            },
            exploding: {
                vx: 0,
                vy: 0,
                velocityX: 0,
                velocityY: 0,
                targetx: 0,
                targety: 0,
                color: "rgb(255,255,0, 1)",
                currentAlpha: 1,
                alphaChange: -0.02,
                cannonWidth: 0,
                cannonHeight: 0,
                radius: 0,
                maxRadius: 50,
                explosionSpeed: 1.9,  // incrase in radius/frame during explosion animation
                explosionDuration: 150
            },
            seeking: {
                color: "red",
                radius: 12,
                cannonWidth: 5,
                cannonHeight: 15
            }
        };

        this.x = x;
        this.y = y;
        this.targetx = 0;
        this.targety = 0;
        this.vx = 0;
        this.vy = 0;

        this.velocityX = 0;
        this.velocityY = 0;
        //this.angularAcceleration = 1;

        this.maxVelocity = 5;
        this.maxAcceleration = 1.2;
        //this.rotation = 90;

        this.steeringForce = {
            linearX: 0,
            linearY: 0,
        };

        this.agentStates = {
            READY: "READY",
            SEEKING: "SEEKING",
            EXPLODING: "EXPLODING",
            DONE: "DONE"
        };

        this.setState(this.agentStates.READY);
    }

    setState(newState) {
        this.currentState = this.agentStates[newState];

        switch (newState) {
            case "EXPLODING":
                _.assignIn(this, this.Options.exploding);
                break;
            case "SEEKING":
                _.assignIn(this, this.Options.seeking);
                break;
            case "READY":
            default:
                _.assignIn(this, this.Options.ready);
                break;
        }
    }

    update() {
        if (this.currentState === this.agentStates.EXPLODING) {
            this.explode();
            return;
        } else if (this.currentState === this.agentStates.READY) {
            return;
        }

        this.x += this.vx;
        this.y += this.vy;

        this.vx += this.steeringForce.linearX;
        this.vy += this.steeringForce.linearY;

        var speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);

        //check for maximum velocity and stop accelerating when agent reaches it
        if (speed > this.maxVelocity && speed > 0) {
            this.vx = (this.vx / speed) * this.maxVelocity;
            this.vy = (this.vy / speed) * this.maxVelocity
        }

        this.rotation = Math.atan2(this.vy, this.vx);
    }

    seek({ x, y }) {
        var dx, dy;

        this.setState(this.agentStates.SEEKING);

        dx = x - this.x;
        dy = y - this.y;

        var distance = Math.sqrt(dx * dx + dy * dy);

        this.steeringForce.linearX = dx / distance * this.maxAcceleration;
        this.steeringForce.linearY = dy / distance * this.maxAcceleration;
    }

    explode() {
        // set the radius to 0 and gradually increase it with each frame
        if (this.explosionDuration-- > 0) {
            if (this.currentAlpha > 0) {
                this.currentAlpha += this.alphaChange;
                this.color = "rgb(255,255,0," + this.currentAlpha + ")";
            }
            if (this.radius < this.maxRadius) {
                this.radius += this.explosionSpeed;
            }
        } else {
            this.setState(this.agentStates.READY);
        }
    }

    checkArrived({ x, y }) {
        var distance = Utils.getDistance(this.x, this.y, x, y);

        if (distance < 5) {
            this.setState(this.agentStates.EXPLODING);
            return true;
        }
        return false;
    }
}