var questionNum;
var correct;

var targetWordsList;
var targetTitleList;

var total;
var rate;

var timerId;
var timer;
var totalTime;

window.onload = function () {

  buildTitle();
  buildWords();

  // history.pushState(null, null, null);
  // window.addEventListener('popstate', function (e) {
  //   alert('ブラウザバックを検知しました。');
  //   if (!event.originalEvent.state) {
  //     history.pushState(null, null, null);
  //     return;
  //   }
  // });

  const list = document.getElementById('game-target').children;
  for (let i = 1; i < list.length; i++) {
    const item = list[i];
    const method = item.getAttribute('onclick');
    let targetNum = method.replace('target(this, ', '').split(',').length;
    if (targetNum == 1) {
      targetNum = 167;
    }
    const html = `<span>（${targetNum}曲）</span>`;
    item.children[0].insertAdjacentHTML('beforeEnd', html);
  }

  // 初期モード
  switchProcess('entrance');
}

function toQuiz() {
  initGame();
  switchProcess('mode');
}


function toSearchWors() {

  switchProcess('search');
}

function searchWords() {
  const inputForm = document.getElementById('search');
  const listForm = document.getElementById('search-list');
  const msgForm = document.getElementById('search-result');
  const tgt = inputForm.children[0].value;

  let html = '';
  let prev = -1;
  let cnt = 0;
  let songNum = 0;
  for (let i = 0; i < this.wordsList.length; i++) {
    const words = this.wordsList[i];
    if (words[1].indexOf(tgt) != -1) {
      if (prev != words[0]) {
        prev = words[0];
        songNum ++;
        html += `<div class="title">${this.titleList[words[0]]}</div>`;
      }
      cnt++;
      const disp = words[1].replace(tgt, `<span>${tgt}</span>`);
      html += `<div class="item">${disp}</div>`;
    }
  }
  msgForm.innerHTML = `検索結果は${cnt}件(${songNum}曲)です。`;
  listForm.innerHTML = html;
}


function initGame() {
  this.questionNum = 0;
  this.correct = 0;
  this.totalTime = 0;
}

function mode(total, rate) {
  this.total = total;
  this.rate = rate;
  switchProcess('target');

  const list = document.getElementById('game-target').children;
  for (let i = 1; i < list.length; i++) {
    const item = list[i];
    const method = item.getAttribute('onclick');
    let targetNum = method.replace('target(this, ', '').split(',').length;
    if (targetNum == 1) {
      targetNum = 167;
    }
    if (targetNum < this.rate) {
      item.classList.add('disable');
    } else {
      item.classList.remove('disable');
    }
  }
}


function headOnly(obj) {
  this.course = obj.children[0].innerHTML;

  switchProcess('play');

  this.targetTitleList = this.titleList;
  this.targetWordsList = [];

  let prev = -1;
  for (let i = 0; i < this.wordsList.length; i++) {
    const item = this.wordsList[i];
    if (item[0] != prev) {
      prev = item[0];
      this.targetWordsList.push(item);
    }
  }
  create();
}

function target(obj, item) {
  this.course = obj.children[0].innerHTML;

  switchProcess('play');

  if (item == null) {
    this.targetTitleList = this.titleList;
    this.targetWordsList = this.wordsList;
  } else {
    const list = item.split(',');
    filterTarget(list);
  }
  create();
}

function filterTarget(list) {
  this.targetTitleList = [];
  this.targetWordsList = [];
  for (let i = 0; i < list.length; i++) {
    const value = Number(list[i]);
    this.targetTitleList.push(this.titleList[value]);
    for (let j = 0; j < this.wordsList.length; j++) {
      const item = this.wordsList[j];
      if (item[0] == value) {
        this.targetWordsList.push(item);
      }
    }
  }
}

