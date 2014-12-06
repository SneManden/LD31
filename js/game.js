LD31.Game = function(game) {
    this.game = game;
};
LD31.Game.prototype = {

    preload: function() {
        console.log("Game: preload()");
    },

    create: function() {
        console.log("Game: create()");
        this.center = {x:this.game.width/2, y:this.game.height/2};

        this.game.ld31 = this; // debug

        // Physics
        this.physics.startSystem(Phaser.Physics.ARCADE);

        // Controls
        this.game.keys = this.game.input.keyboard.createCursorKeys();
        this.game.wasd = {
            up: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
            left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
            down: this.game.input.keyboard.addKey(Phaser.Keyboard.S),
            right: this.game.input.keyboard.addKey(Phaser.Keyboard.D)
        };

        // Add Dragon
        var dragonpos = {x:this.center.x*0.8, y:this.center.y/2};
        this.dragon = new LD31.Dragon(this, this.game, dragonpos);
        this.dragon.create();

        // Add Snowman
        var snowmanpos = {x:this.center.x, y:this.center.y};
        this.snowman = new LD31.Snowman(this, this.game, snowmanpos);
        this.snowman.create();
    },

    update: function() {
        this.snowman.update();
        this.dragon.update();

        // Check collision
        this.game.physics.arcade.overlap(this.snowman.balls, this.dragon.parts,
            this.handleCollision, null, this);
    },

    handleCollision: function(ball, dragonbody) {
        ball.kill();
        this.dragon.hit(dragonbody, 5);
    },

    render: function() {
        // this.game.debug.spriteInfo(this.dragon.head, 10, this.game.height-80);
        // this.renderPixelScaled();

        // for (var i=0; i<this.dragon.bodyparts+1; i++)
        //     this.game.debug.body(this.dragon.sprites[i]);
    },

    renderPixelScaled: function() {
        var pixel = this.game.pixel;
        pixel.context.drawImage(this.game.canvas, 0, 0,
            this.game.width, this.game.height, 0, 0, pixel.width, pixel.height);
    }

};