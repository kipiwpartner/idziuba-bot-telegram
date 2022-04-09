import config from 'config'

class Logging {
    constructor(){
        this.loggingMessage = config.get('loggingMessage');
    }

    loggingSendChangedMessage = (obj) => {
        if (this.loggingMessage){
            console.log("🚀 ~ file: logging.js ~ Logging ~ loggingMessageConsole", obj)
        }
    }
    loggingDeleteMessage = (obj) => {
        if (this.loggingMessage){
            console.log("🚀 ~ file: logging.js ~ Logging ~ loggingMessageConsole", obj)
        }
    }
}

export default Logging