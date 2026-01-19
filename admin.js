/* admin.js - Исправленная версия */

document.addEventListener('DOMContentLoaded', () => {
    initMVP();
    initTeams();
    initMatches();
});

// --- MVP LOGIC ---
function initMVP() {
    if (!document.getElementById('mvp-nick')) return;

    document.getElementById('mvp-nick').value = mvpData.nick || "";
    document.getElementById('mvp-fname').value = mvpData.firstName || "";
    document.getElementById('mvp-lname').value = mvpData.lastName || "";
    document.getElementById('mvp-age').value = mvpData.age || "";
    document.getElementById('mvp-city').value = mvpData.city || "";
    document.getElementById('mvp-country').value = mvpData.countryCode || "";
    document.getElementById('mvp-photo').value = mvpData.photo || "";
    document.getElementById('mvp-k').value = mvpData.k || 0;
    document.getElementById('mvp-d').value = mvpData.d || 0;
    document.getElementById('mvp-a').value = mvpData.a || 0;

    const teamSelect = document.getElementById('mvp-team-select');
    teamSelect.innerHTML = '';
    Object.keys(teamData).forEach(name => {
        const opt = document.createElement('option');
        opt.value = name;
        opt.text = name;
        teamSelect.appendChild(opt);
    });
    
    const currentTeam = Object.keys(teamData).find(name => teamData[name].logo === mvpData.teamLogo);
    if(currentTeam) teamSelect.value = currentTeam;
}

function saveMVPFromUI() {
    mvpData.nick = document.getElementById('mvp-nick').value;
    mvpData.firstName = document.getElementById('mvp-fname').value;
    mvpData.lastName = document.getElementById('mvp-lname').value;
    mvpData.age = document.getElementById('mvp-age').value;
    mvpData.city = document.getElementById('mvp-city').value;
    mvpData.countryCode = document.getElementById('mvp-country').value;
    mvpData.photo = document.getElementById('mvp-photo').value;
    mvpData.k = Number(document.getElementById('mvp-k').value);
    mvpData.d = Number(document.getElementById('mvp-d').value);
    mvpData.a = Number(document.getElementById('mvp-a').value);
    
    const selectedTeam = document.getElementById('mvp-team-select').value;
    if(teamData[selectedTeam]) {
        mvpData.teamLogo = teamData[selectedTeam].logo;
    }
}

