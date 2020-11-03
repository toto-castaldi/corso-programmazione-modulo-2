RUNNER
======

## Setup

```html
<script src="//cdn.jsdelivr.net/npm/phaser@3.24.1/dist/phaser.js"></script>
<script src="sketch.js"></script>
<script src="playScene.js"></script>
```

## Canvas


```javascript
let game;

let gameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 400,
    scene: [playGame],
    backgroundColor: 0x0c88c7,

    // physics settings
    physics: {
        default: 'arcade',
        arcade: {
            //gravity: { y: 300 },
            debug: true
        }
    }
}
game = new Phaser.Game(gameConfig);

```

## Caricamento risorse

```javascript
//preload
this.load.image("platform", "assets/platform.png");
this.load.spritesheet("player", "assets/dude.png", { frameWidth: 32, frameHeight: 48 });
```

### Una Piattaforma

```javascript
//update

class playGame extends Phaser.Scene {
    constructor() {
        super("PlayGame");
    }

    preload() {
        this.load.image("platform", "assets/platform.png");
        this.load.spritesheet("player", "assets/dude.png", { frameWidth: 32, frameHeight: 48 });
    }

    create() {
        this.platformGroup = this.add.group();

        let platform = this.add.tileSprite(game.config.width / 2, game.config.height, game.config.width , 40, "platform");
        this.physics.add.existing(platform);
        platform.body.setVelocityX(-50);
        
        
        this.platformGroup.add(platform);

        this.player = this.physics.add.sprite(game.config.width / 2, game.config.height * 0.7, "player");
        this.player.setGravityY(300);
        

        this.physics.add.collider(this.player, this.platformGroup);

    }

   

    update() {
        
    }
}

```

```javascript

    //il player NON trascina la piattaforma
    platform.body.setImmovable(true);
```

```javascript
    //update
    this.player.x = game.config.width / 2;

```

### Gruppi

```javascript

    //create

        this.platformGroup = this.add.group();


```

 ### Iterare su gruppi

 ```javascript

    this.platformGroup.getChildren().forEach(function (platform) {
    
    }, this);

 ```

 ```javascript

    //rimuove e disattiva
    this.platformGroup.killAndHide(platform);
    this.platformGroup.remove(platform);

 ```

### Mouse

```javascript

 this.input.on("pointerdown", this.jump, this);

 ```

 ### Animazione

 ```javascript
        this.anims.create({
            key: "run",
            frames: [{ key: "player", frame: 5 }, { key: "player", frame: 6 }, { key: "player", frame: 7 }, { key: "player", frame: 8 }],
            frameRate: 10,
            repeat: -1
        });


        this.physics.add.collider(this.player, this.platformGroup, () => {
            if (!this.player.anims.isPlaying) {
                this.player.anims.play("run");
            }
        });
```

### Restart

```javascript
 // game over
        if (this.player.y > game.config.height) {
            this.scene.start("PlayGame");
        }
```

### Doppio salto

```javascript
 if (this.player.body.touching.down || (this.playerJumps > 0 && this.playerJumps < 2)) {
            if (this.player.body.touching.down) {
                this.playerJumps = 0;
            }
            this.player.setVelocityY(-300);
            this.playerJumps++;

            // stops animation
            this.player.anims.stop();
        }
```
