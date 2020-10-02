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
        key : "star",
        repeat : 10,
        setXY : {
            x : 20,
            y : 0,
            stepX : 80
        }
    });
}

function sceneUpdate() {
    keyboard = this.input.keyboard.createCursorKeys();

    //movimento orizzontale 
    if (keyboard.left.isDown) {
        player.setVelocityX(-160);
    } else if (keyboard.right.isDown) {
        player.setVelocityX(+160);
    } else {
        player.setVelocityX(0);
    }

    //salto
    if (keyboard.up.isDown && player.body.touching.down) {
        player.setVelocityY(-400);
    }
}