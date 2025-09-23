const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 400,
  backgroundColor: '#180239ff',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 800 },
      debug: false
    }
  },
  scene: { preload, create, update }
};

let player;
let ground;
let cursors;
let coins;
let score = 0;
let scoreText;

function preload() {
  // Creiamo semplici texture al volo
  
  this.textures.generate('coin', { data: ['0'], pixelWidth: 16, pixelHeight: 16, palette: { 0: '#ffd700' } });
  this.load.image('player','assets/images/redblack.png');
  this.load.image('ground','assets/images/moonfloor.png');
}

function create() {
  // Piattaforme
  ground = this.add.tileSprite(
    0, 
    this.scale.height-32, 
    this.scale.width, 
    256,
    'ground'
  );
  ground.displayWidth = 256;
  ground.displayHeight = 64;
  
  this.physics.add.existing(ground, true); // true = static body

  // Giocatore
  player = this.physics.add.sprite(0, 0, 'player');
  player.setCollideWorldBounds(true);
  player.displayWidth = 80;
  player.displayHeight = 64;

  // Collisione con piattaforme
  this.physics.add.collider(player, ground);

  // Input
  this.input.on('pointerdown', jump, this);

  // Monete
  coins = this.physics.add.group();

  // Spawn monete periodico
  this.time.addEvent({
    delay: 1500,
    callback: spawnCoin,
    callbackScope: this,
    loop: true
  });

  // Punteggio
  scoreText = this.add.text(16, 16, 'Monete: 0', { fontSize: '20px', fill: '#fff' });

  // Collisione giocatore-monete
  this.physics.add.overlap(player, coins, collectCoin, null, this);
}

function update() {
  //pavimento
  ground.tilePositionX += 2; // scorre il pavimento
}

function jump() {
  if (player.body.touching.down) {
    player.setVelocityY(-400);
  }
}

function spawnCoin() {
  // Spawna una moneta davanti al player
  const y = Phaser.Math.Between(200, 300);
  const coin = coins.create(player.x + 600, y, 'coin');
  coin.setVelocityX(-200); // si muove verso sinistra
  coin.setCollideWorldBounds(false);
  coin.setGravityY(-800); // niente gravità
}

function collectCoin(player, coin) {
  coin.destroy();
  score += 1;
  scoreText.setText('Monete: ' + score);
}

new Phaser.Game(config);
