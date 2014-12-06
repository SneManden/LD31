LD31.Preload = function(game) {
    this.game = game;
};
LD31.Preload.prototype = {

    preload: function() {
        console.log("Preload: preload()");
        this.load.spritesheet("scenery", "img/scenery.png", 16, 16, 1);
        this.load.spritesheet("snowman", "img/snowman.png", 32, 32, 2);
        this.load.spritesheet("dragon",  "img/dragon.png",  32, 32, 8);
        this.load.spritesheet("dragonbreath",  "img/dragon.png",  32, 16, 32);
    },

    create: function() {
        this.state.start("Game");
    }

};