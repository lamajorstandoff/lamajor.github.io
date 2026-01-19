document.addEventListener('DOMContentLoaded', () => {

    // === 1. ГЛАВНАЯ ФУНКЦИЯ ОТКРЫТИЯ МОДАЛКИ КОМАНДЫ ===
    window.openTeamModal = function(teamName) {
        const modal = document.getElementById('teamModal');
        const data = teamData[teamName];
        
        if (!modal || !data) return;

        // 1. Ставим название команды
        const nameContainer = document.getElementById('modalTeamName');
        nameContainer.innerText = teamName;

        // 2. Логика призовых (Вставляем ПОСЛЕ заголовка, а не внутрь, чтобы не ломать верстку)
        // Удаляем старую плашку, если есть
        const oldPrize = modal.querySelector('.team-prize-wrapper');
        if(oldPrize) oldPrize.remove();

        if (data.winnings && Number(data.winnings) > 0) {
            const prizeDiv = document.createElement('div');
            prizeDiv.className = 'team-prize-wrapper'; // Обертка для позиционирования
            prizeDiv.style.marginTop = '5px';
            prizeDiv.innerHTML = `
                <div class="prize-tag">
                    <span class="prize-label">Призовые:</span>
                    <img src="https://totsamuyprod.github.io/recources/1000golda.png" class="prize-icon">
                    <span class="prize-amount">${data.winnings}</span>
                </div>`;
            // Вставляем сразу после названия команды
            nameContainer.parentNode.insertBefore(prizeDiv, nameContainer.nextSibling);
        }
        
        const logoImg = document.getElementById('modalTeamLogo');
        if(logoImg) logoImg.src = data.logo;

        const wins = data.wins || 0;
        const losses = data.losses || 0;
        const totalMatches = wins + losses;

        const statsContainer = document.querySelector('.team-quick-stats');
        if (statsContainer) {
            statsContainer.innerHTML = `
                <div class="t-stat-item is-win">
                    <span class="t-stat-value">${wins}</span>
                    <span class="t-stat-label">Победы</span>
                </div>
                <div class="t-stat-item is-matches">
                    <span class="t-stat-value">${totalMatches}</span>
                    <span class="t-stat-label">Матчи</span>
                </div>
                <div class="t-stat-item is-loss">
                    <span class="t-stat-value">${losses}</span>
                    <span class="t-stat-label">Поражения</span>
                </div>
            `;
        }

        // Логика наград команды
        const awardsContainer = document.getElementById('modalAwards');
        if (awardsContainer) {
            awardsContainer.innerHTML = '';
            if (data.awards && data.awards.length > 0) {
                let awardsHTML = `
                    <div class="team-awards-container">
                        <div class="awards-title">Достижения команды</div>
                        <div class="awards-grid">`;
                data.awards.forEach(award => {
                    awardsHTML += `
                        <div class="award-item" onclick="this.classList.toggle('active')">
                            <img src="${award.image}" class="award-img" alt="Award">
                            <div class="award-tooltip">${award.name}</div>
                        </div>`;
                });
                awardsHTML += `</div></div>`;
                awardsContainer.innerHTML = awardsHTML;
            }
        }

        // Список игроков
        const playersCont = document.getElementById('modalPlayers');
        if (playersCont) {
            playersCont.innerHTML = '';
            data.players.forEach(p => {
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
                    </div>`;
            });
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function renderMatches() {
        const container = document.getElementById('matches-container');
        if (!container) return;

        container.innerHTML = '';

        if (matchesData.length === 0) {
            container.innerHTML = '<div style="color:var(--text-dim); font-size:14px;">Пока нет запланированных матчей</div>';
            return;
        }

        matchesData.forEach(match => {
            const t1 = teamData[match.team1] || { logo: '', name: match.team1 };
            const t2 = teamData[match.team2] || { logo: '', name: match.team2 };

            const card = document.createElement('div');
            card.className = 'match-card-new';
            card.innerHTML = `
                <div class="match-info-top">${match.date} • ${match.time}</div>
                <div class="match-teams-row">
                    <div class="m-team-side">
                        <img src="${t1.logo}" alt="">
                        <span>${match.team1}</span>
                    </div>
                    <div class="vs-label">VS</div>
                    <div class="m-team-side">
                        <img src="${t2.logo}" alt="">
                        <span>${match.team2}</span>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    }
    renderMatches();

    function renderLeaderboard() {
        const leaderboardContainer = document.getElementById('leaderboard');
        if (!leaderboardContainer) return;

        const teamsArray = Object.keys(teamData).map(name => ({
            name: name,
            ...teamData[name]
        }));

        teamsArray.sort((a, b) => b.points - a.points);

        leaderboardContainer.innerHTML = '';

        teamsArray.forEach((team, index) => {
            let statusBadgeHTML = '';
            if (team.status === 'eliminated') {
                statusBadgeHTML = '<span class="status-badge-mini status-eliminated">Выбыл</span>';
            } else if (team.status === 'dq') {
                statusBadgeHTML = '<span class="status-badge-mini status-dq">ДИСКВ.</span>';
            } else if (team.status === 'winner') {
                statusBadgeHTML = '<span class="status-badge-mini status-winner">WINNER</span>';
            }

            const row = document.createElement('div');
            row.className = 'team-row';
            row.setAttribute('data-team', team.name);
            
            row.innerHTML = `
                <span class="pos">${index + 1}</span>
                <div class="logo-wrapper">
                    <img src="${team.logo}" class="team-logo">
                </div>
                <div class="team-name">
                    ${team.name}
                    ${statusBadgeHTML} 
                </div>
                <span class="points">${team.points} 🟡</span>
            `;

            row.addEventListener('click', () => openTeamModal(team.name));
            leaderboardContainer.appendChild(row);
        });
    }
    renderLeaderboard();

    // Анимация появления
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

    // 3D Tilt и клик по MVP
    const powCard = document.querySelector('.pow-card');
    if (powCard) {
        powCard.style.cursor = 'pointer'; 
        
        powCard.addEventListener('click', () => {
            const modal = document.getElementById('playerProfileModal');
            if (!modal) return;

            const calculatedKD = mvpData.d > 0 ? (mvpData.k / mvpData.d).toFixed(2) : mvpData.k.toFixed(2);

            document.getElementById('p-photo').src = mvpData.photo || 'https://via.placeholder.com/150';
            document.getElementById('p-full-name').innerText = `${mvpData.firstName} ${mvpData.lastName}`;
            document.getElementById('p-nick').innerText = mvpData.nick;
            document.getElementById('p-age').innerText = mvpData.age;
            
            document.getElementById('p-location').innerHTML = `
                ${mvpData.city} 
                <img src="https://flagcdn.com/w20/${(mvpData.countryCode || 'ru').toLowerCase()}.png" width="20" style="vertical-align: baseline;">
            `;
            
            // === PRIZE MONEY LOGIC (ИСПРАВЛЕНО) ===
            const infoSide = document.querySelector('.profile-info-side');
            // Удаляем старый тэг призовых
            const oldPrize = infoSide.querySelector('.prize-tag');
            if(oldPrize) oldPrize.remove();

            // В MVP данных пока нет winnings в явном виде, поэтому можно искать игрока в командах
            // Или брать из mvpData, если добавишь туда поле. 
            // Сейчас ставим проверку на mvpData.winnings (добавь это поле в data.js или через админку, если хочешь)
            let winnings = mvpData.winnings || 0;
            
            // Попытка найти игрока в командах, если в MVP данных нет призовых
            if (!winnings) {
                Object.values(teamData).forEach(t => {
                    t.players.forEach(pl => {
                        if (pl.nick === mvpData.nick) winnings = pl.winnings;
                    });
                });
            }

            if (winnings && Number(winnings) > 0) {
                const prizeHTML = document.createElement('div');
                prizeHTML.className = 'prize-tag';
                prizeHTML.innerHTML = `
                    <span class="prize-label">Призовые:</span>
                    <img src="https://totsamuyprod.github.io/recources/1000golda.png" class="prize-icon">
                    <span class="prize-amount">${winnings}</span>
                `;
                const subInfo = document.querySelector('.p-sub-info');
                subInfo.parentNode.insertBefore(prizeHTML, subInfo.nextSibling);
            }
            
            const awardsContainer = document.getElementById('p-awards-container');
            if(awardsContainer) awardsContainer.innerHTML = '';

            document.getElementById('p-k').innerText = mvpData.k;
            document.getElementById('p-d').innerText = mvpData.d;
            document.getElementById('p-a').innerText = mvpData.a;
            document.getElementById('p-kd').innerText = calculatedKD;

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

    // === 2. ЛОГИКА ЗАКРЫТИЯ МОДАЛОК ===
    function setupModalClose(modalId, closeBtnId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        const closeBtn = document.getElementById(closeBtnId) || modal.querySelector('.close-modal');
        
        const close = () => {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        };

        if (closeBtn) closeBtn.addEventListener('click', close);
        modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
    }

    setupModalClose('teamModal', null);
    setupModalClose('playerProfileModal', 'closeProfile');

    // === ЛОГИКА СТРАНИЦЫ ИГРОКОВ ===
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
                const kdValue = p.d > 0 ? (p.k / p.d) : p.k;
                allPlayers.push({ 
                    ...p, 
                    teamName, 
                    teamLogo: team.logo, 
                    calculatedKD: kdValue 
                });
            });
        });

        let filteredPlayers = allPlayers.filter(p => 
            p.nick.toLowerCase().includes(filter.toLowerCase())
        );

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
            card.className = 'player-profile-card stats-card player-row'; 
            
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

            // КЛИК ПО ИГРОКУ ИЗ СПИСКА
            card.addEventListener('click', () => {
                const modal = document.getElementById('playerProfileModal');
                
                document.getElementById('p-photo').src = p.photo || 'https://i.pinimg.com/474x/57/9d/27/579d27ca2be7cf205166c6375d706ef9.jpg';
                document.getElementById('p-full-name').innerText = `${p.firstName || ''} ${p.lastName || ''}`;
                document.getElementById('p-nick').innerText = p.nick;
                document.getElementById('p-age').innerText = p.age || '—';
                document.getElementById('p-location').innerHTML = `
                        ${p.city || 'Неизвестно'} 
                        <img src="https://flagcdn.com/w20/${(p.countryEmoji || 'ru').toLowerCase()}.png" width="18" style="vertical-align: baseline;">
                    `;
                
                // === PRIZE MONEY (ДЛЯ СПИСКА) ===
                const infoSide = document.querySelector('.profile-info-side');
                const oldPrize = infoSide.querySelector('.prize-tag');
                if(oldPrize) oldPrize.remove();

                if (p.winnings && Number(p.winnings) > 0) {
                    const prizeHTML = document.createElement('div');
                    prizeHTML.className = 'prize-tag';
                    prizeHTML.innerHTML = `
                        <span class="prize-label">Призовые:</span>
                        <img src="https://totsamuyprod.github.io/recources/1000golda.png" class="prize-icon">
                        <span class="prize-amount">${p.winnings}</span>
                    `;
                    const subInfo = document.querySelector('.p-sub-info');
                    subInfo.parentNode.insertBefore(prizeHTML, subInfo.nextSibling);
                }

                const awardsContainer = document.getElementById('p-awards-container');
                if (awardsContainer) {
                    awardsContainer.innerHTML = '';
                    if (p.awards && p.awards.length > 0) {
                        p.awards.forEach(aw => {
                            const div = document.createElement('div');
                            div.className = 'p-award-item';
                            div.innerHTML = `
                                <img src="${aw.image}" class="p-award-img" alt="award">
                                <div class="p-award-tooltip">${aw.name}</div>
                            `;
                            awardsContainer.appendChild(div);
                        });
                    }
                }
                
                document.getElementById('p-k').innerText = p.k;
                document.getElementById('p-d').innerText = p.d;
                document.getElementById('p-a').innerText = p.a;
                document.getElementById('p-kd').innerText = p.calculatedKD.toFixed(2);

                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });

            grid.appendChild(card);
            if (typeof observer !== 'undefined') observer.observe(card);
        });
    }

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

// Глобальный обработчик закрытия
document.addEventListener('click', (e) => {
    const modal = document.getElementById('playerProfileModal');
    if (!modal) return;
    if (e.target.id === 'closeProfile' || e.target.classList.contains('close-modal-alt') || e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

});
