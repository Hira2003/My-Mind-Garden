const GARDEN_STORAGE_KEY = "visualSudokuGarden";
const COINS_KEY = "visualSudokuCoins";
const TOTAL_SCORE_KEY = "visualSudokuTotalScore";
const LEVELS_WON_KEY = "visualSudokuLevelsWon";

const GARDEN_SIZE = 12;
const GROWTH_TIME = 24 * 60 * 60 * 1000;

const FLOWERS = {
    rose: {
        name: "Rose",
        icon: "🌹",
        cost: 50
    },
    tulips: {
        name: "Tulips",
        icon: "🌷",
        cost: 75
    },
    sunflowers: {
        name: "Sunflowers",
        icon: "🌻",
        cost: 100
    },
    orchids: {
        name: "Orchids",
        icon: "🌺",
        cost: 125
    }
};


class Garden {

    constructor() {

        this.gardenElement =
            document.getElementById("garden");

        this.coinsDisplay =
            document.getElementById("coinsDisplay");

        this.totalScoreDisplay =
            document.getElementById("totalScoreDisplay");

        this.levelsWonDisplay =
            document.getElementById("levelsWonDisplay");

        this.messageElement =
            document.getElementById("gardenMessage");

        this.modal =
            document.getElementById("plantModal");

        this.flowerChoices =
            document.getElementById("flowerChoices");

        this.slotChoices =
            document.getElementById("slotChoices");

        this.selectedFlowerLabel =
            document.getElementById("selectedFlowerLabel");

        this.selectedFlower =
            null;

        this.loadAppearance();

        this.slots =
            this.loadGarden();

        this.bindEvents();

        this.render();

        // Update countdowns while the garden is open.
        this.updateInterval =
            setInterval(
                () => this.render(),
                1000
            );

    }


    loadAppearance() {

        const mode =
            localStorage.getItem(
                "visualSudokuMode"
            );

        document.body.classList.toggle(
            "dark-mode",
            mode === "dark"
        );

    }


    bindEvents() {

        document
            .getElementById("plantButton")
            .addEventListener(
                "click",
                () => this.openPlantModal()
            );

        document
            .getElementById("closeModalButton")
            .addEventListener(
                "click",
                () => this.closePlantModal()
            );

        document
            .getElementById("cancelPlantButton")
            .addEventListener(
                "click",
                () => this.closePlantModal()
            );

        document
            .getElementById("backButton")
            .addEventListener(
                "click",
                () => {
                    window.location.href = "index.html";
                }
            );

        this.modal.addEventListener(
            "click",
            event => {
                if (event.target === this.modal) {
                    this.closePlantModal();
                }
            }
        );

    }


    loadGarden() {

        try {

            const saved =
                JSON.parse(
                    localStorage.getItem(
                        GARDEN_STORAGE_KEY
                    )
                );

            if (
                Array.isArray(saved) &&
                saved.length === GARDEN_SIZE
            ) {
                return saved;
            }

        } catch (error) {
            console.warn(
                "Could not load garden data.",
                error
            );
        }

        return Array.from(
            { length: GARDEN_SIZE },
            () => null
        );

    }


    saveGarden() {

        localStorage.setItem(
            GARDEN_STORAGE_KEY,
            JSON.stringify(this.slots)
        );

    }


    getCoins() {

        return Number(
            localStorage.getItem(
                COINS_KEY
            ) || 0
        );

    }


    updateHeader() {

        const coins =
            this.getCoins();

        this.coinsDisplay.textContent =
            String(coins).padStart(2, "0");

        this.totalScoreDisplay.textContent =
            localStorage.getItem(
                TOTAL_SCORE_KEY
            ) || "0";

        this.levelsWonDisplay.textContent =
            localStorage.getItem(
                LEVELS_WON_KEY
            ) || "0";

    }


    openPlantModal() {

        const emptySlots =
            this.slots.filter(
                slot => !slot
            ).length;

        if (emptySlots === 0) {

            this.showMessage(
                "Your garden is full. 🌿"
            );

            return;

        }

        this.selectedFlower = null;

        this.renderFlowerChoices();

        this.renderSlotChoices();

        this.modal.classList.remove(
            "hidden"
        );

    }


    closePlantModal() {

        this.modal.classList.add(
            "hidden"
        );

        this.selectedFlower = null;

    }


    renderFlowerChoices() {

        this.flowerChoices.innerHTML = "";

        Object.entries(FLOWERS).forEach(
            ([id, flower]) => {

                const button =
                    document.createElement("button");

                button.type = "button";
                button.className = "flower-choice";

                button.innerHTML = `
                    <span class="flower-icon">${flower.icon}</span>
                    <strong>${flower.name}</strong>
                    <small>🪙 ${flower.cost} coins</small>
                `;

                if (
                    this.getCoins() < flower.cost
                ) {
                    button.disabled = true;
                    button.title =
                        "You need more coins for this flower.";
                }

                button.addEventListener(
                    "click",
                    () => this.selectFlower(id)
                );

                this.flowerChoices.appendChild(
                    button
                );

            }
        );

    }


