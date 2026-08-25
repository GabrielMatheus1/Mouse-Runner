const canvas = document.querySelector("#gameCanvas");
const ctx = canvas.getContext("2d");

const scoreEl = document.querySelector("#score");
const bestScoreEl = document.querySelector("#bestScore");
const startButton = document.querySelector("#startButton");
const pauseButton = document.querySelector("#pauseButton");
const restartButton = document.querySelector("#restartButton");
const overlay = document.querySelector("#messagePanel");
const overlayButton = document.querySelector("#overlayButton");
const duckTouchButton = document.querySelector("#duckTouchButton");
const jumpTouchButton = document.querySelector("#jumpTouchButton");

const WORLD_WIDTH = 960;
const WORLD_HEIGHT = 360;
const GROUND_Y = 292;
const STORAGE_KEY = "rato-run-best-score";
const BIRD_ENTRY_X = WORLD_WIDTH + 64;
const BIRD_MIN_SCORE = 160;
const BIRD_OBSTACLE_CLEARANCE = 360;
const BIRD_TO_BIRD_CLEARANCE = 560;
const NIGHT_START_SCORE = 2000;
const NIGHT_END_SCORE = 2500;
const DAY_RETURN_DELAY_SCORE = 180;
const DAY_RETURN_SPAN_SCORE = 520;
const RUNNER_START_X = 102;
const RUNNER_BOSS_X = 190;
const CAT_BOSS_HIDDEN_X = -360;
const CAT_BOSS_VISIBLE_X = -152;
const BOSS_REVEAL_SCORE_SPAN = 220;
const BOSS_PIPE_SCORE_DELAY = 520;
const BOSS_CAT_LEFT_BEHIND_TIME = 90;
const BOSS_CAT_PIPE_STOP_TIME = 132;
const BOSS_ATTACK_READY_AMOUNT = 0.72;
const BOSS_ATTACK_INITIAL_COOLDOWN = 118;
const BOSS_ATTACK_MIN_COOLDOWN = 175;
const BOSS_ATTACK_MAX_COOLDOWN = 265;
const BOSS_ATTACK_WARNING_TIME = 88;
const BOSS_ATTACK_STRIKE_TIME = 16;
const BOSS_ATTACK_RECOVER_TIME = 32;
const BOSS_PAW_WIDTH = 96;
const BOSS_PAW_HEIGHT = 76;
const BOSS_ATTACK_HIT_HEIGHT = 30;
const BOSS_ATTACK_HIT_PAD_X = 0.18;
const BOSS_ATTACK_DODGE_RETRY = 34;
const BOSS_ATTACK_MIN_VISUAL_SURFACE_Y = 198;
const PLATFORM_MIN_WIDTH = 168;
const PLATFORM_MAX_WIDTH = 238;
const PLATFORM_MIN_TIMER = 250;
const PLATFORM_MAX_TIMER = 360;
const PLATFORM_MIN_SURFACE_Y = 196;
const PLATFORM_MAX_SURFACE_Y = 252;
const PLATFORM_MAX_STEP_Y = 38;
const PLATFORM_START_WIDTH = 300;
const PLATFORM_ENTRY_X = WORLD_WIDTH + 48;
const PLATFORM_ENTRY_GAP = 165;
const PLATFORM_ATTACK_WIDTH = 1040;
const PLATFORM_ATTACK_MIN_WIDTH = 820;
const PLATFORM_ATTACK_EVERY = 3;
const PLATFORM_FALL_LIMIT_Y = WORLD_HEIGHT + 34;
const PIPE_WIDTH = 320;
const PIPE_HEIGHT = 224;
const PIPE_PLATFORM_WIDTH = 940;
const PIPE_PLATFORM_GAP = 190;
const PIPE_PLATFORM_RIGHT_PADDING = 72;
const BOSS_JUMP_READY_AMOUNT = 0.12;
const BOSS_JUMP_DURATION = 78;
const BOSS_JUMP_HEIGHT = 88;
const BOSS_JUMP_FORWARD = 64;
const BOSS_JUMP_MIN_COOLDOWN = 42;
const BOSS_JUMP_MAX_COOLDOWN = 82;

const mouseSprite = {
  image: new Image(),
  loaded: false,
  frameWidth: 180,
  frameHeight: 110,
  frames: 12,
  width: 116,
  height: 65,
  duckWidth: 110,
  duckHeight: 50,
  groundOffset: 4,
};

mouseSprite.image.onload = () => {
  mouseSprite.loaded = true;
};
mouseSprite.image.src = "assets/sprites/mouse-run-clean.png";

const cactusSprite = {
  image: new Image(),
  loaded: false,
  aspect: 313 / 458,
};

cactusSprite.image.onload = () => {
  cactusSprite.loaded = true;
  cactusSprite.aspect = cactusSprite.image.naturalWidth / cactusSprite.image.naturalHeight;
};
cactusSprite.image.src = "assets/sprites/cactus-obstacle.png";

const rockSprite = {
  image: new Image(),
  loaded: false,
  aspect: 419 / 265,
};

rockSprite.image.onload = () => {
  rockSprite.loaded = true;
  rockSprite.aspect = rockSprite.image.naturalWidth / rockSprite.image.naturalHeight;
};
rockSprite.image.src = "assets/sprites/rock-obstacle.png";

const sunSprite = {
  image: new Image(),
  loaded: false,
  aspect: 800 / 777,
  width: 108,
};

sunSprite.image.onload = () => {
  sunSprite.loaded = true;
  sunSprite.aspect = sunSprite.image.naturalWidth / sunSprite.image.naturalHeight;
};
sunSprite.image.src = "assets/sprites/sun.png";

const moonSprite = {
  image: new Image(),
  loaded: false,
  aspect: 1028 / 1190,
  width: 90,
};

moonSprite.image.onload = () => {
  moonSprite.loaded = true;
  moonSprite.aspect = moonSprite.image.naturalWidth / moonSprite.image.naturalHeight;
};
moonSprite.image.src = "assets/sprites/moon.png";

const groundSprites = [
  { src: "assets/ground/ground-1.png" },
  { src: "assets/ground/ground-2.png" },
  { src: "assets/ground/ground-3.png" },
  { src: "assets/ground/ground-4.png" },
  { src: "assets/ground/ground-5.png" },
  { src: "assets/ground/ground-6.png" },
  { src: "assets/ground/ground-7.png" },
  { src: "assets/ground/ground-8.png" },
].map((sprite) => {
  const image = new Image();
  const groundSprite = {
    ...sprite,
    image,
    loaded: false,
  };

  image.onload = () => {
    groundSprite.loaded = true;
  };
  image.src = sprite.src;

  return groundSprite;
});

const platformSprite = {
  image: new Image(),
  loaded: false,
  variants: [
    { x: 19, y: 238, w: 627, h: 218, floorY: 78 },
    { x: 678, y: 279, w: 368, h: 169, floorY: 48 },
    { x: 1086, y: 246, w: 216, h: 233, floorY: 88 },
    { x: 1345, y: 277, w: 188, h: 201, floorY: 58 },
    { x: 1575, y: 308, w: 169, h: 164, floorY: 42 },
    { x: 1785, y: 276, w: 176, h: 208, floorY: 64 },
    { x: 1990, y: 332, w: 161, h: 124, floorY: 32 },
  ],
};

platformSprite.image.onload = () => {
  platformSprite.loaded = true;
};
platformSprite.image.src = "assets/sprites/platforms.png";

const pipeSprite = {
  image: new Image(),
  loaded: false,
  source: { x: 1010, y: 300, w: 370, h: 475 },
};

pipeSprite.image.onload = () => {
  pipeSprite.loaded = true;
};
pipeSprite.image.src = "assets/source/pipe-source.png";

const mountainSprite = {
  image: new Image(),
  loaded: false,
  aspect: 2172 / 639,
};

mountainSprite.image.onload = () => {
  mountainSprite.loaded = true;
  mountainSprite.aspect = mountainSprite.image.naturalWidth / mountainSprite.image.naturalHeight;
};
mountainSprite.image.src = "assets/background/desert-mountains.png";

const cloudSprites = [
  { src: "assets/clouds/cloud-1.png", aspect: 355 / 166 },
  { src: "assets/clouds/cloud-2.png", aspect: 432 / 183 },
  { src: "assets/clouds/cloud-3.png", aspect: 290 / 148 },
  { src: "assets/clouds/cloud-4.png", aspect: 392 / 163 },
  { src: "assets/clouds/cloud-5.png", aspect: 328 / 168 },
  { src: "assets/clouds/cloud-6.png", aspect: 427 / 130 },
].map((sprite) => {
  const image = new Image();
  const cloudSprite = {
    ...sprite,
    image,
    loaded: false,
  };

  image.onload = () => {
    cloudSprite.loaded = true;
    cloudSprite.aspect = image.naturalWidth / image.naturalHeight;
  };
  image.src = sprite.src;

  return cloudSprite;
});

const birdSprite = {
  image: new Image(),
  loaded: false,
  frameWidth: 257,
  frameHeight: 252,
  frames: 10,
  width: 92,
  height: 90,
};

birdSprite.image.onload = () => {
  birdSprite.loaded = true;
};
birdSprite.image.src = "assets/sprites/bird-fly.png";

const catBossSprite = {
  image: new Image(),
  loaded: false,
  drawHeight: 132,
  frames: [
    { x: 20, y: 291, w: 361, h: 175 },
    { x: 430, y: 283, w: 322, h: 165 },
    { x: 811, y: 290, w: 341, h: 158 },
    { x: 1152, y: 289, w: 370, h: 177 },
    { x: 17, y: 578, w: 360, h: 162 },
    { x: 416, y: 580, w: 337, h: 178 },
    { x: 806, y: 586, w: 346, h: 156 },
    { x: 1152, y: 580, w: 374, h: 183 },
  ],
};

catBossSprite.image.onload = () => {
  catBossSprite.loaded = true;
};
catBossSprite.image.src = "assets/sprites/cat-boss.png";

const catAttackSprite = {
  image: new Image(),
  loaded: false,
  scale: 0.62,
  frameWidth: 520,
  frameHeight: 330,
  frames: 12,
  columns: 4,
  anchorRight: 24,
  groundPad: 18,
};

catAttackSprite.image.onload = () => {
  catAttackSprite.loaded = true;
};
catAttackSprite.image.src = "assets/sprites/cat-attack-clean.png";

const game = {
  status: "ready",
  speed: 6,
  distance: 0,
  score: 0,
  best: Number(localStorage.getItem(STORAGE_KEY) || 0),
  spawnTimer: 0,
  birdTimer: 640,
  platformTimer: 0,
  platformMode: false,
  platformEntryActive: false,
  platformSpawnCount: 0,
  forceAttackPlatform: false,
  bossActive: false,
  bossStartScore: 0,
  bossEscaped: false,
  bossEscapeScore: 0,
  escapePipeSpawned: false,
  catLeftBehindTimer: 0,
  cloudTimer: 0,
  shake: 0,
  lastTime: 0,
};

