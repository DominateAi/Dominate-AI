import React, { Component } from "react";
import PropTypes from "prop-types";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import isEmpty from "./../../../store/validations/is-empty";
// import { maxLengths } from "../../../store/validations/maxLengths/MaxLengths";

// pagination
const totalRecordsInOnePage = 5;

class AddLeadFormAssignRepresentative extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPagination: 1,
      // api
      getItemsList: this.props.allLeads,
    };
  }

  // pagination
  onChangePagination = (page) => {
    this.setState({
      currentPagination: page,
    });
  };

  render() {
    const {
      id,
      name,
      placeholder,
      onChange,
      onClick,
      value,
      fieldHeading,
      error,
      allLeads,
      activeLead,
    } = this.props;

    // const listOutput = recentImgTextList.map((list, index) =>
    //     <div className="representative-recent-img-text-block__block" key={index}>
    //         <img src={list.path}
    //             alt="representative" />
    //         <span className="font-18-regular"
    //             onClick={onClick}>
    //             {list.name}
    //         </span>
    //     </div>
    // );
    // console.log(allEmployees);
    console.log(allLeads);
    return (
      <div>
        <div className="mb-30">
          <label htmlFor={id} className="add-lead-label font-24-semibold">
            {fieldHeading}
          </label>
          <br />
          <input
            type="text"
            id={id}
            name={name}
            className="add-lead-input-field font-18-regular"
            placeholder={placeholder}
            onChange={onChange}
            value={value}
            // maxLength={maxLengths.char30}
            autoFocus
            disabled
          />
          {error && (
            <div className="is-invalid add-lead-form-field-errors">{error}</div>
          )}
        </div>
        <div className="mb-18">
          <label htmlFor={id} className="add-lead-label font-24-semibold pt-10">
            All Leads
          </label>
          <br />

          <div className="representative-recent-img-text-block">
            {/* {listOutput} */}
            {!isEmpty(allLeads)
              ? allLeads.map((lead, index) => {
                  return (
                    index >=
                      (this.state.currentPagination - 1) *
                        totalRecordsInOnePage &&
                    index <
                      this.state.currentPagination * totalRecordsInOnePage && (
                      <div
                        key={index}
                        className="representative-recent-img-text-block__block"
                      >
                        <img
                          className="quotation_select_lead_pointer"
                          onClick={onClick(lead)}
                          src={require("../../../assets/img/leads/lead_default_img.svg")}
                          alt="representative"
                        />
                        <p
                          className={
                            activeLead === lead._id
                              ? "font-18-regular active-assign-employee"
                              : "font-18-regular "
                          }
                          onClick={onClick(lead)}
                        >
                          {lead.name}
                        </p>
                      </div>
                    )
                  );
                })
              : "No Leads Found"}
          </div>
        </div>
        <div className="add-lead-pagination">
          <Pagination
            onChange={this.onChangePagination}
            current={this.state.currentPagination}
            defaultPageSize={totalRecordsInOnePage}
            total={this.state.getItemsList.length}
            showTitle={false}
          />
        </div>
      </div>
    );
  }
}

AddLeadFormAssignRepresentative.defaultProps = {
  error: "",
};

AddLeadFormAssignRepresentative.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  error: PropTypes.string,
};

export default AddLeadFormAssignRepresentative;
