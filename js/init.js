var LD31 = {};

LD31.Init = function(game) {
    this.game = game;
};
LD31.Init.prototype = {

    init: function() {
        this.stage.backgroundColor = "#262733";

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


/**
 * Transition effect for context to state over time
 */
LD31.transitionTo = function(context, state, time) {
    var self = context,
        game = self.game;
    // Add black transparent sprite filling the whole scene
    var square = new Phaser.Rectangle(0, 0, game.width, game.height),
        graphics = game.add.graphics(0, 0);
    graphics.beginFill(0x000000);
    graphics.drawRect(square.x, square.y, square.width, square.height);
    graphics.endFill();
    graphics.alpha = 0;
    // Tween alpha from transparent to opaque
    var tween = game.add.tween(graphics).to({alpha:1}, time,
        Phaser.Easing.Linear.Out, true);
    // Stop music
    if (self.backaudio)
        self.backaudio.fadeOut(time);
    // Go to state on transition completion
    tween.onComplete.add(function() {        
        this.game.sound.stopAll();
        // Go to state
        this.state.start(state);
    }, self);
};