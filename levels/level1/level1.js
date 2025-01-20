        // configuración del juego
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // fisica del jugador y enemigo
        const jugador = {
            x: 100,
            y: 100,
            width: 50,
            height: 70,
            velocidadX: 0,
            velocidadY: 0,
            gravedad: 0.5,
            salto: -10,
            colision: false,
            vidas: 3
        };
        const enemigo = {
        x: 300, 
        y: 100, 
        width: 50, 
        height: 50, 
        velocidadX: 2, 
        velocidadY: 0, 
        gravedad: 0.5, 
        frameX: 0, 
        frameY: 0, 
        widthFrame: 64,
        heightFrame: 64,
        frameCount: 4, 
        frameRate: 10, 
        frameInterval: 0};
        
        // la colision de la plataforma
        const plataforma = {
            x: 1,
            y: 300,
            width: 800,
            height: 500
        };
        
        // la monedita esa amarilla
        const moneda = {
            x: 400,
            y: 200,
            width: 20,
            height: 20
        };
        
        const jugadorSprite = new Image();
        jugadorSprite.src = '../../sprites/idle.webp';
        
        const enemigoSprite = new Image(); 
        enemigoSprite.src = '../../sprites/yeti.gif'
        
        // Función para dibujar el jugador
        function dibujarJugador() {
            ctx.drawImage(jugadorSprite, jugador.x, jugador.y, jugador.width, jugador.height);
        }
        
        function dibujarEnemigo() { ctx.drawImage(enemigoSprite, enemigo.x, enemigo.y, enemigo.width, enemigo.height); }
        
        // Función para dibujar un árbol JSAJASJASJ
        function dibujarArbol(x, y) {
            // Dibuja el tronco
            ctx.fillStyle = 'saddlebrown';
            ctx.fillRect(x, y, 20, 50);
        
            // Dibuja las hojas
            ctx.fillStyle = 'green';
            ctx.beginPath();
            ctx.moveTo(x - 30, y);
            ctx.lineTo(x + 50, y);
            ctx.lineTo(x + 10, y - 60);
            ctx.closePath();
            ctx.fill();
        }
        
        // Función para dibujar una casa pa adornar
        function dibujarCasa(x, y) {
            ctx.fillStyle = 'peru';
            ctx.fillRect(x, y, 100, 100);
        
            ctx.fillStyle = 'sienna';
            ctx.beginPath();
            ctx.moveTo(x - 10, y);
            ctx.lineTo(x + 50, y - 50);
            ctx.lineTo(x + 110, y);
            ctx.closePath();
            ctx.fill();
        }
        
        // Función para dibujar la plataforma
        function dibujarPlataforma() {
            ctx.fillStyle = 'green';
            ctx.fillRect(plataforma.x, plataforma.y, plataforma.width, plataforma.height);
        }
        
        // Función para dibujar la moneda
        function dibujarMoneda() {
            ctx.fillStyle = 'yellow';
            ctx.fillRect(moneda.x, moneda.y, moneda.width, moneda.height);
        }
        
        // Función para mostrar la pantalla de Game Over
        function mostrarGameOver() {
            const gameOverScreen = document.createElement('div');
            gameOverScreen.style.position = 'absolute';
            gameOverScreen.style.top = '50%';
            gameOverScreen.style.left = '50%';
            gameOverScreen.style.transform = 'translate(-50%, -50%)';
            gameOverScreen.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            gameOverScreen.style.color = 'white';
            gameOverScreen.style.padding = '20px';
            gameOverScreen.style.textAlign = 'center';
            gameOverScreen.innerHTML = '<h1>Moriste</h1><button id="reaparecerBtn">Reaparecer</button>';
            document.body.appendChild(gameOverScreen);
        
            const reaparecerBtn = document.getElementById('reaparecerBtn');
            reaparecerBtn.addEventListener('click', function() {
                document.body.removeChild(gameOverScreen);
                reiniciarJuego();
            });
        }
        
        // Función para reiniciar el juego
        function reiniciarJuego() {
            jugador.x = 100;
            jugador.y = 100;
            jugador.velocidadX = 0;
            jugador.velocidadY = 0;
            jugador.vidas = 3;
        
            moneda.x = 400;
            moneda.y = 200;
        
            requestAnimationFrame(actualizar);
        }
        
        // Función para actualizar el juego
        function actualizar() {
            jugador.x += jugador.velocidadX;
            jugador.velocidadY += jugador.gravedad;
            jugador.y += jugador.velocidadY;
        
            // Verificar colisión con la moneda
            if (jugador.x + jugador.width > moneda.x && jugador.x < moneda.x + moneda.width && jugador.y + jugador.height > moneda.y && jugador.y < moneda.y + moneda.height) {
                moneda.x = -100;
                moneda.y = -100;
            }
        
            // Colisión con la plataforma
            if (jugador.y + jugador.height > plataforma.y && jugador.x + jugador.width > plataforma.x && jugador.x < plataforma.x + plataforma.width) {
                jugador.y = plataforma.y - jugador.height;
                jugador.velocidadY = 0;
                jugador.colision = true;
            } else {
                jugador.colision = false;
            }
        
            // Limitar movimiento horizontal
            if (jugador.x < 0) {
                jugador.x = 0;
            } else if (jugador.x + jugador.width > width) {
                jugador.x = width - jugador.width;
            }
        
            // Actualiza el enemigo
            enemigo.velocidadY += enemigo.gravedad;
            enemigo.y += enemigo.velocidadY;
            enemigo.x += enemigo.velocidadX;
        
            if (enemigo.x + enemigo.width > jugador.x && enemigo.x < jugador.x + jugador.width && enemigo.y + enemigo.height > jugador.y && enemigo.y < jugador.y + jugador.height) {
                jugador.vidas--;
                if (jugador.vidas <= 0) {
                    jugador.velocidadX = 0;
                    jugador.velocidadY = 0;
                    mostrarGameOver();
                    return;
                }
            }
        
            if (enemigo.x + enemigo.width > plataforma.x && enemigo.x < plataforma.x + plataforma.width && enemigo.y + enemigo.height > plataforma.y) {
                enemigo.y = plataforma.y - enemigo.height;
                enemigo.velocidadY = 0;
            } else if (enemigo.x + enemigo.width > width) {
                enemigo.x = width - enemigo.width;
                enemigo.velocidadX = -enemigo.velocidadX;
            } else if (enemigo.x < 0) {
                enemigo.x = 0;
                enemigo.velocidadX = -enemigo.velocidadX;
            }
        
            // Dibujar todo
            ctx.clearRect(0, 0, width, height);
            dibujarArbol(100, 250); // Dibuja el árbol
            dibujarCasa(500, 200); // Dibuja la casa
            dibujarJugador();
            dibujarEnemigo();
            dibujarPlataforma();
            dibujarMoneda();
        
            // Repetir
            requestAnimationFrame(actualizar);
        }
        
        // Función para las teclas
        function manejarTeclado(event) {
            if (event.type === 'keydown') {
                if (event.key === 'ArrowLeft') {
                    jugador.velocidadX = -3;
                } else if (event.key === 'ArrowRight') {
                    jugador.velocidadX = 3;
                } else if (event.key === 'ArrowUp' && jugador.colision) {
                    jugador.velocidadY = jugador.salto;
                }
            } else if (event.type === 'keyup') {
                if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                    jugador.velocidadX = 0;
                }
            }
        }
        
        // activa las funciones
        document.addEventListener('keydown', manejarTeclado);
        document.addEventListener('keyup', manejarTeclado);
        
        // Iniciar juego
        document.addEventListener('DOMContentLoaded', function() {
            actualizar();
        });
        