import React, { Component, Fragment } from "react";
import axios from "axios";
import { url } from "./../../../store/actions/config";
import Modal from "react-responsive-modal";
import PopupInputFields from "../common/PopupInputFields";
import isEmpty from "./../../../store/validations/is-empty";
import { validateUserResetPassword } from "../../../store/validations/userResetPassword/userResetPasswordValidation";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { connect } from "react-redux";
import {
  userPasswordResetAction,
  verifyUserAction
} from "./../../../store/actions/authAction";
import { withRouter, Link } from "react-router-dom";

export class UserResetPassword extends Component {
  constructor() {
    super();
    this.state = {
      userPasswordModel: true,
      userPassword: "",
      verifyEmployeeData: "",
      errors: {}
    };
  }

  /*=================================
    Component Lifecycle Method
  ==================================*/
  componentDidMount() {
    // Get Authcode From Pathname
    let authCodePart = this.props.match.params.id;
    console.log(authCodePart);
    let workspaceName = window.location.host.split(".")[0];
    this.props.verifyUserAction(authCodePart, workspaceName);
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (nextProps.verifyEmployeeData !== nextState.verifyEmployeeData) {
      return {
        verifyEmployeeData: nextProps.verifyEmployeeData
      };
    }
    return null;
  }

  errorHandler = validationError => {
    // console.log(validationError);
    this.setState({
      errorMessage: validationError.message
    });
  };

  /*==================================
        event Handlers
  ====================================*/
  onSubmitHandler = e => {
    e.preventDefault();

    let { errors, isValid } = validateUserResetPassword(this.state);

    if (!isValid) {
      this.setState({ errors });
    }

    if (isValid) {
      this.setState({ errors: {} });
      // Get Authcode From Pathname
      let authCodePart = this.props.match.params.id;
      let workspaceName = window.location.host.split(".")[0];
      // let mainAuthCode = authCodePart.split("Workspace")[0];
      // mainAuthCode = mainAuthCode.substring(0, mainAuthCode.length - 2);
      // console.log(this.state);
      if (!isEmpty(this.state.userPassword)) {
        const userNewPassword = {
          email: this.state.verifyEmployeeData.email,
          password: this.state.userPassword
        };

        this.props.userPasswordResetAction(
          workspaceName,
          userNewPassword,
          authCodePart,
          this.props.history,
          this.errorHandler
        );
        console.log(this.state);
      } else {
        this.setState({
          errorMessage: "Password should not be empty"
        });
      }
    }
  };

  onChangeHandler = e => {
    this.setState({
      [e.target.name]: e.target.value,
      errorMessage: ""
    });
  };

  /*==================================
      Reset User Password model
  ===================================*/

  renderSetUserPasswordModel = () => {
    let workspaceName = window.location.host.split(".")[0];
    const { userPasswordModel, verifyEmployeeData, errors } = this.state;
    return (
      <Modal
        open={userPasswordModel}
        onClose={() => console.log("unable to close")}
        closeOnEsc={true}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay customOverlay--successMsg",
          modal: "set-password-modal customModal customModal--addLead",
          closeButton: "customCloseButton"
        }}
      >
        {/* <span className="closeIconInModal" onClick={this.onCloseModal} /> */}
        <div className="set-employee-password">
          <div className="heading">
            <h3>Set Password</h3>
          </div>
          <div className="password-content">
            <form noValidate onSubmit={this.onSubmitHandler}>
              <h3>Workspace Name</h3>
              <p>{workspaceName}
              {/* .dominate.ai */}
              </p>
              <h3>Email</h3>
              <p>{verifyEmployeeData.email}</p>
              <h3>Set Password</h3>
              <PopupInputFields
                type={"password"}
                id={"userPassword"}
                name={"userPassword"}
                placeholder={"Password"}
                onChange={this.onChangeHandler}
                value={this.state.userPassword}
              />

              {errors.userPassword ? (
                <div className="is-invalid">{errors.userPassword}</div>
              ) : (
                !isEmpty(this.state.errorMessage) && (
                  <div className="is-invalid">{this.state.errorMessage}</div>
                )
              )}
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
        {/* <div className="set-employee-password">
          <h3>Set Your Password</h3>
          <form noValidate onSubmit={this.onSubmitHandler}>
            <h3>Email : {verifyEmployeeData.email}</h3>
            <PopupInputFields
              type={"password"}
              id={"userPassword"}
              name={"userPassword"}
              placeholder={"Password"}
              onChange={this.onChangeHandler}
              value={this.state.userPassword}
            />
            <button type="submit">Submit</button>
          </form>
        </div> */}
      </Modal>
    );
  };

  renderContent = () => {
    const { verifyEmployeeData, userPasswordModel } = this.state;
    if (isEmpty(verifyEmployeeData)) {
      return (
        <Loader type="Triangle" color="#00BFFF" className="dominate-loader" />
      );
    } else if (verifyEmployeeData.success === true) {
      return this.renderSetUserPasswordModel();
    } else {
      return (
        <Fragment>
          <Modal
            open={userPasswordModel}
            onClose={() => console.log("unable to close")}
            closeOnEsc={true}
            closeOnOverlayClick={false}
            center
            classNames={{
              overlay: "customOverlay customOverlay--successMsg",
              modal: "set-password-modal customModal customModal--addLead",
              closeButton: "customCloseButton"
            }}
          >
            {/* <span className="closeIconInModal" onClick={this.onCloseModal} /> */}
            <div className="set-password-broken-link">
              <div className="heading">
                <h3>Link expired or broken</h3>
              </div>
              <div className="password-content">
                <h3>Link expired or broken</h3>
                <p>
                  The link you have clicked has already been used previously or
                  has expired.
                </p>
                <Link to="/login">
                  <button type="submit">Back</button>
                </Link>
              </div>
            </div>
          </Modal>
        </Fragment>
      );
    }
  };

  render() {
    console.log(this.props.verifyEmployeeData);
    return <Fragment>{this.renderContent()}</Fragment>;
  }
}

const mapStateToProps = state => ({
  verifyEmployeeData: state.employee.verifyEmployee
});

export default connect(mapStateToProps, {
  userPasswordResetAction,
  verifyUserAction
})(withRouter(UserResetPassword));
