import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Tabs, Tab, TabPanel, TabList } from "react-web-tabs";
import Navbar from "../header/Navbar";
import activeTabCircleImg from "../../../../src/assets/img/leads-new/leads-new-inner-page-active-tab-circle.svg";
import { validateClosedDealsDetailsForm } from "../../../store/validations/dealPipelinesValidation/closedDealsDetailsFormValidation";
import ClosedDealsDetailsProfileForm from "./ClosedDealsDetailsProfileForm";
import ClosedDealsDetailsProfileFormDisplay from "./ClosedDealsDetailsProfileFormDisplay";
import { getAllActiveLeads } from "./../../../store/actions/leadAction";
import { getAllAccounts } from "./../../../store/actions/accountsAction";
import {
  getDealById,
  updateDealById,
} from "./../../../store/actions/dealsAction";
import { getAllFieldsValue } from "./../../../store/actions/commandCenter";

import isEmpty from "./../../../store/validations/is-empty";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import BreadcrumbMenu from "../header/BreadcrumbMenu";

function ClosedDealsDetails() {
  const location = useLocation();
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    isProfileFormDoubleClicked:
      !isEmpty(location.state) && location.state.isEditLink ? true : false,
    errors: {},
  });

  useEffect(() => {
    const allLeadQuery = {
      query: {},
    };
    dispatch(getAllActiveLeads(allLeadQuery));
    dispatch(getAllAccounts());
    dispatch(getDealById(location.state.dealData._id));
    // dispatch(
    //   getAllFieldsValue({
    //     entity_Id: location.state.dealData._id,
    //   })
    // );
    window.scrollTo(0, 0);
  }, []);

  /*===========================================
            handlers
  =============================================*/

  const handleOnDoubleClickProfileForm = () => {
    setValues({
      ...values,
      isProfileFormDoubleClicked: !values.isProfileFormDoubleClicked,
      errors: {},
    });
  };

  const callBackUpdateDeal = (status) => {
    if (status === 200) {
      setValues({
        ...values,
        isProfileFormDoubleClicked: !values.isProfileFormDoubleClicked,
        errors: {},
      });
    }
  };

  const handleOnClickSaveButton =
    (data, dealsCustomFields, newCustomFieldValues, dealData) => (e) => {
      e.preventDefault();

      const { errors, isValid } = validateClosedDealsDetailsForm(data);
      // console.log(errors);
      if (!isValid) {
        setValues({
          ...values,
          errors,
        });
      }
      if (isValid) {
        // const {
        //   customTextboxfieldData,
        //   customeDropdownFieldData,
        //   dealsCustomFields,
        // } = data;

        if (data.dealType === true) {
          let formData = dealData;
          formData.dealname = data.dealsName;
          formData.value = data.worthValueOfDeal;
          formData.account = data.dealsAccountNameSelectedOption.value;
          formData.lead = data.leadNameSelectedOption.value;
          formData.startDate = data.startDate.toISOString();
          formData.endDate = data.endDate.toISOString();
          formData.frequency =
            data.frequencySelectedOptionDropdown.value === "Monthly"
              ? "MONTHLY"
              : data.frequencySelectedOptionDropdown.value === "Quarterly"
              ? "QUARTERLY"
              : "ANNUAL";
          formData.type = data.dealType === true ? "RECURRING" : "ONETIME";
          formData.entityType = "ACCOUNT";
          formData.entityId = formData.account;

          dispatch(
            updateDealById(
              formData._id,
              formData,
              newCustomFieldValues.customTextboxfieldData,
              newCustomFieldValues.customeDropdownFieldData,
              dealsCustomFields,
              callBackUpdateDeal
            )
          );
        } else {
          let formData = dealData;
          formData.dealname = data.dealsName;
          formData.value = data.worthValueOfDeal;
          formData.account = data.dealsAccountNameSelectedOption.value;
          formData.lead = data.leadNameSelectedOption.value;
          // formData.startDate = data.startDate.toISOString();
          // formData.endDate = data.endDate.toISOString();
          // formData.frequency =
          //   data.frequencySelectedOptionDropdown.value === "Monthly"
          //     ? "MONTHLY"
          //     : data.frequencySelectedOptionDropdown.value === "Quarterly"
          //     ? "QUARTERLY"
          //     : "ANNUAL";
          formData.type = data.dealType === true ? "RECURRING" : "ONETIME";
          formData.entityType = "ACCOUNT";
          formData.entityId = formData.account;
          dispatch(
            updateDealById(
              formData._id,
              formData,
              newCustomFieldValues.customTextboxfieldData,
              newCustomFieldValues.customeDropdownFieldData,
              dealsCustomFields,
              callBackUpdateDeal
            )
          );
        }
      }
    };

  let pipelineData = JSON.parse(localStorage.getItem("pipelineData"));

  return (
    <>
      <Navbar />
      <BreadcrumbMenu
        menuObj={[
          {
            title: "Sales Centre",
            link: "/sales-centre#engage",
          },
          {
            title: "Deal Pipelines",
            link: "/deal-pipelines",
          },
          {
            title: "Deal Pipeline",
            type: "goBackButton",
          },
          {
            title: "Deal",
          },
        ]}
      />

      <div className="cmd-centre-block cmd-centre-block--leadsNew cmd-centre-block--leadsNewDetailsPage cmd-centre-block--account-details">
        {/* {location.state.prevUrl !== undefined ? (
          <Link
            to={{
              pathname: `${location.state.prevUrl}`,
              state: { detail: location.state.accountData },
            }}
            className="leads-new-details-close-block"
          >
            <span className="font-18-semibold">
              <i className="fa fa-times"></i> Close
            </span>
          </Link>
        ) : (
          <Link
            to={{
              pathname: `/deal-pipelines-detail`,
              state: { detail: pipelineData },
            }}
            // to="/deal-pipelines-detail"
            className="leads-new-details-close-block"
          >
            <span className="font-18-semibold">
              <i className="fa fa-times"></i> Close
            </span>
          </Link>
        )} */}

        <Tabs defaultTab="one">
          <TabList>
            <Tab tabFor="one">
              <img src={activeTabCircleImg} alt="" />
              Details
            </Tab>
          </TabList>
          <TabPanel tabId="one">
            <div
              className="accounts-details-tabpanel-div"
              //onDoubleClick={this.handleOnDoubleClickProfileForm}
            >
              {values.isProfileFormDoubleClicked ? (
                <ClosedDealsDetailsProfileForm
                  handleOnClickCancelButton={handleOnDoubleClickProfileForm}
                  handleOnClickSaveButton={handleOnClickSaveButton}
                  errors={values.errors}
                />
              ) : (
                <ClosedDealsDetailsProfileFormDisplay
                  onClickEdit={handleOnDoubleClickProfileForm}
                />
              )}
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </>
  );
}

export default ClosedDealsDetails;
