export class TitleScene extends Phaser.Scene {
  constructor() {
    super("TitleScene");
  }

  create() {
    this.cameras.main.setBackgroundColor("#000000");

    this.add
      .text(this.scale.width / 2, this.scale.height / 2 - 100, "MOO 'N' RUN", {
        fontSize: "48px",
        fill: "#ffffff",
      })
      .setOrigin(0.5);

    const startButton = this.add
      .text(this.scale.width / 2, this.scale.height / 2 + 20, "INIZIA", {
        fontSize: "36px",
        fill: "#00ff00",
        backgroundColor: "#222",
      })
      .setOrigin(0.5)
      .setPadding(10)
      .setInteractive({ useHandCursor: true });

    startButton.on("pointerdown", () => {
      this.scene.start("GameScene");
    });
  }
}
