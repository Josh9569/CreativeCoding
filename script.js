// ───────────────────────────── GLOBAL VARIABLES ─────────────────────────────

let playerleft, playerright, player, bulletColor, kamikaze, stageData, stageBgImg, startButton, controlsButton, leaderboardButton, backButton, rightArrow, leftArrow, nextButton, difficulty, font, menubg, controls, pulse, fracture, gravetide, menuvid, stageBackgrounds, menuTitle;
let worldWidth = 1500;
let playerSpeed = 5;
let score = 0;
let camX = 0;
let state = 0;
let bulletrotator = 0;
let playerdirection = 1;
let lastShotTime = 0;
let shotCooldown = 100;
let petdirectionP = 1;
let hitpoints = 100; //current hitpoints
let hitpointsMax = 100; //max hitpoints on hard
let currentStage = 1;
let currentLevel = 1;
let stageInitialized = false;
let menuState = "main";

// Kamikaze wave
let wavesofK = 5;
let waveKActive = false;
let waveKSpawned = false;
// Shooter wave
let wavesofS = 5;
let waveSActive = false;
let waveSSpawned = false;
// Pattern wave
let wavesofP = 5;
let wavePActive = false;
let wavePSpawned = false;
// Kamikaze wave timing
let warningStartTimeK = 0;
let warningDelayK = 1000;
let warningPatternK = null;
// Shooter wave timing
let warningStartTimeS = 0;
let warningDelayS = 1500;
let warningPatternS = null;
// Pattern wave timing
let warningStartTimeP = 0;
let warningDelayP = 1500;
let warningPatternP = null;

// ───────────────────────────── PRELOAD ASSETS ─────────────────────────────

function preload() {
  stageData = loadJSON('json/stage.json');
  playerleft = loadImage('assets/player left.png');
  playerright = loadImage('assets/player right.png');
  kamiimg = loadImage('assets/kamikaze.png');
  kamiSpawnData = loadJSON('json/kamikaze.json');
  patimg = loadImage('assets/pattern.png');
  patimg2 = loadImage('assets/pattern2.png');
  patSpawnData = loadJSON('json/pattern.json');
  shooimg = loadImage('assets/shooter.png');
  shooSpawnData = loadJSON('json/shooter.json');
  font = loadFont('assets/RubikGlitch-Regular.ttf');
  menubg = loadImage('assets/menu.png');
  controls = loadImage('assets/controls.png');
  pulse = loadImage('assets/linear pulse.png');
  fracture = loadImage('assets/fracture.png');
  gravetide = loadImage('assets/gravetide.png');
  stageBackgrounds = {
    "1": loadImage('assets/stage 1 bg.png'),
    "2": loadImage('assets/stage 2 bg.png'),
    "3": loadImage('assets/stage 3 bg.png')
  };
}


// ───────────────────────────── SETUP ─────────────────────────────

