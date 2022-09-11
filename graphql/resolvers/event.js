const User = require("../../models/user")
const Event = require("../../models/event")
const { transformEvent } = require("./merge")

module.exports = {
    events: async () => {
        try{
            const events = await Event.find()
            return events.map(event =>{
                return transformEvent(event)
            })
        }
        catch(err){
            throw err
        }
    },
    createEvent: async (args, req) => {
        if(!req.isAuth){// protection for resolvers
            throw new Error("Unauthenticated request")    
        }
        
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: req.userId
        })
         let createdEvent;
         try {
         const result = await event.save()
            createdEvent = transformEvent(result)
           const foundUser= await User.findById(req.userId)
                if(!foundUser){
                    throw new Error(" User not found")
                }
                foundUser.createdEvents.push(event)
               const userSaveResult = await foundUser.save()
               return createdEvent;
        }
       catch(err){
           throw err
       }          
    }
}