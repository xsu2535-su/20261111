// ===== 角色 1（玩家）圖片 =====
let stopImg, walkImg, runImg, jumpImg;
let slideImgs = [];

// ===== 背景圖片 =====
let bgImg;
const BG_PATH = 'bg1.png';        // 背景圖路徑（和 index.html 同一層）
const GROUND_OFFSET = 0;          // 微調地面高度：正數往下、負數往上（單位：像素）

// ===== 角色 3（電腦角色）圖片 =====
let walk3Img, jump3Img, death3Img;

// ===== 角色 3 的圖片路徑（檔名若不同，只要改這三行）=====
const WALK3_PATH = '3/walk/walk.png';
const JUMP3_PATH = '3/jump/jump.png';
const DEATH3_PATH = '3/death/death.png';

// ===== 影格數量 =====
const STOP_FRAMES = 2;
const WALK_FRAMES = 4;
const RUN_FRAMES = 7;
const JUMP_FRAMES = 4;
const SLIDE_COUNT = 5;
const WALK3_FRAMES = 3;  // 103*51
const JUMP3_FRAMES = 3;  // 103*53
const DEATH3_FRAMES = 3; // 100*54

// ===== 角色顯示與移動設定 =====
const SCALE_FACTOR = 3;
const WALK_SPEED = 5;
const RUN_SPEED = 12;
const GRAVITY = 1;
const JUMP_POWER = 22;
const ANIM_SPEED = 8;
const SLIDE_SPEED = 16;
const SLIDE_FRAME_TICKS = 6;

// ===== 角色 3 的設定 =====
const C3_SCALE = SCALE_FACTOR * 1.8; // 角色 3 原圖較小，放大到和角色 1 差不多大
const C3_SPEED = 3;                  // 角色 3 來回走的速度
const SPRITE3_FACING = 1;            // 角色 3 原圖朝向：1 = 朝右、-1 = 朝左
const C3_PATROL_LEFT = 0.4;          // 巡邏範圍左邊界（佔畫面寬度的比例）
const C3_PATROL_RIGHT_MARGIN = 100;  // 巡邏範圍右邊界離畫面右邊多遠

// ===== 碰撞與問答設定 =====
const COLLIDE_DIST = 60 * SCALE_FACTOR; // 兩角色中心距離小於這個值就算碰撞
const RESULT_TICKS = 110;               // 答錯時，結果動畫播放的幀數
const DEATH_STEP_TICKS = 8;             // 角色 3 輸掉動畫每一步停留的幀數（越大越慢）
const DEATH_LOOPS = 3;                  // 角色 3 輸掉時，動作來回重複幾次（2~3 次都可以）
const WIN_JUMPS = 3;                    // 角色 1 贏的時候，連續跳幾下
const COOLDOWN_TICKS = 90;              // 答完題後，多久之內不會再觸發碰撞

// ===== 計分與愛心設定 =====
const START_LIVES = 3;      // 一開始有幾顆愛心
const SCORE_CORRECT = 100;  // 答對的基本分數
const SCORE_COMBO = 20;     // 連續答對，每多一次連擊多加幾分（最多算 5 次）
const SNOW_COUNT = 140;     // 飄落雪花的數量

