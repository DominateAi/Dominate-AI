const followupService = require('../services/followup.service');
const leaveService = require('../services/leave.service');
const meetingService = require('../services/meeting.service');
const calanderType = require('../../common/constants/CalanderType');
const leaveType = require("../../common/constants/LeaveType");
const moment = require('moment');

var calenderService = {
    getAllCalenders: getAllCalenders,
    getUpcomingEvents: getUpcomingEvents,
    getAllHolidays: getAllHolidays,
    getAllCalenderWithAllTypes:getAllCalenderWithAllTypes,
    getDayCalendar: getDayCalendar
}

function getAllCalenders(type, month, year) {

    return new Promise(async (resolve, reject) => {
        try {
            const noOfDays = daysInMonth(month, year);
            const result = {};
            if (type === calanderType.APPROVED_LEAVE) {
                for (let index = 1; index <= noOfDays; index++) {
                    const leaveData = await leaveService.getAllApprovedLeavesByDate(getDate(month,year,index));
                    result[index] = leaveData;
                }
                resolve(result);
            }else if(type === calanderType.MEETING){
                for (let index = 1; index <= noOfDays; index++) {
                    const leaveData = await meetingService.getAllMeetingsByDate(getDate(month,year,index));
                    result[index] = leaveData;
                }
                resolve(result);
            }else if(type === calanderType.HOLIDAY){
                for (let index = 1; index <= noOfDays; index++) {
                    const leaveData = await leaveService.getAllHolodaysByDate(getDate(month,year,index));
                    result[index] = leaveData;
                }
                resolve(result);
            }else if (type === calanderType.APPROVAL_PENDING) {
                for (let index = 1; index <= noOfDays; index++) {
                    const leaveData = await leaveService.getAllApprovalPendingLeavesByDate(getDate(month,year,index));
                    result[index] = leaveData;
                }
                resolve(result);
            }else if (type === calanderType.FOLLOW_UP) {
                for (let index = 1; index <= noOfDays; index++) {
                    const leaveData = await followupService.getAllFollowUpsByDate(getDate(month,year,index));
                    result[index] = leaveData;
                }
                resolve(result);
            }
        } catch (err) {
            reject(err);
        }
    });
}

function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

function getDate(month, year, day) {
    return new Date(year, month-1, day).toDateString();
}

function getAllHolidays(month, year){
    return new Promise((resolve, reject) => {
        var startDate = new Date(month + "-01-" + year);
        var endDate = new Date(month + "-31-" + year);
        console.log(startDate);
        console.log(endDate);
        leaveService.getAllHolidaysByDate(startDate, endDate).then((data)=>{
            resolve(data);
        }).catch((err)=>{
            reject(err);
        })
    });
}


function getUpcomingEvents(){
    return new Promise( async  (resolve, reject) => {
        let currentDate = new Date().toISOString();
        let lastDate = moment(currentDate).endOf("month").toISOString();
       console.log(currentDate);
       console.log(lastDate);
        let response = {};
        leaveService.getUpcomingLeaves(currentDate, lastDate ,undefined).then((leaveData)=>{
            response['upcomingLeaves'] = leaveData;
            leaveService.getUpcomingLeaves(currentDate, lastDate, leaveType.HOLIDAY).then( async (holidayData)=>{
                response['holidays'] = holidayData;
                var start = new Date();
                start.setHours(0,0,0,0)
                lastDate = moment(currentDate).endOf("day").toISOString();
                let todayOnLeads = await leaveService.getTodayOnLeave();
                response['todayLeaves'] = todayOnLeads;
                resolve(response);
            }).catch((err)=>{
                reject(err);
            });
        }).catch((err)=>{
            reject(err);
        });
    });
}


function getAllCalenderWithAllTypes( month, year ) {
    return new Promise( async ( resolve, reject ) => {
        try{
            const noOfDays = daysInMonth(month, year);
            const result = {};
            console.log( noOfDays, month, year );
            for (let index = 1; index <= noOfDays; index++) {
                const meetingData = await meetingService.getAllMeetingsByDate(getDate(month,year,index));
                const followupData = await followupService.getAllFollowUpsByDate(getDate(month,year,index));
                const holidays = await leaveService.getDayHolidays(getDate(month, year, index));
                result[index] =  meetingData.concat(followupData, holidays);
            }
            resolve( result )
        } catch ( err ) {
            reject( err );
        }
    });
}

function getDayCalendar(month, year, date){
    return new Promise(async(resolve, reject) => {
        var result = [], response = {};
        try{
            const meetingData = await meetingService.getAllMeetingsByDate(getDate(month, year, date));
            const followupData = await followupService.getAllFollowUpsByDate(getDate(month, year, date));
            const holidays = await leaveService.getDayHolidays(getDate(month, year, date));
            response = {meetingData, followupData, holidays}
            resolve(response);
        }catch(err){reject(err)}
    })
}

module.exports = calenderService;