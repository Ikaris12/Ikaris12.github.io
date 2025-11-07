export class CandyTrash extends Phaser.Scene {
  constructor() {
    super("CandyTrash");
    this.rows = 8;
    this.cols = 8;
    this.tileSize = 64;
    this.colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff];
    this.grid = [];
    this.selectedTile = null;
    this.matchLength = 3; // valore minimo per la combinazione
  }

  create() {
    this.createGrid();
    this.createSlider();
    this.input.on("gameobjectdown", this.selectTile, this);
  }

  createGrid() {
    const offsetY = 100; // spazio per lo slider
    for (let row = 0; row < this.rows; row++) {
      this.grid[row] = [];
      for (let col = 0; col < this.cols; col++) {
        const color = Phaser.Utils.Array.GetRandom(this.colors);
        const x = col * this.tileSize + this.tileSize / 2;
        const y = row * this.tileSize + this.tileSize / 2 + offsetY;
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

  createSlider() {
    const sliderX = 100;
    const sliderY = 40;

    this.add.text(20, sliderY - 10, "Match:", {
      fontSize: "18px",
      color: "#fff",
    });

    // barra base
    const bar = this.add
      .rectangle(sliderX, sliderY, 150, 6, 0x888888)
      .setOrigin(0, 0.5);

    // cursore
    const handle = this.add
      .circle(sliderX, sliderY, 10, 0xffffff)
      .setInteractive({ draggable: true });
    this.sliderHandle = handle;

    // testo del valore
    this.sliderText = this.add.text(
      sliderX + 170,
      sliderY - 10,
      this.matchLength.toString(),
      { fontSize: "18px", color: "#fff" }
    );

    // limiti in pixel
    const minX = sliderX;
    const maxX = sliderX + 150;

    this.input.setDraggable(handle);

    handle.on("drag", (pointer, dragX) => {
      dragX = Phaser.Math.Clamp(dragX, minX, maxX);
      handle.x = dragX;

      // calcola il valore in base alla posizione
      const t = (dragX - minX) / (maxX - minX);
      const newValue = Math.round(3 + t * 2); // range 3-5
      this.matchLength = newValue;
      this.sliderText.setText(newValue.toString());
    });

    this.add.text(sliderX, sliderY + 20, "← 3", {
      fontSize: "14px",
      color: "#aaa",
    });
    this.add.text(sliderX + 150 - 10, sliderY + 20, "5 →", {
      fontSize: "14px",
      color: "#aaa",
    });
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
    let matched = new Set();

    // --- ORIZZONTALI ---
    for (let row = 0; row < this.rows; row++) {
      let chain = [this.grid[row][0]];
      for (let col = 1; col < this.cols; col++) {
        if (this.grid[row][col].color === chain[0].color) {
          chain.push(this.grid[row][col]);
        } else {
          if (chain.length >= this.matchLength)
            chain.forEach((t) => matched.add(t));
          chain = [this.grid[row][col]];
        }
      }
      if (chain.length >= this.matchLength)
        chain.forEach((t) => matched.add(t));
    }

    // --- VERTICALI ---
    for (let col = 0; col < this.cols; col++) {
      let chain = [this.grid[0][col]];
      for (let row = 1; row < this.rows; row++) {
        if (this.grid[row][col].color === chain[0].color) {
          chain.push(this.grid[row][col]);
        } else {
          if (chain.length >= this.matchLength)
            chain.forEach((t) => matched.add(t));
          chain = [this.grid[row][col]];
        }
      }
      if (chain.length >= this.matchLength)
        chain.forEach((t) => matched.add(t));
    }

    // --- GESTIONE MATCH ---
    if (matched.size > 0) {
      this.tweens.add({
        targets: Array.from(matched),
        alpha: 0,
        duration: 200,
        onComplete: () => {
          this.removeMatched(Array.from(matched));
        },
      });
    } else if (!initial) {
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
