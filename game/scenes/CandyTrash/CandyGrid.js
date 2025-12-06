export class CandyGrid {
  constructor(
    scene,
    rows = 8,
    cols = 8,
    tileSize = 64,
    colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff]
  ) {
    this.scene = scene;
    this.rows = rows;
    this.cols = cols;
    this.tileSize = tileSize;
    this.colors = colors;
    this.grid = [];
    this.gridStart = { x: 0, y: 0 };
  }
  /*Crea la griglia */
  createGrid() {
    const offsetY = 160;
    const gridWidth = this.cols * this.tileSize;
    const gridHeight = this.rows * this.tileSize;
    const startX = (this.scene.sys.game.config.width - gridWidth) / 2;
    const startY =
      (this.scene.sys.game.config.height - gridHeight) / 2 + offsetY / 2;
    this.gridStart = { x: startX, y: startY };
    for (let row = 0; row < this.rows; row++) {
      this.grid[row] = [];
      for (let col = 0; col < this.cols; col++) {
        const color = Phaser.Utils.Array.GetRandom(this.colors);
        this.grid[row][col] = this.createTile(color, row, col);
      }
    }
  }
  /*Crea un elemento della griglia */
  createTile(color, row, col) {
    const x = this.gridStart.x + col * this.tileSize + this.tileSize / 2;
    const y = this.gridStart.y + row * this.tileSize + this.tileSize / 2;

    let tile;
    if (color === 0x00ff00) {
      tile = this.scene.add
        .image(x, y, "green_gem")
        .setDisplaySize(this.tileSize - 8, this.tileSize - 8);
    } else if (color === 0xff0000) {
      tile = this.scene.add
        .image(x, y, "green_gem")
        .setDisplaySize(this.tileSize - 8, this.tileSize - 8);
      tile.setTintFill(0xff000060);
    } else {
      tile = this.scene.add
        .rectangle(x, y, this.tileSize - 4, this.tileSize - 4, color)
        .setOrigin(0.5);
    }

    tile.row = row;
    tile.col = col;
    tile.color = color;
    tile.setInteractive();
    return tile;
  }
  /*Randomizza la griglia se serve */
  randomizeGrid() {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const oldTile = this.grid[row][col];
        oldTile.destroy();
        const color = Phaser.Utils.Array.GetRandom(this.colors);
        this.grid[row][col] = this.createTile(color, row, col);
      }
    }
  }
  /*Animazione di scambio degli elementi */
  swapTilesAnimated(a, b) {
    const tempColor = a.color;
    a.color = b.color;
    b.color = tempColor;

    const tempX = a.x,
      tempY = a.y;
    this.scene.tweens.add({
      targets: a,
      x: b.x,
      y: b.y,
      duration: 150,
      ease: "Sine.easeInOut",
    });
    this.scene.tweens.add({
      targets: b,
      x: tempX,
      y: tempY,
      duration: 150,
      ease: "Sine.easeInOut",
      onComplete: () => {
        const tempRow = a.row,
          tempCol = a.col;
        a.row = b.row;
        a.col = b.col;
        b.row = tempRow;
        b.col = tempCol;
        this.grid[a.row][a.col] = a;
        this.grid[b.row][b.col] = b;
        this.checkMatches();
      },
    });
  }

  // ---------- MATCHING ----------
  checkMatches(initial = false) {
    let matched = new Set();

    // orizzontali
    for (let row = 0; row < this.rows; row++) {
      let chain = [this.grid[row][0]];
      for (let col = 1; col < this.cols; col++) {
        if (this.grid[row][col].color === chain[0].color)
          chain.push(this.grid[row][col]);
        else {
          if (chain.length >= this.matchLength)
            chain.forEach((t) => matched.add(t));
          chain = [this.grid[row][col]];
        }
      }
      if (chain.length >= this.matchLength)
        chain.forEach((t) => matched.add(t));
    }

    // verticali
    for (let col = 0; col < this.cols; col++) {
      let chain = [this.grid[0][col]];
      for (let row = 1; row < this.rows; row++) {
        if (this.grid[row][col].color === chain[0].color)
          chain.push(this.grid[row][col]);
        else {
          if (chain.length >= this.matchLength)
            chain.forEach((t) => matched.add(t));
          chain = [this.grid[row][col]];
        }
      }
      if (chain.length >= this.matchLength)
        chain.forEach((t) => matched.add(t));
    }

    if (matched.size > 0) {
      const gain = matched.size * 10 * (this.matchLength - 2);
      this.score += gain;
      this.updateScore();
      this.updateInfoText();
      this.updateConfirmButtonState();

      // animazione: flash bianco e fade out
      matched.forEach((tile) => {
        this.scene.tweens.add({
          targets: tile,
          fillColor: 0xffffff,
          duration: 100,
          yoyo: true,
        });
      });

      this.scene.tweens.add({
        targets: Array.from(matched),
        alpha: 0,
        duration: 300,
        delay: 100,
        onComplete: () => {
          this.removeMatched(Array.from(matched));
        },
      });
    } else {
      if (!initial) this.scene.checkPossibleMoves();
    }
  }

  // ---------- CADUTA ----------
  removeMatched(matched) {
    matched.forEach((tile) => (tile.color = null));

    for (let col = 0; col < this.cols; col++) {
      let emptySpots = 0;
      for (let row = this.rows - 1; row >= 0; row--) {
        const tile = this.grid[row][col];
        if (tile.color === null) {
          emptySpots++;
        } else if (emptySpots > 0) {
          const targetY = tile.y + emptySpots * this.tileSize;
          this.scene.tweens.add({
            targets: tile,
            y: targetY,
            duration: 250,
            ease: "Sine.easeInOut",
            onComplete: () => (tile.row += emptySpots),
          });
          this.grid[row + emptySpots][col] = tile;
          this.grid[row][col] = { color: null };
        }
      }

      for (let i = 0; i < emptySpots; i++) {
        const color = Phaser.Utils.Array.GetRandom(this.colors);
        const x = this.gridStart.x + col * this.tileSize + this.tileSize / 2;
        const y = this.gridStart.y - i * this.tileSize;
        const tile = this.add
          .rectangle(x, y, this.tileSize - 4, this.tileSize - 4, color)
          .setOrigin(0.5);
        tile.color = color;
        tile.row = i;
        tile.col = col;
        tile.setInteractive();
        this.grid[i][col] = tile;

        this.scene.tweens.add({
          targets: tile,
          y: this.gridStart.y + i * this.tileSize + this.tileSize / 2,
          duration: 300,
          ease: "Sine.easeIn",
        });
      }
    }

    this.time.delayedCall(400, () => this.checkMatches());
  }
}
