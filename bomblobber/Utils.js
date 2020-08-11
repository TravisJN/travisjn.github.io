
export default class Utils {

    /**
     * Keeps track of the current mouse position, relative to an element.
     * @param {HTMLElement} element
     * @return {object} Contains properties: x, y, event
     */
    static captureMouse(element) {
        var mouse = {x: 0, y: 0, event: null},
            body_scrollLeft = document.body.scrollLeft,
            element_scrollLeft = document.documentElement.scrollLeft,
            body_scrollTop = document.body.scrollTop,
            element_scrollTop = document.documentElement.scrollTop,
            offsetLeft = element.offsetLeft,
            offsetTop = element.offsetTop;

        element.addEventListener('mousemove', function (event) {
            var x, y;

            if (event.pageX || event.pageY) {
                x = event.pageX;
                y = event.pageY;
            } else {
                x = event.clientX + body_scrollLeft + element_scrollLeft;
                y = event.clientY + body_scrollTop + element_scrollTop;
            }
            x -= offsetLeft;
            y -= offsetTop;

            mouse.x = x;
            mouse.y = y;
            mouse.event = event;
        }, false);

        return mouse;
    };

    static getRandomFloat(min, max) {
        return Math.random() * (max - min) + min;
    }

    static getDistance(x1, y1, x2, y2) {
        var dx = x2 - x1;
        var dy = y2 - y1;

        return Math.sqrt(dx * dx + dy * dy);
    }

    static areColliding(x1, y1, radius1, x2, y2, radius2) {
        return this.getDistance(x1, y1, x2, y2) <= radius1 + radius2;
    }

    static getNewGrid(width, height, numHorizontalSections, numVerticalSections) {
        let grid = {};

        for (var i = 1; i <= numHorizontalSections; i++) {
            let x = i * (width / numHorizontalSections);
            grid[x] = {};
            for (var j = 1; j <= numVerticalSections; j++) {
                let y = j * (height / numVerticalSections);
                grid[x][y] = [];
            }
        }

        return grid;
    }

    // Takes a grid object and x,y coords and returns the section of the grid where those x,y coords are located
    static getSectionFromGrid(grid, x, y) {
        let xKey, yKey;

        for (const xValue in grid) {
            if (x < xValue) {
                xKey = xValue;
                break;
            }
        }

        for (const yValue in grid[xKey]) {
            if (y < yValue) {
                yKey = yValue;
                break;
            }
        }

        if (xKey && yKey && grid[xKey]) {
            return grid[xKey][yKey];
        }
    }
}
