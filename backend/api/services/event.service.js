var eventModel = require("../models/event.model");
const EventSource = require('../../common/constants/EventSource');

var eventService = {
    addEvent: addEvent,
    deleteEvent: deleteEvent,
    generateId: generateId,
    exist: exist
}

//this function is called from the addd event function below
function generateId(eventData) {
//an event has an account_id, event, subs id, created at etc. and this function creates a new
//i.d for an even by adding all these things
    return eventData.account_id +
        eventData.event +
        eventData.payload.subscription.entity.id +
        eventData.created_at;
}

function addEvent(eventData) {
    const event = {
        eventId: generateId(eventData),
//there is only one type of event source, razorpay
        eventSource: EventSource.RAZOR_PAY,
//all the data of an event stays in payload field in the model
        eventPayload: eventData
    };

    return new Promise((resolve, reject) => {
//this adds an event in our d.b
        eventModel.create(event).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
}
//simple function to delete an event
function deleteEvent(id) {
    return new Promise((resolve, reject) => {
        eventModel.deletebyId(id).then((data) => {
            resolve({ 'success': true });
        }).catch((err) => {
            reject(err);
        })
    })
}

//simple function to check whether an event exists
function exist(eventData) {
    return new Promise((resolve, reject) => {
        const eventId = generateId(eventData);

        eventModel.searchOne({ 'eventId': eventId }).then((data) => {
            if (data) {
                resolve(true);
            } else {
                resolve(false);
            }
        }).catch((err) => {
            reject(err);
        })
    });
}

module.exports = eventService;

