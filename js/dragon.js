LD31.Dragon = function(ld31, game, position, enemy, bodyparts, maxHealth) {
    this.ld31 = ld31;
    this.game = game;
    this.position = (typeof position === "undefined" ? {x:0, y:0} : position);
    this.enemy = enemy;
    // Internal variables
    this.ticks = 0;
    this.history = {};
    this.turn = 0;
    // Entity variables
    this.dead = false;
    this.bodyMaxHealth = (typeof maxHealth === "undefined" ? 16 : maxHealth);
    this.headMaxHealth = this.bodyMaxHealth*2;
    this.health = [];
    this.speed = 75;
    this.turnSpeed = 180*50;
    this.bodyWidth = 32;
    this.bodyparts = (typeof bodyparts === "undefined" ? 4 : bodyparts);
    this.sprites = [];
    // Fire breath
    this.canBreath = true;
    this.firesprite = null;

    this.target = {x:0, y:0};
    this.targets = [];
    this.targetindex = 0;
    this.canBeHit = [];
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
        pos.x += 0.5*bodyWidth + this.bodyparts*bodyWidth;
        for (i=this.bodyparts-1; i>=0; i--) {
            pos.x -= bodyWidth;
            body = this.parts.create(pos.x, pos.y, "dragon", 1); // frame = 1
            body.anchor.set(0.5);
            body.dragontype = "body";
            body.dragonindex = i;
            body.name = "body-" + i;
            body.body.setSize(20, 20, 0, 0);
            this.health[i+1] = this.bodyMaxHealth;
            this.canBeHit[i+1] = true;
            this.sprites[i+1] = body;
            this.history[body.name] = [];
            this.history[body.name].push({x:body.x, y:body.y, angle:body.angle});
            // Tail gets another frame
            if (i == this.bodyparts-2)
                body.frame = 2;
            else if (i == this.bodyparts-1)
                body.frame = 3;
        }

        this.firesprite = this.parts.create(
            this.position.x, this.position.y, "dragonbreath", 16); // frame = 16
        this.firesprite.anchor.set(0.5);
        this.firesprite.scale.setTo(3, 3);
        this.firesprite.kill();
        this.firesprite.dragontype = "fire";
        this.firesprite.body.setSize(24, 24, 0, 0);
        var anim = this.firesprite.animations.add("fire", [16, 17], 30, true);
        anim.play();

        // Head
        var head = this.head = this.parts.create(
            this.position.x, this.position.y, "dragon", 0); // frame = 0
        head.anchor.set(0.5);
        head.scale.setTo(2, 2);
        head.dragontype = "head";
        head.name = "head";
        this.health[0] = this.headMaxHealth;
        this.canBeHit[0] = true;
        this.sprites[0] = head;
        this.history[head.name] = [];
        this.history[head.name].push({x:head.x, y:head.y, angle:head.angle});
        // Enable physics on head
        this.game.physics.enable(head, Phaser.Physics.ARCADE);
        head.body.setSize(16, 16, 0, 0);

        // Funny number
        this.limit = Math.floor(60/(Math.abs(this.speed)/(this.bodyWidth-4)));

        // Sounds
        this.firesnd = this.game.add.audio("fire");

        // Setup behaviour
        var center = {x:this.game.width/2, y:this.game.height/2};
        this.targets[0] = {x:  center.x/2, y:  center.y/2};
        this.targets[1] = {x:3*center.x/2, y:  center.y/2};
        this.targets[2] = {x:  center.x/2, y:3*center.y/2};
        this.targets[3] = {x:3*center.x/2, y:3*center.y/2};
        this.targets[4] = {x:this.enemy.sprite.x, y:this.enemy.sprite.y};
        this.targetindex = 4;
    },

    update: function() {
        if (this.dead) return;

        this.behaviour();

        this.rotateTowardsTarget(this.target);

        // Move in direction facing
        this.game.physics.arcade.velocityFromAngle(
            this.head.angle, -this.speed, this.head.body.velocity);

        // Update snake body positions and angles
        var hbody = this.head.body;
        if (Math.abs(hbody.velocity.x)>0 || Math.abs(hbody.velocity.y)>0) {
            var body, last, head = this.head, limit = this.limit;
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
        }

        if (this.canBreath) this.breath();
        // Enable firebreath
        if (this.firesprite) {
            var deg = this.head.angle*Math.PI/180;
            this.firesprite.x = this.head.x - 56*Math.cos(deg);
            this.firesprite.y = this.head.y - 56*Math.sin(deg);
            this.firesprite.angle = this.head.angle;
        }

        this.ticks++;
    },

    behaviour: function() {
        if (this.ticks % 360 == 0) {
            var t = this.nextTarget();
            this.target.x = t.x;
            this.target.y = t.y;
        }

        // Update snowman position
        if (this.ticks % 30 == 0) {
            if (!this.enemy.dead) {
                this.targets[4].x = Math.floor( this.enemy.sprite.x );
                this.targets[4].y = Math.floor( this.enemy.sprite.y );
            } else {
                this.targets[4].x = Math.floor( Math.random() * this.game.width );
                this.targets[4].y = Math.floor( Math.random() * this.game.height );
            }
            if (this.targetindex == 4) {
                this.target.x = this.targets[4].x;
                this.target.y = this.targets[4].y;
            }
        }
    },

    nextTarget: function() {
        this.targetindex = (this.targetindex+1) % this.targets.length;
        // Set next target
        this.target.x = this.targets[this.targetindex].x;
        this.target.y = this.targets[this.targetindex].y;
        // Update target index
        return this.target;
    },

    rotateTowardsTarget: function(target) {
        if (!target.x || !target.y) return false;

        // Point towards target (I got no time fo that!)
        // http://jibransyed.wordpress.com/2013/09/05/game-maker-gradually-rotating-an-object-towards-a-target/
        var targetDirection = this.game.physics.arcade.angleToXY(
            this.head, target.x, target.y)*180/Math.PI;
        var angleDiff = facingMinusTarget = this.head.angle - targetDirection;
        if (Math.abs(facingMinusTarget) > 180) {
            if (this.head.angle > targetDirection)
                angleDiff = -1 * ((360-this.head.angle) + targetDirection);
            else
                angleDiff = (360 - targetDirection) + this.head.angle;
        }
        if (Math.abs(180 - angleDiff) > 2) // stop flickering when near target
            this.head.body.angularVelocity = this.turnSpeed/angleDiff;
        else
            this.head.body.angularVelocity = 0;

        return true;
    },

    breath: function() {
        if (this.canBreath) {
            this.canBreath = false;
            this.firesprite.revive();

            if (this.firesnd) this.firesnd.fadeIn(100);

            this.game.time.events.add(2000, function() { // Stop breath
                this.firesprite.kill();
                this.firesnd.fadeOut(500);
            }, this);

            this.game.time.events.add(5000, function() { // Enable breath
                this.canBreath = true;
            }, this);
        }
    },

    hit: function(part, damage) {
        if (part.dragontype == "body") {
            var index = part.dragonindex+1;

            if (!this.canBeHit[index] || this.health[index]<=0)
                return false; // not hit

            this.health[index] -= damage;
            if (this.health[index] <= 0) {
                this.enemy.updateScore(1);
                // Kill body part
                this.health[index] = 0;
                part.frame += 4;
            } else
                this.flinch(part, index);
            return true; // was hit
        } else if (part.name == "head") {

            if (!this.canBeHit[0] || this.health[index]<=0)
                return false; // not hit

            // Head takes damage only if all body parts are dead
            var anybodypartsalive = false;
            for (var i=1; i<this.bodyparts+1; i++)
                anybodypartsalive |= (this.health[i] != 0);
            if (anybodypartsalive)
                return false; // not hit
            // => All body parts are dead: now take damage
            this.health[0] -= damage;
            if (this.health[0] <= 0) {
                this.enemy.updateScore(
                    Math.pow(10, log_to_base(this.bodyparts, 2)));
                this.health[0] = 0;
                part.frame += 4;
                this.defeated(); // kill dragon
            } else
                this.flinch(part, 0);
            return true; // was hit
        }
        return false; // not hit
    },

    flinch: function(part, index) {
        this.canBeHit[index] = false;
        var oldframe = part.frame;
        part.frame = oldframe+4;
        this.game.time.events.add(100, function() {
            part.frame = oldframe;
            this.canBeHit[index] = true;
        }, this);
    },

    defeated: function() {
        this.dead = true;
        this.head.body.velocity.x = this.head.body.velocity.y = 0;
        this.head.body.angularVelocity = 0;
        this.head = null;
        // this.parts = null;
        this.sprites = null;
        this.history = null;
        this.firesprite.kill();

        // this.game.world.sendToBack(this.parts);
        this.game.world.setChildIndex(this.parts, 1);

        // Starts a 1-second-fading-tween after 5 seconds => then destroys it
        this.game.time.events.add(5000, function() {
            var tween = this.game.add.tween(this.parts).to({alpha:0.25}, 5000,
                Phaser.Easing.Linear.Out, true);
        }, this);

        // Spawn a new one!
        var width = this.game.width,
            height = this.game.height,
            pos = { x:width*1.25,
                    y:Math.floor(Math.random()*height) },
            health = 16*log_to_base(this.bodyparts, 2) + this.bodyMaxHealth;

        var dragon = this.ld31.dragon = new LD31.Dragon(this.ld31, this.game,
            pos, this.enemy, this.bodyparts*2, health);
        dragon.create();
    }

};


function log_to_base(x, n) {
    return Math.log(x) / Math.log(n);
}