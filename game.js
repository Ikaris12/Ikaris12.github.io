const config = {
  type: Phaser.AUTO,
  width: 400,
  height: 600,
  backgroundColor: '#1d1d1d',
  physics: { default: 'arcade' },
  scene: { preload, create, update }
};

let logo;

function preload() {
  this.load.image('logo', 'https://labs.phaser.io/assets/sprites/phaser3-logo.png');
}

function create() {
  logo = this.physics.add.image(200, 300, 'logo');
  logo.setVelocity(100, 200);
  logo.setBounce(1, 1);
  logo.setCollideWorldBounds(true);
}

function update() {}

new Phaser.Game(config);
