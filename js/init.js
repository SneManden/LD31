var LD31 = {};

LD31.Init = function(game) {
    this.game = game;
};
LD31.Init.prototype = {

    init: function() {
        console.log("Init: init()");
        this.stage.backgroundColor = 0x4fd658;

        this.scaleSetup();
        // this.pixelScaleSetup();
    },

    scaleSetup: function() {
        this.game.scale.maxWidth = 800;
        this.game.scale.maxHeight = 600;
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.setScreenSize();
    },

    pixelScaleSetup: function() {
        // Initialize new canvas for scaling
        var game = this.game,
            pixel = this.game.pixel;
        game.canvas.style["display"] = "none";
        pixel.canvas = Phaser.Canvas.create(game.width*pixel.scale,
            game.height*pixel.scale);
        pixel.context = pixel.canvas.getContext("2d");
        Phaser.Canvas.addToDOM(pixel.canvas);
        Phaser.Canvas.setSmoothingEnabled(pixel.context, false);
        pixel.width = pixel.canvas.width;
        pixel.height = pixel.canvas.height;
    },

    create: function() {
        this.state.start("Preload");
    }

};