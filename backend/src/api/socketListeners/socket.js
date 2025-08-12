import { GameDataBackend } from '../utils/GameDataBackend.js'
import { Server as SocketIo } from 'socket.io'

export const createSocket = (server) => {
    const io = new SocketIo(server, {
        cors: {
            origin: "*",
            methods: ["GET","POST"],
            transports: ['websocket', 'polling'],
            credentials: true
        },
        allowEIO3: true
    })
    
    let gameRooms = []
    
    io.on('connection', (socket) => {
    
        //shows the messages in the two players concurrently that communicates with chat
        socket.on("chatShowMessages", (messages,data) => {
    
            for (const room of gameRooms) {
                const index = room.players.findIndex((playerInfo) => {
                    return playerInfo.username === data.sender
                })
                if (index !== -1) {
                    io.to(room.players[0].player).emit("setMessages", messages,data)
                    io.to(room.players[1].player).emit("setMessages", messages,data)
                }
            }
        })
    
        //finds the opponent for history
        socket.on("findOpponent", (roomIndex) => {
    
            io.to(gameRooms[roomIndex].players[0].player).emit("setOpponent", gameRooms[roomIndex].players[1].username)
            io.to(gameRooms[roomIndex].players[1].player).emit("setOpponent", gameRooms[roomIndex].players[0].username)
        })
    
        //handles the time when is over to see who wins
        socket.on("timeIsOver", (roomIndex,turn) => {
    
            let socketId1,socketId2
            if(roomIndex!==null&&roomIndex!==-1&&gameRooms[roomIndex].players.length===2) {
                socketId1 = gameRooms[roomIndex].players[0].player
                socketId2 = gameRooms[roomIndex].players[1].player
                if(socketId1===turn||(turn===null)) {
                    io.to(socketId1).emit("timeState", "lost")
                    io.to(socketId2).emit("timeState", "won")
                }
                else {
                    io.to(socketId1).emit("timeState", "won")
                    io.to(socketId2).emit("timeState", "lost")
                }
            }
        })
    
        //synchronizing the circle countdown timer with a player's turn
        socket.on("checkTime", (roomIndex,playerTurn) => {
            
            let socketId1, socketId2, socketInfo1, socketInfo2
            if(roomIndex!==null&&roomIndex!==-1&&gameRooms[roomIndex]!==undefined&&gameRooms[roomIndex].players.length>1) {
                socketId1 = gameRooms[roomIndex].players[0].player
            }
            else {
                return
            }
            
            if(gameRooms[roomIndex].players.length===1) {
                io.to(socketId1).emit("updatePlaying", {playingP1:false,playingP2:false})
            }
            else {
                socketInfo1=gameRooms[roomIndex].players[0]
                socketInfo2=gameRooms[roomIndex].players[1]
                socketId2 = socketInfo2.player
                if(playerTurn===null) {
                    if(socketInfo1.firstPlayer) {
                        io.to(socketId1).emit("updatePlaying", {playingP1:true,playingP2:false})
                        io.to(socketId2).emit("updatePlaying", {playingP1:true,playingP2:false})
                    }
                    else {
                        io.to(socketId1).emit("updatePlaying", {playingP1:false,playingP2:true})
                        io.to(socketId2).emit("updatePlaying", {playingP1:false,playingP2:true})
                    }
                }
                else {
                    if(playerTurn===socketId1) {
                        io.to(socketId1).emit("updatePlaying", {playingP1:true,playingP2:false})
                        io.to(socketId2).emit("updatePlaying", {playingP1:true,playingP2:false})
                    }
                    else {
                        io.to(socketId1).emit("updatePlaying", {playingP1:false,playingP2:true})
                        io.to(socketId2).emit("updatePlaying", {playingP1:false,playingP2:true})
                    }
                }
            }
        })
    
        //makes a move and checks if there is a winner
        socket.on("makeMove", (data) => {
    
            if(data.player===null||data.player===socket.id) {
                let check=0, winner=false
                let roomIndex = data.room
                let column = data.column
                let boardState = new GameDataBackend(data.board)
                let socketId1 = gameRooms[roomIndex].players[0].player
                let socketId2 = gameRooms[roomIndex].players[1].player
                let playerMove, playerTurn, playerTurnUsername, row
    
                if(gameRooms[roomIndex].players[0].player===socket.id) {
                    playerMove = gameRooms[roomIndex].players[0]
                    playerTurn = gameRooms[roomIndex].players[1].player
                    playerTurnUsername = gameRooms[roomIndex].players[1].username
                    check=1
                }
                else if(gameRooms[roomIndex].players[1].player===socket.id) {
                    playerMove = gameRooms[roomIndex].players[1]
                    playerTurn = gameRooms[roomIndex].players[0].player
                    playerTurnUsername = gameRooms[roomIndex].players[0].username
                    check=2
                }
                
                if(boardState.checkBoardIsInitialState()) {
                    if(playerMove.firstPlayer) {
                        row=boardState.addMultiplayer(playerMove.color,column)
                    }
                }
                else {
                    row=boardState.addMultiplayer(playerMove.color,column)
                }
    
                let score = boardState.evaluateMove(boardState.gameArray,playerMove.color)
                if(score===10000) {
                    winner = true
                }
    
                if(winner&&check===1) {
                    io.to(socketId1).emit("updateBoard",boardState.gameArray,playerTurn,playerTurnUsername,row,column,playerMove.color,"won")
                    io.to(socketId2).emit("updateBoard",boardState.gameArray,playerTurn,playerTurnUsername,row,column,playerMove.color,"lost")
                }
                else if(winner&&check===2) {
                    io.to(socketId1).emit("updateBoard",boardState.gameArray,playerTurn,playerTurnUsername,row,column,playerMove.color,"lost")
                    io.to(socketId2).emit("updateBoard",boardState.gameArray,playerTurn,playerTurnUsername,row,column,playerMove.color,"won")
                } else if(!boardState.checkColumnFree()) {
                    io.to(socketId1).emit("updateBoard",boardState.gameArray,playerTurn,playerTurnUsername,row,column,playerMove.color,"draw")
                    io.to(socketId2).emit("updateBoard",boardState.gameArray,playerTurn,playerTurnUsername,row,column,playerMove.color,"draw")
                } else {
                    io.to(socketId1).emit("updateBoard",boardState.gameArray,playerTurn,playerTurnUsername,row,column,playerMove.color,null)
                    io.to(socketId2).emit("updateBoard",boardState.gameArray,playerTurn,playerTurnUsername,row,column,playerMove.color,null)
                }
            }
        })
    
        //handles the answer no in play again question
        socket.on("noPlayAgain", (roomIndex) => {
    
            if(gameRooms[roomIndex].players[0].player===socket.id) {
                io.to(gameRooms[roomIndex].players[1].player).emit("noIsAnswer")
            }
            else {
                io.to(gameRooms[roomIndex].players[0].player).emit("noIsAnswer")
            }
        })
    
        //handles the answer yes in play again question
        socket.on("yesPlayAgain",(roomIndex) => {
    
            io.to(gameRooms[roomIndex].players[0].player).emit("clearData")
            io.to(gameRooms[roomIndex].players[1].player).emit("clearData")
        })
    
        //handles generally the play again question
        socket.on("playAgain", (username) => {
            
            for (const room of gameRooms) {
                const index = room.players.findIndex((playerInfo) => {
                    return playerInfo.username === username
                })
                if (index !== -1) {
     
                    if(room.players[0].player===socket.id) {
                        io.to(socket.id).emit("doYouWantToPlayAgain",null)
                        io.to(room.players[1].player).emit("doYouWantToPlayAgain","Do you want to play again with the same opponent?")
                    }
                    else {
                        io.to(socket.id).emit("doYouWantToPlayAgain",null)
                        io.to(room.players[0].player).emit("doYouWantToPlayAgain","Do you want to play again with the same opponent?")
                    }
                    break
                }
            }
        })
    
        //handles the play when the player clicks to "play" button
        socket.on("play", (username) => {
    
            let availableRoom = gameRooms.find((room) => {
                return room.players.length < 2
            })
    
            let userAlreadyExists = gameRooms.some((room) => {
                return room.players.some((player) => {
                    return player.username === username
                })
            })
            
            if (!availableRoom&&!userAlreadyExists) {
        
                availableRoom = { players: [] }
                gameRooms.push(availableRoom)
                let availableRoomIndex = gameRooms.indexOf(availableRoom)
                availableRoom.players.push({ player: socket.id, color: 'red', username: username, firstPlayer: true})
                socket.emit("updateJoin",{color: 'red', username: username, firstPlayer: true, room: availableRoomIndex})
            }
            else if(!userAlreadyExists) {
                if(availableRoom.players[0].username!==username) {
                    if(availableRoom.players[0].color==="yellow") {
                        availableRoom.players.push({ player: socket.id, color: 'red', username: username, firstPlayer: false})
                    }
                    else if(availableRoom.players[0].color==="red") {
                        availableRoom.players.push({ player: socket.id, color: 'yellow', username: username, firstPlayer: false})
                    }
                }
                if(availableRoom) {
                    availableRoom.players[0].firstPlayer=true
                }
            }
            
            if (!userAlreadyExists&&availableRoom&&availableRoom.players.length === 2) {
                let availableRoomIndex = gameRooms.indexOf(availableRoom)
                let room = availableRoom.players
                let p1 = {username: room[0].username,color: room[0].color, firstPlayer: room[0].firstPlayer, room: availableRoomIndex}
                let p2 = {username: room[1].username,color: room[1].color, firstPlayer: room[1].firstPlayer, room: availableRoomIndex}
                for(let i=0; i<2; i++) {
                    io.to(availableRoom.players[i].player).emit("gameRoomFulled", {p1:p1,p2:p2})
                }
            }
        })
    
        //updates the socket in the room if the client makes a refresh
        socket.on("updateSocket",(username,playerTurnUsername) => {
            for (const room of gameRooms) {
                const index = room.players.findIndex((playerInfo) => {
                    return playerInfo.username === username
                })
                if(index!==-1) {
                    room.players[index].player=socket.id
                    if(room.players.length===2&&playerTurnUsername!==null) {
                        if(playerTurnUsername===username) {
                            io.to(socket.id).emit("updatePlayerTurn",socket.id)
                            if(index===0) {
                                io.to(room.players[1].player).emit("updatePlayerTurn",socket.id)
                            }
                            else {
                                io.to(room.players[0].player).emit("updatePlayerTurn",socket.id)
                            }
                        }
                        else {
                            if(index===0) {
                                io.to(socket.id).emit("updatePlayerTurn",room.players[1].player)
                                io.to(room.players[1].player).emit("updatePlayerTurn",room.players[1].player)
                            }
                            else {
                                io.to(socket.id).emit("updatePlayerTurn",room.players[0].player)
                                io.to(room.players[0].player).emit("updatePlayerTurn",room.players[0].player)
                            }
                        }
                    }
                    break
                }
            }
        })
        
        socket.on("disconnect", () => {})
    
        //handles the quit when the player clicks to "quit" button
        socket.on("quit", (username) => {
            let i=0
            let socketId1, socketId2
            for (const room of gameRooms) {
                const index = room.players.findIndex((playerInfo) => {
                    if(username!==null) {
                        return playerInfo.username === username
                    }
                    else {
                        return playerInfo.player === socket.id
                    }
                })
                if (index !== -1) {
                    if(room.players.length===2) {
                        socketId1 = room.players[0].player
                        socketId2 = room.players[1].player
                    }
                    room.players.splice(index, 1)
                    if(room.players.length===0) {
                        gameRooms.splice(i,1)
                        socket.emit("quitUpdate",0,username)
                    }
                    else {
                        let p1 = {username: room.players[0].username,color: room.players[0].color, firstPlayer: room.players[0].firstPlayer} 
                        io.to(socketId1).emit("quitUpdate",{p1:p1},username)
                        io.to(socketId2).emit("quitUpdate",{p1:p1},username)
                    }
                    break
                }
                i++
            }
        })
    })
}