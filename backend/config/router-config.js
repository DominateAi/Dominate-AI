require('./passport');

const api = require('./api-config');
const express = require("express");
const app = api.app;
const path  = require('path');
const logger = require('../config/winston')(__filename);
const Boom = require('boom')
const passport = require('passport');

var Multer = require("multer");
var Minio = require("minio");
var configResolve = require("../common/configResolver");
var minioConfig = configResolve.getConfig().minio;
var environmentConfig = configResolve.getConfig();
//var syncPlans = require("./onStartup/SyncPlans");
 
const tokenPareUtil = require('../common/tokenParserUtil')
const UserRoute = require('../api/routes/user.route');
const roleRoute = require('../api/routes/role.route');
const leadRoute = require('../api/routes/lead.route');
const customerRoute = require('../api/routes/customer.route');
const taskRoute = require('../api/routes/task.route');
const presentationRoute = require('../api/routes/presentation.route');
const proposalRoute = require('../api/routes/proposal.route');
const quotationRoute = require('../api/routes/quotation.route');
const secureRoute = require('../api/routes/secure.route');
const graphRoute = require('../api/routes/graph.route');
const leaveRoute = require('../api/routes/leave.route');
const activityRoute = require('../api/routes/activity.route');
const noteRoute = require('../api/routes/note.route');
var subscriptionRoute = require('../api/routes/subscription.route');
var vaultRoute = require('../api/routes/vault.route');
var emailRoute = require('../api/routes/email.route');
var widgetRoute = require('../api/routes/widget.route');
var dashboardRoute = require('../api/routes/dashboard.route');
var meetingRoute = require('../api/routes/meeting.route');
var emailTemplateRoute = require('../api/routes/emailTemplate.route');
var chatRoute = require('../api/routes/chat.route');
var notificationRoute = require('../api/routes/notification.route');
var callRoute = require('../api/routes/call.route');
var billingRoute = require('../api/routes/billing.route');
var followupRoute = require('../api/routes/followup.route');
var calenderRoute = require('../api/routes/calender.route');
var targetRoute = require('../api/routes/target.route');
var pipelineListRoute = require('../api/routes/pipelineList.route');
var connectRoute = require('../api/routes/connect.route');
var accountRoute = require('../api/routes/account.route');
var contactRoute = require('../api/routes/contact.route');
var dealRoute = require('../api/routes/deal.route');
var pipelineRoute = require('../api/routes/pipeline.route');
var revenueRoute = require('../api/routes/revenue.route');
var logRoute = require('../api/routes/log.route');
var itargetRoute = require('../api/routes/itarget.route');
var otargetRoute = require('../api/routes/otarget.route');
var achievementRoute = require('../api/routes/achievement.route');
var leadSearchRoute = require('../api/routes/leadSearch.route');
var fieldRoute = require('../api/routes/field.route');
var fvalueRoute = require('../api/routes/fvalue.route');
var idealtargetRoute = require('../api/routes/idealtarget.route');
var odealtargetRoute = require('../api/routes/odealtarget.route')
var dealachieveRoute = require('../api/routes/dealachieve.route');
var itemRoute = require('../api/routes/item.route');
var folderRoute = require('../api/routes/folder.route');
var fileRoute = require('../api/routes/file.route')
var wactRoute = require('../api/routes/workactivity.route')
var campaignRoute = require('../api/routes/campaign.route')
var elistRoute = require('../api/routes/elist.route')
var regdemailRoute = require('../api/routes/regdemail.route')
var verifiedemailRoute = require('../api/routes/verifiedemail.route')
var pipeLeadRoute = require('../api/routes/pipeLead.route')
var leadPipelineRoute = require('../api/routes/leadPipeline.route')
var leadStageRoute = require('../api/routes/leadStage.route')
var refCodeRoute = require('../api/routes/refCode.route')
var referralRoute = require('../api/routes/referral.route')

/*DECLARE ROUTES END*/

const router = express.Router();
app.use('/api', passport.authenticate('jwt', {session: false}), router);
UserRoute.init(router);
roleRoute.init(router);
leadRoute.init(router);
customerRoute.init(router);
taskRoute.init(router);
presentationRoute.init(router);
proposalRoute.init(router);
quotationRoute.init(router);
secureRoute.init(router);
graphRoute.init(router);
leaveRoute.init(router);
activityRoute.init(router);
noteRoute.init(router);
subscriptionRoute.init(router);
vaultRoute.init(router);
emailRoute.init(router);
widgetRoute.init(router);
dashboardRoute.init(router);
meetingRoute.init(router);
emailTemplateRoute.init(router);
chatRoute.init(router);
notificationRoute.init(router);
callRoute.init(router);
billingRoute.init(router);
followupRoute.init(router);
calenderRoute.init(router);
targetRoute.init(router);
pipelineListRoute.init(router);
revenueRoute.init(router);
connectRoute.init( router );
accountRoute.init(router);
contactRoute.init(router);
dealRoute.init(router);
pipelineRoute.init(router);
logRoute.init(router);
itargetRoute.init(router);
otargetRoute.init(router);
achievementRoute.init(router);
leadSearchRoute.init(router);
fieldRoute.init(router);
fvalueRoute.init(router);
idealtargetRoute.init(router);
odealtargetRoute.init(router);
dealachieveRoute.init(router);
itemRoute.init(router);
folderRoute.init(router);
fileRoute.init(router);
wactRoute.init(router);
campaignRoute.init(router);
elistRoute.init(router);
regdemailRoute.init(router);
verifiedemailRoute.init(router);
pipeLeadRoute.init(router);
leadPipelineRoute.init(router);
leadStageRoute.init(router);
refCodeRoute.init(router);
referralRoute.init(router);
/*INIT ROUTES END*/

const public = require('../api/routes/public.route');
const Achievement = require('../api/models/achievement.model');
app.use('/public', public);

//set static folder
app.use('/' ,express.static(path.join(__dirname.replace("config",""), 'public')));

// index route
app.get('/', (req,res) => {
    res.send('hello world');
});



app.all('*',(req,res, next) => {
    return next(Boom.notFound('Invalid Request'));
});

app.use((err, req, res, next) => {
    console.error("Error: " + err);
    return res.status(err.output != undefined ? err.output.statusCode : 500).json(err.output != undefined ? err.output.payload : { error : err.message });
})

//on startup execution
// syncPlans.syncPlan();


const routerConfig = {
    app: app
}

module.exports = routerConfig;