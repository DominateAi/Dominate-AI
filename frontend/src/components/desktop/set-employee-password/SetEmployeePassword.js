import React, { Fragment, Component } from "react";
import Modal from "react-responsive-modal";
import PopupInputFields from "../common/PopupInputFields";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  verifyEmployeeAction,
  employeePasswordResetAction
} from "./../../../store/actions/employeeAction";
import isEmpty from "./../../../store/validations/is-empty";

import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

export class SetEmployeePassword extends Component {
  constructor() {
    super();
    this.state = {
      open: true,
      employeePassword: "",
      verifyEmployeeData: {}
    };
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (nextProps.verifyEmployeeData !== nextState.verifyEmployeeData) {
      return {
        verifyEmployeeData: nextProps.verifyEmployeeData
      };
    }
    return null;
  }

  componentDidMount() {
    // Get Authcode From Pathname
    let authCodePart = this.props.match.params.id;
    console.log(authCodePart);
    // let mainAuthCode = authCodePart.split("Workspace")[0];
    // mainAuthCode = mainAuthCode.substring(0, mainAuthCode.length - 2);
    // console.log(mainAuthCode);
    let workspaceName = window.location.host.split(".")[0];
    this.props.verifyEmployeeAction(authCodePart, workspaceName);
  }

  onSubmitHandler = e => {
    e.preventDefault();
    // Get Authcode From Pathname
    let authCodePart = this.props.match.params.id;
    let workspaceName = window.location.host.split(".")[0];
    // let mainAuthCode = authCodePart.split("Workspace")[0];
    // mainAuthCode = mainAuthCode.substring(0, mainAuthCode.length - 2);
    // console.log(this.state);
    const newEmployee = {
      email: this.state.verifyEmployeeData.email,
      password: this.state.employeePassword
    };
    this.props.employeePasswordResetAction(
      newEmployee,
      authCodePart,
      this.props.history,
      workspaceName
    );
  };

  onChangeHandler = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  /*====================================
    Render Set Employee Password Model
  ======================================*/

  renderSetPasswordModel = () => {
    const { open, verifyEmployeeData } = this.state;
    return (
      <Modal
        open={open}
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
              <p>{verifyEmployeeData.workspaceId}.dominate.ai</p>
              <h3>Email</h3>
              <p>{verifyEmployeeData.email}</p>
              <h3>Set Password</h3>
              <PopupInputFields
                type={"password"}
                id={"employeePassword"}
                name={"employeePassword"}
                placeholder={"Password"}
                onChange={this.onChangeHandler}
                value={this.state.employeePassword}
              />
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      </Modal>
    );
  };

  renderContent = () => {
    const { verifyEmployeeData, open } = this.state;
    if (isEmpty(verifyEmployeeData)) {
      return (
        <Loader type="Triangle" color="#00BFFF" className="dominate-loader" />
      );
    } else if (verifyEmployeeData.success === true) {
      return this.renderSetPasswordModel();
    } else {
      return (
        <Fragment>
          <Modal
            open={open}
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
    return <Fragment>{this.renderContent()}</Fragment>;
  }
}

const mapStateToProps = state => ({
  verifyEmployeeData: state.employee.verifyEmployee
});

export default connect(mapStateToProps, {
  verifyEmployeeAction,
  employeePasswordResetAction
})(withRouter(SetEmployeePassword));
