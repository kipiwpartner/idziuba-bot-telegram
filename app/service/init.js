import config from 'config'
import axios from "axios"

const token = config.get('token')

const getData = async () => {
    try {
        const resp = await axios.get(`https://api.telegram.org/bot${token}/getUpdates`);
        return {
            "update_id": resp.data.result[resp.data.result.length-1].update_id,
        }
    } catch (err) {
        // Handle Error Here
        console.error(err);
    }
}
export default await getData()