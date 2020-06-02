function Physics(ui) {
  var pl = planck, Vec2 = pl.Vec2;
  var YOU = 2;
  var OTHER = 4;
  var WALLS = 8;
  var SPACE_WIDTH = 16;
  var SPACE_HEIGHT = 9;
  var NUMSTEPS = 100;

  var SIZE = 0.30;
  var WALLRADIUS = 5;
  var state = {
    gameover: true,
    startGame: function() {
      this.gameover = false;
    },
    crash: function() {
      this.endGame();
    },
    endGame: function() {
      this.gameover = true;
    }
  };

  var world;
  var otherBodies = [];
  var yourBody;
  var borderWall;
  var globalTime = 0;
  var lastShrinkTime = globalTime;
  var shrinkSteps = NUMSTEPS;
  var currentCircle = {
    radius : WALLRADIUS,
    position : Vec2(0,0)
  };
  var newCircle = currentCircle;
  var bwf; //borderwall fixture
  world = pl.World();
  world.on('pre-solve', function(contact) {

    if (true){
      dummy(contact);

      return;
    }
    var fixtureA = contact.getFixtureA();
    var fixtureB = contact.getFixtureB();

    var bodyA = contact.getFixtureA().getBody();
    var bodyB = contact.getFixtureB().getBody();

    var youCrashed = bodyA == yourBody || bodyB == yourBody;
    if (youCrashed) {
      setTimeout(function () {
        crash(yourBody, bodyA == yourBody ? bodyB : bodyA);
      }, 1);
    }
  });

  function dummy(contact) {
    var fixtureA = contact.getFixtureA();
    var fixtureB = contact.getFixtureB();

    var bodyA = contact.getFixtureA().getBody();
    var bodyB = contact.getFixtureB().getBody();

    var youCrashed = bodyA == borderWall || bodyB == borderWall;


    /*
    if (youCrashed) {
      setTimeout(function () {
        crash(borderWall, bodyA == borderWall ? bodyB : bodyA);
      }, 1);
    }
    */
  }

  function start() {
    state.startGame();
    setupYou();
    setupBots();
    makeWalls(currentCircle);
  }

  function end() {
    state.endGame();
    ui.endGame();
  }

  function setupYou() {
    yourBody = world.createBody({
      type : 'dynamic',
      angularDamping : 2.0,
      linearDamping : 0.5,
      position : Vec2(),
      bullet : true
    });

    yourBody.createFixture(pl.Circle(SIZE), {
      density : 1000,
      filterCategoryBits : YOU,
      filterMaskBits : OTHER | WALLS
    });
  }



  function updateYou (){
    if (yourBody) {
      if (ui.activeKeys.left && !ui.activeKeys.right) {
        var f = Vec2(10.0, 0.0);
        var p = yourBody.getWorldCenter();
        yourBody.applyLinearImpulse(f, p, true);
      } else if (ui.activeKeys.right && !ui.activeKeys.left) {
        var f = Vec2(-10.0, 0.0);
        var p = yourBody.getWorldCenter();
        yourBody.applyLinearImpulse(f, p, true);
      }
      if (ui.activeKeys.up && !ui.activeKeys.down) {
        var f = Vec2(0.0, -10.0);
        var p = yourBody.getWorldCenter();
        yourBody.applyLinearImpulse(f, p, true);
      }
      if (ui.activeKeys.down && !ui.activeKeys.up) {
        var f = Vec2(0.0, 10.0);
        var p = yourBody.getWorldCenter();
        yourBody.applyLinearImpulse(f, p, true);
      }
    }
  }

  function moveOtherBody(){
    for (var i = 0; i !== otherBodies.length; i++) {
      otherBody = otherBodies[i]
      var f = otherBody.getWorldVector(Vec2(rand(50) * (rand(1) > 0.5 ? 1 : -1), rand(50) * (rand(1) > 0.5 ? 1 : -1)));
      var p = otherBody.getWorldCenter();
      otherBody.applyLinearImpulse(f, p, true);
    }
  }

  function tick(dt) {
    if (state.gameover) {
      return;
    }
    globalTime += dt;
    updateYou ();
    moveOtherBody();
    shouldIshrink();
    //console.log (new Date());
    //console.log (globalTime);
    //console.log(yourBody.getWorldCenter());

  }

  function shouldIshrink()
  {

    if (globalTime - lastShrinkTime <100) {
      return;
    }
    lastShrinkTime = globalTime;

    if (!shrinkSteps){
      newCircle = createNewCircle(currentCircle);
      shrinkSteps = NUMSTEPS;
    }else{

      currentCircle = shrinkCircle (currentCircle, newCircle);
      makeWalls(currentCircle);
      shrinkSteps--;
    }
  }

  function shrinkCircle (cc, nc){
    var nr = cc.radius- (cc.radius - nc.radius)/shrinkSteps;
    var x = cc.position.x + (nc.position.x - cc.position.x)/shrinkSteps;
    var y = cc.position.y + (nc.position.y - cc.position.y)/shrinkSteps;
    return {
      position : Vec2(x, y),
      radius : nr
    };
  }

  function createNewCircle (p){
    var r = p.radius*0.80;
    var pr = p.radius- r;
    var angle = rand (Math.PI *2);
    var maxX = Math.sin (angle) * pr;
    var maxY = Math.cos (angle) * pr;
    var x = normalDistRandom() * maxX + p.position.x;
    var y = normalDistRandom() * maxY + p.position.y;
    debugger;
    return {
      position: Vec2(x,y),
      radius: r
    };
  }

  function normalDistRandom() {
    let u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0) return randn_bm(); // resample between 0 and 1
    return num;
  }

  function setupBots() {
    otherBodies = [];

    for (var i = 0; i < 0; i++) {
      var yourPosition = yourBody.getPosition();
      var x = yourPosition.x;
      var y = yourPosition.y;

      while (Math.abs(x - yourPosition.x) < SIZE * 2
      && Math.abs(y - yourPosition.y) < SIZE * 2) {
        var angle = rand (Math.PI * 2);
        x = rand (WALLRADIUS-SIZE) * Math.sin(angle);
        y = rand (WALLRADIUS-SIZE) * Math.cos(angle);
      }

      var vx = rand(1);
      var vy = rand(1);
      var va = rand(1);
      makeOtherBody(x, y, vx, vy, va);
    }
  }

  function makeOtherBody(x, y, vx, vy, va) {
    var otherBody = world.createBody({
      position : Vec2(x, y),
      type : 'dynamic',
      linearDamping : 1.0,
      bullet : true
    });
    otherBodies.push(otherBody);
    otherBody.createFixture(pl.Circle(SIZE), {
      density : 1000,
      filterCategoryBits : OTHER,
      filterMaskBits : YOU | WALLS | OTHER
    });
    return otherBody;
  }

  function makeWalls (cc) {
    var circlePoints = makeCirclePoints(cc.radius, cc.position.x, cc.position.y);

    if (!borderWall) {
      borderWall = world.createBody();
    }
    borderWall.createFixture(pl.Chain(circlePoints), {
      density: 0,
      filterCategoryBits : WALLS,
      filterMaskBits : YOU | OTHER
    });
    var fixA = borderWall.getFixtureList();
    var limit = 5;
    while (limit-- > 0) {
      fixA = fixA ? fixA.getNext() : fixA
    }
    if (fixA) {
      borderWall.destroyFixture(fixA);
    }
    return borderWall;
  }

  function makeCirclePoints (radius, p_x, p_y, numpoints=100){
    if (numpoints < 3) return;
    var output = [];

    var angle = Math.PI*2/numpoints;

    for (i = 0; i < numpoints; ++i){
      var currAngle = angle*i;
      var y = Math.sin (currAngle) * radius + p_x;
      var x = Math.cos (currAngle) * radius + p_y;
      output.push(Vec2 (x,y));
    }
    output.push(output[0]);
    return output;
  }

  function crash(you, other) {
    if (!yourBody) return;

    state.crash();

    // Remove the ship body for a while
    world.destroyBody(yourBody);
    yourBody = null;
    end();
  }

  function rand(value) {
    return (Math.random() - 0.5) * (value || 1);
  }

  //If player hits out of bounds, game over for that player
  function outofbounds (body) {
    var p = body.getPosition();

  }

  this.start = start;
  this.world = world;
  this.state = state;
  this.spaceWidth = SPACE_WIDTH;
  this.spaceHeight = SPACE_HEIGHT;
  this.tick = tick;
  this.ratio = 64;
}

