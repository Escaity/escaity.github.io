const h1Click = document.getElementById('dice');
h1Click.addEventListener('click', () => {
  const list = document.getElementsByTagName('li');
  Array.prototype.forEach.call(list, (key) => {
    const rand = Math.ceil(Math.random() * 6);
    key.textContent = rand;
    key.setAttribute('id', 'd' + rand.toString());
  });
});
