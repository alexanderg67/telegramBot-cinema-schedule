const {   Markup} = require('telegraf');
var daysOfWeek = ['Воскресение', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
function chooseDate() {
    let tomorrowDate= new Date(Date.now()+ 3600 * 24 * 1000)
    const tomorrowMonth=( tomorrowDate.getMonth()+1 <10 ) ? '0' + (tomorrowDate.getMonth()+1)  : tomorrowDate.getMonth()+1
    const tomorrowDay= (tomorrowDate.getDate() <10 ) ? '0'+ tomorrowDate.getDate(): tomorrowDate.getDate()
    tomorrowDate=    tomorrowDate.getFullYear()+ tomorrowMonth+ tomorrowDay
    
    let afterTomorrowDate= new Date(Date.now()+ 3600 * 24 * 2*  1000)
    const afterTomorrowDayOfWeek=daysOfWeek[afterTomorrowDate.getDay()]
    
    const afterTomorrowMonth=( afterTomorrowDate.getMonth()+1 <10 ) ? '0' + (afterTomorrowDate.getMonth()+1)  : afterTomorrowDate.getMonth()+1
    const afterTomorrowDay= (afterTomorrowDate.getDate() <10 ) ? '0'+ afterTomorrowDate.getDate(): afterTomorrowDate.getDate()
    afterTomorrowDate=    afterTomorrowDate.getFullYear()+ afterTomorrowMonth + afterTomorrowDay
      
    return Markup.inlineKeyboard([
    Markup.button.callback('Cегодня', 'today'),
    Markup.button.callback(`Завтра ${tomorrowDay}.${tomorrowMonth}`, 'date'+ tomorrowDate),
    Markup.button.callback(`${afterTomorrowDayOfWeek} ${afterTomorrowDay}.${afterTomorrowMonth}`, 'date'+ afterTomorrowDate),
])
}
const cities = Markup.keyboard([ ['Москва', 'Санкт-Петербург', 'Казань'],  ]).resize().oneTime()

function cinemaPointOptions(cinema){
    return   Markup.inlineKeyboard(
      cinema.map(c => [Markup.button.callback(c.name, 'cinema'+c.id)], )
       
      )
}
module.exports={ chooseDate,cities ,cinemaPointOptions}