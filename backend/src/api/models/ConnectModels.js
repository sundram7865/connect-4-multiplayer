import { UserModel as User } from './UserModel.js'
import { SessionModel as Session} from './SessionModel.js'
import { GameDataModel as GameData } from './AiGameDataModel.js'
import { AiGameModel as AiGame } from './AiGameModel.js'
import { MultiplayerGameModel as MultiplayerGame } from './MultiGameModel.js'
import { GameDataMModel as GameDataM } from './MultiGameDataModel.js'
import sequelize from '../../config/DatabaseConfig.js'

//connections betweeen the table of the database
//1:N
User.hasMany(MultiplayerGame)
MultiplayerGame.belongsTo(User)
//1:N
User.hasMany(AiGame)
AiGame.belongsTo(User)
//1:1
Session.hasOne(GameData)
GameData.belongsTo(Session)
//1:1
Session.hasOne(GameDataM)
GameDataM.belongsTo(Session)

await sequelize.sync({ alter: true })

export { User, Session, AiGame, GameData, MultiplayerGame, GameDataM }