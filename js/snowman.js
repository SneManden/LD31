LD31.Snowman = function(ld31, game, position) {
    this.ld31 = ld31;
    this.game = game;
    this.position = (typeof position === "undefined" ? {x:0, y:0} : position);
};
LD31.Snowman.prototype = {

    toString: function() {
        return "snowman";
    },

    create: function() {
        this.sprite = this.game.add.sprite(
            this.position.x, this.position.y, "snowman", 0); // frame = 0
        this.sprite.anchor.set(0.5);
    }

};