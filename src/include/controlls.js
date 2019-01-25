export class Controlls {

    constructor(callback) {
        
        this.state = {
            left: false,
            right: false,
            up: false,
            down: false
        };

        this.callback = callback;

        this.addEventListeners();   

    }

    addEventListeners() {
        document.addEventListener("keydown", (event) => {
            const keyName = event.key;
            if (keyName === "ArrowLeft") {
                this.state.left = true;
            }
            else if (keyName === "ArrowRight") {
                this.state.right = true;
            }
            else if (keyName === "ArrowUp") {
                this.state.up = true;
            }
            else if (keyName === "ArrowDown") {
                this.state.down = true;
            }
            this.callback();
        }, false);

        document.addEventListener("keyup", (event) => {
            const keyName = event.key;
            if (keyName === "ArrowLeft") {
                this.state.left = false;
            }
            else if (keyName === "ArrowRight") {
                this.state.right = false;
            }
            else if (keyName === "ArrowUp") {
                this.state.up = false;
            }
            else if (keyName === "ArrowDown") {
                this.state.down = false;
            }
            this.callback();
        }, false);
    }

    get left() { return this.state.left; }
    get right() { return this.state.right; }
    get up() { return this.state.up; }
    get down() { return this.state.down; }
}