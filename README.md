# 🌸 Visual Sudoku

A modern and interactive Sudoku game where classic numbers can be replaced with beautiful visual symbols.

Instead of solving Sudoku only with numbers, players can choose themes such as **Fruits 🍎** and **Flowers 🌸**, making the classic puzzle more visual and enjoyable.

Built with pure **HTML, CSS, and JavaScript**.

---

## 🎮 Features

- 🧩 Classic **9×9 Sudoku**
- 🎨 Multiple visual themes
  - 🔢 Numbers
  - 🍎 Fruits
  - 🌸 Flowers
- 🎯 Three difficulty levels
  - Easy
  - Medium
  - Hard
- ⏱️ Built-in game timer
- 💡 Hint system
- ❌ Mistake detection
- 🔴 Incorrect answers are highlighted
- 🌙 Dark mode
- 📱 Responsive design for desktop and mobile
- 🔄 Restart current puzzle
- 🏆 Completion screen
- 🚪 Exit game and return to the main menu
- 📖 How to Play section
- ℹ️ About section

---

## 🕹️ How to Play

The goal is the same as traditional Sudoku:

Fill the entire **9×9 grid** so that:

- Each row contains every symbol exactly once.
- Each column contains every symbol exactly once.
- Each **3×3 box** contains every symbol exactly once.

### Choosing a Theme

Before starting a game, you can choose your preferred visual theme:

**🔢 Numbers**

The classic Sudoku experience using numbers from 1 to 9.

**🍎 Fruits**

Replace the numbers with different fruit symbols.

**🌸 Flowers**

Replace the numbers with different flower symbols.

The rules remain exactly the same regardless of the theme.

---

## 🎯 Difficulty Levels

| Difficulty | Description |
|------------|-------------|
| 🟢 Easy | More starting cells and fewer empty cells |
| 🟡 Medium | Balanced challenge |
| 🔴 Hard | Fewer starting cells and a greater challenge |

---

## 💡 Hints

If you get stuck, the **Hint** button can reveal the correct symbol for the currently selected cell.

Try solving the puzzle yourself first though! 😉

---

## ❌ Mistake Detection

The game automatically checks player input.

If an incorrect symbol is entered, the cell is highlighted in **red**, making mistakes easy to identify.

---

## 🌙 Dark Mode

Visual Sudoku includes a dark mode designed for comfortable gameplay in low-light environments.

Your appearance preference is saved locally so it can be preserved between sessions.

---

## 📱 Responsive Design

The game is designed to work across different screen sizes, including:

- 💻 Desktop computers
- 💻 Laptops
- 📱 Smartphones
- 📲 Tablets

The Sudoku board and controls automatically adapt to smaller screens.

---

## 🛠️ Technologies

Visual Sudoku is built using web technologies without external frameworks.

- **HTML5** — Page structure
- **CSS3** — Styling, responsive design, and dark mode
- **JavaScript (ES6+)** — Game logic and interaction
- **LocalStorage** — Saving appearance preferences
- **SessionStorage** — Passing game settings from the menu to the game

No backend or database is required.

---

## 📂 Project Structure

```text
Visual-Sudoku/
│
├── index.html
├── game.html
│
├── css/
│   ├── menu.css
│   └── style.css
│
├── js/
│   ├── sudoku.js
│   ├── themes.js
│   ├── game.js
│   ├── app.js
│   └── menu.js
│
└── README.md
