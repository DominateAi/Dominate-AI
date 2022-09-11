const https = require('https');
const schedule = require('node-schedule');

var rule = new schedule.RecurrenceRule();

//****HAVENT SYNCED CANCEL ORGS HERE?? */ -> it is called from sync orgs route itself :)
//****WEBHOOKS RECEIVING RESPONSES TASK */
rule.hour = 23;
//calls every 1 minute
//rule.minute = 1;

const options = {
    //hostname: 'login.dominate.ai',
    hostname: 'localhost',
    //port: 443,
    port: 9010,
//calls the api for syncing organizations
    path: '/api/organizations/sync',
//calls using the GET method
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
//uses a token that never expires
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6ImJkY2RjOTljLTIxN2YtMTFlOS1hYjE0LWQ2NjNiZDg3M2Q5MyIsImVtYWlsIjoiZG9taW5hdGVhZG1pbkBkb21pbmF0ZS5jb20iLCJ3b3Jrc3BhY2VJZCI6ImRvbWluYXRlYWRtaW4ifSwic3ViIjoiU3lzdGVtX1Rva2VuIiwiaXNzIjoiZG9taW5hdGUuYWkiLCJhdWQiOiJkb21pbmF0ZWFkbWluQGRvbWluYXRlLmFpIiwiaWF0IjoxNTc0ODg2NjQ0fQ.TUt9TnXJxttAOCq7fBytt0i7f7bu-KyaHGcNXgYiXFs'
    }
}

var j = schedule.scheduleJob(rule, function () {
    console.log('Dominate schedular invoked...');
//places an https request using values present in the options object 
    const req = https.request(options, res => {
        console.log(`statusCode: ${res.statusCode}`);
//using the scheduler, we called the api and the response that we received is then mentioned in the console
        res.on('data', d => {
            console.log('Got Result: ' + new Date());
        })
    })

    req.on('error', error => {
        console.error(error)
    })

    req.end();

});



/** CRON */
//There are multiple scripts here that will run at different frequencies based on financial year
//First script runs at the end of every month and finds the deals that have status = closed, type = recurring and frequency = monthly, it will then check the revenues table and if any revenue has been added for this deal within ths month, that means that the deal was closed first time this month only, so it won't do anything but if the deal has no revenue associated with it for this month, then we can go ahead and add a revenue equal to the worth of this deal.
//Second script runs every quarter and find the deals that have status = closed, type = recurring and frequency = quarlterly
//Third script runs every six months and find the deals that have status = closed, type = recurring and frequency = bi-annual
//Fourth script runs annually and find the deals that have status = closed, type = recurring and frequency = annual