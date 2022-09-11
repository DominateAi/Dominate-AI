var cron = require('node-cron');
const MongoClient = require('mongodb').MongoClient;
const dbName = 'dominate_master';
const url = 'mongodb://127.0.0.1:27017';
 
/*all scripts taken from - https://crontab.guru/*/

cron.schedule('0 0 1 1,2,3,4,5,6,7,8,9,10,11,12 *', () => {
 monthly()
});

cron.schedule('0 0 1 1,4,7,10 *', () => {
  quarterly()
 });

 cron.schedule('0 0 1 6 *', () => {
  biannually()
 });

 cron.schedule('0 0 1 1 *', () => {
  annually()
 });

// async function testing (){
//   return new Promise((resolve,reject)=>{
//     await MongoClient.connect( url,{ useUnifiedTopology: true }, async function( err, client ){
//           try{
//               const masterDb = client.db( dbName );
//               let allOrganisations = await masterDb.collection('organizations').find().toArray();
//               allOrganisations.forEach( async ( elem, index ) => {
//                   try{
//                       const workspaceId = elem.workspaceId;
//                       if( workspaceId !== "dominateadmin"  ){
//                           let tenantDb = client.db( workspaceId );
//                           let today = new Date();
                          
//                           await tenantDb.collection('users')
//                                           .updateMany(
//                                               {"demo": true},
//                                               {$set:{"demo":false}}
//                                               );
                          
//                       }
//                   } catch ( err ){
//                       console.log(err);
//                       client.close();
//                   }
//               })
//               client.close();
//              return resolve();
//           } catch ( err ){
//               client.close();
//               console.log( err );
//               return reject(err);
//           }
//      });
//   });
// };


async function getData(allOrganisations, status, type, frequency){
  
  allOrganisations.forEach( async ( elem, index ) => {
    const client = await MongoClient.connect(url, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true,
    });
    try{
        const workspaceId = elem.workspaceId;
        if( workspaceId !== "dominateadmin"  ){
            let tenantDb = client.db( workspaceId );
            
            deals = await tenantDb.collection('deals').find({"status":status,"type":type, "frequency":frequency}).toArray()
            if(Array.isArray(deals) && deals.length){
            for(i in deals){
              console.log(deals[i]._id, deals[i].value)
              await tenantDb.collection('revenues').insertOne({
                "deal":deals[i]._id,
                "revenueAmount":deals[i].value
              })
            }
            console.log("Org Revenues Have Been Updated", workspaceId)
          }
          else{
  
          }
                                client.close();
            
        }
    } catch ( err ){
        console.log(err);
        client.close();
    }
  })
  return("all ok");
  }

async function monthly(){
const client = await MongoClient.connect(url, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true,
});
// specify the DB's name
const masterDb = client.db( dbName );
// execute find query
let allOrganisations = await masterDb.collection('organizations').find({}).toArray();
         let temp = await getData(allOrganisations, "CLOSED", "RECURRING","MONTHLY")     
client.close();
}


async function quarterly(){
  const client = await MongoClient.connect(url, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
  });
  // specify the DB's name
  const masterDb = client.db( dbName );
  // execute find query
  let allOrganisations = await masterDb.collection('organizations').find({}).toArray();
           let temp = await getData(allOrganisations, "CLOSED", "RECURRING","QUARTERLY")     
  client.close();
  }


  async function biannual(){
    const client = await MongoClient.connect(url, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true,
    });
    // specify the DB's name
    const masterDb = client.db( dbName );
    // execute find query
    let allOrganisations = await masterDb.collection('organizations').find({}).toArray();
             let temp = await getData(allOrganisations, "CLOSED", "RECURRING","BIANNUAL")     
    client.close();
    }
    

    async function annual(){
      const client = await MongoClient.connect(url, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true,
      });
      // specify the DB's name
      const masterDb = client.db( dbName );
      // execute find query
      let allOrganisations = await masterDb.collection('organizations').find({}).toArray();
               let temp = await getData(allOrganisations, "CLOSED", "RECURRING","ANNUAL")     
      client.close();
      }
      
  


