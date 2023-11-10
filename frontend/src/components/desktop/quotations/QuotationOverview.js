import React, { Component } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AddQuotations from "./AddQuotations";

import SingleOverviewBlock from "./../../desktop/common/SingleOverviewBlock";
import { connect } from "react-redux";
import { getEmployeesOverview } from "./../../../store/actions/employeeAction";
import isEmpty from "./../../../store/validations/is-empty";
// import { filterAllEmployeesByLevelAction } from "./../../../store/actions/employeeAction";
import {
  getQuotationOverview,
  filterQuotationByLevel,
} from "./../../../store/actions/quotationAction";
// import { SET_APPROVAL_PENDING } from "./../../../store/types";
// import store from "./../../../store/store";

class QuotationOverview extends Component {
  constructor() {
    super();
    this.state = {
      quoatationOverview: [],
      // require for responsive window
      windowWidth: window.innerWidth,
    };
  }

  /*================================
          Lifecycle method
  =================================*/

  componentDidMount() {
    this.props.getEmployeesOverview();
    this.props.getQuotationOverview();
    window.addEventListener("resize", this.handleWindowResize);
  }

  /*========================================================
                mobile view event handlers
  ========================================================*/

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleWindowResize);
  }

  handleWindowResize = () => {
    this.setState({
      windowWidth: window.innerWidth,
    });
  };

  /*========================================================
                end mobile view event handlers
  ========================================================*/

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.quoatationOverview) &&
      nextProps.quoatationOverview !== nextState.quoatationOverview
    ) {
      return {
        quoatationOverview: nextProps.quoatationOverview,
      };
    }
    return null;
  }

  /*=================================
    Employee Overview Filter Handler
  ===================================*/

  onClickEmployeeOverviewFilter = (level) => {
    // console.log(level);

    if (level === "QuotationsSent") {
      const newData = {
        // pageNo: 10,
        // pageSize: 0,
        query: {
          status: "Sent",
        },
      };
      this.props.filterQuotationByLevel(newData);
    } else if (level === "Drafts") {
      const newData = {
        // pageNo: 10,
        // pageSize: 0,
        query: {
          status: "Draft",
        },
      };
      this.props.filterQuotationByLevel(newData);
    } else {
      const newData = {
        // pageNo: 10,
        // pageSize: 0,
        query: {
          // status: "Draft"
        },
      };
      this.props.filterQuotationByLevel(newData);
    }

    // console.log(level);
  };

  render() {
    // console.log(this.props.quoatationOverview);
    const { quoatationOverview } = this.state;
    // const { userRole } = this.props;
    // settings for slider
    let settings = {
      dots: false,
      multiple: true,
      infinite: true,
      speed: 500,
      draggable: false,
      slidesToShow: 2,
      slidesToScroll: 2,
      className: "widgetListSlider",
    };

    const block1 = (
      <SingleOverviewBlock
        onClick={() => this.onClickEmployeeOverviewFilter("AllQuotation")}
        count={quoatationOverview.Total}
        //status={"All Quotations"}
        status={"All Estimates"}
        blockClassName={"leads-gradient-block bg-color-quote1"}
      />
    );

    const block2 = (
      <SingleOverviewBlock
        onClick={() => this.onClickEmployeeOverviewFilter("QuotationsSent")}
        count={quoatationOverview.Sent}
        //status={"Quotations Sent"}
        status={"Estimates Sent"}
        blockClassName={"leads-gradient-block bg-color-quote2"}
      />
    );

    const block3 = (
      <SingleOverviewBlock
        onClick={() => this.onClickEmployeeOverviewFilter("Drafts")}
        count={quoatationOverview.Draft}
        status={"Drafts"}
        blockClassName={"leads-gradient-block bg-color-quote3"}
      />
    );

    return (
      <>
        {this.state.windowWidth >= 768 && (
          <div className="quotation-new-container">
            <div className="row mx-0 align-items-center justify-content-between">
              <div className="row mx-0 align-items-center">
                <button
                  className="go-back-yellow-arrow-new-leads cursor-pointer"
                  onClick={(e) => (
                    (window.location.href = "/sales-centre#engage"),
                    e.preventDefault()
                  )}
                >
                  <img
                    src="/img/desktop-dark-ui/icons/white-back-arrow-circle.svg"
                    alt="prev arrow"
                  />
                </button>

                <h2 className="page-title-new pl-0">Estimates</h2>
              </div>
              <AddQuotations isMobile={false} />
            </div>
            <hr className="page-title-border-bottom page-title-border-bottom--quotation" />

            <div className="gradient-block-container quotation-new-container__gradient-div">
              {block1}
              {block2}
              {block3}
            </div>
          </div>
        )}

        {this.state.windowWidth <= 767 && (
          <div className="leads-mobile-overview-block">
            <Slider {...settings}>
              {block1}
              {block2}
              {block3}
            </Slider>
          </div>
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  employee: state.employee.employeeOverview,
  userRole: state.auth.user.role.name,
  quoatationOverview: state.quotation.quotationOverview,
});

export default connect(mapStateToProps, {
  getEmployeesOverview,
  getQuotationOverview,
  filterQuotationByLevel,
})(QuotationOverview);
