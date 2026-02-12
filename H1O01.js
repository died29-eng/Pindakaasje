// ================= ACHTERGROND & GROND =================
let bgImages = [], bgX = 0, bgSpeed = 2.0, currentIndex = 0;
let groundImage, groundX = 0, groundSpeed = 7.8, groundY = 540;

// ================= SYSTEEM =================
let cnv; // Variabele voor centreren
let logoImage, screen = "start";
let playButton, endlessButton, characterButton, levelsButton, backButton, jumpButton, slideButton;
let infoBtn; // NIEUW: Info knop
let showInfo = false; // NIEUW: Status instructies
let levelButtons = [];
let retryBtn, menuBtn, mainStartBtn;
let currentLevel = 1; 

// ================= SCORE & ITEMS =================
let totalPeanuts = 0;    
let sessionPeanuts = 0;  
let peanutImage;
let items = [];          

// ================= ENDLESS SPECIFIEK =================
let endlessTimer = 0;
let highscore = 0;
let lastSpeedIncrease = 0;

// ================= SPELER =================
let playerSprites = [], playerSlideImage, playerFrame = 0, playerFrameSpeed = 0.2;
let playerX = 150, playerY;
let playerWidth = 230, playerHeight = 230; 
let playerFeetOffset = 60, isSliding = false, playerVelocityY = 0;
let gravity = 1.1, playerJumpStrength = 27; 
let isOnGround = true;

// ================= OBSTAKELS DATA =================
let obstacles = [];
let obstacleIndex = 0; 
let levelObstacleSequence = []; 
let distanceCounter = 0;
let screenGap = 1800; 

let spikeImage, spikeImage2, platformImage, ballImage;
let bladeImage, chainImage, stickImage, block1Image;
let block3Image, block4Image, groundSawImage, flagImage;
let flagSpawned = false;

// ================= PRELOAD =================
function preload() {
  logoImage = loadImage("images/AFBEELDING_LOGO_1.png");
  bgImages.push(loadImage("images/AFBEELDING_ACHTERGROND_1.png"));
  bgImages.push(loadImage("images/AFBEELDING_ACHTERGROND_2.png"));
  bgImages.push(loadImage("images/AFBEELDING_ACHTERGROND_3.png"));
  groundImage = loadImage("images/AFBEELDING_GROND_1.png");
  peanutImage = loadImage("images/AFBEELDING_PINDA_1.png");

  for (let i = 1; i <= 10; i++) {
    playerSprites.push(loadImage(`images/AFBEELDING_PINDA_LOPEND_${i}.png`));
  }
  playerSlideImage = loadImage("images/AFBEELDING_PINDA_LIGGEND_1.png");

  spikeImage = loadImage("images/SPIKES_1.png");
  spikeImage2 = loadImage("images/spikes_2.png");
  platformImage = loadImage("images/AFBEELDING_PLATFORM_1.png");
  ballImage = loadImage("images/AFBEELDING_BAL_1.png");
  bladeImage = loadImage("images/swinging_blade_1.png");
  chainImage = loadImage("images/long_chain_piece_1.png");
  stickImage = loadImage("images/swinging_spike_stick.png");
  block1Image = loadImage("images/AFBEELDING_BLOK_1.png");
  block3Image = loadImage("images/AFBEELDING_BLOK_3.png");
  block4Image = loadImage("images/AFBEELDING_BLOK_4.png");
  groundSawImage = loadImage("images/blade_1.png");
  flagImage = loadImage("images/VLAG_1.png");
}