const runner = {
  x: RUNNER_START_X,
  y: GROUND_Y - mouseSprite.height,
  w: mouseSprite.width,
  h: mouseSprite.height,
  duckH: mouseSprite.duckHeight,
  vy: 0,
  gravity: 0.62,
  jumpPower: -14.6,
  jumpCutSpeed: -4.2,
  maxFallSpeed: 16,
  fastFallMaxSpeed: 20,
  maxJumps: 2,
  jumpsUsed: 0,
  grounded: true,
  surfaceY: GROUND_Y,
  ducking: false,
  downHeld: false,
  jumpHeld: false,
  fastFalling: false,
  frame: 0,
};

const bossJump = {
  timer: 0,
  cooldown: BOSS_JUMP_MIN_COOLDOWN,
};

const bossAttack = {
  state: "idle",
  timer: 0,
  cooldown: BOSS_ATTACK_INITIAL_COOLDOWN,
  x: RUNNER_BOSS_X,
  y: GROUND_Y - BOSS_PAW_HEIGHT,
  surfaceY: GROUND_Y,
  w: BOSS_PAW_WIDTH,
  h: BOSS_PAW_HEIGHT,
};

let obstacles = [];
let birds = [];
let platforms = [];
let escapePipe = null;
let clouds = [];
let dust = [];
let activeJumpPointerId = null;
let activeDuckPointerId = null;

const random = (min, max) => Math.random() * (max - min) + min;
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const lerp = (start, end, amount) => start + (end - start) * amount;
const easeInOutCubic = (value) =>
  value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2;
const getNightAmount = () => {
  const nightAmount = easeInOutCubic(
    clamp((game.score - NIGHT_START_SCORE) / (NIGHT_END_SCORE - NIGHT_START_SCORE), 0, 1)
  );

  if (!game.bossEscaped || game.bossEscapeScore <= 0) {
    return nightAmount;
  }

  const dayReturnAmount = easeInOutCubic(
    clamp((game.score - game.bossEscapeScore - DAY_RETURN_DELAY_SCORE) / DAY_RETURN_SPAN_SCORE, 0, 1)
  );

  return nightAmount * (1 - dayReturnAmount);
};
const getBossAmount = () =>
  game.bossActive ? easeInOutCubic(clamp((game.score - game.bossStartScore) / BOSS_REVEAL_SCORE_SPAN, 0, 1)) : 0;
const isBossPhase = () => game.bossActive;
const shouldSpawnNormalHazards = () => game.score < NIGHT_START_SCORE || game.bossEscaped;
const isBossWaitingForClear = () => game.score >= NIGHT_START_SCORE && !game.bossActive && !game.bossEscaped;
const isPlatformRunActive = () => game.platformMode;
const getRunnerTargetX = () => lerp(RUNNER_START_X, RUNNER_BOSS_X, getBossAmount());
const padScore = (value) => String(Math.floor(value)).padStart(5, "0");

function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = WORLD_WIDTH * ratio;
  canvas.height = WORLD_HEIGHT * ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.imageSmoothingEnabled = false;
}

function resetGame() {
  game.status = "ready";
  game.speed = 6;
  game.distance = 0;
  game.score = 0;
  game.spawnTimer = 440;
  game.birdTimer = 640;
  game.platformTimer = 0;
  game.platformMode = false;
  game.platformEntryActive = false;
  game.platformSpawnCount = 0;
  game.forceAttackPlatform = false;
  game.bossActive = false;
  game.bossStartScore = 0;
  game.bossEscaped = false;
  game.bossEscapeScore = 0;
  game.escapePipeSpawned = false;
  game.catLeftBehindTimer = 0;
  game.cloudTimer = 0;
  game.shake = 0;
  runner.x = RUNNER_START_X;
  runner.y = GROUND_Y - runner.h;
  runner.vy = 0;
  runner.grounded = true;
  runner.surfaceY = GROUND_Y;
  runner.ducking = false;
  runner.downHeld = false;
  runner.jumpHeld = false;
  runner.fastFalling = false;
  runner.jumpsUsed = 0;
  resetBossAttack();
  resetBossJump();
  obstacles = [];
  birds = [];
  platforms = [];
  escapePipe = null;
  clouds = [
    makeCloud(170, 62, 0.28),
    makeCloud(420, 88, 0.42),
    makeCloud(760, 48, 0.34),
  ];
  dust = [];
  activeJumpPointerId = null;
  activeDuckPointerId = null;
  updateScoreboard();
  setOverlay("Rato Run", "Comecar", false);
}

function startGame() {
  if (game.status === "running") {
    jump();
    return;
  }
  if (game.status === "paused") {
    game.status = "running";
    hideOverlay();
    return;
  }
  if (game.status === "over" || game.status === "ready") {
    if (game.status === "over") {
      resetGame();
    }
    game.status = "running";
    hideOverlay();
    jump();
  }
}

function pauseGame() {
  if (game.status === "running") {
    game.status = "paused";
    setOverlay("Pausado", "Continuar", false);
    return;
  }
  if (game.status === "paused") {
    game.status = "running";
    hideOverlay();
  }
}

function gameOver() {
  game.status = "over";
  game.shake = 14;
  if (game.score > game.best) {
    game.best = Math.floor(game.score);
    localStorage.setItem(STORAGE_KEY, String(game.best));
  }
  updateScoreboard();
  setOverlay("Fim de jogo", "Reiniciar", false);
}

function setOverlay(title, buttonText, hidden) {
  overlay.querySelector("strong").textContent = title;
  overlayButton.textContent = buttonText;
  overlay.classList.toggle("is-hidden", hidden);
}

function hideOverlay() {
  overlay.classList.add("is-hidden");
}

function updateScoreboard() {
  scoreEl.textContent = padScore(game.score);
  bestScoreEl.textContent = padScore(game.best);
}

function startBossPhase() {
  game.bossActive = true;
  game.bossStartScore = game.score;
  game.escapePipeSpawned = false;
  game.spawnTimer = 520;
  game.birdTimer = 760;
  escapePipe = null;
  resetBossAttack();
  resetBossJump();
}

function resetBossAttack() {
  bossAttack.state = "idle";
  bossAttack.timer = 0;
  bossAttack.cooldown = BOSS_ATTACK_INITIAL_COOLDOWN;
  bossAttack.x = RUNNER_BOSS_X;
  bossAttack.y = GROUND_Y - BOSS_PAW_HEIGHT;
  bossAttack.surfaceY = GROUND_Y;
}

function resetBossJump() {
  bossJump.timer = 0;
  bossJump.cooldown = BOSS_JUMP_MIN_COOLDOWN;
}

function updateBossAttack(step, bossPhase) {
  if (!bossPhase || getBossAmount() < BOSS_ATTACK_READY_AMOUNT) {
    resetBossAttack();
    return;
  }

  if (bossAttack.state === "idle") {
    bossAttack.cooldown -= step;
    if (bossAttack.cooldown <= 0) {
      startBossWarning();
    }
    return;
  }

  bossAttack.timer -= step;
  if (bossAttack.timer > 0) return;

  if (bossAttack.state === "warning") {
    bossAttack.state = "strike";
    bossAttack.timer = BOSS_ATTACK_STRIKE_TIME;
    game.shake = Math.max(game.shake, 7);
    dust.push(...makeDustBurst(bossAttack.x + bossAttack.w * 0.45, bossAttack.surfaceY - 4, 10));
    return;
  }

  if (bossAttack.state === "strike") {
    bossAttack.state = "recover";
    bossAttack.timer = BOSS_ATTACK_RECOVER_TIME;
    return;
  }

  bossAttack.state = "idle";
  bossAttack.cooldown = random(BOSS_ATTACK_MIN_COOLDOWN, BOSS_ATTACK_MAX_COOLDOWN);
}

function startBossWarning() {
  if (bossJump.timer > 0) {
    bossAttack.cooldown = BOSS_ATTACK_DODGE_RETRY;
    return;
  }

  const targetPlatform = getRunnerAttackPlatform();

  if (!canBossAttackPlatform(targetPlatform)) {
    queueBossAttackPlatform();
    bossAttack.cooldown = BOSS_ATTACK_DODGE_RETRY;
    return;
  }

  bossAttack.state = "warning";
  bossAttack.timer = BOSS_ATTACK_WARNING_TIME;
  bossAttack.w = BOSS_PAW_WIDTH;
  bossAttack.h = BOSS_PAW_HEIGHT;
  updateBossAttackTarget(targetPlatform.surfaceY);
}

function updateBossAttackTarget(targetSurfaceY = getRunnerAttackSurfaceY()) {
  bossAttack.x = runner.x + runner.w * 0.04;
  bossAttack.surfaceY = targetSurfaceY;
  bossAttack.y = bossAttack.surfaceY - bossAttack.h;
}

function jump() {
  if (game.status !== "running") return;
  if (!runner.grounded && runner.jumpsUsed >= runner.maxJumps) return;

  const doubleJump = !runner.grounded;
  runner.vy = doubleJump ? runner.jumpPower * 0.88 : runner.jumpPower;
  runner.grounded = false;
  runner.ducking = false;
  runner.jumpHeld = true;
  runner.fastFalling = false;
  runner.jumpsUsed += 1;

  const dustY = doubleJump ? runner.y + runner.h * 0.72 : runner.surfaceY - 4;
  const dustCount = doubleJump ? 4 : 6;
  dust.push(...makeDustBurst(runner.x + 12, dustY, dustCount));
}

function releaseJump() {
  runner.jumpHeld = false;
  if (game.status !== "running") return;
  if (!runner.grounded && runner.vy < runner.jumpCutSpeed) {
    runner.vy = runner.jumpCutSpeed;
  }
}

function setDuck(active) {
  if (game.status !== "running") {
    runner.downHeld = false;
    return;
  }

  runner.downHeld = active;
  if (runner.grounded) {
    runner.ducking = active;
    runner.fastFalling = false;
    runner.y = runner.surfaceY - (runner.ducking ? runner.duckH : runner.h);
    return;
  }

  runner.ducking = false;
  runner.fastFalling = active;
  if (active) {
    runner.jumpHeld = false;
    runner.vy = Math.max(runner.vy, -1.2);
  }
}

function makeCloud(x = WORLD_WIDTH + 80, y = random(40, 118), speed = random(0.22, 0.5)) {
  return {
    x,
    y,
    speed,
    size: random(26, 44),
    variant: Math.floor(random(0, cloudSprites.length)),
  };
}

