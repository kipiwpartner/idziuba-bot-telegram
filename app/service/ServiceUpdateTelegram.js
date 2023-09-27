import config from 'config'
import axios from 'axios'

class ServiceUpdateTelegram {
    constructor(){
        this.token = config.get('token')
    }

    getUpdatesTelegram = async () => {
        try {
            let resp = await axios.get(`https://api.telegram.org/bot${this.token}/getUpdates`)
            let offset = null
            //Offset data
            if (resp.data.result.length > 0) {
                offset = resp.data.result[resp.data.result.length-1].update_id
                resp = await this.getUpdateTelegram(offset);
            }
            return {
                "data": resp.data,
                "offset" : offset
            }
        } catch (err) {
            // Handle Error Here
            console.error(err);
        }
    }

    getUpdateTelegram = async (offset) => {
        try {
            const resp = await axios.get(`https://api.telegram.org/bot${this.token}/getUpdates?offset=${offset}`);
            return resp
        } catch (err) {
            // Handle Error Here
            console.error(err);
        }
    }
}

export default ServiceUpdateTelegram