// ================= SETUP =================
function setup() {
  cnv = createCanvas(1000, 700);
  centerCanvas();
  
  playButton = { w: 300, h: 70, x: width/2 - 150, y: height/2 + 50 };
  endlessButton = { w: 300, h: 70, x: width/2 - 150, y: height/2 };
  characterButton = { w: 300, h: 70, x: width/2 - 150, y: height/2 - 100 };
  levelsButton = { w: 300, h: 70, x: width/2 - 150, y: height/2 + 100 };
  backButton = { w: 60, h: 60, x: 920, y: 20 };
  jumpButton = { w: 90, h: 90, x: width - 110, y: height - 110 };
  slideButton = { w: 90, h: 90, x: 20, y: height - 110 };
  infoBtn = { w: 50, h: 50, x: 20, y: 20 }; // Info knop positie linksboven

  retryBtn = { w: 300, h: 60, x: width/2 - 150, y: height/2 - 20 };
  menuBtn = { w: 300, h: 60, x: width/2 - 150, y: height/2 + 60 };
  mainStartBtn = { w: 300, h: 60, x: width/2 - 150, y: height/2 + 140 };

  for (let i = 0; i < 3; i++) {
    levelButtons.push({ w: 220, h: 60, x: width/2 - 110, y: 250 + i * 85, label: "Level " + (i + 1), id: i + 1 });
  }
  
  resetGame(1);
}

// Functies voor centreren
function centerCanvas() {
  let x = (windowWidth - width) / 2;
  let y = (windowHeight - height) / 2;
  cnv.position(x, y);
}

function windowResized() {
  centerCanvas();
}

function resetGame(levelNum) {
  currentLevel = levelNum;
  playerY = groundY - playerHeight + playerFeetOffset;
  playerVelocityY = 0;
  obstacles = [];
  items = [];
  obstacleIndex = 0;
  distanceCounter = 0;
  flagSpawned = false;
  bgX = 0;
  isSliding = false;
  endlessTimer = 0;
  sessionPeanuts = 0;
  lastSpeedIncrease = millis();

  let totalCases = 11;
  screenGap = 1800; 

  if (levelNum === 0) {
    groundSpeed = 6.0; 
    totalCases = 50;   
  } else if (levelNum === 1) { 
    groundSpeed = 7.8; 
    totalCases = 11; 
  } else if (levelNum === 2) { 
    groundSpeed = 9.0; 
    totalCases = 20; 
  } else if (levelNum === 3) { 
    groundSpeed = 10.0; 
    totalCases = 35;    
    screenGap = 2200;   
  }

  levelObstacleSequence = [];
  for (let i = 0; i < totalCases; i++) {
    levelObstacleSequence.push(floor(random(2, 12))); 
  }
}

// ================= DRAW LOOP =================
function draw() {
  let nextIndex = (currentIndex + 1) % bgImages.length;
  image(bgImages[currentIndex], bgX, 0, width, height);
  image(bgImages[nextIndex], bgX + width, 0, width, height);
  
  if (screen !== "gameover" && screen !== "win" && !showInfo) {
    bgX -= bgSpeed;
    if (bgX <= -width) { bgX = 0; currentIndex = nextIndex; }
  }

  if (screen === "start") drawStartScreen();
  else if (screen === "menu") drawMenu();
  else if (screen === "levels") drawLevels();
  else if (screen === "play") drawLevelLoop();
  else if (screen === "gameover") drawEndScreen("GAME OVER", color(255, 0, 0));
  else if (screen === "win") drawEndScreen("LEVEL VOLTOOID!", color(0, 255, 0));

  if (screen !== "start") {
    drawTotalPeanutsHUD();
    drawInfoButton(); 
  }

  if (showInfo) drawInstructionOverlay(); 
}

function drawInfoButton() {
  fill(150, 0, 200); // Paars
  rect(infoBtn.x, infoBtn.y, infoBtn.w, infoBtn.h, 10);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(30);
  text("?", infoBtn.x + infoBtn.w/2, infoBtn.y + infoBtn.h/2);
}

