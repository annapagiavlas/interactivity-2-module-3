let song;
function preload() {
  song = loadSound('bigger.mp3');
}

let lines = [
  "no words appear before me in the aftermath",
  "salt streams out my eyes and into my ears",
  "every single thing i touch becomes sick with sadness.",
  "'cause its all over now, all out to sea.",
  "so i'll say words i don't believe:",
  "goodbye, goodbye, goodbye,",
  "you were bigger than the whole sky.",
  "you were more than just a short time.",
  "and i've got a lot to pine about,",
  "i've got a lot to live without.",
  "i'm never going to meet",
  "what could've been, would've been,",
  "what should've been you.",
  "♡",
  "(taylor swift, bigger than the whole sky, 2022)."
];

let currentLine = 0;
let lineData = [];
let fallingLetters = [];
let button;

//----------setup
function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('Georgia');

//----------reveal button at the middle top
  button = createButton('reveal');
  button.position(width / 2 - 40, 80);
  button.style('padding', '10px 20px');
  button.style('background-color', '#c799b0');
  button.style('border', 'none');
  button.style('border-radius', '8px');
  button.mousePressed(revealLine);
}

//----------draw loop
function draw() {

//----------progress = how far through poem we are 0 - 1
  let progress = currentLine / lines.length;

//---------background gets darker
  background(255 * (1 - progress));
  let textShade = 40 + (215 * progress);
  textSize(16);
  textAlign(CENTER);
  let startY = 150;

//----------final end fade up away animation
  let endT = 0;
  if (currentLine === lines.length && lineData.length > 0) {
    endT = millis() - lineData[lineData.length - 1].time;
  }
  let globalOffset = 0;
  let globalAlpha = 255;
  if (endT > 2000) {
    let amt = constrain((endT - 2000) / 4000, 0, 1);
    globalOffset = lerp(0, 80, amt);
    globalAlpha = 255 * (1 - amt);
  }
  fill(textShade, globalAlpha);
  text("slowly click to reveal the poem.", width / 2, 40 + globalOffset);

//----------draw each revealed line
  for (let i = 0; i < lineData.length; i++) {
    let data = lineData[i];

//----------t = how long this line has been visible
    let t = millis() - data.time;
    let x = width / 2;
    let y = startY + i * 28 + globalOffset;

//----------animation for each line
    if (i === 0) fadeLine(data.text, x, y, t, textShade, globalAlpha);
    else if (i === 1) blurLine(data.text, x, y, t, textShade, globalAlpha);
    else if (i === 2) sadnessLine(data, x, y, t, textShade, globalAlpha);
    else if (i === 3) waveLine(data.text, x, y, t, textShade, globalAlpha);
    else if (i === 5) goodbyeLine(data.text, x, y, t, textShade, globalAlpha);
    else if (i === 6) skyLine(data.text, x, y, t, textShade, globalAlpha);
    else if (i === 7) dotsLine(data.text, x, y, t, textShade, globalAlpha);
    else if (i === 8) pineLine(data.text, x, y, t, textShade, globalAlpha);
    else if (i === 9) withoutLine(data.text, x, y, t, textShade, globalAlpha);
    else if (i === 10) neverLine(data.text, x, y, t, textShade, globalAlpha);
    else if (i === 11) crumbleLine(data, x, y, t, textShade, globalAlpha);
    else if (i === 12) heartbeatLine(data.text, x, y, t, textShade, globalAlpha);
    else defaultLine(data.text, x, y, t, textShade, i, globalAlpha);
  }

//----------line zero fade away
function fadeLine(textStr, x, y, t, shade, gAlpha) {
  let alpha = 255;
  if (t > 2000) {
    let fade = constrain((t - 2000) / 2000, 0, 1);
    alpha = 255 * (1 - fade);
  }
  fill(shade, alpha * (gAlpha/255));
  text(textStr, x, y);
}

//----------line one blurs
function blurLine(textStr, x, y, t, shade, gAlpha) {
  let blurAmount = 0;
  if (t > 2500) {
    let amt = constrain((t - 2500) / 2000, 0, 1);
    blurAmount = lerp(0, 8, amt);
  }
  drawingContext.filter = `blur(${blurAmount}px)`;
  fill(shade, gAlpha);
  text(textStr, x, y);
  drawingContext.filter = "none";
}

//----------line two sadness fall
  for (let l of fallingLetters) {
    if (millis() > l.startFallTime) {
      l.vy += 0.05;
      l.x += l.vx;
      l.y += l.vy;
    }
    l.alpha -= 1.0;
    fill(textShade, l.alpha * (globalAlpha/255));
    text(l.char, l.x, l.y + globalOffset);
  }
}
function sadnessLine(data, x, y, t, shade, gAlpha) {
  let base = "every single thing i touch becomes sick with ";
  let word = "sadness";
  textAlign(LEFT);
  let fullWidth = textWidth(base + word);
  let startX = x - fullWidth / 2;
  fill(shade, gAlpha);
  text(base, startX, y);
  let sadnessX = startX + textWidth(base);
  text(word, sadnessX, y);
  if (!data.spawned) {
    for (let i = 0; i < word.length; i++) {
      fallingLetters.push({
        char: word[i],
        x: sadnessX + i * 9,
        y: y,
        vx: random(-0.2, 0.2),
        vy: 0,
        alpha: 255,
        startFallTime: millis() + 2500
      });
    }
    data.spawned = true;
  }
  textAlign(CENTER);
}

