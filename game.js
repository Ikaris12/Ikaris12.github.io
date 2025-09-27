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
  backgroundColor: '#200446',
  scene: { preload, create, update }
};

let player;
let ground;
let cursors;
let gems;
let score = 0;
let scoreText;
let walls;

function preload() {
  //Assets
  this.load.image('player','assets/images/redblack.png');
  this.load.image('ground','assets/images/moonfloor.png');
  this.load.image('gems','assets/images/emerald.png');
  this.load.image('walls','assets/images/prociolois.png');
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

  //ostacoli
  walls = this.physics.add.group();

  // Spawn gemme
  this.time.addEvent({
    delay: 3000 + (200+(score*4)),
    callback: spawnGem,
    callbackScope: this,
    loop: true
  });
  //spawn ostacoli
  const wallDelay = Phaser.Math.Between(3000, 6000)+(score*4);
   this.time.addEvent({
    delay: wallDelay,
    callback: spawnWall,
    callbackScope: this,
    loop: true
  });

  // Punteggio
  scoreText = this.add.text(this.scale.width/2, 16, 'Gemme: 0 /50', { fontSize: '20px', fill: '#fff' });

  // Collisione giocatore-monete
  this.physics.add.overlap(player, gems, collectGem, null, this);

  // Collisione giocatore-muro
  this.physics.add.overlap(player, walls, (player, wall) => {
    gameOver(this);
  }, null, this);
}

function update() {
  //pavimento
  ground.tilePositionX += 2+Math.floor(score/30); // scorre il pavimento
}

function jump() {
    player.setVelocityY(-400);
}

function spawnGem() {
  // Spawna una moneta davanti al player
  const y = Phaser.Math.Between(64, this.scale.height-64);
  for(let i=0; i<3; i++){
  const gem = gems.create(player.x +this.scale.width+(i*100), y, 'gems');
  gem.displayWidth = 30;
  gem.displayHeight = 25;
  gem.setVelocityX(-200 - (score*4)); // si muove verso sinistra
  gem.setCollideWorldBounds(false);
  gem.setGravityY(-800); // niente gravità
  }
}

  function spawnWall() {
    //Spawna i muri
    if(score>19)
    {
    const wallY = Phaser.Math.Between(88, this.scale.height-88);
    const wall = walls.create(this.scale.width+200,wallY,'walls');
    wall.displayWidth = 140;
    wall.displayHeight = 176;
    wall.setVelocityX(-200 - (score*4));
    wall.setCollideWorldBounds(false);
    wall.setGravityY(-800); // niente gravità
    }

  }

function collectGem(player, gem) {
  gem.destroy();
  score += 1;
  scoreText.setText('Gemme: ' + score +' /50');
  if(score>49)
  {
    scoreText.setColor('#c8c02a');
  }
}

function gameOver(scene) {
  // ferma input e movimento
  scene.physics.pause();
  player.setTint(0xff0000); // effetto rosso al player (opzionale)

  // sfondo nero
  const bg = scene.add.rectangle(
    scene.scale.width / 2,
    scene.scale.height / 2,
    scene.scale.width,
    scene.scale.height,
    0x000000
  );
  bg.setScrollFactor(0);
  bg.setDepth(10);

  // testo "hai perso"
  let textColor = '#ffffff';
  if(score>49)
  {
    textColor = '#c8c02a';
  }
  const gameOverText = scene.add.text(
    scene.scale.width / 2,
    scene.scale.height / 2 - 50,
    `Hai perso!\nPunteggio:\n${score}`,
    {
      fontSize: '32px',
      fill: textColor,
      align: 'center'
    }
  ).setOrigin(0.5);
  
  gameOverText.setDepth(11);

  // pulsante restart
  const restartText = scene.add.text(
    scene.scale.width / 2,
    scene.scale.height / 2 + 100,
    'Ricomincia',
    {
      fontSize: '28px',
      fill: '#00ff00',
      backgroundColor: '#222'
    }
  ).setOrigin(0.5).setPadding(10);
  restartText.setDepth(11);
  restartText.setInteractive({ useHandCursor: true });

  restartText.on('pointerdown', () => {
    score = 0; // reset punteggio
    scene.scene.restart(); // riavvia la scena
  });
}


new Phaser.Game(config);
