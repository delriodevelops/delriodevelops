import mongoose from 'mongoose'

export default function database() {
    try {
        mongoose.connect(process.env.MONGO)
        console.log('***CONNECTED TO DB***')
    } catch (error) {
        console.warn("***COULDN'T CONNECT TO DB***")
        console.error(e)
    }
}