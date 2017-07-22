new Vue({
  el: '#app',
  data: {
    turn: 'x',
    board: [
      'E', 'E', 'E',
      'E', 'E', 'E',
      'E', 'E', 'E'
    ],
    state: 'choose-player',
    playerTurn: null,
    player: null,
    computerTurn: null,
    textEnded: '',
    winningBlocks: []
  },
  methods: {
    choosePlayer(player) {
      this.player = player
      this.state = 'choose-side'
    },
    chooseSide(side) {
      this.turn = this.randomTurn()
      this.playerTurn = side
      if (this.player == 1) {
        this.computerTurn = side == 'x' ? 'o' : 'x'  
      }
      this.startGame()
    },
    randomTurn() {
      return Math.floor(Math.random()*2) == 0 ? 'o' : 'x'
    },
    move(index, side) {
      if (this.state != 'playing') {
        return
      }

      if (this.turn == this.computerTurn && side != this.computerTurn) return
      if (this.board[index] != 'E' ) {
        return
      }

      Vue.set(this.board, index, this.turn)
      this.checkState()
    },
    checkState() {
      const winningCombination = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], //row
        [0, 3, 6], [1, 4, 7], [2, 5, 8], //column
        [0, 4, 8], [2, 4, 6] //diagonal 
      ]
      const hasWinner = winningCombination.some((com) => {
        const str = this.board[com[0]] + this.board[com[1]] + this.board[com[2]]

        if (str === 'xxx' || str === 'ooo') {
          this.winningBlocks = com
          return true
        } else {
          return false
        }
      })
      
      if (hasWinner) {
        this.state = 'ended'
        this.textEnded = this.turn.toUpperCase() +' is winner'
      } else {
        hasDraw = this.board.indexOf('E') == -1
        if (hasDraw) {
          this.state = 'ended'
          this.textEnded = 'game is draw'
        }
      }
      
      if (this.state == 'ended') {
        setTimeout(() => {
          if (this.state == 'ended'){
            this.startGame()            
          }

        }
          , 2000)
        return
      }
      
      this.turn = this.turn == 'x' ? 'o' : 'x'
      
      if (this.player == 1 && (this.turn === this.computerTurn)) {
        setTimeout(this.computerMove, 1000)
      }
    },
    computerMove(){
      const emptyIndices = []
      this.board.forEach((value, index) => {
        if (value === 'E') emptyIndices.push(index)
      })
        const moveIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)]
        this.move(moveIndex, this.computerTurn)
    },
    getEmptyBoard() {
      return [
        'E', 'E', 'E',
        'E', 'E', 'E',
        'E', 'E', 'E'
      ]
    },
    exit() {
      this.state = 'choose-player'
      this.winningBlocks = []
      this.computerTurn = null
      this.board = this.getEmptyBoard()
    },
    startGame() {
      this.state = 'playing'
      this.winningBlocks = []
      this.board = this.getEmptyBoard()
      this.turn = this.randomTurn()
      if (this.turn === this.computerTurn) {
        this.computerMove()
      }
    }
  }
})