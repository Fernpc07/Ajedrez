const TORNEOS_DB = [
    { id: 1, nombre: 'Copa Oaxaca 2025', modalidad: 'Clásico', fecha: '2025-08-15', inscritos: 18, max: 32, premio: '$5,000', estado: 'Abierto' },
    { id: 2, nombre: 'Blitz Masters', modalidad: 'Blitz', fecha: '2025-07-20', inscritos: 32, max: 32, premio: '$2,000', estado: 'Cerrado' },
    { id: 3, nombre: 'Torneo Navideño', modalidad: 'Rápido', fecha: '2025-12-10', inscritos: 5, max: 32, premio: '$3,500', estado: 'Próximo' },
    { id: 4, nombre: 'Gran Prix Regional', modalidad: 'Clásico', fecha: '2025-09-05', inscritos: 24, max: 64, premio: '$8,000', estado: 'Abierto' },
    { id: 5, nombre: 'Bullet Championship', modalidad: 'Bullet', fecha: '2025-10-18', inscritos: 10, max: 16, premio: '$1,500', estado: 'Próximo' },
    { id: 6, nombre: 'Copa Juvenil', modalidad: 'Rápido', fecha: '2025-11-02', inscritos: 28, max: 32, premio: '$2,500', estado: 'Abierto' },
];

const JUGADORES_DB = [
    { nombre: 'Magnus Carlsen', nivel: 'Experto', elo: 2830, pais: '🇳🇴 Noruega', avatar: '♔' },
    { nombre: 'Ding Liren', nivel: 'Experto', elo: 2762, pais: '🇨🇳 China', avatar: '♛' },
    { nombre: 'Judit Polgar', nivel: 'Experto', elo: 2735, pais: '🇭🇺 Hungría', avatar: '♛' },
    { nombre: 'Ana García', nivel: 'Avanzado', elo: 1850, pais: '🇲🇽 México', avatar: '♜' },
    { nombre: 'Luis Ramírez', nivel: 'Avanzado', elo: 1720, pais: '🇲🇽 México', avatar: '♝' },
    { nombre: 'Carlos Mendoza', nivel: 'Intermedio', elo: 1350, pais: '🇲🇽 México', avatar: '♞' },
];

function badgeEstado(estado) {
    const mapa = {
        'Abierto': 'badge-abierto',
        'Cerrado': 'badge-cerrado',
        'Próximo': 'badge-proximo',
    };
    return `<span class="badge-torneo ${mapa[estado] || ''}">${estado}</span>`;
}

function renderTorneos(lista) {
    const tbody = document.getElementById('tbody-torneos');
    if (!tbody) return;

    if (lista.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--texto-claro);padding:2rem;">
      Sin resultados para este filtro.</td></tr>`;
        return;
    }

    tbody.innerHTML = lista.map(t => {
        const lleno = t.inscritos >= t.max;
        return `
      <tr>
        <td style="color:rgba(201,168,76,0.5);font-family:var(--fuente-titulo);">#${t.id}</td>
        <td style="font-weight:600;color:var(--marfil);">${t.nombre}</td>
        <td>${t.modalidad}</td>
        <td>${t.fecha}</td>
        <td style="color:${lleno ? '#e87a5d' : 'var(--dorado)'};">
          ${t.inscritos}/${t.max}
        </td>
        <td style="color:#7ec88b;">${t.premio}</td>
        <td>${badgeEstado(t.estado)}</td>
      </tr>`;
    }).join('');
}

function iniciarFiltros() {
    const btnFiltros = document.querySelectorAll('.btn-filtro');
    if (!btnFiltros.length) return;

    btnFiltros.forEach(btn => {
        btn.addEventListener('click', () => {
            btnFiltros.forEach(b => b.classList.remove('activo-filtro'));
            btn.classList.add('activo-filtro');

            const filtro = btn.dataset.filtro;
            const resultado = filtro === 'todos'
                ? TORNEOS_DB
                : TORNEOS_DB.filter(t => t.estado === filtro);

            renderTorneos(resultado);
        });
    });
}

function renderRanking() {
    const lista = document.getElementById('lista-ranking');
    if (!lista) return;

    const posClases = ['top1', 'top2', 'top3'];

    lista.innerHTML = JUGADORES_DB.map((j, i) => `
    <div class="ranking-card">
      <div class="ranking-pos ${posClases[i] || ''}">${i + 1}</div>
      <div class="ranking-avatar">${j.avatar}</div>
      <div class="ranking-info">
        <h4>${j.nombre}</h4>
        <p>${j.nivel} · ${j.pais}</p>
      </div>
      <div class="ranking-elo">${j.elo}</div>
    </div>
  `).join('');
}

function animarContadores() {
    const contadores = [
        { id: 'stat-jugadores', fin: 247 },
        { id: 'stat-torneos', fin: 12 },
        { id: 'stat-partidas', fin: 3841 },
    ];

    contadores.forEach(({ id, fin }) => {
        const el = document.getElementById(id);
        if (!el) return;

        let actual = 0;
        const paso = Math.ceil(fin / 60);
        const intervalo = setInterval(() => {
            actual = Math.min(actual + paso, fin);
            el.textContent = actual.toLocaleString('es-MX');
            if (actual >= fin) clearInterval(intervalo);
        }, 20);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderTorneos(TORNEOS_DB);
    renderRanking();
    iniciarFiltros();

    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                animarContadores();
                observer.disconnect();
            }
        });
    }, { threshold: 0.3 });

    const panelStats = document.querySelector('.panel-info');
    if (panelStats) observer.observe(panelStats);
});