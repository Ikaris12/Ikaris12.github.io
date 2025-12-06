export class TitleScene extends Phaser.Scene {
  constructor() {
    super("TitleScene");
  }
  preload() {
    this.load.image(
      "GameFestAdd",
      "game/assets/images/GameFestSpecial/GameFestAdd.png"
    );
  }
  create() {
    this.cameras.main.setBackgroundColor("#000000");

    this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2 - 100,
        "Silipetto Studios 1001 Games",
        {
          fontSize: "48px",
          fill: "#ffffff",
        }
      )
      .setOrigin(0.5);

    const MoonStartButton = this.add
      .text(this.scale.width / 2, this.scale.height / 2 + 20, "Moo 'N' Run", {
        fontSize: "36px",
        fill: "#00ff00",
        backgroundColor: "#222",
      })
      .setOrigin(0.5)
      .setPadding(10)
      .setInteractive({ useHandCursor: true });

    MoonStartButton.on("pointerdown", () => {
      this.scene.start("GameScene");
    });
    const CandyStartButton = this.add
      .text(this.scale.width / 2, this.scale.height / 2 + 80, "CandyTrash", {
        fontSize: "36px",
        fill: "#00ff00",
        backgroundColor: "#222",
      })
      .setOrigin(0.5)
      .setPadding(10)
      .setInteractive({ useHandCursor: true });

    CandyStartButton.on("pointerdown", () => {
      this.scene.start("CandyTrash");
    });
    const GameFestSpecialButton = this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2 + 160,
        "SPECIALE GAME FEST",
        {
          fontSize: "36px",
          fill: "#00ff00",
          backgroundColor: "#222",
        }
      )
      .setOrigin(0.5)
      .setPadding(10)
      .setInteractive({ useHandCursor: true });

    GameFestSpecialButton.on("pointerdown", () => {
      this.scene.start("GameFestSpecial");
    });
    GameFestAdd = this.add.image(
      this.scale.width - 128,
      this.scale.height - 120,
      "GameFestAdd"
    );
    GameFestAdd.displayWidth = 256;
    GameFestAdd.displayHeight = 240;
  }
}
