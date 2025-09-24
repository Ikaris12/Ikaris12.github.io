const config = {
  type: Phaser.AUTO,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 800 },
      debug: false
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,         // scala mantenendo proporzioni
    autoCenter: Phaser.Scale.CENTER_BOTH, // centra il canvas
    width: window.innerWidth,       // larghezza del device
    height: window.innerHeight      // altezza del device
  },
  backgroundColor: '#FFFF00',
  scene: { preload, create, update }
};

let player;
let ground;
let cursors;
let gems;
let score = 0;
let scoreText;

function preload() {
  // Creiamo semplici texture al volo
  
  this.load.image('player','assets/images/redblack.png');
  this.load.image('ground','assets/images/moonfloor.png');
  this.load.image('gems','assets/images/emerald.png');
}

function create() {
  // Piattaforme
  ground = this.add.tileSprite(
    this.scale.width/2, 
    this.scale.height-32, 
    this.scale.width, 
    256,
    'ground'
  );

  ground.displayHeight = 64;
  this.physics.add.existing(ground, true); // true = static body

  // Giocatore
  player = this.physics.add.sprite(64, 0, 'player');
  player.setCollideWorldBounds(true);
  player.displayWidth = 80;
  player.displayHeight = 64;

  // Collisione con piattaforme
  this.physics.add.collider(player, ground);

  // Input
  this.input.on('pointerdown', jump, this);

  // Monete
  gems = this.physics.add.group();

  // Spawn monete periodico
  this.time.addEvent({
    delay: 1500,
    callback: spawnGem,
    callbackScope: this,
    loop: true
  });

  // Punteggio
  scoreText = this.add.text(16, 16, 'Monete: 0', { fontSize: '20px', fill: '#fff' });

  // Collisione giocatore-monete
  this.physics.add.overlap(player, gems, collectGem, null, this);
}

function update() {
  //pavimento
  ground.tilePositionX += 2; // scorre il pavimento
}

function jump() {
    player.setVelocityY(-400);
}

function spawnGem() {
  // Spawna una moneta davanti al player
  const y = Phaser.Math.Between(200, 700);
  for(let i=0; i<3; i++){
  const gem = gem.create(player.x + 600+(i*100), y, 'gems');
  gem.displayWidth = 60;
  gem.displayHeight = 51;
  gem.setVelocityX(-200); // si muove verso sinistra
  gem.setCollideWorldBounds(false);
  gem.setGravityY(-800); // niente gravità
  }

}

function collectGem(player, gem) {
  gem.destroy();
  score += 1;
  scoreText.setText('Gemme: ' + score);
}

new Phaser.Game(config);
