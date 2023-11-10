let workspaceName = window.location.host.split(".")[0];

let stripeTestKey =
  "pk_test_51HmAm5FHfcG4tGd9aohTVm82AnYxKw99gt6MT15UgLAhwdqLAFf9dYmmqrSAHXa1KusgT2kpaof66piYsmXP821y00c3qGAgqo";

let stripeLiveKey =
  "pk_live_51HmAm5FHfcG4tGd9YVzI7auPaN9TYLy4CXf82en94LYae589k2JFgzODQHJPUkssTo4vKRT52SSGut3itBP0YCVL00tQFlrT30";
module.exports = {
  workspaceId:
    process.env.NODE_ENV === "development" ? "reftestnew" : workspaceName,

  stripeApiKey:
    process.env.NODE_ENV === "development" ? stripeTestKey : stripeLiveKey,

  url:
    process.env.NODE_ENV === "development"
      ? "http://localhost:9010"
      : `https://${workspaceName}.dominate.ai`,
  // `https://${workspaceName}.dominate.ai`,
  // url: `http://localhost:9010`,
  //"https://login.dominate.ai"
};

// http://13.233.136.241:9010
//
//13.233.136.241
