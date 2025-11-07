export class CandyTrash extends Phaser.Scene {
  constructor() {
    super("CandyTrash");
    this.rows = 8;
    this.cols = 8;
    this.tileSize = 64;
    this.colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff];
    this.grid = [];
    this.selectedTile = null;
    this.matchLength = 3; // valore attivo (salvato)
    this.tempMatchLength = 3; // valore dello slider in anteprima
    this.score = 0;
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

    // barra base
    const bar = this.add
      .rectangle(sliderX, sliderY, 150, 6, 0x888888)
      .setOrigin(0, 0.5);

    // cursore
    const handle = this.add
      .circle(sliderX, sliderY, 10, 0xffffff)
      .setInteractive({ draggable: true });
    this.sliderHandle = handle;

    // simbolo che mostra il valore confermato
    this.savedIndicator = this.add
      .circle(sliderX, sliderY, 6, 0x00ff00)
      .setOrigin(0.5);

    // testo valore
    this.sliderText = this.add.text(
      sliderX + 170,
      sliderY - 10,
      this.tempMatchLength.toString(),
      { fontSize: "18px", color: "#fff" }
    );

    // limiti slider
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
    });

    // pulsante conferma
    const confirmBtn = this.add
      .text(sliderX + 200, sliderY - 15, "Conferma (-5)", {
        fontSize: "14px",
        color: "#0ff",
        backgroundColor: "#333",
        padding: { x: 6, y: 4 },
      })
      .setInteractive()
      .on("pointerdown", () => this.confirmMatchLength());

    // testi informativi
    this.scoreText = this.add.text(20, 70, "Punteggio: 0", {
      fontSize: "18px",
      color: "#fff",
    });
    this.infoText = this.add.text(20, 95, "", {
      fontSize: "14px",
      color: "#aaa",
    });
    this.updateInfoText();
  }

  updateInfoText() {
    this.infoText.setText(
      `Match attivo: ${this.matchLength} | Slider: ${this.tempMatchLength} | +${
        (this.tempMatchLength - 2) * 10
      }pt`
    );
  }

  confirmMatchLength() {
    if (this.score >= 5) {
      this.score -= 5;
      this.matchLength = this.tempMatchLength;
      this.savedIndicator.x = this.sliderHandle.x;
      this.savedIndicator.fillColor = 0x00ff00;
      this.updateScore();
      this.updateInfoText();
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
    const offsetY = 130;
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

  // ---------- RIMOZIONE + CADUTA ----------
  removeMatched(matched) {
    // Sostituisce i tile eliminati con "vuoti"
    matched.forEach((tile) => (tile.color = null));

    // per ogni colonna, fa "cadere" i blocchi
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
            duration: 200,
            onComplete: () => {
              tile.row += emptySpots;
            },
          });
          this.grid[row + emptySpots][col] = tile;
          this.grid[row][col] = { color: null };
        }
      }

      // genera nuovi tile in cima
      for (let i = 0; i < emptySpots; i++) {
        const color = Phaser.Utils.Array.GetRandom(this.colors);
        const x = col * this.tileSize + this.tileSize / 2;
        const y = -i * this.tileSize + 130 + this.tileSize / 2;
        const tile = this.add
          .rectangle(x, y, this.tileSize - 4, this.tileSize - 4, color)
          .setOrigin(0.5);
        tile.color = color;
        tile.row = i;
        tile.col = col;
        tile.setInteractive();

        this.grid[i][col] = tile;

        // animazione di caduta
        this.tweens.add({
          targets: tile,
          y: i * this.tileSize + this.tileSize / 2 + 130,
          duration: 250,
        });
      }
    }

    // dopo le animazioni, controlla nuovi match
    this.time.delayedCall(350, () => this.checkMatches());
  }
}
