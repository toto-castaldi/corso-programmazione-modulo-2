let game;

let gameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 400,
    scene: [PlayGame],
    backgroundColor: 0x0c88c7,

    // physics settings
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    }
}
game = new Phaser.Game(gameConfig);