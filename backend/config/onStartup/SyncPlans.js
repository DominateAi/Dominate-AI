

var syncPlanService = {
  syncPlan: syncPlan
}


// function syncPlan(){
//     return new Promise((resolve,reject) => {
//         razorPayService.getAllPlans().then((razorPayPlans)=>{
// //if the plans at razorpay do not exist, i.e length is 0, we go inside the 
//             if(razorPayPlans != undefined && razorPayPlans.items.length == 0){
//                 console.log("Creating plans")
//                 plans.forEach((p)=>{
// //for each plan, checks if it's not an enterprise plan
//                     if(p.isEnterprise == false){
// //if it's any plan except for enterprise, it will create plans at razorpay side for it
//                         razorPayService.createPlan(p);
//                     }
//                 });
//                 resolve(true);
//             }else{
//                 console.log("Plan exists, so skipping plan creation.")
//             }
//         }).catch((err)=>{
//             console.log(err.message);
//             reject(err);
//         });
//     });
    
// }
 
// async function syncPlan(){
// try{
//     const plans = await razorPayService.getAllPlans()
//     if(plans != undefined && plans.items.length == 0){
//         console.log("Creating plans")
//                 plans.forEach((p)=>{
// //for each plan, checks if it's not an enterprise plan
//                     if(p.isEnterprise == false){
// //if it's any plan except for enterprise, it will create plans at razorpay side for it
//                         razorPayService.createPlan(p);
//                     }
//                 });
//                 resolve(true);
//             }else{
//                 console.log("Plan exists, so skipping plan creation.")
//             }
//         }catch(err){console.log(err.message);}
//         }

//     syncPlan();

module.exports = syncPlanService;