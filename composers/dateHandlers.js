const { Composer, Markup } = require('telegraf')
const composer = new Composer()
const kinoService=require('../services/kinoafisha')

composer.action ('today',async (ctx)=> {
try {

const result= await kinoService.getMovieSessions(ctx.session.cinemaPoint.id, 'today')
const todayStr=new Date().toLocaleString("ru",  { month: 'long', day: 'numeric'})
let response=`🏠 Кинотеатр: ${ctx.session.cinemaPoint.name} \n ⏱️ Расписание на сегодня ${todayStr}: \n`
result.forEach( item=> {
    let sessions=''
    for( let i=0;i<item.sessions.length;i++){
       const str=item.sessions[i].split('_')
       if(str[1])
        sessions+=`${str[0]} (${str[1]}Р), `
       else
        sessions+=`${str[0]}, `

    }
    sessions=sessions.trim().slice(0, sessions.length-2)
    response+=`Фильм: <b>${item.name}</b>     ⏱️Время ${sessions} \n`
})
await ctx.replyWithHTML(response)
 } catch(err) {
     console.log(err)
     await ctx.reply('Произошла ошибка. Попробуйте позже')
 }        
} ) 

composer.action (/^date(\d+)$/ ,async (ctx)=> {
try {
const date=ctx.match[1]
const dayMonthStr= date.slice(6) + '.' +date.slice(4,6)
const result= await kinoService.getMovieSessions(ctx.session.cinemaPoint.id, date)
 
let response=`🏠 Кинотеатр: ${ctx.session.cinemaPoint.name} \n ⏱️ Расписание на ${dayMonthStr}: \n`
result.forEach( item=> {
    let sessions=''
    for( let i=0;i<item.sessions.length;i++){
       const str=item.sessions[i].split('_')
       if(str[1])
        sessions+=`${str[0]} (${str[1]}Р), `
       else
        sessions+=`${str[0]}, `

    }
    
    sessions=sessions.trim().slice(0, sessions.length-2)
    response+=`Фильм: <b>${item.name}</b>     ⏱️Время ${sessions} \n`
})
await ctx.replyWithHTML(response)

 } catch(err) {
     console.log(err)
     await ctx.reply('Произошла ошибка. Попробуйте позже')
 }        
})


module.exports = composer