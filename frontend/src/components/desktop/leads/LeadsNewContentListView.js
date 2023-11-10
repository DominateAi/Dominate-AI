import React, { useState, useEffect, Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Select from "react-select";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import DropdownIcon from "rc-dropdown";
import "rc-dropdown/assets/index.css";
import Menu, { Item as MenuItem, Divider } from "rc-menu";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import { connect } from "react-redux";
import Modal from "react-responsive-modal";
import {
  getMyLeads,
  deleteLead,
  addToKanBanAction,
  hideLeadAction,
  unhideLeadAction,
  leadsFilterByStatus,
  updateLeadAction,
  updateLeadLevelAction,
  getOverviewFilterForCount,
} from "./../../../store/actions/leadAction";
import {
  addFollowUpLead,
  addLeadMeetingsAction,
} from "./../../../store/actions/calenderAction";
import { getAllEmployeesWithAdmin } from "./../../../store/actions/employeeAction";
import { addToLog } from "./../../../store/actions/leadsActivityAction";
import AddEmployeesFormFields from "./../../desktop/employees/AddEmployeesFormFields";

import { statusEmpty } from "./../../../store/actions/authAction";
import isEmpty from "./../../../store/validations/is-empty";
import { validateEditMeetingFollowup } from "../../../store/validations/followUpValidations/editFollowupMeeting";
import DatePicker from "react-datepicker";
import CustomEditDropdown from "../common/CustomEditDropdown";
import AddLeadsFormField from "./AddLeadsFormField";
import AddLeadFormAssignRepresentative from "./AddLeadFormAssignRepresentative";
import AddLeadFormSelectFewTags from "./AddLeadFormSelectFewTags";
import AddLeadFormMediaAccount from "./AddLeadFormMediaAccount";
import AddLeadFormShippingDetails from "./AddLeadFormShippingDetails";
import { validateEditLead } from "../../../store/validations/leadsValidation/editLeadValidation";
import AddLeadBlueProgressbar from "./AddLeadBlueProgressbar";
import EditLeadSocialMediaAccount from "./EditLeadSocialMediaAccount";
import EditLeadShippingDetails from "./EditLeadShippingDetails";
import DeleteWarningPopup from "./../common/DeleteWarningPopup";

// phone flags country code
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { maxLengths } from "../../../store/validations/maxLengths/MaxLengths";
import AddMemberSelectAndDisplayList from "../common/AddMemberSelectAndDisplayList";
import {
  SET_KANBAN_VIEW,
  SET_LOADER,
  SET_CONFETTI_ANIMATION,
} from "./../../../store/types";
import store from "../../../store/store";
import CustomerOnBoardPopup from "./CustomerOnBoardPopup";
import AddConvertedLeadAsDeal from "./AddConvertedLeadAsDeal";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import displaySmallText from "./../../../store/utils/sliceString";
import AddLead from "./AddLead";

const emojiOption = ["🌋", "☀️", "☕", "❄️️"];

const optionsLevel = ["All", "🌋", "☀️", "☕", "❄️️"];

// const optionsAssignedTo = [
//   // "Status",
//   "John Doe",
//   "Anna Mull",
//   "Paul Molive",
// ];

const options = [
  // "Status",
  "All leads",
  "New leads",
  "Qualified leads",
  "On Hold Leads",
  "Contacted Leads",
  "Opportunity Leads",
  "Converted leads",
];

const statusOptionsRow = [
  "New Lead",
  "Qualified Lead",
  "On Hold Lead",
  "Contacted Lead",
  "Opportunity Lead",
  "Converted Lead",
  "Drop Lead",
];

// FETCH THE LIST FROM THE BACKEND
// const list = ["Make a Call", "Email", "Meeting"];
const selectDropdownOptions = [
  { value: "Make a Call", label: "Make a Call" },
  { value: "Email", label: "Email" },
  { value: "Whatsapp", label: "Whatsapp" },
  { value: "Sms", label: "Sms" },
  // { value: "Meeting", label: "Meeting" },
];

// const leadsSourceOptions = ["Facebook", "LinkedIn", "Instagram", "Other"];
const leadsSourceOptions = [
  { value: "Facebook", label: "Facebook" },
  { value: "LinkedIn", label: "LinkedIn" },
  { value: "Instagram", label: "Instagram" },
  { value: "Others", label: "Others" },
];

const defaultTagsValues = [];

// pagination
const totalRecordsInOnePage = 15;

const totalFormSlides = 11;

function LeadsNewContentListView({ overviewFilterName, defaultOption }) {
  const history = useHistory();
  const dispatch = useDispatch();

  const [values, setValues] = useState({
    deleteWarningPopup: false,
    defaultOption: "Status",
    defaultLevelOption: "Level",
    defaultAssignedToOption: "Assigned To",
    optionsAssignedTo: [],
    allLeads: {},
    loginUserId: [],
    /*===============
        Follow up state
      ================*/
    addFollowUpPopUp: false,
    selectedOptionDropdown: selectDropdownOptions[0],
    selectedOption: selectDropdownOptions[0].value,
    // dropdown: false,
    // suggestionList: list,
    startDate: new Date(),
    startTime: new Date(),
    followUpLocation: "",
    leadData: [],
    success: false,

    /*=================
        Lead Edit  state
      ===================*/
    prevNextIndex: 0,
    options: [],
    selectOption: "",
    displayListSelected: [],
    leadsName: "",
    leadsemail: "",
    leadsAddress: "",
    leadsWorkInCompanyName: "",
    leadsPhoneCountryNumber: "",
    leadsPhoneNumber: "",
    leadsWorthAmount: "",
    // selectedLeadsSourceDropdownOption: leadsSourceOptions[0],
    // leadsSourceDropdownOption: leadsSourceOptions[0].value,
    selectedLeadsSourceDropdownOption: null,
    leadsSourceDropdownOption: "",
    leadsAbout: "",
    leadMediaEmailCheckbox: "",
    leadMediaEmailInput: "",
    leadMediaLinkedInCheckbox: false,
    leadMediaLinkedInInput: "",
    leadMediaFacebookCheckbox: false,
    leadMediaFacebookInput: "",
    leadMediaInstagramCheckbox: false,
    leadMediaInstagramInput: "",
    leadMediaOthersCheckbox: false,
    leadMediaOthersInput: "",
    leadsSkypeAddress: "",
    leadsShippingAddress: "",
    leadsShippingBilling: "",
    leadsShippingCheckbox: "",
    leadsShippingState: "",
    leadsShippingCity: "",
    leadsShippingPinCode: "",
    leadsShippingWebsite: "",
    leadAssignRepresentative: "",
    tagsArray: defaultTagsValues,
    tagsInputValue: [],
    errors: [],
    leadEditPopup: false,
    allEmployees: [],
    activeEmployee: [],
    // pagination
    currentPagination: 1,
    // api
    getItemsList: {},
    addToLogModel: false,
    leadFollowUpNew: "Make a Call",
    customerOnBoardPopup: false,
  });

  const allLeads = useSelector((state) => state.leads.allLeads);
  const allEmployees = useSelector((state) => state.employee.allEmployees);
  const leadFilterName = useSelector((state) => state.filterName.filterName);
  const userRole = useSelector((state) => state.auth.user.role.name);
  const activeWalkthroughPage = useSelector(
    (state) => state.auth.activeWalkthroughPage
  );
  const searchInAllPage = useSelector((state) => state.search.searchInAllPage);
  const allAccounts = useSelector((state) => state.account.allAccounts);
  const overviewFilterNameReducer = useSelector(
    (state) => state.filterName.overviewFilterName
  );

  useEffect(() => {
    var userData = JSON.parse(localStorage.getItem("Data"));
    dispatch(getAllEmployeesWithAdmin());
    const myLeadQuery = {
      // pageNo: 10,
      // pageSize: 0,
      query: {
        assigned: userData.id,
        status: { $ne: "ARCHIVE" },
      },
    };
    dispatch(getMyLeads(myLeadQuery));
  }, []);

  useEffect(() => {
    if (!isEmpty(allLeads)) {
      setValues({
        ...values,
        allLeads: allLeads ? allLeads : [],
        getItemsList: allLeads,
      });
    } else {
      setValues({
        ...values,
        allLeads: allLeads,
        getItemsList: allLeads,
      });
    }
  }, [allLeads]);

  useEffect(() => {
    if (!isEmpty(allEmployees)) {
      let filterEmp = allEmployees.filter(function (allEmployees) {
        return allEmployees.status === "ACTIVE";
      });

      // let newArray = [{ value: "Assigned To All", label: "Assigned To All" }];

      // if (!isEmpty(allEmployees)) {
      //   allEmployees.forEach((ele) => {
      //     newArray.push({ value: ele._id, label: ele.name });
      //   });
      // }

      let newArray =
        !isEmpty(allEmployees) &&
        allEmployees.map((member) => ({
          value: member._id,
          label: member.name,
        }));
      setValues({
        ...values,
        allEmployees: filterEmp,
        optionsAssignedTo: newArray,
      });
    }
  }, [allEmployees]);

  useEffect(() => {
    if (!isEmpty(allAccounts)) {
      let newArray =
        !isEmpty(allAccounts) &&
        allAccounts.map((account) => ({
          value: account._id,
          label: account.accountname,
        }));
      setValues({
        ...values,
        options: newArray,
        // allAccounts: allAccounts,
      });
    }
  }, [allAccounts]);

  // pagination
  const onChangePagination = (page) => {
    setValues({
      ...values,
      currentPagination: page,
    });
    if (!isEmpty(overviewFilterName)) {
      //call according to overviewfilter name reducer
    } else {
      //call according to filter name reducer
    }
  };

  // start select tags handlers
  const handleSelectTagsOnChange = (e) => {
    setValues({
      ...values,
      tagsInputValue: [e.target.value],
    });
  };

  /*=================================
   follow up select On click Handler
  ==================================*/
  const onClickFllowUpButton = (followup) => (e) => {
    e.preventDefault();
    console.log(followup);
    setValues({
      ...values,
      leadFollowUpNew: followup,
    });
  };

  const handleSelectTagsOnKeyPress = (e) => {
    let keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
      setValues({
        ...values,
        prevNextIndex: values.leadFollowUpNewprevNextIndex - 1,
      });
      // split the str and remove the empty values
      console.log(values.leadFollowUpNewtagsInputValue, "before trim");
      //let tagsInputValue = this.state.tagsInputValue.toString().split(",");
      let tagArray = values.tagsInputValue.toString().split(",");
      let tagsInputValue = tagArray.map((string) => string.trim());
      console.log(tagsInputValue, "after trim");
      let len = tagsInputValue.length;
      let i = 0;
      while (len > i) {
        while (tagsInputValue[i] === "") {
          tagsInputValue.splice(i, 1);
        }
        i++;
      }

      //array length
      let tagLength = values.tagsArray.length;
      console.log(tagLength);

      if (tagLength >= 5) {
        window.alert("Tags limit reached.");
      } else {
        if (tagsInputValue.length !== 0) {
          // update the states
          // condition to accept only 4 tags
          // this.setState({
          //   tagsArray:
          //     [...this.state.tagsArray, ...tagsInputValue].length > 4
          //       ? [...this.state.tagsArray, ...tagsInputValue].slice(0, 4)
          //       : [...this.state.tagsArray, ...tagsInputValue],
          //   tagsInputValue: []
          // });
          setValues({
            ...values,
            tagsArray: [...this.state.tagsArray, ...tagsInputValue],
            tagsInputValue: [],
          });
        }
        // console.log(this.state.tagsArray, this.state.tagsInputValue);
      }
    }
  };
  const handleSelectFewTagsOnClick = (e) => {
    // condition to accept only 4 tags
    // this.setState({
    //   tagsArray:
    //     [...this.state.tagsArray, e.target.innerHTML].length > 4
    //       ? [...this.state.tagsArray, e.target.innerHTML].slice(0, 4)
    //       : [...this.state.tagsArray, e.target.innerHTML]
    // });

    //array length
    let tagLength = values.tagsArray.length;
    console.log(tagLength);

    if (tagLength >= 5) {
      window.alert("Tags limit reached.");
    } else {
      setValues({
        ...values,
        tagsArray: [...values.tagsArray, e.target.innerHTML],
      });
    }
  };

  const handleRemoveTag = (val) => {
    var tags = [...values.tagsArray];
    var i = tags.indexOf(val);
    if (i !== -1) {
      tags.splice(i, 1);
      setValues({
        ...values,
        open: true,
        tagsArray: tags,
      });
    }
  };

  // end select tags handlers

  const handleSaveAboutLead = () => {
    // alert(this.state.leadsAbout);
  };

  const handleCheckboxChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;

    setValues({
      ...values,
      [e.target.id]: value,
    });

    if (e.target.id === "leadsShippingCheckbox" && e.target.checked === true) {
      setValues({
        ...values,
        leadsShippingBilling: values.leadsShippingAddress,
      });
    } else {
      setValues({
        ...values,
        leadsShippingBilling: "",
      });
    }

    // console.log("Checkbox checked:", e.target.checked, e.target.id, value);
  };

  const handleRepresentativeOnClick = (employee) => (e) => {
    // console.log(employee);
    e.stopPropagation();
    e.preventDefault();
    setValues({
      ...values,
      leadAssignRepresentative: employee.name,
      leadAssignRepresentativeId: employee._id,
      activeEmployee: employee._id,
    });
  };

  const callBackLeadUpdate = (status) => {
    if (status === 200) {
      onCloseModal();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(this.state);
    var userData = JSON.parse(localStorage.getItem("Data"));

    const { errors, isValid } = validateEditLead(values);
    if (!isValid) {
      setValues({
        ...values,
        errors,
      });
    }
    if (isValid) {
      const { leadsPhoneCountryNumber } = values;
      let newleadsPhoneCountryNumber = [];
      if (leadsPhoneCountryNumber.slice(0, 1) === "+") {
        newleadsPhoneCountryNumber = leadsPhoneCountryNumber.split("+");
        newleadsPhoneCountryNumber = newleadsPhoneCountryNumber[1];
        // console.log(newleadsPhoneCountryNumber);
      } else {
        newleadsPhoneCountryNumber = leadsPhoneCountryNumber;
        // console.log(newleadsPhoneCountryNumber);
      }

      // console.log(this.state);
      dispatch(
        updateLeadAction(
          values.leadData._id,
          {
            name: values.leadsName,
            company: values.leadsWorkInCompanyName,
            email: values.leadsemail,
            phone: "+" + newleadsPhoneCountryNumber + values.leadsPhoneNumber,
            // shippingAddress: {
            //   state: values.leadsShippingState,
            //   city: values.leadsShippingCity,
            //   pincode: values.leadsShippingPinCode,
            //   website: values.leadsShippingWebsite,
            //   countryCode: values.leadsPhoneCountryNumber,
            //   livingAddress: values.leadsAddress,
            // },
            phoneCode: values.leadsPhoneCountryNumber,
            billingAddress: values.leadsShippingBilling,
            status: values.leadData.status,
            tags: values.tagsArray,
            assigned: values.leadAssignRepresentativeId,
            additionalInfo: "",
            profileImage: "https://xyz.com",
            about: values.leadsAbout,
            degree: values.leadData.degree,
            media: {
              facebook: values.leadMediaFacebookInput,

              linkedIn: values.leadMediaLinkedInInput,

              instagram: values.leadMediaInstagramInput,

              other: values.leadMediaOthersInput,
              skype: values.leadsSkypeAddress,
            },
            worth: values.leadsWorthAmount,
            source: values.leadsSourceDropdownOption,
            isKanban: values.leadData.isKanban,
            isHidden: values.leadData.isHidden,
          },
          userData.id,
          leadFilterName,
          callBackLeadUpdate
        )
      );
    }
  };

  /*===================================
     leads source dropdown
  ====================================*/

  const onSourceDropdownSelect = (e) => {
    setValues({
      ...values,
      selectedLeadsSourceDropdownOption: e,
      leadsSourceDropdownOption: e.value,
    });
  };

  const handlePrev = () => {
    setValues({
      ...values,
      prevNextIndex: values.prevNextIndex - 1,
    });
  };

  // handle next on key enter
  const onFormKeyDown = (e) => {
    if (e.keyCode === 13 && values.prevNextIndex !== 8) {
      e.preventDefault();
      handleNext();
    }
  };

  const onFormKeyDownEditLeadNew = (e) => {
    if (e.keyCode === 13 && e.target.name !== "SaveButtonNewEditForm") {
      e.preventDefault();
    }
  };

  const handleNext = () => {
    const { errors, isValid } = validateEditLead(values);

    if (values.prevNextIndex === 0) {
      if (errors.leadsName) {
        setValues({
          ...values,
          errors,
          prevNextIndex: values.prevNextIndex,
        });
      } else {
        setValues({
          ...values,
          prevNextIndex: values.prevNextIndex + 1,
          errors: {},
        });
      }
    } else if (values.prevNextIndex === 1) {
      if (errors.leadsemail) {
        setValues({
          ...values,
          errors,
          prevNextIndex: values.prevNextIndex,
        });
      } else {
        setValues({
          ...values,
          prevNextIndex: values.prevNextIndex + 1,
          errors: {},
        });
      }
    } else if (values.prevNextIndex === 2) {
      if (errors.leadsPhoneCountryNumber || errors.leadsPhoneNumber) {
        setValues({
          ...values,
          errors,
          prevNextIndex: values.prevNextIndex,
        });
      } else {
        setValues({
          ...values,
          prevNextIndex: values.prevNextIndex + 1,
          errors: {},
        });
      }
    } else if (values.prevNextIndex === 3) {
      if (errors.leadAssignRepresentative) {
        setValues({
          ...values,
          errors,
          prevNextIndex: values.prevNextIndex,
        });
      } else {
        setValues({
          ...values,
          prevNextIndex: values.prevNextIndex + 1,
          errors: {},
        });
      }
    } else if (values.prevNextIndex === 4) {
      if (errors.leadsWorthAmount) {
        setValues({
          ...values,
          errors,
          prevNextIndex: values.prevNextIndex,
        });
      } else {
        setValues({
          ...values,
          prevNextIndex: values.prevNextIndex + 1,
          errors: {},
        });
      }
    } else if (values.prevNextIndex === 9) {
      if (
        errors.leadMediaLinkedInInput ||
        errors.leadMediaFacebookInput ||
        errors.leadMediaInstagramInput ||
        errors.leadMediaOthersInput
      ) {
        setValues({
          ...values,
          errors,
          prevNextIndex: values.prevNextIndex,
        });
      } else {
        setValues({
          ...values,
          prevNextIndex: values.prevNextIndex + 1,
          errors: {},
        });
      }
    } else if (values.prevNextIndex === 11) {
      if (
        errors.leadsShippingState ||
        errors.leadsShippingCity ||
        errors.leadsShippingPinCode ||
        errors.leadsShippingBilling
      ) {
        setValues({
          ...values,
          errors,
          prevNextIndex: values.prevNextIndex,
        });
      } else {
        setValues({
          ...values,
          prevNextIndex: values.prevNextIndex,
          errors: {},
        });
      }
    } else {
      setValues({
        ...values,
        prevNextIndex:
          values.prevNextIndex < totalFormSlides
            ? values.prevNextIndex + 1
            : values.prevNextIndex,
        errors: {},
      });
    }
  };

  /*===============================
      Customer Form events Handlers
  =================================*/

  const handleChange = (e) => {
    if ([e.target.name].toString() === "leadsShippingPinCode") {
      setValues({
        ...values,
        [e.target.name]: e.target.validity.valid ? e.target.value : "",
      });
    } else {
      setValues({
        ...values,
        [e.target.name]: e.target.value,
      });
    }
  };

  /*===============================================
      select account
  ===============================================*/

  const handleChangeSelectClient = (selectedOption) => {
    setValues({
      ...values,
      selectOption: selectedOption,
      errors: { displayListSelected: "" },
    });

    // add option to list if it's not present in list
    let newList = values.displayListSelected;
    if (newList.indexOf(selectedOption) === -1) {
      newList.push(selectedOption);
      setValues({
        ...values,
        displayListSelected: newList,
      });
    }
  };

  const handleRemoveMember = (index) => (e) => {
    let newList = values.displayListSelected;
    newList.splice(index, 1);
    setValues({
      ...values,
      selectOption: "",
      displayListSelected: newList,
    });
  };

  /*===============================================
      select account end
  ===============================================*/

  const handleChangeNumber = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.validity.valid ? e.target.value : "",
    });
  };

  const onAllLeadDropdownSelect = (leadData) => (e) => {
    var userData = JSON.parse(localStorage.getItem("Data"));
    console.log("Selected: " + e.value);
    if (e.value === "🌋") {
      dispatch(
        updateLeadLevelAction(
          leadData._id,
          { degree: "SUPER_HOT" },
          leadFilterName,
          userData.id
        )
      );
    } else if (e.value === "☀️") {
      dispatch(
        updateLeadLevelAction(
          leadData._id,
          { degree: "HOT" },
          leadFilterName,
          userData.id
        )
      );
    } else if (e.value === "☕") {
      dispatch(
        updateLeadLevelAction(
          leadData._id,
          { degree: "WARM" },
          leadFilterName,
          userData.id
        )
      );
    } else {
      dispatch(
        updateLeadLevelAction(
          leadData._id,
          { degree: "COLD" },
          leadFilterName,
          userData.id
        )
      );
    }
  };

  /*==========================================
              onAssignToOptionsRowClick
  ============================================*/

  const onAssignToOptionsRowClick = (leadData) => (e) => {
    var userData = JSON.parse(localStorage.getItem("Data"));
    // console.log(e.value);
    const { allEmployees } = values;

    let filterEmp = allEmployees.filter(function (allEmployees) {
      return allEmployees.name === e.value;
    });
    console.log(filterEmp[0]._id);
    let leadAllData = leadData;
    leadAllData.assigned = filterEmp[0]._id;

    dispatch(
      updateLeadAction(leadData._id, leadAllData, userData.id, leadFilterName)
    );
  };

  /*==========================================
              onStatusOptionsRowClick
  ============================================*/

  const onStatusOptionsRowClick = (leadData) => (e) => {
    var userData = JSON.parse(localStorage.getItem("Data"));
    // console.log(e.value);
    // console.log(leadData);
    // this.setState({
    //   leadData: leadData,
    // });
    if (e.value === "New Lead") {
      let leadAllData = leadData;
      leadAllData.status = "NEW_LEAD";

      dispatch(
        updateLeadAction(leadData._id, leadAllData, userData.id, leadFilterName)
      );
    } else if (e.value === "Qualified Lead") {
      let leadAllData = leadData;
      leadAllData.status = "QUALIFIED_LEADS";

      dispatch(
        updateLeadAction(leadData._id, leadAllData, userData.id, leadFilterName)
      );
    } else if (e.value === "On Hold Lead") {
      let leadAllData = leadData;
      leadAllData.status = "ON_HOLD";

      dispatch(
        updateLeadAction(leadData._id, leadAllData, userData.id, leadFilterName)
      );
    } else if (e.value === "Contacted Lead") {
      let leadAllData = leadData;
      leadAllData.status = "CONTACTED_LEADS";

      dispatch(
        updateLeadAction(leadData._id, leadAllData, userData.id, leadFilterName)
      );
    } else if (e.value === "Opportunity Lead") {
      let leadAllData = leadData;
      leadAllData.status = "OPPORTUNITIES";

      dispatch(
        updateLeadAction(leadData._id, leadAllData, userData.id, leadFilterName)
      );
    } else if (e.value === "Converted Lead") {
      window.scrollTo(0, 0);
      let leadAllData = leadData;
      leadAllData.status = "CONVERTED";
      leadAllData.entityType = "Lead";
      leadAllData.entityId = leadData._id;
      leadAllData.convertedDate = new Date().toISOString();
      dispatch(
        updateLeadAction(leadData._id, leadAllData, userData.id, leadFilterName)
      );
      // store.dispatch({
      //   type: SET_CONFETTI_ANIMATION,
      //   payload: true,
      // });
      // this.setState({
      //   customerOnBoardPopup: true,
      // });
    } else if (e.value === "Drop Lead") {
      let leadAllData = leadData;
      leadAllData.status = "DROPPED_LEAD";
      leadAllData.convertedDate = new Date().toISOString();
      dispatch(
        updateLeadAction(leadData._id, leadAllData, userData.id, leadFilterName)
      );
    }
  };

  /*==========================================
                Status Filter
  ============================================*/

  const onStatusClick = (e) => {
    var userData = JSON.parse(localStorage.getItem("Data"));
    setValues({
      ...values,
      defaultOption: e.value,
    });

    // console.log(this.state.defaultOption);
    if (e.value === "New leads") {
      /*======================================================= 
          if selecte All Leads, My Leads And Hidden Leads
      ========================================================*/
      if (defaultOption === "All Leads") {
        const leadFilter = {
          // "pageNo": 10,
          // "pageSize": 0,
          query: {
            status: "NEW_LEAD",
            isHidden: false,
            // "assigned":"a6646520-c01e-11e9-ad3c-cd499e5e599c"
          },
        };
        dispatch(leadsFilterByStatus(leadFilter));
      } else if (defaultOption === "My Leads") {
        const leadFilter = {
          // "pageNo": 10,
          // "pageSize": 0,
          query: {
            status: "NEW_LEAD",
            isHidden: false,
            assigned: userData.id,
          },
        };
        dispatch(leadsFilterByStatus(leadFilter));
      } else if (defaultOption === "Hidden Leads") {
        const leadFilter = {
          // "pageNo": 10,
          // "pageSize": 0,
          query: {
            status: "NEW_LEAD",
            isHidden: true,
            // assigned: this.state.loginUserId
          },
        };
        dispatch(leadsFilterByStatus(leadFilter));
      }
    } else if (e.value === "Qualified leads") {
      /*======================================================= 
          if selecte All Leads, My Leads And Hidden Leads
      ========================================================*/
      if (defaultOption === "All Leads") {
        const leadFilter = {
          // "pageNo": 10,
          // "pageSize": 0,
          query: {
            status: "QUALIFIED_LEADS",
            isHidden: false,
            // "assigned":"a6646520-c01e-11e9-ad3c-cd499e5e599c"
          },
        };
        dispatch(leadsFilterByStatus(leadFilter));
      } else if (defaultOption === "My Leads") {
        const leadFilter = {
          // "pageNo": 10,
          // "pageSize": 0,
          query: {
            status: "QUALIFIED_LEADS",
            isHidden: false,
            assigned: userData.id,
          },
        };
        dispatch(leadsFilterByStatus(leadFilter));
      } else if (defaultOption === "Hidden Leads") {
        const leadFilter = {
          // "pageNo": 10,
          // "pageSize": 0,
          query: {
            status: "QUALIFIED_LEADS",
            isHidden: true,
            // assigned: this.state.loginUserId
          },
        };
        dispatch(leadsFilterByStatus(leadFilter));
      }
    } else if (e.value === "On Hold Leads") {
      /*======================================================= 
          if selecte All Leads, My Leads And Hidden Leads
      ========================================================*/
      if (defaultOption === "All Leads") {
        const leadFilter = {
          // "pageNo": 10,
          // "pageSize": 0,
          query: {
            status: "ON_HOLD",
            isHidden: false,
            // "assigned":"a6646520-c01e-11e9-ad3c-cd499e5e599c"
          },
        };
        dispatch(leadsFilterByStatus(leadFilter));
      } else if (defaultOption === "My Leads") {
        const leadFilter = {
          // "pageNo": 10,
          // "pageSize": 0,
          query: {
            status: "ON_HOLD",
            isHidden: false,
            assigned: userData.id,
          },
        };
        dispatch(leadsFilterByStatus(leadFilter));
      } else if (defaultOption === "Hidden Leads") {
        const leadFilter = {
          // "pageNo": 10,
          // "pageSize": 0,
          query: {
            status: "ON_HOLD",
            isHidden: true,
            // assigned: this.state.loginUserId
          },
        };
        dispatch(leadsFilterByStatus(leadFilter));
      }
    } else if (e.value === "Contacted Leads") {
      /*======================================================= 
          if selecte All Leads, My Leads And Hidden Leads
      ========================================================*/
      if (defaultOption === "All Leads") {
        const leadFilter = {
          // "pageNo": 10,
          // "pageSize": 0,
          query: {
            status: "CONTACTED_LEADS",
            isHidden: false,
            // "assigned":"a6646520-c01e-11e9-ad3c-cd499e5e599c"
          },
        };
        dispatch(leadsFilterByStatus(leadFilter));
      } else if (defaultOption === "My Leads") {
        const leadFilter = {
          // "pageNo": 10,
          // "pageSize": 0,
          query: {
            status: "CONTACTED_LEADS",
            isHidden: false,
            assigned: userData.id,
          },
        };
        dispatch(leadsFilterByStatus(leadFilter));
      } else if (defaultOption === "Hidden Leads") {
        const leadFilter = {
          // "pageNo": 10,
          // "pageSize": 0,
          query: {
            status: "CONTACTED_LEADS",
            isHidden: true,
            // assigned: this.state.loginUserId
          },
        };
        dispatch(leadsFilterByStatus(leadFilter));
      }
    } else if (e.value === "Opportunity Leads") {
      /*======================================================= 
          if selecte All Leads, My Leads And Hidden Leads
      ========================================================*/
      if (defaultOption === "All Leads") {
        const leadFilter = {
          // "pageNo": 10,
          // "pageSize": 0,
          query: {
            status: "OPPORTUNITIES",
            isHidden: false,
            // "assigned":"a6646520-c01e-11e9-ad3c-cd499e5e599c"
          },
        };
        dispatch(leadsFilterByStatus(leadFilter));
      } else if (defaultOption === "My Leads") {
        const leadFilter = {
          // "pageNo": 10,
          // "pageSize": 0,
          query: {
            status: "OPPORTUNITIES",
            isHidden: false,
            assigned: userData.id,
          },
        };
        dispatch(leadsFilterByStatus(leadFilter));
      } else if (defaultOption === "Hidden Leads") {
        const leadFilter = {
          // "pageNo": 10,
          // "pageSize": 0,
          query: {
            status: "OPPORTUNITIES",
            isHidden: true,
            // assigned: this.state.loginUserId
          },
        };
        dispatch(leadsFilterByStatus(leadFilter));
      }
    } else if (e.value === "Converted leads") {
      /*======================================================= 
          if selecte All Leads, My Leads And Hidden Leads
      ========================================================*/
      if (defaultOption === "All Leads") {
        const leadFilter = {
          // "pageNo": 10,
          // "pageSize": 0,
          query: {
            status: "CONVERTED",
            isHidden: false,
            // "assigned":"a6646520-c01e-11e9-ad3c-cd499e5e599c"
          },
        };
        dispatch(leadsFilterByStatus(leadFilter));
      } else if (defaultOption === "My Leads") {
        const leadFilter = {
          // "pageNo": 10,
          // "pageSize": 0,
          query: {
            status: "CONVERTED",
            isHidden: false,
            assigned: userData.id,
          },
        };
        dispatch(leadsFilterByStatus(leadFilter));
      } else if (defaultOption === "Hidden Leads") {
        const leadFilter = {
          // "pageNo": 10,
          // "pageSize": 0,
          query: {
            status: "CONVERTED",
            isHidden: true,
            // assigned: this.state.loginUserId
          },
        };
        dispatch(leadsFilterByStatus(leadFilter));
      }
    } else {
      const leadFilter = {
        // "pageNo": 10,
        // "pageSize": 0,
        query: {},
      };
      dispatch(leadsFilterByStatus(leadFilter));
    }
  };

  const onSelect = (action, leadData) => {
    var userData = JSON.parse(localStorage.getItem("Data"));
    // console.log(leadData.shippingAddress.state);
    if (action === "addToKanBan") {
      dispatch(
        addToKanBanAction(
          leadData._id,
          {
            isKanban: true,
          },
          leadFilterName,
          userData.id,
          "Added to kanban"
        )
      );
    } else if (action === "removeFromKanBan") {
      dispatch(
        addToKanBanAction(
          leadData._id,
          {
            isKanban: false,
          },
          leadFilterName,
          userData.id,
          "Removed from kanban"
        )
      );
    } else if (action === "editLead") {
      // console.log(leadData);
      let phoneNo = leadData.phone;
      let leadCountryCode = leadData.phoneCode;
      let finalLeadPhoneNumber = phoneNo.split(leadCountryCode)[1];

      let selectedAccount =
        !isEmpty(allAccounts) &&
        allAccounts.filter(
          (account) => account._id === leadData.account_id._id
        );

      let newList = [];
      if (selectedAccount) {
        newList.push({
          label: selectedAccount[0].accountname,
          value: selectedAccount[0]._id,
        });
        setValues({
          ...values,
          displayListSelected: newList,
        });
      }

      setValues({
        ...values,
        activeEmployee: leadData.assigned._id,
        leadAssignRepresentative: leadData.assigned.name,
        leadAssignRepresentativeId: leadData.assigned._id,
        leadMediaLinkedInCheckbox: true,
        leadMediaLinkedInInput: leadData.media.facebook,
        leadMediaFacebookCheckbox: true,
        leadMediaFacebookInput: leadData.media.linkedIn,
        leadMediaInstagramCheckbox: true,
        leadMediaInstagramInput: leadData.media.instagram,
        leadMediaOthersCheckbox: true,
        leadMediaOthersInput: leadData.media.other,
        leadData: leadData,
        leadsName: leadData.name,
        leadsemail: leadData.email,
        leadsPhoneCountryNumber: leadData.phoneCode,
        leadsPhoneNumber: finalLeadPhoneNumber,
        leadsWorkInCompanyName: leadData.company,
        tagsInputValue: leadData.tags,
        tagsArray: leadData.tags,
        leadsAbout: leadData.about,
        leadsWorthAmount: leadData.worth,
        leadsSourceDropdownOption: leadData.source,
        selectedLeadsSourceDropdownOption: isEmpty(leadData.source)
          ? null
          : {
              values: leadData.source,
              label: leadData.source,
            },
        selectOption: {
          label: selectedAccount[0].accountname,
          value: selectedAccount[0]._id,
        },
        displayListSelected: newList,
        leadEditPopup: true,
      });
    } else if (action === "addFollowUp") {
      setValues({
        ...values,
        addFollowUpPopUp: true,
        leadData: leadData,
      });
    } else if (action === "deleteLead") {
      setValues({
        ...values,
        deleteWarningPopup: true,
        deleteId: leadData._id,
      });
    } else if (action === "unHideLead") {
      dispatch(
        unhideLeadAction(
          leadData._id,
          {
            isHidden: false,
          },
          leadFilterName,
          userData.id
        )
      );
    } else if (action === "restoreLead") {
      dispatch(
        updateLeadAction(
          leadData._id,
          {
            status: "NEW_LEAD",
          },
          userData.id,
          leadFilterName
        )
      );
    } else if (action === "hideLead") {
      dispatch(
        hideLeadAction(
          leadData._id,
          {
            isHidden: true,
          },
          leadFilterName,
          userData.id
        )
      );
    }

    // console.log(action);
    // console.log(leadData);
  };

  const onVisibleChange = (visible) => {
    // console.log(visible);
  };

  const renderLeadsEdit = (leadData) => {
    // const { admin } = this.state;
    // const { userRole } = this.props;
    var userData = JSON.parse(localStorage.getItem("Data"));
    const menu = (
      <Menu>
        {leadData.assigned._id === userData.id &&
        leadData.isKanban === false &&
        leadData.isHidden === false ? (
          <MenuItem onClick={() => this.onSelect("addToKanBan", leadData)}>
            Add to kan-ban
          </MenuItem>
        ) : leadData.isKanban === true && leadData.isHidden === false ? (
          <MenuItem>Already in kan-ban</MenuItem>
        ) : (
          ""
        )}

        <Divider />
        <MenuItem onClick={() => this.onSelect("editLead", leadData)}>
          Edit Lead
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => this.onSelect("addFollowUp", leadData)}>
          Add Follow Up
        </MenuItem>
        <Divider />
        {userRole === "Administrator" && leadData.status !== "ARCHIVE" ? (
          <MenuItem onClick={() => this.onSelect("deleteLead", leadData)}>
            Delete Lead
          </MenuItem>
        ) : userRole === "Administrator" && leadData.status === "ARCHIVE" ? (
          <MenuItem onClick={() => this.onSelect("restoreLead", leadData)}>
            Restore Lead
          </MenuItem>
        ) : (
          ""
        )}
        <Divider />
        {leadData.isHidden === false ? (
          <MenuItem onClick={() => this.onSelect("hideLead", leadData)}>
            Hide Lead
          </MenuItem>
        ) : (
          <MenuItem onClick={() => this.onSelect("unHideLead", leadData)}>
            Unhide Lead
          </MenuItem>
        )}
      </Menu>
    );

    return (
      <DropdownIcon
        trigger={["click"]}
        overlay={menu}
        animation="none"
        onVisibleChange={onVisibleChange}
      >
        <img
          className="edit-img"
          src={require("./../../../assets/img/leads/edit-icon.png")}
          alt=""
        />
      </DropdownIcon>
    );
  };

  /*====================================
  Add follow up form handler
======================================*/

  // const handleChange = (e) => {
  //   this.setState({
  //     [e.target.name]: e.target.value,
  //   });
  // };

  const handleChangeTime = (time) => {
    if (time === null) {
      setValues({
        ...values,
        startTime: new Date(),
      });
    } else {
      setValues({
        ...values,
        startTime: time,
      });
    }
  };

  const handleChangeDate = (date) => {
    if (date === null) {
      setValues({
        ...values,
        startDate: new Date(),
      });
    } else {
      setValues({
        ...values,
        startDate: date,
      });
    }
  };

  const handleDateChangeRaw = (e) => {
    e.preventDefault();
  };

  const callbackAddFollowup = (status) => {
    var userData = JSON.parse(localStorage.getItem("Data"));
    // const { leadFilterName } = this.props;
    if (status === 200) {
      setValues({
        ...values,
        addFollowUpPopUp: false,
      });

      if (leadFilterName === "My Leads") {
        const myLeadOverviewQuery = {
          assigned: userData.id,
          status: { $ne: "ARCHIVE" },
        };

        setTimeout(() => {
          dispatch(getOverviewFilterForCount(myLeadOverviewQuery));
        }, 10);
      } else if (leadFilterName === "All Leads") {
        const allLeadOverviewQuery = {
          status: { $ne: "ARCHIVE" },
        };

        setTimeout(() => {
          dispatch(getOverviewFilterForCount(allLeadOverviewQuery));
        }, 10);
      } else if (leadFilterName === "Hidden Leads") {
        const hiddenLeadOverviewQuery = {
          isHidden: true,
        };

        setTimeout(() => {
          dispatch(getOverviewFilterForCount(hiddenLeadOverviewQuery));
        }, 10);
      } else if (leadFilterName === "Archive Leads") {
        const archiveLeadsOverviewQuery = {
          status: "ARCHIVE",
        };

        setTimeout(() => {
          dispatch(getOverviewFilterForCount(archiveLeadsOverviewQuery));
        }, 10);
      } else {
        console.log("nothing");
      }
    }
  };

  const handleSaveFollowUp = (e) => {
    e.preventDefault();
    const { leadData, leadFollowUpNew } = values;
    // console.log(leadData);
    // console.log(this.state.meetingAt);
    const { errors, isValid } = validateEditMeetingFollowup(values);
    if (!isValid && values.selectedOption === "Meeting") {
      setValues({ ...values, errors });
    } else {
      if (leadFollowUpNew === "Meeting") {
        const newMeeting = {
          subject: leadFollowUpNew,
          meetingDate: values.startDate,
          meetingTime: values.startTime,
          location: values.followUpLocation,
          assigned: leadData._id,
          assignedPipelead: leadData._id,
        };
        dispatch(addLeadMeetingsAction(newMeeting, callbackAddFollowup));
      } else {
        const newFollowUp = {
          name: leadFollowUpNew,
          type:
            leadFollowUpNew === "SMS"
              ? "SMS"
              : leadFollowUpNew === "Email"
              ? "EMAIL"
              : leadFollowUpNew === "Whatsapp"
              ? "WHATSAPP"
              : "CALL",
          entityType: "LEAD",
          entityId: leadData._id,
          followupAtDate: values.startDate,
          followupAtTime: values.startTime,
          assigned: leadData._id,
          assignedPipelead: leadData._id,
          notification: true,
          status: "NEW",
        };

        dispatch(addFollowUpLead(newFollowUp, callbackAddFollowup));
      }
    }
  };

  const onCloseModal = () => {
    setValues({
      ...values,
      convertedLeadPopup: false,
      addToLogModel: false,
      addFollowUpPopUp: false,
      leadEditPopup: false,
      prevNextIndex: 0,
      errors: [],
    });
  };

  const onSelectDropdownSelect = (e) => {
    setValues({
      ...values,
      selectedOption: e.value,
      selectedOptionDropdown: e,
    });
    console.log("Selected: " + e.value);
  };

  // onDropdownKeyPress = e => {
  //   if (this.state.dropdown) {
  //     if (e.keyCode === 13) {
  //       this.dropDownToggler();
  //     }
  //   }
  // };

  // onDropdownClick = e => {
  //   if (this.state.dropdown) {
  //     if (!document.getElementById("selectedOption").contains(e.target)) {
  //       this.dropDownToggler();
  //     }
  //   }
  // };

  // onDropdownChange = e => {
  //   this.setState({
  //     [e.target.name]: e.target.value
  //   });
  // };

  // dropDownToggler = e => {
  //   this.setState({
  //     dropdown: !this.state.dropdown
  //   });
  // };

  // dropDownSelect = value => e => {
  //   this.setState({
  //     selectedOption: value,
  //     dropdown: !this.state.dropdown
  //   });
  // };

  /*====================================
    level filter
  ======================================*/
  const onLevelClick = (e) => {
    setValues({
      ...values,
      defaultLevelOption: e.value,
    });

    if (e.value === "🌋") {
      const leadFilter = {
        // "pageNo": 10,
        // "pageSize": 0,
        query: {
          degree: "SUPER_HOT",
          isHidden: false,
          // "assigned":"a6646520-c01e-11e9-ad3c-cd499e5e599c"
        },
      };
      dispatch(leadsFilterByStatus(leadFilter));
    } else if (e.value === "☀️") {
      const leadFilter = {
        // "pageNo": 10,
        // "pageSize": 0,
        query: {
          degree: "HOT",
          isHidden: false,
          // "assigned":"a6646520-c01e-11e9-ad3c-cd499e5e599c"
        },
      };
      dispatch(leadsFilterByStatus(leadFilter));
    } else if (e.value === "☕") {
      const leadFilter = {
        // "pageNo": 10,
        // "pageSize": 0,
        query: {
          degree: "WARM",
          isHidden: false,
          // "assigned":"a6646520-c01e-11e9-ad3c-cd499e5e599c"
        },
      };
      dispatch(leadsFilterByStatus(leadFilter));
    } else if (e.value === "❄️️") {
      const leadFilter = {
        // "pageNo": 10,
        // "pageSize": 0,
        query: {
          degree: "COLD",
          isHidden: false,
          // "assigned":"a6646520-c01e-11e9-ad3c-cd499e5e599c"
        },
      };
      dispatch(leadsFilterByStatus(leadFilter));
    } else if (e.value === "All") {
      const leadFilter = {
        // "pageNo": 10,
        // "pageSize": 0,
        query: {
          isHidden: false,
        },
      };
      dispatch(leadsFilterByStatus(leadFilter));
    }
  };

  const renderLevelDropdown = () => {
    return (
      <Dropdown
        className="lead-status-dropDown lead-status-dropDown--emoji ml-0 lead-status-dropDown--leads-new-status"
        options={optionsLevel}
        onChange={onLevelClick}
        value={values.defaultLevelOption}
        // placeholder="Level"
      />
    );
  };

  /*====================================
    level filter end
  ======================================*/

  /*====================================
    assigned to filter
  ======================================*/
  const onAssignedToClick = (e) => {
    setValues({
      ...values,
      defaultAssignedToOption: e.label,
    });

    if (e.value === "Assigned To All") {
      const leadFilter = {
        query: {},
      };
      dispatch(leadsFilterByStatus(leadFilter));
    } else {
      const leadFilter = {
        // "pageNo": 10,
        // "pageSize": 0,
        query: {
          assigned: e.value,
          isHidden: false,
          // "assigned":"a6646520-c01e-11e9-ad3c-cd499e5e599c"
        },
      };
      dispatch(leadsFilterByStatus(leadFilter));
    }
  };

  const renderAssignedToDropdown = () => {
    return (
      <Dropdown
        className="lead-status-dropDown lead-status-dropDown--assignTo lead-status-dropDown--leads-new-status"
        options={values.optionsAssignedTo}
        onChange={onAssignedToClick}
        value={values.defaultAssignedToOption}
        // placeholder="Assigned To"
      />
    );
  };

  /*====================================
    assigned to filter
  ======================================*/

  const renderStatusDropdown = () => {
    return (
      <Dropdown
        className="lead-status-dropDown lead-status-dropDown--leads-new-status"
        options={options}
        onChange={onStatusClick}
        value={values.defaultOption}
        // placeholder="Status"
      />
    );
  };

  /*====================================
          Edit Lead Popup
  =====================================*/
  const renderEditLeadPopUp = () => {
    const { leadEditPopup, allEmployees, leadData } = values;

    return (
      <div className="display-inline-block">
        <Modal
          open={leadEditPopup}
          onClose={onCloseModal}
          closeOnEsc={true}
          closeOnOverlayClick={false}
          center
          classNames={{
            overlay: "customOverlay",
            modal: "customModal customModal--addLead customModal--editLeadNew",
            closeButton: "customCloseButton",
          }}
        >
          <span className="closeIconInModal" onClick={onCloseModal} />
          {/* {this.renderEditleadFields()} */}
          {renderEditleadFieldsNew()}
        </Modal>
      </div>
    );
  };

  /*===============================
     Render edit lead Form Old
  ================================*/

  const renderEditleadFields = () => {
    let errors = values.errors;

    // phone input field
    const phoneInputField = (
      <div className="mb-30">
        <label
          htmlFor="leadsPhoneCountryNumber"
          className="add-lead-label font-24-semibold"
        >
          {values.leadsName}'s phone number?
        </label>
        <br />
        <div className="d-flex">
          <div className="add-lead-input-field--countryCode">
            <div className="countryCode-fixed-plus-input-container">
              <span className="font-18-regular countryCode-fixed-plus">+</span>
              <input
                type="text"
                id="leadsPhoneCountryNumber"
                name="leadsPhoneCountryNumber"
                className="add-lead-input-field font-18-regular text-center ml-0"
                placeholder="----"
                value={values.leadsPhoneCountryNumber}
                onChange={handleChange}
                maxLength="4"
                autoFocus={true}
              />
            </div>
            {errors.leadsPhoneCountryNumber && (
              <div className="is-invalid">{errors.leadsPhoneCountryNumber}</div>
            )}
          </div>

          <div className="add-lead-input-field--phoneNumber">
            <div>
              <input
                type="text"
                pattern="[0-9]*"
                id="leadsPhoneNumber"
                name="leadsPhoneNumber"
                className="add-lead-input-field font-18-regular ml-0 w-100"
                placeholder=""
                value={values.leadsPhoneNumber}
                onChange={handleChangeNumber}
                maxLength="10"
              />
            </div>
            {errors.leadsPhoneNumber && (
              <div className="is-invalid">{errors.leadsPhoneNumber}</div>
            )}
          </div>
        </div>
      </div>
    );

    // worth amount
    const worthAmountInputField = (
      <div className="mb-30">
        <label
          htmlFor="leadsWorthAmount"
          className="add-lead-label font-24-semibold"
        >
          Worth amount
        </label>
        <br />
        <div>
          <input
            type="text"
            pattern="[0-9]*"
            id="leadsWorthAmount"
            name="leadsWorthAmount"
            className="add-lead-input-field font-18-regular"
            placeholder=""
            value={values.leadsWorthAmount}
            onChange={handleChangeNumber}
            autoFocus
            maxLength={10}
          />
          {errors.leadsWorthAmount && (
            <div className="is-invalid add-lead-form-field-errors">
              {errors.leadsWorthAmount}
            </div>
          )}
        </div>
      </div>
    );

    const sourceDropdown = (
      <div className="mb-30">
        <label
          htmlFor="leadsSource"
          className="add-lead-label font-24-semibold"
        >
          Leads source
        </label>
        <div className="add-lead-input-field border-0">
          <Select
            className="react-select-add-lead-form-container"
            classNamePrefix="react-select-add-lead-form"
            isSearchable={false}
            options={leadsSourceOptions}
            value={values.selectedLeadsSourceDropdownOption}
            onChange={(e) => onSourceDropdownSelect(e)}
            placeholder="Select"
          />
        </div>
      </div>
    );

    // about field
    const aboutInputField = (
      <div className="mb-30">
        <label htmlFor="leadsAbout" className="add-lead-label font-24-semibold">
          About {values.leadsName}
        </label>
        <br />
        <textarea
          rows="6"
          id="leadsAbout"
          name="leadsAbout"
          className="add-lead-input-field font-18-regular"
          placeholder=""
          value={values.leadsAbout}
          onChange={handleChange}
          autoFocus={true}
        />
        {errors && (
          <p className="is-invalid add-lead-form-field-errors pl-0">
            {errors.leadsAbout}
          </p>
        )}
      </div>
    );

    const { prevNextIndex, allEmployees } = values;
    return (
      <Fragment>
        <div className="add-lead-modal-container container-fluid pr-0">
          <h1 className="font-30-bold mb-61">Edit Lead</h1>

          <div className="add-lead-form-field-block">
            {/* prev next arrows */}
            <div className="add-lead-arrows">
              {prevNextIndex <= 0 ? (
                ""
              ) : (
                <>
                  {/*<img
                  src={require("../../../assets/img/icons/Dominate-Icon_prev-arrow.svg")}
                  alt="previous"
                  className="add-lead-prev-icon"
                  onClick={this.handlePrev}
                />*/}
                  <div className="add-lead-prev-icon" onClick={handlePrev}>
                    <img
                      src={require("../../../assets/img/icons/dominate-white-prev-arrow.png")}
                      alt="previous"
                    />
                  </div>
                </>
              )}

              {prevNextIndex >= totalFormSlides ? (
                ""
              ) : (
                <>
                  {/*<img
                  src={require("../../../assets/img/icons/Dominate-Icon_next-arrow.svg")}
                  alt="next"
                  className="add-lead-next-icon"
                  onClick={this.handleNext}
                />*/}
                  <div className="add-lead-next-icon" onClick={handleNext}>
                    <img
                      src={require("../../../assets/img/icons/dominate-white-next-arrow-icon.png")}
                      alt="next"
                    />
                  </div>
                </>
              )}
            </div>

            {/* form */}
            <form
              noValidate
              // onSubmit={this.handleSubmit}
              // onKeyDown={this.onFormKeyDown}
            >
              {/* name */}
              {prevNextIndex === 0 ? (
                <AddLeadsFormField
                  htmlFor={"leadsWorkInCompanyName"}
                  type={"text"}
                  labelName={"What is your new lead's name?"}
                  id={"leadsName"}
                  name={"leadsName"}
                  placeholder={"Eg. India"}
                  onChange={handleChange}
                  value={values.leadsName}
                  maxLength={maxLengths.char30}
                  error={errors.leadsName}
                />
              ) : (
                ""
              )}

              {/* email */}
              {prevNextIndex === 1 ? (
                <AddLeadsFormField
                  htmlFor={"leadsWorkInCompanyName"}
                  type={"text"}
                  labelName={`${values.leadsName}'s email address`}
                  id={"leadsemail"}
                  name={"leadsemail"}
                  placeholder={"john@gmail.com"}
                  onChange={handleChange}
                  value={values.leadsemail}
                  error={errors.leadsemail}
                />
              ) : (
                ""
              )}

              {/* phone number */}
              {prevNextIndex === 2
                ? //   <AddLeadsPhoneInputField handleChange={handleChange} />
                  phoneInputField
                : ""}

              {/* representative */}
              {prevNextIndex === 3 ? (
                <AddLeadFormAssignRepresentative
                  id="leadAssignRepresentative"
                  name="leadAssignRepresentative"
                  fieldHeading={`Assign ${values.leadsName} a representative`}
                  onChange={handleChange}
                  onClick={handleRepresentativeOnClick}
                  value={values.leadAssignRepresentative}
                  error={errors.leadAssignRepresentative}
                  allEmployees={!isEmpty(allEmployees) ? allEmployees : []}
                  activeEmployee={values.activeEmployee}
                />
              ) : (
                ""
              )}

              {/* worth amount */}
              {prevNextIndex === 4 && worthAmountInputField}

              {/* source dropdown */}
              {prevNextIndex === 5 && sourceDropdown}

              {/* address */}
              {prevNextIndex === 6 ? (
                <div>
                  <AddLeadsFormField
                    htmlFor={"leadsAddress"}
                    type={"text"}
                    labelName={`Where does ${values.leadsName} live?`}
                    id={"leadsAddress"}
                    name={"leadsAddress"}
                    placeholder={"Eg. India"}
                    onChange={handleChange}
                    value={values.leadsAddress}
                  />
                  {/* skip */}
                  <div className="text-right">
                    <button
                      className="btn-funnel-view btn-funnel-view--add-lead-save-btn"
                      onClick={handleNext}
                    >
                      Skip
                    </button>
                  </div>
                </div>
              ) : (
                ""
              )}

              {/* company name */}
              {prevNextIndex === 7 ? (
                <div>
                  <AddLeadsFormField
                    htmlFor={"leadsWorkInCompanyName"}
                    type={"text"}
                    labelName={`Which company does ${values.leadsName} work for?`}
                    id={"leadsWorkInCompanyName"}
                    name={"leadsWorkInCompanyName"}
                    placeholder={"Eg. Marvel Studios"}
                    onChange={handleChange}
                    value={values.leadsWorkInCompanyName}
                  />
                  {/* skip */}
                  <div className="text-right">
                    <button
                      className="btn-funnel-view btn-funnel-view--add-lead-save-btn"
                      onClick={handleNext}
                    >
                      Skip
                    </button>
                  </div>
                </div>
              ) : (
                ""
              )}

              {/* select tags */}
              {prevNextIndex === 8 ? (
                <div>
                  {/* <AddLeadFormSelectFewTags
                      onChange={handleChange}
                      onClick={handleSelectFewTagsStringOnClick}
                      value={values.leadSelectFewTags}
                      autoFocus={true}
                    /> */}

                  {/* select tags by onclick */}
                  {values.tagsArray.length === 0 ? (
                    ""
                  ) : (
                    <span className="add-lead-label font-24-semibold pt-20">
                      Added tags
                    </span>
                  )}
                  <div className="leads-tags-in-input-field leads-tags-in-input-field--addLeadFormSelectTags">
                    <div className="representative-recent-img-text-block leads-tags-in-input-field__block pt-0 mb-30">
                      {values.tagsArray.map((tag, index) => (
                        <h6
                          key={index}
                          className="font-18-regular tag-border-block leads-tags-in-input-field__tags"
                        >
                          {tag}
                          <span
                            className="font-18-regular"
                            onClick={() => handleRemoveTag(tag)}
                          >
                            &nbsp; &times;
                          </span>
                        </h6>
                      ))}
                    </div>

                    {/* select tags by input type text field */}
                    <AddLeadFormSelectFewTags
                      id="tagsInputValue"
                      name="tagsInputValue"
                      onChange={handleSelectTagsOnChange}
                      onClick={handleSelectFewTagsOnClick}
                      onKeyDown={handleSelectTagsOnKeyPress}
                      value={values.tagsInputValue}
                      maxLength={maxLengths.char20}
                    />
                  </div>

                  {/* skip */}
                  <div className="text-right">
                    <button
                      className="btn-funnel-view btn-funnel-view--add-lead-save-btn"
                      onClick={handleNext}
                    >
                      Skip
                    </button>
                  </div>
                </div>
              ) : (
                ""
              )}

              {/* media accounts */}
              {prevNextIndex === 9 ? (
                <div>
                  <div className="mb-30">
                    <div className="mb-10">
                      <label
                        htmlFor="leadMediaEmailCheckbox"
                        className="add-lead-label font-24-semibold"
                      >
                        Add other media accounts
                      </label>
                      <br />
                    </div>
                    <div className="all-checkbox-block">
                      {/* email */}
                      {/* <AddLeadFormMediaAccount
                        checkboxId="leadMediaEmailCheckbox"
                        checkboxLabelName="Email"
                        handleCheckboxChange={handleCheckboxChange}
                        inputId="leadMediaEmailInput"
                        inputPlaceholder="mikeross@gmail.com"
                        inputOnChange={handleChange}
                        inputValue={values.leadMediaEmailInput}
                        checkboxState={values.leadMediaEmailCheckbox}
                      /> */}

                      {/* linked In */}
                      <AddLeadFormMediaAccount
                        checkboxId="leadMediaLinkedInCheckbox"
                        checkboxLabelName="LinkedIn"
                        handleCheckboxChange={handleCheckboxChange}
                        inputId="leadMediaLinkedInInput"
                        inputPlaceholder="mikeross@gmail.com"
                        inputOnChange={handleChange}
                        inputValue={values.leadMediaLinkedInInput}
                        checkboxState={values.leadMediaLinkedInCheckbox}
                        error={errors.leadMediaLinkedInInput}
                      />

                      {/* facebook */}
                      <AddLeadFormMediaAccount
                        checkboxId="leadMediaFacebookCheckbox"
                        checkboxLabelName="Facebook"
                        handleCheckboxChange={handleCheckboxChange}
                        inputId="leadMediaFacebookInput"
                        inputPlaceholder="mikeross@gmail.com"
                        inputOnChange={handleChange}
                        inputValue={values.leadMediaFacebookInput}
                        checkboxState={values.leadMediaFacebookCheckbox}
                        error={errors.leadMediaFacebookInput}
                      />

                      {/* instagram */}
                      <AddLeadFormMediaAccount
                        checkboxId="leadMediaInstagramCheckbox"
                        checkboxLabelName="Instagram"
                        handleCheckboxChange={handleCheckboxChange}
                        inputId="leadMediaInstagramInput"
                        inputPlaceholder="mikeross@gmail.com"
                        inputOnChange={handleChange}
                        inputValue={values.leadMediaInstagramInput}
                        checkboxState={values.leadMediaInstagramCheckbox}
                        error={errors.leadMediaInstagramInput}
                      />

                      {/* other */}
                      <AddLeadFormMediaAccount
                        checkboxId="leadMediaOthersCheckbox"
                        checkboxLabelName="Others"
                        handleCheckboxChange={handleCheckboxChange}
                        inputId="leadMediaOthersInput"
                        inputPlaceholder="mikeross@gmail.com"
                        inputOnChange={handleChange}
                        inputValue={values.leadMediaOthersInput}
                        checkboxState={values.leadMediaOthersCheckbox}
                        error={errors.leadMediaOthersInput}
                      />
                    </div>
                  </div>

                  {/* skip */}
                  {values.leadMediaLinkedInCheckbox === false &&
                    values.leadMediaFacebookCheckbox === false &&
                    values.leadMediaInstagramCheckbox === false &&
                    values.leadMediaOthersCheckbox === false && (
                      <div className="text-right">
                        <button
                          className="btn-funnel-view btn-funnel-view--add-lead-save-btn"
                          onClick={handleNext}
                        >
                          Skip
                        </button>
                      </div>
                    )}
                </div>
              ) : (
                ""
              )}

              {/* about */}
              {prevNextIndex === 10 ? (
                <div>
                  {aboutInputField}
                  {/* <div className="mt-20 mb-10 text-right">
                      <button className="btn-funnel-view btn-funnel-view--add-lead-save-btn"
                        onClick={handleSaveAboutLead}>
                        Save
                      </button>
                    </div> */}

                  {/* skip */}
                  <div className="text-right">
                    <button
                      className="btn-funnel-view btn-funnel-view--add-lead-save-btn"
                      onClick={handleNext}
                    >
                      Skip
                    </button>
                  </div>
                </div>
              ) : (
                ""
              )}

              {/* shipping address */}
              {prevNextIndex === 11 ? (
                <div>
                  <AddLeadFormShippingDetails
                    // checkboxId="leadsShippingCheckbox"
                    billingValue={values.leadsShippingBilling}
                    state={values.leadsShippingState}
                    city={values.leadsShippingCity}
                    pincode={values.leadsShippingPinCode}
                    website={values.leadsShippingWebsite}
                    checkboxState={values.leadsShippingCheckbox}
                    handleChange={handleChange}
                    // handleCheckboxChange={this.handleCheckboxChange}
                    error={errors}
                  />

                  {/* buttons */}
                  <div className="pt-25 text-right">
                    {/* <button
                        className="btn-funnel-view btn-funnel-view--add-lead-save-btn mr-30"
                        onClick={this.handleSaveAboutLead}
                      >
                        Skip
                      </button> */}
                    <button
                      type="submit"
                      className="btn-funnel-view btn-funnel-view--add-lead-save-btn"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                ""
              )}
            </form>

            <AddLeadBlueProgressbar
              percentage={(100 / totalFormSlides) * (prevNextIndex + 0.5)}
              skipButtonFrom={6}
              prevNextIndex={prevNextIndex}
            />
          </div>
        </div>
      </Fragment>
    );
  };

  /*===============================
     Render edit lead Form New
  ================================*/

  const renderEditleadFieldsNew = () => {
    let errors = values.errors;

    // phone input field
    const phoneInputField = (
      <div className="mb-30">
        <label
          htmlFor="leadsPhoneCountryNumber"
          className="add-lead-label font-24-semibold"
        >
          Phone Number
        </label>
        <br />
        <div className="d-flex align-items-baseline">
          <div className="add-lead-input-field--countryCode">
            <div className="countryCode-fixed-plus-input-container">
              {/* <span className="font-18-regular countryCode-fixed-plus">+</span>
              <input
                type="text"
                id="leadsPhoneCountryNumber"
                name="leadsPhoneCountryNumber"
                className="add-lead-input-field font-18-regular text-center ml-0"
                placeholder="----"
                value={this.state.leadsPhoneCountryNumber}
                onChange={this.handleChange}
                maxLength="4"
                autoFocus={true}
              /> */}
              <PhoneInput
                country={"us"}
                value={values.leadsPhoneCountryNumber}
                onChange={(leadsPhoneCountryNumber) =>
                  setValues({ ...values, leadsPhoneCountryNumber })
                }
                enableSearch={true}
              />
            </div>
            {errors.leadsPhoneCountryNumber && (
              <div className="is-invalid">{errors.leadsPhoneCountryNumber}</div>
            )}
          </div>

          <div className="add-lead-input-field--phoneNumber">
            <div>
              <input
                type="text"
                pattern="[0-9]*"
                id="leadsPhoneNumber"
                name="leadsPhoneNumber"
                className="add-lead-input-field font-18-regular ml-0 w-100"
                placeholder=""
                value={values.leadsPhoneNumber}
                onChange={handleChangeNumber}
                maxLength="10"
              />
            </div>
            {errors.leadsPhoneNumber && (
              <div className="is-invalid">{errors.leadsPhoneNumber}</div>
            )}
          </div>
        </div>
      </div>
    );

    // worth amount
    const worthAmountInputField = (
      <div className="mb-30">
        <label
          htmlFor="leadsWorthAmount"
          className="add-lead-label font-24-semibold"
        >
          Worth amount
        </label>
        <br />
        <div>
          <input
            type="text"
            pattern="[0-9]*"
            id="leadsWorthAmount"
            name="leadsWorthAmount"
            className="add-lead-input-field font-18-regular"
            placeholder=""
            value={values.leadsWorthAmount}
            onChange={handleChangeNumber}
            autoFocus
            maxLength={10}
          />
          {errors.leadsWorthAmount && (
            <div className="is-invalid add-lead-form-field-errors">
              {errors.leadsWorthAmount}
            </div>
          )}
        </div>
      </div>
    );

    const sourceDropdown = (
      <div className="mb-30">
        <label
          htmlFor="leadsSource"
          className="add-lead-label font-24-semibold"
        >
          Leads source
        </label>
        <div className="add-lead-input-field border-0">
          <Select
            className="react-select-add-lead-form-container"
            classNamePrefix="react-select-add-lead-form"
            isSearchable={false}
            options={leadsSourceOptions}
            value={values.selectedLeadsSourceDropdownOption}
            onChange={(e) => onSourceDropdownSelect(e)}
            placeholder="Select"
          />
        </div>
      </div>
    );

    // about field
    const aboutInputField = (
      <div className="mb-30">
        <label htmlFor="leadsAbout" className="add-lead-label font-24-semibold">
          About
        </label>
        <br />
        <textarea
          rows="6"
          id="leadsAbout"
          name="leadsAbout"
          className="add-lead-input-field font-18-regular"
          placeholder=""
          value={values.leadsAbout}
          onChange={handleChange}
          autoFocus={true}
          maxLength={maxLengths.char200}
        />
        {errors && (
          <p className="is-invalid add-lead-form-field-errors pl-0">
            {errors.leadsAbout}
          </p>
        )}
      </div>
    );

    const { allEmployees } = values;
    return (
      <Fragment>
        <div className="add-lead-modal-container container-fluid pr-0">
          <h1 className="font-30-bold mb-61">
            {/* {values.leadsName} */}
            Edit Lead
          </h1>

          <div className="add-lead-form-field-block">
            {/* form */}
            <form
              noValidate
              onSubmit={handleSubmit}
              onKeyDown={onFormKeyDownEditLeadNew}
            >
              <div className="new-edit-lead-form-overflow-block">
                <div className="row mx-0 edit-lead-new-design__row">
                  <div className="edit-lead-new-design__colm1">
                    {/* name */}
                    <AddLeadsFormField
                      checkboxClass=""
                      htmlFor={"leadsWorkInCompanyName"}
                      type={"text"}
                      labelName={"Name"}
                      id={"leadsName"}
                      name={"leadsName"}
                      placeholder={"Eg. Ian McKEllen"}
                      onChange={handleChange}
                      value={values.leadsName}
                      maxLength={maxLengths.char30}
                      error={errors.leadsName}
                    />
                    {/* phone number */}
                    {phoneInputField}
                    {/* representative */}
                    <AddLeadFormAssignRepresentative
                      editLeadClassName=""
                      id="leadAssignRepresentative"
                      name="leadAssignRepresentative"
                      fieldHeading={`Lead Representative`}
                      onChange={handleChange}
                      onClick={handleRepresentativeOnClick}
                      value={values.leadAssignRepresentative}
                      error={errors.leadAssignRepresentative}
                      allEmployees={!isEmpty(allEmployees) && allEmployees}
                      activeEmployee={values.activeEmployee}
                    />
                    {/* address */}
                    {/* <div>
                      <AddLeadsFormField
                        checkboxClass=""
                        htmlFor={"leadsAddress"}
                        type={"text"}
                        labelName={`Location`}
                        id={"leadsAddress"}
                        name={"leadsAddress"}
                        placeholder={"Eg. India"}
                        onChange={handleChange}
                        value={values.leadsAddress}
                       />
                    </div> */}

                    {/* select tags */}
                    <div>
                      {/* select tags by onclick */}
                      <div className="">
                        <label
                          htmlFor="tagsInputValue"
                          className="add-lead-label font-24-semibold pt-20"
                        >
                          Tags
                        </label>
                        <div className="leads-tags-in-input-field leads-tags-in-input-field--addLeadFormSelectTags">
                          {values.tagsArray.length != 0 && (
                            <div className="representative-recent-img-text-block leads-tags-in-input-field__block pt-0 mb-30">
                              {values.tagsArray.map((tag, index) => (
                                <h6
                                  key={index}
                                  className="font-18-regular tag-border-block leads-tags-in-input-field__tags"
                                >
                                  {tag}
                                  <span
                                    className="font-18-regular"
                                    onClick={() => handleRemoveTag(tag)}
                                  >
                                    &nbsp; &times;
                                  </span>
                                </h6>
                              ))}
                            </div>
                          )}

                          {/* select tags by input type text field */}
                          <AddLeadFormSelectFewTags
                            id="tagsInputValue"
                            name="tagsInputValue"
                            onChange={handleSelectTagsOnChange}
                            onClick={handleSelectFewTagsOnClick}
                            onKeyDown={handleSelectTagsOnKeyPress}
                            value={values.tagsInputValue}
                            maxLength={maxLengths.char20}
                          />
                        </div>
                      </div>
                    </div>
                    {/* about */}
                    <div>{aboutInputField}</div>
                  </div>
                  <div className="edit-lead-new-design__colm2">
                    {/* email */}
                    <AddLeadsFormField
                      checkboxClass=""
                      htmlFor={"leadsemail"}
                      type={"text"}
                      labelName={`Email Address`}
                      id={"leadsemail"}
                      name={"leadsemail"}
                      placeholder={"john@gmail.com"}
                      onChange={handleChange}
                      value={values.leadsemail}
                      error={errors.leadsemail}
                    />

                    {/* worth amount */}
                    {worthAmountInputField}

                    {/* source dropdown */}
                    {sourceDropdown}

                    <div className="edit-leads-select-accounts">
                      <AddMemberSelectAndDisplayList
                        selectedOptionValue={values.selectOption}
                        handleChangeSelectClient={handleChangeSelectClient}
                        options={values.options}
                        displayListSelected={values.displayListSelected}
                        handleRemoveMember={handleRemoveMember}
                        error={errors.displayListSelected}
                      />
                    </div>

                    {/* media accounts */}
                    <div className="row mx-0">
                      <div className="mb-30">
                        <label
                          htmlFor="leadMediaEmailCheckbox"
                          className="add-lead-label font-24-semibold mt-20"
                        >
                          Media Accounts
                        </label>
                        <div className="all-checkbox-block">
                          <div className="">
                            {/* linkedIn */}
                            <EditLeadSocialMediaAccount
                              img={require("../../../assets/img/icons/Dominate-Icon_linkedin.svg")}
                              name="leadMediaLinkedInInput"
                              placeholder="https://www.linkedIn.com/"
                              onChange={handleChange}
                              value={values.leadMediaLinkedInInput}
                              error={errors.leadMediaLinkedInInput}
                              maxLength={maxLengths.char200}
                            />

                            {/* facebook */}
                            <EditLeadSocialMediaAccount
                              img={require("../../../assets/img/icons/Dominate-Icon_facebook.png")}
                              name="leadMediaFacebookInput"
                              placeholder="https://www.facebook.com/"
                              onChange={handleChange}
                              value={values.leadMediaFacebookInput}
                              error={errors.leadMediaFacebookInput}
                              maxLength={maxLengths.char200}
                            />
                          </div>
                          <div className="">
                            {/* instagram */}
                            <EditLeadSocialMediaAccount
                              img={require("../../../assets/img/icons/Dominate-Icon_instagram.png")}
                              name="leadMediaInstagramInput"
                              placeholder="https://www.instagram.com/"
                              onChange={handleChange}
                              value={values.leadMediaInstagramInput}
                              error={errors.leadMediaInstagramInput}
                              maxLength={maxLengths.char200}
                            />

                            {/* other */}
                            <EditLeadSocialMediaAccount
                              img={require("../../../assets/img/icons/Dominate-Icon_others.svg")}
                              name="leadMediaOthersInput"
                              placeholder="any other url"
                              onChange={handleChange}
                              value={values.leadMediaOthersInput}
                              error={errors.leadMediaOthersInput}
                              maxLength={maxLengths.char200}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* skype address */}
                    <div className="row mx-0">
                      <div className="mb-30">
                        <label
                          htmlFor="leadMediaEmailCheckbox"
                          className="add-lead-label font-24-semibold mt-20"
                        >
                          Skype address
                        </label>
                        <div className="all-checkbox-block">
                          <div className="">
                            <EditLeadSocialMediaAccount
                              img={require("../../../assets/img/icons/icon-skype.svg")}
                              name="leadsSkypeAddress"
                              placeholder=""
                              onChange={handleChange}
                              value={values.leadsSkypeAddress}
                              error={errors.leadsSkypeAddress}
                              maxLength={maxLengths.char200}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* company name */}
                    {/* <div>
                      <AddLeadsFormField
                        checkboxClass=""
                        htmlFor={"leadsWorkInCompanyName"}
                        type={"text"}
                        labelName={`Account`}
                        id={"leadsWorkInCompanyName"}
                        name={"leadsWorkInCompanyName"}
                        placeholder={"Eg. Marvel Studios"}
                        onChange={this.handleChange}
                        value={this.state.leadsWorkInCompanyName}
                      />
                    </div> */}

                    {/* shipping address */}
                    {/* <EditLeadShippingDetails
                      billingValue={this.state.leadsShippingBilling}
                      state={this.state.leadsShippingState}
                      city={this.state.leadsShippingCity}
                      pincode={this.state.leadsShippingPinCode}
                      website={this.state.leadsShippingWebsite}
                      checkboxState={this.state.leadsShippingCheckbox}
                      handleChange={this.handleChange}
                      error={errors}
                    /> */}
                  </div>
                </div>
              </div>
              {/* buttons */}
              <div className="pt-25 pr-70 text-right">
                <button
                  name="SaveButtonNewEditForm"
                  type="submit"
                  className="btn-funnel-view btn-funnel-view--add-lead-save-btn mr-125"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </Fragment>
    );
  };

  /*===============================
     Render Follow up form 
  ================================*/

  const renderFolloupFields = () => {
    const { selectedOption, leadData, addFollowUpPopUp, errors } = values;
    // console.log(this.state.selectedOption);
    return (
      <Modal
        open={addFollowUpPopUp}
        onClose={onCloseModal}
        closeOnEsc={true}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay",
          modal: "customModal customModal--addLead",
          closeButton: "customCloseButton",
        }}
      >
        <span className="closeIconInModal" onClick={onCloseModal} />
        <Fragment>
          <div className="add-lead-modal-container add-lead-modal-container--followUp">
            <h1 className="font-21-bold mb-60">
              Edit Follow up for {leadData && leadData.name}
            </h1>
            <form noValidate onSubmit={handleSaveFollowUp}>
              <div className="add-lead-form-field-block add-follow-up-main-container">
                <div className="follow-up-select mb-30">
                  <input readOnly className="invisible d-none" autoFocus />

                  {/* <CustomEditDropdown
                    id="selectedOption"
                    name="selectedOption"
                    value={this.state.selectedOption}
                    readOnly={true}
                    onInputChangeHandler={this.onDropdownChange}
                    dropDownToggler={this.dropDownToggler}
                    dropDown={this.state.dropdown}
                    suggestionList={this.state.suggestionList}
                    dropDownSelect={this.dropDownSelect}
                    placeholder={"Select"}
                  /> */}

                  {/*<Select
                    className="react-select-follow-up-form-container"
                    classNamePrefix="react-select-follow-up-form"
                    isSearchable={false}
                    options={selectDropdownOptions}
                    value={this.state.selectedOptionDropdown}
                    onChange={(e) => this.onSelectDropdownSelect(e)}
                    placeholder="Select"
                  />*/}
                  <div className="set_level_and_status_of_lead set_level_and_status_of_lead--status set_level_and_status_of_lead--followup ml-0">
                    <p>Type of Follow up</p>
                    <button
                      onClick={onClickFllowUpButton("Make a Call")}
                      className={
                        values.leadFollowUpNew === "Make a Call"
                          ? "select-lead-followup-by-btn select-lead-followup-by-btn--active"
                          : "select-lead-followup-by-btn"
                      }
                    >
                      {/* <span>📞</span> */}
                      Make a Call
                    </button>
                    <button
                      onClick={onClickFllowUpButton("Email")}
                      className={
                        values.leadFollowUpNew === "Email"
                          ? "select-lead-followup-by-btn select-lead-followup-by-btn--active"
                          : "select-lead-followup-by-btn"
                      }
                    >
                      {/* <img
                        src={require("../../../assets/img/leads-new/email.png")}
                        alt="gradient"
                        className="add-leads-status-img"
                      />{" "} */}
                      <span>Email</span>
                    </button>
                    <button
                      onClick={onClickFllowUpButton("Whatsapp")}
                      className={
                        values.leadFollowUpNew === "Whatsapp"
                          ? "select-lead-followup-by-btn select-lead-followup-by-btn--active"
                          : "select-lead-followup-by-btn"
                      }
                    >
                      {/* <img
                        src={require("../../../assets/img/leads-new/status/status3.png")}
                        alt="gradient"
                        className="add-leads-status-img"
                     />{" "}*/}
                      <span>Whatsapp</span>
                    </button>
                    <button
                      onClick={onClickFllowUpButton("SMS")}
                      className={
                        values.leadFollowUpNew === "SMS"
                          ? "select-lead-followup-by-btn select-lead-followup-by-btn--active"
                          : "select-lead-followup-by-btn"
                      }
                    >
                      {/* <img
                        src={require("../../../assets/img/leads-new/sms.png")}
                        alt="sms"
                        className="add-leads-status-img"
                      />{" "} */}
                      <span>SMS</span>
                    </button>
                  </div>
                </div>

                <div className="follow-up-date-time-section align-items-start mb-30">
                  <div className="follow-up-date leads-title-block-container__date-picker">
                    <label
                      htmlFor="date"
                      className="font-21-medium leads-follow-up-date-label-new-color"
                    >
                      {/*Date for scheduling*/}
                      Follow up Date
                    </label>
                    <div className="d-flex align-items-center justify-content-end leads-title-block-container__date-picker mb-10 mx-0">
                      <span
                        className="font-24-semibold mr-30"
                        role="img"
                        aria-labelledby="Tear-Off Calendar"
                      >
                        {/* calendar */}
                        {/* &#x1F4C6; */}
                      </span>
                      <DatePicker
                        minDate={new Date()}
                        selected={values.startDate}
                        onChange={handleChangeDate}
                        onChangeRaw={handleDateChangeRaw}
                      />
                    </div>
                  </div>
                  <div className="follow-up-time leads-title-block-container__date-picker">
                    <label
                      htmlFor="date"
                      className="font-21-medium leads-follow-up-time-label-new-color"
                    >
                      {/*Time for scheduling*/}
                      Time
                    </label>
                    <div className="d-flex align-items-center justify-content-end leads-title-block-container__date-picker mb-10 mx-0">
                      <span
                        className="font-24-semibold mr-30"
                        role="img"
                        aria-labelledby="clock"
                      >
                        {/* clock */}
                        {/* &#x1F552; */}
                      </span>
                      <DatePicker
                        selected={values.startTime}
                        onChange={handleChangeTime}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        dateFormat="h:mm aa"
                        timeCaption="Time"
                        onChangeRaw={handleDateChangeRaw}
                      />
                    </div>
                  </div>
                </div>
                {selectedOption === "Meeting" && (
                  <div className="mb-30">
                    <label
                      htmlFor="followUpLocation"
                      className="add-lead-label font-21-medium ml-0 pb-16"
                    >
                      Enter Your Location
                    </label>
                    <br />
                    <input
                      htmlFor={"followUpLocation"}
                      id={"followUpLocation"}
                      name={"followUpLocation"}
                      placeholder={"Eg. India"}
                      onChange={handleChange}
                      value={values.followUpLocation}
                      maxLength={maxLengths.char30}
                      className="add-lead-input-field font-18-regular m-0 w-100"
                    />
                    {errors.followUpLocation && (
                      <div className="is-invalid tasklist-duration-fields mt-0 mb-0 ml-2">
                        {errors.followUpLocation}
                      </div>
                    )}
                  </div>
                )}
              </div>
              {/* buttons */}
              <div className="pt-25 text-right">
                <button
                  type="submit"
                  className="save_new_lead_button m-0"
                  //className="btn-funnel-view btn-funnel-view--files m-0"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </Fragment>
      </Modal>
    );
  };

  /*==========================================
           Render Add To Log Model
  ============================================*/

  const addToLogHandler = (lead) => (e) => {
    setValues({
      ...values,
      addToLogModel: true,
      addToLogLeadId: lead._id,
    });
  };

  const addToLogCallback = (status) => {
    if (status === 200) {
      setValues({
        ...values,
        addToLogModel: false,
        addToLogLeadId: "",
      });
    }
  };

  const OnKeyDownAddLog = (e) => {
    e.stopPropagation();
    let keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
      e.preventDefault();
      onActivitySubmit();
    }
  };

  const onActivitySubmit = (e) => {
    if (!isEmpty(e)) {
      e.preventDefault();
    }

    const { addToLogLeadId } = values;

    const formData = {
      logName: values.activityTitle,
      lead: addToLogLeadId,
      status: "UPCOMING",
      description: "this is the best",
      notes: [],
      files: [],
      date: new Date().toISOString(),
    };
    dispatch(addToLog(formData, addToLogCallback));
    // console.log(formData);
  };

  const renderAddToLogModel = () => {
    return (
      <Modal
        open={values.addToLogModel}
        onClose={onCloseModal}
        closeOnEsc={true}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay",
          modal: "customModal customModal--addLead",
          closeButton: "customCloseButton",
        }}
      >
        <span className="closeIconInModal" onClick={onCloseModal} />
        <div className="add_activity_log add-lead-modal-container container-fluid pr-0 lead_page_component">
          <h1 className="font-30-bold mb-61">New Activity Log</h1>

          <form
            noValidate
            // onSubmit={this.handleSubmit}
            onKeyDown={OnKeyDownAddLog}
          >
            <AddEmployeesFormFields
              type="text"
              htmlFor={"activityTitle"}
              labelName={"What is the title of the log?"}
              id={"activityTitle"}
              name={"activityTitle"}
              placeholder={"Eg. name"}
              onChange={handleChange}
              value={values.activityTitle}
              maxLength={maxLengths.char30}
              // error={errors.contactsName}
            />
            <button onClick={onActivitySubmit}>Save</button>
          </form>
        </div>
      </Modal>
    );
  };

  const goToDetailHandler = (leadData) => (e) => {
    e.preventDefault();
    // console.log(leadData);
    store.dispatch({
      type: SET_KANBAN_VIEW,
      payload: false,
    });

    history.push({
      pathname: "/leads-new-details",
      state: { detail: leadData },
    });
  };

  const greatWorkHandler = (e) => {
    store.dispatch({
      type: SET_CONFETTI_ANIMATION,
      payload: false,
    });
    setValues({
      ...values,
      convertedLeadPopup: true,
      customerOnBoardPopup: false,
    });
  };

  // Dlete popup handlers
  const callBackDelete = () => {
    setValues({
      ...values,
      deleteWarningPopup: false,
      deleteId: "",
    });
  };

  const yesHandlder = () => {
    var userData = JSON.parse(localStorage.getItem("Data"));
    const { deleteId } = values;
    dispatch(deleteLead(deleteId, leadFilterName, userData.id, callBackDelete));
  };

  const noHandler = () => {
    setValues({
      ...values,
      deleteWarningPopup: false,
      deleteId: "",
    });
  };

  var userData = JSON.parse(localStorage.getItem("Data"));

  // console.log(leadFilterName);

  let allEmployeesData = [];
  Object.keys(values.allEmployees).forEach(function (key) {
    // console.log(allEmployees[key].name);
    allEmployeesData.push(values.allEmployees[key].name);
  });

  const assignToOptionsRow = allEmployeesData;

  // Search

  let filtereddata = [];
  if (!isEmpty(searchInAllPage)) {
    let search = new RegExp(searchInAllPage, "i");
    filtereddata = allLeads.filter((getall) => {
      if (search.test(getall.name)) {
        return getall;
      }
      // if (search.test(getall.company)) {
      //   return getall;
      // }
      // if (search.test(getall.email)) {
      //   return getall;
      // }
    });
    // console.log(filtereddata);
  } else {
    filtereddata = values.allLeads;
  }

  // console.log(overviewFilterNameReducer);

  return (
    <Fragment>
      <DeleteWarningPopup
        deleteWarningPopup={values.deleteWarningPopup}
        yesHandlder={yesHandlder}
        noHandler={noHandler}
        title={"lead"}
      />
      {/* <CustomerOnBoardPopup
          customerOnBoardPopup={this.state.customerOnBoardPopup}
          greatWorkHandler={this.greatWorkHandler}
        />
        <AddConvertedLeadAsDeal
          convertedLeadPopup={this.state.convertedLeadPopup}
          onCloseModal={this.onCloseModal}
          leadData={this.state.leadData}
        /> */}
      {/* render edit follow up form  */}
      {renderFolloupFields()}
      {/* add to log model */}
      {renderAddToLogModel()}
      {/* render assign lead popup */}
      {renderEditLeadPopUp()}
      <div className="leads-list-table-view-outer-block">
        {!isEmpty(filtereddata) ? (
          <>
            <div className="customers-list-view-title-container">
              <div className="table customers-table-title mb-0">
                <div className="row mx-0 leads-new-list-container__row1 leads-new-list-container__row1__title-block">
                  <div className="leads-new-list-container__row1__colm1">
                    <span>Lead Name</span>
                  </div>
                  <div className="leads-new-list-container__row1__colm2">
                    {/* <span>Level</span> */}
                    {renderLevelDropdown()}
                  </div>
                  <div className="leads-new-list-container__row1__colm3">
                    <span>Company Name</span>
                  </div>
                  <div className="leads-new-list-container__row1__colm4">
                    {/* <span>Assigned To</span> */}
                    {renderAssignedToDropdown()}
                  </div>
                  <div className="leads-new-list-container__row1__colm5">
                    {renderStatusDropdown()}
                  </div>
                </div>
              </div>
            </div>

            <div className="leads-new-card-overflow-div">
              <div className="customers-list-view-container customers-list-view-container--leadsNew">
                {/* <table className="table">
              <tbody> */}

                {filtereddata.map((lead, index) => {
                  // console.log(lead);
                  return (
                    index >=
                      (values.currentPagination - 1) * totalRecordsInOnePage &&
                    index <
                      values.currentPagination * totalRecordsInOnePage && (
                      <div
                        key={index}
                        className={
                          activeWalkthroughPage === "leads-2"
                            ? "leads-new-list-container new-walkthrough-accounts-card-active"
                            : "leads-new-list-container"
                        }
                      >
                        <div className="row mx-0 leads-new-list-container__row1">
                          <div className="leads-new-list-container__row1__colm1 row mx-0 flex-nowrap align-items-center">
                            <div>
                              <img
                                src={require("../../../assets/img/leads/lead_default_img.svg")}
                                className="leads-new-list-container__row1__colm1-img"
                                alt="lead"
                              />
                            </div>
                            <span className="leads-new-list-container__row1__colm1-text">
                              {lead.name}
                            </span>
                          </div>
                          <div className="leads-new-list-container__row1__colm2">
                            {(!isEmpty(lead.assigned) &&
                              lead.assigned._id === userData.id) ||
                            userRole === "Administrator" ? (
                              <Dropdown
                                className="font-24-semibold lead-status-dropDown lead-status-dropDown--emoji ml-0"
                                options={emojiOption}
                                value={
                                  lead.degree === "SUPER_HOT"
                                    ? emojiOption[0]
                                    : lead.degree === "HOT"
                                    ? emojiOption[1]
                                    : lead.degree === "WARM"
                                    ? emojiOption[2]
                                    : lead.degree === "COLD"
                                    ? emojiOption[3]
                                    : ""
                                }
                                onChange={onAllLeadDropdownSelect(lead)}
                              />
                            ) : lead.degree === "SUPER_HOT" ? (
                              emojiOption[0]
                            ) : lead.degree === "HOT" ? (
                              emojiOption[1]
                            ) : lead.degree === "WARM" ? (
                              emojiOption[2]
                            ) : lead.degree === "COLD" ? (
                              emojiOption[3]
                            ) : (
                              ""
                            )}
                          </div>
                          <div className="leads-new-list-container__row1__colm3">
                            <span className="leads-new-list-container__row1__text">
                              {!isEmpty(lead.account_id)
                                ? displaySmallText(
                                    lead.account_id.accountname,
                                    15,
                                    true
                                  )
                                : "------"}
                            </span>
                          </div>
                          <div className="leads-new-list-container__row1__colm4">
                            {/* {lead.assigned.name} */}
                            {(!isEmpty(lead.assigned) &&
                              lead.assigned._id === userData.id) ||
                            userRole === "Administrator" ? (
                              <Dropdown
                                className="lead-status-dropDown lead-status-dropDown--statusRow"
                                options={assignToOptionsRow}
                                onChange={onAssignToOptionsRowClick(lead)}
                                value={
                                  !isEmpty(lead.assigned) && lead.assigned.name
                                }
                              />
                            ) : (
                              lead.assigned.name
                            )}
                          </div>
                          <div className="leads-new-list-container__row1__colm5">
                            {!isEmpty(lead.assigned) &&
                            (lead.assigned._id === userData.id ||
                              userRole === "Administrator") &&
                            lead.status !== "CONVERTED" &&
                            lead.status !== "DROPPED_LEAD" &&
                            lead.status !== "ARCHIVE" ? (
                              <Dropdown
                                className="lead-status-dropDown lead-status-dropDown--statusRow"
                                options={statusOptionsRow}
                                onChange={onStatusOptionsRowClick(lead)}
                                value={
                                  lead.status === "NEW_LEAD"
                                    ? "New Lead"
                                    : lead.status === "CONTACTED_LEADS"
                                    ? "Contacted Lead"
                                    : lead.status === "QUALIFIED_LEADS"
                                    ? "Qualified Lead"
                                    : lead.status === "OPPORTUNITIES"
                                    ? "Opportunity Lead"
                                    : lead.status === "CONVERTED"
                                    ? "Converted Lead"
                                    : lead.status === "ARCHIVE"
                                    ? "Archive"
                                    : lead.status === "ON_HOLD"
                                    ? "On Hold Lead"
                                    : lead.status === "DROPPED_LEAD"
                                    ? "Drop Lead"
                                    : ""
                                }
                              />
                            ) : lead.status === "NEW_LEAD" ? (
                              <span className="leads-new-list-container__row1__text">
                                New Lead
                              </span>
                            ) : lead.status === "CONTACTED_LEADS" ? (
                              <span className="leads-new-list-container__row1__text">
                                Contacted Lead
                              </span>
                            ) : lead.status === "QUALIFIED_LEADS" ? (
                              <span className="leads-new-list-container__row1__text">
                                Qualified Lead
                              </span>
                            ) : lead.status === "OPPORTUNITIES" ? (
                              <span className="leads-new-list-container__row1__text">
                                Opportunity
                              </span>
                            ) : lead.status === "CONVERTED" ? (
                              <span className="leads-new-list-container__row1__text">
                                Converted
                              </span>
                            ) : lead.status === "ARCHIVE" ? (
                              <>
                                {/*<span className="leads-new-list-container__row1__text">
                              show label 
                          </span>*/}
                                <div className="row mx-0 align-items-center leads-archived-div">
                                  <img
                                    src={require("../../../assets/img/leads-new/archive-leads.svg")}
                                    alt="archived leads"
                                    className="archived-leads-img"
                                  />
                                  <span className="archived-leads-text">
                                    Lead Archived
                                  </span>
                                </div>
                              </>
                            ) : lead.status === "ON_HOLD" ? (
                              <span className="leads-new-list-container__row1__text">
                                On Hold
                              </span>
                            ) : lead.status === "DROPPED_LEAD" ? (
                              <span className="leads-new-list-container__row1__text">
                                Drop Lead
                              </span>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                        <div className="row mx-0 leads-new-list-container__row2">
                          <div className="row mx-0 flex-nowrap align-items-center">
                            <div className="leads-new-circular-graph-list-view-block">
                              <CircularProgressbar
                                value={
                                  43
                                  // !isEmpty(lead.closingProbability)
                                  //   ? lead.closingProbability
                                  //   : 0
                                }
                                strokeWidth={15}
                              />
                            </div>
                            <span className="font-16-medium">
                              43
                              {/* {!isEmpty(lead.closingProbability)
                            ? lead.closingProbability
                            : "N/A"} */}
                            </span>
                            <span className="leads-new-closure-text">
                              Closure probability
                              <sup>TM</sup>
                            </span>
                          </div>
                          {/* followup */}
                          <div
                            className="row mx-0 leads-new-list-container__row2-block-img-text"
                            onClick={() => onSelect("addFollowUp", lead)}
                          >
                            <img
                              // src={require("../../../assets/img/leads-new/calendar.svg")}
                              src="/img/desktop-dark-ui/icons/lead-add-followup.svg"
                              alt=""
                              className="calendar-img"
                            />
                            <span>add followups</span>
                          </div>
                          {/* logs */}
                          <div className="row mx-0 leads-new-list-container__row2-block-img-text">
                            <img
                              // src={require("../../../assets/img/leads-new/note.svg")}
                              src="/img/desktop-dark-ui/icons/lead-add-logs.svg"
                              alt=""
                              className="note-img"
                            />
                            <span onClick={addToLogHandler(lead)}>
                              add logs
                            </span>
                          </div>
                          {/* kanban */}

                          {/* {lead.isKanban === true ? (
                          <div
                            className="row mx-0 leads-new-list-container__row2-block-img-text"
                            onClick={() => onSelect("removeFromKanBan", lead)}
                          >
                            <img
                              src={require("../../../assets/img/leads-new/remove-from-kanban.svg")}
                              alt="kanban"
                              className="kanban-img"
                            />
                            <span>Remove from Kanban view</span>
                          </div>
                        ) : (
                          <div
                            className="row mx-0 leads-new-list-container__row2-block-img-text"
                            onClick={() => onSelect("addToKanBan", lead)}
                          >
                            <img
                              src="/img/desktop-dark-ui/icons/lead-add-to-kanban.svg"
                              alt="kanban"
                              className="kanban-img"
                            />
                            <span>add to Kanban view</span>
                          </div>
                        )} */}

                          {/* edit */}
                          <div
                            className="row mx-0 leads-new-list-container__row2-block-img-text"
                            onClick={() => onSelect("editLead", lead)}
                          >
                            <img
                              // src={require("../../../assets/img/leads-new/pencil.svg")}
                              src="/img/desktop-dark-ui/icons/pencil-with-underscore.svg"
                              alt="pencil"
                              className="pencil-img"
                            />
                            <span>edit</span>
                          </div>
                          {/* delete */}
                          {userRole === "Administrator" &&
                          lead.status !== "ARCHIVE" ? (
                            <div
                              className="row mx-0 leads-new-list-container__row2-block-img-text"
                              onClick={() => onSelect("deleteLead", lead)}
                            >
                              <img
                                // src={require("../../../assets/img/leads-new/delete.svg")}
                                src="/img/desktop-dark-ui/icons/lead-delete.svg"
                                alt="delete"
                                className="delete-img"
                              />
                              <span>archive</span>
                            </div>
                          ) : (
                            userRole === "Administrator" &&
                            lead.status === "ARCHIVE" && (
                              <div
                                className="row mx-0 leads-new-list-container__row2-block-img-text"
                                onClick={() => onSelect("restoreLead", lead)}
                              >
                                <img
                                  src={require("../../../assets/img/leads-new/restore.svg")}
                                  alt="restore"
                                  className="delete-img"
                                />
                                <span>restore</span>
                              </div>
                            )
                          )}

                          {/* hide unhide */}
                          {lead.isHidden === false ? (
                            <div
                              className="row mx-0 leads-new-list-container__row2-block-img-text"
                              onClick={() => onSelect("hideLead", lead)}
                            >
                              <img
                                // src={require("../../../assets/img/leads-new/hide.svg")}
                                src="/img/desktop-dark-ui/icons/lead-eye-with-line.svg"
                                alt="hide"
                                className="eye-img"
                              />
                              <span>hide</span>
                            </div>
                          ) : (
                            <div
                              className="row mx-0 leads-new-list-container__row2-block-img-text"
                              onClick={() => onSelect("unHideLead", lead)}
                            >
                              <img
                                src="/img/desktop-dark-ui/icons/lead-eye-icon.svg"
                                alt="unhide"
                                className="eye-img"
                              />
                              <span>unhide</span>
                            </div>
                          )}
                          <div className="row mx-0 leads-new-list-container__row2-block-img-text">
                            <div
                              onClick={goToDetailHandler(lead)}
                              className="leads-new-view-details"
                            >
                              VIEW DETAILS
                            </div>
                            {/* <Link
                            to={{
                              pathname: "/leads-new-details",
                              state: { detail: lead },
                            }}
                            className="leads-new-view-details"
                          >
                            VIEW DETAILS
                          </Link> */}
                          </div>
                        </div>
                      </div>
                    )
                  );
                })}
                {/* </tbody>
            </table> */}
              </div>
              <div className="add-lead-pagination mt-40">
                <Pagination
                  onChange={onChangePagination}
                  current={values.currentPagination}
                  defaultPageSize={totalRecordsInOnePage}
                  total={values.getItemsList.length}
                  showTitle={false}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="leads-pipeline-empty-div">
            {/* <h5 className="mb-0">
                  No{" "}
                  {!isEmpty(overviewFilterNameReducer) &&
                  overviewFilterNameReducer === "SUPER_HOT"
                    ? "Super Hot "
                    : !isEmpty(overviewFilterNameReducer) &&
                      overviewFilterNameReducer === "HOT"
                    ? "Hot "
                    : !isEmpty(overviewFilterNameReducer) &&
                      overviewFilterNameReducer === "WARM"
                    ? "Warm "
                    : !isEmpty(overviewFilterNameReducer) &&
                      overviewFilterNameReducer === "COLD"
                    ? "Cold "
                    : !isEmpty(overviewFilterNameReducer) &&
                      overviewFilterNameReducer === "followups"
                    ? "Followups "
                    : !isEmpty(overviewFilterNameReducer) &&
                      overviewFilterNameReducer === "meetings"
                    ? "Meetings "
                    : ""}
                  {!isEmpty(leadFilterName) && leadFilterName === "All Leads"
                    ? "Leads"
                    : !isEmpty(leadFilterName) && leadFilterName}{" "}
                  Found
                </h5> */}
            <img
              src="/img/desktop-dark-ui/illustrations/lead-pipeline-inner-list-view.svg"
              alt=""
            />
            <AddLead
              isMobile={false}
              className="leads-title-block-btn-red-bg mr-30 ml-30"
              buttonText="+ Add New Lead"
            />
          </div>
        )}
      </div>
    </Fragment>
  );
}

export default LeadsNewContentListView;
