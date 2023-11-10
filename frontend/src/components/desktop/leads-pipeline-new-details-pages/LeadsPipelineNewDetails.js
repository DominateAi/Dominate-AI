import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Tabs, Tab, TabPanel, TabList } from "react-web-tabs";
import Navbar from "../header/Navbar";
import ActivityContentEmail from "../activity/ActivityContentEmail";
// api
import isEmpty from "./../../../store/validations/is-empty";
import { leadsTimelineAction } from "./../../../store/actions/leadsActivityAction";
import { getLeadById } from "./../../../store/actions/leadsPipelineAction";
import { getAllEmployeesWithAdmin } from "./../../../store/actions/employeeAction";
// api end
import ActivityContentCallLog from "../activity/ActivityContentCallLog";
import ActivityContentNotes from "../activity/ActivityContentNotes";
import ActivityContentFiles from "../activity/ActivityContentFiles";
import ActivityContentTimeline from "../activity/ActivityContentTimeline";
import LeadsNewDetailsProfile from "../leads-pipeline-new-details-pages/LeadsNewDetailsProfile";
import activeTabCircleImg from "../../../../src/assets/img/leads-new/leads-new-inner-page-active-tab-circle.svg";
import LeadsNewDetailsActivityLog from "../leads-pipeline-new-details-pages/LeadsNewDetailsActivityLog";
import LeadsNewDetailsProfileForm from "../leads-pipeline-new-details-pages/LeadsNewDetailsProfileForm";
import LeadsNewDetailsProfileFormDisplay from "../leads-pipeline-new-details-pages/LeadsNewDetailsProfileFormDisplay";
import {
  updateLeadAction,
  getAllLeadsPipelineStages,
} from "./../../../store/actions/leadsPipelineAction";
import { validateEditLead } from "../../../store/validations/leadsValidation/editLeadValidation";
import {
  getAllLeadsNotes,
  getAllFilesAction,
  getAllLeadsEmail,
  getAllLeadsArchiveEmail,
  getLeadActivityLog,
} from "./../../../store/actions/leadsActivityAction";
// import { getConnectAccounts } from "./../../desktop/Connect/store/actions/authAction";
import {
  // getAllFieldsValue,
  // getAllCustomFieldsByEntity,
  updateFieldValueById,
} from "./../../../store/actions/commandCenter";
import { getAllAccounts } from "./../../../store/actions/accountsAction";
import LeadsNewNotes from "../leads-pipeline-new-details-pages/LeadsNewNotes";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { SET_PAGETITLE } from "./../../../store/types";
import store from "./../../../store/store";

