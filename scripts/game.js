const ulTile = document.getElementById('tile');
const ulAns = document.getElementById('anser');
const startButton = document.getElementById('start');
let liList = document.getElementsByTagName('li');
const stepSpan = document.getElementById('step');
const log = document.getElementById('log');

let count = 0;
let step = 0;
let date = new Date();
let today = `${date.getFullYear()}${(date.getMonth() + 1)
  .toString()
  .padStart(2, '0')}${date.getDate()}${date.getHours()}`;
let listTiles = document.getElementsByClassName('listTile');
let resultTile = '';

const ansList = document.createElement('li');
ansList.textContent = today;
ulAns.appendChild(ansList);

const createTile = () => {
  const list = document.createElement('li');

  list.className = 'listTile';
  if (count < 0) {
    count = 0;
  }
  list.textContent = count;
  list.addEventListener('click', () => {
    list.textContent = +list.textContent - 1;
    count -= 1;
    if (list.textContent == -1) {
      list.remove();
      count = 0;
    }
    step++;
    stepSpan.textContent = step;
    if (count < 0) {
      count = 0;
    }
    startButton.textContent = `+` + count;
    const updateTile = document.getElementsByClassName('listTile');
    resultTile = '';
    Array.prototype.forEach.call(updateTile, (x) => {
      resultTile += x.textContent;
    });

    if (resultTile === today) {
      alert(`クリアしました！！ ステップ数:${step}`);
    }
  });
  ulTile.appendChild(list);
  count++;
  step++;
  stepSpan.textContent = step;
  startButton.textContent = `+` + count;
  resultTile = '';
  Array.prototype.forEach.call(listTiles, (x) => {
    resultTile += x.textContent;
  });
  if (resultTile === today) {
    alert(`クリアしました！！ ステップ数:${step}`);
  }
};

startButton.addEventListener('click', createTile);
