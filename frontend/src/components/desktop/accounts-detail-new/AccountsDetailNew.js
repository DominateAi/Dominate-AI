import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Tabs, Tab, TabPanel, TabList } from "react-web-tabs";
import Navbar from "../header/Navbar";
import AccountDetailsNewProfileTabPanel from "./AccountDetailsNewProfileTabPanel";
import AccountsDetailRevenue from "../accounts-detail/AccountsDetailRevenue";
import AccountsDetailLeads from "../accounts-detail/AccountsDetailLeads";
import AccountsDetailTimeline from "../accounts-detail/AccountsDetailTimeline";
import AccountDetailsDeals from "../accounts-detail/AccountDetailsDeals";
import { validateAddAccount } from "../../../store/validations/accountsValidation/addAccountValidation";
import { connect } from "react-redux";
import {
  getAccountById,
  getDealsOfPerticulerAccount,
  getLeadsOfPerticulerAccount,
  getRevenueOverview,
  getDealsAndTheirRevenue,
  getRevenueForcastGraph,
  getAccountTimeline,
  getAllNotes,
  updateAccountById,
} from "./../../../store/actions/accountsAction";
import { getAllActiveLeads } from "./../../../store/actions/leadAction";
import isEmpty from "../../../store/validations/is-empty";
import AccountsDetailProfileForm from "./../accounts-detail/AccountsDetailProfileForm";
import AccountsDetailProfileFormDisplay from "./../accounts-detail/AccountsDetailProfileFormDisplay";
import {
  getAllFieldsValue,
  getAllCustomFieldsByEntity,
} from "./../../../store/actions/commandCenter";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import store from "../../../store/store";
import { SET_PAGETITLE } from "./../../../store/types";
import BreadcrumbMenu from "../header/BreadcrumbMenu";

