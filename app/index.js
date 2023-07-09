import ServiceToDo from "./service/ServiceToDo.js"
import mongoose from "mongoose"
import dotenv from 'dotenv'
dotenv.config({path : './config.env'})

const bot_fn = () => {

    const serviceToDo = new ServiceToDo()

    let bot = {
        pingTelegram: async function(){ 
            try {
                await serviceToDo.toDoGetUpdatesTelegram()
            } catch(e){
                console.log('Bot Error', e.message)
            }
        },
        start_bot: async function(){
            try {
                console.log('IvanDziubaBot is starting...')
                await mongoose.connect(process.env.DATABASE_URI, {})
                while (true) {
                    await this.pingTelegram()
                }
            }
            catch (e){
                console.log('Bot Error', e.message)
            }
        }
    }
    return bot
}

let bot = bot_fn()

export default bot