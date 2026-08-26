class MainMenu {

    constructor() {

        this.difficulty =
            "medium";

        this.theme =
            "numbers";

        this.bindEvents();

    }


    bindEvents() {

        document
            .getElementById("playButton")
            .addEventListener(
                "click",
                () => this.show("playSettings")
            );


        document
            .getElementById("gardenButton")
            .addEventListener(
                "click",
                () => {
                    window.location.href = "Garden.html";
                }
            );


        document
            .getElementById("howToPlayButton")
            .addEventListener(
                "click",
                () => this.show("howToPlay")
            );


        document
            .getElementById("aboutButton")
            .addEventListener(
                "click",
                () => this.show("about")
            );


        document
            .getElementById("backFromPlay")
            .addEventListener(
                "click",
                () => this.show("mainMenu")
            );


        document
            .getElementById("backFromHowToPlay")
            .addEventListener(
                "click",
                () => this.show("mainMenu")
            );


        document
            .getElementById("backFromAbout")
            .addEventListener(
                "click",
                () => this.show("mainMenu")
            );


        document
            .getElementById("startGameButton")
            .addEventListener(
                "click",
                () => this.startGame()
            );


        this.bindDifficultyButtons();

        this.bindThemeButtons();

    }


    bindDifficultyButtons() {

        const buttons =
            document.querySelectorAll(
                ".difficulty-choice"
            );


        buttons.forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        buttons.forEach(
                            item => {

                                item.classList.remove(
                                    "selected"
                                );

                            }
                        );


                        button.classList.add(
                            "selected"
                        );


                        this.difficulty =
                            button.dataset.value;

                    }
                );

            }
        );

    }


    bindThemeButtons() {

        const buttons =
            document.querySelectorAll(
                ".theme-choice"
            );


        buttons.forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        buttons.forEach(
                            item => {

                                item.classList.remove(
                                    "selected"
                                );

                            }
                        );


                        button.classList.add(
                            "selected"
                        );


                        this.theme =
                            button.dataset.value;

                    }
                );

            }
        );

    }


    show(section) {

        const sections = [
            "mainMenu",
            "playSettings",
            "howToPlay",
            "about"
        ];


        sections.forEach(
            id => {

                const element =
                    document.getElementById(id);


                if (element) {

                    element.classList.add(
                        "hidden"
                    );

                }

            }
        );


        const target =
            document.getElementById(section);


        if (target) {

            target.classList.remove(
                "hidden"
            );

        }

    }


    startGame() {

        sessionStorage.setItem(
            "visualSudokuDifficulty",
            this.difficulty
        );


        sessionStorage.setItem(
            "visualSudokuTheme",
            this.theme
        );


        window.location.href =
            "game.html";

    }

}


window.addEventListener(
    "DOMContentLoaded",
    () => {

        new MainMenu();

    }
);
