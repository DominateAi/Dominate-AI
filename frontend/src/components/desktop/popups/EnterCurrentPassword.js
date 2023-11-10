import React, { useState } from "react";
import Modal from "react-responsive-modal";
import { useDispatch } from "react-redux";
import {
  userUpdatePassword,
  userComparePassword,
} from "./../../../store/actions/authAction";
import { workspaceId } from "./../../../store/actions/config";
import { useHistory } from "react-router";

export default function EnterCurrentPassword() {
  const dispatch = useDispatch();
  const history = useHistory();
  // vales
  const [open, setOpen] = useState(false);
  const [changePasswordModal, setChangePasswordModal] = useState(false);

  const [values, setValues] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  /*=====================================================================

                     handler

======================================================================*/

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setChangePasswordModal(false);
  };

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const callBackUpdatePassword = (status) => {
    if (status === 200) {
      setChangePasswordModal(false);
    }
  };

  const callBackComparePassword = (status) => {
    if (status === true) {
      setOpen(false);
      setChangePasswordModal(true);
    }
  };

  const handelSave = (e) => {
    e.preventDefault();
    console.log(values);
    // setOpen(false);
    var userData = JSON.parse(localStorage.getItem("Data"));
    const formData = {
      password: values.currentPassword,
      email: userData.email,
      workspace: workspaceId,
    };

    dispatch(userComparePassword(formData, callBackComparePassword));
  };

  const handelSavePassword = (e) => {
    e.preventDefault();
    console.log(values);

    var userData = JSON.parse(localStorage.getItem("Data"));
    const formData = {
      email: userData.email,
      password: values.newPassword,
    };
    dispatch(userUpdatePassword(formData, callBackUpdatePassword));
  };

  const forgetPasswordHandler = () => {
    history.push("/forget-password");
  };

  /*=====================================================================

                     renderChangePassword

======================================================================*/

  const renderChangePassword = () => {
    return (
      <div>
        <Modal
          open={changePasswordModal}
          onClose={handleClose}
          closeOnEsc={true}
          closeOnOverlayClick={false}
          center
          classNames={{
            overlay: "customOverlay",
            modal: "customModal customModal--change-password",
            closeButton: "customCloseButton",
          }}
        >
          <span className="closeIconInModal" onClick={handleClose} />
          <div className="change-password-div change-password-div--change">
            <h2 className="font-30-bold">Change Password</h2>
            <div className="change-password-content-div">
              <h5 className="font-13-regular">
                Choose a strong password meeting requirements{" "}
              </h5>
              <div className="current-password-input current-password-input--new pt-40">
                <label htmlFor="newPassword" className="font-18-bold">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  onChange={handleChange}
                  value={values.newPassword}
                  autoFocus
                />
              </div>
              <div className="current-password-input current-password-input--new pt-30">
                <label htmlFor="confirmPassword" className="font-18-bold">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  onChange={handleChange}
                  value={values.confirmPassword}
                  autoFocus
                />
              </div>
              <div className="text-right">
                <button
                  className="change-password-btn"
                  onClick={handelSavePassword}
                >
                  Set New Password{" "}
                </button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  };

  /*=====================================================================

                     return

   ======================================================================*/
  return (
    <>
      <button
        className="mt-30 profile-workspace-cancel-btn profile-workspace-cancel-btn--change-password"
        onClick={handleOpen}
        type="button"
      >
        Change Password
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        closeOnEsc={true}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay",
          modal: "customModal customModal--change-password",
          closeButton: "customCloseButton",
        }}
      >
        <span className="closeIconInModal" onClick={handleClose} />
        <div className="change-password-div">
          <h2 className="font-30-bold">Change Password</h2>
          <div className="change-password-content-div">
            <h5 className="font-13-regular">
              To continue, first verify it’s you
            </h5>
            <div className="current-password-input pt-40">
              <label htmlFor="currentPassword" className="font-18-bold">
                Enter Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                onChange={handleChange}
                value={values.currentPassword}
                autoFocus
              />
            </div>
            <div className="row mx-0 align-items-center flex-nowrap justify-content-between">
              <h5
                onClick={forgetPasswordHandler}
                className="font-12-bold change-password-forgot-text"
              >
                Forgot password?
              </h5>
              <button className="change-password-btn" onClick={handelSave}>
                Verify
              </button>
            </div>
          </div>
        </div>
      </Modal>
      {renderChangePassword()}
    </>
  );
}