Stage(function(stage) {
  var activeKeys = {};


  var KEY_NAMES = {
    32 : 'start',
    37 : 'right',
    38 : 'up',
    39 : 'left',
    40 : 'down'
  };

  var physics = new Physics({
    startGame: startGame,
    endGame: endGame,
    activeKeys: activeKeys
  });
  var world, meta;
  stage.background('#222222');
  stage.on('viewport', function(size) {
    meta.pin({
      scaleMode : 'in-pad',
      scaleWidth : size.width,
      scaleHeight : size.height
    });
    world.pin({
      scaleMode : 'in-pad',
      scaleWidth : size.width,
      scaleHeight : size.height
    });
  });
  //
  world = new Stage
    .planck(physics.world, { ratio: 80 })
    .pin({
      handle : -0.5,
      width : physics.spaceWidth,
      height : physics.spaceHeight
    })
    .appendTo(stage)
    .hide();

  stage.tick(physics.tick);

  START_STATE = 1;
  GAME_STATE = 2;
  END_STATE = 3;
  m_state = START_STATE;

  meta = Stage
    .create()
    .pin({ width : 1000, height : 1000 })
    .appendTo(stage);

  startScreen = Stage
    .string('text')
    .value('Start!')
    .pin({ offsetX: 500, offsetY: 500, scale : 1 })
    .appendTo(meta)
    .show();

  endScreen = Stage
    .string('text')
    .value('End!')
    .pin({offsetX: 1, offsetY: 4, scale : 1 })
    .appendTo(meta)
    .hide();

  function startGame() {
    startScreen.hide();
    m_state = GAME_STATE;
    world.show();
    physics.start();
    endScreen.hide();
  }

  function endGame() {
    startScreen.hide();
    m_state = END_STATE;
    world.hide();
    endScreen.show();
  }

  document.onkeydown = function(evt) {
    activeKeys[KEY_NAMES[evt.keyCode]] = true;
  };

  document.onkeyup = function(evt) {
    var old_start = activeKeys['start']
    activeKeys[KEY_NAMES[evt.keyCode]] = false;
    if (old_start && !activeKeys['start'] && m_state != GAME_STATE) {
      startGame();
    }
  };
});

Stage({
  textures : {

    text : function(d) {
      d += '';
      return Stage.canvas(function(ctx) {
        var ratio = 2;
        this.size(16, 24, ratio);
        ctx.scale(ratio, ratio);
        ctx.font = 'bold 24px monospace';
        ctx.fillStyle = '#ddd';
        ctx.textBaseline = 'top';
        ctx.fillText(d, 0, 1);
      });
    }

  }
});
