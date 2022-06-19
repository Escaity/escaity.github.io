const h1Click = document.getElementById('dice');
const listElement = document.getElementsByTagName('li');
const logElement = document.getElementById('log');
let starStats = false;
const interval = 600;

h1Click.addEventListener('click', () => {
  Array.prototype.forEach.call(listElement, (key) => {
    key.textContent = '★';
  });
  if (starStats === false) {
    starStats = true;
    h1Click.textContent = '星が止まる';
  } else {
    starStats = false;
    h1Click.textContent = '星が降る';
  }
});

setInterval(() => {
  if (starStats) {
    Array.prototype.forEach.call(listElement, (key) => {
      const colorRed = Math.ceil(Math.random() * 255).toString(16);
      const colorGreen = Math.ceil(Math.random() * 255).toString(16);
      const colorBlue = Math.ceil(Math.random() * 255).toString(16);
      key.style.color = `#${colorRed}${colorGreen}${colorBlue}`;
    });
  }
}, interval);
