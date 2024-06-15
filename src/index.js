import { pubsubManager } from "./pubsubManager.js";

import { createClient } from "redis";
const publisher = createClient()
let i = 0;

publisher.connect().then(() => {
    console.log('publishres also connected to redis')
})

setInterval(() => {
    pubsubManager.getInstance().addUserToStock("Harsh","HEERABAZAAR");

    
}, 5000);

setInterval(() => {
    pubsubManager.getInstance().removeUserFromStock("Harsh","HEERABAZAAR");
}, 10000);

setInterval(() => {
    publisher.publish("HEERABAZAAR", "Hello from publisher ",(i++)," Times");
}, 6000);