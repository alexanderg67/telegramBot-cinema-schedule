const { default: axios } = require('axios');
const cheerio = require('cheerio');
const config=require('../config.json')
 
  

    const getCinemaPoints = async (city ) => {
      try{
    const url=config.citiesUrl[city]
    const response = await axios.get(url)
    const $ = cheerio.load(response.data);
    let cinemaPoints=[]
     $('div .cinemaList_item').each(function () {
        const name=$(this).find( $('.cinemaList_name')).text()
        const cinemaUrl=$(this).find( $('.cinemaList_ref')).prop('href')
        const startIndex=cinemaUrl.indexOf('cinema/')
        const cinemaPointId=parseInt( cinemaUrl.slice(startIndex+7) ) 
         
        cinemaPoints.push( { name, id: cinemaPointId})
     })
     return cinemaPoints
   } catch(err) {
    console.log(err.name) }
    }

    

    const getMovieSessions = async (cinemaPointId, fulldate ) => {
      let parseUrl
      console.log('getMovieSessions , passed arg:',cinemaPointId,fulldate)
      try{
      if( fulldate==='today'){
      parseUrl='https://msk.kinoafisha.info/cinema/'+ cinemaPointId+ '/schedule/'
      }else{
      parseUrl='https://msk.kinoafisha.info/cinema/'+ cinemaPointId+ '/schedule/?date='+fulldate
      }
 
let movies=[]
const response = await axios.get(parseUrl)
const $ = cheerio.load(response.data);
    


 $('div .showtimes_item').each(function () {
const movieInfo={}
movieInfo.sessions=[]

movieInfo.name=$(this).find( $('.showtimesMovie_name')).text()
movieInfo.details=$(this).find( $('.showtimesMovie_details')).text()
movieInfo.genre=$(this).find( $('.showtimesMovie_categories')).text()
movieInfo.format=$(this).find( $('.showtimes_format')).text()


if(movieInfo.name){
     
 
 $(this).find( $('.showtimes_session')).each(function () {
 let price=$(this).find( $('.session_price')).text()
 price=price.replace(/[от₽ ]/g, '')
 const session=$(this).find( $('.session_time')).text() + '_'+price
 movieInfo.sessions.push(  session  )
 })

movies.push( movieInfo)
}

 })
    
    return movies
    } catch(err) {
 console.log(err.name) }
 }
    

    module.exports= { getCinemaPoints, getMovieSessions}