//----------line three wave motion
function waveLine(textStr, x, y, t, shade, gAlpha) {
  textAlign(LEFT);
  let waveAmount = 0;
  if (t > 2000) {
    let amt = constrain((t - 2000) / 4000, 0, 1);
    waveAmount = lerp(0, 6, amt);
  }
  let fullWidth = textWidth(textStr);
  let startX = x - fullWidth / 2;
  let currentX = startX;
  for (let i = 0; i < textStr.length; i++) {
    let char = textStr[i];
    let offsetY = sin(frameCount * 0.03 + i * 0.5) * waveAmount;
    fill(shade, gAlpha);
    text(char, currentX, y + offsetY);
    currentX += textWidth(char);
  }
  textAlign(CENTER);
}

//----------line four line + strike
function defaultLine(textStr, x, y, t, shade, i, gAlpha) {
  fill(shade, gAlpha);
  text(textStr, x, y);
  if (i === 4 && t > 2500) {
    let amt = constrain((t - 2500) / 1500, 0, 1);
    let w = textWidth(textStr);
    let startX = x - w / 2;
    stroke(0, gAlpha);
    strokeWeight(1.5);
    for (let j = 0; j < 3; j++) {
      let yOffset = random(-2, 2);
      let jitter = random(-5, 5);
      line(startX + jitter, y + yOffset, startX + w * amt + jitter, y + yOffset);
    }
    noStroke();
  }
}

//----------line five goodbyes fades word by word
function goodbyeLine(textStr, x, y, t, shade, gAlpha) {
  textAlign(LEFT);
  let words = textStr.split(" ");
  let fullWidth = textWidth(textStr);
  let startX = x - fullWidth / 2;
  let currentX = startX;
  for (let i = 0; i < words.length; i++) {
    let word = words[i];
    let delay = 2000 + i * 800;
    let alpha = 255;
    if (t > delay) {
      let fade = constrain((t - delay) / 1500, 0, 1);
      alpha = 255 * (1 - fade);
    }
    fill(shade, alpha * (gAlpha/255));
    text(word, currentX, y);
    currentX += textWidth(word + " ");
  }
  textAlign(CENTER);
}

//----------line six bigger effect
function skyLine(textStr, x, y, t, shade, gAlpha) {
  textAlign(LEFT);
  let words = textStr.split(" ");
  let startX = x - textWidth(textStr) / 2;
  let currentX = startX;
  let scaleAmount = 1;
  if (t > 2000) {
    let amt = constrain((t - 2000) / 2000, 0, 1);
    scaleAmount = lerp(1, 1.25, amt);
  }
  for (let i = 0; i < words.length; i++) {
    let word = words[i];
    push();
    if (word === "bigger") {
      translate(currentX + textWidth(word) / 2, y);
      scale(scaleAmount);
      fill(shade, gAlpha);
      textAlign(CENTER);
      text(word, 0, 0);
    } else {
      fill(shade, gAlpha);
      textAlign(LEFT);
      text(word, currentX, y);
    }
    pop();
    currentX += textWidth(word + " ");
  }
  textAlign(CENTER);
}

