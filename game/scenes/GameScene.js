export class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");

    this.score = 0;
    this.ground = null;
    this.gems = null;
    this.walls = null;
    this.scoreText = null;
  }

  preload() {
    this.load.image("player", "../assets/images/redblack.png");
    this.load.image("ground", "../assets/images/moonfloor.png");
    this.load.image("gems", "../assets/images/emerald.png");
    this.load.image("walls", "../assets/images/prociolois.png");
  }

  create() {
    this.ground = this.add.tileSprite(
      this.scale.width / 2,
      this.scale.height - 32,
      this.scale.width,
      256,
      "ground"
    );
    this.ground.displayHeight = 64;
    this.physics.add.existing(ground, true);

    this.player = this.physics.add.sprite(64, 0, "player");
    this.player.setCollideWorldBounds(true);
    this.player.displayWidth = 80;
    this.player.displayHeight = 64;

    this.physics.add.collider(this.player, this.ground);
    this.input.on("pointerdown", this.jump, this);

    gems = this.physics.add.group();
    walls = this.physics.add.group();

    this.time.addEvent({
      delay: 3000 + (200 + score * 4),
      callback: this.spawnGem,
      callbackScope: this,
      loop: true,
    });

    const wallDelay = Phaser.Math.Between(3000, 6000) + score * 4;
    this.time.addEvent({
      delay: wallDelay,
      callback: this.spawnWall,
      callbackScope: this,
      loop: true,
    });

    scoreText = this.add.text(this.scale.width / 2, 16, "Gemme: 0 /50", {
      fontSize: "20px",
      fill: "#fff",
    });

    this.physics.add.overlap(player, gems, this.collectGem, null, this);
    this.physics.add.overlap(player, walls, () => this.gameOver(), null, this);
  }

  update() {
    this.ground.tilePositionX += 2 + Math.floor(score / 30);
  }

  jump() {
    this.player.setVelocityY(-400);
  }

  spawnGem() {
    const y = Phaser.Math.Between(64, this.scale.height - 64);
    for (let i = 0; i < 3; i++) {
      const gem = this.gems.create(
        player.x + this.scale.width + i * 100,
        y,
        "gems"
      );
      gem.displayWidth = 30;
      gem.displayHeight = 25;
      gem.setVelocityX(-200 - score * 4);
      gem.setGravityY(-800);
    }
  }

  spawnWall() {
    if (score > 19) {
      const wallY = Phaser.Math.Between(88, this.scale.height - 88);
      const wall = walls.create(this.scale.width + 200, wallY, "walls");
      wall.displayWidth = 140;
      wall.displayHeight = 176;
      wall.setVelocityX(-200 - score * 4);
      wall.setGravityY(-800);
    }
  }

  collectGem(player, gem) {
    gem.destroy();
    this.score += 1;
    this.scoreText.setText("Gemme: " + this.sscore + " /50");
    if (this.score > 49) scoreText.setColor("#c8c02a");
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

    const textColor = score > 49 ? "#c8c02a" : "#ffffff";

    this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2 - 50,
        `Hai perso!\nPunteggio:\n${score}`,
        { fontSize: "32px", fill: textColor, align: "center" }
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