function drawInstructionOverlay() {
  fill(0, 240);
  rect(0, 0, width, height);
  fill(255);
  textAlign(CENTER);
  textSize(40);
  fill(255, 204, 0);
  text("SPEL INSTRUCTIES:", width/2, 80);
  
  fill(255);
  textSize(20);
  textAlign(LEFT);
  let tx = 150;
  
  // Algemene besturing
  fill(180, 100, 255); text(" BEDIENING (Alle modes)", tx, 150);
  fill(255);
  text("- W-toets / Groene knop: Springen", tx + 30, 185);
  text("- S-toets / Blauwe knop: Sliden", tx + 30, 215);
  
  // Endless Instructies
  fill(180, 100, 255); text("♾ ENDLESS MODE", tx, 280);
  fill(255);
  text("- Overleef zo lang mogelijk. De snelheid neemt toe!", tx + 30, 310);
  text("- Probeer je eigen Highscore (tijd) te verbreken.", tx + 30, 340);

  // Level Instructies
  fill(180, 100, 255); text("🚩 LEVELS MODE", tx, 405);
  fill(255);
  text("- Bereik de finishvlag aan het einde van de baan.", tx + 30, 435);
  text("- Ontwijk obstakels; één fout is 'Game Over'.", tx + 30, 465);

  // Algemeen Doel
  fill(255, 100, 0); text("🥜 PINDAKAASJES VERZAMELEN", tx, 530);
  fill(255);
  text("- Pak pindakaasjes voor je totaalscore die je altijd middenboven ziet!", tx + 30, 560);

  textAlign(CENTER);
  fill(150, 0, 200);
  textSize(24);
  text("Klik ergens om te sluiten", width/2, 640);
}

function drawTotalPeanutsHUD() {
    push();
    rectMode(CENTER);
    imageMode(CENTER);
    textAlign(CENTER, CENTER);
    fill(0, 150);
    rect(width/2, 45, 220, 50, 15);
    image(peanutImage, width/2 - 80, 45, 35, 35);
    fill(255);
    textSize(22);
    text("TOTAAL: " + totalPeanuts, width/2 + 15, 47);
    pop();
}

function drawLevelLoop() {
  if (showInfo) return;

  if (currentLevel === 0) {
    endlessTimer += 1/60; 
    if (millis() - lastSpeedIncrease > 1000) {
      groundSpeed += 0.05;
      lastSpeedIncrease = millis();
    }
    if (obstacleIndex > levelObstacleSequence.length - 5) {
      for(let i=0; i<10; i++) levelObstacleSequence.push(floor(random(2, 12)));
    }
  }

  spawnObstacleScreens();
  updateObstacles(true); 
  updateItems();

  image(groundImage, groundX, groundY);
  image(groundImage, groundX + groundImage.width, groundY);
  groundX -= groundSpeed;
  if (groundX <= -groundImage.width) groundX = 0;
  
  updateObstacles(false);
  checkCollisions(); 

  drawBackButton(); drawJumpButton(); drawSlideButton();
  
  // VERPLAATST: HUD teksten lager gezet om ruimte te maken voor de ? knop
  if (currentLevel === 0) {
    fill(255); textSize(32); textAlign(LEFT);
    text("TIJD: " + floor(endlessTimer) + "s", 30, 100); 
    textSize(20);
    text("SNELHEID: " + groundSpeed.toFixed(1), 30, 130);
  }

  fill(255, 220, 0); textSize(24); textAlign(LEFT);
  image(peanutImage, 30, 160, 30, 30);
  text(": " + sessionPeanuts, 65, 180);

  if (!isSliding) playerFrame = (playerFrame + playerFrameSpeed) % playerSprites.length;
  
  let oldPlayerBottom = playerY + playerHeight - playerFeetOffset;
  playerVelocityY += gravity;
  playerY += playerVelocityY;

  let onObject = false;
  let playerBottom = playerY + playerHeight - playerFeetOffset;

  for (let o of obstacles) {
    if (o.img === platformImage || o.img === block3Image) {
      let collisionMargin = (o.img === block3Image) ? 120 : o.w; 
      let centerX = o.x + o.w / 2;
      if (playerX + playerWidth * 0.5 > centerX - (collisionMargin/2) && 
          playerX + playerWidth * 0.5 < centerX + (collisionMargin/2)) {
        let landingPoint = (o.img === platformImage) ? o.y + 105 : o.y + 130; 
        if (playerVelocityY > 0 && oldPlayerBottom <= landingPoint + 20 && playerBottom >= landingPoint - 15) {
          playerY = landingPoint - (playerHeight - playerFeetOffset);
          playerVelocityY = 0;
          isOnGround = true;
          onObject = true;
        }
      }
    }
  }

  let floorLimit = groundY - playerHeight + playerFeetOffset;
  if (playerY >= floorLimit) {
    playerY = floorLimit; playerVelocityY = 0; isOnGround = true; onObject = true;
  }
  if (!onObject) isOnGround = false;

  if (isSliding) image(playerSlideImage, playerX, playerY + 80, playerWidth * 1.1, playerHeight * 0.6);
  else image(playerSprites[floor(playerFrame)], playerX, playerY, playerWidth, playerHeight);
}