// --- TEAMS LOGIC ---
function initTeams() {
    const container = document.getElementById('teams-container');
    if (!container) return;
    
    container.innerHTML = '';

    Object.keys(teamData).forEach(teamName => {
        const team = teamData[teamName];
        const currentStatus = team.status || '';
        
        // Гарантируем, что поле winnings существует
        const teamWinnings = team.winnings || 0;
        
        if (!team.awards) team.awards = [];

        // Генерируем HTML для каждого игрока
        const playersHTML = team.players.map((p, idx) => {
            if (!p.awards) p.awards = [];
            const playerWinnings = p.winnings || 0; // Призовые игрока

            // HTML наград игрока (оставляем как было, код сокращен для читаемости)
            const playerAwardsHTML = p.awards.map((award, awIdx) => `
                <div style="display: flex; gap: 5px; margin-top: 5px; align-items: center; background: rgba(0,0,0,0.3); padding: 5px; border-radius: 4px;">
                    <img src="${award.image}" style="width: 25px; height: 25px; object-fit: contain;">
                    <input type="text" class="form-control" style="font-size: 10px; padding: 4px; height: auto;" value="${award.name}" placeholder="Название" onchange="updatePlayerAward('${teamName}', ${idx}, ${awIdx}, 'name', this.value)">
                    <input type="text" class="form-control" style="font-size: 10px; padding: 4px; height: auto;" value="${award.image}" placeholder="URL иконки" onchange="updatePlayerAward('${teamName}', ${idx}, ${awIdx}, 'image', this.value)">
                    <button class="btn-danger" style="padding: 2px 8px; font-size: 10px;" onclick="deletePlayerAward('${teamName}', ${idx}, ${awIdx})">x</button>
                </div>
            `).join('');

            return `
            <div style="background:#1a1a1a; padding:15px; border-radius:10px; margin-bottom:10px; border: 1px solid #333;">
                <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                    <strong style="color:var(--gold);">Игрок #${idx + 1}</strong>
                </div>
                <div class="row-2">
                     <div class="form-group"><label>Nick</label><input type="text" class="form-control" value="${p.nick}" onchange="updatePlayer('${teamName}', ${idx}, 'nick', this.value)"></div>
                     <div class="form-group"><label>Age</label><input type="text" class="form-control" value="${p.age}" onchange="updatePlayer('${teamName}', ${idx}, 'age', this.value)"></div>
                </div>
                
                <div class="form-group" style="background: rgba(255, 215, 0, 0.05); padding: 10px; border-radius: 6px; border: 1px solid rgba(255, 215, 0, 0.1);">
                    <label style="color: #FFD700;">💰 Призовые игрока (Gold)</label>
                    <input type="number" class="form-control" value="${playerWinnings}" onchange="updatePlayer('${teamName}', ${idx}, 'winnings', this.value)">
                </div>

                <div class="row-4">
                     <div class="form-group"><label>Kills</label><input type="number" class="form-control" value="${p.k}" onchange="updatePlayer('${teamName}', ${idx}, 'k', this.value)"></div>
                     <div class="form-group"><label>Deaths</label><input type="number" class="form-control" value="${p.d}" onchange="updatePlayer('${teamName}', ${idx}, 'd', this.value)"></div>
                     <div class="form-group"><label>Assists</label><input type="number" class="form-control" value="${p.a}" onchange="updatePlayer('${teamName}', ${idx}, 'a', this.value)"></div>
                     <div class="form-group"><label>KD</label><input type="text" class="form-control" value="${p.kd}" disabled style="opacity:0.5"></div>
                </div>
                <div class="row-2">
                     <div class="form-group"><label>Имя</label><input type="text" class="form-control" value="${p.firstName}" onchange="updatePlayer('${teamName}', ${idx}, 'firstName', this.value)"></div>
                     <div class="form-group"><label>Фамилия</label><input type="text" class="form-control" value="${p.lastName}" onchange="updatePlayer('${teamName}', ${idx}, 'lastName', this.value)"></div>
                </div>
                <div class="form-group"><label>Фото (URL)</label><input type="text" class="form-control" value="${p.photo}" onchange="updatePlayer('${teamName}', ${idx}, 'photo', this.value)"></div>
                
                <div style="margin-top: 10px; border-top: 1px solid #333; padding-top: 10px;">
                    <label style="font-size: 10px; color: #888;">🏅 Индивидуальные награды</label>
                    <div id="p-awards-list-${teamName}-${idx}">
                        ${playerAwardsHTML}
                    </div>
                    <button class="btn-add" style="padding: 5px; font-size: 11px; margin-top: 5px;" onclick="addPlayerAward('${teamName}', ${idx})">+ Награду игроку</button>
                </div>
            </div>
            `;
        }).join('');

        const teamHTML = `
        <div class="team-editor-item" id="block-${teamName}">
            <div class="team-editor-head" onclick="toggleTeam('${teamName}')">
                <div style="display:flex; align-items:center; gap:15px;">
                    <img src="${team.logo}" width="30" height="30" style="border-radius:50%; object-fit:cover;">
                    <strong style="font-size:16px;">${teamName}</strong>
                    <span style="font-size:10px; color:#888;">${currentStatus ? '(' + currentStatus + ')' : ''}</span>
                </div>
                <button class="btn-danger" onclick="deleteTeam('${teamName}', event)">Удалить</button>
            </div>
            <div class="team-editor-body" id="body-${teamName}" style="display:none;">
                
                <div class="row-2" style="margin-top:15px;">
                     <div class="form-group">
                        <label>Название (Ключ)</label>
                        <input type="text" value="${teamName}" disabled class="form-control" style="opacity:0.5">
                    </div>
                    <div class="form-group">
                        <label>Логотип (URL)</label>
                        <input type="text" class="form-control" value="${team.logo}" onchange="updateTeamStat('${teamName}', 'logo', this.value)">
                    </div>
                </div>

                <div class="form-group" style="margin-top:10px;">
                    <label style="color:var(--gold);">Статус команды</label>
                    <select class="form-control" onchange="updateTeamStat('${teamName}', 'status', this.value)">
                        <option value="" ${currentStatus === '' ? 'selected' : ''}>🟢 Активна (Играет)</option>
                        <option value="eliminated" ${currentStatus === 'eliminated' ? 'selected' : ''}>💀 Выбыла</option>
                        <option value="dq" ${currentStatus === 'dq' ? 'selected' : ''}>🚫 Дисквалификация</option>
                        <option value="winner" ${currentStatus === 'winner' ? 'selected' : ''}>🏆 Победитель турнира</option>
                    </select>
                </div>
                
                <div class="row-4" style="margin-top:10px;">
                    <div class="form-group">
                        <label style="color:var(--gold);">Очки (Points)</label>
                        <input type="number" class="form-control" value="${team.points}" onchange="updateTeamStat('${teamName}', 'points', Number(this.value))">
                    </div>
                    <div class="form-group" style="border: 1px solid #FFD700; border-radius: 8px; padding: 5px;">
                        <label style="color: #FFD700;">💰 Prize (G)</label>
                        <input type="number" class="form-control" value="${teamWinnings}" onchange="updateTeamStat('${teamName}', 'winnings', Number(this.value))">
                    </div>
                    <div class="form-group">
                        <label style="color:#4caf50;">Победы (Wins)</label>
                        <input type="number" class="form-control" value="${team.wins || 0}" onchange="updateTeamStat('${teamName}', 'wins', Number(this.value))">
                    </div>
                    <div class="form-group">
                        <label style="color:#f44336;">Поражения (Losses)</label>
                        <input type="number" class="form-control" value="${team.losses || 0}" onchange="updateTeamStat('${teamName}', 'losses', Number(this.value))">
                    </div>
                </div>

                <div style="background: rgba(255, 215, 0, 0.05); padding: 15px; border-radius: 10px; margin-top: 20px; border: 1px solid rgba(255, 215, 0, 0.2);">
                    <h4 style="margin: 0 0 10px; color:var(--gold);">🏆 Командные награды</h4>
                    <div id="awards-list-${teamName}">
                        ${team.awards.map((award, aIdx) => `
                            <div style="display: flex; gap: 10px; margin-bottom: 10px; align-items: flex-end;">
                                <div style="flex: 1;">
                                    <label style="font-size: 10px;">Название</label>
                                    <input type="text" class="form-control" value="${award.name}" placeholder="Название награды" onchange="updateAward('${teamName}', ${aIdx}, 'name', this.value)">
                                </div>
                                <div style="flex: 1;">
                                    <label style="font-size: 10px;">Картинка (URL)</label>
                                    <input type="text" class="form-control" value="${award.image}" placeholder="URL иконки" onchange="updateAward('${teamName}', ${aIdx}, 'image', this.value)">
                                </div>
                                <img src="${award.image}" style="width: 35px; height: 35px; object-fit: contain; background: #000; border: 1px solid #333; border-radius: 4px;">
                                <button class="btn-danger" style="padding: 10px;" onclick="deleteAward('${teamName}', ${aIdx})">X</button>
                            </div>
                        `).join('')}
                    </div>
                    <button class="btn-add" style="width: auto; font-size: 12px;" onclick="addAward('${teamName}')">+ Добавить награду команде</button>
                </div>

                <h4 style="margin: 20px 0 10px; color:var(--gold);">Игроки</h4>
                ${playersHTML}
            </div>
        </div>
        `;
        container.innerHTML += teamHTML;
    });
}

