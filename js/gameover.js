LD31.Gameover = function(game) {
    this.game = game;
};
LD31.Gameover.prototype = {

    preload: function() {
        this.load.spritesheet("button", "img/scenery.png", 32, 16, 4);
    },

    create: function() {
        this.displayGameOver(this.game.score);
    },

    displayGameOver: function(score) {
        this.game.stage.backgroundColor = "#262733";

        var width = this.game.width,
            height = this.game.height,
            pos = {
                x: Math.floor(width/2),
                y: Math.floor(7*height/8)
            }, frames = {
                over: 1,
                out: 2,
                down: 3
            };

        // Add button
        var startbutton = this.game.add.button(pos.x, pos.y, "button",
            this.playAgain, this, frames.over, frames.out, frames.down);
        startbutton.anchor.set(0.5);
        startbutton.scale.setTo(4, 4);
        // Setup Font
        var chars = Phaser.RetroFont.TEXT_SET1;
        var font = this.game.add.retroFont('myfont', 5, 8, chars, 12);
        // (text, multiline, charspacing, linespacing, align, allowlowercase)
        font.setText("Play again", true, 0, 0, "center", true);
        var buttontext = this.game.add.image(pos.x, pos.y, font);
        buttontext.anchor.set(0.5);
        buttontext.scale.setTo(2, 2);

        // Title text
        font = this.game.add.retroFont('myfont', 5, 8, chars, 12);
        font.setText("A Battle of Snow & Fire", true, 0, 0, "center", true);
        // xpos = width/2 - textwidth/2 = 400/2 - floor(345/2) = 28
        var titletext = this.game.add.image(28, 32, font);
        titletext.anchor.setTo(0.0, 0.5);
        titletext.scale.setTo(3, 3);

        // Score
        font = this.game.add.retroFont('myfont', 5, 8, chars, 12);
        font.setText("Score: "+score, true, 2, 0, "center", true);
        // xpos = width/2 - textwidth/2 = 400/2 - floor(345/2) = 28
        var titletext = this.game.add.image(width/2, 196, font);
        titletext.anchor.setTo(0.5, 0.5);
        titletext.scale.setTo(2, 2);

        // Snowman
        spr = this.game.add.sprite(width/2, 128, "snowman", 8);
        spr.anchor.set(0.5);
        spr.scale.setTo(3, 3);

        // Start background music
        this.backaudio = this.game.add.audio("sheepcandy", 1.0, true);
        this.backaudio.play();
    },

    playAgain: function() {
        LD31.transitionTo(this, "Menu", 2000);
    }

};