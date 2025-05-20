// ───────────────────────────── GLOBAL VARIABLES ─────────────────────────────
let playerleft, playerright, player, bulletColor, stageData, stageBgImg, startButton, controlsButton, leaderboardButton, backButton, rightArrow, leftArrow, nextButton, difficulty, font, menubg, controls, pulse, fracture, gravetide, menuvid, stageBackgrounds, menuTitle, username, deathSound, bulletStrong, bulletWeak, playerCollision, splashTimer, submitButton;
let score = 0, camX = 0, state = 0,bulletrotator = 0,lastShotTime = 0, finalScore = 0;
let petdirectionP = 1, currentStage = 1, currentLevel = 1;
let stageInitialized = false, gameOver = false, scoreSubmitted = false, isPaused = false, splashDone = false;
let playerSpeed = 5;
let hitpoints = 50; //current hitpoints
let hitpointsMax = 50; //max hitpoints on hard
let worldWidth = 1500;
let splashDuration = 3000;
let menuState = "main";
let leaderBoard = [["Pilot 1", 310], ["Pilot 2", 1105], ["Pilot 3", 2206]]; //just filling for the leaderboard
// Kamikaze enemy
let wavesofK = 5, waveKActive = false, waveKSpawned = false;
let warningStartTimeK = 0, warningDelayK = 1000, warningPatternK = null;
// Shooter enemy
let wavesofS = 5, waveSActive = false, waveSSpawned = false;
let warningStartTimeS = 0, warningDelayS = 1500, warningPatternS = null;
// Pattern enemy
let wavesofP = 5, wavePActive = false, wavePSpawned = false;
let warningStartTimeP = 0, warningDelayP = 1500, warningPatternP = null;
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
  stageBackgrounds = [
  null, // skipping 0
  loadImage('assets/stage 1 bg.png'),
  loadImage('assets/stage 2 bg.png'),
  loadImage('assets/stage 3 bg.png')];
  wlightimg = loadImage('assets/wlight.png')
  wmediumimg = loadImage('assets/wmedium.png')
  wheavyimg = loadImage('assets/wheavy.png')
  bulletStrong = loadSound('assets/bullet_strong.ogg');
  bulletWeak = loadSound('assets/bullet_weak.ogg');
  deathSound = loadSound('assets/death.ogg');
  enemyDeath = loadSound('assets/enemy_death.ogg')
  playerCollision = loadSound('assets/player_collision.ogg')
}
// ───────────────────────────── SETUP ─────────────────────────────
function setup() {
  canvas = createCanvas(800, 600);
  canvas.position(0,0);
  splashStartTime = millis();
  textFont(font)
  outputVolume(0.4); 
  bulletWeak.setVolume(0.1);
  bulletStrong.setVolume(0.1);
  enemyDeath.setVolume(0.1);
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
  menuTitle.hide();
  startButton = createMenuButton('START', 100, height / 2 - 100);
  startButton.hide();
  controlsButton = createMenuButton('CONTROLS',100, height / 2);
  controlsButton.hide();
  leaderboardButton = createMenuButton('LEADERBOARD',100, height / 2 + 100);
  leaderboardButton.hide();
  backButton = createMenuButton('BACK',100, height - 100);
  backButton.hide();
  nextButton = createMenuButton('NEXT',width - 200, height - 100);
  nextButton.hide();
  leftArrow = createMenuButton('<',75, height/2-125);
  leftArrow.hide();
  rightArrow = createMenuButton('>',415, height/2-125);
  rightArrow.hide();
  difficulty = createMenuButton('DIFFICULTY:<br>HARD',100, height - 250);
  difficulty.hide();
  //player.debug = true;
  bullets = new Group();
  kamiGroup = new Group();
  patGroup = new Group();
  shooGroup = new Group();
  shooBullets = new Group();
  startButton.mousePressed(() => {
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
    if (hitpointsMax === 50) {
      hitpointsMax = 100;
      difficulty.html('DIFFICULTY:<br>MEDIUM');
    } else if (hitpointsMax === 100) {
      hitpointsMax = 150;
      difficulty.html('DIFFICULTY:<br>EASY');
    } else if (hitpointsMax === 150) {
      hitpointsMax = 50;
      difficulty.html('DIFFICULTY:<br>HARD');
    }
    hitpoints = hitpointsMax;
  });
  nextButton.mousePressed(() => {
    state = 1;
    nextButton.hide();
    leftArrow.hide();
    rightArrow.hide();
    difficulty.hide();
    backButton.hide();
    menuvid.stop();
    menuvid.hide();
    menuState = "";
  });
  controlsButton.mousePressed(() => {
    menuState = "controls";
    backButton.show();
    startButton.hide();
    controlsButton.hide();
    leaderboardButton.hide();
    menuTitle.hide();
  });
  backButton.mousePressed(() => {
    showMainMenu();
});
  leaderboardButton.mousePressed(() => {
    startButton.hide();
    controlsButton.hide();
    leaderboardButton.hide();
    menuTitle.hide();
    backButton.show();
    menuState = "leaderboard";
  });

}
// ───────────────────────────── WEAPONS ─────────────────────────────
function wlight(direction) {
  const wlightCoolDown = 50;
  if (millis() - lastShotTime > wlightCoolDown) {
    let w = createSprite(player.position.x, player.position.y, 5);
    w.addImage(wlightimg);
    w.velocity.x = direction;
    w.damage = 2;
    bullets.add(w);
    bulletWeak.play();
    lastShotTime = millis();
  }
}
function wmedium(direction, y1, y2) {
  let angles = [y1, 0, y2];
  const wMediumCoolDown = 50;
  if (millis() - lastShotTime > wMediumCoolDown) {
    for (let i = 0; i < angles.length; i++) {
      let w = createSprite(player.position.x, player.position.y, 7);
      w.addImage(wmediumimg);
      w.velocity.x = direction;
      w.velocity.y = angles[i];
      w.damage = 1;
      bullets.add(w);
    }
    lastShotTime = millis();
    bulletWeak.play();
  }
}
function wheavy(direction) {
  const shotCooldown = 200;
  if (millis() - lastShotTime > shotCooldown) {
      let w = createSprite(player.position.x, player.position.y, 5);
      w.addImage(wheavyimg);
      w.velocity.x = direction;
      w.damage = 4;
      bullets.add(w);
      lastShotTime = millis();
      bulletStrong.play();
  }
}
// ───────────────────────────── ENEMIES ─────────────────────────────
function createKami(x, y) {
  let k = createSprite(x, y, 15);
  k.addImage(kamiimg);
  k.scale = 0.1;
  k.shapeColor = color(255, 0, 0);
  k.friction = 0.1;
  k.setCollider("circle", 0, 0, 70);
  k.hp = 2;
  return k;
}
function createPattern(x, y, direction) {
  let p = createSprite(x, y, 15);
  p.addImage(direction === -1 ? patimg : patimg2);
  p.scale = 0.1;
  p.shapeColor = color(255, 0, 0);
  p.velocity.x = direction * 2.5;
  p.hp = 4;
  return p;
}
function createShooter(x, y) {
  let s = createSprite(x, y, 15);
  s.addImage(shooimg);
  s.scale = 0.1;
  s.shapeColor = color(0, 255, 0);
  s.immovable = true;
  s.hp = 6;
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
    while (kamiGroup.length > 10) {
      kamiGroup[0].remove();
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
      while (patGroup.length > 10) {
        patGroup[0].remove();
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
    while (shooGroup.length > 6) {
      shooGroup[0].remove();
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
  bullet.remove();
  enemy.hp -= bullet.damage
  if (shooBullets.contains(enemy)) {
    enemy.remove();
  }
  if (enemy.hp <= 0) {
    if (kamiGroup.contains(enemy)) score += 10;
    else if (patGroup.contains(enemy)) score += 5;
    else if (shooGroup.contains(enemy)) score += 5;

    enemy.remove();
    enemyDeath.play();
  }
}
function playerHitsEnemy(player, enemy) {
  if (shooBullets.contains(enemy)) {
    hitpoints -= 10;
  } else if (kamiGroup.contains(enemy)) {
    hitpoints -= 15;
  } else if (patGroup.contains(enemy)) {
    hitpoints -= 10;
  } else if (shooGroup.contains(enemy)) {
    hitpoints -= 10;
  }
  enemy.remove();
  playerCollision.play();
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
  fill(255);
  text("Stage " + currentStage + "\nLevel " + currentLevel, 10, 40);
}
// ───────────────────────────── MENU STUFF ─────────────────────────────
function createMenuButton(label, x, y) {
  const btn = createButton(label);
  btn.style("all", "unset");
  btn.style("font-size", `50px`);
  btn.style("color", "white");
  btn.style("cursor", "pointer");
  btn.style("font-family", "Rubik Glitch");
  btn.position(x, y);
  btn.mouseOver(() => btn.style("color", "#e0f7fa"));
  btn.mouseOut(() => btn.style("color", "white"));
  return btn;
}
function submitScore() {
  username = createInput('Pilot');
  username.position(width / 2 - 110, height / 2 - 50);
  username.size(200);
  username.attribute('placeholder', 'Pilot Name');
  submitButton = createButton('Submit');
  submitButton.position(width / 2 - 40, height / 2);
  submitButton.mousePressed(() => {
    let name = username.value().trim();
    leaderBoard.push([name, score]);
    score = 0;
    username.remove();
    submitButton.remove();
    menuState = "leaderboard";
    scoreSubmitted = true; 
  });
}
function showMainMenu() {
  menuState = "main";
  image(menubg, 0, 0, width, height);
  menuvid.loop();
  // Show main menu elements
  menuTitle.show();
  startButton.show();
  controlsButton.show();
  leaderboardButton.show();
  // Hide everything else
  backButton.hide();
  nextButton.hide();
  leftArrow.hide();
  rightArrow.hide();
  difficulty.hide();
}
function keyPressed() {
  if (keyCode === 27 && !gameOver) { // Escape key
    isPaused = !isPaused;
  }
  if (keyCode === 82) { // R key
    if (scoreSubmitted === true) {
      scoreSubmitted = false;
      gameOver = false;
      isPaused = false;
      hitpoints = hitpointsMax;
      menuState = "main";
      showMainMenu();
      state = 0;
      currentStage = 1;
      currentLevel = 1;
      stageInitialized = false;
    }
  }
}
// ───────────────────────────── STAGE LOADER────────────────────────────
function stageLoader(stage, level) {
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
}
// ──────────────────────────── DRAW LOOP ────────────────────────────
function draw() {
if (!splashDone) {
    background(0);
    fill(255);
    textSize(48);
    textAlign(CENTER, CENTER);
    text("PROJECT SSR", width / 2, height / 2);
    if (millis() - splashStartTime >= splashDuration) {
      splashDone = true;
      showMainMenu();
    }
    return;
  }
  if (state === 0) {
    if (menuState === "main") {
      image(menuvid, 0, 0, width, height);
    } else if (menuState === "selectBullet") {
      image(menuvid, 0, 0, width, height);
      imageMode(CENTER);
      fill(355)
      textSize(20)
      textAlign(CENTER, CENTER);
      if (bulletrotator === 0) {
        image(pulse, 250, 200);
        text('Shoots a rapid string of bullets, \n it deals medium damage but is \neffective in rapidly \ndamaging enemies.', width /2 + 225, height /2 -100)
      } else if (bulletrotator === 1) {
        image(fracture, 250, 200);
        text('Shoots a spread of bullets, \n it deals light damage but is \neffective in damaging many\n enemies at once.', width /2 + 225, height /2 -100)
      } else if (bulletrotator === 2) {
        image(gravetide, 250, 200);
        text('Shoots a slow stream of bullets, \n it deals heavy damage.\n If accurate you will destory \nenemies quickly.', width /2 + 225, height /2 -100)
      } imageMode(CORNER);
    } else if (menuState === "controls") {
      image(menuvid, 0, 0, width, height);
      image(controls, 0, 0, width, height);
    }
    imageMode(CORNER);
    if (menuState === "leaderboard") {
      textAlign(CENTER, CENTER);
      textSize(50);
      fill(255);
      text("LEADERBOARD", width / 2, height / 2 - 200);
      for (let i = 0; i < leaderBoard.length; i++) {
        let entry = leaderBoard[i];
        let name = entry[0];
        let score = entry[1];
        let y = height / 2 - 100 + i * 50;
        textSize(30);
        fill(255);
        textAlign(CENTER);
        text(name + ": " + score, width / 2, y);
      }
      textAlign(LEFT);

    }
  }
  if (state === 1) {
    if (!isPaused) {
      background(0);
      // if the stage isn't loaded we get the current stage and level to load
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
        let shooterWaitTime = 1000;
        for (let s of shooGroup) {
          if (s.lastShotTime === undefined) s.lastShotTime = 0;
          if (millis() - s.lastShotTime >= shooterWaitTime) {
            let k = createSprite(s.position.x, s.position.y, 5);
            k.shapeColor = color(255, 100, 100);
            let dx = player.position.x - s.position.x;
            let dy = player.position.y - s.position.y;
            let distToPlayer = sqrt(dx * dx + dy * dy);

            let bulletSpeed = 3;
            k.velocity.x = (dx / distToPlayer) * bulletSpeed;
            k.velocity.y = (dy / distToPlayer) * bulletSpeed;

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
        else if (bulletrotator == 2) wheavy(-9);
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
    fill(255);
    textAlign(LEFT, TOP);
    textSize(16);
    text("FPS: " + Math.round(frameRate()), 10, height - 20);
    textAlign(RIGHT, TOP);
    text(`Score: ${score}`, width - 10, 10);
    textAlign(RIGHT, BOTTOM);
    const enemiesRemaining = wavesofK + wavesofP + wavesofS
    text(`Enemies Waves Remaining: ${enemiesRemaining}`, width - 10, height - 10)
    textAlign(LEFT, TOP);
    // Game Over screen & Leaderboard logging
    }
    if (currentStage === 3 && currentLevel === 3){
      isPaused = true;
      textSize(50);
      fill(255)
      textAlign(CENTER, CENTER);
      text("YOU WON!", width / 2, height / 2);
      text("Press R to restart", width / 2, height / 2 + 50);
      if (!scoreSubmitted && !submitButton) {
        submitScore();
      }
    }
    if (hitpoints <= 0 && !gameOver) {
      deathSound.play();
      isPaused = true;
      finalScore = score;
      gameOver = true;
      textSize(50);
      fill(195, 34, 34);
      textAlign(CENTER, CENTER);
      text("SCORE: " + finalScore, width / 2, height / 2 - 50);
      text("GAME OVER", width / 2, height / 2);
      textSize(20);
      text("Press R to restart", width / 2, height / 2 + 50);
      if (!scoreSubmitted && !submitButton) {
        submitScore();
      }
    }
  }
}