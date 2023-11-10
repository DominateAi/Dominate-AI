var targetModel = require("../models/target.model");
var leadModel = require('../models/lead.model');
var userServices = require('../services/user.service');
var currentContext = require('../../common/currentContext');
var Quarters = require('../../common/constants/CompanyQuarter');
const moment = require('moment');
 
var targetService = {
    addtarget:addtarget,
    getTarget:getTarget,
    getOrganisationTargetForCurrentMonth:getOrganisationTargetForCurrentMonth,
    getAllTargets:getAllTargets,
    getTargetById:getTargetById,
    updateDataById:updateDataById,
    deleteDataById:deleteDataById,
    resetData:resetData,
    createPendingTargetFromLastMonth:createPendingTargetFromLastMonth,
    getMonthlyTargetLeadWise:getMonthlyTargetLeadWise,
    getMonthlyTargetDollarWise:getMonthlyTargetDollarWise,
    getOwnerWiseLead:getOwnerWiseLead,
    checkIfOrganisationTargetForCurrentMonth:checkIfOrganisationTargetForCurrentMonth,
    deleteAllData:deleteAllData,
    getExpectedRevenueGraphByMonth:getExpectedRevenueGraphByMonth,
    getCurrentMonthRevenue:getCurrentMonthRevenue
}

// SERVICE - TO ADD A NEW TARGET
function addtarget( targetData ) {
    return new Promise(( resolve, reject ) => {
        var userInfo = currentContext.getCurrentContext();
        targetData.lastModifiedBy = userInfo.email;
        targetData.fromDate = moment().startOf('month');
        targetData.toDate = moment().endOf('month');
        targetData.createdBy = userInfo.email;
        targetModel.create(targetData)
            .then( data => resolve( data ) )
            .catch( err => reject( err ) )

    });
} 

// SERVICE - TO GET TARGET WITH ENTITYID, TARGET TYPE and STATUS
async function getTarget( targetData ){
    return new Promise(( resolve, reject ) => {
        targetModel.getTargetByIdStatusAndTargetType( targetData.entityId, targetData.targetType, targetData.status )
            .then( data => resolve( data ) )
            .catch( err => reject( err ) )
    })
}

