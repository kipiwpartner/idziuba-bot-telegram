import config from 'config'
import axios from 'axios'
import Logging from "./logging.js"
import Stopwords from "../models/stopwords.js"
import dotenv from 'dotenv'
dotenv.config({path : './config.env'})

class Messaging {
    constructor(){
        this.token = config.get('token');
        this.template = config.get('template');
        this.arr_stop_words = [];
        this.symbol_replace = config.get('symbol_replace');
        this.removed_ids = {}
        this.logging = new Logging()
        this.chat_id_direct = config.get('chat_id_direct');
    }

    setChatId = async (chat_id) => {
        try {
            let searchQuery = { chat_id : chat_id }
            let grp = await Stopwords.findOne(searchQuery)
            if (grp) {
                this.arr_stop_words = grp.stopwords
            } else {
                this.arr_stop_words = []
            }
            return true
        } catch (err) {
            // Handle Error Here
            this.arr_stop_words = []
            console.error(err);
            return false
        }
    }

    sendMessageHtml = async (msg_html, chat_id) => {
        return axios.get(`https://api.telegram.org/bot${this.token}/sendMessage?chat_id=${chat_id}&text=${encodeURI(msg_html)}&parse_mode=html`)
    }

    sendChangedMessage = async (obj_message) => {
        try {
            this.logging.loggingSendChangedMessage(obj_message)
            let text = this.changeMessage(obj_message.text)
            let msg_html = this.template + "<b>" + obj_message.from.first_name + ' ' + obj_message.from.last_name + "</b>" + ': ' + text;
            await this.sendMessageHtml(msg_html, obj_message.chat.id)
            return true
        } catch (err) {
            // Handle Error Here
            console.error(err);
            return false
        }
    }

    forwardMessage = async (obj_message) => {
        let msg_html = "Группа: " + "<b>" + obj_message.chat.title + "</b>";
        await this.sendMessageHtml(msg_html, this.chat_id_direct)
        await axios.get(`https://api.telegram.org/bot${this.token}/forwardMessage?chat_id=${this.chat_id_direct}&from_chat_id=${obj_message.chat.id}&message_id=${obj_message.message_id}`)
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