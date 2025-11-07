export class CandyTrash extends Phaser.Scene {
  constructor() {
    super("CandyTrash");
    this.rows = 8;
    this.cols = 8;
    this.tileSize = 64;
    this.colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff]; // rosso, verde, blu, giallo, viola
    this.grid = [];
    this.selectedTile = null;
  }

  create() {
    this.createGrid();
    this.input.on("gameobjectdown", this.selectTile, this);
  }

  createGrid() {
    for (let row = 0; row < this.rows; row++) {
      this.grid[row] = [];
      for (let col = 0; col < this.cols; col++) {
        const color = Phaser.Utils.Array.GetRandom(this.colors);
        const x = col * this.tileSize + this.tileSize / 2;
        const y = row * this.tileSize + this.tileSize / 2;
        const tile = this.add
          .rectangle(x, y, this.tileSize - 4, this.tileSize - 4, color)
          .setOrigin(0.5);
        tile.row = row;
        tile.col = col;
        tile.color = color;
        tile.setInteractive();
        this.grid[row][col] = tile;
      }
    }
    this.checkMatches(true);
  }

  selectTile(pointer, tile) {
    if (!this.selectedTile) {
      this.selectedTile = tile;
      this.tweens.add({
        targets: tile,
        scale: 1.2,
        duration: 100,
        yoyo: true,
      });
    } else if (this.areAdjacent(this.selectedTile, tile)) {
      this.swapTiles(this.selectedTile, tile);
      this.selectedTile = null;
    } else {
      this.selectedTile = tile;
    }
  }

  areAdjacent(a, b) {
    const dx = Math.abs(a.col - b.col);
    const dy = Math.abs(a.row - b.row);
    return dx + dy === 1;
  }

  swapTiles(a, b) {
    const tempColor = a.fillColor;
    a.fillColor = b.fillColor;
    b.fillColor = tempColor;

    const tempColorProp = a.color;
    a.color = b.color;
    b.color = tempColorProp;

    this.checkMatches();
  }

  checkMatches(initial = false) {
    let matched = [];

    // Orizzontali
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols - 2; col++) {
        const c1 = this.grid[row][col];
        const c2 = this.grid[row][col + 1];
        const c3 = this.grid[row][col + 2];
        if (c1.color === c2.color && c1.color === c3.color) {
          matched.push(c1, c2, c3);
        }
      }
    }

    // Verticali
    for (let col = 0; col < this.cols; col++) {
      for (let row = 0; row < this.rows - 2; row++) {
        const c1 = this.grid[row][col];
        const c2 = this.grid[row + 1][col];
        const c3 = this.grid[row + 2][col];
        if (c1.color === c2.color && c1.color === c3.color) {
          matched.push(c1, c2, c3);
        }
      }
    }

    if (matched.length > 0) {
      matched = [...new Set(matched)];
      this.tweens.add({
        targets: matched,
        alpha: 0,
        duration: 200,
        onComplete: () => {
          this.removeMatched(matched);
        },
      });
    } else if (!initial) {
      // nessuna combinazione: reset visivo
      this.time.delayedCall(200, () => {
        this.grid.forEach((row) => row.forEach((tile) => tile.setAlpha(1)));
      });
    }
  }

  removeMatched(matched) {
    matched.forEach((tile) => {
      tile.color = Phaser.Utils.Array.GetRandom(this.colors);
      tile.fillColor = tile.color;
      tile.alpha = 1;
    });
    this.time.delayedCall(300, () => this.checkMatches());
  }
}
