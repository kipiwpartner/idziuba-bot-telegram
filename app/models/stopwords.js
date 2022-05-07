import mongoose from 'mongoose'

let stopwordsScheme = new mongoose.Schema({
    chat_id : String,
    stopwords: [
        { 
            type: String
        }
    ]
})

export default mongoose.model('stopwords', stopwordsScheme);