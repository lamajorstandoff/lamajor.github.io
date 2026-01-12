/* admin.js */
document.addEventListener('DOMContentLoaded', () => {
    initMVP();
    initTeams();
});

// --- MVP LOGIC ---
function initMVP() {
    // Заполняем поля текущими данными
    document.getElementById('mvp-nick').value = mvpData.nick;
    document.getElementById('mvp-fname').value = mvpData.firstName;
    document.getElementById('mvp-lname').value = mvpData.lastName;
    document.getElementById('mvp-age').value = mvpData.age;
    document.getElementById('mvp-city').value = mvpData.city;
    document.getElementById('mvp-country').value = mvpData.countryCode;
    document.getElementById('mvp-photo').value = mvpData.photo;
    document.getElementById('mvp-k').value = mvpData.k;
    document.getElementById('mvp-d').value = mvpData.d;
    document.getElementById('mvp-a').value = mvpData.a;

    // Заполняем селект команд для выбора логотипа
    const teamSelect = document.getElementById('mvp-team-select');
    Object.keys(teamData).forEach(name => {
        const opt = document.createElement('option');
        opt.value = name;
        opt.text = name;
        teamSelect.appendChild(opt);
    });
    
    // Пытаемся найти команду по текущему логотипу MVP
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
    
    // Логотип берем от выбранной команды
    const selectedTeam = document.getElementById('mvp-team-select').value;
    if(teamData[selectedTeam]) {
        mvpData.teamLogo = teamData[selectedTeam].logo;
    }
}

// --- TEAMS LOGIC ---
function initTeams() {
    const container = document.getElementById('teams-container');
    container.innerHTML = '';

    Object.keys(teamData).forEach(teamName => {
        const team = teamData[teamName];
const teamHTML = `
        <div class="team-editor-item" id="block-${teamName}">
            <div class="team-editor-head" onclick="toggleTeam('${teamName}')">
                <div style="display:flex; align-items:center; gap:15px;">
                    <img src="${team.logo}" width="30" height="30" style="border-radius:50%">
                    <strong style="font-size:16px;">${teamName}</strong>
                </div>
                <button class="btn-danger" onclick="deleteTeam('${teamName}', event)">Удалить</button>
            </div>
            <div class="team-editor-body" id="body-${teamName}">
                
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

                <div class="row-4" style="margin-top:10px;">
                    <div class="form-group">
                        <label style="color:var(--gold);">Очки (Points)</label>
                        <input type="number" class="form-control" value="${team.points}" onchange="updateTeamStat('${teamName}', 'points', Number(this.value))">
                    </div>
                    <div class="form-group">
                        <label style="color:#4caf50;">Победы (Wins)</label>
                        <input type="number" class="form-control" value="${team.wins || 0}" onchange="updateTeamStat('${teamName}', 'wins', Number(this.value))">
                    </div>
                    <div class="form-group">
                        <label style="color:#f44336;">Поражения (Losses)</label>
                        <input type="number" class="form-control" value="${team.losses || 0}" onchange="updateTeamStat('${teamName}', 'losses', Number(this.value))">
                    </div>
                    <div class="form-group">
                        <label>Матчи (Авто)</label>
                        <input type="text" class="form-control" value="${(team.wins || 0) + (team.losses || 0)}" disabled style="opacity:0.5">
                    </div>
                </div>

                <h4 style="margin: 20px 0 10px; color:var(--gold);">Игроки</h4>
                ${team.players.map((p, idx) => `
                    <div style="background:#1a1a1a; padding:15px; border-radius:10px; margin-bottom:10px;">
                        <div class="row-2">
                             <div class="form-group"><label>Nick</label><input type="text" class="form-control" value="${p.nick}" onchange="updatePlayer('${teamName}', ${idx}, 'nick', this.value)"></div>
                             <div class="form-group"><label>Age</label><input type="text" class="form-control" value="${p.age}" onchange="updatePlayer('${teamName}', ${idx}, 'age', this.value)"></div>
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
                    </div>
                `).join('')}
            </div>
        </div>
        `;
        container.innerHTML += teamHTML;
    });
}

function toggleTeam(name) {
    document.getElementById(`block-${name}`).classList.toggle('open');
}

// Удаление команды
function deleteTeam(name, event) {
    event.stopPropagation();
    if(confirm(`Удалить команду ${name}?`)) {
        delete teamData[name];
        initTeams(); // Перерисовать
    }
}

// Создание новой команды
function addNewTeam() {
    const name = prompt("Введите название новой команды:");
    if(name && !teamData[name]) {
        teamData[name] = {
            points: 0,
            wins: 0,    // Добавлено
            losses: 0,  // Добавлено
            logo: "https://via.placeholder.com/150",
            players: [
                { nick: "Player 1", kd: "0.00", k: 0, d: 0, a: 0, firstName: "", lastName: "", age: "", city: "", countryEmoji: "ru", photo: "" },
                { nick: "Player 2", kd: "0.00", k: 0, d: 0, a: 0, firstName: "", lastName: "", age: "", city: "", countryEmoji: "ru", photo: "" }
            ]
        };
        initTeams();
    } else if (teamData[name]) {
        alert("Команда с таким именем уже существует!");
    }
}
// Обновление простых полей команды
function updateTeamStat(teamName, field, value) {
    teamData[teamName][field] = value;
}

// Обновление игрока
function updatePlayer(teamName, playerIdx, field, value) {
    if(field === 'k' || field === 'd' || field === 'a') value = Number(value);
    
    teamData[teamName].players[playerIdx][field] = value;
    
    // Пересчет KD только для отображения в данных (визуально на сайте считает JS)
    // Но сохраним в файл для совместимости
    const p = teamData[teamName].players[playerIdx];
    if(p.d > 0) p.kd = (p.k / p.d).toFixed(2);
    else p.kd = p.k.toFixed(2);
}

// --- EXPORT LOGIC ---
function downloadData() {
    saveMVPFromUI(); // Сначала сохраняем MVP из полей в переменную

    const content = `/* Updated: ${new Date().toLocaleString()} */
const teamData = ${JSON.stringify(teamData, null, 4)};

const mvpData = ${JSON.stringify(mvpData, null, 4)};
`;

    const blob = new Blob([content], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert("Файл data.js скачан! Замените им старый файл в папке проекта.");
}