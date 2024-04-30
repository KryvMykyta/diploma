import { Kafka } from 'kafkajs'

const kafkaInstance = new Kafka({
    clientId: "nodejs-kafka",
    brokers: ['localhost:29092']
})

export default kafkaInstance