function makeObstacle() {
  const type = Math.random() > 0.46 ? "cactus" : "rock";
  const pack = Math.random() > 0.74 ? 2 : 1;
  const height = type === "cactus" ? random(52, 82) : random(38, 54);
  const width =
    type === "cactus"
      ? Math.round(height * cactusSprite.aspect * (pack === 2 ? 1.58 : 1))
      : Math.round(height * rockSprite.aspect);
  return {
    type,
    x: WORLD_WIDTH + 30,
    y: GROUND_Y - height,
    w: width,
    h: height,
    pack,
  };
}

function makeBird() {
  const swooping = Math.random() > 0.42;
  const highFlight = Math.random() > 0.5;
  const startX = BIRD_ENTRY_X;
  const startY = swooping ? random(26, 72) : highFlight ? GROUND_Y - 154 : GROUND_Y - 98;
  const targetX = runner.x + random(34, 82);
  const targetY = GROUND_Y - random(94, 106);
  return {
    x: startX,
    y: startY,
    w: birdSprite.width,
    h: birdSprite.height,
    flap: random(0, birdSprite.frames),
    mode: swooping ? "swoop" : "cruise",
    startX,
    startY,
    targetX,
    targetY,
    tilt: 0,
  };
}

function updateBird(bird, step) {
  const previousY = bird.y;
  const speedBoost = bird.mode === "swoop" ? 2.5 : 1.8;

  bird.x -= (game.speed + speedBoost) * step;
  bird.flap += step * (bird.mode === "swoop" ? 0.6 : 0.46);

  if (bird.mode === "swoop") {
    const attackDistance = Math.max(1, bird.startX - bird.targetX);
    const progress = clamp((bird.startX - bird.x) / attackDistance, 0, 1);
    bird.y = lerp(bird.startY, bird.targetY, easeInOutCubic(progress));
  }

  bird.tilt = clamp((previousY - bird.y) * 0.08, -0.34, 0.25);
}

function canSpawnBird() {
  const clearOfObstacles = obstacles.every(
    (obstacle) => Math.abs(obstacle.x - BIRD_ENTRY_X) > BIRD_OBSTACLE_CLEARANCE
  );
  const clearOfBirds = birds.every((bird) => bird.x < BIRD_ENTRY_X - BIRD_TO_BIRD_CLEARANCE);

  return clearOfObstacles && clearOfBirds;
}

function makeDustBurst(x, y, count) {
  return Array.from({ length: count }, () => ({
    x: x + random(-4, 10),
    y: y + random(-4, 3),
    vx: random(-2.2, -0.4),
    vy: random(-1.6, -0.1),
    life: random(18, 32),
    maxLife: 32,
    size: random(3, 6),
  }));
}

function makeBossPlatform(
  x = WORLD_WIDTH + random(40, 120),
  previousSurfaceY = null,
  surfaceYOverride = null,
  widthOverride = null,
  variantOverride = null
) {
  const variant = variantOverride || getPlatformVariant();
  const width = Math.round(widthOverride == null ? random(PLATFORM_MIN_WIDTH, PLATFORM_MAX_WIDTH) : widthOverride);
  const height = Math.round(width * (variant.h / variant.w));
  const surfaceY =
    surfaceYOverride != null
      ? surfaceYOverride
      : previousSurfaceY === null
      ? random(210, PLATFORM_MAX_SURFACE_Y)
      : clamp(previousSurfaceY + random(-PLATFORM_MAX_STEP_Y, PLATFORM_MAX_STEP_Y), PLATFORM_MIN_SURFACE_Y, PLATFORM_MAX_SURFACE_Y);
  const surfaceOffset = Math.round(height * (variant.floorY / variant.h));

  return {
    x,
    y: surfaceY - surfaceOffset,
    w: width,
    h: height,
    surfaceY,
    surfaceOffset,
    variant,
  };
}

function getPlatformVariant() {
  return Math.random() < 0.62 ? platformSprite.variants[0] : platformSprite.variants[1];
}

function makeBossAttackPlatform(x, previousSurfaceY = null) {
  return makeBossPlatform(x, previousSurfaceY, null, PLATFORM_ATTACK_WIDTH, platformSprite.variants[0]);
}

function startBossPlatformRun() {
  game.platformMode = false;
  game.platformEntryActive = true;

  const startVariant = platformSprite.variants[0];
  const firstPlatform = makeBossPlatform(
    PLATFORM_ENTRY_X,
    null,
    GROUND_Y,
    PLATFORM_START_WIDTH + 90,
    startVariant
  );
  const secondPlatform = makeBossPlatform(
    firstPlatform.x + firstPlatform.w + PLATFORM_ENTRY_GAP,
    firstPlatform.surfaceY
  );
  const thirdPlatform = makeBossAttackPlatform(secondPlatform.x + secondPlatform.w + PLATFORM_ENTRY_GAP, secondPlatform.surfaceY);

  platforms = [firstPlatform, secondPlatform, thirdPlatform];
  game.platformSpawnCount = platforms.length;
  game.forceAttackPlatform = false;
  game.platformTimer = PLATFORM_MIN_TIMER;
  bossJump.cooldown = Math.min(bossJump.cooldown, BOSS_JUMP_MIN_COOLDOWN * 0.35);
}

function activatePlatformRunIfReady() {
  if (!game.platformEntryActive || game.platformMode) return;

  const entryPlatform = platforms[0];
  if (!entryPlatform) return;

  const runnerStandLeft = runner.x + runner.w * 0.28;
  const runnerStandRight = runner.x + runner.w * 0.72;
  const platformReady = entryPlatform.x <= runnerStandLeft && entryPlatform.x + entryPlatform.w >= runnerStandRight;
  if (!platformReady) return;

  game.platformEntryActive = false;
  game.platformMode = true;
  runner.vy = 0;
  runner.grounded = true;
  runner.surfaceY = entryPlatform.surfaceY;
  runner.y = runner.surfaceY - (runner.ducking ? runner.duckH : runner.h);
}

function queueBossAttackPlatform() {
  game.forceAttackPlatform = true;
  game.platformTimer = Math.min(game.platformTimer, 70);
}

function spawnEscapePipe() {
  if (game.escapePipeSpawned) return;

  const lastPlatform = platforms[platforms.length - 1];
  const spawnX = Math.max(
    WORLD_WIDTH + 140,
    lastPlatform ? lastPlatform.x + lastPlatform.w + PIPE_PLATFORM_GAP : WORLD_WIDTH + 140
  );
  const pipePlatform = makeBossPlatform(spawnX, null, GROUND_Y, PIPE_PLATFORM_WIDTH, platformSprite.variants[0]);
  pipePlatform.kind = "escape";

  platforms.push(pipePlatform);
  escapePipe = {
    platform: pipePlatform,
    offsetX: pipePlatform.w - PIPE_WIDTH - PIPE_PLATFORM_RIGHT_PADDING,
    x: pipePlatform.x + pipePlatform.w - PIPE_WIDTH - PIPE_PLATFORM_RIGHT_PADDING,
    surfaceY: pipePlatform.surfaceY,
    w: PIPE_WIDTH,
    h: PIPE_HEIGHT,
    lockedAfterEscape: false,
  };

  game.escapePipeSpawned = true;
  game.forceAttackPlatform = false;
  game.platformTimer = 999999;
}

function updateEscapePipe(bossPhase) {
  if (!bossPhase || !isPlatformRunActive() || game.bossEscaped) return;

  if (!game.escapePipeSpawned && game.score - game.bossStartScore >= BOSS_PIPE_SCORE_DELAY) {
    spawnEscapePipe();
  }

  if (!escapePipe) return;

  escapePipe.x = escapePipe.platform.x + escapePipe.offsetX;
  escapePipe.surfaceY = escapePipe.platform.surfaceY;

  if (escapePipe.x + escapePipe.w < -40) {
    escapePipe = null;
    game.escapePipeSpawned = false;
    game.platformTimer = PLATFORM_MIN_TIMER;
    return;
  }

  if (overlaps(getRunnerHitBox(), getEscapePipeEntranceBox(escapePipe))) {
    escapeBossThroughPipe();
  }
}

function getEscapePipeEntranceBox(pipe) {
  return {
    x: pipe.x + pipe.w * 0.04,
    y: pipe.surfaceY - pipe.h * 0.44,
    w: pipe.w * 0.34,
    h: pipe.h * 0.38,
  };
}

function escapeBossThroughPipe() {
  const escapedPipe = escapePipe
    ? {
        ...escapePipe,
        platform: null,
        lockedAfterEscape: true,
      }
    : null;

  game.bossEscaped = true;
  game.bossActive = false;
  game.bossEscapeScore = game.score;
  game.platformMode = false;
  game.platformEntryActive = false;
  game.escapePipeSpawned = false;
  game.catLeftBehindTimer = BOSS_CAT_PIPE_STOP_TIME;
  game.spawnTimer = 260;
  game.birdTimer = 560;

  platforms = [];
  escapePipe = escapedPipe;
  resetBossAttack();
  resetBossJump();

  runner.vy = 0;
  runner.grounded = true;
  runner.fastFalling = false;
  runner.surfaceY = GROUND_Y;
  runner.ducking = false;
  runner.y = GROUND_Y - runner.h;
  dust.push(...makeDustBurst(runner.x + runner.w * 0.4, GROUND_Y - 6, 18));
}

function updateBossPlatforms(step, bossPhase) {
  if (!bossPhase) {
    platforms = [];
    game.platformTimer = 0;
    game.platformMode = false;
    game.platformEntryActive = false;
    escapePipe = null;
    return;
  }

  if (!game.platformMode && !game.platformEntryActive && platforms.length === 0) {
    startBossPlatformRun();
  }

  platforms.forEach((platform) => {
    platform.x -= game.speed * step;
  });
  platforms = platforms.filter((platform) => platform.x + platform.w > -30);
  activatePlatformRunIfReady();

  game.platformTimer -= game.speed * step;
  if (game.platformTimer <= 0) {
    const lastPlatform = platforms[platforms.length - 1];
    const spawnX = Math.max(WORLD_WIDTH + 44, lastPlatform ? lastPlatform.x + lastPlatform.w + random(115, 185) : WORLD_WIDTH + 80);
    const shouldSpawnAttackPlatform =
      game.forceAttackPlatform || game.platformSpawnCount % PLATFORM_ATTACK_EVERY === PLATFORM_ATTACK_EVERY - 1;
    const nextPlatform = shouldSpawnAttackPlatform
      ? makeBossAttackPlatform(spawnX, lastPlatform ? lastPlatform.surfaceY : null)
      : makeBossPlatform(spawnX, lastPlatform ? lastPlatform.surfaceY : null);
    platforms.push(nextPlatform);
    game.platformSpawnCount += 1;
    game.forceAttackPlatform = false;
    game.platformTimer = random(PLATFORM_MIN_TIMER, PLATFORM_MAX_TIMER);
  }
}