function setup() {
  canvas = createCanvas(800, 600);
  canvas.position(0,0);
  textFont(font)
  menuvid = createVideo('assets/mainmenu.mp4');
  menuvid.volume(0);
  menuvid.autoplay();
  menuvid.loop();
  menuvid.hide();
  player = createSprite(worldWidth / 2, height / 2, 40, 40);
  player.addImage("left", playerleft);
  player.addImage("right", playerright);
  player.scale = 0.1;
  player.changeImage("right");
  player.setCollider("rectangle", 0, 0, 100, 100);
  // MENU
  const lightBlue = "#e0f7fa";
  menuTitle = createButton('PROJECT SSR');
  menuTitle.style("all", "unset");
  menuTitle.style('font-size', '80px');
  menuTitle.style("color", "white");
  menuTitle.style("font-family", "Rubik Glitch");
  menuTitle.position(100, height / 2 - 250);
  startButton = createButton('START');
  startButton.style("all", "unset");
  startButton.style('font-size', '50px');
  startButton.style("color", "white");
  startButton.style("cursor", "pointer");
  startButton.style("font-family", "Rubik Glitch");
  startButton.position(100, height / 2 - 100);
  startButton.mouseOver(() => startButton.style("color", lightBlue));
  startButton.mouseOut(() => startButton.style("color", "#ffffff"));
  controlsButton = createButton('CONTROLS');
  controlsButton.style("all", "unset");
  controlsButton.style('font-size', '50px');
  controlsButton.style("color", "white");
  controlsButton.style("cursor", "pointer");
  controlsButton.style("font-family", "Rubik Glitch");
  controlsButton.position(100, height / 2);
  controlsButton.mouseOver(() => controlsButton.style("color", lightBlue));
  controlsButton.mouseOut(() => controlsButton.style("color", "#ffffff"));
  leaderboardButton = createButton('LEADERBOARD');
  leaderboardButton.style("all", "unset");
  leaderboardButton.style('font-size', '50px');
  leaderboardButton.style("color", "white");
  leaderboardButton.style("cursor", "pointer");
  leaderboardButton.style("font-family", "Rubik Glitch");
  leaderboardButton.position(100, height / 2 + 100);
  leaderboardButton.mouseOver(() => leaderboardButton.style("color", lightBlue));
  leaderboardButton.mouseOut(() => leaderboardButton.style("color", "#ffffff"));
  backButton = createButton('BACK');
  backButton.style("all", "unset");
  backButton.style('font-size', '50px');
  backButton.style("color", "white");
  backButton.style("cursor", "pointer");
  backButton.style("font-family", "Rubik Glitch");
  backButton.position(100, height - 100);
  backButton.mouseOver(() => backButton.style("color", lightBlue));
  backButton.mouseOut(() => backButton.style("color", "#ffffff"));
  backButton.hide();
  nextButton = createButton('NEXT');
  nextButton.style("all", "unset");
  nextButton.style('font-size', '50px');
  nextButton.style("color", "white");
  nextButton.style("cursor", "pointer");
  nextButton.style("font-family", "Rubik Glitch");
  nextButton.position(width - 200, height - 100);
  nextButton.mouseOver(() => nextButton.style("color", lightBlue));
  nextButton.mouseOut(() => nextButton.style("color", "#ffffff"));
  nextButton.hide();
  leftArrow = createButton('<');
  leftArrow.style("all", "unset");
  leftArrow.style('font-size', '50px');
  leftArrow.style("color", "white");
  leftArrow.style("cursor", "pointer");
  leftArrow.style("font-family", "Rubik Glitch");
  leftArrow.position(75, height/2-125);
  leftArrow.mouseOver(() => leftArrow.style("color", lightBlue));
  leftArrow.mouseOut(() => leftArrow.style("color", "#ffffff"));
  leftArrow.hide();
  rightArrow = createButton('>');
  rightArrow.style("all", "unset");
  rightArrow.style('font-size', '50px');
  rightArrow.style("color", "white");
  rightArrow.style("cursor", "pointer");
  rightArrow.style("font-family", "Rubik Glitch");
  rightArrow.position(415, height/2-125);
  rightArrow.mouseOver(() => rightArrow.style("color", lightBlue));
  rightArrow.mouseOut(() => rightArrow.style("color", "#ffffff"));
  rightArrow.hide();
  difficulty = createButton('DIFFICULTY:<br>HARD');
  difficulty.style("all", "unset");
  difficulty.style('font-size', '50px');
  difficulty.style("color", "white");
  difficulty.style("cursor", "pointer");
  difficulty.style("font-family", "Rubik Glitch");
  difficulty.position(100, height - 250);
  difficulty.mouseOver(() => difficulty.style("color", lightBlue));
  difficulty.mouseOut(() => difficulty.style("color", "#ffffff"));
  difficulty.hide();
  //player.debug = true;
  bullets = new Group();
  kamiGroup = new Group();
  patGroup = new Group();
  shooGroup = new Group();
  shooBullets = new Group();
  startButton.mousePressed(() => {
    background(menubg);
    menuTitle.hide();
    startButton.hide();
    controlsButton.hide();
    leaderboardButton.hide();
    nextButton.show();
    leftArrow.show();
    rightArrow.show();
    difficulty.show();
    backButton.show();
    menuState = "selectBullet";
    leftArrow.mousePressed(() => {
      if (bulletrotator > 0) bulletrotator--;
    });
    rightArrow.mousePressed(() => {
      if (bulletrotator < 2) bulletrotator++;
    });
  });
  difficulty.mousePressed(() => {
    if (hitpointsMax === 100) {
      hitpointsMax = 150;
      difficulty.html('DIFFICULTY:<br>MEDIUM');
    } else if (hitpointsMax === 150) {
      hitpointsMax = 200;
      difficulty.html('DIFFICULTY:<br>EASY');
    } else if (hitpointsMax === 200) {
      hitpointsMax = 100;
      difficulty.html('DIFFICULTY:<br>HARD');
    }
    hitpoints = hitpointsMax;
  });
  nextButton.mousePressed(() => {
    state = 1;
    nextButton.remove();
    leftArrow.remove();
    rightArrow.remove();
    difficulty.remove();
    backButton.remove();
    menuvid.stop();
    menuvid.hide();
    menuvid.remove();
  });
  controlsButton.mousePressed(() => {
    menuState = "controls";
    background(menubg);
    backButton.show();
    startButton.hide();
    controlsButton.hide();
    leaderboardButton.hide();
    menuTitle.hide();
  });
  backButton.mousePressed(() => {
    menuTitle.show();
    startButton.show();
    controlsButton.show();
    leaderboardButton.show();
    backButton.hide();
    nextButton.hide();
    leftArrow.hide();
    rightArrow.hide();
    difficulty.hide();
    menuState = "main";
  });
  leaderboardButton.mousePressed(() => {
    background(menubg);
    startButton.hide();
    controlsButton.hide();
    leaderboardButton.hide();
    menuTitle.hide();
    backButton.show();
  });
}

