class Level0 extends Phaser.Scene {

    constructor() {
        super({ key: 'level0' });
    }

    preload() {
        this.load.image("sky", "assets/sky.png");
        this.load.image("ground", "assets/platform.png");
        this.load.image("star", "assets/star.png");
        this.load.image("bomb", "assets/bomb.png");
        this.load.spritesheet("dude", "assets/dude.png", { frameWidth: 32, frameHeight: 48 });

        this.load.audio("coin", "assets/coin.wav");
        this.load.audio("game-over", "assets/game-over.wav");
        this.load.audio("level", "assets/level.mp3");
    }

    create() {
        this.sound.play("level", { loop: true });

        this.add.image(400, 300, "sky");

        platforms = this.physics.add.staticGroup();
  
        platforms.create(200, 584, "ground");
        platforms.create(600, 584, "ground");
        platforms.create(600, 400, "ground");
        platforms.create(50, 250, "ground");
        platforms.create(750, 220, "ground");
        

        player = this.physics.add.sprite(100, 450, "dude");

        player.setBounce(0.2);
        player.setCollideWorldBounds(true);

        this.physics.add.collider(player, platforms);

        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "turn",
            frames: [{ key: 'dude', frame: 4 }],
            frameRate: 20
        });

        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        stars = this.physics.add.group({
            key: "star",
            repeat: 2,
            setXY: { x: 10, y: 0, stepX: 300 }
        });

        this.physics.add.collider(stars, platforms);

        stars.children.iterate(function (star) {
            star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        this.physics.add.overlap(player, stars, this.collectStar, null, this);

        scoreText = this.add.text(16, 16, "score: " + score, { fontSize: "32px", fill: "#000" });

        bombs = this.physics.add.group();

        this.physics.add.collider(bombs, platforms);

        this.physics.add.collider(player, bombs, this.hitBomb, null, this);

        let keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);

        keyM.on("up", () => {
            let levelMusic = this.sound.get("level");

            if (levelMusic.isPlaying) {
                console.log("pause");
                levelMusic.pause();
            } else {
                console.log("resume");
                levelMusic.resume();
            }
        });

        let keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

        keyS.on("up", () => {
            playSound = !playSound;
        });
    }

    update(time, delta) {
        deltaSum += delta;

        if (deltaSum > 5000 && !gameOver) {
            deltaSum = 0;
            if (score >= 10) {
                score -= 10;
                scoreText.setText("Score: " + score);
            }
        }

        cursors = this.input.keyboard.createCursorKeys();

        if (cursors.left.isDown) {
            player.setVelocityX(-160);
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
            player.setVelocityY(-400);
        }
        if (cursors.down.isDown) {
            player.setVelocityY(400);
        }
    }

    hitBomb(player, bomb) {
        this.physics.pause();

        player.setTint(16711680);

        player.anims.play("turn");

        if (playSound) {
            this.sound.play("game-over");
        }

        gameOver = true;
    }

    collectStar(player, star) {
        if (playSound) {
            this.sound.play("coin");
        }

        deltaSum = 0;

        star.disableBody(true, true);

        score += 10;
        scoreText.setText("Score: " + score);

        if (stars.countActive(true) === 0) {
            stars.children.iterate(function (star) {
                star.enableBody(true, star.x, 0, true, true);
            });

            let x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

            let bomb = bombs.create(x, 16, 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

            if (bombs.countActive(true) > 2) {
                let levelMusic = this.sound.get("level")
                levelMusic.pause();
                this.scene.start('level1');
            }

        }
    }


}