// SERVICE - TO GET ALL THE TARGET WITH QUERY PARAMS
async function getAllTargets( isOrganisation, sendAll, year, isPending, user_id ){ 
    return new Promise((resolve, reject) => {
        let query = {};
        query.targetType = isOrganisation === "true" ? "ORGANISATION" : "MEMBER";
        query.status = isPending === true ? "PENDING" : "ACTIVE";
        if( sendAll !== true && year === undefined ){
            query.createdAt = { $gte: moment().startOf('month'), $lte:moment().endOf('month') }
        }
        if( user_id ){
            query.entityId = user_id;
        }
        if( year !== undefined ){
            query.year = parseInt(year);
            // CALL MODEL WITH AGGREGATE
            targetModel.getAllTargetsByYears(  query, year )
            .then( async  data => {
                // let organisationDataCount = JSON.parse(JSON.stringify(data)) ;
                // if( organisationDataCount.length > 0  ){
                //     let i = 0;
                //     while( i < organisationDataCount.length ){
                //         organisationDataCount[i].achieved_new_leads_dollar_value = Math.floor(1000 + Math.random() * 9000);
                //         organisationDataCount[i].achieved_new_leads_lead_value = Math.floor(10 + Math.random() * 90)
                //         organisationDataCount[i].achieved_contacted_leads_dollar_value = Math.floor(1000 + Math.random() * 9000);
                //         organisationDataCount[i].achieved_contacted_leads_lead_value = Math.floor(10 + Math.random() * 90)
                //         organisationDataCount[i]. achieved_closed_leads_dollar_value = Math.floor(1000 + Math.random() * 9000);
                //         organisationDataCount[i].achieved_closed_leads_lead_value = Math.floor(10 + Math.random() * 90);
                //         i++;
                //     }
                // }
                // resolve( organisationDataCount );
                let mytarget = JSON.parse(JSON.stringify(data)) ;
                let i = 0;
                let accomplished_new_leads = accomplished_contacted_leads = accomplished_converted_leads = 0;
                let accomplished_new_leads_dollar = accomplished_contacted_leads_dollar = accomplished_converted_leads_dollar = 0;
                let expected_new_leads = expected_contacted_leads = expected_closed_leads = 0;
                let expected_new_leads_dollar = expected_contacted_leads_dollar = expected_closed_leads_dollar = 0;
                let createdAtArray = [];
                while( i < mytarget.length ){
                    expected_new_leads = parseInt(expected_new_leads) + parseInt(mytarget[i].new_leads_lead_value);
                    expected_contacted_leads = parseInt(expected_contacted_leads) + parseInt(mytarget[i].contacted_leads_lead_value);
                    expected_closed_leads = parseInt(expected_closed_leads) + parseInt(mytarget[i].closed_leads_lead_value);
                    createdAtArray.push( mytarget[i].createdAt );
                    expected_new_leads_dollar = parseInt(expected_new_leads_dollar) + parseInt(mytarget[i].new_leads_dollar_value);
                    expected_contacted_leads_dollar = parseInt(expected_contacted_leads_dollar) + parseInt(mytarget[i].contacted_leads_dollar_value);
                    expected_closed_leads_dollar = parseInt(expected_closed_leads_dollar) + parseInt(mytarget[i].closed_leads_dollar_value);
 

                    let leads_closed = await leadModel.search({ createdAt : { $gte : mytarget[i].createdAt }, status:"NEW_LEAD" });
                    console.log( leads_closed );
                    let leads_contacted = await leadModel.search({ createdAt : { $gte : mytarget[i].createdAt }, status:"CONTACTED_LEADS" });
                    let converted_lead = await leadModel.search({ status:"CONVERTED", convertedDate: { $gte : mytarget[i].createdAt } });
                    accomplished_new_leads = accomplished_new_leads + leads_closed.length;
                    accomplished_contacted_leads = accomplished_contacted_leads + leads_contacted.length;
                    accomplished_converted_leads = accomplished_converted_leads + converted_lead.length;
                    
                    mytarget[i].achieved_new_leads_lead_value = accomplished_new_leads;
                    mytarget[i].achieved_contacted_leads_lead_value =accomplished_contacted_leads;
                    mytarget[i].achieved_closed_leads_lead_value = accomplished_converted_leads;
                    let lc = 0;
                    while( lc < leads_closed.length ){
                        accomplished_new_leads_dollar = parseInt( accomplished_new_leads_dollar ) + leads_closed[lc].worth ? parseInt( leads_closed[lc].worth ) : 0;
                        ;
                        lc++;
                    }
                    lc = 0;
                    while( lc < leads_contacted.length ){
                        accomplished_contacted_leads_dollar = parseInt( accomplished_contacted_leads_dollar ) + leads_contacted[lc].worth ? parseInt( leads_contacted[lc].worth ) : 0;
                        
                        lc++;
                    }
                    lc = 0;
                    while( lc < converted_lead.length ){
                        accomplished_converted_leads_dollar = parseInt( expected_closed_leads_dollar ) + converted_lead[lc].worth ? parseInt( converted_lead[lc].worth ) : 0;
                        
                        lc++;
                    }
                    mytarget[i].achieved_new_leads_dollar_value = accomplished_new_leads_dollar;
                    mytarget[i].achieved_contacted_leads_dollar_value = accomplished_contacted_leads_dollar
                    mytarget[i]. achieved_closed_leads_dollar_value = accomplished_converted_leads_dollar;
                    i++;
                }
                resolve(mytarget);
            } )
            .catch( err => reject( err ) )
        } else {
            // CALL SIMPLE API
            targetModel.getAllTargets( query )
            .then( async  data => {
                // let organisationDataCount = JSON.parse(JSON.stringify(data)) ;
                // if( organisationDataCount.length > 0  ){
                //     let i = 0;
                //     while( i < organisationDataCount.length ){
                //         organisationDataCount[i].achieved_new_leads_dollar_value = Math.floor(1000 + Math.random() * 9000);
                //         organisationDataCount[i].achieved_new_leads_lead_value = Math.floor(10 + Math.random() * 90)
                //         organisationDataCount[i].achieved_contacted_leads_dollar_value = Math.floor(1000 + Math.random() * 9000);
                //         organisationDataCount[i].achieved_contacted_leads_lead_value = Math.floor(10 + Math.random() * 90)
                //         organisationDataCount[i]. achieved_closed_leads_dollar_value = Math.floor(1000 + Math.random() * 9000);
                //         organisationDataCount[i].achieved_closed_leads_lead_value = Math.floor(10 + Math.random() * 90);
                //         i++;
                //     }
                // }
                // resolve( organisationDataCount );
                let mytarget = JSON.parse(JSON.stringify(data)) ;
                let i = 0;
                let accomplished_new_leads = accomplished_contacted_leads = accomplished_converted_leads = 0;
                let accomplished_new_leads_dollar = accomplished_contacted_leads_dollar = accomplished_converted_leads_dollar = 0;
                let expected_new_leads = expected_contacted_leads = expected_closed_leads = 0;
                let expected_new_leads_dollar = expected_contacted_leads_dollar = expected_closed_leads_dollar = 0;
                let createdAtArray = [];
                while( i < mytarget.length ){
                    expected_new_leads = parseInt(expected_new_leads) + parseInt(mytarget[i].new_leads_lead_value);
                    expected_contacted_leads = parseInt(expected_contacted_leads) + parseInt(mytarget[i].contacted_leads_lead_value);
                    expected_closed_leads = parseInt(expected_closed_leads) + parseInt(mytarget[i].closed_leads_lead_value);
                    createdAtArray.push( mytarget[i].createdAt );
                    expected_new_leads_dollar = parseInt(expected_new_leads_dollar) + parseInt(mytarget[i].new_leads_dollar_value);
                    expected_contacted_leads_dollar = parseInt(expected_contacted_leads_dollar) + parseInt(mytarget[i].contacted_leads_dollar_value);
                    expected_closed_leads_dollar = parseInt(expected_closed_leads_dollar) + parseInt(mytarget[i].closed_leads_dollar_value);
 

                    let leads_closed = await leadModel.search({ createdAt : { $gte : mytarget[i].createdAt }, status:"NEW_LEAD" });
                    console.log( leads_closed );
                    let leads_contacted = await leadModel.search({ createdAt : { $gte : mytarget[i].createdAt }, status:"CONTACTED_LEADS" });
                    let converted_lead = await leadModel.search({ status:"CONVERTED", convertedDate: { $gte : mytarget[i].createdAt } });
                    accomplished_new_leads = accomplished_new_leads + leads_closed.length;
                    accomplished_contacted_leads = accomplished_contacted_leads + leads_contacted.length;
                    accomplished_converted_leads = accomplished_converted_leads + converted_lead.length;
                    
                    mytarget[i].achieved_new_leads_lead_value = accomplished_new_leads;
                    mytarget[i].achieved_contacted_leads_lead_value =accomplished_contacted_leads;
                    mytarget[i].achieved_closed_leads_lead_value = accomplished_converted_leads;
                    let lc = 0;
                    while( lc < leads_closed.length ){
                        accomplished_new_leads_dollar = parseInt( accomplished_new_leads_dollar ) + leads_closed[lc].worth ? parseInt( leads_closed[lc].worth ) : 0;
                        ;
                        lc++;
                    }
                    lc = 0;
                    while( lc < leads_contacted.length ){
                        accomplished_contacted_leads_dollar = parseInt( accomplished_contacted_leads_dollar ) + leads_contacted[lc].worth ? parseInt( leads_contacted[lc].worth ) : 0;
                        
                        lc++;
                    }
                    lc = 0;
                    while( lc < converted_lead.length ){
                        accomplished_converted_leads_dollar = parseInt( expected_closed_leads_dollar ) + converted_lead[lc].worth ? parseInt( converted_lead[lc].worth ) : 0;
                        
                        lc++;
                    }
                    mytarget[i].achieved_new_leads_dollar_value = accomplished_new_leads_dollar;
                    mytarget[i].achieved_contacted_leads_dollar_value = accomplished_contacted_leads_dollar
                    mytarget[i]. achieved_closed_leads_dollar_value = accomplished_converted_leads_dollar;
                    i++;
                }
                resolve(mytarget);
            } )
            .catch( err => reject( err ) )
        }
    });
}

