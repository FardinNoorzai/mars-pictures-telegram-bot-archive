require('dotenv').config({path: '../.env'});
const {Telegraf} = require('telegraf');
const {mongoose} = require('mongoose');
const {getPhotos} = require('./services/mongo_photos_service');
const {saveUser} = require('./services/user_service')
// Connect to MongoDB
mongoose.connect(process.env.MONGO_DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function() {
  console.log('Connected to MongoDB');
});
const bot = new Telegraf(process.env.BOT_TOKEN);

const regex = /^\d{4}-(0?[1-9]|1[0-2])-(0?[1-9]|[12]\d|3[01])$/;

bot.command('start', (ctx)=>{
  const messageId = ctx.message.message_id;
  console.log(messageId)
  saveUser(ctx.from);
  ctx.replyWithMarkdownV2(`${ctx.from.first_name} welcome to our bot 😊🥰\nyou can send me a date in this format YYYY-MM-DD and i will send you all the pictures which was taken by Curiosity rover on that specific date 😁😁`,
    {
      reply_to_message_id: messageId,
    }
  )
})




bot.on('text', async (ctx) => {
  const messageId = ctx.message.message_id;
  const date = ctx.message.text;
  if(!regex.test(date)){
    ctx.reply('Please enter a valid date in the format YYYY-MM-DD. 🥴🥴',{
      reply_to_message_id: messageId,
    });
    return;
  }
  const photo = await getPhotos(date, 0);
  if (photo) {
    const inlineKeyboard = [
      [
        { text: `Next photo on ${photo.earth_date}`, callback_data: `${date}:1` },
      ]
    ];
    ctx.replyWithMarkdownV2(`*Rover name:* ${escapeMarkdownV2(photo.rover.name)}\n` +
  `*Day ${escapeMarkdownV2(photo.sol.toString())}* of being on Mars\n` +
  `*Camera:* ${escapeMarkdownV2(photo.camera.full_name)}\n` +
  `[Click here to view image](${escapeMarkdownV2(photo.img_src)})`
 ,
      {
      reply_to_message_id: messageId,
        parse_mode: 'MarkdownV2',
        reply_markup: {
          inline_keyboard: inlineKeyboard
        }
      });

  } else {
    ctx.replyWithMarkdownV2("No photo was taken on the this date. 🥺🥺",{
      reply_to_message_id: messageId,

    });
  }
});

bot.on('callback_query', async (ctx) => {
  ctx.answerCbQuery();
  const [date, record] = ctx.callbackQuery.data.split(':');
  const photo = await getPhotos(date, record);
  if (photo) {
    const next = Number(record) + 1;
    const inlineKeyboard = [
      [
        { text: `Next photo on ${photo.earth_date}`, callback_data: `${date}:${next}` },
      ]
    ];
    ctx.replyWithMarkdownV2(`*Rover name:* ${escapeMarkdownV2(photo.rover.name)}\n` +
  `*Day ${escapeMarkdownV2(photo.sol.toString())}* of being on Mars\n` +
  `*Camera:* ${escapeMarkdownV2(photo.camera.full_name)}\n` +
  `[Click here to view image](${escapeMarkdownV2(photo.img_src)})`
 ,
      {
        parse_mode: 'MarkdownV2',
        reply_markup: {
          inline_keyboard: inlineKeyboard
        }
      });
  } else {
    ctx.replyWithMarkdownV2("No more photos on this day!\nTry another date. 😁😁");
  }
})




bot.launch();

const escapeMarkdownV2 = (text) => {
  const reservedChars = ['_', '*', '[', ']', '(', ')', '~', '`', '>', '#', '+', '-', '=', '|', '{', '}', '.', '!'];
  return text.replace(new RegExp(`[${reservedChars.map(c => '\\' + c).join('')}]`, 'g'), '\\$&');
};