function updateBossJump(step, bossPhase) {
  if (!bossPhase || getBossAmount() < BOSS_JUMP_READY_AMOUNT) {
    resetBossJump();
    return;
  }

  if (bossJump.timer > 0) {
    bossJump.timer -= step;
    return;
  }

  if (isBossAttackVisible()) {
    bossJump.cooldown = Math.max(bossJump.cooldown, BOSS_JUMP_MIN_COOLDOWN * 0.45);
    return;
  }

  bossJump.cooldown -= step;
  const platformJumpReady = bossJump.cooldown <= BOSS_JUMP_MAX_COOLDOWN * 0.9 && hasPlatformInBossJumpZone();
  if (bossJump.cooldown <= 0 || platformJumpReady) {
    bossJump.timer = BOSS_JUMP_DURATION;
    bossJump.cooldown = random(BOSS_JUMP_MIN_COOLDOWN, BOSS_JUMP_MAX_COOLDOWN);
  }
}

function hasPlatformInBossJumpZone() {
  const bossX = lerp(CAT_BOSS_HIDDEN_X, CAT_BOSS_VISIBLE_X, getBossAmount());
  const zoneLeft = bossX + 170;
  const zoneRight = bossX + 430;

  return platforms.some(
    (platform) => platform.surfaceY < GROUND_Y - 12 && platform.x < zoneRight && platform.x + platform.w > zoneLeft
  );
}

function update(delta) {
  if (game.status !== "running") {
    updateAmbient(delta);
    return;
  }

  const step = clamp(delta / 16.67, 0.4, 1.8);
  game.distance += game.speed * step;
  game.score = game.distance / 7.5;
  game.speed = clamp(6 + game.score / 210, 6, 10);
  runner.x = getRunnerTargetX();
  game.cloudTimer -= step;
  const bossPhase = isBossPhase();
  updateBossPlatforms(step, bossPhase);
  updateEscapePipe(bossPhase);

  const previousY = runner.y;
  const gravity = getRunnerGravity();
  runner.vy = Math.min(runner.vy + gravity * step, runner.fastFalling ? runner.fastFallMaxSpeed : runner.maxFallSpeed);
  runner.y += runner.vy * step;
  const currentHeight = runner.ducking ? runner.duckH : runner.h;
  const landingSurfaceY = getLandingSurfaceY(previousY, currentHeight);
  if (landingSurfaceY !== null) {
    runner.vy = 0;
    runner.grounded = true;
    runner.surfaceY = landingSurfaceY;
    runner.jumpHeld = false;
    runner.fastFalling = false;
    runner.jumpsUsed = 0;
    runner.ducking = runner.downHeld;
    runner.y = runner.surfaceY - (runner.ducking ? runner.duckH : runner.h);
  } else {
    runner.grounded = false;
    runner.surfaceY = GROUND_Y;
  }

  if (isPlatformRunActive() && runner.y > PLATFORM_FALL_LIMIT_Y) {
    gameOver();
    return;
  }

  runner.frame += step * game.speed * 0.18;

  if (!shouldSpawnNormalHazards()) {
    game.spawnTimer = 520;
    game.birdTimer = 760;
  } else {
    game.spawnTimer -= game.speed * step;
    game.birdTimer -= game.speed * step;

    if (game.spawnTimer <= 0) {
      obstacles.push(makeObstacle());
      game.spawnTimer = random(520, 900);
    }

    if (game.score > BIRD_MIN_SCORE && game.birdTimer <= 0) {
      if (canSpawnBird()) {
        birds.push(makeBird());
        game.birdTimer = random(760, 1180) - game.speed * 6;
      } else {
        game.birdTimer = 150;
      }
    }
  }

  if (game.cloudTimer <= 0) {
    clouds.push(makeCloud());
    game.cloudTimer = random(54, 96);
  }

  obstacles.forEach((obstacle) => {
    obstacle.x -= game.speed * step;
  });
  birds.forEach((bird) => {
    updateBird(bird, step);
  });

  if (runner.grounded && Math.random() > 0.67) {
    dust.push(...makeDustBurst(runner.x + 8, runner.surfaceY - 2, 1));
  }

  updateAmbient(delta);
  obstacles = obstacles.filter((obstacle) => obstacle.x + obstacle.w > -20);
  birds = birds.filter((bird) => bird.x + bird.w > -20);

  if (isBossWaitingForClear() && obstacles.length === 0 && birds.length === 0) {
    startBossPhase();
  }

  const activeBossPhase = isBossPhase() && isPlatformRunActive() && !game.escapePipeSpawned;
  updateBossAttack(step, activeBossPhase);
  updateBossJump(step, activeBossPhase);

  const runnerBox = getRunnerHitBox();
  const hitObstacle = obstacles.some((obstacle) =>
    getObstacleHitBoxes(obstacle).some((box) => overlaps(runnerBox, box))
  );
  const hitBird = birds.some((bird) => overlaps(runnerBox, getBirdHitBox(bird)));
  const bossHitBox = getBossAttackHitBox();
  const hitBossAttack = bossHitBox ? overlaps(runnerBox, bossHitBox) && isRunnerInBossAttackReach() : false;
  if (hitObstacle || hitBird || hitBossAttack) {
    gameOver();
  }

  updateScoreboard();
}

function getRunnerGravity() {
  if (runner.grounded) {
    return runner.gravity;
  }
  if (runner.fastFalling) {
    return runner.gravity * 2.7;
  }
  if (runner.vy < 0 && !runner.jumpHeld) {
    return runner.gravity * 1.85;
  }
  if (runner.vy > 0) {
    return runner.gravity * 1.12;
  }
  return runner.gravity;
}

function getLandingSurfaceY(previousY, currentHeight) {
  if (runner.vy < 0) return null;

  const previousBottom = previousY + currentHeight;
  const bottom = runner.y + currentHeight;
  const footLeft = runner.x + runner.w * 0.24;
  const footRight = runner.x + runner.w * 0.76;
  let surfaceY = null;

  platforms.forEach((platform) => {
    const platformLeft = platform.x + 12;
    const platformRight = platform.x + platform.w - 12;
    const standingOverPlatform = footRight > platformLeft && footLeft < platformRight;
    const crossingPlatformTop = previousBottom <= platform.surfaceY + 8 && bottom >= platform.surfaceY;

    if (standingOverPlatform && crossingPlatformTop) {
      surfaceY = surfaceY === null ? platform.surfaceY : Math.min(surfaceY, platform.surfaceY);
    }
  });

  if (!isPlatformRunActive() && previousBottom <= GROUND_Y + 10 && bottom >= GROUND_Y) {
    surfaceY = surfaceY === null ? GROUND_Y : Math.min(surfaceY, GROUND_Y);
  }

  return surfaceY;
}

function getRunnerAttackSurfaceY() {
  const attackPlatform = getRunnerAttackPlatform();
  if (attackPlatform) return attackPlatform.surfaceY;
  return isPlatformRunActive() ? null : GROUND_Y;
}

function getRunnerAttackPlatform() {
  const centerX = runner.x + runner.w * 0.5;
  const runnerBottom = runner.y + (runner.ducking ? runner.duckH : runner.h);

  if (runner.grounded) {
    return platforms.find((platform) => {
      const platformLeft = platform.x + 10;
      const platformRight = platform.x + platform.w - 10;
      return centerX > platformLeft && centerX < platformRight && Math.abs(platform.surfaceY - runner.surfaceY) <= 6;
    });
  }

  const platformBelow = platforms
    .filter(
      (platform) =>
        centerX > platform.x + 8 && centerX < platform.x + platform.w - 8 && runnerBottom <= platform.surfaceY + 18
    )
    .sort((a, b) => a.surfaceY - b.surfaceY)[0];

  return platformBelow || null;
}

function canBossAttackPlatform(platform) {
  if (!platform || !isBossAttackPlatform(platform)) return false;

  const attackX = runner.x + runner.w * 0.04;
  const dangerLeft = attackX + BOSS_PAW_WIDTH * BOSS_ATTACK_HIT_PAD_X;
  const dangerRight = attackX + BOSS_PAW_WIDTH * (1 - BOSS_ATTACK_HIT_PAD_X);
  const projectedPlatformX = platform.x - game.speed * BOSS_ATTACK_WARNING_TIME;
  const projectedPlatformRight = platform.x + platform.w - game.speed * BOSS_ATTACK_WARNING_TIME;
  const coversWarning = dangerLeft >= platform.x + 18 && dangerRight <= platform.x + platform.w - 18;
  const coversStrike =
    dangerLeft >= projectedPlatformX + 18 && dangerRight <= projectedPlatformRight - 18;

  return coversWarning && coversStrike;
}

function isBossAttackPlatform(platform) {
  return platform.variant === platformSprite.variants[0] && platform.w >= PLATFORM_ATTACK_MIN_WIDTH;
}

function getSurfaceYAtRange(left, right) {
  let surfaceY = GROUND_Y;

  platforms.forEach((platform) => {
    const platformLeft = platform.x + 12;
    const platformRight = platform.x + platform.w - 12;
    if (right > platformLeft && left < platformRight) {
      surfaceY = Math.min(surfaceY, platform.surfaceY);
    }
  });

  return surfaceY;
}

function updateAmbient(delta) {
  const step = clamp(delta / 16.67, 0.4, 1.8);
  clouds.forEach((cloud) => {
    cloud.x -= cloud.speed * step;
  });
  clouds = clouds.filter((cloud) => cloud.x + getCloudWidth(cloud) > -40);

  dust.forEach((particle) => {
    particle.x += particle.vx * step;
    particle.y += particle.vy * step;
    particle.life -= step;
  });
  dust = dust.filter((particle) => particle.life > 0);

  if (game.shake > 0) {
    game.shake -= step;
  }
  if (game.catLeftBehindTimer > 0) {
    game.catLeftBehindTimer = Math.max(0, game.catLeftBehindTimer - step);
  }
  if (escapePipe?.lockedAfterEscape && game.catLeftBehindTimer <= 0) {
    escapePipe = null;
  }
}

function getRunnerHitBox() {
  if (runner.ducking) {
    return {
      x: runner.x + runner.w * 0.15,
      y: runner.y + runner.duckH * 0.12,
      w: runner.w * 0.66,
      h: runner.duckH * 0.72,
    };
  }
  return {
    x: runner.x + runner.w * 0.18,
    y: runner.y + runner.h * 0.2,
    w: runner.w * 0.58,
    h: runner.h * 0.64,
  };
}