function create() {

  const nextForm = document.getElementById('next');
  nextForm.classList.remove('next-visible');

  const modeForm = document.getElementById('mode');
  modeForm.innerHTML = `${this.course}`;

  const countForm = document.getElementById('count');
  countForm.innerHTML = `${questionNum + 1}問目 （全${this.total}問）`;

  const wordsItem = getRandomWords();
  const wordsForm = document.getElementById('words');
  wordsForm.innerHTML = wordsItem[1];

  const listForm = document.getElementById('title-list');
  let html = '';
  const ansNum = Math.floor(Math.random() * this.rate);
  const nameList = [];
  for (let i = 0; i < this.targetTitleList.length; i++) {
    const item = this.targetTitleList[i];
    if (item == this.titleList[wordsItem[0]]) {
      nameList.push(i);
    }
  }
  for (let i = 0; i < this.rate; i++) {
    let item = '-';
    if (i == ansNum) {
      item = this.titleList[wordsItem[0]];
    } else {
      let rVal = -1;
      do {
        rVal = Math.floor(Math.random() * this.targetTitleList.length);
      } while (nameList.includes(rVal));

      nameList.push(rVal);
      item = this.targetTitleList[rVal];
    }
    html += `<div class="title-item select" onclick="enter(this, ${ansNum})">
              <div class="param">${i}</div>
              <div class="name">${item}</div>
            </div>`;
  }
  listForm.innerHTML = html;

  this.timer = 100;
  this.timerId = setInterval(`showPassage(${ansNum})`, 100)
}

function showPassage(ansNum) {
  this.timer--;
  if (this.timer == 0) {
    clearInterval(this.timerId);
    enter(null, ansNum);
  }

  const timerForm = document.getElementById('timer');
  timerForm.style.width = `calc(${this.timer}% - 10px)`;
}

function getRandomWords() {
  while (true) {
    const item = this.targetWordsList[Math.floor(Math.random() * this.targetWordsList.length)];
    const words = item[1].toLowerCase();
    const title = this.titleList[item[0]].toLowerCase();
    if (words.indexOf(title) == -1) {
      return item;
    }
  }
}

function enter(obj, ansNum) {
  clearInterval(this.timerId);
  const itemFormList = document.getElementById('title-list').children;

  let selected = -1;
  if (obj != null) selected = obj.children[0].innerHTML;
  if (selected == ansNum) {
    this.correct++;
    this.totalTime += this.timer;
  }
  for (let i = 0; i < itemFormList.length; i++) {
    const item = itemFormList[i];
    item.classList.remove('select');
    if (i == selected) {
      item.classList.add('focus');
    } else {
      item.classList.add('other');
    }
    if (i == ansNum) {
      item.children[1].insertAdjacentHTML('afterBegin', '<span class="ok">正解　 </span>');
    } else {
      item.children[1].insertAdjacentHTML('afterBegin', '<span class="ng">不正解 </span>');
    }
  }

  const nextForm = document.getElementById('next');
  nextForm.classList.add('next-visible');

  if (isEnd()) {
    nextForm.innerHTML = '結果画面へ進む。';
  } else {
    nextForm.innerHTML = '次の問題へ進む。';
  }
}

function isEnd() {
  return questionNum == this.total - 1;
}

function next() {
  if (!isEnd()) {
    questionNum++;
    create();
  } else {
    switchProcess('result');

    const modeForm = document.getElementById('type');
    modeForm.innerHTML = `${this.course}`;

    const resultForm = document.getElementById('result');
    resultForm.innerHTML = `正解率: ${this.correct / this.total * 100}％
      （${this.correct}/${this.total}）<br>
      得点　: ${this.totalTime}`;
  }
}

function toStart() {
  initGame();
  switchProcess('mode');
}

function switchProcess(next) {
  const list = document.getElementById('main').children;
  for (let i = 0; i < list.length; i++) {
    list[i].classList.remove('visible');
  }
  document.getElementById(`game-${next}`).classList.add('visible');
}