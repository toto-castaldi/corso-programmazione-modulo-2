class Level1 extends Phaser.Scene {
 
    constructor() {
        super({
            key: "level1"
        });
 
        this.platforms;
        this.player;
        this.keyboard;
        this.stars;
        this.scoreText;
        this.scoreValue;
        this.bombs;
        this.mKey;
        this.sKey;
        this.playSound;
        this.timePassed;
        this.gameOver;
    }
 
    preload() {
        console.log("preload");
        this.load.image("bomb", "assets/bomb.png");
        this.load.image("platform", "assets/platform.png");
        this.load.image("sky", "assets/sky.png");
        this.load.image("star", "assets/star.png");
 
        this.load.spritesheet("dude", "assets/dude.png", { frameWidth: 32, frameHeight: 48 });
 
        this.load.audio("coin", "assets/coin.wav");
        this.load.audio("gameOver", "assets/game-over.wav");
        this.load.audio("levelMusic", "assets/level.mp3");
    }
 
    hitBomb(player, bomb) {
        this.physics.pause();
        this.player.setTint(11022948);
 
        if (this.playSound) {
            this.sound.play("gameOver");
        }
 
        let levelMusic = this.sound.get("levelMusic");
        if (levelMusic) {
            levelMusic.pause();
        }
 
        this.gameOver = true;
    }
 
    pickStar(p, s) {
        console.log(this.playSound);
        s.disableBody(true, true);
        this.scoreValue += 10;
        this.scoreText.setText("Score : " + this.scoreValue);
 
        this.timePassed = 0;
 
        if (this.playSound) {
            this.sound.play("coin");
        }
 
        if (this.stars.countActive() == 0) {
            if (this.bombs.countActive() > 0) {
                this.scene.start('level2');
            } else {
                this.stars.children.iterate((star) => {
                    star.enableBody(true, star.x, 0, true, true);
                });

                let bomb = this.bombs.create(400, 16, "bomb");
                bomb.setBounce(1);
                bomb.setCollideWorldBounds(true);
                bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
            }
        }
    }
 
    create() {
        console.log("create");
 
        this.scoreValue = 0;
 
        this.gameOver = false;
 
        this.timePassed = 0;
 
        this.playSound = false;
 
        this.add.image(400, 300, "sky");
 
        this.platforms = this.physics.add.staticGroup();
 
        this.platforms.create(100, 300, "platform");
        this.platforms.create(700, 400, "platform");
        this.platforms.create(200, 584, "platform");
        this.platforms.create(600, 584, "platform");
 
        this.player = this.physics.add.sprite(400, 400, "dude");
        this.player.setCollideWorldBounds(true);
 
        this.physics.add.collider(this.player, this.platforms);
        this.player.setBounce(0.3);
 
        this.stars = this.physics.add.group({
            key: "star",
            repeat: 2,
            setXY: {
                x: 400,
                y: 0,
                stepX: 70
            }
        });
 
        this.physics.add.collider(this.stars, this.platforms);
 
        this.stars.children.iterate((star) => {
            star.setBounceY(Phaser.Math.FloatBetween(0.2, 0.5));
        });
 
        this.bombs = this.physics.add.group();
        this.physics.add.collider(this.bombs, this.platforms);
 
        this.physics.add.overlap(this.player, this.stars, this.pickStar, null, this);
 
        this.scoreText = this.add.text(16, 16, "Score : " + this.scoreValue, { fontSize: "32px", fill: "black" });
 
        this.anims.create({
            key: "left",
            frames: [{ key: "dude", frame: 0 }, { key: "dude", frame: 1 }, { key: "dude", frame: 2 }, { key: "dude", frame: 3 }],
            frameRate: 10
        });
 
        this.anims.create({
            key: "right",
            frames: [{ key: "dude", frame: 5 }, { key: "dude", frame: 6 }, { key: "dude", frame: 7 }, { key: "dude", frame: 8 }],
            frameRate: 10
        });
 
        this.anims.create({
            key: "center",
            frames: [{ key: "dude", frame: 4 }],
            frameRate: 20
        });
 
 
        this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
 
        this.keyboard = this.input.keyboard.createCursorKeys();
        this.mKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M); //il tasto M ha codice 77
        this.sKey = this.input.keyboard.addKey(83);
 
        this.mKey.on("up", () => {
            let levelMusic = this.sound.get("levelMusic");
            if (levelMusic != null) {
                if (levelMusic.isPlaying) {
                    levelMusic.pause();
                } else {
                    levelMusic.resume();
                }
            } else {
                this.sound.play("levelMusic");
            }
        });
 
        this.sKey.on("up", () => this.playSound = !this.playSound);
 
    }
 
    update(time, update) {
        this.timePassed += update;
 
        let bombsCount = this.bombs.countActive();
        let timeTarget = 5000;
        if (bombsCount <= 4) {
            timeTarget -= bombsCount * 1000;
        } else {
            timeTarget = 1000;
        }
 
        if (this.timePassed > timeTarget && !this.gameOver) {
            if (this.scoreValue >= 10) {
                this.scoreValue -= 10;
            }
            this.scoreText.setText("Score : " + this.scoreValue);
            this.timePassed = 0;
        }
 
        //movimento orizzontale
        if (this.keyboard.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play("left", true);
        } else if (this.keyboard.right.isDown) {
            this.player.setVelocityX(+160);
            this.player.anims.play("right", true);
        } else {
            this.player.anims.play("center");
            this.player.setVelocityX(0);
        }
 
        //salto
        if (this.keyboard.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-400);
        }
 
        //discesa rapida
        if (this.keyboard.down.isDown) {
            this.player.setVelocityY(400);
        }
    }
 
}