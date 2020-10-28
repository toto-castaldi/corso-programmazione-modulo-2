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
let gameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 400,
    scene: [playGame],
    backgroundColor: 0x0c88c7,

    // physics settings
    physics: {
        default: "arcade"
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
    }

   

    update() {
        
    }
}

```

### Gruppi

```javascript

    //creae

        this.platformGroup = this.add.group({

            removeCallback: function (platform) {
                platform.scene.platformPool.add(platform)
            }
        });

        this.platformPool = this.add.group({

            removeCallback: function (platform) {
                platform.scene.platformGroup.add(platform)
            }
        });





```

### Mouse

```javascript

 this.input.on("pointerdown", this.jump, this);

 ```


 ### Iterare su gruppi

 ```javascript

 this.platformGroup.getChildren().forEach(function (platform) {
    
        }, this);

 ```

 ```javascript

                this.platformGroup.killAndHide(platform);
                this.platformGroup.remove(platform);

 ```