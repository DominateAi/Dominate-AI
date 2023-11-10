import React, { Component } from "react";
import AddLead from "../../desktop/leads/AddLead";
// import AddCustomers from "../../desktop/customers/AddCustomers";
import AddEmployees from "../../desktop/employees/AddEmployees";

export class FloatingButton extends Component {
  constructor() {
    super();
    this.state = {
      isFloatingBtnClick: false,
    };
  }
  // handlers on main leads page
  handleFloatingBtnClick = () => {
    this.setState({
      isFloatingBtnClick: !this.state.isFloatingBtnClick,
    });
  };
  render() {
    const { isActiveVal } = this.props;
    return (
      <>
        {/* floating button */}
        <div className="floating-btn-outer-block">
          {this.state.isFloatingBtnClick ? (
            <>
              <div className="floating-btn-options-block">
                <AddLead
                  isMobile={true}
                  isActive={isActiveVal === "leads" ? true : false}
                />
                {/* <AddCustomers
                  isMobile={true}
                  isActive={isActiveVal === "customers" ? true : false}
                /> */}
                <AddEmployees
                  isMobile={true}
                  isActive={isActiveVal === "employees" ? true : false}
                />
                <h6 className="resp-font-12-regular floating-btn-options-block__link invisible">
                  Display none
                </h6>
              </div>
              <button
                className="floating-btn-leads-page"
                onClick={this.handleFloatingBtnClick}
              >
                <span className="close-icon"></span>
              </button>
            </>
          ) : (
            <button
              className="floating-btn-leads-page"
              onClick={this.handleFloatingBtnClick}
            >
              &#43;
            </button>
          )}
        </div>
      </>
    );
  }
}

export default FloatingButton;
