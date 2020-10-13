let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [Level0, Level1],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    }
};



let playSound = true;
let platforms;
let stars;
let player;
let game = new Phaser.Game(config);
let cursors;
let score = 0;
let scoreText;
let bombs;
let levelMusic;
let deltaSum = 0;
let gameOver = false;