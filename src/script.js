function CreateBackgroundAudio(src) {
  const audio = new Audio(src);
  audio.load();
  return audio;
}

  const AudioFondo = CreateBackgroundAudio('/sounds/fondo.mp3');

const keys = {
  m: { pressed: false },
  n: { pressed: false },
};

window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'm':
      keys.m.pressed = true;
      AudioFondo.play();
      break;
    case 'n':
      keys.n.pressed = true;
      AudioFondo.pause();
      break;
  }
});

document.addEventListener('DOMContentLoaded', function () {
  // Obtener el archivo de audio para el sonido del clic
  const clickSound = document.getElementById('click-sound');
  
  // Función para reproducir el sonido del clic
  function playClickSound() {
    clickSound.play().catch((error) => {
      console.error('Error al intentar reproducir el sonido del clic:', error);
    });
  }

  // Selecciona el botón de jugar
  const playButton = document.getElementById('play-button');
  if (playButton) {
    // Agrega un evento de clic al botón de jugar
    playButton.addEventListener('click', () => {
      playClickSound();  // Reproducir el sonido del clic
      // Oculta el menú principal
      document.querySelector('nav').style.display = 'none';

     
      const existingLevelSelect = document.getElementById('level-select');
      if (existingLevelSelect) {
        return;
      }

      // Crea el selector de niveles solo si no existe
      const levelSelect = document.createElement('div');
      levelSelect.id = 'level-select';

      // Agrega contenido a la selección de niveles
      levelSelect.innerHTML = `
        <h2>Selecciona un nivel</h2>
        <ul>
          <li><button id="level-1-button">Nivel 1</button></li>
        </ul>
        <button id="back-to-menu">Volver al menú</button>
      `;

      // Agrega la selección de niveles al elemento main
      const main = document.querySelector('main');
      main.appendChild(levelSelect);

      // Función para volver al menú principal
      const backButton = document.getElementById('back-to-menu');
      backButton.addEventListener('click', () => {
        levelSelect.remove();
        document.querySelector('nav').style.display = 'block';
        playClickSound();
      });

      // Agregar eventos de clic para los botones de los niveles
      const level1Button = document.getElementById('level-1-button');
      level1Button.addEventListener('click', () => {
        playClickSound();  // Reproducir el sonido del clic
        window.location.href = '/levels/level1/level1.html';
      });

    });
  }

  // Funciones de Menús Emergentes
  function closeAllMenus() {
    const menus = document.querySelectorAll('#options-menu, #credits-menu');
    menus.forEach(menu => {
      menu.style.display = 'none';
    });
    document.getElementById('overlay').style.display = 'none';
  }

  function showMenu(menuId) {
    closeAllMenus();
    const menu = document.getElementById(menuId);
    if (menu) {
      menu.style.display = 'block';
    }
    document.getElementById('overlay').style.display = 'block';
  }

  const configButton = document.getElementById('config-button');
  if (configButton) {
    configButton.addEventListener('click', () => {
      playClickSound();  // Reproducir el sonido del clic
      showMenu('options-menu');
    });
  }

  const creditsButton = document.getElementById('credits-button');
  if (creditsButton) {
    creditsButton.addEventListener('click', () => {
      playClickSound();  // Reproducir el sonido del clic
      showMenu('credits-menu');
    });
  }

  const closeOptionsButton = document.getElementById('close-options');
  if (closeOptionsButton) {
    closeOptionsButton.addEventListener('click', () => {
      playClickSound()
      closeAllMenus();
    });
  }

  const closeCreditsButton = document.getElementById('close-credits');
  if (closeCreditsButton) {
    closeCreditsButton.addEventListener('click', () => {
      playClickSound()
      closeAllMenus();
    });
  }

  const languageSelect = document.getElementById('language-select');
  if (languageSelect) {
    languageSelect.addEventListener('change', function(e) {
      playClickSound()
      const selectedLanguage = e.target.value;
      console.log(`Idioma seleccionado: ${selectedLanguage}`);
    });
  }
});