import config from 'config'
import ServiceUpdateTelegram from "./ServiceUpdateTelegram.js"
import ServiceMessaging from "./ServiceMessaging.js"

class ServiceToDo {
    constructor(){
        this.token = config.get('token')
        this.serviceUpdateTelegram = new ServiceUpdateTelegram()
        this.serviceMessaging = new ServiceMessaging()
    }

    toDoGetUpdatesTelegram = async () => {
        try {
            const response = await this.serviceUpdateTelegram.getUpdatesTelegram()
            
            if (response.data !== 'undefined' && response.data.result.length > 0){
                let result = response.data.result
                for (let item of result){
                    if (item.hasOwnProperty("message")){
                        let el = item.message
                        if (el.chat.id !== 'undefined') {
                            await this.serviceMessaging.setChatId(el.chat.id)
                        }
                        if (el.hasOwnProperty("text")){
                            if (this.serviceMessaging.checkIncludeStopWords(el.text)){
                                await this.serviceMessaging.forwardMessage(el)
                                let is_deleted = await this.serviceMessaging.deleteMessage(el)
                                if (is_deleted){
                                    await this.serviceMessaging.sendChangedMessage(el)
                                }
                            }
                        }
                    }
                }
            }
        } catch (err) {
            // Handle Error Here
            console.error(err);
        }
    }
}

export default ServiceToDo