async function getTargetById( id ) {
    return new Promise(( resolve, reject ) => {
        var query = { _id : id };
        targetModel.getTargetByID( query )
        .then( data => resolve( data ) )
        .catch( err => reject( err ) )
    })
}

async function updateDataById( id , data ){
    return new Promise((resolve, reject) => {
        if( id !== undefined ){
            targetModel.updateByID( id, data )
                .then( data => resolve( data ) )
                .catch( err => reject( err ) )
        } else {
            reject("err")
        }
    })
}

async function deleteDataById( id ){
    return new Promise(( resolve, reject ) => {
        if( id !== undefined ){
            targetModel.deleteByID( id )
                .then( data => resolve( data ) )
                .catch( err => reject( err ) )
        } else {
            reject("err")
        }
    })
}


// SERVICE - RESET TARGET
async function resetData( deleteAll ){
    return new Promise((resolve, reject) => {
        if( deleteAll === "true" ){
            let filter = {};
            filter = { status:"ACTIVE", createdAt:{ $gte: moment().startOf('month'), $lte:moment().endOf('month') } };
            targetModel.resetCurrentMonthOrganisationAndMembersData( filter )
                .then( data => resolve( data ) )
                .catch( err => reject( err ) )
        } else {
            let filter = {};
            filter = { targetType:"ORGANISATION", status:"ACTIVE", createdAt:{ $gte: moment().startOf('month'), $lte:moment().endOf('month') } };
            targetModel.resetCurrentMonthOrganisationData( filter )
                .then( data => resolve( data ) )
                .catch( err => reject( err ) )
        }
    })
}

