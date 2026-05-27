function generarFondoHero() {
    const hero = document.querySelector('.hero-tablero');
    if (!hero) return;
    hero.innerHTML = Array.from({ length: 64 }, () => '<div></div>').join('');
}

function generarTablero() {
    const contenedor = document.getElementById('tablero-mini');
    if (!contenedor) return;

    const piezasNegras = ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'];
    const piezasBlancas = ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'];

    contenedor.innerHTML = '';

    for (let fila = 0; fila < 8; fila++) {
        for (let col = 0; col < 8; col++) {
            const casilla = document.createElement('div');
            const esClara = (fila + col) % 2 === 0;
            casilla.classList.add('casilla', esClara ? 'clara' : 'oscura');

            let pieza = '';
            if (fila === 0) pieza = piezasNegras[col];
            else if (fila === 1) pieza = '♟';
            else if (fila === 6) pieza = '♙';
            else if (fila === 7) pieza = piezasBlancas[col];

            if (pieza) {
                const span = document.createElement('span');
                span.textContent = pieza;
                span.style.color = fila <= 1 ? '#1a1a1a' : '#f5f0e8';
                span.style.textShadow = '0 1px 3px rgba(0,0,0,0.5)';
                casilla.appendChild(span);
            }

            casilla.addEventListener('mouseenter', () => {
                casilla.style.transform = 'scale(1.15)';
                casilla.style.zIndex = '10';
                casilla.style.position = 'relative';
            });
            casilla.addEventListener('mouseleave', () => {
                casilla.style.transform = '';
                casilla.style.zIndex = '';
            });

            contenedor.appendChild(casilla);
        }
    }
}

function iniciarReloj() {
    const displayBlancas = document.getElementById('tiempo-blancas');
    const displayNegras = document.getElementById('tiempo-negras');
    const btnReloj = document.getElementById('btn-reloj');
    const btnReset = document.getElementById('btn-reset-reloj');
    if (!displayBlancas || !displayNegras || !btnReloj) return;

    let turno = 'blancas';
    let segundosB = 10 * 60;
    let segundosN = 10 * 60;
    let intervalo = null;
    let corriendo = false;

    const fmt = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

    const tick = () => {
        if (turno === 'blancas') {
            segundosB--;
            displayBlancas.textContent = fmt(segundosB);
            if (segundosB <= 0) { clearInterval(intervalo); corriendo = false; mostrarAlerta('¡Tiempo! Ganan las negras.', 'exito'); }
        } else {
            segundosN--;
            displayNegras.textContent = fmt(segundosN);
            if (segundosN <= 0) { clearInterval(intervalo); corriendo = false; mostrarAlerta('¡Tiempo! Ganan las blancas.', 'exito'); }
        }
    };

    btnReloj.addEventListener('click', () => {
        if (!corriendo) {
            corriendo = true;
            intervalo = setInterval(tick, 1000);
            btnReloj.textContent = 'Cambiar turno ♟';
        } else {
            turno = turno === 'blancas' ? 'negras' : 'blancas';
            document.getElementById('reloj-blancas')?.classList.toggle('turno-activo', turno === 'blancas');
            document.getElementById('reloj-negras')?.classList.toggle('turno-activo', turno === 'negras');
        }
    });

    btnReset?.addEventListener('click', () => {
        clearInterval(intervalo);
        corriendo = false;
        segundosB = 10 * 60;
        segundosN = 10 * 60;
        displayBlancas.textContent = fmt(segundosB);
        displayNegras.textContent = fmt(segundosN);
        btnReloj.textContent = 'Iniciar reloj ▶';
        document.getElementById('reloj-blancas')?.classList.remove('turno-activo');
        document.getElementById('reloj-negras')?.classList.remove('turno-activo');
        turno = 'blancas';
    });
}

function iniciarFormulario() {
    const form = document.getElementById('form-inscripcion');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const nombre = document.getElementById('nombre')?.value.trim();
        const email = document.getElementById('email')?.value.trim();
        const nivel = document.getElementById('nivel')?.value;
        const terminos = document.getElementById('terminos')?.checked;

        if (!nombre || !email || !nivel) {
            mostrarAlerta('Por favor, completa todos los campos requeridos.', 'error');
            return;
        }
        if (!terminos) {
            mostrarAlerta('Debes aceptar los términos y condiciones.', 'error');
            return;
        }

        const btn = form.querySelector('button[type="submit"]');
        btn.textContent = 'Enviando…';
        btn.disabled = true;

        setTimeout(() => {
            mostrarAlerta(`¡Bienvenido, ${nombre}! Nivel: ${nivel}. Inscripción registrada.`, 'exito');
            btn.textContent = 'Inscribirse ♟';
            btn.disabled = false;
            form.reset();
        }, 1200);
    });
}

function mostrarAlerta(mensaje, tipo) {
    let alerta = document.getElementById('alerta-global');
    if (!alerta) {
        alerta = document.createElement('div');
        alerta.id = 'alerta-global';
        alerta.style.cssText = `
      position:fixed; bottom:2rem; right:2rem; z-index:9999;
      padding:14px 24px; font-family:var(--fuente-titulo);
      font-size:0.95rem; max-width:360px;
      border-radius:2px; opacity:0;
      transition: opacity 0.4s ease, transform 0.4s ease;
      transform: translateY(20px);
    `;
        document.body.appendChild(alerta);
    }

    if (tipo === 'exito') {
        alerta.style.background = 'rgba(201,168,76,0.12)';
        alerta.style.border = '1px solid rgba(201,168,76,0.5)';
        alerta.style.color = '#c9a84c';
    } else {
        alerta.style.background = 'rgba(232,122,93,0.12)';
        alerta.style.border = '1px solid rgba(232,122,93,0.5)';
        alerta.style.color = '#e87a5d';
    }

    alerta.textContent = mensaje;
    requestAnimationFrame(() => {
        alerta.style.opacity = '1';
        alerta.style.transform = 'translateY(0)';
    });

    setTimeout(() => {
        alerta.style.opacity = '0';
        alerta.style.transform = 'translateY(20px)';
    }, 4500);
}

function marcarNavActiva() {
    const actual = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav ul li a').forEach(link => {
        const href = (link.getAttribute('href') || '').split('/').pop().split('#')[0];
        if (href === actual || (actual === '' && href === 'index.html')) {
            link.classList.add('activo');
        }
    });
}

function observarEntradas() {
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.style.opacity = '1';
                e.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.08 });

    document.querySelectorAll('.animar-entrada').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(28px)';
        el.style.transition = 'opacity 0.65s ease, transform 0.65s ease';
        obs.observe(el);
    });
}

function reproducirSonido() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'square';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
        mostrarAlerta('Tu navegador no soporta Web Audio API.', 'error');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    marcarNavActiva();
    observarEntradas();

    generarFondoHero();
    generarTablero();
    iniciarReloj();
    iniciarFormulario();
});