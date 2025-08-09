import { UserModel as User } from './UserModel.js';
import { SessionModel as Session } from './SessionModel.js';
import { BotGameDataModel as BotGameData } from './BotGameDataModel.js';
import { BotGameModel as BotGame } from './BotGameModel.js';
import { MultiplayerGameModel as MultiplayerGame } from './MultiGameModel.js';
import { MultiplayerGameDataModel as MultiplayerGameData } from './MultiGameDataModel.js';
import sequelize from '../config/DatabaseConfig.js';

// User Relationships
User.hasMany(MultiplayerGame, {
  foreignKey: 'player1',
  as: 'hostedGames'
});
User.hasMany(MultiplayerGame, {
  foreignKey: 'player2',
  as: 'joinedGames'
});
MultiplayerGame.belongsTo(User, { foreignKey: 'player1' });
MultiplayerGame.belongsTo(User, { foreignKey: 'player2' });

User.hasMany(BotGame, {
  foreignKey: 'playerUsername',
  as: 'botGames'
});
BotGame.belongsTo(User, { 
  foreignKey: 'playerUsername',
  targetKey: 'username'
});

// Session Relationships
Session.hasOne(BotGameData, {
  foreignKey: 'sessionId',
  onDelete: 'CASCADE'
});
BotGameData.belongsTo(Session);

Session.hasOne(MultiplayerGameData, {
  foreignKey: 'sessionId',
  onDelete: 'CASCADE'
});
MultiplayerGameData.belongsTo(Session);

// Game State Relationships
MultiplayerGame.hasOne(MultiplayerGameData, {
  foreignKey: 'gameId',
  onDelete: 'CASCADE'
});
MultiplayerGameData.belongsTo(MultiplayerGame);

BotGame.hasOne(BotGameData, {
  foreignKey: 'gameId',
  onDelete: 'CASCADE'
});
BotGameData.belongsTo(BotGame);

await sequelize.sync({ alter: true });

export { 
  User, 
  Session, 
  BotGame, 
  BotGameData, 
  MultiplayerGame, 
  MultiplayerGameData 
};