const DataLoader = require("dataloader")
const {dateToString} = require("../../helpers/date")
const Event = require("../../models/event")
const User = require("../../models/user")

const eventLoader = new DataLoader((eventsId)=> {
    return events(eventsId)
})

const userLoader = new DataLoader((usersIds)=>{
    return User.find({_id: {$in: usersIds}})
})

const events = async eventIds =>{
    try{
        const events = await Event.find({_id: {$in: eventIds } })
       return events.map(event=>{
            return transformEvent(event)
        })
    }
    catch(err){
        throw err
    }
}
const singleEvent = async eventId => {
    try{
        const event = await eventLoader.load(eventId.toString())
        return event;
    }
    catch(err){
        throw err
    }
}
const singleUser = async userId =>{
    try{
        const user = await userLoader.load(userId.toString())
        return {
            ...user._doc, 
            _id: user.id, 
            createdEvents: () => eventLoader.loadMany(user._doc.createdEvents)
        }
    }
    catch(err){
        throw err
    }
} 

const transformEvent = event => {
    return {
        ...event._doc, 
        _id: event.id, 
        date: dateToString(event._doc.date),
        creator: singleUser.bind(this, event.creator)
    }
}

const transformBooking = booking => {
    const { event, user, createdAt, updatedAt} = booking._doc
    return {
        ...booking._doc, 
        _id: booking.id, 
        user: singleUser.bind(this, user),
        event: singleEvent.bind(this, event),
        createdAt: dateToString(createdAt), 
        updatedAt: dateToString(updatedAt)
    }
}

module.exports = { 
                transformBooking,
                transformEvent
            }