// ================= SPAWNING =================
function spawnObstacleScreens() {
  if (screen === "gameover" || screen === "win") return;
  distanceCounter += groundSpeed;
  if (distanceCounter < screenGap) return;
  distanceCounter = 0;
  
  if (obstacleIndex < levelObstacleSequence.length) {
    let type = levelObstacleSequence[obstacleIndex];
    createObstacleByType(type);
    obstacleIndex++;
  } else if (!flagSpawned && currentLevel !== 0) {
    obstacles.push({ img: flagImage, x: width + 300, y: groundY - 300, w: 200, h: 320, isFinish: true });
    flagSpawned = true;
  }
}

function spawnPeanutRow(x, y, count) {
    for(let i=0; i<count; i++) {
        items.push({ x: x + i*70, y: y, w: 50, h: 50 });
    }
}

function createObstacleByType(type) {
  let startX = width + 100;
  switch(type) {
    case 2: 
        obstacles.push({ img: spikeImage, x: startX, y: groundY - 80, w: 140, h: 80 }, { img: spikeImage, x: startX + 450, y: groundY - 80, w: 140, h: 80 }); 
        spawnPeanutRow(startX + 180, groundY - 180, 3);
        break;
    case 3: 
        obstacles.push({ img: ballImage, x: startX, y: groundY - 140, w: 140, h: 140, speed: 5 }); 
        spawnPeanutRow(startX + 50, groundY - 250, 2);
        break;
    case 4: 
        for(let i=0; i<2; i++) { 
            obstacles.push({ img: platformImage, x: startX + i*600, y: groundY - 280, w: 480, h: 250 }, { img: spikeImage2, x: startX + i*600 + 40, y: groundY - 80, w: 400, h: 80 }); 
            spawnPeanutRow(startX + i*600 + 150, groundY - 330, 3);
        } 
        break;
    case 5: 
        for(let i=0; i<2; i++) obstacles.push({ type: "blade", x: startX + i*550, targetY: 310 }); 
        spawnPeanutRow(startX, groundY - 100, 3);
        break;
    case 6: 
        for(let i=0; i<2; i++) obstacles.push({ type: "stick", x: startX + i*500, targetY: 350 }); 
        spawnPeanutRow(startX + 200, groundY - 150, 2); 
        break;
    case 7: 
        let bx = startX; 
        for(let j=0; j<3; j++) { 
            obstacles.push({ img: block1Image, x: bx, y: groundY - 150, w: 330, h: 230 }); 
            spawnPeanutRow(bx + 100, groundY - 220, 1);
            bx += 450; 
        } 
        break;
    case 8: 
      obstacles.push({ img: block3Image, x: startX, y: groundY - 270, w: 550, h: 400 }); 
      obstacles.push({ img: block3Image, x: startX + 1000, y: groundY - 270, w: 550, h: 400 });
      spawnPeanutRow(startX + 200, groundY - 350, 2);
      spawnPeanutRow(startX + 1200, groundY - 350, 2);
      break;
    case 9: 
        obstacles.push({ img: ballImage, x: startX, y: -200, w: 150, h: 150, velY: 8, speed: 0, stopAtGround: true }, { img: ballImage, x: startX + 550, y: -500, w: 150, h: 150, velY: 8, speed: 0, stopAtGround: true }); 
        spawnPeanutRow(startX + 200, groundY - 100, 3);
        break;
    case 10: 
        obstacles.push({ img: block4Image, x: startX, y: -490, w: 950, h: 1300 }); 
        break;
    case 11: 
        for(let i=0; i<3; i++) obstacles.push({ img: groundSawImage, x: startX + i*500, y: groundY - 60, w: 160, h: 110, speed: 0, behindGround: true }); 
        spawnPeanutRow(startX + 200, groundY - 200, 4);
        break;
  }
}