// SERVICE - RESET TARGET
async function deleteAllData( deleteAll ){
    return new Promise((resolve, reject) => {
        if( deleteAll === "true" ){
            let filter = {};
            filter = { status:"ACTIVE", createdAt:{ $gte: moment().startOf('month'), $lte:moment().endOf('month') } };
            targetModel.resetCurrentMonthOrganisationAndMembersData( filter )
                .then( data => resolve( data ) )
                .catch( err => reject( err ) )
        } else {
            let filter = {};
            filter = { targetType:"ORGANISATION", status:"ACTIVE", createdAt:{ $gte: moment().startOf('month'), $lte:moment().endOf('month') } };
            targetModel.resetCurrentMonthOrganisationData( filter )
                .then( data => resolve( data ) )
                .catch( err => reject( err ) )
        }
    })
}


async function getOrganisationTargetForCurrentMonth(){
    return new Promise((resolve, reject) => {
        targetModel.getOrganisationTargetForCurrentMonth()
        .then( data => resolve( data ) )
        .catch( err => reject( err ) )
    });
}

async function createPendingTargetFromLastMonth(){
    // GET ALL THE ALL TARGET CREATED FOR THE ORGANISATION FROM LAST MONTH
    
    // CHECK IF LAST MONTH TARGET IS PRESENT FOR WHICH USER
    
    // IF THERE IS LAST MONTH TARGET , CREATE PENDING TARGET FOR THAT USER IF ONLY CLOSED IS LESS THAN TARGET

    // GET ALL THE LEADS CREATED BY THAT USER

    // GET ALL TARGET FOR LAST MONTH FIRST
    return new Promise( async ( resolve, reject )=> {
        try{
            var userInfo = currentContext.getCurrentContext();
            const currentYear = new Date().getFullYear();
            entityId = userInfo.userId;
           let targets =  await targetModel.groupByKeyAndCountDocumentsByMonth_v2( "createdAt", currentYear, entityId, "ACTIVE", "MEMBER" );
           let acquiredClosedData = await leadModel.groupByKeyAndCountDocumentsByMonth_v3( "createdAt", currentYear, "$worth", entityId,  "CONVERTED" );
           let acquiredContactedData = await leadModel.groupByKeyAndCountDocumentsByMonth_v3( "createdAt", currentYear, "$worth", entityId,  "CONTACTED_LEADS" );
           let acquiredNewData = await leadModel.groupByKeyAndCountDocumentsByMonth_v3( "createdAt", currentYear, "$worth", entityId,  "NEW_LEAD" );
           let lastmonth = moment().month();
           // FILTER ALL LAST MONTH TARGET AND ACQUIRED
           targets = targets.filter( o => o._id == lastmonth );
           acquiredClosedData = acquiredClosedData.filter( o => o._id == lastmonth );
           acquiredContactedData = acquiredContactedData.filter( o => o._id == lastmonth );
           acquiredNewData = acquiredNewData.filter( o => o._id == lastmonth );
           if( targets.length > 0 ){
               
           }
           //
        } catch ( err ){
            reject( err );
        }
    });
}