// ===== 題庫（answer 是正確選項的編號，從 0 開始；fact 是答完後顯示的小知識）=====
const questions = [
  { q: '日本札幌每年二月都會舉辦的大型冬季慶典是？',
    options: ['櫻花祭', '雪祭', '煙火大會', '祇園祭'], answer: 1,
    fact: '札幌雪祭每年二月舉行，會在大通公園堆出好幾座巨大的雪像和冰雕，吸引世界各地的遊客。' },
  { q: '芬蘭的羅瓦涅米被宣傳為誰的「官方故鄉」？',
    options: ['聖誕老人', '白雪公主', '海盜船長', '美人魚'], answer: 0,
    fact: '羅瓦涅米位在芬蘭的拉普蘭地區，聖誕老人村就設在北極圈上，一年四季都可以去拜訪聖誕老人。' },
  { q: '北歐的冬夜裡，天空中常出現綠色、紫色光帶的奇景叫什麼？',
    options: ['流星雨', '彩虹', '極光', '日全食'], answer: 2,
    fact: '極光是太陽釋放的帶電粒子撞上地球高空大氣所發出的光，在靠近北極圈的地方最容易看到。' },
  { q: '因紐特人傳統上用雪塊蓋成的圓頂房屋叫什麼？',
    options: ['蒙古包', '冰屋', '吊腳樓', '帳篷'], answer: 1,
    fact: '冰屋是用壓實的雪塊堆成的圓頂小屋。雪裡含有很多空氣，隔熱效果好，所以屋內比外面暖和。' },
  { q: '在冰島，聖誕夜有個有趣的傳統是什麼？',
    options: ['放鞭炮', '全家去游泳', '互送書本並在夜裡閱讀', '吃粽子'], answer: 2,
    fact: '冰島有「聖誕書潮」的傳統：聖誕夜大家互送書本，然後一邊讀書，一邊享用巧克力或熱飲。' },
  { q: '加拿大魁北克冬季嘉年華的吉祥物是什麼形象？',
    options: ['雪人', '企鵝', '海狸', '大象'], answer: 0,
    fact: '魁北克冬季嘉年華是號稱世界最大的冬季嘉年華之一，吉祥物是戴著紅色尖帽的雪人 Bonhomme。' },
  { q: '俄羅斯傳說中，在新年幫小朋友送禮物的老爺爺叫什麼？',
    options: ['麋鹿爺爺', '嚴寒老人（Ded Moroz）', '雪人先生', '北風伯伯'], answer: 1,
    fact: '嚴寒老人常和孫女「雪姑娘」一起出現，在新年的時候把禮物送給小朋友。' },
  { q: '加拿大最具代表性的冬季運動是什麼？',
    options: ['棒球', '足球', '冰球', '桌球'], answer: 2,
    fact: '冰球在加拿大非常受歡迎，被稱為加拿大的冬季國球；加拿大夏天的國球則是袋棍球。' },
  { q: '聖誕老人的馴鹿是拉著什麼在天空飛行？',
    options: ['馬車', '雪橇', '熱氣球', '小火車'], answer: 1,
    fact: '傳說聖誕老人坐著馴鹿拉的雪橇送禮物。在北歐，真的有人飼養馴鹿，例如薩米人。' },
  { q: '聖誕樹最常使用下面哪一種樹？',
    options: ['榕樹', '椰子樹', '竹子', '冷杉'], answer: 3,
    fact: '聖誕樹常用冷杉或雲杉。它們是常綠樹，冬天葉子也不會掉，象徵著生命力。' }
];
let quizIndex = 0;       // 目前出第幾題
let optionRects = [];    // 選項按鈕的位置（用來判斷滑鼠點擊）
let lastItem = null;     // 剛剛回答的那一題（顯示小知識用）

// ===== 遊戲狀態 =====
// 'play' 一般 / 'quiz' 答題中 / 'result' 播放結果 / 'fact' 小知識卡 / 'end' 結束畫面
let state = 'play';
let resultType = '';     // 'correct'（角色 1 贏）或 'wrong'（角色 3 贏）
let resultTimer = 0;
let factTimer = 0;
let cooldown = 0;

// ===== 分數相關 =====
let score = 0;
let lives = START_LIVES;
let streak = 0;          // 連續答對幾題
let lastGain = 0;        // 最近一次答對得到的分數
let quizCount = 0;       // 已經回答幾題
let correctCount = 0;    // 答對幾題
let best = 0;            // 最高分（存在瀏覽器裡）
let newRecord = false;
let endTitle = '';
let endBtn = { x: 0, y: 0, w: 0, h: 0 };

// ===== 角色 1 狀態 =====
let x, groundY, y;
let vy = 0;
let facing = 1;
let sliding = false;
let slideTimer = 0;
let slideRequest = false;
let winJumpsLeft = 0;    // 贏的時候還要再跳幾下

// ===== 角色 3 狀態 =====
let x3;
let facing3 = -1;        // 角色 3 面向的方向：1 = 右、-1 = 左（走路時同時也是移動方向）

// ===== 雪花 =====
let flakes = [];

// 載入圖片時若失敗，會在 Console 顯示是哪一張
function loadImg(path) {
  return loadImage(path, null, () => print('載入失敗：' + path));
}

