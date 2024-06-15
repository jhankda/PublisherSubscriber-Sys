import { createClient } from "redis";





class pubsubManager{


    constructor(){
        if(pubsubManager.instance){
            throw new Error('pubsubManager is a singleton class');  

        }

        this.redisClient = createClient();
        this.redisClient.connect();
        this.subscriptions = new Map();
        pubsubManager.instance = this;

    }

    addUserToStock(userId, stockId){
        if(!this.subscriptions.has(stockId)){
            this.subscriptions.set(stockId, [])
            console.log(1)
        }
        
        this.subscriptions.get(stockId)?.push(userId);
        console.log(2)

        if(this.subscriptions.get(stockId).length === 1){
            this.redisClient.subscribe(stockId, (message) =>{
                this.handlemessage(stockId, message)
                console.log(3)
                
            } )
            console.log(`subscribed to stock:${stockId}`)
        }

    }

    removeUserFromStock(userId, stockId){
        this.subscriptions.set(stockId, this.subscriptions.get(stockId).filter((sub) => sub !==userId) || [])

        if(this.subscriptions.get(stockId).length === 0){
            this.redisClient.unsubscribe(stockId);
            console.log(`unsubscribed to stock : ${stockId}`)
        }


    }

    handlemessage(stockId,message){
        console.log(`Message on Channel ${stockId}:${message}`)

        this.subscriptions.get(stockId).forEach((sub) => {
            console.log(`sending to user ${sub}`)

            
        });

    }

    static getInstance(){
        if(!pubsubManager.instance){
            pubsubManager.instance = new pubsubManager();
        }
        return pubsubManager.instance;
    }

    async disconnect(){
        await this.redisClient.quit()
    }
}

pubsubManager.instance = null;  



export {pubsubManager}