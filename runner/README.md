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

https://drive.google.com/drive/folders/13rurxLqjFmbapZ43p32UBWVKh1JnYna0?usp=sharing

```javascript
//preload
this.load.image("platform", "assets/platform.png");
this.load.spritesheet("player", "assets/dude.png", { frameWidth: 32, frameHeight: 48 });
```

### Piattaforme

```javascript
//create

// le piattaforme attive
this.platformGroup = this.add.group({

    // quando una piattaforma viene rimossa si mette nella scorta
    removeCallback: function (platform) {
        platform.scene.platformPool.add(platform)
    }
});

this.platformPool = this.add.group({

    removeCallback: function (platform) {
        platform.scene.platformGroup.add(platform)
    }
});

//game.config.width e game.config.height
this.addPlatform(game.config.width, game.config.width / 2, game.config.height);
```

```javascript
addPlatform(platformWidth, posX, posY) {
    if (this.platformPool.getLength() > 0) {
        let platform = this.platformPool.getFirst();
        platform.x = posX;
        platform.y = posY;
        platform.active = true;
        platform.visible = true;
        this.platformPool.remove(platform);
        platform.displayWidth = platformWidth;
    } else {
        let platform = this.add.tileSprite(posX, posY, platformWidth, 32, "platform");
        this.physics.add.existing(platform);
        platform.body.setImmovable(true);
        platform.body.setVelocityX(gameOptions.platformSpeedRange * -1);
        this.platformGroup.add(platform);
    }
    this.nextPlatformDistance = Phaser.Math.Between(gameOptions.spawnRange[0], gameOptions.spawnRange[1]);
}
```

```javascript
update() {
    // recycling platforms
    let minDistance = game.config.width;
    let rightmostPlatformHeight = 0;
    
    this.platformGroup.getChildren().forEach(function (platform) {
        let platformDistance = game.config.width - platform.x - platform.displayWidth / 2;
        if (platformDistance < minDistance) {
            minDistance = platformDistance;
            rightmostPlatformHeight = platform.y;
        }
        if (platform.x < - platform.displayWidth / 2) {
            this.platformGroup.killAndHide(platform);
            this.platformGroup.remove(platform);
        }
    }, this);


    // adding new platforms
    if (minDistance > this.nextPlatformDistance) {
        let nextPlatformWidth = Phaser.Math.Between(gameOptions.platformSizeRange[0], gameOptions.platformSizeRange[1]);
        let platformRandomHeight = gameOptions.platformHeighScale * Phaser.Math.Between(gameOptions.platformHeightRange[0], gameOptions.platformHeightRange[1]);
        let nextPlatformGap = rightmostPlatformHeight + platformRandomHeight;
        let minPlatformHeight = game.config.height * gameOptions.platformVerticalLimit[0];
        let maxPlatformHeight = game.config.height * gameOptions.platformVerticalLimit[1];
        let nextPlatformHeight = Phaser.Math.Clamp(nextPlatformGap, minPlatformHeight, maxPlatformHeight);
        this.addPlatform(nextPlatformWidth, game.config.width + nextPlatformWidth / 2, nextPlatformHeight);
    }
}
```