function toggleTeam(teamName) {
    const body = document.getElementById(`body-${teamName}`);
    if (body.style.display === 'none' || body.style.display === '') {
        body.style.display = 'block';
    } else {
        body.style.display = 'none';
    }
}

function updateTeamStat(teamName, key, value) {
    if (teamData[teamName]) {
        teamData[teamName][key] = value;
    }
}

function updatePlayer(teamName, playerIdx, field, value) {
    if(field === 'k' || field === 'd' || field === 'a') value = Number(value);
    
    teamData[teamName].players[playerIdx][field] = value;
    
    const p = teamData[teamName].players[playerIdx];
    if(p.d > 0) p.kd = (p.k / p.d).toFixed(2);
    else p.kd = p.k.toFixed(2);
}

function addNewTeam() {
    const name = prompt("Введите название новой команды:");
    if(name && !teamData[name]) {
        teamData[name] = {
            points: 0,
            winnings: 0, // <-- Добавлено
            wins: 0,
            losses: 0,
            logo: "https://via.placeholder.com/150",
            awards: [],
            status: "",
            players: [
                { nick: "Player 1", winnings: 0, kd: "0.00", k: 0, d: 0, a: 0, firstName: "", lastName: "", age: "", city: "", countryEmoji: "ru", photo: "", awards: [] },
                { nick: "Player 2", winnings: 0, kd: "0.00", k: 0, d: 0, a: 0, firstName: "", lastName: "", age: "", city: "", countryEmoji: "ru", photo: "", awards: [] }
            ]
        };
        initTeams();
        initMatches();
    } else if (teamData[name]) {
        alert("Команда с таким именем уже существует!");
    }
}

function deleteTeam(teamName, event) {
    event.stopPropagation();
    if(confirm(`Удалить команду ${teamName}?`)) {
        delete teamData[teamName];
        initTeams();
        initMatches();
    }
}

