class SudokuGenerator {

    constructor() {
        this.solution = [];
        this.puzzle = [];
    }

    generate(difficulty = "medium") {

        // Generate a completely random solved Sudoku quickly
        // by creating a base pattern and shuffling rows/cols/numbers.
        this.solution = this.createSolvedBoard();

        // Create the puzzle from the solution.
        this.puzzle = this.createPuzzle(
            this.solution,
            difficulty
        );

        return {
            solution: this.solution,
            puzzle: this.puzzle
        };
    }


    // =====================================================
    // CREATE SOLVED BOARD (fast, deterministic base + shuffles)
    // =====================================================

    createSolvedBoard() {
        // Base pattern: ensures a valid solved Sudoku
        const pattern = (r, c) => ( (r*3 + Math.floor(r/3) + c) % 9 ) + 1;

        // Start with base board
        let board = Array.from({ length: 9 }, (_, r) =>
            Array.from({ length: 9 }, (_, c) => pattern(r, c))
        );

        // 1) Randomize number mapping (permute digits 1..9)
        const numbers = this.shuffle([1,2,3,4,5,6,7,8,9]);
        board = board.map(row => row.map(v => numbers[v - 1]));

        // 2) Shuffle rows within each 3-row band and shuffle the bands themselves
        board = this.shuffleRows(board);

        // 3) Shuffle columns within each 3-column band and shuffle the bands themselves
        board = this.shuffleCols(board);

        return board;
    }

    // Shuffle rows: first shuffle bands (0-2), then within each band shuffle the 3 rows
    shuffleRows(board) {
        // Build row index list grouped by band
        const bands = [0,1,2];
        const shuffledBandOrder = this.shuffle(bands);

        const newRowOrder = [];

        for (const band of shuffledBandOrder) {
            const start = band * 3;
            const rows = [start, start + 1, start + 2];
            const shuffledRows = this.shuffle(rows);
            newRowOrder.push(...shuffledRows);
        }

        return newRowOrder.map(r => [...board[r]]);
    }

    // Shuffle columns by reordering column indices similarly and rebuilding rows
    shuffleCols(board) {
        const bands = [0,1,2];
        const shuffledBandOrder = this.shuffle(bands);

        const newColOrder = [];

        for (const band of shuffledBandOrder) {
            const start = band * 3;
            const cols = [start, start + 1, start + 2];
            const shuffledCols = this.shuffle(cols);
            newColOrder.push(...shuffledCols);
        }

        // Rebuild board with columns reordered
        return board.map(row => newColOrder.map(c => row[c]));
    }


    // =====================================================
    // ORIGINAL BACKTRACKING FUNCTIONS (kept as fallback)
    // =====================================================

    fillBoard(board) {

        const emptyCell =
            this.findEmptyCell(board);

        if (!emptyCell) {
            return true;
        }

        const [row, col] =
            emptyCell;

        // Randomize the numbers before
        // trying them.
        const numbers = this.shuffle([1,2,3,4,5,6,7,8,9]);

        for (const number of numbers) {

            if (
                this.isValid(
                    board,
                    row,
                    col,
                    number
                )
            ) {

                board[row][col] = number;

                if (
                    this.fillBoard(board)
                ) {
                    return true;
                }

                // Backtracking
                board[row][col] = 0;
            }
        }

        return false;
    }


    // =====================================================
    // FIND EMPTY CELL
    // =====================================================

    findEmptyCell(board) {
        // Return first empty cell (faster deterministic fallback)
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    return [row, col];
                }
            }
        }
        return null;
    }


    // =====================================================
    // CHECK VALIDITY
    // =====================================================

    isValid(
        board,
        row,
        col,
        number
    ) {

        // Check row
        for (let c = 0; c < 9; c++) {
            if (board[row][c] === number) {
                return false;
            }
        }

        // Check column
        for (let r = 0; r < 9; r++) {
            if (board[r][col] === number) {
                return false;
            }
        }

        // Check 3x3 box
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;

        for (let r = boxRow; r < boxRow + 3; r++) {
            for (let c = boxCol; c < boxCol + 3; c++) {
                if (board[r][c] === number) {
                    return false;
                }
            }
        }

        return true;
    }


    // =====================================================
    // CREATE PUZZLE
    // =====================================================

    createPuzzle(
        solution,
        difficulty
    ) {

        const puzzle =
            solution.map(
                row => [...row]
            );

        /*
         * Number of cells removed.
         */
        let cellsToRemove;

        switch (difficulty) {
            case "easy":
                cellsToRemove = 38;
                break;
            case "hard":
                cellsToRemove = 58;
                break;
            case "medium":
            default:
                cellsToRemove = 48;
                break;
        }

        /*
         * Create all 81 positions.
         */
        const positions = [];
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                positions.push({ row: row, col: col });
            }
        }

        const shuffledPositions =
            this.shuffle(positions);

        for (let i = 0; i < cellsToRemove; i++) {
            const position = shuffledPositions[i];
            puzzle[position.row][position.col] = 0;
        }

        return puzzle;
    }


    // =====================================================
    // SHUFFLE
    // =====================================================

    shuffle(array) {
        const result = [...array];
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    }

}
