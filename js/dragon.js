LD31.Dragon = function(ld31, game, position) {
    this.ld31 = ld31;
    this.game = game;
    this.position = (typeof position === "undefined" ? {x:0, y:0} : position);
    // Internal variables
    this.ticks = 0;
    this.history = {};
    this.turn = 0;
    // Entity variables
    this.dead = false;
    this.bodyMaxHealth = 25;
    this.headMaxHealth = 100;
    this.health = [];
    this.speed = 75;
    this.bodyWidth = 32;
    this.bodyparts = 8;
    this.sprites = [];
};
LD31.Dragon.prototype = {

    toString: function() {
        return "dragon";
    },

    create: function() {
        var pos, sprite, body, i, bodyWidth = this.bodyWidth;

        this.parts = this.game.add.group();
        this.parts.enableBody = true;
        this.parts.physicsBodyType = Phaser.Physics.ARCADE;

        // Body
        pos = {x:this.position.x, y:this.position.y};
        for (i=0; i<this.bodyparts; i++) {
            if (i == 0) pos.x += 0.5*bodyWidth;
            pos.x += bodyWidth;
            body = this.parts.create(pos.x, pos.y, "dragon", 1); // frame = 1
            body.anchor.set(0.5);
            body.dragontype = "body";
            body.dragonindex = i;
            body.name = "body-" + i;
            body.body.setSize(20, 20, 0, 0);
            this.health[i+1] = this.bodyMaxHealth;
            this.sprites[i+1] = body;
            this.history[body.name] = [];
            this.history[body.name].push({x:body.x, y:body.y, angle:body.angle});
        }

        // Head
        var head = this.head = this.parts.create(
            this.position.x, this.position.y, "dragon", 0); // frame = 0
        head.anchor.set(0.5);
        head.scale.setTo(2, 2);
        head.dragontype = "head";
        head.name = "head";
        this.health[0] = this.headMaxHealth;
        this.sprites[0] = head;
        this.history[head.name] = [];
        this.history[head.name].push({x:head.x, y:head.y, angle:head.angle});
        // Enable physics on head
        this.game.physics.enable(head, Phaser.Physics.ARCADE);
        head.body.setSize(16, 16, 0, 0);
    },

    update: function() {
        if (this.dead) return;

        var vel = this.game.physics.arcade.velocityFromAngle(
            this.head.angle, -this.speed);
        this.head.body.velocity.x = vel.x;
        this.head.body.velocity.y = vel.y;

        if (this.turn <= 0) {
            if (this.turn == 0) this.turn = -5;
            if (this.turn < -1) this.turn++;

            if (this.turn == -1 && Math.round(this.head.angle) % 180 == 0)
                this.turn = 60;
            else
                this.head.body.angularVelocity = -50;
        } else {
            this.head.body.angularVelocity = 0;
            this.head.angle = (Math.abs(this.head.angle) < 90 ? 0 : 180);
            this.turn--;
        }

        // Update snake body positions and angles
        var limit = Math.floor(60/(Math.abs(this.speed)/this.bodyWidth));

        var body, last, head = this.head;
        for (var i=1; i<this.sprites.length; i++) {
            body = this.sprites[i];
            last = (i == 1 ? head : this.sprites[i-1]);
            if (this.ticks%limit < this.history[last.name].length) {
                body.x = this.history[last.name][this.ticks%limit].x;
                body.y = this.history[last.name][this.ticks%limit].y;
                body.angle = this.history[last.name][this.ticks%limit].angle;
                // Update history
                this.history[last.name][this.ticks%limit].x = last.x;
                this.history[last.name][this.ticks%limit].y = last.y;
                this.history[last.name][this.ticks%limit].angle = last.angle;
            } else {
                this.history[last.name].push(
                    {x:body.x, y:body.y, angle:body.angle}
                );
            }
        }

        this.ticks++;
    },

    hit: function(part, damage) {
        if (part.dragontype == "body") {
            var index = part.dragonindex;
            this.health[index+1] -= damage;
            if (this.health[index+1] <= 0) {
                // Kill body part
                this.health[index+1] = 0;
                part.frame = 3;
            } else
                this.flinch(part, 3);
            return true; // was hit
        } else if (part.name == "head") {
            // Head takes damage only if all body parts are dead
            var anybodypartsalive = false;
            for (var i=1; i<this.bodyparts+1; i++)
                anybodypartsalive |= (this.health[i] != 0);
            if (anybodypartsalive)
                return false; // not hit
            // => All body parts are dead: now take damage
            this.health[0] -= damage;
            if (this.health[0] <= 0) {
                this.health[0] = 0;
                part.frame = 2;
                this.defeated(); // kill dragon
            } else
                this.flinch(part, 2);
            return true; // was hit
        }
        return false; // not hit
    },

    flinch: function(part, newframe) {
        var oldframe = part.frame;
        part.frame = newframe;
        this.game.time.events.add(50, function() {
            part.frame = oldframe;
        }, this);
    },

    defeated: function() {
        this.dead = true;
        this.head.body.velocity.x = this.head.body.velocity.y = 0;
        this.head.body.angularVelocity = 0;
        this.head = null;
        this.parts = null;
        this.sprites = null;
        this.history = null;
        console.log("DRAGON IS KILLED!");
    }

};