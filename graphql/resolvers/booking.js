const {transformBooking, transformEvent}= require("./merge")
const Booking = require("../../models/booking")


module.exports = {
    bookings: async (args, req) => {
        if(!req.isAuth){// protection for resolvers
            throw new Error("Unauthenticated request")    
        }
        try{
            const bookings = await Booking.find({user: req.userId})
            return bookings.map(booking =>{
                return transformBooking(booking)
            })
        }
        catch(err){
            throw err
        }
    },
    bookEvent: async (args, req)=>{
        if(!req.isAuth){// protection for resolvers
            throw new Error("Unauthenticated request")    
        }
        const booking = new Booking({
            user: req.userId,
            event: args.eventId
        })
        const newBooking = await booking.save()
        return transformBooking(newBooking);
    },
    cancelBooking: async (args, req)=> {
        if(!req.isAuth){// protection for resolvers
            throw new Error("Unauthenticated request")    
        }
        try {
            const cancelledBooking =  await Booking.findById(args.bookingId).populate('event')
            const event = transformEvent(cancelledBooking.event)
            await Booking.deleteOne({_id: args.bookingId})
            console.log(event)
            return event;
        }
        catch(err){
            throw err
        }
    }
}