// ───────────────────────────── WEAPONS ─────────────────────────────

function wlight(direction) {
    let w = createSprite(player.position.x, player.position.y, 5);
    w.shapeColor = color(bulletColor);
    w.velocity.x = direction;
    bullets.add(w);
}

function wmedium(direction, y1, y2) {
    let angles = [y1, 0, y2];
    for (let i = 0; i < angles.length; i++) {
        let w = createSprite(player.position.x, player.position.y, 7);
        w.shapeColor = color(bulletColor);
        w.velocity.x = direction;
        w.velocity.y = angles[i];
        bullets.add(w);
    }
}

function wheavy(direction) {
    if (millis() - lastShotTime > shotCooldown) {
        let w = createSprite(player.position.x, player.position.y, 5);
        w.shapeColor = color(bulletColor);
        w.velocity.x = direction;
        bullets.add(w);
        lastShotTime = millis();
    }
}

// ───────────────────────────── ENEMIES ─────────────────────────────
function createKami(x, y) {
  let k = createSprite(x, y, 15);
  k.addImage(kamiimg); // only safe to call once per sprite creation
  k.scale = 0.1;
  k.shapeColor = color(255, 0, 0);
  k.friction = 0.1;
  k.setCollider("circle", 0, 0, 70);
  return k;
}

function createPattern(x, y, direction) {
  let p = createSprite(x, y, 15);
  p.addImage(direction === -1 ? patimg : patimg2);
  p.scale = 0.1;
  p.shapeColor = color(255, 0, 0);
  p.velocity.x = direction * 2.5;
  return p;
}

function createShooter(x, y) {
  let s = createSprite(x, y, 15);
  s.addImage(shooimg);
  s.scale = 0.1;
  s.shapeColor = color(0, 255, 0);
  s.immovable = true;
  return s;
}

function manageKamikazeWaves() {
  if (!waveKActive && wavesofK > 0) {
    warningPatternK = random(kamiSpawnData.patterns);
    warningStartTimeK = millis();
    waveKActive = true;
    waveKSpawned = false;
  }

  if (waveKActive && !waveKSpawned && millis() - warningStartTimeK < warningDelayK) {
    for (let pt of warningPatternK.points) {
      push();
      tint(255, 168, 51, 100);
      image(kamiimg, pt.x - 15, pt.y - 15, kamiimg.width * 0.1, kamiimg.height * 0.1);
      pop();
    }
  }

  if (waveKActive && !waveKSpawned && millis() - warningStartTimeK >= warningDelayK) {
    for (let pt of warningPatternK.points) {
      let k = createKami(pt.x, pt.y);
      kamiGroup.add(k);
    }
    waveKSpawned = true;
  }

  if (waveKActive && waveKSpawned && kamiGroup.length === 0) {
    wavesofK--;
    waveKActive = false;
  }
}