//----------line seven dots slowly appear
function dotsLine(textStr, x, y, t, shade, gAlpha) {
  textAlign(CENTER);
  fill(shade, gAlpha);
  text(textStr, x, y);
  let startDots = 2000;
  let totalDots = 6;
  if (t > startDots) {
    let amt = constrain((t - startDots) / 2000, 0, 1);
    let visibleDots = floor(amt * totalDots);
    let dots = "";
    for (let i = 0; i < visibleDots; i++) {
      dots += ". ";
    }
    let textW = textWidth(textStr);
    let startX = x + textW / 2 + 5;
    textAlign(LEFT);
    text(dots, startX, y);
    textAlign(CENTER);
  }
}

//----------line eight stretches horizontally
function pineLine(textStr, x, y, t, shade, gAlpha) {
  textAlign(LEFT);
  let startStretch = 2500;
  let stretchAmount = 0;
  if (t > startStretch) {
    let amt = constrain((t - startStretch) / 2000, 0, 1);
    stretchAmount = lerp(0, 10, amt);
  }
  let fullWidth = 0;
  for (let i = 0; i < textStr.length; i++) {
    fullWidth += textWidth(textStr[i]) + stretchAmount;
  }
  let startX = x - fullWidth / 2;
  let currentX = startX;
  fill(shade, gAlpha);
  for (let i = 0; i < textStr.length; i++) {
    let char = textStr[i];
    text(char, currentX, y);
    currentX += textWidth(char) + stretchAmount;
  }
  textAlign(CENTER);
}

//----------line nine drifting away without
function withoutLine(textStr, x, y, t, shade, gAlpha) {
  textAlign(LEFT);
  let base = "i've got a lot to live ";
  let word = "without.";
  let fullWidth = textWidth(base + word);
  let startX = x - fullWidth / 2;
  fill(shade, gAlpha);
  text(base, startX, y);
  let wordX = startX + textWidth(base);
  let offsetX = 0;
  let alpha = 255;
  if (t > 2500) {
    let amt = constrain((t - 2500) / 2000, 0, 1);
    offsetX = lerp(0, 60, amt);
    alpha = 255 * (1 - amt);
  }
  fill(shade, alpha * (gAlpha/255));
  text(word, wordX + offsetX, y);
  textAlign(CENTER);
}

//----------line ten clean smooth glow
function neverLine(textStr, x, y, t, shade, gAlpha) {
  textAlign(LEFT);
  let words = textStr.split(" ");
  let startX = x - textWidth(textStr) / 2;
  fill(shade, gAlpha);
  text(textStr, startX, y);
  let amt = 0;
  if (t > 2500) {
    amt = constrain((t - 2500) / 2000, 0, 1);
  }
  let currentX = startX;
  for (let i = 0; i < words.length; i++) {
    let w = words[i];
    if (w === "never") {
      let glow = amt * 12;
      push();
      drawingContext.shadowBlur = glow;
      drawingContext.shadowColor = "white";
      fill(shade, gAlpha);
      text(w, currentX, y);
      pop();
    }
    currentX += textWidth(w + " ");
  }
  textAlign(CENTER);
}

//----------line eleven glitch flicker
function crumbleLine(data, x, y, t, shade, gAlpha) {
  textAlign(CENTER);
  let jitter = 0;
  let alpha = 255;
  if (t > 2500) {
    let amt = constrain((t - 2500) / 2000, 0, 1);
    jitter = amt * 0.8;
    if (frameCount % 20 < 10) {
      alpha = 220;
    }
  }
  fill(shade, alpha * (gAlpha/255));
  text(data.text, x + random(-jitter, jitter), y + random(-jitter, jitter));
}

//----------line twelve heartbeat pulse
function heartbeatLine(textStr, x, y, t, shade, gAlpha) {
  textAlign(CENTER);
  let scaleAmt = 1;
  if (t > 2500) {
    let speed = frameCount * 0.04;
    let pulse = (sin(speed) + 1) / 2;
    pulse = pow(pulse, 2);
    scaleAmt = 1 + pulse * 0.04;
  }
  push();
  translate(x, y);
  scale(scaleAmt);
  fill(shade, gAlpha);
  text(textStr, 0, 0);
  pop();
}

//----------slowly click to reveal the poem changes to gone.
function revealLine() {

 if (currentLine === 0 && !song.isPlaying()) {
  song.setVolume(0);     // start silent
  song.loop();
  song.setVolume(0.5, 3); // fade to 0.5 over 3 seconds
}

  if (currentLine < lines.length) {
    lineData.push({
      text: lines[currentLine],
      time: millis(),
      spawned: false
    });
    currentLine++;
  } else {
    button.html("gone.");
  }
}