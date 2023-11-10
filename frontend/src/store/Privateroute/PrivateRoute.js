import React from "react";

import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import FreeTrielAndSubscriptionEnded from "../../components/desktop/popups/FreeTrielAndSubscriptionEnded";
import isEmpty from "./../validations/is-empty";
import WarningBeforePlanExpired from "../../components/desktop/popups/WarningBeforePlanExpired";
import SubscriptionFailedDueToPaymentFailed from "../../components/desktop/popups/SubscriptionFailedDueToPaymentFailed";
import dateFns from "date-fns";
import OverviewDemoModalFirstTimeUser from "./../../components/desktop/overview-demo/OverviewDemoModalFirstTimeUser";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import EmailVerifySuggest from "./../../components/desktop/login-signup/EmailVerifySuggest";

const PrivateRoute = ({ component: Component, auth, ...rest }) => {
  let organisationData = JSON.parse(localStorage.getItem("oraganiationData"));
  let isRefundRequested =
    !isEmpty(organisationData) && organisationData.isRefundRequested;
  let billingInfo = !isEmpty(organisationData) && organisationData.billingInfo;
  var renderFreeTrialEndedPopup;
  var renderSubscriptionEndedPopup;
  var renderSubscriptionFailedDueToPaymentFailed;

  if (auth.isAuthenticated) {
    renderSubscriptionFailedDueToPaymentFailed = (
      <SubscriptionFailedDueToPaymentFailed open={true} />
    );

    renderFreeTrialEndedPopup = (
      <FreeTrielAndSubscriptionEnded
        heading="Sorry!"
        role={!isEmpty(auth.user.role) && auth.user.role.name}
        open={true}
        description={
          !isEmpty(auth.user.role) && auth.user.role.name == "Administrator"
            ? "Your free trial has expired. Please pay now to continue using Dominate."
            : "Sorry, your free trial ended. Please Contact Your Administrator"
        }
      />
    );
    // Subscription end popup
    renderSubscriptionEndedPopup = (
      <FreeTrielAndSubscriptionEnded
        open={true}
        role={!isEmpty(auth.user.role) ? auth.user.role.name : "Employee"}
        heading="Subscription Ended"
        description={
          ""
          // !isEmpty(auth.user.role) &&
          // auth.user.role.name === "Support" &&
          // isRefundRequested === false
          //   ? "proceedForPayment"
          //   : !isEmpty(auth.user.role) &&
          //     auth.user.role.name === "Support" &&
          //     isRefundRequested === true
          //   ? "notProceedForPayment"
          //   : "Sorry, your Subscription has been ended. Please Contact Your Administrator"
        }
      />
    );
  }

  // TAKING TOKEN AND WARNING FLAG FROM LOCALSTORAGE

  var data = JSON.parse(localStorage.getItem("Data"));
  var Warning = JSON.parse(localStorage.getItem("WarningBeforeFreeTrialEnded"));
  var verifyEmail = JSON.parse(localStorage.getItem("emailVerify"));

  if (!isEmpty(data)) {
    var currentDate = new Date();
    var currentTime = currentDate.getTime();
    var tikenExpiresOn = data.tokenExpiresOn;
  }

  // WARNING BEFORE 5 DAYS FREE TRIEL EXPIRATION

  let planExpirationDate = !isEmpty(data) && data.tenantExpiryDate;

  var dateFirst = new Date(dateFns.format(new Date(), "MM/DD/YYYY"));
  var dateSecond = new Date(dateFns.format(planExpirationDate, "MM/DD/YYYY"));
  var timeDiff = dateSecond.getTime() - dateFirst.getTime();

  var diffDays = Math.ceil(Math.abs(timeDiff) / (1000 * 3600 * 24));

  // console.log(planExpirationDate);
  // if (isEmpty(organisationData)) {
  //   return (
  //     // <Loader type="Triangle" color="#00BFFF" className="dominate-loader" />
  //     <Loader
  //       type="Triangle"
  //       color="#502EFF"
  //       height={100}
  //       width={100}
  //       //  timeout={10000} //3 secs
  //       className="dominate-loader"
  //     />
  //   );
  // } else {
  return (
    <Route
      {...rest}
      render={
        (props) =>
          // USER SUBSCRIPTION ENDED WHEN PAYMENT FAILED
          auth.isAuthenticated === true &&
          auth.user.subscriptionType === "PAID" &&
          auth.user.status === "EXPIRED" &&
          billingInfo.isOrganisationAtPendingState ? (
            renderSubscriptionFailedDueToPaymentFailed
          ) : //USER FREE TRAIL END CONDITION
          auth.isAuthenticated === true &&
            !isEmpty(organisationData) &&
            organisationData.planStatus === "TRIAL_OVER" ? (
            renderFreeTrialEndedPopup
          ) : //USER SUBSCRIPTION CANCELED  CONDITION
          auth.isAuthenticated === true &&
            // organisationData.billingId !== "" &&
            !isEmpty(organisationData) &&
            organisationData.planStatus === "CANCELLED" ? (
            <>
              {window.scrollTo(0, 0)}
              <Redirect to="/profile" />
              <Component {...props} />
            </>
          ) : //USER PAYMENT FAILED CONDITION
          auth.isAuthenticated === true &&
            // organisationData.billingId !== "" &&
            !isEmpty(organisationData) &&
            organisationData.planStatus === "PAYMENT_FAILED" ? (
            <>
              {window.scrollTo(0, 0)}
              <Redirect to="/profile" />
              <Component {...props} />
            </>
          ) : // renderSubscriptionEndedPopup
          //USER EMAIL VERIFICATION CONDITION
          auth.isAuthenticated === true &&
            auth.user.role.name === "Administrator" &&
            auth.user.verified === false &&
            verifyEmail === null ? (
            <>
              {window.scrollTo(0, 0)}
              {/* <OverviewDemoModalFirstTimeUser open={true} /> */}
              <EmailVerifySuggest />
              <Component {...props} />
            </>
          ) : (
            // : auth.isAuthenticated === true &&
            //   auth.user.subscriptionType === "FREE" &&
            //   auth.user.role.name === "Administrator" &&
            //   Warning.WarningBeforeFreeTrialEnded === true &&
            //   diffDays <= 5 ? (
            //   <>
            //     <WarningBeforePlanExpired
            //       open={diffDays <= 5 && true}
            //       daysRemaining={diffDays}
            //     />
            //     <Component {...props} />
            //   </>
            // )
            // TOKEN VALID OR NOT CONDITION
            // auth.isAuthenticated === true &&
            //   (auth.user.role.name === "Administrator" ||
            //     auth.user.role.name === "Employee" ||
            //     auth.user.role.name === "Support") &&
            //   currentTime < tikenExpiresOn ? (
            <>
              {window.scrollTo(0, 0)}
              <Component {...props} />
            </>
          )
        // ) : (
        //   <>
        //     {window.scrollTo(0, 0)}
        //     <Redirect to="/login" />
        //   </>
        // )
      }
    />
  );
};
// };

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);