function getMonthlyTargetLeadWise(isOrganisation){
        return new Promise( async(resolve, reject) => {
            try{
                var userInfo = currentContext.getCurrentContext();
                var entityId = "";
                if( isOrganisation === "false" ){ 
                    entityId = userInfo.userId;
                }
                const currentYear = new Date().getFullYear();
                // key, qyear, qassigned, qstatus, targetType  key, qyear, sumBy, qassigned, qstatus
                let expectedData = await targetModel.groupByKeyAndCountDocumentsByMonth_v2( "createdAt", currentYear, entityId, "ACTIVE", "MEMBER" );
                let acquiredClosedData = await leadModel.groupByKeyAndCountDocumentsByMonth_v3( "createdAt", currentYear, "$worth", entityId,  "CONVERTED" );
                let acquiredContactedData = await leadModel.groupByKeyAndCountDocumentsByMonth_v3( "createdAt", currentYear, "$worth", entityId,  "CONTACTED_LEADS" );
                let acquiredNewData = await leadModel.groupByKeyAndCountDocumentsByMonth_v3( "createdAt", currentYear, "$worth", entityId,  "NEW_LEAD" );
                let currentMonth = moment().month() +1;
                // console.log( expectedData, "LeadWise Data" );
                expectedData = expectedData.filter( o => o._id === currentMonth)[0];
                acquiredClosedData = acquiredClosedData.filter( o => o._id === currentMonth)[0];
                acquiredContactedData = acquiredContactedData.filter( o => o._id === currentMonth)[0];
                acquiredNewData = acquiredNewData.filter( o => o._id === currentMonth)[0];
                let response = { 
                    "label":["New Leads", "Contacted Leads", "Closed Leads"],
                    "expected":[0,0,0],
                    "accomplished":[0,0,0]
                };
                if( expectedData ){
                    let new_lead_count =  contacted_lead_count = closed_lead_count = 0;
                    expectedData.new_leads_lead_value.forEach( elem => { new_lead_count =  new_lead_count + parseInt( elem ) });
                    expectedData.contacted_leads_lead_value.forEach( elem => { contacted_lead_count =  contacted_lead_count + parseInt( elem ) });
                    expectedData.closed_leads_lead_value.forEach( elem => { closed_lead_count =  closed_lead_count + parseInt( elem ) });
                    response.expected = [ new_lead_count, contacted_lead_count, closed_lead_count ];
                } 
                console.log( acquiredNewData );
                if( acquiredClosedData ){
                    response.accomplished[2] = acquiredClosedData.worthAmt.length;
                }
                if( acquiredContactedData ){
                    response.accomplished[1] = acquiredContactedData.worthAmt.length;
                }
                if( acquiredNewData ){
                    response.accomplished[0] = acquiredNewData.worthAmt.length;
                }
                resolve( response );
            } catch ( err ){
                reject( err );
            }
        });
}
function getMonthlyTargetDollarWise(isOrganisation){
    return new Promise( async(resolve, reject) => {
        try{
            var userInfo = currentContext.getCurrentContext();
            var entityId = "";
            if( isOrganisation === "false" ){ 
                entityId = userInfo.userId;
            }
            const currentYear = new Date().getFullYear();
            // key, qyear, qassigned, qstatus, targetType  key, qyear, sumBy, qassigned, qstatus
            let expectedData = await targetModel.groupByKeyAndCountDocumentsByMonth_v2( "createdAt", currentYear, entityId, "ACTIVE", "MEMBER" );
            let acquiredClosedData = await leadModel.groupByKeyAndCountDocumentsByMonth_v3( "createdAt", currentYear, "$worth", entityId,  "CONVERTED" );
            let acquiredContactedData = await leadModel.groupByKeyAndCountDocumentsByMonth_v3( "createdAt", currentYear, "$worth", entityId,  "CONTACTED_LEADS" );
            let acquiredNewData = await leadModel.groupByKeyAndCountDocumentsByMonth_v3( "createdAt", currentYear, "$worth", entityId,  "NEW_LEAD" );
            let currentMonth = moment().month() +1;
            console.log( currentMonth );
            expectedData = expectedData.filter( o => o._id === currentMonth)[0];
            acquiredClosedData = acquiredClosedData.filter( o => o._id === currentMonth)[0];
            acquiredContactedData = acquiredContactedData.filter( o => o._id === currentMonth)[0];
            acquiredNewData = acquiredNewData.filter( o => o._id === currentMonth)[0];
            let response = { 
                "label":["New Leads", "Contacted Leads", "Closed Leads"],
                "expected":[0,0,0],
                "accomplished":[0,0,0]
            };
            if( expectedData ){
                console.log( expectedData );
                let new_lead_dollar_amt =  contacted_lead_dollar_amt = closed_lead_dollar_amt = 0;
                expectedData.new_leads_dollar_value.forEach( elem => { new_lead_dollar_amt =  new_lead_dollar_amt + parseInt( elem ) });
                expectedData.contacted_leads_dollar_value.forEach( elem => { contacted_lead_dollar_amt =  contacted_lead_dollar_amt + parseInt( elem ) });
                expectedData.closed_leads_dollar_value.forEach( elem => { closed_lead_dollar_amt =  closed_lead_dollar_amt + parseInt( elem ) });
                response.expected = [ new_lead_dollar_amt, contacted_lead_dollar_amt, closed_lead_dollar_amt ];
            } 
            if( acquiredClosedData ){
                response.accomplished[2] = acquiredClosedData.count;
            }
            if( acquiredContactedData ){
                response.accomplished[1] = acquiredContactedData.count;
            }
            if( acquiredNewData ){
                response.accomplished[0] = acquiredNewData.count;
            }
            resolve( response );
        } catch ( err ){
            reject( err );
        }
    }); 
}

