class Level2 extends Level1 {

    constructor() {
        super({
            key: "level2"
        });
    }

    createPlatform() {
        this.platforms.create(400, 400, "platform");
        this.platforms.create(200, 584, "platform");
        this.platforms.create(600, 584, "platform");
    }

    nextLevel() {
        this.scene.start('level3');
    }

    bombs2NextLevel() {
        return 2;
    }

}