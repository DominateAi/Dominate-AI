import React, { useState, useEffect } from "react";
import Modal from "react-responsive-modal";
import { Link, withRouter } from "react-router-dom";
import isEmpty from "./../../../store/validations/is-empty";
import { useHistory, useLocation } from "react-router-dom";

const SuccessMessage = () => {
  const history = useHistory();
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const [signUpUserInfo, setsignUpUserInfo] = useState({});
  useEffect(() => {
    if (!isEmpty(location)) {
      setsignUpUserInfo(location.state.signupInfo);
    }
  }, [location]);

  const onCloseModal = () => {
    setOpen({
      open: false,
    });
  };

  const continueHandler = (e) => {
    e.preventDefault(e);

    if (process.env.NODE_ENV === "development") {
      history.push("/");
    } else {
      history.push("/");
      // window.location.href = `https://${signUpUserInfo.workspaceId}.dominate.ai/login`;
    }
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={onCloseModal}
        closeOnEsc={true}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay customOverlay--successMsg",
          modal: "customModal--successMsg",
          closeButton: "customCloseButton",
        }}
      >
        {/* <span className="closeIconInModal" onClick={this.onCloseModal} /> */}

        {/* logo */}
        <div className="success-msg-logo-block">
          <img
            src="/img/desktop-dark-ui/logo/logo-color-white.svg"
            className="success-msg-logo"
            alt="logo"
          />
        </div>

        {/* content */}
        <div className="success-msg-grey-bg-block">
          <h1 className="font-30-bold mb-18">Thank you!</h1>
          <p className="font-20-regular mb-18">
            You have signed up with dominate, with the following workspace.
          </p>
          <p className="font-20-regular mb-61">
            <span className="font-21-bold">Workspace Name:</span>{" "}
            {!isEmpty(signUpUserInfo) && signUpUserInfo.workspaceId}
            <br />
            <span className="font-21-bold">Workspace URL:</span>{" "}
            {!isEmpty(signUpUserInfo) && signUpUserInfo.workspaceUrl}
          </p>

          <button onClick={continueHandler} className="success-msg-btn mt-10">
            Continue
          </button>
        </div>

        {/* Copyright */}
        <div className="success-msg-copyright-block">
          <h6 className="font-21-regular">Copyright 2021</h6>
        </div>
      </Modal>
    </div>
  );
};

export default SuccessMessage;

// import React, { Component } from "react";
// import Modal from "react-responsive-modal";
// import { Link, withRouter } from "react-router-dom";
// import isEmpty from "./../../../store/validations/is-empty";

// export class SuccessMessage extends Component {
//   constructor() {
//     super();
//     this.state = {
//       open: true,
//     };
//   }

//   onCloseModal = () => {
//     this.setState({
//       open: false,
//     });
//   };

//   continueHandler = (e) => {
//     e.preventDefault(e);
//     const { signUpUserInfo } = this.props;
//     if (process.env.NODE_ENV === "development") {
//       this.props.history.push("/");
//     } else {
//       this.props.history.push("/");
//       // window.location.href = `https://${signUpUserInfo.workspaceId}.dominate.ai/login`;
//     }
//   };

//   render() {
//     const { open } = this.state;
//     const { signUpUserInfo } = this.props;
//     return (
//       <Modal
//         open={open}
//         onClose={this.onCloseModal}
//         closeOnEsc={true}
//         closeOnOverlayClick={false}
//         center
//         classNames={{
//           overlay: "customOverlay customOverlay--successMsg",
//           modal: "customModal--successMsg",
//           closeButton: "customCloseButton",
//         }}
//       >
//         {/* <span className="closeIconInModal" onClick={this.onCloseModal} /> */}

//         {/* logo */}
//         <div className="success-msg-logo-block">
//           <img
//             src="/img/desktop-dark-ui/logo/logo-color-white.svg"
//             className="success-msg-logo"
//             alt="logo"
//           />
//         </div>

//         {/* content */}
//         <div className="success-msg-grey-bg-block">
//           <h1 className="font-30-bold mb-18">Thank you!</h1>
//           <p className="font-20-regular mb-18">
//             You have signed up with dominate, with the following workspace.
//           </p>
//           <p className="font-20-regular mb-61">
//             <span className="font-21-bold">Workspace Name:</span>{" "}
//             {!isEmpty(signUpUserInfo) && signUpUserInfo.workspaceId}
//             <br />
//             <span className="font-21-bold">Workspace URL:</span>{" "}
//             {!isEmpty(signUpUserInfo) && signUpUserInfo.workspaceUrl}
//           </p>

//           <button
//             onClick={this.continueHandler}
//             className="success-msg-btn mt-10"
//           >
//             Continue
//           </button>
//         </div>

//         {/* Copyright */}
//         <div className="success-msg-copyright-block">
//           <h6 className="font-21-regular">Copyright 2020</h6>
//         </div>
//       </Modal>
//     );
//   }
// }

// export default withRouter(SuccessMessage);