function getOwnerWiseLead(){
    return new Promise(async(resolve, reject) => {
        // get ALL MEMBERS DATA
        let all_users = JSON.parse( JSON.stringify( await userServices.getAllUser()));
        let j = 0;
        while ( j < all_users.length ){
            let mytarget = await targetModel.getAllTargets({ createdAt : { $gte: moment().startOf('month'), $lte:moment().endOf('month') }, targetType:"MEMBER", entityId:all_users[j]._id });
            let i = 0;
            let expected_new_leads = expected_contacted_leads = expected_closed_leads = 0;
            let expected_new_leads_dollar = expected_contacted_leads_dollar = expected_closed_leads_dollar = 0;
            let createdAtArray = [];
            while( i < mytarget.length ){
                expected_new_leads = parseInt(expected_new_leads) + parseInt(mytarget[i].new_leads_lead_value);
                expected_contacted_leads = parseInt(expected_contacted_leads) + parseInt(mytarget[i].contacted_leads_lead_value);
                expected_closed_leads = parseInt(expected_closed_leads) + parseInt(mytarget[i].closed_leads_lead_value);
                createdAtArray.push( mytarget[i].createdAt );
                expected_new_leads_dollar = parseInt(expected_new_leads_dollar) + parseInt(mytarget[i].new_leads_dollar_value);
                expected_contacted_leads_dollar = parseInt(expected_contacted_leads_dollar) + parseInt(mytarget[i].contacted_leads_dollar_value);
                expected_closed_leads_dollar = parseInt(expected_closed_leads_dollar) + parseInt(mytarget[i].closed_leads_dollar_value);
                i++;
            }
            i = 0 ;
            let accomplished_new_leads = accomplished_contacted_leads = accomplished_converted_leads = 0;
            let accomplished_new_leads_dollar = accomplished_contacted_leads_dollar = accomplished_converted_leads_dollar = 0;
            while( i < createdAtArray.length ){
                let leads_closed = await leadModel.search({ createdAt : { $gte : createdAtArray[i] }, status:"NEW_LEAD" });
                console.log( leads_closed );
                let leads_contacted = await leadModel.search({ createdAt : { $gte : createdAtArray[i] }, status:"CONTACTED_LEADS" });
                let converted_lead = await leadModel.search({ status:"CONVERTED", convertedDate: { $gte : createdAtArray[i] } });
                accomplished_new_leads = accomplished_new_leads + leads_closed.length;
                accomplished_contacted_leads = accomplished_contacted_leads + leads_contacted.length;
                accomplished_converted_leads = accomplished_converted_leads + converted_lead.length;

                let lc = 0;
                while( lc < leads_closed.length ){
                    accomplished_new_leads_dollar = parseInt( accomplished_new_leads_dollar ) + leads_closed[i].worth ? parseInt( leads_closed[i].worth ) : 0;
                    lc++;
                }
                lc = 0;
                while( lc < leads_contacted.length ){
                    accomplished_contacted_leads_dollar = parseInt( accomplished_contacted_leads_dollar ) + leads_contacted[i].worth ? parseInt( leads_contacted[i].worth ) : 0;
                    lc++;
                }
                lc = 0;
                while( lc < converted_lead.length ){
                    accomplished_converted_leads_dollar = parseInt( expected_closed_leads_dollar ) + converted_lead[i].worth ? parseInt( converted_lead[i].worth ) : 0;
                    lc++;
                }
                i++;
            }
            all_users[j].role = 1;
            all_users[j].grapghData = {
                "dollarGraph":{ "label":["New Leads", "Contacted Leads", "Closed Leads"],
                "expected":[expected_new_leads_dollar, expected_contacted_leads_dollar, expected_closed_leads_dollar],
                "accomplished":[ accomplished_new_leads_dollar, accomplished_contacted_leads_dollar , accomplished_converted_leads_dollar ] },
                "leadGrapgh":{
                    "label":["New Leads", "Contacted Leads", "Closed Leads"],
                    "expected":[expected_new_leads, expected_contacted_leads, expected_closed_leads],
                    "accomplished":[ accomplished_new_leads, accomplished_contacted_leads , accomplished_converted_leads ]
                }
            }
            j++;
        }
        resolve( all_users );

        // CREATE THEIR GRAPGH
    });
}

/*******************************
 * @DESC - FUNCTION TO CHECK IF
 * ORGANISATION DATA HAS BEEN 
 * MADE FOR CURRENT MONTH OR NOT
 *******************************/
