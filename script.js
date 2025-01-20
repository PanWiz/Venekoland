// saca del index.html el id de play-button
const playButton = document.getElementById('play-button');


playButton.addEventListener('click', () => { // cuando da click al botón de jugar desencadena las siguientes cosas bbsotes
  
  document.querySelector('nav').style.display = 'none'; // procede a ocultar el menu principal

  // te deberia mostrar el selector de niveles
  const levelSelect = document.createElement('div');
  levelSelect.id = 'level-select';

  // usé innerhtml para mostrar el selector de nivel y el nivel 1
  levelSelect.innerHTML = `
    <h2>Selecciona un nivel</h2>
    <ul>
      <li><button id="level-1-button">Nivel 1</button></li>
    </ul>
  `;

  // agrega la selección de niveles al elemento main
  const main = document.querySelector('main');
  main.appendChild(levelSelect);

const level1Button = document.getElementById('level-1-button');

// agrega un evento de clic al botón de nivel 1 y lo redirige
level1Button.addEventListener('click', () => {
  window.location.href = 'levels/level1/level1.html';
});

  const level2Button = document.getElementById('level-2-button');
  level2Button.addEventListener('click', () => {
    // Abre el nivel 2 que se haria más adelante
    openLevel2();
  });

  const level3Button = document.getElementById('level-3-button');
  level3Button.addEventListener('click', () => {
    openLevel3();
  });
});

// Funciones para abrir los niveles
function openLevel1() {
  // Crea un nuevo elemento div para el nivel 1
  const level1 = document.createElement('div');
  level1.id = 'level-1';

  // Agrega contenido al nivel 1
  level1.innerHTML = `
    <h2>Nivel 1</h2>
    <p>Bienvenido al nivel 1.</p>
  `;

  // Agrega el nivel 1 al elemento main
  const main = document.querySelector('main');
  main.appendChild(level1);
}

  //mismo proceso de arriba
function openLevel2() {
  const level2 = document.createElement('div');
  level2.id = 'level-2';

  level2.innerHTML = `
    <h2>Nivel 2</h2>
    <p>Bienvenido al nivel 2.</p>
  `;

  const main = document.querySelector('main');
  main.appendChild(level2);
}

function openLevel3() {
  const level3 = document.createElement('div');
  level3.id = 'level-3';

  level3.innerHTML = `
    <h2>Nivel 3</h2>
    <p>Bienvenido al nivel 3.</p>
  `;

  const main = document.querySelector('main');
  main.appendChild(level3);
}


document.getElementById('options-button').addEventListener('click', function() { // muestra las opciones del juego
    console.log('Opciones del juego');
});

document.getElementById('credits-button').addEventListener('click', function() {
    console.log('Créditos del juego');
});

