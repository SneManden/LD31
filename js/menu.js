LD31.Menu = function(game) {
    this.game = game;
};
LD31.Menu.prototype = {

    preload: function() {
        this.load.spritesheet("button", "img/scenery.png", 32, 16, 4);
    },

    create: function() {
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
            this.startGame, this, frames.over, frames.out, frames.down);
        startbutton.anchor.set(0.5);
        startbutton.scale.setTo(4, 4);
        // Setup Font
        var chars = Phaser.RetroFont.TEXT_SET1;
        var font = this.game.add.retroFont('myfont', 5, 8, chars, 12);
        // (text, multiline, charspacing, linespacing, align, allowlowercase)
        font.setText("Start Game", true, 0, 0, "center", true);
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

        // Snowman
        spr = this.game.add.sprite(width/3, 96, "snowman", 0);
        spr.anchor.set(0.5);
        spr.scale.setTo(3, 3);

        // Dragon
        spr = this.game.add.sprite(2*width/3, 96, "dragon", 0);
        spr.anchor.set(0.5);
        spr.scale.setTo(4, 4);

        // Add controls
        var spr, frame=8, xoffset=146, voffset=height/2+16, spacing=120,
            positions=[{x:1,y:0}, {x:0,y:1}, {x:1,y:1}, {x:2,y:1}];
        for (var i=0; i<2; i++) {
            for (var j=0; j<4; j++) {
                // set position
                pos.x = xoffset + i*spacing + 32*positions[j].x;
                pos.y = voffset +             32*positions[j].y;
                // Add sprite
                spr = this.game.add.sprite(pos.x, pos.y, "scenery", frame);
                spr.scale.setTo(2, 2);
                spr.anchor.set(0.5);
                frame++;
            }
        }
        // Add controls text
        font = this.game.add.retroFont('myfont', 5, 8, chars, 12);
        font.setText("and (          or          )", true, 0, 0, "center", true);
        var controlstext = this.game.add.image(xoffset-68, voffset+12, font);
        controlstext.anchor.setTo(0.0, 0.5);
        controlstext.scale.setTo(2, 2);
        // Add mouse
        spr = this.game.add.sprite(xoffset-92, voffset+12, "scenery", 1);
        spr.scale.setTo(2, 2);
        spr.anchor.set(0.5);

        // LD31 text
        font = this.game.add.retroFont('myfont', 5, 8, chars, 12);
        font.setText("LudumDare 31", true, 1, 0, "center", true);
        var titletext = this.game.add.image(32, height-32, font);
        titletext.anchor.setTo(0.0, 0.5);
        titletext.scale.setTo(1, 1);
        // SneManden
        font = this.game.add.retroFont('myfont', 5, 8, chars, 12);
        font.setText("SneManden", true, 1, 0, "center", true);
        var titletext = this.game.add.image(width-32, height-32, font);
        titletext.anchor.setTo(1.0, 0.5);
        titletext.scale.setTo(1, 1);

        // Start background music
        this.backaudio = this.game.add.audio("sheepcandy", 1.0, true);
        this.backaudio.play();
    },

    startGame: function() {
        LD31.transitionTo(this, "Game", 2000);
    }

};