function AccountsDetailNew() {
  const location = useLocation();
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    isProfileFormDoubleClicked: false,
    // errors: {},
    // defaultTab: "one",
    accountTimeline: [],
  });

  const [defaultTab, setDefaultTab] = useState(
    !isEmpty(localStorage.getItem("defaultAccountTab"))
      ? localStorage.getItem("defaultAccountTab")
      : "one"
  );

  const [errors, setErrors] = useState({});

  const accountTimeline = useSelector((state) => state.account.accountTimeline);

  useEffect(() => {
    // dispatch(
    //   getAllFieldsValue({
    //     entity_Id: location.state.detail._id,
    //   })
    // );
    // dispatch(getAllCustomFieldsByEntity("ACCOUNT"));

    // var defaultAccountTab = localStorage.getItem("defaultAccountTab");
    // if (defaultAccountTab === null) {
    //   localStorage.setItem("defaultAccountTab", "one");
    // } else {
    //   setValues({
    //     ...values,
    //     defaultTab: `${defaultAccountTab}`,
    //   });
    // }

    const formLeadData = {
      query: {
        account_id: location.state.detail._id,
        status: { $ne: "ARCHIVE" },
      },
    };
    dispatch(getAccountById(location.state.detail._id));
    dispatch(getDealsOfPerticulerAccount(location.state.detail._id));
    dispatch(getLeadsOfPerticulerAccount(formLeadData));
    dispatch(getRevenueOverview(location.state.detail._id));
    dispatch(getDealsAndTheirRevenue(location.state.detail._id));
    dispatch(getRevenueForcastGraph(location.state.detail._id));
    dispatch(getAccountTimeline(location.state.detail._id));
    const allLeadQuery = {
      query: {},
    };
    dispatch(getAllActiveLeads(allLeadQuery));
    const allNotesQuery = {
      query: {
        entityType: "ACCOUNT",
        entityId: location.state.detail._id,
      },
    };
    dispatch(getAllNotes(allNotesQuery));
    store.dispatch({
      type: SET_PAGETITLE,
      // payload: "Accounts",
      payload: "Sales Centre",
    });

    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!isEmpty(accountTimeline)) {
      setValues({
        ...values,
        accountTimeline: accountTimeline,
      });
    }
  }, [accountTimeline]);

  /*===========================================
            handlers
  =============================================*/

  const handleOnDoubleClickProfileForm = () => {
    setValues({
      ...values,
      isProfileFormDoubleClicked: !values.isProfileFormDoubleClicked,
      // errors: {},
    });
    setErrors({});
  };

  const callBackUpdateAccount = (status) => {
    if (status === 200) {
      setValues({
        ...values,
        isProfileFormDoubleClicked: !values.isProfileFormDoubleClicked,
        // errors: {},
      });
      setErrors({});
    }
  };

  const handleOnClickSaveButton = (data) => (e) => {
    e.preventDefault();

    const { errors, isValid } = validateAddAccount(data);
    // console.log(errors);
    if (!isValid) {
      // this.setState({
      //   // errors: errors,
      // });
      setErrors(errors);
    }
    if (isValid) {
      let formData = data.singleAccountData;
      formData.accountname = data.accountsName;
      formData.location = data.accountsLocation;
      formData.addresses.billing_line_one = data.accountsBillingAddress;
      formData.addresses.shipping_line_one = data.accountsShippingAddress;
      // formData.credibility = data.accountCredibility;
      // formData.description = data.accountAbout;
      // formData.tags = data.tagsArray;
      // formData.accountstatus = data.statusType === true ? "ACTIVE" : "INACTIVE";
      dispatch(
        updateAccountById(
          formData._id,
          formData,
          "",
          "",
          "",
          callBackUpdateAccount
        )
      );
    }
  };

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
            title: "Accounts",
            link: "/accounts-new",
          },
          {
            title: "Account",
          },
        ]}
      />

      <div className="cmd-centre-block cmd-centre-block--leadsNew">
        {/* <div className="row mx-0 align-items-center account-details-new-title-block">
          <Link to="/accounts-new">
            <div className="go-back-yellow-arrow-new-leads">
              <img
                src="/img/desktop-dark-ui/icons/white-back-arrow-circle.svg"
                alt="prev arrow"
              />
            </div>
          </Link>

          <h2 className="page-title-new">Account</h2>
        </div> */}

        <Tabs
          onChange={(tabId) => {
            localStorage.setItem("defaultAccountTab", `${tabId}`);
          }}
          defaultTab={defaultTab}
        >
          <TabList>
            <Tab tabFor="one">Profile</Tab>
            <Tab tabFor="two">General</Tab>
            <Tab tabFor="three">Deals</Tab>
            <Tab tabFor="four">Leads</Tab>
            <Tab tabFor="five">Revenue</Tab>
            <Tab tabFor="six">Timeline</Tab>
          </TabList>
          <TabPanel tabId="one">
            <AccountDetailsNewProfileTabPanel />
          </TabPanel>
          <TabPanel tabId="two">
            <div
              className="accounts-details-tabpanel-div"
              //onDoubleClick={this.handleOnDoubleClickProfileForm}
            >
              {values.isProfileFormDoubleClicked ? (
                <AccountsDetailProfileForm
                  handleOnClickCancelButton={handleOnDoubleClickProfileForm}
                  handleOnClickSaveButton={handleOnClickSaveButton}
                  errors={errors}
                />
              ) : (
                <AccountsDetailProfileFormDisplay
                  onClickEdit={handleOnDoubleClickProfileForm}
                />
              )}
            </div>
          </TabPanel>
          <TabPanel tabId="three">
            <div className="accounts-details-tabpanel-div">
              <AccountDetailsDeals />
            </div>
          </TabPanel>
          <TabPanel tabId="four">
            <div className="accounts-details-tabpanel-div">
              <AccountsDetailLeads />
            </div>
          </TabPanel>
          <TabPanel tabId="five">
            <div className="accounts-details-tabpanel-div">
              <AccountsDetailRevenue />
            </div>
          </TabPanel>
          <TabPanel tabId="six">
            <div className="accounts-details-tabpanel-div">
              <AccountsDetailTimeline
                accountTimeline={values.accountTimeline}
              />
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </>
  );
}

export default AccountsDetailNew;