// ================= UPDATE & COLLISIONS =================
function updateItems() {
    for (let i = items.length - 1; i >= 0; i--) {
        let it = items[i];
        if (screen === "play") it.x -= groundSpeed;
        image(peanutImage, it.x, it.y, it.w, it.h);
        if (collideRectRect(playerX + 60, playerY + 60, playerWidth - 120, playerHeight - 120, it.x, it.y, it.w, it.h)) {
            sessionPeanuts++;
            totalPeanuts++;
            items.splice(i, 1);
        } else if (it.x < -100) {
            items.splice(i, 1);
        }
    }
}

function checkCollisions() {
  let pHitX = playerX + 100;
  let pHitY = isSliding ? playerY + 120 : playerY + 40; 
  let pHitW = playerWidth - 200;
  let pHitH = isSliding ? playerHeight - 145 : playerHeight - 80;

  for (let o of obstacles) {
    let hit = false;
    if (o.img === spikeImage || o.img === spikeImage2 || o.img === groundSawImage) hit = collideRectRect(pHitX, pHitY, pHitW, pHitH, o.x + 45, o.y + 40, o.w - 90, o.h - 40);
    else if (o.img === ballImage) hit = collideRectRect(pHitX, pHitY, pHitW, pHitH, o.x + 45, o.y + 45, o.w - 90, o.h - 90);
    else if (o.type === "blade" || o.type === "stick") {
      hit = collideRectRect(pHitX, pHitY, pHitW, pHitH, o.x + 25, 0, 10, o.targetY);
      if (!hit) { let imgW = (o.type === "blade") ? 250 : 300; hit = collideRectRect(pHitX, pHitY, pHitW, pHitH, o.x - (imgW/2) + 80, o.targetY, imgW - 160, 110); }
    }
    else if (o.img === block1Image) hit = collideRectRect(pHitX, pHitY, pHitW, pHitH, o.x + 150, o.y + 80, o.w - 300, o.h - 100);
    else if (o.img === block4Image) hit = collideRectRect(pHitX, pHitY, pHitW, pHitH, o.x + 380, o.y + 800, o.w - 760, 110);
    else if (o.img === block3Image) { 
      let blockTop = o.y + 130; 
      if (playerY + playerHeight - playerFeetOffset > blockTop + 15) {
        hit = collideRectRect(pHitX, pHitY, pHitW, pHitH, o.x + 150, o.y + 180, o.w - 300, o.h - 220);
      }
    }
    else if (o.isFinish) { if (collideRectRect(pHitX, pHitY, pHitW, pHitH, o.x + 80, o.y, o.w - 160, o.h)) { screen = "win"; return; } }
    
    if (hit) {
      if (currentLevel === 0 && endlessTimer > highscore) highscore = floor(endlessTimer);
      screen = "gameover";
    }
  }
}

function updateObstacles(drawBehind) {
  if (screen === "gameover" || screen === "win") {
    for (let o of obstacles) { if ((drawBehind && o.behindGround) || (!drawBehind && !o.behindGround)) drawSingleObstacle(o); }
    return;
  }
  for (let i = obstacles.length - 1; i >= 0; i--) {
    let o = obstacles[i];
    if (drawBehind) { o.x -= groundSpeed + (o.speed || 0); if (o.velY) { o.y += o.velY; if (o.stopAtGround && o.y + o.h >= groundY) { o.y = groundY - o.h; o.velY = 0; } } }
    if ((drawBehind && o.behindGround) || (!drawBehind && !o.behindGround)) drawSingleObstacle(o);
    if (drawBehind && o.x < -2000) obstacles.splice(i, 1);
  }
}

function drawSingleObstacle(o) {
    if (o.type === "blade" || o.type === "stick") {
        let cy = 0; while (cy < o.targetY) { image(chainImage, o.x, cy, 60, 35); cy += 30; }
        let img = (o.type === "blade") ? bladeImage : stickImage;
        let imgW = (o.type === "blade") ? 250 : 300; let imgH = (o.type === "blade") ? 150 : 100;
        image(img, o.x - (imgW/2) + 40, o.targetY, imgW, imgH);
    } else image(o.img, o.x, o.y, o.w, o.h);
}