function getObstacleHitBoxes(obstacle) {
  if (obstacle.type === "rock") {
    return [
      {
        x: obstacle.x + obstacle.w * 0.22,
        y: obstacle.y + obstacle.h * 0.3,
        w: obstacle.w * 0.56,
        h: obstacle.h * 0.56,
      },
    ];
  }

  const itemWidth = Math.round(obstacle.h * cactusSprite.aspect);
  const spacing = Math.max(12, itemWidth * 0.58);
  const totalWidth = obstacle.pack === 2 ? itemWidth + spacing : itemWidth;
  const startX = obstacle.x + (obstacle.w - totalWidth) / 2;

  return Array.from({ length: obstacle.pack }, (_, index) => {
    const height = obstacle.h - index * 9;
    const width = Math.round(height * cactusSprite.aspect);
    const x = startX + index * spacing;
    const y = GROUND_Y - height;

    return {
      x: x + width * 0.3,
      y: y + height * 0.1,
      w: width * 0.42,
      h: height * 0.82,
    };
  });
}

function getBirdHitBox(bird) {
  const swooping = bird.mode === "swoop";
  return {
    x: bird.x + bird.w * 0.03,
    y: bird.y + bird.h * (swooping ? 0.34 : 0.36),
    w: bird.w * (swooping ? 0.34 : 0.3),
    h: bird.h * (swooping ? 0.36 : 0.28),
  };
}

function getBossAttackHitBox() {
  if (bossAttack.state !== "strike") return null;

  return {
    x: bossAttack.x + bossAttack.w * BOSS_ATTACK_HIT_PAD_X,
    y: bossAttack.surfaceY - BOSS_ATTACK_HIT_HEIGHT,
    w: bossAttack.w * (1 - BOSS_ATTACK_HIT_PAD_X * 2),
    h: BOSS_ATTACK_HIT_HEIGHT + 8,
  };
}

function isRunnerInBossAttackReach() {
  const currentHeight = runner.ducking ? runner.duckH : runner.h;
  const runnerBottom = runner.y + currentHeight;
  return runnerBottom >= bossAttack.surfaceY - BOSS_ATTACK_HIT_HEIGHT && runnerBottom <= bossAttack.surfaceY + 10;
}

