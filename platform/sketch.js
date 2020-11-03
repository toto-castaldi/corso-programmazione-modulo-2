let game = new Phaser.Game({
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [Level1, Level2],
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    }
});
