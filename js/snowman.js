LD31.Snowman = function(ld31, game, position) {
    this.ld31 = ld31;
    this.game = game;
    this.position = (typeof position === "undefined" ? {x:0, y:0} : position);
    // Variables
    this.movespeed = 50;
    // Snowball related
    this.numballs = 16;
    this.ballspeed = 350;
    this.nextThrow = 0;
    this.throwRate = 1.5; // balls per second
    this.throwRange = 200;
};
LD31.Snowman.prototype = {

    toString: function() {
        return "snowman";
    },

    create: function() {
        this.sprite = this.game.add.sprite(
            this.position.x, this.position.y, "snowman", 0); // frame = 0
        this.sprite.anchor.set(0.5);

        // Enable physics on this sprite
        this.sprite.enableBody = true;
        this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);

        // Setup snowballs
        this.balls = this.game.add.group();
        this.balls.enableBody = true;
        this.balls.physicsBodyType = Phaser.Physics.ARCADE;
        this.balls.createMultiple(this.numballs, "scenery", 0); // frame = 0
        this.balls.setAll("checkWorldBounds", true);
        this.balls.setAll("outOfBoundsKill", true);
    },

    update: function() {
        this.controls();
    },

    throwBall: function() {
        var game = this.game;
        // If can throw ball and there are available balls
        if (game.time.now > this.nextThrow && this.balls.countDead() > 0) {
            this.nextThrow = game.time.now + 1000/this.throwRate;
            // Create new snowball
            var ball = this.balls.getFirstDead();
            ball.alpha = 1;
            ball.anchor.set(0.5);
            ball.reset(this.sprite.x-12, this.sprite.y);
            // Throw ball in direction of pointer with distance of throwRange
            // with a speed of ballspeed
            var mouse = game.input.mousePointer,
                pointer = {x:mouse.x, y:mouse.y},
                ang = game.physics.arcade.angleBetween(this.sprite, pointer),
                dist = this.throwRange,
                dest = {x: this.sprite.x+dist*Math.cos(ang),
                        y: this.sprite.y+dist*Math.sin(ang)},
                time = dist / this.ballspeed * 1000, // time = distance/speed
                quadout = Phaser.Easing.Quadratic.Out;
            game.add.tween(ball.position).to(dest, time, quadout, true);
        }
    },

    controls: function() {
        var dir = {x:0, y:0},
            diag = 0.7071067812; // if moving diagonally: speed = 0.5*sqrt(2)

        if (this.upIsDown())
            dir.y -= 1;
        if (this.leftIsDown())
            dir.x -= 1;
        if (this.downIsDown())
            dir.y += 1;
        if (this.rightIsDown())
            dir.x += 1;
        // Set propor speed (considering diagonal speed has to be the same too!)
        if (Math.abs(dir.x) == 1 && Math.abs(dir.y) == 1) {
            this.sprite.body.velocity.x = this.movespeed * diag * dir.x;
            this.sprite.body.velocity.y = this.movespeed * diag * dir.y;
        } else {
            this.sprite.body.velocity.x = this.movespeed * dir.x;
            this.sprite.body.velocity.y = this.movespeed * dir.y;
        }

        // Throw ball
        if (this.game.input.mousePointer.isDown)
            this.throwBall();
    },

    upIsDown: function() {
        return (this.game.keys.up.isDown || this.game.wasd.up.isDown);
    },
    leftIsDown: function() {
        return (this.game.keys.left.isDown || this.game.wasd.left.isDown);
    },
    downIsDown: function() {
        return (this.game.keys.down.isDown || this.game.wasd.down.isDown);
    },
    rightIsDown: function() {
        return (this.game.keys.right.isDown || this.game.wasd.right.isDown);
    }

};