function overlaps(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function draw() {
  const wobble = game.shake > 0 ? Math.sin(game.shake * 2.6) * 4 : 0;
  ctx.save();
  ctx.translate(wobble, 0);
  drawSky();
  drawSun();
  clouds.forEach(drawCloud);
  drawFarHills();
  if (!isPlatformRunActive()) {
    drawGround();
  }
  drawNightShade();
  drawPlatforms();
  drawEscapePipe();
  drawBossCat();
  drawBossAttackWarning();
  dust.forEach(drawDust);
  obstacles.forEach(drawObstacle);
  birds.forEach(drawBird);
  drawRunner();
  drawBossAttackStrike();
  ctx.restore();
}

function drawSky() {
  const night = getNightAmount();
  const sky = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
  sky.addColorStop(0, "#f8d98d");
  sky.addColorStop(0.62, "#fff0b8");
  sky.addColorStop(1, "#f3d79a");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

  if (night > 0) {
    ctx.save();
    const nightSky = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
    nightSky.addColorStop(0, "#07142e");
    nightSky.addColorStop(0.62, "#17274c");
    nightSky.addColorStop(1, "#2e2944");
    ctx.globalAlpha = night;
    ctx.fillStyle = nightSky;
    ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    drawStars(night);
    ctx.restore();
  }
}

function drawSun() {
  const night = getNightAmount();
  const sunAlpha = 1 - night;
  const moonAlpha = night;

  if (sunSprite.loaded) {
    const width = sunSprite.width;
    const height = width / sunSprite.aspect;
    ctx.save();
    ctx.globalAlpha = sunAlpha;
    ctx.drawImage(sunSprite.image, 812 - width / 2, 72 - height / 2, width, height);
    ctx.restore();
  } else if (sunAlpha > 0) {
    ctx.save();
    ctx.globalAlpha = sunAlpha;
    ctx.fillStyle = "#ffbc42";
    ctx.beginPath();
    ctx.arc(812, 72, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255, 188, 66, 0.2)";
    ctx.beginPath();
    ctx.arc(812, 72, 48, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  if (moonAlpha > 0 && moonSprite.loaded) {
    const width = moonSprite.width;
    const height = width / moonSprite.aspect;

    ctx.save();
    ctx.globalAlpha = moonAlpha * 0.3;
    ctx.fillStyle = "#dfe8ff";
    ctx.beginPath();
    ctx.arc(812, 72, 52, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = moonAlpha;
    ctx.drawImage(moonSprite.image, 812 - width / 2, 72 - height / 2, width, height);
    ctx.restore();
  } else if (moonAlpha > 0) {
    ctx.save();
    ctx.globalAlpha = moonAlpha;
    ctx.fillStyle = "#e9efff";
    ctx.beginPath();
    ctx.arc(812, 72, 28, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#07142e";
    ctx.beginPath();
    ctx.arc(824, 62, 28, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawStars(alpha) {
  const stars = [
    [128, 44, 2],
    [214, 88, 1.5],
    [306, 34, 1.8],
    [456, 76, 1.4],
    [556, 42, 2],
    [706, 102, 1.5],
    [872, 126, 1.6],
    [906, 48, 1.3],
  ];

  ctx.fillStyle = `rgba(245, 248, 255, ${alpha * 0.78})`;
  stars.forEach(([x, y, size]) => {
    ctx.fillRect(x, y, size, size);
  });
}

function drawNightShade() {
  const night = getNightAmount();
  if (night <= 0) return;

  const shade = ctx.createLinearGradient(0, 0, 0, WORLD_HEIGHT);
  shade.addColorStop(0, `rgba(3, 8, 22, ${night * 0.16})`);
  shade.addColorStop(0.72, `rgba(6, 14, 34, ${night * 0.3})`);
  shade.addColorStop(1, `rgba(2, 6, 16, ${night * 0.4})`);
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
}

function drawBossCat() {
  if (escapePipe?.lockedAfterEscape && game.catLeftBehindTimer > 0) {
    drawCatStoppedAtPipe();
    return;
  }

  const leaving = game.catLeftBehindTimer > 0;
  const reveal = leaving ? game.catLeftBehindTimer / BOSS_CAT_LEFT_BEHIND_TIME : getBossAmount();
  if (reveal <= 0.01) return;

  if (!leaving && catAttackSprite.loaded && isBossAttackVisible()) {
    drawCatAttackSprite(reveal);
    return;
  }

  const leaveOffsetX = leaving ? -(1 - reveal) * 280 : 0;
  if (catBossSprite.loaded) {
    drawCatBossSprite(reveal, leaveOffsetX);
    return;
  }

  drawFallbackBossCat(reveal, leaveOffsetX);
}

function drawCatStoppedAtPipe() {
  if (!escapePipe) return;

  const amount = clamp(game.catLeftBehindTimer / BOSS_CAT_PIPE_STOP_TIME, 0, 1);
  const alpha = clamp(amount * 1.6, 0, 1);
  const mouthX = escapePipe.x + escapePipe.w * 0.13;

  if (catBossSprite.loaded) {
    const frame = catBossSprite.frames[0];
    const drawHeight = catBossSprite.drawHeight;
    const drawWidth = drawHeight * (frame.w / frame.h);
    const x = mouthX - drawWidth * 0.86;
    const y = escapePipe.surfaceY - drawHeight + 5;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "rgba(2, 6, 16, 0.28)";
    roundedRect(x + drawWidth * 0.08, escapePipe.surfaceY - 9, drawWidth * 0.74, 8, 4);
    ctx.fill();
    ctx.drawImage(catBossSprite.image, frame.x, frame.y, frame.w, frame.h, x, y, drawWidth, drawHeight);
    ctx.restore();
    return;
  }

  drawFallbackCatStoppedAtPipe(mouthX, alpha);
}

function drawFallbackCatStoppedAtPipe(mouthX, alpha) {
  const x = mouthX - 228;
  const y = GROUND_Y - 128;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x, y);
  ctx.fillStyle = "rgba(2, 6, 16, 0.28)";
  roundedRect(34, 119, 168, 8, 4);
  ctx.fill();
  ctx.fillStyle = "#5d6474";
  roundedRect(74, 28, 142, 72, 28);
  ctx.fill();
  ctx.fillStyle = "#4c5261";
  roundedRect(184, 48, 58, 48, 22);
  ctx.fill();
  ctx.fillStyle = "#f5c8c0";
  ctx.beginPath();
  ctx.arc(222, 58, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawCatBossSprite(reveal, offsetX = 0) {
  const frameIndex = Math.floor(game.distance / 36) % catBossSprite.frames.length;
  const frame = catBossSprite.frames[frameIndex];
  const drawHeight = catBossSprite.drawHeight;
  const drawWidth = drawHeight * (frame.w / frame.h);
  const jumpOffset = getBossJumpOffset();
  const x = lerp(CAT_BOSS_HIDDEN_X, CAT_BOSS_VISIBLE_X, reveal) + jumpOffset.x + offsetX;
  const surfaceY = getSurfaceYAtRange(x + drawWidth * 0.28, x + drawWidth * 0.86);
  const runBounce = Math.sin(game.distance * 0.04) * 2;
  const y = surfaceY - drawHeight + 5 + runBounce + jumpOffset.y;

  ctx.save();
  ctx.globalAlpha = clamp(reveal * 1.28, 0, 1);
  ctx.fillStyle = "rgba(2, 6, 16, 0.26)";
  const jumpAmount = jumpOffset.amount || 0;
  const shadowWidth = drawWidth * 0.74 * (1 - jumpAmount * 0.3);
  const shadowX = x + drawWidth * 0.1 + (drawWidth * 0.74 - shadowWidth) / 2;
  roundedRect(shadowX, surfaceY - 9, shadowWidth, 8, 4);
  ctx.fill();
  if (jumpAmount > 0) {
    ctx.translate(x + drawWidth * 0.52, y + drawHeight * 0.58);
    ctx.rotate(-jumpAmount * 0.08);
    ctx.drawImage(
      catBossSprite.image,
      frame.x,
      frame.y,
      frame.w,
      frame.h,
      -drawWidth * 0.52,
      -drawHeight * 0.58,
      drawWidth,
      drawHeight
    );
  } else {
    ctx.drawImage(catBossSprite.image, frame.x, frame.y, frame.w, frame.h, x, y, drawWidth, drawHeight);
  }
  ctx.restore();
}

function drawCatAttackSprite(reveal) {
  const frameIndex = getCatAttackFrameIndex();
  const sx = (frameIndex % catAttackSprite.columns) * catAttackSprite.frameWidth;
  const sy = Math.floor(frameIndex / catAttackSprite.columns) * catAttackSprite.frameHeight;
  const drawWidth = catAttackSprite.frameWidth * catAttackSprite.scale;
  const drawHeight = catAttackSprite.frameHeight * catAttackSprite.scale;
  const restFrontX = lerp(CAT_BOSS_HIDDEN_X, CAT_BOSS_VISIBLE_X, reveal) + 250;
  const attackFrontX = bossAttack.x + bossAttack.w * 1.28;
  const frontX = lerp(restFrontX, attackFrontX, getBossAttackMotionAmount());
  const jumpOffset = bossAttack.state === "strike" ? { x: 0, y: 0, amount: 0 } : getBossJumpOffset();
  const x =
    frontX - (catAttackSprite.frameWidth - catAttackSprite.anchorRight) * catAttackSprite.scale + jumpOffset.x * 0.35;
  const runBounce = Math.sin(game.distance * 0.04) * 1.2;
  const spriteSurfaceY = Math.max(bossAttack.surfaceY, BOSS_ATTACK_MIN_VISUAL_SURFACE_Y);
  const y =
    spriteSurfaceY -
    (catAttackSprite.frameHeight - catAttackSprite.groundPad) * catAttackSprite.scale +
    runBounce +
    jumpOffset.y * 0.48;
  const jumpAmount = jumpOffset.amount || 0;
  const shadowWidth = drawWidth * 0.82 * (1 - jumpAmount * 0.25);
  const shadowX = x + drawWidth * 0.08 + (drawWidth * 0.82 - shadowWidth) / 2;

  ctx.save();
  ctx.globalAlpha = clamp(reveal * 1.35, 0, 1);
  ctx.fillStyle = "rgba(2, 6, 16, 0.3)";
  roundedRect(shadowX, bossAttack.surfaceY - 9, shadowWidth, 8, 4);
  ctx.fill();
  ctx.drawImage(
    catAttackSprite.image,
    sx,
    sy,
    catAttackSprite.frameWidth,
    catAttackSprite.frameHeight,
    x,
    y,
    drawWidth,
    drawHeight
  );
  ctx.restore();
}

function getCatAttackFrameIndex() {
  if (bossAttack.state === "warning") {
    const progress = clamp(1 - bossAttack.timer / BOSS_ATTACK_WARNING_TIME, 0, 1);
    return Math.min(3, Math.floor(progress * 4));
  }

  if (bossAttack.state === "strike") {
    const progress = clamp(1 - bossAttack.timer / BOSS_ATTACK_STRIKE_TIME, 0, 1);
    return Math.min(8, 4 + Math.floor(progress * 5));
  }

  const progress = clamp(1 - bossAttack.timer / BOSS_ATTACK_RECOVER_TIME, 0, 1);
  return Math.min(catAttackSprite.frames - 1, 8 + Math.floor(progress * 4));
}

function getBossAttackMotionAmount() {
  if (bossAttack.state === "warning") {
    const progress = clamp(1 - bossAttack.timer / BOSS_ATTACK_WARNING_TIME, 0, 1);
    return easeInOutCubic(progress) * 0.72;
  }

  if (bossAttack.state === "strike") {
    const progress = clamp(1 - bossAttack.timer / BOSS_ATTACK_STRIKE_TIME, 0, 1);
    return lerp(0.72, 1, easeInOutCubic(progress));
  }

  if (bossAttack.state === "recover") {
    const progress = clamp(1 - bossAttack.timer / BOSS_ATTACK_RECOVER_TIME, 0, 1);
    return lerp(1, 0.45, easeInOutCubic(progress));
  }

  return 0;
}

function getBossJumpOffset() {
  if (bossJump.timer <= 0) {
    return { x: 0, y: 0 };
  }

  const progress = clamp(1 - bossJump.timer / BOSS_JUMP_DURATION, 0, 1);
  const arc = Math.sin(progress * Math.PI);
  return {
    x: arc * BOSS_JUMP_FORWARD,
    y: -arc * BOSS_JUMP_HEIGHT,
    amount: arc,
  };
}

function isBossAttackVisible() {
  return bossAttack.state === "warning" || bossAttack.state === "strike" || bossAttack.state === "recover";
}

function drawFallbackBossCat(reveal, offsetX = 0) {
  const jumpOffset = getBossJumpOffset();
  const x = lerp(CAT_BOSS_HIDDEN_X, CAT_BOSS_VISIBLE_X, reveal) + jumpOffset.x + offsetX;
  const runBounce = Math.sin(game.distance * 0.04) * 2;
  const legStep = Math.sin(game.distance * 0.09);
  const surfaceY = getSurfaceYAtRange(x + 86, x + 260);
  const y = surfaceY - 128 + runBounce + jumpOffset.y;

  ctx.save();
  ctx.translate(x, y);
  ctx.globalAlpha = clamp(reveal * 1.28, 0, 1);

  ctx.fillStyle = "rgba(2, 6, 16, 0.28)";
  roundedRect(72, 118, 230, 10, 5);
  ctx.fill();

  ctx.fillStyle = "#7b472d";
  roundedRect(34, 45, 218, 70, 18);
  ctx.fill();
  ctx.fillStyle = "#a86135";
  roundedRect(48, 35, 210, 72, 18);
  ctx.fill();
  ctx.fillStyle = "#c7773c";
  roundedRect(82, 48, 118, 48, 16);
  ctx.fill();

  ctx.fillStyle = "#5a2f26";
  ctx.fillRect(82, 37, 10, 34);
  ctx.fillRect(126, 34, 10, 32);
  ctx.fillRect(172, 38, 10, 30);

  ctx.fillStyle = "#6c3b29";
  roundedRect(8, 24, 72, 22, 11);
  ctx.fill();
  ctx.fillStyle = "#a86135";
  roundedRect(2, 16, 78, 24, 12);
  ctx.fill();

  ctx.fillStyle = "#9b5b35";
  roundedRect(76, 92 + legStep * 3, 42, 36, 10);
  ctx.fill();
  roundedRect(176, 94 - legStep * 3, 44, 34, 10);
  ctx.fill();
  ctx.fillStyle = "#d6ad7a";
  roundedRect(202, 112 - legStep * 3, 72, 18, 9);
  ctx.fill();

  ctx.fillStyle = "#9f5a32";
  roundedRect(206, 18, 96, 82, 18);
  ctx.fill();
  ctx.fillStyle = "#c8773e";
  roundedRect(218, 25, 80, 70, 16);
  ctx.fill();

  ctx.fillStyle = "#9f5a32";
  ctx.beginPath();
  ctx.moveTo(218, 26);
  ctx.lineTo(232, -4);
  ctx.lineTo(250, 29);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(270, 28);
  ctx.lineTo(292, 0);
  ctx.lineTo(294, 38);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#f0b3a0";
  ctx.beginPath();
  ctx.moveTo(228, 22);
  ctx.lineTo(234, 9);
  ctx.lineTo(242, 25);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(279, 25);
  ctx.lineTo(288, 12);
  ctx.lineTo(289, 31);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#f2c789";
  roundedRect(254, 58, 54, 30, 12);
  ctx.fill();
  ctx.fillStyle = "#233044";
  ctx.fillRect(254, 47, 8, 8);
  ctx.fillRect(286, 48, 8, 8);
  ctx.fillRect(294, 67, 8, 6);

  ctx.strokeStyle = "#233044";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(298, 72);
  ctx.lineTo(326, 66);
  ctx.moveTo(298, 78);
  ctx.lineTo(328, 78);
  ctx.moveTo(298, 84);
  ctx.lineTo(324, 91);
  ctx.stroke();

  ctx.fillStyle = "#5a2f26";
  ctx.fillRect(230, 29, 9, 28);
  ctx.fillRect(268, 27, 9, 26);
  ctx.restore();
}

function drawBossAttackWarning() {
  if (bossAttack.state !== "warning") return;

  const elapsed = BOSS_ATTACK_WARNING_TIME - bossAttack.timer;
  const pulse = 0.55 + Math.sin(elapsed * 0.42) * 0.28;
  const centerX = bossAttack.x + bossAttack.w / 2;
  const markY = bossAttack.y - 42;
  const surfaceY = bossAttack.surfaceY;
  const dangerX = bossAttack.x + bossAttack.w * BOSS_ATTACK_HIT_PAD_X;
  const dangerW = bossAttack.w * (1 - BOSS_ATTACK_HIT_PAD_X * 2);

  ctx.save();
  ctx.globalAlpha = clamp(0.78 + pulse * 0.22, 0, 1);
  ctx.fillStyle = `rgba(255, 74, 66, ${0.22 + pulse * 0.22})`;
  roundedRect(dangerX, surfaceY - BOSS_ATTACK_HIT_HEIGHT - 4, dangerW, BOSS_ATTACK_HIT_HEIGHT + 8, 6);
  ctx.fill();

  ctx.fillStyle = `rgba(255, 207, 90, ${0.78 + pulse * 0.18})`;
  ctx.strokeStyle = "rgba(87, 42, 34, 0.78)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(centerX, markY);
  ctx.lineTo(centerX - 24, markY + 42);
  ctx.lineTo(centerX + 24, markY + 42);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#2b2633";
  ctx.fillRect(centerX - 3, markY + 12, 6, 18);
  ctx.fillRect(centerX - 3, markY + 34, 6, 6);
  ctx.restore();
}

function drawBossAttackStrike() {
  if (bossAttack.state !== "strike" && bossAttack.state !== "recover") return;
  if (catAttackSprite.loaded) return;

  const recovering = bossAttack.state === "recover";
  const recoverAmount = recovering ? 1 - bossAttack.timer / BOSS_ATTACK_RECOVER_TIME : 0;
  const lift = recoverAmount * 42;
  const jitter = bossAttack.state === "strike" ? Math.sin(bossAttack.timer * 1.2) * 1.5 : 0;
  const pawY = bossAttack.y - lift + jitter;
  const armStartX = 42;
  const armEndX = bossAttack.x + bossAttack.w * 0.56;
  const armY = pawY + 28;
  const surfaceY = bossAttack.surfaceY;

  ctx.save();
  ctx.globalAlpha = recovering ? 1 - recoverAmount * 0.45 : 1;

  ctx.fillStyle = "rgba(2, 6, 16, 0.22)";
  roundedRect(bossAttack.x + 8, surfaceY - 9, bossAttack.w * 0.82, 8, 4);
  ctx.fill();

  ctx.fillStyle = "#5e3740";
  roundedRect(armStartX, armY + 5, armEndX - armStartX, 21, 10);
  ctx.fill();
  ctx.fillStyle = "#7d4b58";
  roundedRect(armStartX, armY, armEndX - armStartX, 22, 11);
  ctx.fill();

  ctx.fillStyle = "#8c5964";
  roundedRect(bossAttack.x, pawY + 12, bossAttack.w, 56, 17);
  ctx.fill();
  ctx.fillStyle = "#b98782";
  roundedRect(bossAttack.x + 14, pawY + 28, bossAttack.w * 0.58, 28, 12);
  ctx.fill();

  ctx.fillStyle = "#f2d7b0";
  for (let index = 0; index < 4; index += 1) {
    const clawX = bossAttack.x + 12 + index * 18;
    ctx.beginPath();
    ctx.moveTo(clawX, pawY + 64);
    ctx.lineTo(clawX + 9, pawY + 76);
    ctx.lineTo(clawX + 18, pawY + 64);
    ctx.closePath();
    ctx.fill();
  }

  if (bossAttack.state === "strike") {
    ctx.fillStyle = "rgba(255, 211, 106, 0.36)";
    roundedRect(bossAttack.x + 8, surfaceY - 7, bossAttack.w * 0.76, 6, 3);
    ctx.fill();
  }

  ctx.restore();
}

function drawCloud(cloud) {
  const sprite = getCloudSprite(cloud);
  if (sprite.loaded) {
    const width = getCloudWidth(cloud);
    ctx.drawImage(sprite.image, cloud.x, cloud.y, width, cloud.size);
    return;
  }

  ctx.fillStyle = "rgba(255, 255, 255, 0.82)";
  roundedRect(cloud.x, cloud.y + cloud.size * 0.28, cloud.size * 2.2, cloud.size * 0.58, 12);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cloud.x + cloud.size * 0.55, cloud.y + cloud.size * 0.35, cloud.size * 0.42, 0, Math.PI * 2);
  ctx.arc(cloud.x + cloud.size * 1.05, cloud.y + cloud.size * 0.22, cloud.size * 0.56, 0, Math.PI * 2);
  ctx.arc(cloud.x + cloud.size * 1.62, cloud.y + cloud.size * 0.38, cloud.size * 0.4, 0, Math.PI * 2);
  ctx.fill();
}

function getCloudSprite(cloud) {
  return cloudSprites[cloud.variant % cloudSprites.length];
}

function getCloudWidth(cloud) {
  return cloud.size * getCloudSprite(cloud).aspect;
}

function drawFarHills() {
  const night = getNightAmount();

  if (mountainSprite.loaded) {
    drawMountainLayer(148, 142, 0.32, 0.08);
    drawMountainLayer(124, 194, 0.52, 0.14);

    const haze = ctx.createLinearGradient(0, 82, 0, GROUND_Y);
    haze.addColorStop(0, "rgba(255, 241, 190, 0)");
    haze.addColorStop(0.54, "rgba(255, 236, 179, 0.14)");
    haze.addColorStop(1, "rgba(255, 236, 179, 0.24)");
    ctx.save();
    ctx.globalAlpha = 1 - night * 0.82;
    ctx.fillStyle = haze;
    ctx.fillRect(0, 82, WORLD_WIDTH, GROUND_Y - 82);
    ctx.restore();

    if (night > 0) {
      const nightHaze = ctx.createLinearGradient(0, 82, 0, GROUND_Y);
      nightHaze.addColorStop(0, "rgba(18, 31, 63, 0)");
      nightHaze.addColorStop(0.55, "rgba(23, 42, 78, 0.16)");
      nightHaze.addColorStop(1, "rgba(27, 35, 58, 0.34)");
      ctx.save();
      ctx.globalAlpha = night;
      ctx.fillStyle = nightHaze;
      ctx.fillRect(0, 82, WORLD_WIDTH, GROUND_Y - 82);
      ctx.restore();
    }
    return;
  }

  ctx.fillStyle = "rgba(163, 139, 94, 0.38)";
  ctx.beginPath();
  ctx.moveTo(0, GROUND_Y);
  ctx.lineTo(0, 244);
  ctx.quadraticCurveTo(104, 210, 220, 248);
  ctx.quadraticCurveTo(348, 184, 504, 248);
  ctx.quadraticCurveTo(632, 212, 748, 250);
  ctx.quadraticCurveTo(860, 206, WORLD_WIDTH, 244);
  ctx.lineTo(WORLD_WIDTH, GROUND_Y);
  ctx.closePath();
  ctx.fill();
}

function drawMountainLayer(y, height, alpha, parallax) {
  const night = getNightAmount();
  const width = height * mountainSprite.aspect;
  const offset = (game.distance * parallax) % width;
  const sepia = lerp(0.18, 0.02, night).toFixed(2);
  const saturate = lerp(0.48, 0.62, night).toFixed(2);
  const brightness = lerp(1.14, 0.58, night).toFixed(2);

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.filter = `sepia(${sepia}) saturate(${saturate}) brightness(${brightness})`;
  for (let x = -offset - width; x < WORLD_WIDTH + width; x += width) {
    ctx.drawImage(mountainSprite.image, x, y, width, height);
  }
  ctx.restore();
}

function drawGround() {
  const groundHeight = WORLD_HEIGHT - GROUND_Y;
  const tileHeight = groundHeight + 10;
  const tileCropX = 8;
  const tileAspect = (247 - tileCropX * 2) / 173;
  const tileWidth = Math.round(tileHeight * tileAspect);
  const tileOverlap = 2;
  const offset = game.distance % tileWidth;

  ctx.fillStyle = "#7d5a2b";
  ctx.fillRect(0, GROUND_Y, WORLD_WIDTH, groundHeight);

  if (groundSprites.every((sprite) => sprite.loaded)) {
    for (let x = -offset - tileWidth; x < WORLD_WIDTH + tileWidth; x += tileWidth) {
      const index = Math.abs(Math.floor((x + game.distance) / tileWidth)) % groundSprites.length;
      const image = groundSprites[index].image;
      ctx.drawImage(
        image,
        tileCropX,
        0,
        image.naturalWidth - tileCropX * 2,
        image.naturalHeight,
        x - tileOverlap,
        GROUND_Y - 10,
        tileWidth + tileOverlap * 2,
        tileHeight
      );
    }
    return;
  }

  ctx.fillStyle = "#6aae71";
  ctx.fillRect(0, GROUND_Y, WORLD_WIDTH, groundHeight);
  ctx.fillStyle = "#477b52";
  ctx.fillRect(0, GROUND_Y, WORLD_WIDTH, 5);
  ctx.fillStyle = "rgba(36, 48, 63, 0.16)";
  for (let x = -offset; x < WORLD_WIDTH; x += 42) {
    ctx.fillRect(x, GROUND_Y + 20, 18, 4);
    ctx.fillRect(x + 25, GROUND_Y + 42, 8, 4);
  }
}

function drawPlatforms() {
  platforms.forEach(drawPlatform);
}

function drawEscapePipe() {
  if (!escapePipe) return;

  const x = escapePipe.x;
  const y = escapePipe.surfaceY - escapePipe.h + 30;

  if (pipeSprite.loaded) {
    const source = pipeSprite.source;
    ctx.drawImage(
      pipeSprite.image,
      source.x,
      source.y,
      source.w,
      source.h,
      x,
      y,
      escapePipe.w,
      escapePipe.h
    );
    return;
  }

  ctx.fillStyle = "#7ccb2d";
  roundedRect(x + escapePipe.w * 0.18, y + escapePipe.h * 0.18, escapePipe.w * 0.58, escapePipe.h * 0.72, 12);
  ctx.fill();
  ctx.fillStyle = "#9bea35";
  roundedRect(x, y + escapePipe.h * 0.52, escapePipe.w * 0.56, escapePipe.h * 0.3, 16);
  ctx.fill();
  ctx.fillStyle = "#16351f";
  roundedRect(x + 10, y + escapePipe.h * 0.57, escapePipe.w * 0.36, escapePipe.h * 0.2, 12);
  ctx.fill();
}

function drawPlatform(platform) {
  if (platformSprite.loaded) {
    const variant = platform.variant;
    ctx.drawImage(
      platformSprite.image,
      variant.x,
      variant.y,
      variant.w,
      variant.h,
      platform.x,
      platform.y,
      platform.w,
      platform.h
    );
    return;
  }

  ctx.fillStyle = "#5f7d2e";
  roundedRect(platform.x, platform.surfaceY - 8, platform.w, 12, 4);
  ctx.fill();
  ctx.fillStyle = "#7a4a2b";
  roundedRect(platform.x + 6, platform.surfaceY, platform.w - 12, 26, 5);
  ctx.fill();
}

function drawRunnerShadow(x, width, alpha) {
  const shadowY = runner.grounded ? runner.surfaceY : isPlatformRunActive() ? null : GROUND_Y;
  if (shadowY === null) return;

  ctx.fillStyle = `rgba(36, 48, 63, ${alpha})`;
  ctx.fillRect(x, shadowY - 6, width, 6);
}

function drawRunner() {
  if (mouseSprite.loaded) {
    drawMouseRunner();
    return;
  }

  const duck = runner.ducking;
  const x = runner.x;
  const y = runner.y;
  const legFrame = Math.floor(runner.frame) % 2;

  if (duck) {
    drawDuckingRunner(x, y, legFrame);
    return;
  }

  drawRunnerShadow(x + 8, 55, 0.14);

  ctx.fillStyle = "#4b9558";
  ctx.fillRect(x + 12, y + 20, 34, 35);
  ctx.fillRect(x + 36, y + 10, 36, 26);
  ctx.fillRect(x + 66, y + 18, 12, 10);
  ctx.fillRect(x + 4, y + 32, 14, 10);

  ctx.fillStyle = "#356a46";
  ctx.fillRect(x + 43, y + 15, 8, 6);
  ctx.fillRect(x + 59, y + 31, 15, 5);
  ctx.fillRect(x + 15, y + 16, 11, 7);

  ctx.fillStyle = "#24303f";
  ctx.fillRect(x + 60, y + 17, 5, 5);
  ctx.fillRect(x + 38, y + 47, 10, 8);
  ctx.fillRect(x + 14, y + 50, 10, 7);

  ctx.fillStyle = "#4b9558";
  if (runner.grounded && legFrame === 0) {
    ctx.fillRect(x + 18, y + 54, 10, 18);
    ctx.fillRect(x + 39, y + 53, 10, 12);
    ctx.fillStyle = "#24303f";
    ctx.fillRect(x + 17, y + 70, 18, 5);
    ctx.fillRect(x + 39, y + 63, 16, 5);
  } else {
    ctx.fillRect(x + 18, y + 53, 10, 12);
    ctx.fillRect(x + 40, y + 54, 10, 18);
    ctx.fillStyle = "#24303f";
    ctx.fillRect(x + 16, y + 63, 17, 5);
    ctx.fillRect(x + 40, y + 70, 18, 5);
  }
}

function drawMouseRunner() {
  const frame = getMouseFrame();
  const drawWidth = runner.ducking ? mouseSprite.duckWidth : mouseSprite.width;
  const drawHeight = runner.ducking ? mouseSprite.duckHeight : mouseSprite.height;
  const drawX = runner.x;
  const drawY = runner.y + mouseSprite.groundOffset;

  drawRunnerShadow(drawX + drawWidth * 0.28, drawWidth * 0.44, 0.16);

  ctx.drawImage(
    mouseSprite.image,
    frame * mouseSprite.frameWidth,
    0,
    mouseSprite.frameWidth,
    mouseSprite.frameHeight,
    drawX,
    drawY,
    drawWidth,
    drawHeight
  );
}

function getMouseFrame() {
  if (!runner.grounded) {
    return 3;
  }
  if (runner.ducking) {
    return 9;
  }
  if (game.status !== "running") {
    return 0;
  }
  return Math.floor(game.distance / 30) % mouseSprite.frames;
}

function drawDuckingRunner(x, y, legFrame) {
  drawRunnerShadow(x + 7, 66, 0.14);

  ctx.fillStyle = "#4b9558";
  ctx.fillRect(x + 10, y + 15, 46, 26);
  ctx.fillRect(x + 48, y + 8, 36, 22);
  ctx.fillRect(x + 76, y + 15, 12, 9);
  ctx.fillRect(x, y + 26, 18, 9);

  ctx.fillStyle = "#356a46";
  ctx.fillRect(x + 55, y + 12, 9, 6);
  ctx.fillRect(x + 69, y + 27, 14, 4);

  ctx.fillStyle = "#24303f";
  ctx.fillRect(x + 70, y + 13, 5, 5);
  if (legFrame === 0) {
    ctx.fillRect(x + 19, y + 40, 20, 5);
    ctx.fillRect(x + 45, y + 40, 15, 5);
  } else {
    ctx.fillRect(x + 14, y + 40, 15, 5);
    ctx.fillRect(x + 42, y + 40, 20, 5);
  }
}

function drawObstacle(obstacle) {
  if (obstacle.type === "rock") {
    drawRock(obstacle);
    return;
  }
  drawCactus(obstacle);
}

function drawCactus(obstacle) {
  if (cactusSprite.loaded) {
    drawCactusSprite(obstacle);
    return;
  }

  const unit = obstacle.pack === 2 ? 22 : 18;
  for (let i = 0; i < obstacle.pack; i += 1) {
    const x = obstacle.x + i * unit;
    const h = obstacle.h - i * 10;
    const y = GROUND_Y - h;
    ctx.fillStyle = "#27715c";
    ctx.fillRect(x + 8, y, 18, h);
    ctx.fillRect(x, y + 18, 11, 10);
    ctx.fillRect(x, y + 28, 8, 18);
    ctx.fillRect(x + 24, y + 28, 11, 10);
    ctx.fillRect(x + 30, y + 38, 8, 17);
    ctx.fillStyle = "#1f5848";
    ctx.fillRect(x + 19, y + 5, 5, h - 8);
  }
}

function drawCactusSprite(obstacle) {
  const itemWidth = Math.round(obstacle.h * cactusSprite.aspect);
  const spacing = Math.max(12, itemWidth * 0.58);
  const totalWidth = obstacle.pack === 2 ? itemWidth + spacing : itemWidth;
  const startX = obstacle.x + (obstacle.w - totalWidth) / 2;

  for (let i = 0; i < obstacle.pack; i += 1) {
    const height = obstacle.h - i * 9;
    const width = Math.round(height * cactusSprite.aspect);
    const x = startX + i * spacing;
    const y = GROUND_Y - height;

    ctx.fillStyle = "rgba(36, 48, 63, 0.16)";
    ctx.fillRect(x + width * 0.18, GROUND_Y - 5, width * 0.64, 5);
    ctx.drawImage(cactusSprite.image, x, y, width, height);
  }
}

function drawRock(obstacle) {
  if (rockSprite.loaded) {
    drawRockSprite(obstacle);
    return;
  }

  const { x, y, w, h } = obstacle;
  ctx.fillStyle = "#806552";
  ctx.fillRect(x + 5, y + 8, w - 10, h - 8);
  ctx.fillRect(x + 14, y, w - 22, 12);
  ctx.fillStyle = "#594537";
  ctx.fillRect(x + 9, y + h - 9, w - 18, 8);
  ctx.fillRect(x + 26, y + 9, 7, 8);
}

function drawRockSprite(obstacle) {
  const { x, y, w, h } = obstacle;

  ctx.fillStyle = "rgba(18, 24, 32, 0.26)";
  ctx.fillRect(x + w * 0.12, GROUND_Y - 6, w * 0.76, 6);

  ctx.save();
  ctx.globalAlpha = 0.42;
  ctx.filter = "brightness(0)";
  ctx.drawImage(rockSprite.image, x - 2, y, w, h);
  ctx.drawImage(rockSprite.image, x + 2, y, w, h);
  ctx.drawImage(rockSprite.image, x, y - 2, w, h);
  ctx.drawImage(rockSprite.image, x, y + 2, w, h);
  ctx.restore();

  ctx.save();
  ctx.filter = "brightness(1.18) contrast(1.22)";
  ctx.drawImage(rockSprite.image, x, y, w, h);
  ctx.restore();
}

function drawBird(bird) {
  if (birdSprite.loaded) {
    drawBirdSprite(bird);
    return;
  }

  drawFallbackBird(bird);
}

function drawBirdSprite(bird) {
  const frame = Math.floor(bird.flap) % birdSprite.frames;

  ctx.save();
  ctx.translate(bird.x + bird.w / 2, bird.y + bird.h / 2);
  ctx.rotate(bird.tilt);
  ctx.scale(-1, 1);
  ctx.drawImage(
    birdSprite.image,
    frame * birdSprite.frameWidth,
    0,
    birdSprite.frameWidth,
    birdSprite.frameHeight,
    -bird.w / 2,
    -bird.h / 2,
    bird.w,
    bird.h
  );
  ctx.restore();
}

function drawFallbackBird(bird) {
  const wingUp = Math.sin(bird.flap) > 0;
  const x = -30;
  const y = -18;

  ctx.save();
  ctx.translate(bird.x + bird.w / 2, bird.y + bird.h / 2);
  ctx.rotate(bird.tilt);
  ctx.scale(-1, 1);
  ctx.fillStyle = "#c65b48";
  ctx.fillRect(x + 12, y + 13, 30, 12);
  ctx.fillRect(x + 38, y + 9, 14, 10);
  ctx.fillStyle = "#24303f";
  ctx.fillRect(x + 47, y + 11, 4, 4);
  ctx.fillStyle = "#f5a25b";
  ctx.fillRect(x + 52, y + 14, 8, 4);

  ctx.fillStyle = "#9c3f39";
  if (wingUp) {
    ctx.fillRect(x + 18, y, 12, 16);
    ctx.fillRect(x + 20, y - 8, 8, 10);
  } else {
    ctx.fillRect(x + 18, y + 22, 12, 15);
    ctx.fillRect(x + 21, y + 35, 8, 8);
  }
  ctx.restore();
}

function drawDust(particle) {
  const alpha = clamp(particle.life / particle.maxLife, 0, 1);
  ctx.fillStyle = `rgba(89, 69, 55, ${alpha * 0.28})`;
  ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
}

function roundedRect(x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
}

function loop(time) {
  const delta = game.lastTime ? time - game.lastTime : 16.67;
  game.lastTime = time;
  update(delta);
  draw();
  requestAnimationFrame(loop);
}

function handlePrimaryAction(event) {
  const tag = event.target.tagName.toLowerCase();
  if (tag === "button") return;
  activeJumpPointerId = event.pointerId;
  if (game.status === "ready" || game.status === "over") {
    startGame();
    return;
  }
  jump();
}

function pressJumpControl(event) {
  event.preventDefault();
  event.stopPropagation();
  activeJumpPointerId = event.pointerId;
  event.currentTarget.setPointerCapture?.(event.pointerId);
  startGame();
}

function releaseJumpPointer(event) {
  if (activeJumpPointerId === null || event.pointerId !== activeJumpPointerId) return;
  activeJumpPointerId = null;
  releaseJump();
}

function pressDuckControl(event) {
  event.preventDefault();
  event.stopPropagation();
  activeDuckPointerId = event.pointerId;
  event.currentTarget.setPointerCapture?.(event.pointerId);
  setDuck(true);
}

function releaseDuckPointer(event) {
  if (activeDuckPointerId !== null && event.pointerId !== activeDuckPointerId) return;
  activeDuckPointerId = null;
  setDuck(false);
}

window.addEventListener("resize", resizeCanvas);
window.addEventListener("keydown", (event) => {
  if (event.code === "Space" || event.code === "ArrowUp") {
    event.preventDefault();
    if (!event.repeat) {
      startGame();
    }
  }
  if (event.code === "ArrowDown") {
    event.preventDefault();
    setDuck(true);
  }
  if (event.code === "KeyP") {
    pauseGame();
  }
  if (event.code === "KeyR") {
    resetGame();
    startGame();
  }
});
window.addEventListener("keyup", (event) => {
  if (event.code === "Space" || event.code === "ArrowUp") {
    releaseJump();
  }
  if (event.code === "ArrowDown") {
    setDuck(false);
  }
});
canvas.addEventListener("pointerdown", handlePrimaryAction);
overlay.addEventListener("pointerdown", handlePrimaryAction);
window.addEventListener("pointerup", releaseJumpPointer);
window.addEventListener("pointercancel", releaseJumpPointer);
if (jumpTouchButton) {
  jumpTouchButton.addEventListener("pointerdown", pressJumpControl);
  jumpTouchButton.addEventListener("pointerup", releaseJumpPointer);
  jumpTouchButton.addEventListener("pointercancel", releaseJumpPointer);
  jumpTouchButton.addEventListener("lostpointercapture", releaseJumpPointer);
}
if (duckTouchButton) {
  duckTouchButton.addEventListener("pointerdown", pressDuckControl);
  duckTouchButton.addEventListener("pointerup", releaseDuckPointer);
  duckTouchButton.addEventListener("pointercancel", releaseDuckPointer);
  duckTouchButton.addEventListener("lostpointercapture", releaseDuckPointer);
}
startButton.addEventListener("click", startGame);
pauseButton.addEventListener("click", pauseGame);
restartButton.addEventListener("click", () => {
  resetGame();
  startGame();
});
overlayButton.addEventListener("click", startGame);

resizeCanvas();
resetGame();
requestAnimationFrame(loop);
