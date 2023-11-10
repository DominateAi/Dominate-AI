import React, { useState, useEffect } from "react";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { connect } from "react-redux";
import isEmpty from "../../../store/validations/is-empty";
import {
  SET_SELECTED_CONTACTS,
  SET_ASSIGNED_MEMBER,
  SET_ASSIGNED_ACCOUNT,
} from "./../../../store/types";
import store from "../../../store/store";
import { useSelector } from "react-redux";
import { values } from "lodash";

function ImportToLeadsModalThree() {
  const [leadValues, setLeadValues] = useState({
    assignLeadOption: [],
    assignLead: "",
  });

  const [accountValues, setAccountValues] = useState({
    assignAccountOption: [],
    assignAccount: "",
  });

  const allEmployees = useSelector((state) => state.employee.allEmployees);
  const allAccounts = useSelector((state) => state.account.allAccounts);

  useEffect(() => {
    if (!isEmpty(allEmployees)) {
      // console.log(allEmployees);
      let newArray =
        !isEmpty(allEmployees) &&
        allEmployees.map((employee) => ({
          value: employee._id,
          label: employee.name,
        }));

      store.dispatch({
        type: SET_ASSIGNED_MEMBER,
        payload: newArray[0],
      });

      setLeadValues({
        ...leadValues,
        assignLeadOption: newArray,
        assignLead: newArray[0],
      });
    }
  }, [allEmployees]);

  useEffect(() => {
    if (!isEmpty(allAccounts)) {
      // console.log(allAccounts);
      let newArray =
        !isEmpty(allAccounts) &&
        allAccounts.map((account) => ({
          value: account._id,
          label: account.accountname,
        }));

      store.dispatch({
        type: SET_ASSIGNED_ACCOUNT,
        payload: newArray[0],
      });

      // console.log(newArray);
      setAccountValues({
        ...accountValues,
        assignAccountOption: newArray,
        assignAccount: newArray[0],
      });
    }
  }, [allAccounts]);

  const handleDropdownChange = (e) => {
    // const { selectedContacts } = this.props;
    setLeadValues({ ...leadValues, assignLead: e, statusLeadValue: e.value });
    // console.log(`Option selected:`, e);
    // selectedContacts.forEach((element) => {
    //   element.assigned = e.value;
    // });

    store.dispatch({
      type: SET_ASSIGNED_MEMBER,
      payload: e,
    });
  };

  const handleDropdownAccountChange = (e) => {
    // const { selectedContacts } = this.props;
    setAccountValues({
      ...accountValues,
      assignAccount: e,
      statusLeadValue: e.value,
    });
    // console.log(`Option selected:`, e);
    // selectedContacts.forEach((element) => {
    //   element.assigned = e.value;
    // });

    store.dispatch({
      type: SET_ASSIGNED_ACCOUNT,
      payload: e,
    });
  };

  return (
    <div>
      <>
        <div className="import-to-leads-modal-div">
          <h4 className="import-to-leads-modal-title font-30-bold">
            Import Leads
          </h4>
          <div> </div>
          <h4 className="import-to-leads-modal-subtitle font-24-bold">
            Assign these leads to
          </h4>
          <h5 className="font-16-light import-to-leads-modal-menu-later-text">
            (Can be changed in leads menu later)
          </h5>
          <div style={{ display: "flex" }}>
            <div>
              <h5 className="import-to-leads-modal-three-dropdown-label">
                Lead
              </h5>
              <div className="row mx-0 align-items-center justify-content-between">
                <div className="import-modal-three-img-div">
                  <img
                    src={require("../../../assets/img/accounts/leads.svg")}
                    alt="import to leads"
                    className="import-modal-three-img"
                  />
                </div>
                <h3 className="font-16-semibold">
                  <Dropdown
                    className="lead-status-dropDown lead-status-dropDown--import-to-leads "
                    options={leadValues.assignLeadOption}
                    value={leadValues.assignLead}
                    onChange={(e) => handleDropdownChange(e)}
                  />
                </h3>
              </div>
            </div>
            <div>
              <h5 className="import-to-leads-modal-three-dropdown-label">
                Account
              </h5>
              <div className="row mx-0 align-items-center justify-content-between">
                <div className="import-modal-three-img-div">
                  <img
                    //src={require("../../../assets/img/accounts/leads.svg")}
                    src={require("../../../assets/img/accounts/profile.svg")}
                    alt="import to leads"
                    className="import-modal-three-img"
                  />
                </div>
                <h3 className="font-16-semibold">
                  <Dropdown
                    className="lead-status-dropDown lead-status-dropDown--import-to-leads "
                    options={accountValues.assignAccountOption}
                    value={accountValues.assignAccount}
                    onChange={(e) => handleDropdownAccountChange(e)}
                  />
                </h3>
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
}

export default ImportToLeadsModalThree;
