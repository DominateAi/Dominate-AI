import React, { Component } from "react";
import "./App.scss";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
//redux setup
import { Provider } from "react-redux";
import store from "./store/store";

import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";

import Default from "./components/Default";
import AdminEmployees from "./components/desktop/employees/AdminEmployees";
import Login from "./components/desktop/login-signup/Login";
import EmployeesData from "./components/desktop/employees/EmployeesData";
import TaskList from "./components/desktop/tasklist/TaskList";
import CalendarNew from "./components/desktop/calendar-new/CalendarNew";
import WorkSpaceLogin from "./components/desktop/login-signup/WorkSpaceLogin";
import AddOrganization from "./components/desktop/login-signup/AddOrganization";
import setAuthToken from "./store/utils/setAuthToken";
import { SET_LOGIN } from "./../src/store/types";
import PrivateRoute from "./store/Privateroute/PrivateRoute";
import PaymentPrivateRoute from "./store/Privateroute/PaymentPrivateRoute";
import SuperAdminPrivateRoute from "./store/Privateroute/SuperAdminPrivateRoute";
import AddEmployee from "./components/desktop/set-employee-password/SetEmployeePassword";

import Quotations from "./components/desktop/quotations/Quotations";

import Alert from "react-s-alert";

import "react-s-alert/dist/s-alert-default.css";
import "react-s-alert/dist/s-alert-css-effects/slide.css";
import Profile from "./components/desktop/profile/Profile";
import MobileNavbar from "./components/mobile/common/MobileNavbar";
import LeadsMobile from "./components/mobile/leads/LeadsMobile";
import UserResetPassword from "./components/desktop/login-signup/UserResetPassword";
import SuccessMessage from "./components/desktop/popups/SuccessMessage";
import ForgetPassword from "./components/desktop/login-signup/ForgetPassword";
import ForgetPasswordConfirmation from "./components/desktop/login-signup/ForgetPasswordConfirmation";
import CustomersMobile from "./components/mobile/customers/CustomersMobile";
import EmployeesMobile from "./components/mobile/employees/EmployeesMobile";
import PlansMobile from "./components/mobile/plans/PlansMobile";
import SettingsMobile from "./components/mobile/settings/SettingsMobile";
import Message from "./components/desktop/message/Message";
// import ProposalTemplate from "./components/desktop/proposals/ProposalTemplate";
import Workspaces from "./components/super-admin/desktop/workspaces/Workspaces";
import Users from "./components/super-admin/desktop/workspaces/Users";
// import create-s from "./components/super-admin/desktop/workspaces/create-s";
import InvoiceTemplate1 from "./components/invoiceTemplates/InvoiceTemplate1";
import ProposalEditor from "./components/desktop/ProposalEditor/Component/ProposalMainEditorPanel";
import DashboardMobile from "./components/mobile/dashboard/DashboardMobile";
import { LoginSignup } from "./components/mobile-new/auth/LoginSignup";
import DashboardMobileNew from "./components/mobile-new/dashboard/DashboardMobileNew";
import UserDahsboardMain from "./components/desktop/user-dashboard/UserDahsboardMain";
import UserDahsboardMainGrid from "./components/desktop/user-dashboard/UserDahsboardMainGrid";
import LeadsNew from "./components/desktop/leads/LeadsNew";

import LeadsNewDetails from "./components/desktop/leads-new-details-pages/LeadsNewDetails";
import LeadsPipelineNewDetails from "./components/desktop/leads-pipeline-new-details-pages/LeadsPipelineNewDetails";
import MembersNew from "./components/desktop/employees/MembersNew";
import MembersNewDetails from "./components/desktop/employees-new-details/MembersNewDetails";
import SalesCentreMenu from "./components/desktop/sales-centre-menu/SalesCentreMenu";
import AccountsNew from "./components/desktop/accounts-new/AccountsNew";
import AccountsDetailNew from "./components/desktop/accounts-detail-new/AccountsDetailNew";
import DealPipelines from "./components/desktop/deal-pipelines/DealPipelines";
import DealPipelinesDetail from "./components/desktop/deal-pipelines-detail/DealPipelinesDetail";
import DealsDetails from "./components/desktop/deal-pipelines-detail/DealsDetails";
import ClosedDealsDetails from "./components/desktop/deal-pipelines-detail/ClosedDealsDetails";
import dateFns from "date-fns";
import EmailVerify from "./components/desktop/login-signup/EmailVerify";
import { url } from "./store/actions/config";
import axios from "axios";
import isEmpty from "./store/validations/is-empty";
import Interceptor from "./store/Interceptor";
import ProductsAndServicesMain from "./components/desktop/products-and-services/ProductsAndServicesMain";
import ErrorBoundary from "./components/ErrorBoundary";
import LeadsPipelineMain from "./components/desktop/leadsPipeline/LeadsPipelineMain";

// check if token exist or not , if exist make user login

var data = JSON.parse(localStorage.getItem("Data"));
if (data) {
  // Set auth token header auth
  setAuthToken(data.token);
  store.dispatch({
    type: SET_LOGIN,
    payload: data,
  });
}

export class App extends Component {
  constructor() {
    super();
    this.state = {
      // require for responsive window
      windowWidth: window.innerWidth,
    };
  }

  /*========================================================
                mobile view event handlers
  ========================================================*/

