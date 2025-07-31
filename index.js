const { Telegraf , Markup,session} = require('telegraf');
require('dotenv').config();
const kinoService=require('./services/kinoafisha')
const keyboards=require('./helpers/keyboards')
const config=require('./config.json')
 
const bot = new Telegraf(process.env.TG_TOKEN);
let cinemaPoints
bot.use( session() )
bot.use(require('./composers/dateHandlers')) // composer for inline keyboard,  step choose date

bot.use(async (ctx,next) => {
    ctx.session ??= { counter: 0 } //если не существует session обьект, то создаем
    next()
})
bot.start( async (ctx) => {
    try{
    await ctx.reply('📌 Выберите город, в котором ищете киносеансы', keyboards.cities )

     } catch(err) {
     console.log(err) }
})
bot.help( async (ctx) => {
    try{
     await ctx.reply('👨‍💻  Бот отобразит сеансы кино по нужному кинотеатру на дату с указанием цен. \n 🚀 Выберите город, в котором нужны киносеансы', keyboards.cities )
     
    } catch(err) {
     console.log(err) }
})
bot.hears(['Москва','Санкт-Петербург', 'Казань'],async (ctx) => {
    try{

    const r = await kinoService.getCinemaPoints(ctx.message.text)
    cinemaPoints=r
    if(cinemaPoints.length <1) {
    return await ctx.reply('Произошла ошибка. Попробуйте позже')
    }
    await ctx.reply('📌 Введите название кинотеатра полностью или частично')
     } catch(err) {
     console.log(err)
     await ctx.reply('Произошла ошибка. Попробуйте позже') }
})
//--------------
bot.on('text',async (ctx) => { 
    try{
    if(!cinemaPoints)
     return await ctx.reply('📌 Выберите город, в котором нужны киносеансы', keyboards.cities )

    const word=ctx.message.text.trim().toLowerCase() 
    const r = cinemaPoints.filter( item=> item.name.toLowerCase().includes(word))
     
    if( r.length== 0) {
     return await ctx.reply('Таких названий не найдено')     
    } else if( r.length== 1){
    ctx.session.cinemaPoint=r[0]
    return await ctx.reply('Выберите дату:',keyboards.chooseDate())
    }else{
    
    await ctx.reply('📌 Выберите нужный кинотеатр:',keyboards.cinemaPointOptions(r))
    }
    } catch(err) {
        console.log(err)
        await ctx.reply('Произошла ошибка. Попробуйте позже')
    }        
    
})
 
bot.action (/^cinema(\d+)$/ ,async (ctx)=> {
    try {
     const cinemaPointId=ctx.match[1]
     await ctx.deleteMessage();
    const cinemaPoint = cinemaPoints.find( item=> item.id==cinemaPointId)
    ctx.session.cinemaPoint=cinemaPoint
    await ctx.reply('Выберите дату:', keyboards.chooseDate() )

    } catch(err) {
console.log(err)
await ctx.reply('Произошла ошибка. Попробуйте позже') }
})


bot.launch().then(() => console.log('Started'));
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));