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
            debug: true
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

function scenePreload() {
    console.log("preload");
    this.load.image("bomb", "assets/bomb.png");
    this.load.image("platform", "assets/platform.png");
    this.load.image("sky", "assets/sky.png");
    this.load.image("star", "assets/star.png");

    this.load.spritesheet("dude", "assets/dude.png", { frameWidth: 32, frameHeight: 48 });

}

function sceneCreate() {
    console.log("create");

    scoreValue = 0;

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
        s.disableBody(true, true);
        scoreValue += 10;
        scoreText.setText("Score : " + scoreValue);

        

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


}

function sceneUpdate() {
    keyboard = this.input.keyboard.createCursorKeys();

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