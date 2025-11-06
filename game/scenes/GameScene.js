const JUMP_FORCE = -400;
const INITIAL_OBJECTIVE = 15;
export class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  preload() {
    this.load.image("player", "game/assets/images/redblack.png");
    this.load.image("ground", "game/assets/images/moonfloor.png");
    this.load.image("gems", "game/assets/images/emerald.png");
    this.load.image("walls", "game/assets/images/prociolois.png");
  }

  create() {
    if (this.currency === undefined)
      this.currency = parseInt(localStorage.getItem("currency")) || 0;
    if (this.score === undefined)
      this.score = parseInt(localStorage.getItem("score")) || 0;
    if (this.level === undefined)
      this.level = parseInt(localStorage.getItem("level")) || 1;
    if (this.objective === undefined)
      this.objective = this.level * INITIAL_OBJECTIVE;
    //===GROUND===
    this.ground = this.add.tileSprite(
      this.scale.width / 2,
      this.scale.height - 32,
      this.scale.width,
      256,
      "ground"
    );
    this.ground.displayHeight = 64;
    this.physics.add.existing(this.ground, true);
    //===PLAYER===
    this.player = this.physics.add.sprite(64, 0, "player");
    this.player.setCollideWorldBounds(true);
    this.player.displayWidth = 80;
    this.player.displayHeight = 64;
    //===GAMEPLAY===
    this.physics.add.collider(this.player, this.ground);
    this.input.on("pointerdown", this.jump, this);
    //===GEMS===
    this.gems = this.physics.add.group();
    this.time.addEvent({
      delay: 3000 + (200 + this.score * 4),
      callback: this.spawnGem,
      callbackScope: this,
      loop: true,
    });
    this.physics.add.overlap(
      this.player,
      this.gems,
      this.collectGem,
      null,
      this
    );
    //===WALLS===
    this.walls = this.physics.add.group();
    const wallDelay = Phaser.Math.Between(3000, 6000) + this.score * 4;
    this.time.addEvent({
      delay: wallDelay,
      callback: this.spawnWall,
      callbackScope: this,
      loop: true,
    });
    this.physics.add.overlap(
      this.player,
      this.walls,
      () => this.gameOver(),
      null,
      this
    );
    //===UI===
    this.initUI();
  }

  update() {
    this.scrollGround();
  }

  initUI() {
    this.scoreText = this.add.text(
      this.scale.width / 4,
      16,
      "Gemme: " + this.score + " /" + this.objective,
      {
        fontSize: "20px",
        fill: "#fff",
      }
    );
    this.levelText = this.add.text(
      (this.scale.width * 3) / 4,
      16,
      "Livello: " + this.level,
      {
        fontSize: "20px",
        fill: "#fff",
      }
    );
  }
  jump() {
    this.player.setVelocityY(JUMP_FORCE);
  }
  scrollGround() {
    this.ground.tilePositionX += 2 + Math.floor(this.score / 30);
  }
  spawnGem() {
    const y = Phaser.Math.Between(64, this.scale.height - 64);
    for (let i = 0; i < 3; i++) {
      const gem = this.gems.create(
        this.player.x + this.scale.width + i * 100,
        y,
        "gems"
      );
      gem.displayWidth = 30;
      gem.displayHeight = 25;
      gem.setVelocityX(-200 - this.score * 4);
      gem.setGravityY(-800);
    }
  }

  spawnWall() {
    if (this.score > 19) {
      const wallY = Phaser.Math.Between(88, this.scale.height - 88);
      const wall = this.walls.create(this.scale.width + 200, wallY, "walls");
      wall.displayWidth = 140;
      wall.displayHeight = 176;
      wall.setVelocityX(-200 - this.score * 4);
      wall.setGravityY(-800);
    }
  }

  collectGem(gem) {
    gem.destroy();
    this.score += 1;
    this.scoreText.setText("Gemme: " + this.score + " /" + this.objective);
    this.currency += 1 * this.level;
    if (this.score >= this.objective) {
      this.level++;
      localStorage.setItem("level", this.level);
      this.score = 0;
      this.objective = 15 * this.level;
      this.currency += 10 * this.level;
      this.scoreText.setColor("#c8c02a");
      this.scene.start("StageCompleteScene");
    }
    localStorage.setItem("currency", this.currency);
    localStorage.setItem("score", this.score);
  }

  gameOver() {
    this.physics.pause();
    this.player.setTint(0xff0000);

    const bg = this.add
      .rectangle(
        this.scale.width / 2,
        this.scale.height / 2,
        this.scale.width,
        this.scale.height,
        0x000000
      )
      .setDepth(10);

    this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2 - 50,
        `Hai perso!\nPunteggio:\n${this.score}`,
        { fontSize: "32px", fill: "#ffffff", align: "center" }
      )
      .setOrigin(0.5)
      .setDepth(11);

    const restartText = this.add
      .text(this.scale.width / 2, this.scale.height / 2 + 100, "Ricomincia", {
        fontSize: "28px",
        fill: "#00ff00",
        backgroundColor: "#222",
      })
      .setOrigin(0.5)
      .setPadding(10)
      .setInteractive({ useHandCursor: true })
      .setDepth(11);

    restartText.on("pointerdown", () => this.scene.restart());
  }
}
