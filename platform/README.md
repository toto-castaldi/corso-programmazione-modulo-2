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