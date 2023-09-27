import config from 'config'
import ServiceUpdateTelegram from "./ServiceUpdateTelegram.js"
import ServiceMessaging from "./ServiceMessaging.js"
import ServiceChatPrivateType from ".//DefineServiceByChatType/ServicePrivateChatType/ServiceChatPrivateType.js"

class ServiceToDo {
    constructor(){
        this.token = config.get('token')
        this.serviceUpdateTelegram = new ServiceUpdateTelegram()
        // this.serviceMessaging = new ServiceMessaging()
    }

    toDoGetUpdatesTelegram = async () => {
        try {
            const response = await this.serviceUpdateTelegram.getUpdatesTelegram()
            
            if (response.data !== 'undefined' && response.data.result.length > 0){
                let result = response.data.result
                for (let item of result){
                    if (item.hasOwnProperty("message")){
                        this.toDoDefineServiceByTypeChat(item)
                        // if (el.chat.id !== 'undefined') {
                        //     // await this.serviceMessaging.setChatId(el.chat.id)
                            
                        // }

                        // if (el.hasOwnProperty("text")){
                        //     if (this.serviceMessaging.checkIncludeStopWords(el.text)){
                        //         await this.serviceMessaging.forwardMessage(el)
                        //         let is_deleted = await this.serviceMessaging.deleteMessage(el)
                        //         if (is_deleted){
                        //             await this.serviceMessaging.sendChangedMessage(el)
                        //         }
                        //     }
                        // }
                    }
                }
            }
        } catch (err) {
            // Handle Error Here
            console.error(err);
        }
    }

    toDoDefineServiceByTypeChat = (item) => {
        try {
            switch (item?.message?.chat?.type) {
                case 'private':
                  console.log('Private....');
                  let serviceChatPrivateType = new ServiceChatPrivateType(item);
                  serviceChatPrivateType.initServiceByTypeChat()
                  break;
                default:
                  console.error(`Nothing to do... `);
              }

        } catch (err) {
            // Handle Error Here
            console.error(err);
        }
    }
}

export default ServiceToDo