function collideRectRect(x, y, w, h, x2, y2, w2, h2) { return x + w > x2 && x < x2 + w2 && y + h > y2 && y < y2 + h2; }

// ================= UI & INPUT =================
function drawEndScreen(titel, kleur) {
  fill(0, 180); rect(0, 0, width, height);
  fill(kleur); textSize(70); textAlign(CENTER, CENTER); text(titel, width/2, height/2 - 120);
  
  if (currentLevel === 0) {
    fill(255); textSize(32);
    text("JOUW TIJD: " + floor(endlessTimer) + "s", width/2, height/2 - 200);
    text("HIGHSCORE: " + highscore + "s", width/2, height/2 - 165);
  } else {
    fill(255); textSize(32);
    text("PINDAKAASJES GEVONDEN: " + sessionPeanuts, width/2, height/2 - 200);
  }

  drawButton(retryBtn, "OPNIEUW", color(255, 200, 0));
  drawButton(menuBtn, "LEVEL MENU", color(0, 120, 255));
  drawButton(mainStartBtn, "START", color(0, 200, 0));
}

function drawButton(btn, label, col) {
  fill(col); rect(btn.x, btn.y, btn.w, btn.h, 15);
  fill(255); textAlign(CENTER, CENTER); textSize(24); text(label, btn.x + btn.w/2, btn.y + btn.h/2);
}
function drawBackButton() { drawButton(backButton, "X", color(220, 0, 0)); }
function drawJumpButton() { drawButton(jumpButton, "↑", color(0, 180, 0)); }
function drawSlideButton() { drawButton(slideButton, "↓", color(0, 0, 200)); }
function drawStartScreen() { image(logoImage, width/2 - 350, 40, 700, 350); drawButton(playButton, "START", color(255, 200, 0)); }
function drawMenu() { drawButton(endlessButton, "Endless", color(0, 180, 0)); drawButton(characterButton, "Karakter", color(150, 0, 200)); drawButton(levelsButton, "Levels", color(0, 120, 255)); drawBackButton(); }
function drawLevels() { fill(255); textSize(40); textAlign(CENTER); text("SELECTEER LEVEL", width/2, 120); for (let btn of levelButtons) drawButton(btn, btn.label, color(0, 120, 255)); drawBackButton(); }

function mousePressed() {
  if (showInfo) {
    showInfo = false;
    return;
  }
  if (screen !== "start" && inside(infoBtn)) {
    showInfo = true;
    return;
  }
  if (screen === "start" && inside(playButton)) screen = "menu";
  else if (screen === "menu") { 
    if (inside(backButton)) screen = "start"; 
    if (inside(levelsButton)) screen = "levels";
    if (inside(endlessButton)) { resetGame(0); screen = "play"; } 
  }
  else if (screen === "levels") { 
    if (inside(backButton)) screen = "menu"; 
    for (let btn of levelButtons) { if (inside(btn)) { resetGame(btn.id); screen = "play"; } }
  }
  else if (screen === "play") { if (inside(backButton)) screen = "levels"; if (inside(jumpButton)) jump(); if (inside(slideButton)) isSliding = true; }
  else if (screen === "gameover" || screen === "win") {
    if (inside(retryBtn)) { resetGame(currentLevel); screen = "play"; }
    if (inside(menuBtn)) screen = "levels";
    if (inside(mainStartBtn)) screen = "start";
  }
}
function mouseReleased() { isSliding = false; }
function keyPressed() { if (screen === "play") { if (key === 'w' || key === 'W') jump(); if (key === 's' || key === 'S') isSliding = true; } }
function keyReleased() { if (key === 's' || key === 'S') isSliding = false; }
function jump() { if (isOnGround) { playerVelocityY = -playerJumpStrength; isOnGround = false; } }
function inside(btn) { return mouseX > btn.x && mouseX < btn.x + btn.w && mouseY > btn.y && mouseY < btn.y + btn.h; }