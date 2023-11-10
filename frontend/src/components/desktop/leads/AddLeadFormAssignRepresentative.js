import React, { Component } from "react";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import PropTypes from "prop-types";
import isEmpty from "./../../../store/validations/is-empty";
// import { maxLengths } from "../../../store/validations/maxLengths/MaxLengths";

// const recentImgTextList = [
//     {
//         path: "../../../assets/img/leads/ben-1.png",
//         name: "Ben Foster",
//     },
//     {
//         path: "../../../assets/img/leads/amy.png",
//         name: "Amy Smart"
//     },
//     {
//         path: "../../../assets/img/leads/ben-2.png",
//         name: "Ben Foster"
//     },
//     {
//         path: "../../../assets/img/leads/tara.png",
//         name: "Tara Reid"
//     },
// ];

// pagination
const totalRecordsInOnePage = 3;

class AddLeadFormAssignRepresentative extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPagination: 1,
      // api
      getItemsList: this.props.allEmployees,
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
      editLeadClassName,
      id,
      name,
      placeholder,
      onChange,
      onClick,
      value,
      fieldHeading,
      error,
      allEmployees,
      activeEmployee,
      customSelectedText,
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
    let adminID =
      !isEmpty(allEmployees) &&
      allEmployees.filter(function (allEmployees) {
        return allEmployees.role.name === "Administrator";
      });
    let dataToken = JSON.parse(localStorage.getItem("Data"));
    // console.log(adminID[0]._id);

    return (
      <div className={`mb-30 ${editLeadClassName}`}>
        <label htmlFor={id} className="add-lead-label font-24-semibold">
          {fieldHeading}
        </label>
        <br />
        <div>
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
          <div className="w-100 mt-20">
            <div className="mb-30">
              <label
                htmlFor={id}
                className="add-lead-label font-24-semibold pt-10 pb-16"
              >
                {customSelectedText ? <>{customSelectedText}</> : "Recents"}
              </label>
              <br />

              <div className="representative-recent-img-text-block">
                {/* {listOutput} */}
                {!isEmpty(allEmployees) &&
                  allEmployees.map((employee, index) => {
                    return (
                      index >=
                        (this.state.currentPagination - 1) *
                          totalRecordsInOnePage &&
                      index <
                        this.state.currentPagination *
                          totalRecordsInOnePage && (
                        <div
                          key={index}
                          className="representative-recent-img-text-block__block"
                        >
                          <img
                            onClick={onClick(employee)}
                            src={`${employee.profileImage}&token=${dataToken.token}`}
                            alt=""
                          />
                          <span
                            className={
                              activeEmployee === employee._id
                                ? "font-18-regular active-assign-employee"
                                : employee._id === adminID[0]._id &&
                                  isEmpty(activeEmployee)
                                ? "font-18-regular active-assign-employee"
                                : "font-18-regular "
                            }
                            onClick={onClick(employee)}
                          >
                            {employee.name}
                          </span>
                        </div>
                      )
                    );
                  })}
                {/* <div className="representative-recent-img-text-block__block">
              <img
                src={require("../../../assets/img/leads/amy.png")}
                alt="representative"
              />
              <span className="font-18-regular" onClick={onClick}>
                Amy Smart
              </span>
            </div>

            <div className="representative-recent-img-text-block__block">
              <img
                src={require("../../../assets/img/leads/ben-2.png")}
                alt="representative"
              />
              <span className="font-18-regular" onClick={onClick}>
                Ben Foster
              </span>
            </div>

            <div className="representative-recent-img-text-block__block">
              <img
                src={require("../../../assets/img/leads/tara.png")}
                alt="representative"
              />
              <span className="font-18-regular" onClick={onClick}>
                Tara Reid
              </span>
            </div> */}
              </div>
            </div>
            {this.state.getItemsList.length > totalRecordsInOnePage && (
              <div className="add-lead-pagination">
                <Pagination
                  onChange={this.onChangePagination}
                  current={this.state.currentPagination}
                  defaultPageSize={totalRecordsInOnePage}
                  total={this.state.getItemsList.length}
                  showTitle={false}
                />
              </div>
            )}
          </div>
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
