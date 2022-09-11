const mongoose = require('mongoose');
var configResolve = require("../common/configResolver");
var server_secert = configResolve.getConfig().server_secert;
const passportJWT = require("passport-jwt");
const passport = require('passport');
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const boom = require('boom');
const roleService = require('../api/services/role.service')

const User = require('../api/models/user.model');
var currentContext = require('../common/currentContext');
var accessResolver = require('../common/accessResolver');
const Status = require('../common/constants/Status');
var errorCode = require('../common/error-code');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

 

// const LocalStrategy = require('passport-local').Strategy;
// passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
//   var context = currentContext.getCurrentContext();
//   console.log("workspaceId: " + context.workspaceId);
// //in the public login function, we had set the context with workspace id, we are using the same here to search the particular db for this user
//   User.db.useDb(context.workspaceId).model('Users').findOne({ email: email.toLowerCase() } , (err, user) => {
//     if (err) { return done(err); }
//     if (!user) {
//       return done(null, false, { msg: `Email ${email} not found.` });
//     }
//     console.log("user status: "+ user.status);
//     if(user.status == Status.ACTIVE){
//       user.comparePassword(password,  (err, isMatch) => {
//         if (err) { return done(err); }
//         user.workspaceId = context.workspaceId;
//         if (isMatch) {
//           return done(null, user);
//         }
//         return done(null, false, { msg: 'Invalid email or password.' });
//       });
//     }else{
//       console.log(user.email + ", user not active");
//       return done(errorCode.USER_NOT_ACTIVE); 
//     }
//   }).populate('role', 'name');
// }));


const LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
  // var context = currentContext.getCurrentContext();
  // console.log("workspaceId: " + context.workspaceId);
//in the public login function, we had set the context with workspace id, we are using the same here to search the particular db for this user
  User.findOne({ email: email.toLowerCase() } , (err, user) => {
    if (err) { return done(err); }
    if (!user) {
      return done(null, false, { msg: `Email ${email} not found.` });
    }
    console.log("user status: "+ user.status);
    //if(user.status == Status.ACTIVE){
      user.comparePassword(password,  (err, isMatch) => {
        if (err) { return done(err); }
        //user.workspaceId = context.workspaceId;
        if (isMatch) {
          return done(null, user);
        }
        return done(null, false, { msg: 'Invalid email or password.' });
      });
    // }else{
    //   console.log(user.email + ", user not active");
    //   return done(errorCode.USER_NOT_ACTIVE); 
    // }
  }).populate('role', 'name');
}));


passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken({failmessage: 'Invalid Token'}),
  secretOrKey   : server_secert,
  passReqToCallback: true
},
function (req, jwtPayload, cb) {
  //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
  var workspaceId = jwtPayload.user.workspaceId;
  //if type of jwt is not undefined and type is refresh, then say access denied
  if(jwtPayload.type != undefined && jwtPayload.type == 'REFRESH'){
    return cb(boom.forbidden('Access Denied'));
  }
//in jwt payload, we have user id, so we will get the user from the d.b
  return User.db.useDb(workspaceId).model('Users').findById(jwtPayload.user._id).populate('role')
      .then(async user => {
        var context = {};
        context.email = user.email;
        context.userId = user._id;
        context.roleId = user.roleId;
        context.workspaceId = workspaceId;
        context.organizationId = jwtPayload.user.organizationId;
        context.isAdmin = false;
        currentContext.setCurrentContext(context);
        var adminRole = await roleService.getRoleByRoleName('Administrator');
        if(adminRole != undefined && adminRole._id == user.role._id){
          context.isAdmin = true;
        }
        if(jwtPayload.sub == 'System_Token'){
          context.isSystemToken = true;
        }
        if(!accessResolver.isAuthorized(req, user)){
          return cb(boom.methodNotAllowed('You do not have the required permissions to access this feature, please contact your admin'));
        }
        currentContext.setCurrentContext(context);
        return cb(null, user);
      })
      .catch(err => {
          return cb(err);
      });
}
));