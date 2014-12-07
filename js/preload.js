LD31.Preload = function(game) {
    this.game = game;
};
LD31.Preload.prototype = {

    preload: function() {
        console.log("Preload: preload()");
        // Load sprites
        this.load.image('background', 'img/back.png');
        this.load.spritesheet("scenery", "img/scenery.png", 16, 16, 16);
        this.load.spritesheet("snowman", "img/snowman.png", 32, 32, 16);
        this.load.spritesheet("dragon",  "img/dragon.png",  32, 32, 8);
        this.load.spritesheet("dragonbreath",  "img/dragon.png",  32, 16, 32);
        // Load audio
        this.load.audio("fire", "snd/fire.wav");
        this.load.audio("hurt", "snd/hurt.wav");
        this.load.audio("ballhit", "snd/ballhit.wav");
        this.load.audio("sheepcandy", "snd/bu-sheep-of-a-candy.ogg");
        // Font
        this.load.image("myfont", "img/bitmapfont.png");
    },

    create: function() {
        this.state.start("Game");
    }

};