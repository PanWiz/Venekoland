document.addEventListener('DOMContentLoaded', function () {
  const introVideo = document.getElementById('intro-video');

  introVideo.addEventListener('loadeddata', () => {
    introVideo.play();
  });

  introVideo.addEventListener('ended', () => {
    introVideo.style.display = 'none';
    document.querySelector('header').style.display = 'block';
    document.querySelector('nav').style.display = 'block';
    document.querySelector('main').style.display = 'block';
  });

  // Obtener el archivo de audio para el sonido del clic
  const clickSound = document.getElementById('click-sound');
  const backgroundAudio = new Audio('../sounds/fondo.mp3');
  
  // Función para reproducir el sonido del clic
  function playClickSound() {
    clickSound.play().catch((error) => {
      console.error('Error al intentar reproducir el sonido del clic:', error);
    });
  }

  // Función para reproducir o pausar el audio de fondo
  function toggleBackgroundAudio(play) {
    backgroundAudio.volume = 0.2;
    if (play) {
      backgroundAudio.play().catch((error) => {
        console.error('Error al intentar reproducir el audio de fondo:', error);
      });
    } else {
      backgroundAudio.pause();
    }
  }

  // Control de reproducción de audio de fondo
  window.addEventListener('keydown', (event) => {
    switch (event.key) {
      case 'm':
        toggleBackgroundAudio(true);
        break;
      case 'n':
        toggleBackgroundAudio(false);
        break;
    }
  });

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
          <li><button id="level-2-button">Nivel 2</button></li>
        </ul>
        <button id="back-to-menu" class="back-button">Volver al menú</button>
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

      const level2Button = document.getElementById('level-2-button');
      level2Button.addEventListener('click', () => {
        playClickSound();  // Reproducir el sonido del clic
        window.location.href = '/levels/level2/level2.html';
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
      playClickSound();
      closeAllMenus();
    });
  }

  const closeCreditsButton = document.getElementById('close-credits');
  if (closeCreditsButton) {
    closeCreditsButton.addEventListener('click', () => {
      playClickSound();
      closeAllMenus();
    });
  }

  const languageSelect = document.getElementById('language-select');
  if (languageSelect) {
    languageSelect.addEventListener('change', function(e) {
      playClickSound();
      const selectedLanguage = e.target.value;
      console.log(`Idioma seleccionado: ${selectedLanguage}`);
    });
  }
});
