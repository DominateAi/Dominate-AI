import React, { Component, Fragment } from "react";
import QuotationOverview from "./QuotationOverview";
import QuotationsContent from "./QuotationsContent";
import Navbar from "../header/Navbar";
import { connect } from "react-redux";
import { getOrganizationDetaisAction } from "./../../../store/actions/authAction";
import store from "./../../../store/store";
import { SET_PAGETITLE } from "./../../../store/types";
import { getAllActiveLeads } from "./../../../store/actions/leadAction";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { getAllProductOrServices } from "./../../../store/actions/productAndSevicesAction";
import BreadcrumbMenu from "../header/BreadcrumbMenu";
class Quotations extends Component {
  /*========================================
             Lifecycle methods
  =========================================*/
  componentDidMount() {
    const allLeadQuery = {
      // pageNo: 10,
      // pageSize: 0,
      query: {},
    };
    this.props.getAllActiveLeads(allLeadQuery);
    this.props.getAllProductOrServices();
    store.dispatch({
      type: SET_PAGETITLE,
      // payload: "Quotations",
      payload: "Sales Centre",
    });
  }
  render() {
    const { loader } = this.props;
    return (
      <Fragment>
        {loader === true && (
          <Loader type="Triangle" color="#00BFFF" className="dominate-loader" />
        )}

        <Navbar />
        <BreadcrumbMenu
          menuObj={[
            {
              title: "Sales Centre",
              link: "/sales-centre#engage",
            },
            {
              title: "Quotations",
            },
          ]}
        />
        <div className="new-quotation-background">
          <QuotationOverview />
          <QuotationsContent />
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  loader: state.auth.loader,
});

export default connect(mapStateToProps, {
  getOrganizationDetaisAction,
  getAllActiveLeads,
  getAllProductOrServices,
})(Quotations);
