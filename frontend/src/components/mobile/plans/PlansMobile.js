import React, { Component } from "react";
import MobileNavbar from "../common/MobileNavbar";

class PlansMobile extends Component {
  // onclick plans handler
  onClickPlansHandler = () => {
    console.log("clicked on plans card");
  };

  // update button handler
  planUpdateHandler = () => {
    console.log("clicked plan update button");
  };

  // renderPlansCard
  renderPlansCard = () => {
    return (
      <div className="subscription container">
        <div className="row">
          <div
            className="leads-red-gradient-block subscription-box col-md-5"
            onClick={() => this.onClickPlansHandler()}
          >
            <div>
              <i className="fa fa-users fa-4x" />
            </div>
            <div className="plan-content text-center">
              <p className="plan-price">$15</p>
              <p className="plan-name">EGG</p>
            </div>
            <div>
              <p className="plan-users text-center">1 - 2</p>
              <span>Employees</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  render() {
    return (
      <>
        {/* <MobileNavbar /> */}
        <div className="justify-content-space-between ml-70">
          <div className="payment-main-conatiner">
            <div className="form-group">
              <label htmlFor="workspaceName">Update Plan</label>
              {this.renderPlansCard()}
              {this.renderPlansCard()}
              {this.renderPlansCard()}
              {this.renderPlansCard()}
            </div>
            <div className="buttons-section">
              {/* <Link to="/workspace-login">
                <button className="cancel-payment">Cancel</button>
              </Link> */}

              <button onClick={this.planUpdateHandler} className="make-payment">
                {" "}
                Update{" "}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default PlansMobile;