function checkIfOrganisationTargetForCurrentMonth (){
    return new Promise( async ( resolve, reject ) => {
        try{ 
            var userInfo = currentContext.getCurrentContext();
            let query = {};
            query.createdBy = userInfo.email;
            query.createdAt = { $gte: moment().startOf('month'), $lte:moment().endOf('month') };
            query.targetType = "ORGANISATION";
            let mytarget = JSON.parse(JSON.stringify(await targetModel.getAllTargets(query))) ;
            let i = 0;
            let accomplished_new_leads = accomplished_contacted_leads = accomplished_converted_leads = 0;
            let accomplished_new_leads_dollar = accomplished_contacted_leads_dollar = accomplished_converted_leads_dollar = 0;
            let expected_new_leads = expected_contacted_leads = expected_closed_leads = 0;
            let expected_new_leads_dollar = expected_contacted_leads_dollar = expected_closed_leads_dollar = 0;
            let createdAtArray = [];
            while( i < mytarget.length ){
                expected_new_leads = parseInt(expected_new_leads) + parseInt(mytarget[i].new_leads_lead_value);
                expected_contacted_leads = parseInt(expected_contacted_leads) + parseInt(mytarget[i].contacted_leads_lead_value);
                expected_closed_leads = parseInt(expected_closed_leads) + parseInt(mytarget[i].closed_leads_lead_value);
                createdAtArray.push( mytarget[i].createdAt );
                expected_new_leads_dollar = parseInt(expected_new_leads_dollar) + parseInt(mytarget[i].new_leads_dollar_value);
                expected_contacted_leads_dollar = parseInt(expected_contacted_leads_dollar) + parseInt(mytarget[i].contacted_leads_dollar_value);
                expected_closed_leads_dollar = parseInt(expected_closed_leads_dollar) + parseInt(mytarget[i].closed_leads_dollar_value);


                let leads_closed = await leadModel.search({ createdAt : { $gte : mytarget[i].createdAt }, status:"NEW_LEAD" });
                console.log( leads_closed );
                let leads_contacted = await leadModel.search({ createdAt : { $gte : mytarget[i].createdAt }, status:"CONTACTED_LEADS" });
                let converted_lead = await leadModel.search({ status:"CONVERTED", convertedDate: { $gte : mytarget[i].createdAt } });
                accomplished_new_leads = accomplished_new_leads + leads_closed.length;
                accomplished_contacted_leads = accomplished_contacted_leads + leads_contacted.length;
                accomplished_converted_leads = accomplished_converted_leads + converted_lead.length;
                
                mytarget[i].achieved_new_leads_lead_value = accomplished_new_leads;
                mytarget[i].achieved_contacted_leads_lead_value =accomplished_contacted_leads;
                mytarget[i].achieved_closed_leads_lead_value = accomplished_converted_leads;
                let lc = 0;
                while( lc < leads_closed.length ){
                    accomplished_new_leads_dollar = parseInt( accomplished_new_leads_dollar ) + leads_closed[lc].worth ? parseInt( leads_closed[i].worth ) : 0;
                    ;
                    lc++;
                }
                lc = 0;
                while( lc < leads_contacted.length ){
                    accomplished_contacted_leads_dollar = parseInt( accomplished_contacted_leads_dollar ) + leads_contacted[lc].worth ? parseInt( leads_contacted[i].worth ) : 0;
                    
                    lc++;
                }
                lc = 0;
                while( lc < converted_lead.length ){
                    accomplished_converted_leads_dollar = parseInt( expected_closed_leads_dollar ) + converted_lead[lc].worth ? parseInt( converted_lead[i].worth ) : 0;
                    
                    lc++;
                }
                mytarget[i].achieved_new_leads_dollar_value = accomplished_new_leads_dollar;
                mytarget[i].achieved_contacted_leads_dollar_value = accomplished_contacted_leads_dollar
                mytarget[i]. achieved_closed_leads_dollar_value = accomplished_converted_leads_dollar;
                i++;
            }
            resolve(mytarget);
        } catch ( err ){
            reject( err );
        }
    });
}