// --- MATCHES LOGIC ---
function initMatches() {
    const t1Select = document.getElementById('match-team1');
    const t2Select = document.getElementById('match-team2');
    const listContainer = document.getElementById('admin-matches-list');
    
    if(!t1Select || !listContainer) return;

    const teamOptions = Object.keys(teamData).map(name => `<option value="${name}">${name}</option>`).join('');
    t1Select.innerHTML = teamOptions;
    t2Select.innerHTML = teamOptions;

    listContainer.innerHTML = '';
    matchesData.forEach((m, idx) => {
        const div = document.createElement('div');
        div.className = 'team-editor-item'; 
        div.style.padding = '10px 20px';
        div.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="color: #fff;"><strong>${m.team1}</strong> vs <strong>${m.team2}</strong> — ${m.date}, ${m.time}</span>
                <button class="btn-danger" style="width:auto; padding:5px 15px;" onclick="deleteMatch(${idx})">Удалить</button>
            </div>
        `;
        listContainer.appendChild(div);
    });
}

function addNewMatch() {
    const team1 = document.getElementById('match-team1').value;
    const team2 = document.getElementById('match-team2').value;
    const date = document.getElementById('match-date').value;
    const time = document.getElementById('match-time').value;

    if(!date || !time) return alert("Заполните дату и время!");

    matchesData.push({ team1, team2, date, time });
    initMatches();
}

function deleteMatch(index) {
    matchesData.splice(index, 1);
    initMatches();
}

// --- EXPORT LOGIC ---
function downloadData() {
    saveMVPFromUI(); 

    const content = `/* Updated: ${new Date().toLocaleString()} */
const teamData = ${JSON.stringify(teamData, null, 4)};

const mvpData = ${JSON.stringify(mvpData, null, 4)};

let matchesData = ${JSON.stringify(matchesData, null, 4)};`;

    const modal = document.getElementById('codeModal');
    const area = document.getElementById('codeArea');
    
    if (modal && area) {
        area.value = content;
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('active'), 10);
        document.body.style.overflow = 'hidden';
    } else {
        alert("Ошибка: HTML модального окна не найден.");
    }
}

function closeCodeModal() {
    const modal = document.getElementById('codeModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 400);
    }
}

function copyCode() {
    const area = document.getElementById('codeArea');
    const btn = document.getElementById('copyBtn');
    if (!area || !btn) return;
    area.select();
    try {
        document.execCommand('copy');
        const oldText = btn.innerText;
        btn.innerText = '✅ СКОПИРОВАНО!';
        btn.style.background = '#4caf50';
        setTimeout(() => {
            btn.innerText = oldText;
            btn.style.background = '#FFD700';
        }, 2000);
    } catch (err) {
        alert('Ошибка копирования.');
    }
}

// --- ФУНКЦИИ ДЛЯ НАГРАД (AWARDS) ---

// Командные
function addAward(teamName) {
    if (!teamData[teamName].awards) teamData[teamName].awards = [];
    teamData[teamName].awards.push({
        name: "Название награды",
        image: "https://cdn-icons-png.flaticon.com/512/5906/5906056.png"
    });
    initTeams();
    const body = document.getElementById(`body-${teamName}`);
    if (body) body.style.display = 'block';
}

function updateAward(teamName, index, field, value) {
    if (teamData[teamName] && teamData[teamName].awards[index]) {
        teamData[teamName].awards[index][field] = value;
    }
}

function deleteAward(teamName, index) {
    if (confirm("Удалить эту награду?")) {
        teamData[teamName].awards.splice(index, 1);
        initTeams();
        const body = document.getElementById(`body-${teamName}`);
        if (body) body.style.display = 'block';
    }
}

// Индивидуальные (Игроки)
function addPlayerAward(teamName, playerIdx) {
    if (!teamData[teamName].players[playerIdx].awards) {
        teamData[teamName].players[playerIdx].awards = [];
    }
    teamData[teamName].players[playerIdx].awards.push({
        name: "Медаль",
        image: "https://cdn-icons-png.flaticon.com/512/808/808620.png"
    });
    initTeams();
    const body = document.getElementById(`body-${teamName}`);
    if (body) body.style.display = 'block';
}

function updatePlayerAward(teamName, playerIdx, awardIdx, field, value) {
    if (teamData[teamName] && 
        teamData[teamName].players[playerIdx] && 
        teamData[teamName].players[playerIdx].awards[awardIdx]) {
        
        teamData[teamName].players[playerIdx].awards[awardIdx][field] = value;
    }
}

function deletePlayerAward(teamName, playerIdx, awardIdx) {
    if (confirm("Удалить награду у игрока?")) {
        teamData[teamName].players[playerIdx].awards.splice(awardIdx, 1);
        initTeams();
        const body = document.getElementById(`body-${teamName}`);
        if (body) body.style.display = 'block';
    }
}