function preload() {
  bgImg = loadImg(BG_PATH);
  stopImg = loadImg('1/STOP/STOP.png');
  walkImg = loadImg('1/WALK/WALK.png');
  runImg = loadImg('1/RUN/RUN.png');
  jumpImg = loadImg('1/JUMP/JUMP.png');
  for (let i = 0; i < SLIDE_COUNT; i++) {
    slideImgs.push(loadImg('1/Slide base/' + i + '.png'));
  }
  walk3Img = loadImg(WALK3_PATH);
  jump3Img = loadImg(JUMP3_PATH);
  death3Img = loadImg(DEATH3_PATH);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  groundY = height / 2 + 47 * SCALE_FACTOR + GROUND_OFFSET;
  imageMode(CENTER);
  textFont('sans-serif');
  // 讀取最高分（瀏覽器若不允許儲存就略過）
  try { best = int(localStorage.getItem('snowGameBest')) || 0; } catch (e) { best = 0; }
  for (let i = 0; i < SNOW_COUNT; i++) {
    flakes.push({ x: random(width), y: random(height), r: random(1.5, 4), sp: random(0.6, 2.2), ph: random(TWO_PI) });
  }
  resetGame();
}

// 重新開始遊戲
function resetGame() {
  score = 0;
  lives = START_LIVES;
  streak = 0;
  quizCount = 0;
  correctCount = 0;
  newRecord = false;
  quizIndex = 0;
  shuffle(questions, true);   // 題目順序隨機打亂
  x = width / 4;              // 角色 1 在左邊 1/4 處
  x3 = width * 3 / 4;         // 角色 3 在右邊 3/4 處
  y = groundY;
  vy = 0;
  facing = 1;
  facing3 = -1;
  sliding = false;
  winJumpsLeft = 0;
  cooldown = 60;
  state = 'play';
}

// 遊戲結束（愛心用完，或題目全部答完）
function endGame(title) {
  endTitle = title;
  state = 'end';
  factTimer = 0;
  if (score > best) {
    best = score;
    newRecord = true;
    try { localStorage.setItem('snowGameBest', best); } catch (e) {}
  }
}

function keyPressed() {
  if (state === 'play') {
    if (keyCode === DOWN_ARROW) slideRequest = true;
  } else if (state === 'quiz') {
    // 答題時按數字鍵 1~4 選答案
    if (key.length === 1) {
      let n = key.charCodeAt(0) - 49; // '1' → 0
      if (n >= 0 && n < questions[quizIndex].options.length) answer(n);
    }
  } else if (state === 'fact') {
    if (factTimer > 20) proceedAfterFact();   // 任意鍵繼續
  } else if (state === 'end') {
    if (factTimer > 30) resetGame();          // 任意鍵重新開始
  }
}

function mousePressed() {
  if (state === 'quiz') {
    for (let i = 0; i < optionRects.length; i++) {
      let r = optionRects[i];
      if (mouseX > r.x && mouseX < r.x + r.w && mouseY > r.y && mouseY < r.y + r.h) {
        answer(i);
        return;
      }
    }
  } else if (state === 'fact') {
    if (factTimer > 20) proceedAfterFact();
  } else if (state === 'end') {
    if (factTimer > 30 && mouseX > endBtn.x && mouseX < endBtn.x + endBtn.w &&
        mouseY > endBtn.y && mouseY < endBtn.y + endBtn.h) {
      resetGame();
    }
  }
}

// 玩家選了第 i 個選項
function answer(i) {
  let item = questions[quizIndex];
  let correct = (i === item.answer);
  lastItem = item;
  resultType = correct ? 'correct' : 'wrong';
  resultTimer = 0;
  state = 'result';
  quizCount++;
  quizIndex = (quizIndex + 1) % questions.length; // 下一題
  if (correct) {
    correctCount++;
    lastGain = SCORE_CORRECT + SCORE_COMBO * min(streak, 5);
    score += lastGain;
    streak++;
    vy = -JUMP_POWER;                 // 角色 1 跳起來慶祝（第 1 下）
    winJumpsLeft = WIN_JUMPS - 1;     // 之後還要再跳幾下
  } else {
    lives--;
    streak = 0;
  }
}

// 結果和小知識都看完了，接下來要繼續玩還是結束
function proceedAfterFact() {
  if (lives <= 0) { endGame('挑戰失敗'); return; }
  if (quizCount >= questions.length) { endGame('通關成功！'); return; }
  state = 'play';
  cooldown = COOLDOWN_TICKS;
  facing3 = (x < x3) ? 1 : -1;  // 角色 3 轉身往遠離玩家的方向繼續走
}

// ================= 繪圖小工具 =================

