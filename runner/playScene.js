class PlayGame extends Phaser.Scene {
    constructor() {
        super("PlayGame");
    }

    preload() {
        this.load.image("platform", "assets/platform.png");
        this.load.spritesheet("player", "assets/dude.png", { frameWidth: 32, frameHeight: 48 });
    }

    create() {
        this.platformGroup = this.add.group();

        this.addPlatform(game.config.width / 2, game.config.width);

        this.player = this.physics.add.sprite(game.config.width / 2, game.config.height * 0.7, "player");
        this.player.setGravityY(300);

        this.anims.create({
            key: "run",
            frames: [{ key: "player", frame: 5 }, { key: "player", frame: 6 }, { key: "player", frame: 7 }, { key: "player", frame: 8 }],
            frameRate: 10,
            repeat: -1
        });


        this.physics.add.collider(this.player, this.platformGroup, () => {
            if (!this.player.anims.isPlaying) {
                this.player.anims.play("run");
            }
        });

        this.input.on("pointerdown", this.jump, this);

    }

    jump() {
        if (this.player.body.touching.down || (this.playerJumps > 0 && this.playerJumps < 2)) {
            if (this.player.body.touching.down) {
                this.playerJumps = 0;
            }
            this.player.setVelocityY(-300);
            this.playerJumps++;

            // stops animation
            this.player.anims.stop();
        }
    }

    addPlatform(posX, width) {

        let platform = this.add.tileSprite(posX, game.config.height, width, 40, "platform");
        this.physics.add.existing(platform);
        platform.body.setVelocityX(-100);
        platform.body.setImmovable(true);


        this.platformGroup.add(platform);
    }



    update() {
        if (this.player.y > game.config.height) {
            this.scene.start("PlayGame");
        }

        this.player.x = game.config.width / 2;

        let ultimoEstremo = 0;;

        this.platformGroup.getChildren().forEach(function (platform) {

            let estremoDestro = platform.x + platform.width - platform.width / 2;

            if (estremoDestro < 0) {
                this.platformGroup.killAndHide(platform);
                this.platformGroup.remove(platform);
            }

            if (estremoDestro > ultimoEstremo) {
                ultimoEstremo = estremoDestro;
            }
        }, this);


        if (ultimoEstremo < game.config.width / 2) {
            console.log("nuova");
            this.addPlatform(game.config.width / 2 + 300, 150);
        }

    }
}