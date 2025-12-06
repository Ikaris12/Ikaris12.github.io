import { updateScreenSize } from "../objects/utils/screen.js";
import { W, H, resFontSize } from "../objects/utils/screen.js";
import { reScaleW } from "../objects/utils/screen.js";
export class TitleScene extends Phaser.Scene {
  constructor() {
    super("TitleScene");
  }
  preload() {
    this.load.image(
      "GameFestAdd",
      "game/assets/images/GameFestSpecial/GameFestAdd.png"
    );
    this.load.image("GameLogo", "game/assets/images/game_logo.png");
  }
  create() {
    this.cameras.main.setBackgroundColor("#000000");
    updateScreenSize(this.scale.width, this.scale.height);
    const MoonStartButton = this.add
      .text(W / 2, H / 2 + 20, "Moo 'N' Run", {
        fontSize: resFontSize + "px",
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
      .text(W / 2, H / 2 + 3 * fontSize, "CandyTrash", {
        fontSize: resFontSize + "px",
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
        this.scale.height / 2 + 6 * resFontSize,
        "SPECIALE GAME FEST",
        {
          fontSize: fontSize + "px",
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

    if (this.scale.orientation === "landscape") {
      const GameFestAdd = this.add.image(W - 256, H - 240, "GameFestAdd");
      GameFestAdd.displayWidth = 512;
      GameFestAdd.displayHeight = 480;
    }

    const GameLogo = this.add.image(0, 0, "GameLogo");
    GameLogo.setPosition(W / 2, reScaleW(0.5, GameLogo.width) / 2 + H * 0.3);
    GameLogo.setScale(reScaleW(0.5, GameLogo.width));
  }
}
