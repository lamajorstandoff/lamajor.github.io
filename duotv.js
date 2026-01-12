// 1. ДАННЫЕ ВЫНЕСЕНЫ НАВЕРХ (теперь они видны везде)
document.addEventListener('DOMContentLoaded', () => {

function renderLeaderboard() {
    const leaderboardContainer = document.getElementById('leaderboard');
    if (!leaderboardContainer) return;

    // 1. Превращаем объект в массив для сортировки
    const teamsArray = Object.keys(teamData).map(name => ({
        name: name,
        ...teamData[name]
    }));

    // 2. Сортируем по убыванию очков
    teamsArray.sort((a, b) => b.points - a.points);

    // 3. Очищаем контейнер и наполняем его
    leaderboardContainer.innerHTML = '';

    teamsArray.forEach((team, index) => {
        const row = document.createElement('div');
        row.className = 'team-row';
        row.setAttribute('data-team', team.name);
        
        row.innerHTML = `
            <span class="pos">${index + 1}</span>
            <div class="logo-wrapper">
                <img src="${team.logo}" class="team-logo">
            </div>
            <div class="team-name">${team.name}</div>
            <span class="points">${team.points} 🟡</span>
        `;

        // Добавляем событие клика для открытия модалки (как у тебя было)
        row.addEventListener('click', () => openTeamModal(team.name));
        
        leaderboardContainer.appendChild(row);
    });
}

// Вызываем при загрузке
renderLeaderboard();

    // Плавное появление
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.stats-card, .pow-card, .match-item, .player-profile-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';
        observer.observe(el);
    });

    // 3D Tilt
    const powCard = document.querySelector('.pow-card');
    if (powCard) {
powCard.style.cursor = 'pointer'; // Делаем карточку кликабельной
        
        powCard.addEventListener('click', () => {
            const modal = document.getElementById('playerProfileModal');
            if (!modal) return;

            // Рассчитываем КД для MVP
            const calculatedKD = mvpData.d > 0 ? (mvpData.k / mvpData.d).toFixed(2) : mvpData.k.toFixed(2);

            // Заполняем модальное окно данными из mvpData
            document.getElementById('p-photo').src = mvpData.photo || 'https://via.placeholder.com/150';
            document.getElementById('p-full-name').innerText = `${mvpData.firstName} ${mvpData.lastName}`;
            document.getElementById('p-nick').innerText = mvpData.nick;
            document.getElementById('p-age').innerText = mvpData.age;
            
            // Локация и флаг (используем Способ 2 с картинкой)
            document.getElementById('p-location').innerHTML = `
                ${mvpData.city} 
                <img src="https://flagcdn.com/w20/${mvpData.countryCode.toLowerCase()}.png" width="20" style="vertical-align: baseline;">
            `;
            
            // Статистика
            document.getElementById('p-k').innerText = mvpData.k;
            document.getElementById('p-d').innerText = mvpData.d;
            document.getElementById('p-a').innerText = mvpData.a;
            document.getElementById('p-kd').innerText = calculatedKD;

            // Открываем
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        powCard.addEventListener('mousemove', (e) => {
            const rect = powCard.getBoundingClientRect();
            const rotateX = (rect.height / 2 - (e.clientY - rect.top)) / 20;
            const rotateY = ((e.clientX - rect.left) - rect.width / 2) / 20;
            powCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        powCard.addEventListener('mouseleave', () => {
            powCard.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
        });
    }

    // Свечение
    const glow = document.querySelector('.cursor-glow');
    if (glow) {
        window.addEventListener('mousemove', (e) => {
            glow.style.background = `radial-gradient(circle at ${e.clientX}px ${e.clientY}px, rgba(255, 215, 0, 0.07) 0%, transparent 60%)`;
        });
    }

    // Логика модального окна (только если оно есть на странице)
    const modal = document.getElementById('teamModal');
    if (modal) {
        document.querySelectorAll('.team-row').forEach(row => {
            row.addEventListener('click', () => {
                const teamName = row.getAttribute('data-team');
                const data = teamData[teamName];
                if (data) {
                    document.getElementById('modalTeamName').innerText = teamName;
                    document.getElementById('modalTeamLogo').src = data.logo;

            const wins = data.wins || 0;     // Если нет данных, ставим 0
            const losses = data.losses || 0; // Если нет данных, ставим 0
            const totalMatches = wins + losses;

            const statsContainer = document.querySelector('.team-quick-stats');
            if (statsContainer) {
                statsContainer.innerHTML = `
                    <span>🏆 ${wins} Побед |</span>
                    <span>💀 ${losses} Поражений |</span>
                    <span>🎮 ${totalMatches} Матчей</span>
                `;
            }

                    const playersCont = document.getElementById('modalPlayers');
                    playersCont.innerHTML = '';
		data.players.forEach(p => {
                    // Считаем K/D для модального окна
                    const modalKD = p.d > 0 ? (p.k / p.d).toFixed(2) : p.k.toFixed(2);
                    playersCont.innerHTML += `
                        <div class="player-card">
                            <div class="player-info-main">
                                <span class="player-nickname">${p.nick}</span>
                                <div class="player-detailed-stats" style="font-size:10px; color:#888; margin-top:4px;">
                                    K: ${p.k} | D: ${p.d} | A: ${p.a}
                                </div>
                            </div>
                            <div class="player-kd-badge">K/D ${modalKD}</div>
                        </div>
                    `;
                });
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        const closeBtn = document.querySelector('.close-modal');
        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        };
        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => { if(e.target === modal) closeModal(); });
    }

// === ЛОГИКА СТРАНИЦЫ ИГРОКОВ (Поиск и Список) ===
const grid = document.getElementById('allPlayersGrid');
    const searchInput = document.getElementById('playerSearch');
    const sortButtons = document.querySelectorAll('.sort-btn');
    let currentSort = 'default';

function renderPlayers(filter = '') {
        if (!grid) return;
        grid.innerHTML = '';
        
        let allPlayers = [];
        Object.keys(teamData).forEach(teamName => {
            const team = teamData[teamName];
            team.players.forEach(p => {
                // Считаем K/D для каждого игрока сразу
                const kdValue = p.d > 0 ? (p.k / p.d) : p.k;
                allPlayers.push({ 
                    ...p, 
                    teamName, 
                    teamLogo: team.logo, // Добавляем логотип
                    calculatedKD: kdValue 
                });
            });
        });

        // Фильтрация
        let filteredPlayers = allPlayers.filter(p => 
            p.nick.toLowerCase().includes(filter.toLowerCase())
        );

        // Исправленная сортировка
        if (currentSort === 'kd') {
            filteredPlayers.sort((a, b) => b.calculatedKD - a.calculatedKD);
        } else if (currentSort === 'kills') {
            filteredPlayers.sort((a, b) => b.k - a.k);
        }

        if (filteredPlayers.length === 0) {
            grid.innerHTML = `<div class="no-results" style="text-align:center; width:100%; padding:40px; color:var(--text-dim); font-family:'Unbounded';">Игрок не найден</div>`;
            return;
        }
filteredPlayers.forEach(p => {
            const card = document.createElement('div');
            // Добавляем класс player-row для совместимости со стилями
            card.className = 'player-profile-card stats-card player-row'; 
            
            // Обязательно добавляем атрибуты для мобильной версии
            card.setAttribute('data-k', p.k);
            card.setAttribute('data-d', p.d);
            card.setAttribute('data-a', p.a);
            card.setAttribute('data-kd', p.calculatedKD.toFixed(2));

            card.innerHTML = `
                <div class="info-left" style="display: flex; align-items: center; flex: 1;">
                    <div class="profile-avatar">
                        <img src="${p.teamLogo}" alt="${p.teamName}" style="width: 100%; height: 100%; object-fit: contain;">
                    </div>
                    <div class="player-main-info">
                        <span class="profile-nick">${p.nick}</span>
                        <span class="profile-team">${p.teamName}</span>
                    </div>
                </div>
                <div class="profile-stats-grid">
                    <div class="stat-item"><span class="stat-label">K</span><span class="stat-value">${p.k}</span></div>
                    <div class="stat-item"><span class="stat-label">D</span><span class="stat-value">${p.d}</span></div>
                    <div class="stat-item"><span class="stat-label">A</span><span class="stat-value">${p.a}</span></div>
                    <div class="stat-item kd-main">
                        <span class="stat-label">K/D</span>
                        <span class="stat-value">${p.calculatedKD.toFixed(2)}</span>
                    </div>
                </div>
            `;

// 3. Добавляем СОБЫТИЕ КЛИКА (тот самый 4-й пункт)
card.addEventListener('click', () => {
    const modal = document.getElementById('playerProfileModal');
    
    // Подставляем данные игрока (p) в элементы модального окна
    document.getElementById('p-photo').src = p.photo || 'https://i.pinimg.com/474x/57/9d/27/579d27ca2be7cf205166c6375d706ef9.jpg'; // Фото или заглушка
    document.getElementById('p-full-name').innerText = `${p.firstName || 'Имя'} ${p.lastName || 'Фамилия'}`;
    document.getElementById('p-nick').innerText = p.nick;
    document.getElementById('p-age').innerText = p.age || '—';
document.getElementById('p-location').innerHTML = `
            ${p.city || 'Неизвестно'} 
            <img src="https://flagcdn.com/w20/${p.countryEmoji.toLowerCase()}.png" width="18" style="vertical-align: baseline;">
        `;
    
    // Статистика
    document.getElementById('p-k').innerText = p.k;
    document.getElementById('p-d').innerText = p.d;
    document.getElementById('p-a').innerText = p.a;
    document.getElementById('p-kd').innerText = p.calculatedKD.toFixed(2);

    // Показываем окно	
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Отключаем прокрутку сайта
});

// 4. Добавляем готовую карточку на страницу
grid.appendChild(card);

            grid.appendChild(card);
            if (typeof observer !== 'undefined') observer.observe(card);
        });
    }

    // Слушатели для кнопок сортировки
    sortButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            sortButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentSort = btn.dataset.sort;
            renderPlayers(searchInput ? searchInput.value : '');
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', (e) => renderPlayers(e.target.value));
    }

    renderPlayers();
});

// В самом конце скрипта duotv.js
const closeProfileBtn = document.getElementById('closeProfile');
const playerModal = document.getElementById('playerProfileModal');

if (closeProfileBtn && playerModal) {
    const closePlayerModal = () => {
        playerModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    closeProfileBtn.addEventListener('click', closePlayerModal);
    
    // Закрытие при клике на темную область вокруг окна
    playerModal.addEventListener('click', (e) => {
        if (e.target === playerModal) closePlayerModal();
    });
}

// Глобальный обработчик закрытия
document.addEventListener('click', (e) => {
    const modal = document.getElementById('playerProfileModal');
    // Если кликнули на кнопку закрытия или на темный фон
    if (e.target.id === 'closeProfile' || e.target.classList.contains('close-modal-alt') || e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});









