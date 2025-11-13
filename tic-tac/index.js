const boardRegions = document.querySelectorAll('#gameBoard span')
let vBoard = []
let turnPlayer = ''

function updateTitle() {
    const playerInput = document.getElementById(turnPlayer)
    document.getElementById('turnPlayer').innerText = playerInput.value
}

function initializeGame() {
    const player1Name = document.getElementById('player1').value.trim()
    const player2Name = document.getElementById('player2').value.trim()

    if (!player1Name || !player2Name) {
        alert('Necessário dois jogadores.')
        return
    }

    vBoard = [['', '', ''], ['', '', ''], ['', '', '']]
    turnPlayer = Math.random() < 0.5 ? 'player1' : 'player2' // sorteia quem inicia
    document.querySelector('h2').innerHTML = 'Vez de: <span id="turnPlayer"></span>'
    updateTitle()
    document.getElementById('gameBoard').classList.add('active')
    boardRegions.forEach(function (element){
        element.classList.remove('win') // limpar tabuleiro
        element.innerText = ''
        element.addEventListener('click', handleBoardClick)
    })
}

function getWinRegions() {
  const winRegions = []
  for (let i = 0; i < 3; i++) { // verificar linhas
    if (vBoard[i][0] && vBoard[i][0] === vBoard[i][1] && vBoard[i][0] === vBoard[i][2]) {
      winRegions.push(`${i}.0`, `${i}.1`, `${i}.2`)
    }
  }
  for (let i = 0; i < 3; i++) { // verificar colunas
    if (vBoard[0][i] && vBoard[0][i] === vBoard[1][i] && vBoard[0][i] === vBoard[2][i]) {
        winRegions.push(`0.${i}`, `1.${i}`, `2.${i}`)
    }
  }
    if (vBoard[0][0] && vBoard[0][0] === vBoard[1][1] && vBoard[0][0] === vBoard[2][2]) { // verificar diagonal \\
        winRegions.push('0.0', '1.1', '2.2')
  }
    if (vBoard[0][2] && vBoard[0][2] === vBoard[1][1] && vBoard[0][2] === vBoard[2][0]) { // verificar diagonal //
        winRegions.push('0.2', '1.1', '2.0')
  }
    return winRegions
}

function disableRegion(element){
    element.style.cursor = 'default'
    element.removeEventListener('click', handleBoardClick)
}

function handleBoardClick(ev){ //função para clicar no tabuleiro
    const span = ev.currentTarget
    const region = span.dataset.region // N.N
    const rowCollumnPair = region.split('.') // escolher elemento ["N", "N"]
    const row = rowCollumnPair[0]
    const collumn = rowCollumnPair[1]
    if (turnPlayer === 'player1'){
        span.innerText = 'X'
        vBoard[row][collumn] = 'X'
    } else {
        span.innerText = 'O'
        vBoard[row][collumn] = 'O'
    }
    console.clear()
    console.table(vBoard) // mostrar a informação como tabela
    disableRegion(span)
    const winRegions = getWinRegions()
    if (winRegions.length > 0) {
    winRegions.forEach(function(region) {
        document.querySelector(`[data-region="${region}"]`).classList.add('win')
    })
        // document.querySelector('h2').innerHTML = `${document.getElementById(turnPlayer).value} venceu!`

        const winnerName = document.getElementById(turnPlayer).value
        document.querySelector('h2').innerHTML = `${winnerName} venceu!`
        updateWinStats(turnPlayer)
        boardRegions.forEach(disableRegion)
        document.getElementById('gameBoard').classList.remove('active')
    } else if (vBoard.flat().every(cell => cell !== '')) { // verificação de empate
        document.querySelector('h2').innerHTML = 'Empate!'
        updateDrawStats()
        document.getElementById('gameBoard').classList.remove('active')
    } else {
        turnPlayer = turnPlayer === 'player1' ? 'player2' : 'player1'
        updateTitle()
    }
}

document.getElementById('start').addEventListener('click', initializeGame)

function getStats() {
    const defaultStats = {
        wins: {
            'Jogador um': 0,
            'Jogador dois': 0
        },
        draws: 0
    }
    const savedStatsString = localStorage.getItem('ticTacStats')
    if (!savedStatsString) {
        return defaultStats
    }
    const savedStats = JSON.parse(savedStatsString)
    const mergedStats = {
        ...defaultStats,
        ...savedStats,
        wins: {
            ...defaultStats.wins,
            ...(savedStats.wins || {})
        }
    }
    return mergedStats
}
function displayStats() {
    const stats = getStats()
    const statsList = document.getElementById('statsList')
    statsList.innerHTML = '' // limpar lista atual

    for (const playerName in stats.wins) {
        const count = stats.wins[playerName]
        const li = document.createElement('li')
        
        let text = ''
        if (count === 0) {
            text = '0'
        } else if (count === 1) {
            text = '1 vitória'
        } else {
            text = `${count} vitórias`
        }
        
        li.innerText = `${playerName}: ${text}`
        statsList.appendChild(li)
    }
    const drawCount = stats.draws
    const liDraw = document.createElement('li')

    let drawText = ''
    if (drawCount === 0) {
        drawText = '0'
    } else if (drawCount === 1) {
        drawText = '1 empate'
    } else {
        drawText = `${drawCount} empates`
    }

    liDraw.innerText = `Empates: ${drawText}`
    statsList.appendChild(liDraw)
}

function updateWinStats(playerIdentifier) {
    const stats = getStats()
    
    let statsName = ''
    if (playerIdentifier === 'player1') {
        statsName = 'Jogador um'
    } else {
        statsName = 'Jogador dois'
    }
    stats.wins[statsName] = (stats.wins[statsName] || 0) + 1
    
    localStorage.setItem('ticTacStats', JSON.stringify(stats))
    displayStats() // atualizar a exibição
}

function updateDrawStats() {
    const stats = getStats()
    stats.draws = (stats.draws || 0) + 1
    localStorage.setItem('ticTacStats', JSON.stringify(stats))
    displayStats()
}

displayStats()