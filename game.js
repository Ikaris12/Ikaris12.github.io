import { TitleScene } from "./game/scenes/TitleScene.js";
import { GameScene } from "./game/scenes/GameScene.js";
import { StageCompleteScene } from "./game/scenes/StageCompleteScene.js";
import { CandyTrash } from "./game/scenes/CandyTrash/GameScene_CT.js";
import { GameFestSpecial } from "./game/scenes/GameFestSpecial/GameScene_GFS.js";
const config = {
  type: Phaser.AUTO,
  //pixelArt: true,
  physics: {
    default: "arcade",
    arcade: { gravity: { y: 800 }, debug: false },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: window.innerWidth,
    height: window.innerHeight,
  },
  backgroundColor: "#200446",
  scene: [
    TitleScene,
    GameScene,
    StageCompleteScene,
    CandyTrash,
    GameFestSpecial,
  ],
};

new Phaser.Game(config);
