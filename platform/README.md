PLATFORM
========

## Setup

```html
<script src="//cdn.jsdelivr.net/npm/phaser@3.24.1/dist/phaser.js"></script>
<script src="sketch.js"></script>
```

## Canvas

Riferimento da [making-your-first-phaser-3-game/part1](http://phaser.io/tutorials/making-your-first-phaser-3-game/part1)

```javascript
let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game = new Phaser.Game(config);

function preload() {
}

function create() {
}

function update() {
}
```

## Caricamento risorse

https://drive.google.com/drive/folders/13rurxLqjFmbapZ43p32UBWVKh1JnYna0?usp=sharing

```javascript
//in preload. immagini
this.load.image("sky", "assets/sky.png");
this.load.image("ground", "assets/platform.png");
this.load.image("star", "assets/star.png");
this.load.image("bomb", "assets/bomb.png");

//in preload. sprite
this.load.spritesheet("dude", "assets/dude.png", { frameWidth: 32, frameHeight: 48 });
```

### Mostrare un'immagine

```javascript
//in create
this.add.image(400, 300, "sky");
this.add.image(400, 300, "star");
```

### Aggiungere le piattaforme

```javascript
//in config
physics: {
    default: 'arcade',
    arcade: {
        gravity: { y: 300 },
        debug: true
    }
}

//create function
let platforms;

function create() {
    this.add.image(400, 300, "sky");

    platforms = this.physics.add.staticGroup();

    platforms.create(200, 584, "ground");
    platforms.create(600, 584, "ground");
    platforms.create(600, 400, "ground");
    platforms.create(50, 250, "ground");
    platforms.create(750, 220, "ground");
}

```

### Aggiungere giocatore

```javascript

let player;

//in create
player = this.physics.add.sprite(100, 450, "dude");
```

### Rimbalzo sul suolo

```javascript
//in create    
player.setCollideWorldBounds(true);
```

### Rimbalzo sulle piattaforme

```javascript
//in create
player.setBounce(0.2);
this.physics.add.collider(player, platforms);
```

### Muovere il giocatore

```javascript
let cursors;

function update() {
    cursors = this.input.keyboard.createCursorKeys();

    if (cursors.left.isDown) {
        player.setVelocityX(-160);
   }
    else if (cursors.right.isDown) {
        player.setVelocityX(160);
    }
    else {
        player.setVelocityX(0);
    }

    if (cursors.up.isDown) {
        player.setVelocityY(-330);
    }
}
```

### Non far 'volare' il giocatore

```javascript
if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
}
```

### Arrivare sulle piattaforme

```javascript
player.setVelocityY(-400);
```

### Animare il giocatore

```javascript
//in create
this.anims.create({
    key: "left",
    frames: [{key : "dude", frame : 0},{key : "dude", frame : 1},{key : "dude", frame : 2},{key : "dude", frame : 3}],
    frameRate: 10
});

this.anims.create({
    key: "turn",
    frames: [ { key: 'dude', frame: 4 } ],
    frameRate: 20
});

this.anims.create({
    key: "right",
    frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
    frameRate: 10
});


//update
function update() {
    cursors = this.input.keyboard.createCursorKeys();

    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        // true -> ignoreIfPlaying
        player.anims.play("left", true);
    }
    else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play("right", true);
    }
    else {
        player.setVelocityX(0);
        player.anims.play("turn");
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    }
    
}

```


### Aggiungere le stelle

```javascript

//in create
stars = this.physics.add.group({
    key: "star",
    repeat: 11,
    setXY: { x: 12, y: 0, stepX: 70 }
});

```

### Le stelle non cadono

```javascript
//in create
this.physics.add.collider(stars, platforms);
```

### Le stelle rimbalzano

```javascript
//in create
stars.children.iterate(function (star) {
    star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
});
```

### Prendere le stelle

```javascript

function collectStar(player, star) {
    //disableGameObject, hideGameObject
    star.disableBody(true, true);
}

//in create
this.physics.add.overlap(player, stars, collectStar);
```

### Il punteggio

```javascript

let score = 0;
let scoreText;

//in create
scoreText = this.add.text(16, 16, "score: 0", { fontSize: "32px", fill: "black" });


function collectStar(player, star) {
    star.disableBody(true, true);

    score += 10;
    scoreText.setText("Score: " + score);
}
```

### Quando prendo tutte le stelle appare una bomba

```javascript
let bombs;


//in create
bombs = this.physics.add.group();
this.physics.add.collider(bombs, platforms);


//in collectStar
//Counts the number of active (or inactive) group members
if (stars.countActive(true) === 0) {
    stars.children.iterate(function (star) {
        star.enableBody(true, star.x, 0, true, true);
    });

    let x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

    let bomb = bombs.create(x, 16, 'bomb');
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

}

```

### Finire il gioco quando tocco una bomba


Un colore RGB in intero https://www.checkyourmath.com/convert/color/rgb_decimal.php


```javascript

//in create
//null -> callback di validazione prima di hitBomb
//this -> contesto di esecuzione
this.physics.add.collider(player, bombs, hitBomb, null, this);

function hitBomb(player, bomb) {
    this.physics.pause();

    player.setTint(16711680);

}

```

### No debug

```javascript

debug: false

```
### Carica e riproduci un suono

```javascript
//in create
this.load.audio("coin", "assets/coin.wav");

//in collectStar
this.sound.play("coin");

```