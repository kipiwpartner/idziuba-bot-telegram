import init from './service/init.js'
import Messaging from "./service/messaging.js";

const bot_fn = () => {
    var messaging = new Messaging()
    var offset = init.update_id
    var recall = false

    let bot ={
        pingTelegram: async function(){ 
            try {
                let response = await messaging.getUpdate(offset)
                if (response.data.result !== 'undefined'){
                    let resp = response.data.result
                    for (let item of resp){
                        switch (true){
                            case item.update_id > offset:
                                if (item.hasOwnProperty("message")){
                                    let el = item.message
                                    if (el.chat.id !== 'undefined') messaging.setChatId(el.chat.id)
                                    if (el.hasOwnProperty("text")){
                                        if (messaging.checkIncludeStopWords(el.text)){
                                            let is_deleted = await messaging.deleteMessage(el)
                                            if (is_deleted){
                                                await messaging.sendChangedMessage(el)
                                            }
                                        }
                                    }
                                }
                                offset = item.update_id
                            break
                        }
                    }
                }
                recall = true
            } catch(e){
                console.log('Bot Error', e.message)
            }
        },
        start_bot: async function(){
            console.log('bot is starting...')
            try {
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