function managePatternWaves() {
  // Warning phase
  if (!wavePActive && wavesofP > 0) {
    warningPatternP = random(patSpawnData.patterns);
    warningStartTimeP = millis();
    wavePActive = true;
    wavePSpawned = false;
    petdirectionP = random([-1, 1]);
  }

  if (wavePActive) {
    // Show warning image before spawning
    if (!wavePSpawned && millis() - warningStartTimeP < warningDelayP) {
      for (let pt of warningPatternP.points) {
        push();
        tint(255, 168, 51);
        let ptx = pt.x - 15;// Adjusted x position
        let pty = pt.y - 15;// Adjusted y position
        if (petdirectionP === -1) {
          image(patimg, ptx, pty, patimg.width * 0.1, patimg.height * 0.1);
        } else {
          image(patimg2, ptx, pty, patimg.width * 0.1, patimg.height * 0.1);
        }
        noTint();
        pop();
      }
    }

    // Spawn enemies after delay
    if (!wavePSpawned && millis() - warningStartTimeP >= warningDelayP) {
      for (let pt of warningPatternP.points) {
        let p = createPattern(pt.x, pt.y, petdirectionP);
        patGroup.add(p);
      }
      wavePSpawned = true;
    }

    // End wave once all enemies are gone
    if (wavePSpawned && patGroup.length === 0) {
      wavesofP--;
      wavePActive = false;
    }

    // Wrap pattern enemies around screen edges
    for (let i = 0; i < patGroup.length; i++) {
      let p = patGroup[i];
      if (p.position.x < 0) {
        p.position.x = 1500;
      } else if (p.position.x > 1500) {
        p.position.x = 0;
      }
    }
  }
}

function manageShooterWaves() {
  if (!waveSActive && wavesofS > 0) {
    warningPatternS = random(shooSpawnData.patterns);
    warningStartTimeS = millis();
    waveSActive = true;
    waveSSpawned = false;
  }

  if (waveSActive && !waveSSpawned && millis() - warningStartTimeS < warningDelayS) {
    for (let pt of warningPatternS.points) {
      push();
      tint(255, 168, 51, 100);
      image(shooimg, pt.x - 15, pt.y - 19, shooimg.width * 0.1, shooimg.height * 0.1);
      pop();
    }
  }

  if (waveSActive && !waveSSpawned && millis() - warningStartTimeS >= warningDelayS) {
    for (let pt of warningPatternS.points) {
      let s = createShooter(pt.x, pt.y);
      shooGroup.add(s);
    }
    waveSSpawned = true;
  }

  if (waveSActive && waveSSpawned && shooGroup.length === 0) {
    wavesofS--;
    waveSActive = false;
  }
}

// ───────────────────────────── COLLISIONS ──────────────────────────

function bulletHitsEnemy(bullet, enemy) {
    if (kamiGroup.contains(enemy)) {
        score += 10;
    } else if (patGroup.contains(enemy)) {
        score += 5;
    } else if (shooGroup.contains(enemy)) {
        score += 5;
    }
    bullet.remove();
    enemy.remove();
}

function playerHitsEnemy(player, enemy) {
    if (shooBullets.contains(enemy)) {
        hitpoints -= 5;
    } else if (kamiGroup.contains(enemy)) {
        hitpoints -= 10;
    } else if (patGroup.contains(enemy)) {
        hitpoints -= 5;
    } else if (shooGroup.contains(enemy)) {
        hitpoints -= 5;
    }
    enemy.remove();
}

// ───────────────────────────── PLAYER─────────────────────────────

