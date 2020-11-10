class Level3 extends Level1 {

    constructor() {
        super({
            key: "level3"
        });
    }

    createPlatform() {
        this.platforms.create(200, 584, "platform");
        this.platforms.create(600, 584, "platform");
    }

    lastLevel() {
        return true;
    }

}