  componentDidMount() {
    window.addEventListener("resize", this.handleWindowResize);

    window.addEventListener("offline", function (e) {
      console.log("offline");
      Alert.success(`<h4>Offline</h4>`, {
        position: "top-right",
        effect: "slide",
        beep: false,
        html: true,
        timeout: 5000,
        // offset: 100
      });
    });

    window.addEventListener("online", function (e) {
      console.log("online");
      Alert.success(`<h4>online</h4>`, {
        position: "top-right",
        effect: "slide",
        beep: false,
        html: true,
        timeout: 5000,
        // offset: 100
      });
    });
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleWindowResize);
  }

  handleWindowResize = () => {
    this.setState({
      windowWidth: window.innerWidth,
    });
  };

  /*========================================================
                end mobile view event handlers
  ========================================================*/

  render() {
    return (
      <Provider store={store}>
        <Router>
          <ErrorBoundary>
            <Switch>
              <Route path="/verifyEmail/:id" component={EmailVerify} />
              <Route path="/resetPassword/:id" component={UserResetPassword} />
              <Route exact path="/forget-password" component={ForgetPassword} />
              <Route
                exact
                path="/confirmation"
                component={ForgetPasswordConfirmation}
              />
              {/* demo success message */}
              <Route exact path="/success-msg" component={SuccessMessage} />
              <PrivateRoute
                exact
                path="/employee-data"
                component={EmployeesData}
              />
              <PrivateRoute
                exact
                path="/main-calender"
                component={CalendarNew}
              />

              {/* invoice template */}
              <Route exact path="/invoice" component={InvoiceTemplate1} />

              {process.env.NODE_ENV === "development" ? (
                <Route exact path="/" component={Login} />
              ) : (
                <Route exact path="/" component={Login} />
              )}
              <Route exact path="/" component={Login} />
              <Route path="/login" component={WorkSpaceLogin} />
              <Route path="/create-organization" component={AddOrganization} />

              {/* <PrivateRoute exact path="/user-dashboard" component={Dashboard} /> */}
              <PrivateRoute
                path="/leads-pipeline"
                component={LeadsPipelineMain}
              />
              <PrivateRoute
                exact
                path="/dashboard"
                component={UserDahsboardMain}
              />
              <PrivateRoute
                exact
                path="/dashboard-grid"
                component={UserDahsboardMainGrid}
              />
              {/* <PrivateRoute exact path="/leads" component={Leads} /> */}
              <PrivateRoute exact path="/leads-new" component={LeadsNew} />
              <PrivateRoute
                exact
                path="/leads-new-details"
                component={LeadsNewDetails}
              />
              <PrivateRoute
                exact
                path="/leads-new-pipeline-details"
                component={LeadsPipelineNewDetails}
              />
              {/* <PrivateRoute exact path="/customers" component={Customers} /> */}
              <PrivateRoute
                exact
                path="/admin-employees"
                component={AdminEmployees}
              />
              <PrivateRoute exact path="/members-new" component={MembersNew} />
              <PrivateRoute
                exact
                path="/members-new-details"
                component={MembersNewDetails}
              />

              <PrivateRoute exact path="/task-list" component={TaskList} />

              <Route path="/join/:id" component={AddEmployee} />
              <PrivateRoute exact path="/profile" component={Profile} />
              <PrivateRoute exact path="/quotations" component={Quotations} />

              <PrivateRoute exact path="/message" component={Message} />

              {/* super admin routes */}
              <SuperAdminPrivateRoute
                exact
                path="/create-"
                component={Workspaces}
              />
              <SuperAdminPrivateRoute
                exact
                path="/create--workspace"
                component={Users}
              />
              {/* super admin routes end */}

              {/* end common */}

              {/* desktop routes */}
              {this.state.windowWidth >= 768 && (
                <Switch>
                  <PrivateRoute
                    exact
                    path="/proposal-editor"
                    component={ProposalEditor}
                  />
                  <PrivateRoute
                    exact
                    path="/proposal-editor/:id"
                    component={ProposalEditor}
                  />
                  {/* iteration 2 */}
                  {/* main page sales centre */}
                  <PrivateRoute
                    exact
                    path="/sales-centre"
                    component={SalesCentreMenu}
                  />
                  {/* accounts */}

                  <PrivateRoute
                    exact
                    path="/accounts-new"
                    component={AccountsNew}
                  />
                  <PrivateRoute
                    exact
                    path="/accounts-detail-new"
                    component={AccountsDetailNew}
                  />

                  {/* deal pipelines */}
                  <PrivateRoute
                    exact
                    path="/deal-pipelines"
                    component={DealPipelines}
                  />
                  <PrivateRoute
                    exact
                    path="/deal-pipelines-detail"
                    component={DealPipelinesDetail}
                  />
                  <PrivateRoute
                    exact
                    path="/deals-details"
                    component={DealsDetails}
                  />
                  <PrivateRoute
                    exact
                    path="/closed-deals-details"
                    component={ClosedDealsDetails}
                  />

                  {/* products and services */}
                  <PrivateRoute
                    exact
                    path="/products-and-services"
                    component={ProductsAndServicesMain}
                  />

                  {/* default */}
                  <Route component={Default} />
                </Switch>
              )}
              {/* end desktop routes */}

              {/* mobile routes */}
              {this.state.windowWidth <= 767 && (
                <Switch>
                  <Route exact path="/menu-mobile" component={MobileNavbar} />
                  <Route component={Default} />
                </Switch>
              )}
              {/* end mobile routes */}
            </Switch>
          </ErrorBoundary>
        </Router>
        <span>{this.props.children}</span>
        <Alert stack={{ limit: 3 }} />
      </Provider>
    );
  }
}

export default App;