// 畫出一個角色（影格寬度用四捨五入，寬度不能整除時也不會錯位）
function drawSprite(img, frames, frame, px, py, face, sc) {
  if (sc === undefined) sc = SCALE_FACTOR;
  let sx = round(frame * img.width / frames);
  let sw = round((frame + 1) * img.width / frames) - sx;
  let h = img.height;
  push();
  translate(px, py);
  scale(face * sc, sc);
  image(img, 0, -h / 2, sw, h, sx, 0, sw, h);
  pop();
}

// 畫角色 3（固定用 C3_SCALE，並套用原圖朝向）
function drawChar3(img, frames, frame, py) {
  drawSprite(img, frames, frame, x3, py, facing3 * SPRITE3_FACING, C3_SCALE);
}

// 畫背景：等比例放大到鋪滿整個畫面，並置中
function drawBackground() {
  background('#e3d5ca');
  if (bgImg && bgImg.width > 1) {
    let s = max(width / bgImg.width, height / bgImg.height);
    image(bgImg, width / 2, height / 2, bgImg.width * s, bgImg.height * s);
  }
}

// 飄落的雪花（畫在角色前面）
function drawSnow() {
  noStroke();
  fill(255, 235);
  for (let f of flakes) {
    f.y += f.sp;
    f.x += sin(frameCount * 0.02 + f.ph) * 0.6;
    if (f.y > height + 5) { f.y = -5; f.x = random(width); }
    circle(f.x, f.y, f.r * 2);
  }
}

// 畫愛心
function drawHeart(cx, cy, s) {
  beginShape();
  vertex(cx, cy + s * 0.6);
  bezierVertex(cx - s * 1.2, cy - s * 0.1, cx - s * 0.6, cy - s * 0.9, cx, cy - s * 0.3);
  bezierVertex(cx + s * 0.6, cy - s * 0.9, cx + s * 1.2, cy - s * 0.1, cx, cy + s * 0.6);
  endShape(CLOSE);
}

// 把文字依寬度切成多行（中文沒有空格，所以一個字一個字量）
// 呼叫前要先設定好 textSize
function wrapLines(str, maxW) {
  let lines = [], line = '';
  for (let ch of str) {
    if (textWidth(line + ch) > maxW && line !== '') {
      lines.push(line);
      line = ch;
    } else {
      line += ch;
    }
  }
  if (line !== '') lines.push(line);
  return lines;
}

// 畫左上角的分數、愛心
function drawHUD() {
  noStroke();
  fill(40, 28, 20, 175);
  rect(12, 12, 270, 100, 12);

  fill(255);
  textAlign(LEFT, TOP);
  textSize(26);
  text('分數 ' + score, 28, 22);
  if (streak >= 2) {
    fill('#ffd54f');
    textSize(18);
    text('連擊 x' + streak, 175, 29);
  }

  // 愛心
  for (let i = 0; i < START_LIVES; i++) {
    fill(i < lives ? '#e53935' : '#6d5b52');
    drawHeart(44 + i * 38, 82, 15);
  }

  // 最高分
  fill(255);
  stroke('#3d2b1f');
  strokeWeight(4);
  textAlign(RIGHT, TOP);
  textSize(20);
  text('最高分 ' + best, width - 20, 18);
  noStroke();
}

// 操作說明（只在一般狀態顯示）
function drawControlsHint() {
  fill(255);
  stroke('#3d2b1f');
  strokeWeight(4);
  textAlign(LEFT, BOTTOM);
  textSize(16);
  text('← → 移動　Shift 跑步　空白鍵／↑ 跳　↓ 滑壘', 16, height - 14);
  noStroke();
}

// ================= 主迴圈 =================
function draw() {
  drawBackground();

  if (state === 'play') drawPlay();
  else if (state === 'quiz') drawQuizScene();
  else if (state === 'result') drawResult();
  else if (state === 'fact') drawFactScene();
  else drawEndScene();
}

