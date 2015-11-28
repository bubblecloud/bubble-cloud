import {ConsoleController} from "../components/ConsoleController";
import {getClientEngine} from "../hud";
export class Console {
    consoleController: ConsoleController;
    inputLine: string = '';
    consoleOutputLinesCount = 0;
    mouseDown: boolean = false;

    constructor() {
        this.consoleController = getClientEngine().consoleController;
        this.consoleOutputLinesCount = this.consoleController.outputLines.length;
        setInterval(() => {
            this.updateScroll();
        }, 200);
    }

    onSubmit() {
        this.consoleController.execute(this.inputLine);
        this.inputLine = '';
    }

    onMouseDown() {
        this.mouseDown = true;
    }

    onMouseUp() {
        this.mouseDown = false;
    }

    updateScroll() {
        if (this.consoleOutputLinesCount != this.consoleController.outputLines.length && !this.mouseDown) {
            $(".console-lines").scrollTop($(".console-lines")[0].scrollHeight);
            this.consoleOutputLinesCount = this.consoleController.outputLines.length;
        }
    }
}