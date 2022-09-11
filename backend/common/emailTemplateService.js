var fs = require('fs'),
    path = require('path'),
    Handlebars = require('handlebars');
var configResolve = require("./configResolver");
var config = configResolve.getConfig();


var emailTemplateService = {
    getInviteUserTemplate: getInviteUserTemplate,
    getForgotPasswordTemplate: getForgotPasswordTemplate,
    getWelcomeEmail: getWelcomeEmail,
    getVerifyEmailTemplate: getVerifyEmailTemplate
}

function getWelcomeEmail(workspaceId, workspaceUrl){
    let locals = {
        workspaceId : workspaceId,
        workspaceUrl: workspaceUrl
    };
    var source = fs.readFileSync(path.join(__dirname + "/emailTemplates/", 'createWorkspace.hbs'), 'utf8');
    // Create email generator
    var template = Handlebars.compile(source);
    return template(locals);
}

function getInviteUserTemplate(workspaceId, workspaceUrl, url){
    let locals = {
        workspaceId : workspaceId,
        workspaceUrl: workspaceUrl,
        joinUrl : url
    };
    var source = fs.readFileSync(path.join(__dirname + "/emailTemplates/", 'inviteUser.hbs'), 'utf8');
    // Create email generator
    var template = Handlebars.compile(source);
    return template(locals);
}

function getForgotPasswordTemplate(workspaceId, workspaceUrl, url){
    let locals = {
        workspaceId : workspaceId,
        workspaceUrl: workspaceUrl,
        resetPasswordUrl : url
    };
    var source = fs.readFileSync(path.join(__dirname + "/emailTemplates/", 'resetPassword.hbs'), 'utf8');
    // Create email generator
    var template = Handlebars.compile(source);
    return template(locals);
}

function getVerifyEmailTemplate(workspaceId, workspaceUrl, url){
    let locals = {
        workspaceId : workspaceId,
        workspaceUrl: workspaceUrl,
        verifyEmailUrl : url
    };
    var source = fs.readFileSync(path.join(__dirname + "/emailTemplates/", 'verifyEmail.hbs'), 'utf8');
    // Create email generator
    var template = Handlebars.compile(source);
    return template(locals);
}

module.exports = emailTemplateService;