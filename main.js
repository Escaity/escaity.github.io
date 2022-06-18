const h1Click = document.getElementById('dice');
h1Click.addEventListener('click', () => {
  const list = document.getElementsByTagName('li');
  Array.prototype.forEach.call(list, (key) => {
    key.textContent = Math.ceil(Math.random() * 6);
  });
});
