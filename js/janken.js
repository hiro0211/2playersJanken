const choices = ['グー', 'チョキ', 'パー'];
const images = [
  'images/グー-removebg-preview.png',
  'images/チョキ-removebg-preview.png',
  'images/パー-removebg-preview.png'
];

const player1Buttons = document.querySelectorAll('#player1-area .choice-btn');
const player2Buttons = document.querySelectorAll('#player2-area .choice-btn');
const decideBtn1 = document.getElementById('decide-btn-1');
const decideBtn2 = document.getElementById('decide-btn-2');
const player1HandElement = document.getElementById('player1-hand');
const player2HandElement = document.getElementById('player2-hand');
const judgmentElement = document.getElementById('judgment');

const audioWin = new Audio('audio/決定ボタンを押す23.mp3');
const audioLose = new Audio('audio/間抜け1.mp3');
const audioDraw = new Audio('audio/マントを翻す.mp3');
const roulette = new Audio('audio/電子ルーレット.mp3');

let player1Choice = null;
let player2Choice = null;

player1Buttons.forEach((button, index) => {
  button.addEventListener('click', () => selectHand(1, index));
});

player2Buttons.forEach((button, index) => {
  button.addEventListener('click', () => selectHand(2, index));
});

decideBtn1.addEventListener('click', () => playerReady(1));
decideBtn2.addEventListener('click', () => playerReady(2));

function selectHand(player, index) {
  const buttons = player === 1 ? player1Buttons : player2Buttons;
  buttons.forEach(btn => btn.classList.remove('selected'));
  buttons[index].classList.add('selected');
  if (player === 1) {
    player1Choice = index;
    decideBtn1.disabled = false;
  } else {
    player2Choice = index;
    decideBtn2.disabled = false;
  }
}

function playerReady(player) {
  if (player === 1) {
    decideBtn1.disabled = true;
  } else {
    decideBtn2.disabled = true;
  }

  if (player1Choice !== null && player2Choice !== null) {
    playGame();
  }
}

function playGame() {
  // ルーレット効果音の再生
  roulette.play();

  // ルーレット演出
  animateRoulette(player1HandElement, player1Choice);
  animateRoulette(player2HandElement, player2Choice);

  setTimeout(() => {
    displayResult(player1Choice, player2Choice);
  }, 3000); // ルーレット演出の後に結果を表示
}

function animateRoulette(element, finalChoice) {
  let counter = 0;
  const interval = setInterval(() => {
    element.style.backgroundImage = `url(${images[counter % 3]})`;
    element.style.animation = 'roulette 0.1s linear';
    setTimeout(() => {
      element.style.animation = 'none';
    }, 50);
    counter++;
    if (counter > 20 + finalChoice) {
      clearInterval(interval);
      element.style.backgroundImage = `url(${images[finalChoice]})`;
      roulette.pause(); // ルーレット効果音を停止
      roulette.currentTime = 0; // 音声を最初に巻き戻す
    }
  }, 100);
}

function displayResult(player1, player2) {
  player1HandElement.style.backgroundImage = `url(${images[player1]})`;
  player2HandElement.style.backgroundImage = `url(${images[player2]})`;

  const result = getResult(player1, player2);
  judgmentElement.textContent = result;

  playAudio(result);

  // ゲームをリセット
  resetGame();
}

function getResult(player1, player2) {
  if (player1 === player2) return 'あいこ';
  if ((player1 === 0 && player2 === 1) ||
    (player1 === 1 && player2 === 2) ||
    (player1 === 2 && player2 === 0)) {
    return 'プレイヤー1の勝ち';
  }
  return 'プレイヤー2の勝ち';
}

function playAudio(result) {
  switch (result) {
    case 'プレイヤー1の勝ち':
    case 'プレイヤー2の勝ち':
      audioWin.play();
      break;
    case 'あいこ':
      audioDraw.play();
      break;
  }
}

function resetGame() {
  player1Choice = null;
  player2Choice = null;
  player1Buttons.forEach(btn => btn.classList.remove('selected'));
  player2Buttons.forEach(btn => btn.classList.remove('selected'));
  decideBtn1.disabled = true;
  decideBtn2.disabled = true;
}