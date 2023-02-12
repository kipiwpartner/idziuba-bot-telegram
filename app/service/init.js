import config from 'config'
import axios from "axios"
import mongoose from "mongoose"
import dotenv from 'dotenv'
dotenv.config({path : './config.env'})

const token = config.get('token')

//import Stopwords from "../models/stopwords.js"
//const arr_stop_words = config.get('arr_stop_words')["-1001723684912"]

const getData = async () => {
    try {
        const tmp_chat_id = "-789017583"
        const resp = await axios.get(`https://api.telegram.org/bot${token}/getUpdates`)
        await mongoose.connect(process.env.DATABASE_URI, {})

        // let searchQuery = { chat_id : tmp_chat_id}
        // let grp = await Stopwords.findOne(searchQuery)
        // if (grp) {
        //     await Stopwords.updateOne({ _id : grp._id }, { stopwords: arr_stop_words });
        // } else {
        //     await Stopwords.create({
        //         chat_id: tmp_chat_id,
        //         stopwords: arr_stop_words
        //     });
        // }
        
        return {
            "update_id": resp.data.result[resp.data.result.length-1].update_id,
        }
    } catch (err) {
        // Handle Error Here
        console.error(err);
    }
}
export default await getData()