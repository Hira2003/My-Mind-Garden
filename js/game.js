class Game {

    constructor() {

        this.difficulty = "medium";

        this.theme = "numbers";

        this.solution = [];

        this.puzzle = [];

        this.board = [];

        this.selectedCell = null;

        this.startTime = null;

        this.elapsedTime = 0;

        this.timerInterval = null;

        // Score for the current level.
        this.correctCells = new Set();
        this.mistakes = 0;
        this.hintedCells = new Set();

        // Tracks how many wrong guesses currently sit in each
        // cell, so erasing a cell can undo exactly its own
        // mistakes rather than the whole level's tally.
        this.cellMistakes = {};

    }


    start() {

        window.currentDifficulty =
            this.difficulty;


        const generator =
            new SudokuGenerator();


        const result =
            generator.generate();


        this.solution =
            result.solution;


        this.puzzle =
            result.puzzle;


        this.board =
            this.puzzle.map(
                row => [...row]
            );


        this.selectedCell =
            null;

        this.resetScore();

        this.startTimer();

    }


    restart() {

        this.board =
            this.puzzle.map(
                row => [...row]
            );


        this.selectedCell =
            null;

        this.resetScore();

        this.elapsedTime =
            0;


        this.startTimer();

    }


    selectCell(row, col) {

        if (
            this.puzzle[row][col] !== 0
        ) {

            this.selectedCell = null;

            return;

        }

        this.selectedCell = {
            row: row,
            col: col
        };

    }


    setValue(value) {

        if (!this.selectedCell) {

            return {
                success: false,
                reason: "no-cell"
            };

        }

        const row =
            this.selectedCell.row;

        const col =
            this.selectedCell.col;


        // Don't allow changing
        // original puzzle cells.

        if (
            this.puzzle[row][col] !== 0
        ) {

            return {
                success: false,
                reason: "given"
            };

        }


        /*
         * Do not award another point if this cell
         * is already correctly filled.
         */
        if (
            this.board[row][col] === value
        ) {

            return {
                success: true,
                alreadyCorrect: true
            };

        }


        /*
         * Check the solution.
         */

        if (
            this.solution[row][col] !== value
        ) {

            this.board[row][col] =
                value;

            this.mistakes += 1;

            const mistakeKey =
                row + ":" + col;

            this.cellMistakes[mistakeKey] =
                (this.cellMistakes[mistakeKey] || 0) + 1;

            return {
                success: false,
                reason: "mistake"
            };

        }


        this.board[row][col] =
            value;

        // A cell earns a point only when the player
        // correctly fills it without using a hint.
        const key = row + ":" + col;

        if (!this.hintedCells.has(key)) {
            this.correctCells.add(key);
        }


        return {
            success: true
        };

    }


    eraseCell() {

        if (!this.selectedCell) {

            return {
                success: false,
                reason: "no-cell"
            };

        }

        const row =
            this.selectedCell.row;

        const col =
            this.selectedCell.col;


        // Given (fixed) puzzle cells can never be erased.

        if (
            this.puzzle[row][col] !== 0
        ) {

            return {
                success: false,
                reason: "given"
            };

        }


        const currentValue =
            this.board[row][col];


        if (!currentValue) {

            return {
                success: false,
                reason: "empty"
            };

        }


        /*
         * A correctly filled cell (including one filled via a
         * hint) is protected — erasing it is a no-op so the
         * player can't accidentally lose a right answer.
         */

        if (
            currentValue ===
            this.solution[row][col]
        ) {

            return {
                success: false,
                reason: "correct"
            };

        }


        this.board[row][col] = 0;

        const mistakeKey =
            row + ":" + col;

        const cellMistakeCount =
            this.cellMistakes[mistakeKey] || 0;

        this.mistakes =
            Math.max(
                0,
                this.mistakes - cellMistakeCount
            );

        delete this.cellMistakes[mistakeKey];


        return {
            success: true
        };

    }


    isValueComplete(value) {

        for (let row = 0; row < 9; row++) {

            for (let col = 0; col < 9; col++) {

                if (
                    this.solution[row][col] === value &&
                    this.board[row][col] !== value
                ) {

                    return false;

                }

            }

        }

        return true;

    }


    isMistake(row, col) {

        if (
            this.puzzle[row][col] !== 0
        ) {

            return false;

        }


        const value =
            this.board[row][col];


        if (!value) {
            return false;
        }


        return (
            value !==
            this.solution[row][col]
        );

    }


    giveHint() {

        if (!this.selectedCell) {
            return null;
        }


        const row =
            this.selectedCell.row;

        const col =
            this.selectedCell.col;


        if (
            this.puzzle[row][col] !== 0
        ) {

            return null;

        }


        const correctValue =
            this.solution[row][col];


        this.board[row][col] =
            correctValue;

        this.hintedCells.add(
            row + ":" + col
        );


        return {
            row: row,
            col: col,
            value: correctValue
        };

    }


    isFinished() {

        for (let row = 0; row < 9; row++) {

            for (let col = 0; col < 9; col++) {

                if (
                    this.board[row][col] !==
                    this.solution[row][col]
                ) {

                    return false;

                }

            }

        }

        return true;

    }


    resetScore() {

        this.correctCells = new Set();

        this.mistakes = 0;

        this.hintedCells = new Set();

        this.cellMistakes = {};

    }


    getScore() {

        return (
            this.correctCells.size -
            this.mistakes
        );

    }


    startTimer() {

        this.stopTimer();


        this.startTime =
            Date.now() -
            this.elapsedTime * 1000;


        this.timerInterval =
            setInterval(
                () => {

                    this.elapsedTime =
                        Math.floor(
                            (
                                Date.now() -
                                this.startTime
                            ) / 1000
                        );

                    if (window.app) {
                        window.app.updateTimer();
                    }

                },
                1000
            );

    }


    stopTimer() {

        if (this.timerInterval) {

            clearInterval(
                this.timerInterval
            );

            this.timerInterval =
                null;

        }

    }


    getTimeString() {

        const minutes =
            Math.floor(
                this.elapsedTime / 60
            );


        const seconds =
            this.elapsedTime % 60;


        return (
            String(minutes).padStart(2, "0") +
            ":" +
            String(seconds).padStart(2, "0")
        );

    }

}
