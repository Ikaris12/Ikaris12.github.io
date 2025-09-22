const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 400,
  backgroundColor: '#1d1d1d',
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
let platforms;
let cursors;
let coins;
let score = 0;
let scoreText;

function preload() {
  // Creiamo semplici texture al volo
  this.textures.generate('player', { data: ['0'], pixelWidth: 32, pixelHeight: 32, palette: { 0: '#00ff00' } });
  this.textures.generate('coin', { data: ['0'], pixelWidth: 16, pixelHeight: 16, palette: { 0: '#ffd700' } });
}

function create() {
  // Piattaforme
  platforms = this.physics.add.staticGroup();
  platforms.create(400, 380, null).setDisplaySize(800, 40).refreshBody();

  // Giocatore
  player = this.physics.add.sprite(100, 300, 'player');
  player.setCollideWorldBounds(true);

  // Collisione con piattaforme
  this.physics.add.collider(player, platforms);

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
  // Il giocatore si muove sempre in avanti
  player.setVelocityX(200);

  // Sposta la "camera" per seguire il giocatore
  this.cameras.main.startFollow(player, true, 0.05, 0.05);
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
