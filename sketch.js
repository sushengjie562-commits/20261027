// 設定精靈圖檔路徑。
const spritePath = '1/走1246 198/all.png';
// 設定精靈圖的原始寬度。
const spriteSheetWidth = 1246;
// 設定精靈圖的原始高度。
const spriteSheetHeight = 198;
// 設定精靈圖包含第 0 到第 8 格，共九格。
const spriteFrameCount = 9;
// 設定角色每秒播放的動畫影格數。
const animationSpeed = 10;
// 設定角色移動速度。
const moveSpeed = 3;
// 設定角色顯示高度。
const characterHeight = 140;

// 保存載入完成的精靈圖。
let spriteSheet;
// 保存角色目前的水平位置。
let characterX;
// 保存角色面向，1 代表右方，-1 代表左方。
let facing = 1;
// 保存角色是否正在移動。
let isMoving = false;

// 在繪圖開始前載入角色精靈圖。
function preload() {
  // 載入指定路徑的精靈圖。
  spriteSheet = loadImage(
    spritePath,
    // 圖片載入成功時不需額外處理。
    () => {},
    // 圖片載入失敗時在主控台顯示錯誤訊息。
    () => console.error(`無法載入精靈圖：${spritePath}`)
  );
}

// 建立全螢幕畫布並設定角色初始位置。
function setup() {
  // 建立符合視窗大小的畫布。
  createCanvas(windowWidth, windowHeight);
  // 將角色放在畫布水平中央。
  characterX = width / 2;
  // 設定畫面更新速度為每秒 60 格。
  frameRate(60);
}

// 每個畫面影格更新角色位置並繪製畫面。
function draw() {
  // 使用淡藍色填滿畫布背景。
  background('#bde0fe');

  // 每次繪圖時先重設角色移動狀態。
  isMoving = false;

  // 按住右方向鍵時讓角色往右移動。
  if (keyIsDown(RIGHT_ARROW)) {
    // 將角色位置向右增加移動速度。
    characterX += moveSpeed;
    // 設定角色面向右方。
    facing = 1;
    // 標記角色正在移動。
    isMoving = true;
  }

  // 按住左方向鍵時讓角色往左移動。
  if (keyIsDown(LEFT_ARROW)) {
    // 將角色位置向左減少移動速度。
    characterX -= moveSpeed;
    // 設定角色面向左方。
    facing = -1;
    // 標記角色正在移動。
    isMoving = true;
  }

  // 計算精靈圖中每一格動畫影格的寬度。
  const frameWidth = spriteSheetWidth / spriteFrameCount;
  // 按照精靈圖比例計算角色顯示寬度。
  const characterWidth = characterHeight * frameWidth / spriteSheetHeight;

  // 限制角色不會移出畫布左右邊界。
  characterX = constrain(
    characterX,
    characterWidth / 2,
    width - characterWidth / 2
  );

  // 移動時播放行走動畫，靜止時顯示第 0 格。
  const frameIndex = isMoving
    ? floor(frameCount * animationSpeed / 60) % spriteFrameCount
    : 0;

  // 計算目前動畫影格在精靈圖中的水平起點。
  const sourceX = frameIndex * frameWidth;

  // 保存目前畫布狀態。
  push();

  // 將繪圖原點移到角色位置及畫面垂直中央。
  translate(characterX, height / 2);

  // 角色面向左方時水平翻轉圖像。
  scale(facing, 1);

  // 精靈圖載入完成後才繪製角色。
  if (spriteSheet) {
    // 從橫向精靈圖裁切目前影格並繪製角色。
    image(
      spriteSheet,
      -characterWidth / 2,
      -characterHeight / 2,
      characterWidth,
      characterHeight,
      sourceX,
      0,
      frameWidth,
      spriteSheetHeight
    );
  }

  // 還原畫布狀態。
  pop();
}

// 視窗尺寸改變時調整畫布大小。
function windowResized() {
  // 讓畫布符合新的視窗大小。
  resizeCanvas(windowWidth, windowHeight);
  // 確保角色位置仍在畫布範圍內。
  characterX = constrain(characterX, 0, width);
}

// 避免按方向鍵時瀏覽器跟著捲動頁面。
function keyPressed() {
  // 阻止方向鍵的預設瀏覽器行為。
  if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
    // 回傳 false 以取消頁面捲動。
    return false;
  }
}