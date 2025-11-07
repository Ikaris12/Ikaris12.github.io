export class CandyTrash extends Phaser.Scene {
  constructor() {
    super("CandyTrash");
    this.rows = 8;
    this.cols = 8;
    this.tileSize = 64;
    this.colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff];
    this.grid = [];
    this.selectedTile = null;
    this.matchLength = 3;
    this.tempMatchLength = 3;
    this.score = 0;
    this.changeCost = 100;
  }

  create() {
    this.createUI();
    this.createGrid();
    this.input.on("gameobjectdown", this.selectTile, this);
  }

  // ---------- UI ----------
  createUI() {
    const sliderX = 100;
    const sliderY = 40;

    this.add.text(20, sliderY - 10, "Match:", {
      fontSize: "18px",
      color: "#fff",
    });

    const bar = this.add
      .rectangle(sliderX, sliderY, 150, 6, 0x888888)
      .setOrigin(0, 0.5);
    const handle = this.add
      .circle(sliderX, sliderY, 10, 0xffffff)
      .setInteractive({ draggable: true });
    this.sliderHandle = handle;

    this.savedIndicator = this.add
      .circle(sliderX, sliderY, 6, 0x00ff00)
      .setOrigin(0.5);
    this.sliderText = this.add.text(
      sliderX + 170,
      sliderY - 10,
      this.tempMatchLength.toString(),
      { fontSize: "18px", color: "#fff" }
    );

    const minX = sliderX;
    const maxX = sliderX + 150;
    this.input.setDraggable(handle);

    handle.on("drag", (pointer, dragX) => {
      dragX = Phaser.Math.Clamp(dragX, minX, maxX);
      handle.x = dragX;
      const t = (dragX - minX) / (maxX - minX);
      const newValue = Math.round(3 + t * 2);
      this.tempMatchLength = newValue;
      this.sliderText.setText(newValue.toString());
      this.updateInfoText();
      this.updateConfirmButtonState();
    });

    this.confirmBtn = this.add
      .text(sliderX + 200, sliderY - 15, `Conferma (-${this.changeCost})`, {
        fontSize: "14px",
        color: "#0ff",
        backgroundColor: "#333",
        padding: { x: 6, y: 4 },
      })
      .setInteractive()
      .on("pointerdown", () => this.confirmMatchLength());

    this.scoreText = this.add.text(20, 70, "Punteggio: 0", {
      fontSize: "18px",
      color: "#fff",
    });
    this.infoText = this.add.text(20, 95, "", {
      fontSize: "14px",
      color: "#aaa",
    });

    this.updateInfoText();
    this.updateConfirmButtonState();
  }

  updateInfoText() {
    this.infoText.setText(
      `Match attivo: ${this.matchLength} | Slider: ${this.tempMatchLength} | +${
        (this.tempMatchLength - 2) * 10
      }pt`
    );
  }

  updateConfirmButtonState() {
    const canBuy =
      this.score >= this.changeCost &&
      this.tempMatchLength !== this.matchLength;
    this.confirmBtn.setAlpha(canBuy ? 1 : 0.3);
    this.confirmBtn.disableInteractive();
    if (canBuy) this.confirmBtn.setInteractive();
  }

  confirmMatchLength() {
    if (
      this.score >= this.changeCost &&
      this.tempMatchLength !== this.matchLength
    ) {
      this.score -= this.changeCost;
      this.matchLength = this.tempMatchLength;
      this.savedIndicator.x = this.sliderHandle.x;
      this.savedIndicator.fillColor = 0x00ff00;
      this.updateScore();
      this.updateInfoText();
      this.updateConfirmButtonState();

      // Randomizza la griglia
      this.randomizeGrid();
    } else {
      this.savedIndicator.fillColor = 0xff0000;
      this.time.delayedCall(
        500,
        () => (this.savedIndicator.fillColor = 0x00ff00)
      );
    }
  }

  updateScore() {
    this.scoreText.setText(`Punteggio: ${this.score}`);
  }

  // ---------- GRIGLIA ----------
  createGrid() {
    const offsetY = 160;
    const gridWidth = this.cols * this.tileSize;
    const gridHeight = this.rows * this.tileSize;
    const startX = (this.sys.game.config.width - gridWidth) / 2;
    const startY = (this.sys.game.config.height - gridHeight) / 2 + offsetY / 2;

    for (let row = 0; row < this.rows; row++) {
      this.grid[row] = [];
      for (let col = 0; col < this.cols; col++) {
        const color = Phaser.Utils.Array.GetRandom(this.colors);
        const x = startX + col * this.tileSize + this.tileSize / 2;
        const y = startY + row * this.tileSize + this.tileSize / 2;
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
    this.gridStart = { x: startX, y: startY };
    this.checkMatches(true);
  }

  randomizeGrid() {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const tile = this.grid[row][col];
        tile.color = Phaser.Utils.Array.GetRandom(this.colors);
        tile.fillColor = tile.color;
      }
    }
    this.checkMatches(true);
  }

  selectTile(pointer, tile) {
    if (this.selectedTile === tile) {
      // Deseleziona
      this.tweens.add({
        targets: tile,
        scale: 1,
        duration: 100,
      });
      this.selectedTile = null;
      return;
    }

    if (!this.selectedTile) {
      this.selectedTile = tile;
      this.tweens.add({
        targets: tile,
        scale: 0.85,
        duration: 100,
      });
    } else if (this.areAdjacent(this.selectedTile, tile)) {
      this.swapTilesAnimated(this.selectedTile, tile);
      this.tweens.add({ targets: this.selectedTile, scale: 1, duration: 100 });
      this.selectedTile = null;
    } else {
      this.tweens.add({ targets: this.selectedTile, scale: 1, duration: 100 });
      this.selectedTile = tile;
      this.tweens.add({ targets: tile, scale: 0.85, duration: 100 });
    }
  }

  areAdjacent(a, b) {
    const dx = Math.abs(a.col - b.col);
    const dy = Math.abs(a.row - b.row);
    return dx + dy === 1;
  }

  swapTilesAnimated(a, b) {
    const tempColor = a.color;
    a.color = b.color;
    b.color = tempColor;

    const tempFill = a.fillColor;
    a.fillColor = b.fillColor;
    b.fillColor = tempFill;

    const tempColorProp = a.color;
    a.color = b.color;
    b.color = tempColorProp;

    const tempX = a.x,
      tempY = a.y;
    this.tweens.add({
      targets: a,
      x: b.x,
      y: b.y,
      duration: 150,
      ease: "Sine.easeInOut",
    });
    this.tweens.add({
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
        this.tweens.add({
          targets: tile,
          fillColor: 0xffffff,
          duration: 100,
          yoyo: true,
        });
      });

      this.tweens.add({
        targets: Array.from(matched),
        alpha: 0,
        duration: 300,
        delay: 100,
        onComplete: () => {
          this.removeMatched(Array.from(matched));
        },
      });
    } else {
      if (!initial) this.checkPossibleMoves();
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
          this.tweens.add({
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

        this.tweens.add({
          targets: tile,
          y: this.gridStart.y + i * this.tileSize + this.tileSize / 2,
          duration: 300,
          ease: "Sine.easeIn",
        });
      }
    }

    this.time.delayedCall(400, () => this.checkMatches());
  }

  // ---------- GAME OVER ----------
  checkPossibleMoves() {
    const canMove = this.hasPossibleMatch();
    if (!canMove) {
      const { width, height } = this.sys.game.config;
      const bg = this.add
        .rectangle(width / 2, height / 2, 300, 100, 0x444444, 0.8)
        .setOrigin(0.5);
      const text = this.add
        .text(width / 2, height / 2, "GAME OVER", {
          fontSize: "48px",
          color: "#ff3333",
        })
        .setOrigin(0.5);
      this.input.removeAllListeners();
      bg.depth = 1000;
      text.depth = 1001;
    }
  }

  hasPossibleMatch() {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const current = this.grid[r][c];
        if (!current || !current.color) continue;

        // prova swap destro
        if (c < this.cols - 1) {
          const right = this.grid[r][c + 1];
          if (this.testSwapForMatch(current, right)) return true;
        }
        // prova swap basso
        if (r < this.rows - 1) {
          const down = this.grid[r + 1][c];
          if (this.testSwapForMatch(current, down)) return true;
        }
      }
    }
    return false;
  }

  testSwapForMatch(a, b) {
    const temp = a.color;
    a.color = b.color;
    b.color = temp;
    const result = this.findAnyMatch();
    a.color = b.color;
    b.color = temp;
    return result;
  }

  findAnyMatch() {
    for (let row = 0; row < this.rows; row++) {
      let chain = [this.grid[row][0]];
      for (let col = 1; col < this.cols; col++) {
        if (this.grid[row][col].color === chain[0].color)
          chain.push(this.grid[row][col]);
        else {
          if (chain.length >= this.matchLength) return true;
          chain = [this.grid[row][col]];
        }
      }
      if (chain.length >= this.matchLength) return true;
    }

    for (let col = 0; col < this.cols; col++) {
      let chain = [this.grid[0][col]];
      for (let row = 1; row < this.rows; row++) {
        if (this.grid[row][col].color === chain[0].color)
          chain.push(this.grid[row][col]);
        else {
          if (chain.length >= this.matchLength) return true;
          chain = [this.grid[row][col]];
        }
      }
      if (chain.length >= this.matchLength) return true;
    }

    return false;
  }
}
