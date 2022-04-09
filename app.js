import bot from './app/index.js'

try {
    bot.start_bot()
} catch(e){
    console.log('Server Error', e.message)
}