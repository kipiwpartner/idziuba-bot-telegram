import config from 'config'

class ServiceLogging {
    constructor(){
        this.loggingMessage = config.get('loggingMessage');
    }

    loggingSendChangedMessage = (obj) => {
        if (this.loggingMessage){
            console.log("🚀 ~ loggingSendChangedMessage => ", obj)
        }
    }
    loggingDeleteMessage = (obj) => {
        if (this.loggingMessage){
            console.log("🚀 ~ loggingDeleteMessage => ", obj)
        }
    }

    log = (obj) => {
        if (this.loggingMessage){
            console.log(obj)
        }
    }
}

export default ServiceLogging