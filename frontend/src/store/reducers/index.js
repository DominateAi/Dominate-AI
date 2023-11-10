import { combineReducers } from "redux";
import authReducer from "./authReducer";
import leadReducer from "./leadReducer";
import errorReducer from "./errorReducer";
import employeeReducer from "./employeeReducer";
import planReducer from "./planReducer";
import paymentReudcer from "./paymentReducer";
import customerReducer from "./customerReducer";
import taskReducer from "./taskReducer";
import filterReducer from "./filterReducer";
import calenderReducer from "./calenderReducer";
import dashboardReducer from "./dashboardReducer";
import reportsReducer from "./reportsReducer";
import quotationReducer from "./quotationReducer";
import superAdminReducer from "./superAdminReducer";
import chatReducer from "./chatReducer";
import searchReducer from "./searchReducer";
import proposalMainReducer from "../../components/desktop/ProposalEditor/store/reducers/index";
import commandReducer from "./commandReducer";
import importLeadReducer from "../../components/desktop/ImportLeads/store/reducers/index";
import dealsPipelineReducer from "./dealsPipelineReducer";
import accountReducer from "./accountReducer";
import contactReducer from "./contactReducer";
import dealsReducer from "./dealsReducer";
import proposalsByCraftReducer from "./proposalsByCraftReducer";
import vaultReducer from "./vaultReducer";
import productAndServiceReducer from "./productAndServiceReducer";
import workspaceActivityReducer from "./workspaceActivityReducer";
import microsoftMailReducer from "./microsoftMailReducer";
import sequenceReducer from "./sequenceReducer";
import leadsPipelineReducer from "./leadsPipelineReducer";
import referralReducer from "./referralReducer";

export default combineReducers({
  auth: authReducer,
  leads: leadReducer,
  errors: errorReducer,
  employee: employeeReducer,
  plans: planReducer,
  payment: paymentReudcer,
  customer: customerReducer,
  tasks: taskReducer,
  filterName: filterReducer,
  calender: calenderReducer,
  dashboard: dashboardReducer,
  reports: reportsReducer,
  quotation: quotationReducer,
  superAdmin: superAdminReducer,
  chats: chatReducer,
  search: searchReducer,
  proposals: proposalMainReducer,
  commandCenter: commandReducer,
  importLeads: importLeadReducer,
  dealsInPipeline: dealsPipelineReducer,
  account: accountReducer,
  contact: contactReducer,
  deals: dealsReducer,
  proposalsByCraft: proposalsByCraftReducer,
  vault: vaultReducer,
  productAndServices: productAndServiceReducer,
  workspaceActivity: workspaceActivityReducer,
  microsoftMailer: microsoftMailReducer,
  sequence: sequenceReducer,
  leadsPipeline: leadsPipelineReducer,
  referral: referralReducer,
});
