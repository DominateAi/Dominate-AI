import React, { Component } from "react";
import Modal from "react-responsive-modal";
import { Link } from "react-router-dom";
import isEmpty from "./../../../store/validations/is-empty";

export class WarningBeforePlanExpired extends Component {
  constructor(props) {
    super(props);
    this.state = {
      warningBeforeFreeTrail: this.props.open
    };
  }

  onCloseModal = () => {
    this.setState({
      warningBeforeFreeTrail: false
    });
    localStorage.removeItem("WarningBeforeFreeTrialEnded");
    localStorage.setItem(
      "WarningBeforeFreeTrialEnded",
      JSON.stringify({ WarningBeforeFreeTrialEnded: false })
    );
  };

  render() {
    const { warningBeforeFreeTrail } = this.state;

    return (
      <Modal
        open={warningBeforeFreeTrail}
        onClose={this.onCloseModal}
        closeOnEsc={true}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay customOverlay--warning_before_five_days",
          modal: "customeModel_warning_before_five",
          closeButton: "customCloseButton"
        }}
      >
        <span className="closeIconInModal" onClick={this.onCloseModal} />

        {/* logo */}
        <div className="warning_before_plan_expired_container">
          <div>
            <img
              src={require("./../../../assets/img/logo-new/Dominate-logo-blue.svg")}
              alt="logo"
            ></img>
            <p>
              Hello! Your free trial will expire in {this.props.daysRemaining}{" "}
              days. Upgrade your account to continue using Dominate
            </p>
            <div className="button_section">
              <button onClick={this.onCloseModal} className="later_button">
                Later
              </button>
              <Link to="/profile">
                <button onClick={this.onCloseModal} className="upgrade_button">
                  Pay now
                </button>
              </Link>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default WarningBeforePlanExpired;
