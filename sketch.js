let game = new Phaser.Game({
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: scenePreload,
        create: sceneCreate,
        update: sceneUpdate
    },
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    }
});
let platforms;
let player;
let keyboard;
let stars;
let scoreText;
let scoreValue;
let bombs;
let mKey;
let sKey;
let playSound;
let timePassed;
let gameOver;

function scenePreload() {
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

function sceneCreate() {
    console.log("create");

    //this.sound.play("levelMusic");

    scoreValue = 0;

    gameOver = false;

    timePassed = 0;

    playSound = true;

    this.add.image(400, 300, "sky");

    platforms = this.physics.add.staticGroup();

    platforms.create(100, 300, "platform");
    platforms.create(700, 400, "platform");
    platforms.create(200, 584, "platform");
    platforms.create(600, 584, "platform");

    player = this.physics.add.sprite(400, 400, "dude");
    player.setCollideWorldBounds(true);

    this.physics.add.collider(player, platforms);
    player.setBounce(0.3);

    stars = this.physics.add.group({
        key: "star",
        repeat: 2,
        setXY: {
            x: 20,
            y: 0,
            stepX: 70
        }
    });

    this.physics.add.collider(stars, platforms);

    stars.children.iterate((star) => {
        star.setBounceY(Phaser.Math.FloatBetween(0.2, 0.5));
    });

    bombs = this.physics.add.group();
    this.physics.add.collider(bombs, platforms);

    this.physics.add.overlap(player, stars, (p, s) => {
        console.log(playSound);
        s.disableBody(true, true);
        scoreValue += 10;
        scoreText.setText("Score : " + scoreValue);

        timePassed = 0;

        if (playSound) {
            this.sound.play("coin");
        }

        if (stars.countActive() == 0) {
            stars.children.iterate((star) => {
                star.enableBody(true, star.x, 0, true, true);
            });

            let bomb = bombs.create(400, 16, "bomb");
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        }
    });

    scoreText = this.add.text(16, 16, "Score : " + scoreValue, { fontSize: "32px", fill: "black" });

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


    this.physics.add.collider(player, bombs, hitBomb, null, this);
    keyboard = this.input.keyboard.createCursorKeys();
    mKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M); //il tasto M ha codice 77
    sKey = this.input.keyboard.addKey(83);

    mKey.on("up", () => {
        let levelMusic = this.sound.get("levelMusic");
        if (levelMusic.isPlaying) {
            levelMusic.pause();
        } else {
            levelMusic.resume();
        }
    });

    sKey.on("up", () => playSound = !playSound);
}

function hitBomb(player, bomb) {
    this.physics.pause();
    player.setTint(11022948);

    if (playSound) {
        this.sound.play("gameOver");
    }

    let levelMusic = this.sound.get("levelMusic");
    if (levelMusic) {
        levelMusic.pause();
    }

    gameOver = true;
}

function sceneUpdate(time, update) {
    timePassed += update;

    let bombsCount = bombs.countActive();
    let timeTarget = 5000;
    if (bombsCount <= 4 ) {
        timeTarget -= bombsCount*1000;
    } else {
        timeTarget = 1000;
    }

    if (timePassed > timeTarget && !gameOver) {
        if (scoreValue >= 10) {
            scoreValue -= 10;
        }
        scoreText.setText("Score : " + scoreValue);
        timePassed = 0;
    }

    //movimento orizzontale 
    if (keyboard.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play("left", true);
    } else if (keyboard.right.isDown) {
        player.setVelocityX(+160);
        player.anims.play("right", true);
    } else {
        player.anims.play("center");
        player.setVelocityX(0);
    }

    //salto
    if (keyboard.up.isDown && player.body.touching.down) {
        player.setVelocityY(-400);
    }

    //discesa rapida
    if (keyboard.down.isDown) {
        player.setVelocityY(400);
    }

}