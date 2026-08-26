class App {

    constructor() {

        this.boardElement =
            document.getElementById(
                "sudokuBoard"
            );

        this.paletteElement =
            document.getElementById(
                "symbolPalette"
            );

        this.timerElement =
            document.getElementById(
                "timer"
            );

        this.messageElement =
            document.getElementById(
                "message"
            );

        this.winModal =
            document.getElementById(
                "winModal"
            );

        this.finalTime =
            document.getElementById(
                "finalTime"
            );

        this.gameThemeName =
            document.getElementById(
                "gameThemeName"
            );

        this.gameDifficulty =
            document.getElementById(
                "gameDifficulty"
            );

        this.difficultyDisplay =
            document.getElementById(
                "difficultyDisplay"
            );

        this.scoreDisplay =
            document.getElementById(
                "scoreDisplay"
            );

        this.finalScore =
            document.getElementById(
                "finalScore"
            );

        this.coinsEarned =
            document.getElementById(
                "coinsEarned"
            );

        this.darkModeButton =
            document.getElementById(
                "darkMode"
            );

        this.modeIcon =
            document.getElementById(
                "modeIcon"
            );

        this.modeText =
            document.getElementById(
                "modeText"
            );


        /*
         * Get settings selected
         * from the main menu.
         */

        this.selectedDifficulty =
            sessionStorage.getItem(
                "visualSudokuDifficulty"
            ) || "medium";


        this.selectedTheme =
            sessionStorage.getItem(
                "visualSudokuTheme"
            ) || "numbers";


        /*
         * Create the game.
         */

        this.game =
            new Game();


        this.game.difficulty =
            this.selectedDifficulty;


        this.game.theme =
            this.selectedTheme;


        this.bindEvents();

        this.loadAppearance();

        this.newGame();

    }


    newGame() {

        this.levelRewarded = false;

        this.game.difficulty =
            this.selectedDifficulty;

        this.game.theme =
            this.selectedTheme;


        this.game.start();


        this.updateGameInformation();

        this.render();

        this.updateScoreDisplay();

        this.message("");

    }


    updateGameInformation() {

        const theme =
            getTheme(
                this.selectedTheme
            );


        const difficulty =
            this.selectedDifficulty
                .charAt(0)
                .toUpperCase() +
            this.selectedDifficulty
                .slice(1);


        this.gameThemeName.textContent =
            theme.name;


        this.gameDifficulty.textContent =
            difficulty;


        this.difficultyDisplay.textContent =
            difficulty;

    }


    bindEvents() {

        document
            .getElementById("exitButton")
            .addEventListener(
                "click",
                () => this.exitGame()
            );


        document
            .getElementById("restartBtn")
            .addEventListener(
                "click",
                () => this.restart()
            );


        document
            .getElementById("hintBtn")
            .addEventListener(
                "click",
                () => this.hint()
            );


        document
            .getElementById("nextGameBtn")
            .addEventListener(
                "click",
                () => {

                    this.closeWinModal();

                    this.newGame();

                }
            );


        document
            .getElementById("winExitButton")
            .addEventListener(
                "click",
                () => this.exitGame()
            );


        this.darkModeButton
            .addEventListener(
                "click",
                () => this.toggleDarkMode()
            );


        /*
         * Keyboard input.
         */

        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key >= "1" &&
                    event.key <= "9"
                ) {

                    this.enterValue(
                        Number(event.key)
                    );

                }

            }
        );

    }


    render() {

        this.renderBoard();

        this.renderPalette();

        this.updateTimer();

        this.updateScoreDisplay();

    }


    renderBoard() {

        this.boardElement.innerHTML = "";


        const theme =
            getTheme(
                this.game.theme
            );


        for (
            let row = 0;
            row < 9;
            row++
        ) {

            for (
                let col = 0;
                col < 9;
                col++
            ) {

                const cell =
                    document.createElement(
                        "button"
                    );


                cell.type = "button";

                cell.className =
                    "cell";


                const value =
                    this.game.board[row][col];


                const given =
                    this.game.puzzle[row][col] !== 0;


                if (given) {

                    cell.classList.add(
                        "given"
                    );

                }


                if (
                    this.game.selectedCell &&
                    this.game.selectedCell.row === row &&
                    this.game.selectedCell.col === col
                ) {

                    cell.classList.add(
                        "selected"
                    );

                }


                if (
                    this.game.isMistake(
                        row,
                        col
                    )
                ) {

                    cell.classList.add(
                        "error"
                    );

                }


                if (value !== 0) {

                    cell.textContent =
                        theme.symbols[
                            value - 1
                        ];

                }


                cell.addEventListener(
                    "click",
                    () => {

                        this.selectCell(
                            row,
                            col
                        );

                    }
                );


                this.boardElement.appendChild(
                    cell
                );

            }

        }

    }


    renderPalette() {

        this.paletteElement.innerHTML = "";


        const theme =
            getTheme(
                this.game.theme
            );


        theme.symbols.forEach(
            (
                symbol,
                index
            ) => {

                const button =
                    document.createElement(
                        "button"
                    );


                button.type = "button";

                button.className =
                    "symbol-button";


                button.textContent =
                    symbol;


                button.addEventListener(
                    "click",
                    () => {

                        this.enterValue(
                            index + 1
                        );

                    }
                );


                this.paletteElement.appendChild(
                    button
                );

            }
        );

    }


    selectCell(row, col) {

        this.game.selectCell(
            row,
            col
        );


        this.render();

    }


    enterValue(value) {

        if (
            !this.game.selectedCell
        ) {

            this.message(
                "Select an empty cell first."
            );

            return;

        }


        const result =
            this.game.setValue(
                value
            );


        this.render();


        if (
            result.reason === "mistake"
        ) {

            this.message(
                "Oops! That's not correct. ❌"
            );

            return;

        }


        if (result.success) {

            this.message("");


            if (
                this.game.isFinished()
            ) {

                this.game.stopTimer();

                this.showWin();

            }

        }

    }


    hint() {

        const result =
            this.game.giveHint();


        if (!result) {

            this.message(
                "Select an empty cell first."
            );

            return;

        }


        this.render();


        this.message(
            "A little help from the garden 🌱"
        );


        if (
            this.game.isFinished()
        ) {

            this.game.stopTimer();

            this.showWin();

        }

    }


    restart() {

        this.game.restart();

        this.render();

        this.message(
            "Puzzle restarted."
        );

    }


    updateTimer() {

        if (!this.timerElement) {
            return;
        }


        this.timerElement.textContent =
            this.game.getTimeString();

    }


    message(text) {

        if (!this.messageElement) {
            return;
        }


        this.messageElement.textContent =
            text;

    }


    updateScoreDisplay() {

        if (!this.scoreDisplay) {
            return;
        }

        this.scoreDisplay.textContent =
            this.game.getScore();

    }


    awardLevelScore() {

        if (this.levelRewarded) {
            return 0;
        }

        this.levelRewarded = true;

        const score =
            this.game.getScore();

        // Scores are always preserved. Negative levels simply
        // earn zero coins rather than taking coins away.
        const coinsEarned =
            Math.max(0, score);

        const totalScore =
            Number(
                localStorage.getItem(
                    "visualSudokuTotalScore"
                ) || 0
            ) + score;

        const coins =
            Number(
                localStorage.getItem(
                    "visualSudokuCoins"
                ) || 0
            ) + coinsEarned;

        const levelsWon =
            Number(
                localStorage.getItem(
                    "visualSudokuLevelsWon"
                ) || 0
            ) + 1;

        localStorage.setItem(
            "visualSudokuTotalScore",
            String(totalScore)
        );

        localStorage.setItem(
            "visualSudokuCoins",
            String(coins)
        );

        localStorage.setItem(
            "visualSudokuLevelsWon",
            String(levelsWon)
        );

        localStorage.setItem(
            "visualSudokuLastScore",
            String(score)
        );

        localStorage.setItem(
            "visualSudokuLastCoinsEarned",
            String(coinsEarned)
        );

        return coinsEarned;

    }


    showWin() {

        const coinsEarned =
            this.awardLevelScore();

        this.finalTime.textContent =
            this.game.getTimeString();

        this.finalScore.textContent =
            this.game.getScore();

        this.coinsEarned.textContent =
            "🌱 Coins earned: " +
            coinsEarned;


        this.winModal.classList.remove(
            "hidden"
        );

    }


    closeWinModal() {

        this.winModal.classList.add(
            "hidden"
        );

    }


    exitGame() {

        this.game.stopTimer();

        window.location.href =
            "index.html";

    }


    loadAppearance() {

        const mode =
            localStorage.getItem(
                "visualSudokuMode"
            );


        const dark =
            mode === "dark";


        document.body.classList.toggle(
            "dark-mode",
            dark
        );


        this.updateModeButton(
            dark
        );

    }


    toggleDarkMode() {

        const dark =
            document.body.classList.toggle(
                "dark-mode"
            );


        localStorage.setItem(
            "visualSudokuMode",
            dark
                ? "dark"
                : "light"
        );


        this.updateModeButton(
            dark
        );

    }


    updateModeButton(dark) {

        this.modeIcon.textContent =
            dark ? "☀️" : "🌙";


        this.modeText.textContent =
            dark ? "Light" : "Dark";


        this.darkModeButton.setAttribute(
            "aria-pressed",
            String(dark)
        );

    }

}


/*
 * Start application after
 * the page has loaded.
 */

window.addEventListener(
    "DOMContentLoaded",
    () => {

        window.app =
            new App();

    }
);
