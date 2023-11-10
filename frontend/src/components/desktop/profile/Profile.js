import React, { Component, Fragment } from "react";
import Navbar from "./../header/Navbar";
import { ProfileSummary } from "./ProfileSummary";
// import ProfileContent from "./ProfileContent";
import ProfileNewContent from "./ProfileNewContent";
import { connect } from "react-redux";
import isEmpty from "./../../../store/validations/is-empty";
import {
  getPlansAction,
  getOrganizationDetaisAction,
} from "./../../../store/actions/authAction";
import { getAllEmployees } from "./../../../store/actions/employeeAction";
import {
  getAllPaymentHistory,
  getCustomerSavedCards,
} from "./../../../store/actions/paymentAction";
import { getAllLeadsCount } from "./../../../store/actions/leadAction";
import MobileNavbar from "../../mobile/common/MobileNavbar";
import { SET_PAGETITLE, SET_LOADER } from "./../../../store/types";
import store from "./../../../store/store";
import {
  getPaymentHistoryByCustomerId,
  getStripeCustomerObject,
} from "./../../../store/actions/paymentAction";
import { getReferralInfoOfLogedInUser } from "./../../../store/actions/referralAction";
import PaymentFailed from "./../popups/PaymentFailed";

import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

export class Profile extends Component {
  constructor() {
    super();
    this.state = {
      userData: [],
      allPlans: [],
      billingType: "",
      allEmployees: [],
      paymentFailedPopup: false,
    };
  }

  /*==================================
          Lifecycle Methods
  ====================================*/

  componentDidMount() {
    var userData = JSON.parse(localStorage.getItem("Data"));

    // let organizationData = JSON.parse(localStorage.getItem("oraganiationData"));
    // if (organizationData.planStatus === "PAYMENT_FAILED") {
    //   this.setState({
    //     paymentFailedPopup: true,
    //   });
    // }
    store.dispatch({
      type: SET_PAGETITLE,
      payload: "Profile",
    });
    store.dispatch({
      type: SET_LOADER,
    });
    this.props.getAllLeadsCount();

    // setTimeout(() => {
    //   this.props.getPlansAction({
    //     currency: organizationData.currency,
    //   });
    // }, 100);

    this.props.getAllEmployees();
    this.props.getOrganizationDetaisAction(this.props.userData.workspaceId);
    // this.props.getAllPaymentHistory(this.props.userData.organizationId);
    // this.props.getPaymentHistoryByCustomerId();
    // this.props.getCustomerSavedCards();
    // this.props.getStripeCustomerObject(organizationData.customerId);
    // this.props.getReferralInfoOfLogedInUser({ query: { toID: userData.id } });
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(
        nextProps.userData && nextProps.userData !== nextState.userData
      ) &&
      nextProps.userData !== nextState.userData
    ) {
      return {
        userData: nextProps.userData,
      };
    }
    // if (
    //   !isEmpty(nextProps.allPlans) &&
    //   nextProps.allPlans !== nextState.allPlans
    // ) {
    //   return {
    //     allPlans: nextProps.allPlans,
    //   };
    // }
    if (
      !isEmpty(nextProps.employee) &&
      nextProps.employee !== nextState.allEmployees
    ) {
      return {
        allEmployees: nextProps.employee,
      };
    }
    if (!isEmpty(nextProps.loader) && nextProps.loader !== nextState.loader) {
      return {
        loader: nextProps.loader,
      };
    }

    return null;
  }

  componentDidUpdate() {
    if (this.props.employee !== this.state.allEmployees) {
      this.setState({
        allEmployees: this.props.employee,
      });
    }
    if (this.props.loader !== this.state.loader) {
      this.setState({
        loader: this.props.loader,
      });
    }
  }

  onCloseHandler = () => {
    this.setState({
      paymentFailedPopup: false,
    });
  };

  render() {
    const { loader } = this.state;
    return (
      <Fragment>
        {/* {loader && (
          <Loader type="Triangle" color="#502EFF" className="dominate-loader" />
        )} */}

        {/* for desktop view */}
        <Navbar activeProfileMenu={true} />

        {/* for mobile view */}
        {/* <MobileNavbar /> */}

        <div className="user-profile-page-main-container">
          <ProfileSummary
            userData={!isEmpty(this.state.userData) && this.state.userData}
          />
          {/* <ProfileContent
                userData={!isEmpty(this.state.userData) && this.state.userData}
                allPlans={this.state.allPlans}
                billingType={
                  !isEmpty(this.props.billingType) && this.props.billingType
                }
                allEmployees={this.state.allEmployees}
              /> */}
          <ProfileNewContent
            userData={!isEmpty(this.state.userData) && this.state.userData}
            allPlans={this.state.allPlans}
            billingType={
              !isEmpty(this.props.billingType) && this.props.billingType
            }
            allEmployees={this.state.allEmployees}
          />
        </div>
        <PaymentFailed
          paymentFailedPopup={this.state.paymentFailedPopup}
          onCloseHandler={this.onCloseHandler}
        />
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  userData: state.auth.user,
  allPlans: state.plans.plans.data,
  billingType: state.auth.user.billingType,
  employee: state.employee.allEmployees,
  auth: state.auth,
  loader: state.auth.loader,
});

export default connect(mapStateToProps, {
  getPlansAction,
  getAllEmployees,
  getOrganizationDetaisAction,
  getAllPaymentHistory,
  getAllLeadsCount,
  getPaymentHistoryByCustomerId,
  getCustomerSavedCards,
  getStripeCustomerObject,
  getReferralInfoOfLogedInUser,
})(Profile);
