import { CandyGrid } from "./CandyGrid";
export class CandyTrash extends Phaser.Scene {
  constructor() {
    super("CandyTrash");
    this.gridManager = null;
    this.selectedTile = null;
    this.matchLength = 3;
    this.tempMatchLength = 3;
    this.score = 0;
    this.changeCost = 100;
  }

  preload() {
    this.load.image("green_gem", "game/assets/images/green_gem/green_gem1.png");
  }

  create() {
    this.gridManager = new CandyGrid(this); // passi la scena
    this.gridManager.createGrid();
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

    this.sliderHandle = this.add
      .circle(sliderX, sliderY, 10, 0xffffff)
      .setInteractive({ draggable: true });
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
    this.input.setDraggable(this.sliderHandle);
    this.sliderHandle.on("drag", (pointer, dragX) => {
      dragX = Phaser.Math.Clamp(dragX, minX, maxX);
      this.sliderHandle.x = dragX;
      const t = (dragX - minX) / (maxX - minX);
      this.tempMatchLength = Math.round(3 + t * 2);
      this.sliderText.setText(this.tempMatchLength.toString());
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

  // ---------- GRID ----------

  selectTile(pointer, tile) {
    const targetScale =
      tile.texture && tile.texture.key === "green_gem" ? 0.8 : 0.85;

    if (this.selectedTile === tile) {
      this.tweens.add({ targets: tile, scale: 1, duration: 100 });
      this.selectedTile = null;
      return;
    }

    if (!this.selectedTile) {
      this.selectedTile = tile;
      this.tweens.add({ targets: tile, scale: targetScale, duration: 100 });
    } else if (this.areAdjacent(this.selectedTile, tile)) {
      this.swapTilesAnimated(this.selectedTile, tile);
      this.tweens.add({ targets: this.selectedTile, scale: 1, duration: 100 });
      this.selectedTile = null;
    } else {
      this.tweens.add({ targets: this.selectedTile, scale: 1, duration: 100 });
      this.selectedTile = tile;
      this.tweens.add({ targets: tile, scale: targetScale, duration: 100 });
    }
  }

  areAdjacent(a, b) {
    const dx = Math.abs(a.col - b.col);
    const dy = Math.abs(a.row - b.row);
    return dx + dy === 1;
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