function ui() {
  const barWidth = 200;
  const barHeight = 10;
  const x = 10;
  const y = 10;
  // Draw the health bar background
  noStroke();
  fill(30, 30, 30, 180);
  rect(x, y, barWidth, barHeight, 10);
  // Draw the health bar foreground
  noStroke();
  fill(50, 100, 255, 255);
  // Calculate the filled width based on hitpoints
  let filledWidth = map(hitpoints, 0, hitpointsMax, 0, barWidth);
  rect(x, y, filledWidth, barHeight, 10);
  console.log("HP:", hitpoints);
  fill(255);
  text("Stage " + currentStage + "\nLevel " + currentLevel, 10, 40);
}
// function keyPressed() { //changes bullet type
//     if (keyCode === 38 && bulletrotator < 2) bulletrotator++;
//     else if (keyCode === 40 && bulletrotator > 0) bulletrotator--;
// }

// ───────────────────────────── STAGE LOADER────────────────────────────
function stageLoader(stage, level) {
  console.log(`Loading Stage ${stage} Level ${level}`);

  // Clear groups and reset wave flags
  kamiGroup.removeSprites();
  patGroup.removeSprites();
  shooGroup.removeSprites();
  shooBullets.removeSprites();
  bullets.removeSprites();

  waveKActive = false;
  waveKSpawned = false;
  wavePActive = false;
  wavePSpawned = false;
  waveSActive = false;
  waveSSpawned = false;

  warningPatternK = null;
  warningPatternP = null;
  warningPatternS = null;
  warningStartTimeK = 0;
  warningStartTimeP = 0;
  warningStartTimeS = 0;

  const stageKey = String(stage);
  const levelKey = String(level);

  const stageObj = stageData.stages[stageKey];
  if (stageObj && stageObj[levelKey]) {
    const config = stageObj[levelKey];

    wavesofK = config.wavesofK;
    wavesofP = config.wavesofP;
    wavesofS = config.wavesofS;

    stageBgImg = stageBackgrounds[stageKey];
  }
  player.position.x = worldWidth / 2;
  player.position.y = height / 2;

  console.log("Stage loaded");
}