function LeadsPipelineNewDetails() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [values, setValues] = useState({
    leadActivityData: [],
    leadAllTimeline: [],
    isProfileFormDoubleClicked: false,
    errors: {},
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    // console.log(this.props.location.state.prevUrl);
    dispatch(getLeadById(location.state.detail._id));
    dispatch(leadsTimelineAction(location.state.detail._id));
    dispatch(getAllLeadsNotes(location.state.detail._id));
    dispatch(getAllFilesAction(location.state.detail._id));
    dispatch(getAllLeadsEmail(location.state.detail._id));
    dispatch(getAllLeadsArchiveEmail(location.state.detail._id));
    dispatch(getAllEmployeesWithAdmin());
    // dispatch(getConnectAccounts());
    dispatch(getAllAccounts());
    const formData = {
      query: {
        lead: location.state.detail._id,
      },
    };
    dispatch(getLeadActivityLog(formData));
    // dispatch(
    //   getAllFieldsValue({
    //     entity_Id: location.state.detail._id,
    //   })
    // );
    // dispatch(getAllCustomFieldsByEntity("LEAD"));
    dispatch(
      getAllLeadsPipelineStages({
        query: {
          pipeline: location.state.detail.pipeline,
        },
      })
    );
    store.dispatch({
      type: SET_PAGETITLE,
      // payload: "Leads",
      payload: "Sales Centre",
    });
  }, []);

  const leadActivityData = useSelector(
    (state) => state.leads.leadActivitySummary
  );
  const leadAllTimeline = useSelector((state) => state.leads.leadAllTimeline);

  useEffect(() => {
    if (!isEmpty(leadActivityData)) {
      setValues({
        ...values,
        leadActivityData: leadActivityData,
      });
    }
  }, [leadActivityData]);

  useEffect(() => {
    if (!isEmpty(leadAllTimeline)) {
      setValues({
        ...values,
        leadAllTimeline: leadAllTimeline,
      });
    }
  }, [leadAllTimeline]);

  const handleOnDoubleClickProfileForm = () => {
    setValues({
      ...values,
      isProfileFormDoubleClicked: !values.isProfileFormDoubleClicked,
      errors: {},
    });
  };

  const callBackHandleSave = (status) => {
    if (status === 200) {
      console.log(status);
      setValues({
        ...values,
        isProfileFormDoubleClicked: false,
        errors: {},
      });
    }
  };

  const handleOnClickSaveButton = (data) => (e) => {
    e.preventDefault();

    const { errors, isValid } = validateEditLead(data);

    if (!isValid) {
      setValues({
        ...values,
        errors,
      });
    }
    if (isValid) {
      setValues({
        ...values,
        errors: {},
      });
      const { countryCode } = data;
      let newleadsPhoneCountryNumber = [];
      if (countryCode.slice(0, 1) === "+") {
        newleadsPhoneCountryNumber = countryCode.split("+");
        newleadsPhoneCountryNumber = newleadsPhoneCountryNumber[1];
        // console.log(newleadsPhoneCountryNumber);
      } else {
        newleadsPhoneCountryNumber = countryCode;
        // console.log(newleadsPhoneCountryNumber);
      }

      const {
        customTextboxfieldData,
        customeDropdownFieldData,
        leadsCustomFields,
      } = data;

      //UPDATING FIELD VALUE FOR CUSTOM FIELDS
      if (!isEmpty(leadsCustomFields)) {
        leadsCustomFields.forEach((element) => {
          if (element.fieldData.type === "TEXTBOX") {
            element.fieldData.name = element.fieldData.name.split(" ").join("");
            let sendData = element;
            sendData.value = isEmpty(customTextboxfieldData)
              ? ""
              : customTextboxfieldData[element.fieldData.name];

            dispatch(updateFieldValueById(sendData));
          } else if (element.fieldData.type === "DROPDOWN") {
            element.fieldData.name = element.fieldData.name.split(" ").join("");
            let sendData = element;
            sendData.value = isEmpty(customeDropdownFieldData)
              ? ""
              : customeDropdownFieldData[element.fieldData.name].value;

            dispatch(updateFieldValueById(sendData));
          }
        });
      }

      dispatch(
        updateLeadAction(
          data.leadData._id,
          {
            name: data.leadsName,
            company: data.company,
            email: data.leadsemail,
            phone: "+" + newleadsPhoneCountryNumber + data.phoneNumber,
            phoneCode: newleadsPhoneCountryNumber,
            tags: data.tagsArray,
            additionalInfo: "{'sdsd':'sdsd'}",
            profileImage: "https://xyz.com",
            about: data.leadsAbout,
            media: {
              facebook: data.leadMediaFacebookInput,
              linkedIn: data.leadMediaLinkedInInput,
              instagram: data.leadMediaInstagramInput,
              other: data.leadMediaOthersInput,
              skype: data.leadsSkypeAddress,
            },
            worth: data.leadsWorthAmount,
            source: data.selectedLeadsSourceDropdownOption.value,
          },
          "",
          "",
          callBackHandleSave
        )
      );
    }
  };

  return (
    <>
      <Navbar />

      <div className="cmd-centre-block cmd-centre-block--leadsNew cmd-centre-block--leadsNewDetailsPage">
        {location.state.prevUrl !== undefined ? (
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
          <Link to={"/leads-new"} className="leads-new-details-close-block">
            <span className="font-18-semibold">
              <i className="fa fa-times"></i> Close
            </span>
          </Link>
        )}

        <Tabs defaultTab="one">
          <TabList>
            <Tab tabFor="one">
              <img src={activeTabCircleImg} alt="" />
              Profile
            </Tab>
            <Tab tabFor="two">
              <img src={activeTabCircleImg} alt="" />
              Activity Log
            </Tab>
            <Tab tabFor="three">
              <img src={activeTabCircleImg} alt="" />
              Email
            </Tab>
            <Tab tabFor="four">
              <img src={activeTabCircleImg} alt="" />
              Call Log
            </Tab>
            <Tab tabFor="five">
              <img src={activeTabCircleImg} alt="" />
              Notes
            </Tab>
            <Tab tabFor="six">
              <img src={activeTabCircleImg} alt="" />
              Files
            </Tab>
            <Tab tabFor="seven">
              <img src={activeTabCircleImg} alt="" />
              Timeline
            </Tab>
          </TabList>
          <TabPanel tabId="one">
            <LeadsNewDetailsProfile
              leadActivityData={values.leadActivityData}
              leadActivitySummary={values.leadActivityData}
            />
            <div
              className="leads-new-details-content-card-bg leads-new-details-content-card-shadow"
              //onDoubleClick={this.handleOnDoubleClickProfileForm}
            >
              {values.isProfileFormDoubleClicked ? (
                <LeadsNewDetailsProfileForm
                  leadActivityData={values.leadActivityData}
                  errors={values.errors}
                  handleOnClickCancelButton={handleOnDoubleClickProfileForm}
                  handleOnClickSaveButton={handleOnClickSaveButton}
                  callBackHandleSave={callBackHandleSave}
                />
              ) : (
                <LeadsNewDetailsProfileFormDisplay
                  onEditButton={handleOnDoubleClickProfileForm}
                />
              )}
            </div>
          </TabPanel>
          <TabPanel tabId="two">
            <div className="leads-new-details-content-card-bg-activity leads-new-details-content-card-shadow">
              <LeadsNewDetailsActivityLog
                leadActivityData={values.leadActivityData}
              />
            </div>
          </TabPanel>
          <TabPanel tabId="three">
            <div className="leads-new-details-content-card-bg">
              <ActivityContentEmail
                leadActivityData={values.leadActivityData}
              />
            </div>
          </TabPanel>
          <TabPanel tabId="four">
            <div className="leads-new-details-content-card-bg">
              <ActivityContentCallLog
                leadActivityData={values.leadActivityData}
              />
            </div>
          </TabPanel>
          <TabPanel tabId="five">
            <div className="leads-new-details-content-card-bg">
              {/*<ActivityContentNotes leadActivityData={leadActivityData} />*/}
              <LeadsNewNotes />
            </div>
          </TabPanel>
          <TabPanel tabId="six">
            <div className="leads-new-details-content-card-bg">
              <ActivityContentFiles
                leadActivityData={values.leadActivityData}
              />
            </div>
          </TabPanel>
          <TabPanel tabId="seven">
            <div className="leads-new-details-content-card-bg">
              <ActivityContentTimeline
                leadAllTimeline={values.leadAllTimeline}
              />
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </>
  );
}

export default LeadsPipelineNewDetails;
