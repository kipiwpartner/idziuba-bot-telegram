import config from 'config'
import axios from 'axios'
import Logging from "./logging.js";

class Messaging {
    constructor(){
        this.token = config.get('token');
        this.template = config.get('template');
        this.arr_stop_words = [];
        this.symbol_replace = config.get('symbol_replace');
        this.removed_ids = {}
        this.logging = new Logging()
        this.bot_chat_direct = config.get('bot_chat_direct');
    }

    sendChangedMessage = async (obj_message) => {
        try {
            this.logging.loggingSendChangedMessage(obj_message)
            let text = this.changeMessage(obj_message.text)
            let msg1 = this.template + "<b>" + obj_message.from.first_name + ' ' + obj_message.from.last_name + "</b>" + ': ' + obj_message.text;
            let msg2 = this.template + "<b>" + obj_message.from.first_name + ' ' + obj_message.from.last_name + "</b>" + ': ' + text;
            const send_bot = await axios.get(`https://api.telegram.org/bot${this.token}/sendMessage?chat_id=${this.bot_chat_direct}&text=${encodeURI(msg1)}&parse_mode=html`)
            const resp = await axios.get(`https://api.telegram.org/bot${this.token}/sendMessage?chat_id=${obj_message.chat.id}&text=${encodeURI(msg2)}&parse_mode=html`)
            return true
        } catch (err) {
            // Handle Error Here
            console.error(err);
            return false
        }
    }

    setChatId = (chat_id) => {
        if (typeof config.get('arr_stop_words')[chat_id] === 'undefined') {
            this.arr_stop_words = []
        } else {
            this.arr_stop_words = config.get('arr_stop_words')[chat_id]
        }
    }

    deleteMessage = async (obj_message) => {
        try {
            if (typeof this.removed_ids[obj_message.chat.id] === 'undefined') this.removed_ids[obj_message.chat.id] = []
            if (!this.removed_ids[obj_message.chat.id].includes(obj_message.message_id)){
                const resp = await axios.get(`https://api.telegram.org/bot${this.token}/deleteMessage?chat_id=${obj_message.chat.id}&message_id=${obj_message.message_id}`);
                this.removed_ids[obj_message.chat.id].push(obj_message.message_id)
                return true
            }
            return false
        } catch (err) {
            //Handle Error Here
            console.error(err);
            return false
        }
    }

    getUpdate = async (offset) => {
        try {
            //console.log("🚀 ~ file: messaging.js ~ Messaging ~ getUpdate ~ ofsfset = ", offset)
            const resp = await axios.get(`https://api.telegram.org/bot${this.token}/getUpdates?offset=${offset}`);
            return resp
        } catch (err) {
            // Handle Error Here
            console.error(err);
        }
    }

    checkIncludeStopWords = (msg) => {
        for (let stop_word of this.arr_stop_words){
            var rgxp = new RegExp(stop_word, "gmi");
            if(rgxp.test(msg)){
                return true
            }
        }
        return false
    }

    changeMessage = (msg) => {
        let txt = msg.toLowerCase()
        for (let stop_word of this.arr_stop_words){
            var rgxp = new RegExp(stop_word, "gmi");
            txt = txt.replace(rgxp, this.symbol_replace)
        }
        return  txt
    }

}

export default Messaging