// GET EXPECTED LEADS REVENUE
function getExpectedRevenueGraphByMonth( isOrganisation ){
    return new Promise( async(resolve, reject) => {
        try{
            var userInfo = currentContext.getCurrentContext();
            var entityId = "";
            if( isOrganisation === "false" ){ 
                entityId = userInfo.userId;
            }
            const currentYear = new Date().getFullYear();
            // key, qyear, qassigned, qstatus, targetType  key, qyear, sumBy, qassigned, qstatus
            let expectedData = await targetModel.groupByKeyAndCountDocumentsByMonth_v2( "createdAt", currentYear, entityId, "ACTIVE", "MEMBER" );
            let acquiredData = await leadModel.groupByKeyAndCountDocumentsByMonth_v3( "createdAt", currentYear, "$worth", entityId,  "CONVERTED" );
            let months = moment.monthsShort();
            let response = { 
                "labels": months , 
                "expected_revenue":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                "acquired_revenue":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, null]
            };
            months.forEach((val, index)=>{
                let leadData = expectedData.find( o => o._id === (index+1) );
                let worthData = acquiredData.find( o => o._id === (index+1) );
                leadData = leadData ? leadData : undefined;
                worthData = worthData ? worthData : undefined;
                let sum = 0;
                if( leadData ){ 
                    leadData.closed_leads_dollar_value.forEach(element => {
                        sum = sum + parseInt( element );
                    });
                }
                response.expected_revenue[index] = sum !== 0 ? sum : undefined;
                response.acquired_revenue[index] = worthData ? worthData.count : undefined;
                // FIND DATA OF THAT MONTH;
            });
            resolve( response );
        } catch ( err ){
            reject( err );
        }
    })   
}




// GET CURRENT MONTH REVENUE DATA
function getCurrentMonthRevenue( isOrganisation ){
    return new Promise( async ( resolve, reject ) => {
        try{
            var userInfo = currentContext.getCurrentContext();
            var entityId = "";
            if( isOrganisation === "false" || !isOrganisation ){ 
                entityId = userInfo.userId;
            }
            console.log(  "Helo");
            const currentYear = new Date().getFullYear();
            let expectedData = await targetModel.groupByKeyAndCountDocumentsByMonth_v2( "createdAt", currentYear, entityId, "ACTIVE", "MEMBER" );
            let acquiredClosedData = await leadModel.groupByKeyAndCountDocumentsByMonth_v3( "createdAt", currentYear, "$worth", entityId,  "CONVERTED" );
            let findCurrentQuarter = {};
            
            Object.keys( Quarters ).forEach( quarterk => {
                var quarter = Quarters[ quarterk ];
                if(quarter.includes(moment().format('MMM'))){
                    findCurrentQuarter = quarter;
                }
            });
            let response = {
                "monthly_revenue":{ "expected":0, "closed":0, "leads_closed":0 },
                "quarterly_revenue":{ "expected":0, "closed":0, "leads_closed":0 },
                "pending_leads":0,
                "leads_closed":0
            }
            let currentMonth = moment().month() +1;
            let currentMonthExpectedData = expectedData.filter( o => o._id === currentMonth)[0];
            let currentacquiredClosedData = acquiredClosedData.filter( o => o._id === currentMonth)[0];
            if( currentMonthExpectedData ){
                let closed_lead_dollar_amt = 0;
                currentMonthExpectedData.closed_leads_dollar_value.forEach( elem => { closed_lead_dollar_amt =  closed_lead_dollar_amt + parseInt( elem ) });
                response.monthly_revenue.expected = closed_lead_dollar_amt;
            } 
            if( currentacquiredClosedData ){
                response.monthly_revenue.closed = currentacquiredClosedData.count;
                response.leads_closed = currentacquiredClosedData.worthAmt.length;
            }
            findCurrentQuarter = findCurrentQuarter.map( data => moment().month(data).format('M') );
            let currentQuarterExpectedData = expectedData.filter( o => ( o._id == findCurrentQuarter[0] || o._id == findCurrentQuarter[1] || o._id == findCurrentQuarter[2] ));
            let curentQuarterClosedData = acquiredClosedData.filter( o => ( o._id == findCurrentQuarter[0] || o._id == findCurrentQuarter[1] || o._id == findCurrentQuarter[2] ));
            if( currentQuarterExpectedData.length > 0 ){
                let closed_quarter = 0;
                currentQuarterExpectedData.forEach( elem => {
                    let closed_lead_dollar_amt = 0;
                    elem.closed_leads_dollar_value.forEach( elem => { 
                        closed_lead_dollar_amt =  closed_lead_dollar_amt + parseInt( elem ) 
                    });
                    closed_quarter  = parseInt(closed_quarter)  + parseInt( closed_lead_dollar_amt );
                });
                response.quarterly_revenue.expected = closed_quarter;
            }
            if( curentQuarterClosedData.length > 0 ){
                let closed_lead_dollar_amt = 0;
                curentQuarterClosedData.forEach( elem => {
                    closed_lead_dollar_amt = closed_lead_dollar_amt + elem.count;

                });
                response.quarterly_revenue.closed = closed_lead_dollar_amt;
            }
        resolve( response );
        } catch( err ){
            reject( err );
        }
    })
} 

module.exports = targetService;


