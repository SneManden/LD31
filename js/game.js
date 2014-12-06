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

        var snowmanpos = {x:this.center.x/2, y:this.center.y/2};
        this.snowman = new LD31.Snowman(this, this.game, snowmanpos);
        this.snowman.create();
    },

    render: function() {
        var pixel = this.game.pixel;
        pixel.context.drawImage(this.game.canvas, 0, 0,
            this.game.width, this.game.height, 0, 0, pixel.width, pixel.height);
    }

};