// ================= 一般狀態：玩家操作 + 角色 3 巡邏 + 碰撞偵測 =================
function drawPlay() {
  let right = keyIsDown(RIGHT_ARROW);
  let left = keyIsDown(LEFT_ARROW);
  let running = keyIsDown(SHIFT);
  let jumpKey = keyIsDown(32) || keyIsDown(UP_ARROW);

  if (slideRequest && !sliding && y >= groundY) {
    sliding = true;
    slideTimer = 0;
  }
  slideRequest = false;

  let moving = false;

  if (sliding) {
    slideTimer++;
    let total = SLIDE_COUNT * SLIDE_FRAME_TICKS;
    x += facing * SLIDE_SPEED * (1 - slideTimer / total);
    if (slideTimer >= total) sliding = false;
  } else {
    let speed = running ? RUN_SPEED : WALK_SPEED;
    if (right) { facing = 1; x += speed; moving = true; }
    else if (left) { facing = -1; x -= speed; moving = true; }

    if (y >= groundY && jumpKey) vy = -JUMP_POWER;
  }

  vy += GRAVITY;
  y += vy;
  if (y >= groundY) { y = groundY; vy = 0; }
  let inAir = (y < groundY);

  if (x > width + 100) x = -100;
  if (x < -100) x = width + 100;

  // 選圖
  let img, frames, currentFrame;
  if (sliding) {
    let idx = min(floor(slideTimer / SLIDE_FRAME_TICKS), SLIDE_COUNT - 1);
    img = slideImgs[idx]; frames = 1; currentFrame = 0;
  } else {
    if (inAir) { img = jumpImg; frames = JUMP_FRAMES; }
    else if (moving && (running || facing === -1)) { img = runImg; frames = RUN_FRAMES; }
    else if (moving && facing === 1) { img = walkImg; frames = WALK_FRAMES; }
    else { img = stopImg; frames = STOP_FRAMES; }
    currentFrame = floor(frameCount / ANIM_SPEED) % frames;
  }

  // 角色 3：一直來回走
  updateChar3();
  drawChar3(walk3Img, WALK3_FRAMES, floor(frameCount / ANIM_SPEED) % WALK3_FRAMES, groundY);

  // 角色 1
  drawSprite(img, frames, currentFrame, x, y, facing);

  drawSnow();
  drawHUD();
  drawControlsHint();

  // 碰撞偵測：離得夠近、沒有跳過頭頂、不在冷卻中
  if (cooldown > 0) cooldown--;
  if (cooldown <= 0 && abs(x - x3) < COLLIDE_DIST && y > groundY - 40) {
    state = 'quiz';
    sliding = false;
    vy = 0;
    y = groundY;
    facing = (x3 >= x) ? 1 : -1;  // 兩個角色面對面
    facing3 = -facing;
  }
}

// 角色 3 的巡邏：不停往一個方向走，碰到邊界就轉向
function updateChar3() {
  x3 += facing3 * C3_SPEED;
  let leftEdge = width * C3_PATROL_LEFT;
  let rightEdge = width - C3_PATROL_RIGHT_MARGIN;
  if (x3 < leftEdge) { x3 = leftEdge; facing3 = 1; }
  if (x3 > rightEdge) { x3 = rightEdge; facing3 = -1; }
}

// ================= 答題畫面 =================
function drawQuizScene() {
  // 兩個角色面對面站著（角色 3 停在走路的第一格）
  drawChar3(walk3Img, WALK3_FRAMES, 0, groundY);
  drawSprite(stopImg, STOP_FRAMES, floor(frameCount / ANIM_SPEED) % STOP_FRAMES, x, groundY, facing);
  drawSnow();

  // 半透明遮罩
  noStroke();
  fill(0, 150);
  rect(0, 0, width, height);

  let item = questions[quizIndex];
  let boxW = min(width * 0.85, 720);
  let optH = 52, gap = 12;

  // 題目太長時自動換行，題目框高度跟著變
  textSize(28);
  let qLines = wrapLines(item.q, boxW - 60);
  let qH = qLines.length * 38;
  let boxH = 30 + qH + 25 + item.options.length * (optH + gap) + 13;
  let boxX = (width - boxW) / 2;
  let boxY = max(10, (height - boxH) / 2);

  fill('#fdf6ee');
  stroke('#5c4033');
  strokeWeight(4);
  rect(boxX, boxY, boxW, boxH, 16);

  // 題目
  noStroke();
  fill('#3d2b1f');
  textAlign(CENTER, TOP);
  textSize(28);
  for (let i = 0; i < qLines.length; i++) {
    text(qLines[i], width / 2, boxY + 30 + i * 38);
  }

  // 選項按鈕
  optionRects = [];
  let optTop = boxY + 30 + qH + 25;
  textSize(22);
  for (let i = 0; i < item.options.length; i++) {
    let r = { x: boxX + 30, y: optTop + i * (optH + gap), w: boxW - 60, h: optH };
    optionRects.push(r);
    let hover = mouseX > r.x && mouseX < r.x + r.w && mouseY > r.y && mouseY < r.y + r.h;
    fill(hover ? '#f2c9a0' : '#ead9c7');
    stroke('#5c4033');
    strokeWeight(2);
    rect(r.x, r.y, r.w, r.h, 10);
    noStroke();
    fill('#3d2b1f');
    textAlign(LEFT, CENTER);
    text((i + 1) + '.  ' + item.options[i], r.x + 20, r.y + r.h / 2);
  }
}

