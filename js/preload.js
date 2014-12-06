LD31.Preload = function(game) {
    this.game = game;
};
LD31.Preload.prototype = {

    preload: function() {
        console.log("Preload: preload()");
        this.load.spritesheet("scenery", "img/scenery.png", 16, 16);
        this.load.spritesheet("snowman", "img/snowman.png", 32, 32);
        this.load.spritesheet("dragon",  "img/dragon.png",  32, 32);
    },

    create: function() {
        this.state.start("Game");
    }

};