    selectFlower(id) {

        const flower =
            FLOWERS[id];

        if (!flower) {
            return;
        }

        if (
            this.getCoins() < flower.cost
        ) {

            this.showMessage(
                "You don't have enough coins for this flower. 🪙"
            );

            return;

        }

        this.selectedFlower = id;

        this.selectedFlowerLabel.textContent =
            flower.name +
            " selected — choose a place";

        document
            .querySelectorAll(".flower-choice")
            .forEach(button => {
                button.classList.remove("selected");
            });

        const choices =
            [...document.querySelectorAll(".flower-choice")];

        const selectedIndex =
            Object.keys(FLOWERS).indexOf(id);

        if (choices[selectedIndex]) {
            choices[selectedIndex]
                .classList.add("selected");
        }

        this.renderSlotChoices();

    }


    renderSlotChoices() {

        this.slotChoices.innerHTML = "";

        this.slots.forEach(
            (slot, index) => {

                const button =
                    document.createElement("button");

                button.type = "button";
                button.className = "slot-choice";

                if (slot) {

                    button.textContent =
                        "Occupied";

                    button.disabled = true;

                } else {

                    button.textContent =
                        "Place " + (index + 1);

                    button.disabled =
                        !this.selectedFlower;

                    button.addEventListener(
                        "click",
                        () => this.plantFlower(index)
                    );

                }

                this.slotChoices.appendChild(
                    button
                );

            }
        );

    }


    plantFlower(slotIndex) {

        if (!this.selectedFlower) {
            return;
        }

        if (this.slots[slotIndex]) {
            return;
        }

        const flower =
            FLOWERS[this.selectedFlower];

        const coins =
            this.getCoins();

        if (coins < flower.cost) {

            this.showMessage(
                "You don't have enough coins. 🪙"
            );

            return;

        }

        this.slots[slotIndex] = {
            flower: this.selectedFlower,
            plantedAt: Date.now()
        };

        localStorage.setItem(
            COINS_KEY,
            String(coins - flower.cost)
        );

        this.saveGarden();

        this.closePlantModal();

        this.render();

        this.showMessage(
            flower.name +
            " planted! It will bloom in 24 hours. 🌱"
        );

    }


    render() {

        this.updateHeader();

        this.gardenElement.innerHTML = "";

        this.slots.forEach(
            (slot, index) => {

                const plot =
                    document.createElement("div");

                plot.className =
                    "plot";

                if (!slot) {

                    plot.classList.add(
                        "empty"
                    );

                    plot.innerHTML = `
                        <div class="plot-hole"></div>
                        <span class="plot-label">
                            Empty place
                        </span>
                    `;

                    this.gardenElement.appendChild(
                        plot
                    );

                    return;
                }

                this.renderFlowerPlot(
                    plot,
                    slot,
                    index
                );

                this.gardenElement.appendChild(
                    plot
                );

            }
        );

    }


    renderFlowerPlot(plot, slot, index) {

        const flower =
            FLOWERS[slot.flower] ||
            FLOWERS.rose;

        const elapsed =
            Math.max(
                0,
                Date.now() -
                Number(slot.plantedAt)
            );

        const progress =
            Math.min(
                100,
                (elapsed / GROWTH_TIME) * 100
            );

        const bloomed =
            progress >= 100;

        const flowerElement =
            document.createElement("div");

        flowerElement.className =
            "flower" +
            (bloomed ? "" : " growing");

        flowerElement.textContent =
            bloomed
                ? flower.icon
                : "🌱";

        plot.appendChild(
            flowerElement
        );

        const status =
            document.createElement("div");

        status.className =
            "growth-time";

        status.textContent =
            bloomed
                ? "Blooming ✨"
                : this.getRemainingTime(
                    GROWTH_TIME - elapsed
                );

        plot.appendChild(
            status
        );

        if (!bloomed) {

            const bar =
                document.createElement("div");

            bar.className =
                "growth-bar";

            const progressBar =
                document.createElement("div");

            progressBar.className =
                "growth-progress";

            progressBar.style.width =
                progress + "%";

            bar.appendChild(
                progressBar
            );

            plot.appendChild(
                bar
            );

        }

        const label =
            document.createElement("span");

        label.className =
            "plot-label";

        label.textContent =
            flower.name;

        plot.appendChild(
            label
        );

    }


    getRemainingTime(milliseconds) {

        const remaining =
            Math.max(
                0,
                milliseconds
            );

        const totalSeconds =
            Math.ceil(
                remaining / 1000
            );

        const hours =
            Math.floor(
                totalSeconds / 3600
            );

        const minutes =
            Math.floor(
                (totalSeconds % 3600) / 60
            );

        const seconds =
            totalSeconds % 60;

        return (
            String(hours).padStart(2, "0") +
            ":" +
            String(minutes).padStart(2, "0") +
            ":" +
            String(seconds).padStart(2, "0") +
            " remaining"
        );

    }


    showMessage(text) {

        this.messageElement.textContent =
            text;

        clearTimeout(
            this.messageTimeout
        );

        this.messageTimeout =
            setTimeout(
                () => {
                    this.messageElement.textContent = "";
                },
                4500
            );

    }

}


window.addEventListener(
    "DOMContentLoaded",
    () => {
        window.garden =
            new Garden();
    }
);