// 角色 3 輸掉的動作：第 0→1→2→1 格來回，重複 DEATH_LOOPS 次，最後停在第 2 格
function deathFrame(t) {
  let step = floor(t / DEATH_STEP_TICKS);
  if (step >= DEATH_LOOPS * 4) return DEATH3_FRAMES - 1;
  return [0, 1, 2, 1][step % 4];
}

// ================= 答完題：播放答對 / 答錯動作 =================
function drawResult() {
  resultTimer++;
  let dir = (x3 >= x) ? 1 : -1; // 角色 3 在角色 1 的哪一側

  vy += GRAVITY;
  y += vy;
  if (y >= groundY) {
    y = groundY;
    vy = 0;
    // 答對時：落地後如果還有跳躍次數，馬上再跳一下
    if (resultType === 'correct' && winJumpsLeft > 0) {
      vy = -JUMP_POWER;
      winJumpsLeft--;
    }
  }

  if (resultType === 'correct') {
    // 答對（角色 1 贏）：角色 1 連跳好幾下，角色 3 播放輸的動作
    drawChar3(death3Img, DEATH3_FRAMES, deathFrame(resultTimer), groundY);
    if (y < groundY || vy < 0) {
      drawSprite(jumpImg, JUMP_FRAMES, floor(frameCount / ANIM_SPEED) % JUMP_FRAMES, x, y, facing);
    } else {
      drawSprite(stopImg, STOP_FRAMES, floor(frameCount / ANIM_SPEED) % STOP_FRAMES, x, y, facing);
    }
  } else {
    // 答錯（角色 3 贏）：角色 3 跳起來慶祝，角色 1 被擊退往後滑
    let hop = abs(sin(resultTimer * 0.12)) * 70;
    drawChar3(jump3Img, JUMP3_FRAMES, floor(resultTimer / 8) % JUMP3_FRAMES, groundY - hop);
    let total = SLIDE_COUNT * SLIDE_FRAME_TICKS;
    let t = min(resultTimer, total);
    x -= dir * SLIDE_SPEED * (1 - t / total);
    let idx = min(floor(t / SLIDE_FRAME_TICKS), SLIDE_COUNT - 1);
    drawSprite(slideImgs[idx], 1, 0, x, groundY, dir);
  }

  drawSnow();
  drawHUD();

  // 結果文字
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(48);
  fill(resultType === 'correct' ? '#2e7d32' : '#c62828');
  stroke(255);
  strokeWeight(6);
  text(resultType === 'correct' ? '答對了！ +' + lastGain + ' 分' : '答錯了…  失去一顆愛心', width / 2, height / 5);
  noStroke();

  // 播完動作就切換到小知識卡（答對時要等角色 1 跳完、角色 3 輸掉動作也播完）
  let endTicks = RESULT_TICKS;
  if (resultType === 'correct') {
    let deathTicks = DEATH_LOOPS * 4 * DEATH_STEP_TICKS + 30;
    let jumpTicks = WIN_JUMPS * (2 * JUMP_POWER + 2) + 25;
    endTicks = max(deathTicks, jumpTicks);
  }
  if (resultTimer >= endTicks) {
    state = 'fact';
    factTimer = 0;
  }
}

