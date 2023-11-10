import React, { Component } from "react";
import MobileNavbar from "../common/MobileNavbar";
import { maxLengths } from "../../../store/validations/maxLengths/MaxLengths";

class SettingsMobile extends Component {
  constructor() {
    super();
    this.state = {
      fname: "",
      lname: "",
      email: "zeeshan.sayed@myrl.tech",
      workspceName: "kbc.dominate.com"
    };
  }

  /*==============================
        Form event Hndler
  ===============================*/

  onchangeHandler = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  editProfileHandler = e => {
    e.preventDefault();
    const updateUser = {
      firstName: this.state.fname,
      lastName: this.state.lname
    };

    this.props.updateUser(this.props.userData.id, updateUser);
    // console.log(this.state);
  };

  editProfileHandler = () => {
    console.log(this.state);
  };

  render() {
    return (
      <>
        {/* <MobileNavbar /> */}
        <div className="user-profile-page-main-container ml-70 mb-30">
          <div className="edit-profile-form-container">
            <form noValidate onSubmit={this.editProfileHandler}>
              {/* first name */}
              <div className="form-group">
                <label htmlFor="fname">First Name</label>
                <input
                  type="text"
                  name="fname"
                  onChange={this.onchangeHandler}
                  maxLength={maxLengths.char30}
                  value={this.state.fname}
                />
              </div>
              {/* Last Name */}
              <div className="form-group">
                <label htmlFor="lname">Last Name</label>
                <input
                  type="text"
                  name="lname"
                  onChange={this.onchangeHandler}
                  maxLength={maxLengths.char30}
                  value={this.state.lname}
                />
              </div>
              {/* Password Reset */}
              {/* <div className="form-group">
                  <label htmlFor="resetPassword">Reset Password</label>
                  <input type="password" name="password" />
                </div> */}
              {/* Workspace Name */}
              <div className="form-group">
                <label htmlFor="workspaceName">Workspace Name</label>
                <input
                  type="text"
                  name="workspceName"
                  className="disabled-field"
                  value={this.state.workspceName}
                  disabled
                />
              </div>

              {/* Email */}
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  className="disabled-field"
                  name="email"
                  value={this.state.email}
                  disabled
                />
              </div>
              <div>
                <button type="submit">Save</button>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  }
}

export default SettingsMobile;