// ──────────────────────────── DRAW LOOP ────────────────────────────
function draw() {
  if (menuState === "main") {
    image(menuvid, 0, 0, width, height);
  } else if (menuState === "selectBullet") {
    image(menuvid, 0, 0, width, height);
    imageMode(CENTER);
    if (bulletrotator === 0) {
      image(pulse, 250, 200);
    } else if (bulletrotator === 1) {
      image(fracture, 250, 200);
    } else if (bulletrotator === 2) {
      image(gravetide, 250, 200);
    } imageMode(CORNER);
  } else if (menuState === "controls") {
    image(menuvid, 0, 0, width, height);
    image(controls, 0, 0, width, height);
  }
  imageMode(CORNER);
  if (state === 1) {
    menuvid.stop();
    menuvid.hide();
    menuvid.remove();
    background(0);
    if (!stageInitialized) {
      stageLoader(currentStage, currentLevel);
      stageInitialized = true;
    }
    
    if (waveKSpawned) {
      for (let k of kamiGroup) {
        k.attractionPoint(0.2, player.position.x, player.position.y);
        let dx = player.position.x - k.position.x;
        let dy = player.position.y - k.position.y;
        k.rotation = degrees(atan2(dy, dx));
      }
    }

    if (waveSSpawned) {
      let shooterWaitTime = 2000;
      for (let s of shooGroup) {
        if (s.lastShotTime === undefined) s.lastShotTime = 0;
        if (millis() - s.lastShotTime >= shooterWaitTime) {
          let k = createSprite(s.position.x, s.position.y, 5);
          k.shapeColor = color(255, 100, 100);
          let dx = player.position.x - s.position.x;
          let dy = player.position.y - s.position.y;
          let mag = sqrt(dx * dx + dy * dy);
          let bulletSpeed = 3;
          k.velocity.x = (dx / mag) * bulletSpeed;
          k.velocity.y = (dy / mag) * bulletSpeed;
          shooBullets.add(k);
          s.lastShotTime = millis();
        }
      }
    }

    if (bulletrotator == 1) {
        while (bullets.length > 200) {
            bullets[0].remove();
        }
    } else if (bulletrotator == 2) {
        while (bullets.length > 50) {
            bullets[0].remove();
        }
      } else if (bulletrotator == 0) {
        while (bullets.length > 70) {
            bullets[0].remove();
        }
      }
    bulletColor = color(137, 207, 240);
    if (keyIsDown(37)) {
      if (bulletrotator == 0) wlight(-12);
      else if (bulletrotator == 1) wmedium(-7, 1, -1);
      else if (bulletrotator == 2) wheavy(-6);
    } else if (keyIsDown(39)) {
      if (bulletrotator == 0) wlight(12);
      else if (bulletrotator == 1) wmedium(7, 1, -1);
      else if (bulletrotator == 2) wheavy(9);
    }
    bullets.collide(kamiGroup, bulletHitsEnemy);
    player.overlap(kamiGroup, playerHitsEnemy);
    bullets.collide(patGroup, bulletHitsEnemy);
    player.overlap(patGroup, playerHitsEnemy);
    bullets.collide(shooGroup, bulletHitsEnemy);
    player.overlap(shooGroup, playerHitsEnemy);
    player.overlap(shooBullets, playerHitsEnemy);
    bullets.overlap(shooBullets, bulletHitsEnemy);
    kamiGroup.collide(kamiGroup);
    patGroup.collide(patGroup);
    kamiGroup.collide(patGroup);
    shooGroup.collide(kamiGroup);
    shooGroup.collide(patGroup);

    player.velocity.x = 0;
    player.velocity.y = 0;
    if (keyIsDown(65)) {
      player.velocity.x = -playerSpeed;
      player.changeImage("left");
    }
    if (keyIsDown(68)) {
      player.velocity.x = playerSpeed;
      player.changeImage("right");
    }
    if (keyIsDown(87)) player.velocity.y = -4;
    if (keyIsDown(83)) player.velocity.y = 4;

    player.position.x = constrain(player.position.x, 0, worldWidth);
    player.position.y = constrain(player.position.y, 0, height);
    camX = constrain(player.position.x - width / 2, 0, worldWidth - width);

  if (stageBgImg) {
    for (let x = 0; x < worldWidth; x += stageBgImg.width) {
      image(stageBgImg, x - camX, 0, stageBgImg.width, height);
    }
  }

    push();
    translate(-camX, 0);
    drawSprites();
    manageKamikazeWaves();
    managePatternWaves();
    manageShooterWaves();
    pop();
    ui();
  if (wavesofK <= 0 && wavesofP <= 0 && wavesofS <= 0) {
    if (currentLevel === 3) {
      currentStage++;
      currentLevel = 1;
    } else {
      currentLevel++;
    }
    stageInitialized = false;
  }

  if (!stageInitialized) {
    stageLoader(currentStage, currentLevel);
    stageInitialized = true;
  }


  fill(255);
  textAlign(CENTER);
  text(`Y: ${player.position.y.toFixed(0)}`, width / 2, height - 100);
  text(`X: ${player.position.x.toFixed(0)}`, width / 2, height - 90);
  text(`Kamikaze Waves Remaining: ${wavesofK}`, width / 2, height - 80);
  text(`Pattern Waves Remaining: ${wavesofP}`, width / 2, height - 70);
  text(`Shooter Waves Remaining: ${wavesofS}`, width / 2, height - 60);
  text(`Player Hitpoints: ${hitpoints}`, width / 2, height - 50);
  fill(255);
  textAlign(LEFT, TOP);
  textSize(16);
  text("FPS: " + Math.round(frameRate()), 10, height - 20);
  textAlign(RIGHT, TOP);
  text(`Score: ${score}`, width - 10, 10);
  textAlign(LEFT, TOP);
  if (hitpoints <= 0) {
    textSize(50);
    fill(195, 34, 34);
    textAlign(CENTER, CENTER);
    text("SCORE: " + score, width / 2, height / 2 - 50);
    text("GAME OVER", width / 2, height / 2);
    textSize(20);
    text("Press R to restart (jk it does nothing)", width / 2, height / 2 + 50);
    noLoop();
  }
  }  else if (state === 0) {
  }
}