// ================= 小知識卡 =================
function drawFactScene() {
  factTimer++;

  // 角色停在結果的姿勢
  if (resultType === 'correct') {
    drawChar3(death3Img, DEATH3_FRAMES, DEATH3_FRAMES - 1, groundY);
  } else {
    drawChar3(walk3Img, WALK3_FRAMES, 0, groundY);
  }
  drawSprite(stopImg, STOP_FRAMES, floor(frameCount / ANIM_SPEED) % STOP_FRAMES, x, groundY, facing);
  drawSnow();
  drawHUD();

  noStroke();
  fill(0, 130);
  rect(0, 0, width, height);

  let boxW = min(width * 0.85, 760);
  textSize(24);
  let factLines = wrapLines('小知識：' + lastItem.fact, boxW - 70);
  let ansLines = [];
  if (resultType === 'wrong') {
    ansLines = wrapLines('正確答案：' + lastItem.options[lastItem.answer], boxW - 70);
  }
  let boxH = 30 + 56 + ansLines.length * 34 + 10 + factLines.length * 36 + 20 + 40;
  let boxX = (width - boxW) / 2;
  let boxY = max(10, (height - boxH) / 2);

  fill('#fdf6ee');
  stroke('#5c4033');
  strokeWeight(4);
  rect(boxX, boxY, boxW, boxH, 16);

  noStroke();
  let cy = boxY + 30;

  // 標題
  textAlign(CENTER, TOP);
  textSize(40);
  fill(resultType === 'correct' ? '#2e7d32' : '#c62828');
  text(resultType === 'correct' ? '答對了！' : '答錯了…', width / 2, cy);
  cy += 56;

  // 答錯時告訴玩家正確答案
  textSize(24);
  fill('#c62828');
  for (let line of ansLines) {
    text(line, width / 2, cy);
    cy += 34;
  }
  cy += 10;

  // 小知識
  fill('#3d2b1f');
  textAlign(LEFT, TOP);
  textSize(24);
  for (let line of factLines) {
    text(line, boxX + 35, cy);
    cy += 36;
  }

  // 繼續提示（閃爍）
  if (factTimer > 20 && floor(frameCount / 30) % 2 === 0) {
    fill('#8a6a55');
    textAlign(CENTER, TOP);
    textSize(18);
    text('按任意鍵或點一下繼續', width / 2, boxY + boxH - 34);
  }
}

// ================= 結束畫面 =================
function drawEndScene() {
  factTimer++;

  drawChar3(walk3Img, WALK3_FRAMES, floor(frameCount / ANIM_SPEED) % WALK3_FRAMES, groundY);
  drawSprite(stopImg, STOP_FRAMES, floor(frameCount / ANIM_SPEED) % STOP_FRAMES, x, groundY, facing);
  drawSnow();

  noStroke();
  fill(0, 170);
  rect(0, 0, width, height);

  let boxW = min(width * 0.8, 620);
  let boxH = 400;
  let boxX = (width - boxW) / 2;
  let boxY = max(10, (height - boxH) / 2);

  fill('#fdf6ee');
  stroke('#5c4033');
  strokeWeight(4);
  rect(boxX, boxY, boxW, boxH, 20);

  noStroke();
  textAlign(CENTER, TOP);
  fill(endTitle === '通關成功！' ? '#2e7d32' : '#c62828');
  textSize(52);
  text(endTitle, width / 2, boxY + 30);

  fill('#3d2b1f');
  textSize(30);
  text('總分　' + score, width / 2, boxY + 115);
  textSize(22);
  text('答對 ' + correctCount + ' / ' + quizCount + ' 題', width / 2, boxY + 165);
  if (newRecord) {
    fill('#e65100');
    textSize(26);
    text('新紀錄！', width / 2, boxY + 205);
  } else {
    fill('#8a6a55');
    textSize(22);
    text('最高分　' + best, width / 2, boxY + 208);
  }

  // 再玩一次按鈕
  endBtn = { x: width / 2 - 110, y: boxY + boxH - 105, w: 220, h: 62 };
  let hover = mouseX > endBtn.x && mouseX < endBtn.x + endBtn.w &&
              mouseY > endBtn.y && mouseY < endBtn.y + endBtn.h;
  fill(hover ? '#f2c9a0' : '#ead9c7');
  stroke('#5c4033');
  strokeWeight(3);
  rect(endBtn.x, endBtn.y, endBtn.w, endBtn.h, 12);
  noStroke();
  fill('#3d2b1f');
  textAlign(CENTER, CENTER);
  textSize(28);
  text('再玩一次', width / 2, endBtn.y + endBtn.h / 2);

  fill('#8a6a55');
  textAlign(CENTER, TOP);
  textSize(16);
  text('也可以按任意鍵重新開始', width / 2, boxY + boxH - 32);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  groundY = height / 2 + 47 * SCALE_FACTOR + GROUND_OFFSET;
  if (y > groundY) y = groundY;
}