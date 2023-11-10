import React, { Fragment, useState, useEffect, useRef } from "react";
import Modal from "react-responsive-modal";
import "../common/CustomModalStyle.css";
import Select from "react-select";
// import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import AddLeadsFormField from "./../leads/AddLeadsFormField";
// import AddLeadFormMediaAccount from "./AddLeadFormMediaAccount";
import EditLeadSocialMediaAccount from "./../leads/EditLeadSocialMediaAccount";
// import AddLeadFormShippingDetails from "./AddLeadFormShippingDetails";
import AddLeadFormAssignRepresentative from "./../leads/AddLeadFormAssignRepresentative";
import AddLeadFormSelectFewTags from "./../leads/AddLeadFormSelectFewTags";
import { validateAddLead } from "../../../store/validations/leadsValidation/addLeadValidation";
import { validateAddMeeting } from "../../../store/validations/meetingValidation/meetingValidation";
import { connect } from "react-redux";
import { statusEmpty } from "./../../../store/actions/authAction";
import {
  addLeadAction,
  checkLeadExist,
  checkLeadEmailExist,
} from "./../../../store/actions/leadAction";
import { workspaceActivityForLeads } from "./../../../store/actions/workspaceActivityAction";
import {
  addFollowUpLead,
  addLeadMeetingsAction,
} from "../../../store/actions/calenderAction";
import {
  getAllEmployees,
  getAllEmployeesWithAdmin,
} from "./../../../store/actions/employeeAction";
import { addpipelineLeadsAction } from "./../../../store/actions/leadsPipelineAction";

//leads follow up pkgess
import DatePicker from "react-datepicker";
// import CustomEditDropdown from "../common/CustomEditDropdown";
import isEmpty from "./../../../store/validations/is-empty";
import AddLeadBlueProgressbar from "./../leads/AddLeadBlueProgressbar";
import store from "./../../../store/store";
import { SET_EMPTY_ERRORS, GET_API_STATUS } from "./../../../store/types";

// phone flags country code
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { maxLengths } from "../../../store/validations/maxLengths/MaxLengths";
import AddMemberSelectAndDisplayList from "../common/AddMemberSelectAndDisplayList";
import AddAccount from "./../../desktop/accounts/AddAccount";
import { createFieldValue } from "./../../../store/actions/commandCenter";
import { getOverviewFilterForCount } from "./../../../store/actions/leadAction";
import {
  getSocialMediaGraph,
  getLeadsLevelsChartGraph,
} from "./../../../store/actions/reportsAction";
import { getAllAccounts } from "./../../../store/actions/accountsAction";
import dateFns from "date-fns";
import { useDispatch, useSelector } from "react-redux";
// Requiring lodash library
import debounce from "lodash.debounce";

const defaultTagsValues = [];

// FETCH THE LIST FROM THE BACKEND

const selectDropdownOptions = [
  { value: "Make a Call", label: "Make a Call" },
  { value: "Email", label: "Email" },
  { value: "Whatsapp", label: "Whatsapp" },
  { value: "Sms", label: "Sms" },
];

const selectStatusDropdownOptions = [
  { value: "New Lead", label: "New Lead" },
  { value: "Contacted Lead", label: "Contacted Lead" },
  { value: "Qualified Lead", label: "Qualified Lead" },
  { value: "On Hold Lead", label: "On Hold Lead" },
  { value: "Opportunity Lead", label: "Opportunity Lead" },
  { value: "Converted Lead", label: "Converted Lead" },
];

const leadsSourceOptions = [
  { value: "Facebook", label: "Facebook" },
  { value: "LinkedIn", label: "LinkedIn" },
  { value: "Instagram", label: "Instagram" },
  { value: "Others", label: "Others" },
];

// started from 0
const totalFormSlides = 5;

function AddLeadsInPipeline({
  leadDataToFetchMemberLog,
  report,
  buttonText,
  isMobile,
  isActive,
  className,
}) {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    prevNextIndex: 0,
    options: [],
    selectOption: "",
    displayListSelected: [],
    leadsName: "",
    leadsEmail: "",
    leadsAddress: "",
    leadsWorkInCompanyName: "",
    leadsPhoneCountryNumber: "+1",
    leadsPhoneNumber: "",
    leadsWorthAmount: "",
    // selectedLeadsSourceDropdownOption: leadsSourceOptions[0],
    // leadsSourceDropdownOption: leadsSourceOptions[0].value,
    selectedLeadsSourceDropdownOption: null,
    leadsSourceDropdownOption: "",
    // leadsSourceDropdownOption: null,
    leadsAbout: "",
    // leadMediaEmailCheckbox: false,
    // leadMediaEmailInput: "",
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
    selectedStatusOptionDropdown: [],
    leadLevel: "COLD",
    leadStatus: [],
    leadStatusNew: "New Lead",
    leadFollowUpNew: "Make a Call",
    newAccountName: "",
    /*===========================
      Follow up form Fields
    =============================*/
    selectedOptionDropdown: selectDropdownOptions[0],
    selectedOption: selectDropdownOptions[0].value,
    // dropdown: false,
    // suggestionList: list,
    startDate: new Date(),
    startTime: new Date(),
    followUpLocation: "",
    // errors: {},
    allEmployees: [],
    leadAssignRepresentativeId: [],
    activeEmployee: [],
    currentFollowUp: [],
    validationError: {},
    customTextboxfieldData: {},
    customeDropdownFieldData: {
      // Dropdown: { value: "Facebook", label: "Facebook" },
    },
    allAccounts: [],
    leadsCustomFields: [],
  });

  const [addMoreInfoPopup, setaddMoreInfoPopup] = useState(false);
  const [open, setOpen] = useState(false);
  const [addFollowUpForm, setaddFollowUpForm] = useState(false);
  const [validationErrors, setErrors] = useState({});

  const [selectOption, setselectOption] = useState("");
  const [selectStatusDropdownOptions, setSelectStatusDropdownOptions] =
    useState([]);

  const leadsCustomFields = useSelector(
    (state) => state.commandCenter.leadsCustomFields
  );
  const allAccounts = useSelector((state) => state.account.allAccounts);
  const validationError = useSelector((state) => state.errors.errors);
  const leadFilterName = useSelector((state) => state.filterName.filterName);
  const followUpData = useSelector((state) => state.leads.currentLeadAdded);
  const allEmployees = useSelector((state) => state.employee.allEmployees);
  const allPipelineStages = useSelector(
    (state) => state.leadsPipeline.allPipelineStages
  );

  useEffect(() => {
    const fomrData = {
      query: {},
    };
    dispatch(getAllEmployeesWithAdmin(fomrData));
    dispatch(getAllAccounts());
  }, []);

  useEffect(() => {
    if (!isEmpty(leadsCustomFields)) {
      let textBoxData = leadsCustomFields.filter(
        (element) => element.type === "TEXTBOX"
      );

      // let dropDownData = leadsCustomFields.filter(
      //   (element) => element.type === "DROPDOWN"
      // );

      let textDataFinalObject = {};
      if (!isEmpty(textBoxData)) {
        textBoxData.forEach((ele) => {
          ele.name = ele.name.split(" ").join("");
          textDataFinalObject[ele.name] = "";
        });
      }

      setValues({
        ...values,
        leadsCustomFields: leadsCustomFields,
        customTextboxfieldData: textDataFinalObject,
      });
    }
  }, [leadsCustomFields]);

  useEffect(() => {
    if (!isEmpty(validationError)) {
      setValues({
        ...values,
        validationError: validationError,
      });
    }
  }, [validationError]);

  useEffect(() => {
    if (!isEmpty(followUpData)) {
      setValues({
        ...values,
        currentFollowUp: followUpData,
      });
    }
  }, [followUpData]);

  useEffect(() => {
    if (!isEmpty(allEmployees)) {
      let filterEmp = allEmployees.filter(function (allEmployees) {
        return allEmployees.status === "ACTIVE";
      });
      setValues({
        ...values,
        allEmployees: filterEmp,
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
        allAccounts: allAccounts,
      });
    }
  }, [allAccounts, open]);

  useEffect(() => {
    if (!isEmpty(allPipelineStages)) {
      let newStagesArray =
        !isEmpty(allPipelineStages) &&
        allPipelineStages.map((stage) => ({
          value: stage._id,
          label: stage.leadStageName,
        }));
      setSelectStatusDropdownOptions(newStagesArray);
      setValues({
        ...values,
        leadStatusNew: newStagesArray[0].value,
      });
    }
  }, [allPipelineStages]);

  const onSelectDropdownSelect = (e) => {
    setValues({
      ...values,
      selectedOption: e.value,
      selectedOptionDropdown: e,
    });
    console.log("Selected: " + e.value);
  };

  const onSelectStatusDropdownSelect = (e) => {
    setValues({
      ...values,
      selectedStatusOptionDropdown: e,
      leadStatus: e.value,
    });
  };

  /*===============================
    Lead Follow Up Popup Actions
  ================================*/

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

  const callBackAddFollowUp = (status) => {
    var userData = JSON.parse(localStorage.getItem("Data"));
    // const { leadFilterName, leadDataToFetchMemberLog } = this.props;
    if (status === 200) {
      onCloseModal();
      setOpen(false);
      setaddFollowUpForm(false);

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
    const { currentFollowUp, leadFollowUpNew } = values;
    if (leadFollowUpNew === "Meeting") {
      const { errors, isValid } = validateAddMeeting(values);
      if (errors.followUpLocation) {
        // setValues({
        //   ...values,
        //   errors,
        // });
        setErrors(errors);
      }
      const newMeeting = {
        subject: values.selectedOption,
        meetingDate: values.startDate,
        meetingTime: values.startTime,
        location: values.followUpLocation,
        assigned: currentFollowUp._id,
        assignedPipelead: currentFollowUp._id,
      };
      // console.log(errors);
      if (isValid) {
        dispatch(addLeadMeetingsAction(newMeeting, callBackAddFollowUp));
      }
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
        entityId: currentFollowUp._id,
        followupAtDate: values.startDate,
        followupAtTime: values.startTime,
        assigned: currentFollowUp._id,
        assignedPipelead: currentFollowUp._id,
        notification: true,
        status: "NEW",
      };

      dispatch(addFollowUpLead(newFollowUp, callBackAddFollowUp));
    }
    // this.setState({
    //   followUpSucess: true,
    // });
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

  // start select tags handlers
  const handleSelectTagsOnChange = (e) => {
    setValues({
      ...values,
      tagsInputValue: [e.target.value],
    });
  };

  const handleSelectTagsOnKeyPress = (e) => {
    let keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
      setValues({
        ...values,
        prevNextIndex: values.prevNextIndex - 1,
      });
      // split the str and remove the empty values
      console.log(values.tagsInputValue, "before trim");
      //let tagsInputValue = values.tagsInputValue.toString().split(",");
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
          //     [...values.tagsArray, ...tagsInputValue].length > 4
          //       ? [...values.tagsArray, ...tagsInputValue].slice(0, 4)
          //       : [...values.tagsArray, ...tagsInputValue],
          //   tagsInputValue: []
          // });
          setValues({
            ...values,
            tagsArray: [...values.tagsArray, ...tagsInputValue],
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
        tagsArray: tags,
      });
    }
  };

  // end select tags handlers

  const onOpenModal = (e) => {
    e.preventDefault();
    const { allEmployees } = values;
    // const { allAccounts } = this.props;

    // if (!isEmpty(allAccounts)) {
    //   let newArray =
    //     !isEmpty(allAccounts) &&
    //     allAccounts.map((account) => ({
    //       value: account._id,
    //       label: account.accountname,
    //     }));
    //   setValues({
    //     ...values,
    //     options: newArray,
    //     allAccounts: allAccounts,
    //   });
    // }

    let defaultAssign =
      !isEmpty(allEmployees) &&
      allEmployees.filter(function (allEmployees) {
        return allEmployees.role.name === "Administrator";
      });
    console.log(defaultAssign);

    setValues({
      ...values,
      // open: true,
      leadAssignRepresentativeId:
        !isEmpty(defaultAssign[0]) && defaultAssign !== undefined
          ? defaultAssign[0]._id
          : "",
      leadAssignRepresentative:
        !isEmpty(defaultAssign[0]) && defaultAssign !== undefined
          ? defaultAssign[0].name
          : "",
      hasClosedModal: false,
      success: false,
      followUpSucess: false,
      hasFollowUpClosed: false,
    });
    setOpen(true);
  };

  const onCloseModal = () => {
    setaddMoreInfoPopup(false);
    setOpen(false);
    setaddFollowUpForm(false);
    setselectOption("");
    setValues({
      ...values,

      prevNextIndex: 0,
      options: [],
      // selectOption: "",
      displayListSelected: [],
      leadsName: "",
      leadsEmail: "",
      leadsAddress: "",
      leadsWorkInCompanyName: "",
      leadsPhoneCountryNumber: "+1",
      leadsPhoneNumber: "",
      leadsWorthAmount: "",
      // selectedLeadsSourceDropdownOption: leadsSourceOptions[0],
      // leadsSourceDropdownOption: leadsSourceOptions[0].value,
      selectedLeadsSourceDropdownOption: null,
      leadsSourceDropdownOption: "",
      leadsAbout: "",
      // leadMediaEmailCheckbox: false,
      // leadMediaEmailInput: "",
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
      leadAssignRepresentativeId: "",
      activeEmployee: [],
      selectedStatusOptionDropdown:
        !isEmpty(selectStatusDropdownOptions) && selectStatusDropdownOptions[0],
      leadLevel: "COLD",
      leadStatus:
        !isEmpty(selectStatusDropdownOptions) &&
        selectStatusDropdownOptions[0].value,
      /*===========================
        Follow up form Fields
      =============================*/
      selectedOptionDropdown: selectDropdownOptions[0],
      selectedOption: selectDropdownOptions[0].value,
      // dropdown: false,
      // suggestionList: list,
      startDate: new Date(),
      startTime: new Date(),
      followUpLocation: "",
      // errors: {},
      allAccounts: [],
    });
    setErrors({});
  };

  const handleChangeNumber = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.validity.valid ? e.target.value : "",
    });
  };

  const callBackLeadExist = (data) => {
    // const { errors } = values;
    if (data.isExist === true) {
      validationErrors.leadsName = "Lead alredy exist";
      // setValues({
      //   ...values,
      //   errors: errors,
      // });
      setErrors(validationErrors);
    } else {
      validationErrors.leadsName = "";
      // setValues({
      //   ...values,
      //   errors: errors,
      // });
      setErrors(validationErrors);
    }
  };

  const callBackLeadEmailExist = (isExist) => {
    // const { errors } = values;
    if (isExist === true) {
      validationErrors.leadsEmail = "Lead alredy exist";
      setErrors(validationErrors);
    } else {
      validationErrors.leadsEmail = "";
      setErrors(validationErrors);
    }
  };

  // debounce start
  const debouncedSave = useRef(
    debounce(
      (nextValue) =>
        dispatch(checkLeadExist(nextValue.toLowerCase(), callBackLeadExist)),
      1000
    )
    // will be created only once initially
  ).current;
  // debounce end

  // debounce start
  const debouncedEmailCheck = useRef(
    debounce(
      (nextValue) =>
        dispatch(
          checkLeadEmailExist(
            {
              query: {
                email: nextValue.toLowerCase(),
              },
            },
            callBackLeadEmailExist
          )
        ),
      1000
    )
    // will be created only once initially
  ).current;
  // debounce end

  const handleChange = (e) => {
    setErrors({});
    if (e.target.name === "leadsName") {
      const { value: nextValue } = e.target;
      debouncedSave(nextValue);
      // dispatch(checkLeadExist(e.target.value.toLowerCase(), callBackLeadExist));
    }
    // if (e.target.name === "leadsEmail") {
    //   const { value: nextValue } = e.target;
    //   debouncedEmailCheck(nextValue);
    //   // dispatch(checkLeadExist(e
    // }
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

  const handleDateChangeRaw = (e) => {
    e.preventDefault();
  };

  /*===============================================
      select account
  ===============================================*/

  const handleChangeSelectClient = (selectedOption) => {
    // setValues({
    //   ...values,
    //   // selectOption: selectedOption,
    //   errors: { displayListSelected: "" },
    // });
    setErrors({ validationErrors: { displayListSelected: "" } });
    setselectOption(selectedOption);

    // add option to list if it's not present in list
    //let newList = this.state.displayListSelected;
    let newList = [];
    if (newList.indexOf(selectedOption) === -1) {
      newList.push(selectedOption);
      setValues({
        ...values,
        displayListSelected: newList,
      });
    }
  };

  const handleSelecAccounttOnClick = (selectedAccount) => (e) => {
    console.log(selectedAccount);
    //e.preventDefault();
    setValues({
      ...values,
      newAccountName: selectedAccount.label,
    });
  };

  const handleRemoveSelectedAccount = () => {
    setValues({
      ...values,
      newAccountName: "",
    });
  };

  const handleRemoveMember = (index) => (e) => {
    let newList = values.displayListSelected;
    newList.splice(index, 1);
    setValues({
      ...values,
      // selectOption: "",
      displayListSelected: newList,
    });
    setselectOption("");
  };

  /*===============================================
      select account end
  ===============================================*/

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
        leadsShippingBilling: this.state.leadsShippingAddress,
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

  const handleSubmitOnKeyDown = (e) => {
    let keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
      e.preventDefault();
      handleSubmitFunctionMain();
    }
  };

  const handleSubmit = (label) => (e) => {
    e.preventDefault();
    if (label === "addMoreFields") {
      setValues({
        ...values,
        // addMoreInfoPopup: true,
        // open: false,
      });
      setaddMoreInfoPopup(true);
      setOpen(false);
    } else {
      handleSubmitFunctionMain();
    }
  };

  const callBackAddLead = (status) => {
    // const { leadDataToFetchMemberLog, report } = this.props;
    if (status === 200) {
      // setValues({
      //   ...values,
      //   // addFollowUpForm: true,
      //   open: true,
      //   // addMoreInfoPopup: false,
      // });
      setOpen(true);
      setaddMoreInfoPopup(false);
      setaddFollowUpForm(true);
      if (!isEmpty(leadDataToFetchMemberLog)) {
        dispatch(workspaceActivityForLeads(leadDataToFetchMemberLog));
      }
      if (report === true) {
        let startMonth = dateFns.startOfMonth(new Date()).toISOString();
        let endMonth = dateFns.lastDayOfMonth(new Date()).toISOString();
        dispatch(getSocialMediaGraph(false, startMonth, endMonth));
        dispatch(
          getLeadsLevelsChartGraph(
            false,
            new Date().toISOString(),
            new Date().toISOString()
          )
        );
      }
    }
  };

  const handleSubmitFunctionMain = () => {
    var userData = JSON.parse(localStorage.getItem("Data"));
    let leadPipelineData = JSON.parse(localStorage.getItem("leadPipelineData"));
    const { errors, isValid } = validateAddLead(values);
    const {
      leadsCustomFields,
      customTextboxfieldData,
      customeDropdownFieldData,
    } = values;

    // console.log(this.state);
    if (!isValid) {
      // setValues({
      //   ...values,
      //   errors,
      //   // prevNextIndex: 0
      // });
      setErrors(errors);
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

      let leadStatus = values.leadStatusNew;
      if (leadStatus === "New Lead") {
        leadStatus = "NEW_LEAD";
      } else if (leadStatus === "Contacted Lead") {
        leadStatus = "CONTACTED_LEADS";
      } else if (leadStatus === "Qualified Lead") {
        leadStatus = "QUALIFIED_LEADS";
      } else if (leadStatus === "On Hold Lead") {
        leadStatus = "ON_HOLD";
      } else if (leadStatus === "Opportunity Lead") {
        leadStatus = "OPPORTUNITIES";
      } else if (leadStatus === "Converted Lead") {
        leadStatus = "CONVERTED";
      }

      const formData = {
        name: values.leadsName.toLowerCase(),
        company: values.leadsWorkInCompanyName,
        email: values.leadsEmail.toLowerCase(),
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
        // billingAddress: values.leadsShippingBilling,
        // status: leadStatus,
        tags: values.tagsArray,
        assigned: values.leadAssignRepresentativeId,
        // additionalInfo: "{'sdsd':'sdsd'}",
        profileImage: "https://xyz.com",
        about: values.leadsAbout,
        degree: values.leadLevel,
        account_id: selectOption.value,
        entityType: "ACCOUNT",
        entityId: selectOption.value,
        media: {
          facebook: values.leadMediaFacebookInput,

          linkedIn: values.leadMediaLinkedInInput,

          instagram: values.leadMediaInstagramInput,

          skype: values.leadsSkypeAddress,

          other: values.leadMediaOthersInput,
        },
        worth: values.leadsWorthAmount,
        source: values.leadsSourceDropdownOption,
        isKanban: true,
        isHidden: false,
        stage: leadStatus,
        pipeline: leadPipelineData._id,
      };

      dispatch(
        addpipelineLeadsAction(
          formData,
          leadFilterName,
          userData.id,
          //   leadsCustomFields,
          //   customTextboxfieldData,
          //   customeDropdownFieldData,
          callBackAddLead
        )
      );
    }
    // this.setState({
    //   success: true,
    // });
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
    console.log("Selected: " + e.value);
  };

  const handleMainDivKeyDown = (e) => {
    e.stopPropagation();
    let keyCode = e.keyCode || e.which;
    // for react-select dropdown preventDefault on enter
    if (keyCode === 13 && values.prevNextIndex === 5) {
      e.preventDefault();
    }
    // Shift + ArrowLeft
    if (e.ctrlKey && keyCode === 37) {
      handlePrev();
    }
    // Shift + ArrowRight
    if (e.ctrlKey && keyCode === 39) {
      handleNext();
    }
  };

  const handlePrev = () => {
    setValues({
      ...values,
      prevNextIndex:
        values.prevNextIndex > 0
          ? values.prevNextIndex - 1
          : values.prevNextIndex,
    });
  };

  // handle next on key enter
  const onFormKeyDown = (e) => {
    e.stopPropagation();
    let keyCode = e.keyCode || e.which;
    if (
      keyCode === 13 &&
      values.prevNextIndex !== 8 &&
      values.prevNextIndex !== 4 &&
      values.prevNextIndex !== 5
    ) {
      e.preventDefault();
      handleNext();
    }
  };

  const handleNext = () => {
    const { errors } = validateAddLead(values);

    if (values.prevNextIndex === 0) {
      if (errors.leadsName) {
        setValues({
          ...values,
          // errors,
          prevNextIndex: values.prevNextIndex,
        });
        setErrors(errors);
      } else if (validationErrors.leadsName) {
        setValues({
          ...values,
          // errors: validationErrors,
          prevNextIndex: values.prevNextIndex,
        });
        setErrors(validationErrors);
      } else {
        setValues({
          ...values,
          prevNextIndex: values.prevNextIndex + 1,
          // errors: {},
        });
        setErrors({});
      }
    } else if (values.prevNextIndex === 1) {
      if (errors.leadsEmail) {
        setValues({
          ...values,
          // errors,
          prevNextIndex: values.prevNextIndex,
        });
        setErrors(errors);
      } else if (validationErrors.leadsEmail) {
        setValues({
          ...values,
          // errors: validationErrors,
          prevNextIndex: values.prevNextIndex,
        });
        setErrors(validationErrors);
      } else {
        setValues({
          ...values,
          prevNextIndex: values.prevNextIndex + 1,
          // errors: {},
        });
        setErrors({});
      }
    } else if (values.prevNextIndex === 2) {
      if (errors.leadsPhoneCountryNumber || errors.leadsPhoneNumber) {
        setValues({
          ...values,
          // errors,
          prevNextIndex: values.prevNextIndex,
        });
        setErrors(errors);
      } else {
        setValues({
          ...values,
          prevNextIndex: values.prevNextIndex + 1,
          // errors: {},
        });
        setErrors({});
      }
    } else if (values.prevNextIndex === 3) {
      if (errors.leadAssignRepresentative) {
        setValues({
          ...values,
          // errors,
          prevNextIndex: values.prevNextIndex,
        });
        setErrors(errors);
      } else {
        setValues({
          ...values,
          prevNextIndex: values.prevNextIndex + 1,
          // errors: {},
        });
        setErrors({});
      }
    } else if (values.prevNextIndex === 4) {
      if (errors.displayListSelected) {
        setValues({
          ...values,
          // errors,
          prevNextIndex: values.prevNextIndex,
        });
        setErrors(errors);
      } else {
        setValues({
          ...values,
          prevNextIndex: values.prevNextIndex + 1,
          errors: {},
        });
        setErrors({});
      }
    } else {
      setValues({
        ...values,
        prevNextIndex:
          values.prevNextIndex < totalFormSlides
            ? values.prevNextIndex + 1
            : values.prevNextIndex,
        // errors: {},
      });
      // setErrors({});
    }
  };

  /*=================================
    Level select On click Handler
  ==================================*/
  const onClickLevelButton = (level) => (e) => {
    e.preventDefault();
    // console.log(level);
    setValues({
      ...values,
      leadLevel: level,
    });
  };

  /*=================================
    Status select On click Handler
  ==================================*/
  const onClickStatusButton = (data) => (e) => {
    e.preventDefault();
    // console.log(status);
    setValues({
      ...values,
      leadStatusNew: data.value,
    });
  };

  /*=================================
      Render Add More Info Lead
  ===================================*/

  const prevToAddMoreButton = () => {
    setValues({
      ...values,
      // addMoreInfoPopup: false,
      // open: true,
      prevNextIndex: totalFormSlides,
    });
    setaddMoreInfoPopup(false);
    setOpen(true);
  };

  /*==================================================
            CUSTOM FIELD SECTION START
  ====================================================*/

  // CUSTOM TEXTBOX SECTION

  const handleChangeCustomTextBox = (name) => (e) => {
    let prevFieldData = values.customTextboxfieldData;
    prevFieldData[name] = e.target.value;
    setValues({
      ...values,
      customTextboxfieldData: prevFieldData,
    });
  };

  const renderCustomTextbox = (fieldData) => {
    // console.log(fieldData);
    let name = fieldData.name.split(" ").join("");
    return (
      <AddLeadsFormField
        htmlFor={`${fieldData.name}`}
        type={"text"}
        labelName={`${fieldData.name}`}
        id={`${fieldData.name}`}
        name={`${fieldData.name}`}
        placeholder={"Eg. India"}
        onChange={handleChangeCustomTextBox(name)}
        value={values.customTextboxfieldData[name]}
        maxLength={maxLengths.char200}
      />
    );
  };

  // CUSTOM DROPDOWN SECTION

  const onCustomDropdownChange = (name) => (e) => {
    let prevFieldData = values.customeDropdownFieldData;
    prevFieldData[name] = { value: e.value, label: e.value };
    setValues({
      ...values,
      customeDropdownFieldData: prevFieldData,
    });
    // console.log("Selected: " + e.value, name);
  };

  const renderCustomDropdown = (fieldData) => {
    // console.log(fieldData);
    let name = fieldData.name.split(" ").join("");
    let dropdownOption = [];
    fieldData.options.forEach((element) => {
      let obj = { value: element, label: element };
      dropdownOption.push(obj);
    });
    return (
      <div className="mb-30">
        <label
          htmlFor="leadsSource"
          className="add-lead-label font-24-semibold"
        >
          {fieldData.name}
        </label>
        <div className="add-lead-input-field border-0">
          <Select
            className="react-select-add-lead-form-container"
            classNamePrefix="react-select-add-lead-form"
            isSearchable={false}
            options={dropdownOption}
            value={values.customeDropdownFieldData[name]}
            onChange={onCustomDropdownChange(name)}
            placeholder="Select"
          />
        </div>
      </div>
    );
  };

  /*==================================================
            CUSTOM FIELD SECTION END
  ====================================================*/

  const renderAddMoreInfoModel = () => {
    const errors = validationErrors;
    // const { leadsCustomFields } = this.props;

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
          maxLength={maxLengths.char200}
          onChange={handleChange}
          autoFocus={true}
        />
        {errors && (
          <p className="is-invalid add-lead-form-field-errors pl-0 ml-0">
            {errors.leadsAbout}
          </p>
        )}
      </div>
    );

    // Select tags

    const selectFewTags = (
      <div>
        {!isEmpty(values.tagsArray) && (
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
      </div>
    );

    // lead add company
    // const addLeadCompany = (
    //   <AddLeadsFormField
    //     htmlFor={"leadsWorkInCompanyName"}
    //     type={"text"}
    //     labelName={`Account`}
    //     id={"leadsWorkInCompanyName"}
    //     name={"leadsWorkInCompanyName"}
    //     placeholder={"Eg. Marvel Studios"}
    //     onChange={this.handleChange}
    //     value={this.state.leadsWorkInCompanyName}
    //   />
    // );

    // Add Location

    const leadAddLocation = (
      <AddLeadsFormField
        htmlFor={"leadsAddress"}
        type={"text"}
        labelName={`Location`}
        id={"leadsAddress"}
        name={"leadsAddress"}
        placeholder={"Eg. India"}
        onChange={handleChange}
        value={values.leadsAddress}
      />
    );

    // Lead Source dropdown

    const leadSourceDropdown = (
      <div className="mb-30">
        <label
          htmlFor="leadsSource"
          className="add-lead-label font-24-semibold"
        >
          {values.leadsName}'s source
        </label>
        <div className="add-lead-input-field border-0">
          {/* <Dropdown
            className="lead-status-dropDown lead-status-dropDown--importExport lead-status-dropDown--importExport--all-lead"
            options={leadsSourceOptions}
            value={values.leadsSourceDropdownOption}
            onChange={this.onSourceDropdownSelect}
          /> */}

          {/* {console.log(leadsSourceOptions)} */}
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

    // lead addd media accounts
    const leadAddMedia = (
      <>
        {/* media accounts */}
        <div className="row mx-0 mb-30">
          <label
            htmlFor="leadMediaEmailCheckbox"
            className="add-lead-label font-24-semibold mt-20"
          >
            Add other media accounts
          </label>
          {/* linkedIn */}
          <EditLeadSocialMediaAccount
            img={require("../../../assets/img/icons/Dominate-Icon_linkedin.svg")}
            name="leadMediaLinkedInInput"
            placeholder="https://www.linkedIn.com/"
            onChange={handleChange}
            maxLength={maxLengths.char200}
            value={values.leadMediaLinkedInInput}
            error={errors.leadMediaLinkedInInput}
          />

          {/* facebook */}
          <EditLeadSocialMediaAccount
            img={require("../../../assets/img/icons/Dominate-Icon_facebook.png")}
            name="leadMediaFacebookInput"
            placeholder="https://www.facebook.com/"
            onChange={handleChange}
            value={values.leadMediaFacebookInput}
            maxLength={maxLengths.char200}
            error={errors.leadMediaFacebookInput}
          />
          {/* instagram */}
          <EditLeadSocialMediaAccount
            img={require("../../../assets/img/icons/Dominate-Icon_instagram.png")}
            name="leadMediaInstagramInput"
            placeholder="https://www.instagram.com/"
            onChange={handleChange}
            value={values.leadMediaInstagramInput}
            maxLength={maxLengths.char200}
            error={errors.leadMediaInstagramInput}
          />

          {/* other */}
          <EditLeadSocialMediaAccount
            img={require("../../../assets/img/icons/Dominate-Icon_others.svg")}
            name="leadMediaOthersInput"
            placeholder="any other url"
            onChange={handleChange}
            value={values.leadMediaOthersInput}
            maxLength={maxLengths.char200}
            error={errors.leadMediaOthersInput}
          />
        </div>
      </>
    );

    // skype address
    const leadAddSkypeAddress = (
      <div>
        <label
          htmlFor="leadMediaEmailCheckbox"
          className="add-lead-label font-24-semibold mt-20 mb-0"
        >
          Skype address
        </label>
        <EditLeadSocialMediaAccount
          img={require("../../../assets/img/icons/icon-skype.svg")}
          name="leadsSkypeAddress"
          placeholder=""
          onChange={handleChange}
          value={values.leadsSkypeAddress}
          maxLength={maxLengths.char200}
          error={errors.leadsSkypeAddress}
        />
      </div>
    );

    return (
      <Modal
        open={addMoreInfoPopup}
        onClose={onCloseModal}
        closeOnEsc={true}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay customOverlay--warning_before_five_days",
          modal: "customModal lead_add_more_info_model",
          closeButton: "customCloseButton",
        }}
      >
        <span className="closeIconInModal" onClick={onCloseModal} />

        {/* logo */}
        <>
          <div className="add-lead-prev-icon" onClick={prevToAddMoreButton}>
            <img
              src={require("../../../assets/img/icons/dominate-white-prev-arrow.png")}
              alt="previous"
            />
          </div>
        </>
        <h1 className="font-30-bold mb-61">New Lead</h1>
        <div
          className="add_more_infor_lead_container"
          style={{ display: "flex" }}
        >
          <div className="add_more_info_left_section">
            {/* <div>{leadAddLocation}</div> */}
            <div>{leadSourceDropdown}</div>
            <div>{selectFewTags}</div>
            <div>{leadAddSkypeAddress}</div>
            {/* CUSTOM FIELDS SETCION */}
            {/**font-21-medium */}
            {!isEmpty(leadsCustomFields) ? (
              <h5 className="mt-5 font-30-bold row mx-0 align-items-center flex-nowrap">
                {/* <img
                  src={require("../../../../src/assets/img/accounts-new/form-circle-icon-1.svg")}
                  alt=""
                  className="leads-new-circle-block__customfileds-new-circle"
                /> */}
                Custom Fields
              </h5>
            ) : (
              ""
            )}
            {!isEmpty(leadsCustomFields) &&
              leadsCustomFields.map((data, index) => {
                if (data.type === "TEXTBOX") {
                  return (
                    <div key={index} className="mt-5">
                      {renderCustomTextbox(data)}
                    </div>
                  );
                } else {
                  return (
                    <div key={index} className="mt-5">
                      {renderCustomDropdown(data)}
                    </div>
                  );
                }
              })}
          </div>
          <div className="add_more_info_right_section">
            {/* <div>{addLeadCompany}</div> */}
            <div>{aboutInputField}</div>
            <div>{leadAddMedia}</div>
            {/* <div>{this.renderCustomTextbox()}</div> */}

            {/* <AddLeadFormShippingDetails
              // checkboxId="leadsShippingCheckbox"
              state={this.state.leadsShippingState}
              city={this.state.leadsShippingCity}
              pincode={this.state.leadsShippingPinCode}
              website={this.state.leadsShippingWebsite}
              billingValue={this.state.leadsShippingBilling}
              checkboxState={this.state.leadsShippingCheckbox}
              handleChange={this.handleChange}
              // handleCheckboxChange={this.handleCheckboxChange}
              error={errors}
            /> */}
          </div>
        </div>
        <button
          // type="submit"
          onClick={handleSubmit("saveLead")}
          onKeyDown={handleSubmitOnKeyDown}
          className="save_new_lead_button"
        >
          Save
        </button>
      </Modal>
    );
  };

  /*===============================
     Render Add Lead Form
  ================================*/

  const renderAddLeadFields = () => {
    let errors = validationErrors;
    let { prevNextIndex, allEmployees } = values;

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
        <div className="d-flex align-items-baseline">
          <div className="add-lead-input-field--countryCode">
            <div className="countryCode-fixed-plus-input-container">
              {/* <span className="font-18-regular countryCode-fixed-plus">+</span>
              <input
                type="text"
                id="leadsPhoneCountryNumber"
                name="leadsPhoneCountryNumber"
                className="add-lead-input-field font-18-regular ml-0"
                placeholder="----"
                value={values.leadsPhoneCountryNumber}
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
                type="number"
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
    // const worthAmountInputField = (
    //   <div className="mb-30">
    //     <label
    //       htmlFor="leadsWorthAmount"
    //       className="add-lead-label font-24-semibold"
    //     >
    //       Worth amount
    //     </label>
    //     <br />
    //     <div>
    //       <input
    //         type="text"
    //         pattern="[0-9]*"
    //         id="leadsWorthAmount"
    //         name="leadsWorthAmount"
    //         className="add-lead-input-field font-18-regular"
    //         placeholder="Eg. 300000"
    //         value={this.state.leadsWorthAmount}
    //         onChange={this.handleChangeNumber}
    //         autoFocus
    //         maxLength={10}
    //       />
    //       {errors.leadsWorthAmount && (
    //         <div className="is-invalid add-lead-form-field-errors">
    //           {errors.leadsWorthAmount}
    //         </div>
    //       )}
    //     </div>
    //   </div>
    // );

    // const sourceDropdown = (
    //   <div className="mb-30">
    //     <label
    //       htmlFor="leadsSource"
    //       className="add-lead-label font-24-semibold"
    //     >
    //       Leads source
    //     </label>
    //     <div className="add-lead-input-field border-0">
    //       {/* <Dropdown
    //         className="lead-status-dropDown lead-status-dropDown--importExport lead-status-dropDown--importExport--all-lead"
    //         options={leadsSourceOptions}
    //         value={this.state.leadsSourceDropdownOption}
    //         onChange={this.onSourceDropdownSelect}
    //       /> */}

    //       {/* {console.log(leadsSourceOptions)} */}
    //       <Select
    //         className="react-select-add-lead-form-container"
    //         classNamePrefix="react-select-add-lead-form"
    //         isSearchable={false}
    //         options={leadsSourceOptions}
    //         value={this.state.selectedLeadsSourceDropdownOption}
    //         onChange={(e) => this.onSourceDropdownSelect(e)}
    //         placeholder="Select"
    //       />
    //     </div>
    //   </div>
    // );

    // about field
    // const aboutInputField = (
    //   <div className="mb-30">
    //     <label htmlFor="leadsAbout" className="add-lead-label font-24-semibold">
    //       About {this.state.leadsName}
    //     </label>
    //     <br />
    //     <textarea
    //       rows="6"
    //       id="leadsAbout"
    //       name="leadsAbout"
    //       className="add-lead-input-field font-18-regular"
    //       placeholder=""
    //       value={this.state.leadsAbout}
    //       onChange={this.handleChange}
    //       autoFocus={true}
    //     />
    //   </div>
    // );

    // status and level fields
    const setStatusAndLevel = (
      <div className="mb-30">
        <label htmlFor="leadsAbout" className="add-lead-label font-24-semibold">
          Set {values.leadsName}s Level &amp; Status
        </label>
        <br />
        <div className="set_level_and_status_of_lead">
          <p>Level</p>
          <button
            onClick={onClickLevelButton("SUPER_HOT")}
            className={
              values.leadLevel === "SUPER_HOT"
                ? "select-lead-followup-by-btn select-lead-followup-by-btn--active"
                : "select-lead-followup-by-btn"
            }
          >
            <span>🌋 </span>
            {/* <img
              src={require("../../../assets/img/leads-new/status/level1.png")}
              alt="gradient"
              className="add-leads-status-img"
            />{" "} */}
            <span>Super Hot</span>
          </button>
          <button
            onClick={onClickLevelButton("HOT")}
            className={
              values.leadLevel === "HOT"
                ? "select-lead-followup-by-btn select-lead-followup-by-btn--active"
                : "select-lead-followup-by-btn"
            }
          >
            {/* <img
              src={require("../../../assets/img/leads-new/status/level2.png")}
              alt="gradient"
              className="add-leads-status-img"
            />{" "} */}
            <span>☀️ </span>
            <span>Hot</span>
          </button>
          <button
            onClick={onClickLevelButton("WARM")}
            className={
              values.leadLevel === "WARM"
                ? "select-lead-followup-by-btn select-lead-followup-by-btn--active"
                : "select-lead-followup-by-btn"
            }
          >
            {/* <img
              src={require("../../../assets/img/leads-new/status/level3.png")}
              alt="gradient"
              className="add-leads-status-img"
            />{" "} */}
            <span>☕ </span>
            <span> Warm</span>
          </button>
          <button
            onClick={onClickLevelButton("COLD")}
            className={
              values.leadLevel === "COLD"
                ? "select-lead-followup-by-btn select-lead-followup-by-btn--active"
                : "select-lead-followup-by-btn"
            }
          >
            {/* <img
              src={require("../../../assets/img/leads-new/status/level4.png")}
              alt="gradient"
              className="add-leads-status-img"
            />{" "} */}
            <span>❄️ </span>
            <span> Cold</span>
          </button>
        </div>
        <div className="set_level_and_status_of_lead set_level_and_status_of_lead--status">
          <p>Status</p>
          {!isEmpty(selectStatusDropdownOptions)
            ? selectStatusDropdownOptions.map((data, index) => {
                return (
                  <button
                    key={index}
                    onClick={onClickStatusButton(data)}
                    className={
                      values.leadStatusNew === data.value
                        ? "select-lead-followup-by-btn select-lead-followup-by-btn--active"
                        : "select-lead-followup-by-btn"
                    }
                  >
                    {/* <img
                  src={require("../../../assets/img/leads-new/status/status1.png")}
                  alt="gradient"
                  className="add-leads-status-img"
                />{" "} */}
                    <span>{data.label}</span>
                  </button>
                );
              })
            : "No stages added"}

          {/* <button
            onClick={onClickStatusButton("Qualified Lead")}
            style={{
              backgroundColor:
                values.leadStatusNew === "Qualified Lead"
                  ? "#7358FD"
                  : "#f7f7f7",
              color: values.leadStatusNew === "Qualified Lead" ? "white" : "",
              fontWeight:
                values.leadStatusNew === "Qualified Lead" ? "600" : "",
            }}
          >
            <img
              src={require("../../../assets/img/leads-new/status/status2.png")}
              alt="gradient"
              className="add-leads-status-img"
            />{" "}
            <span> Qualified Lead</span>
          </button>
          <button
            onClick={onClickStatusButton("On Hold Lead")}
            style={{
              backgroundColor:
                values.leadStatusNew === "On Hold Lead" ? "#7358FD" : "#f7f7f7",
              color: values.leadStatusNew === "On Hold Lead" ? "white" : "",
              fontWeight: values.leadStatusNew === "On Hold Lead" ? "600" : "",
            }}
          >
            <img
              src={require("../../../assets/img/leads-new/status/status3.png")}
              alt="gradient"
              className="add-leads-status-img"
            />{" "}
            <span> On Hold Lead</span>
          </button>
          <button
            onClick={onClickStatusButton("Opportunity Lead")}
            style={{
              backgroundColor:
                values.leadStatusNew === "Opportunity Lead"
                  ? "#7358FD"
                  : "#f7f7f7",
              color: values.leadStatusNew === "Opportunity Lead" ? "white" : "",
              fontWeight:
                values.leadStatusNew === "Opportunity Lead" ? "600" : "",
            }}
          >
            <img
              src={require("../../../assets/img/leads-new/status/status4.png")}
              alt="gradient"
              className="add-leads-status-img"
            />{" "}
            <span> Opportunity Lead</span>
          </button>
          <button
            onClick={onClickStatusButton("Contacted Lead")}
            style={{
              backgroundColor:
                values.leadStatusNew === "Contacted Lead"
                  ? "#7358FD"
                  : "#f7f7f7",
              color: values.leadStatusNew === "Contacted Lead" ? "white" : "",
              fontWeight:
                values.leadStatusNew === "Contacted Lead" ? "600" : "",
            }}
          >
            <img
              src={require("../../../assets/img/leads-new/status/status5.png")}
              alt="gradient"
              className="add-leads-status-img"
            />{" "}
            <span> Contacted Lead</span>
          </button>
          <button
            onClick={onClickStatusButton("Converted Lead")}
            style={{
              backgroundColor:
                values.leadStatusNew === "Converted Lead"
                  ? "#7358FD"
                  : "#f7f7f7",
              color: values.leadStatusNew === "Converted Lead" ? "white" : "",
              fontWeight: values.leadStatusNew === "Make a Call" ? "600" : "",
            }}
          >
            <img
              src={require("../../../assets/img/leads-new/status/status6.png")}
              alt="gradient"
              className="add-leads-status-img"
            />{" "}
            <span> Converted Lead</span>
          </button> */}
          {/*<Select
            className="react-select-follow-up-form-container"
            classNamePrefix="react-select-follow-up-form"
            isSearchable={false}
            options={selectStatusDropdownOptions}
            value={this.state.selectedStatusOptionDropdown}
            onChange={(e) => this.onSelectStatusDropdownSelect(e)}
            placeholder="Select"
          />*/}
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
            type="number"
            pattern="[0-9]*"
            id="leadsWorthAmount"
            name="leadsWorthAmount"
            className="add-lead-input-field font-18-regular"
            placeholder="Eg. 300000"
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

    return (
      <Fragment>
        <div className="add-lead-modal-container container-fluid pr-0 lead_page_component">
          <h1 className="font-30-bold mb-61">New Lead</h1>
          <AddLeadBlueProgressbar
            percentage={(100 / totalFormSlides) * (prevNextIndex + 0.5)}
            skipButtonFrom={6}
            prevNextIndex={prevNextIndex}
          />
          <div className="add-lead-form-field-block">
            {/* prev next arrows */}
            <div className="add-lead-arrows">
              {prevNextIndex <= 0 ? (
                ""
              ) : (
                <>
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
                <div className="add-lead-next-icon" onClick={handleNext}>
                  <img
                    src={require("../../../assets/img/icons/dominate-white-next-arrow-icon.png")}
                    alt="next"
                  />
                </div>
              )}
            </div>

            {/* form */}
            <form
              noValidate
              // onSubmit={this.handleSubmit}
              onKeyDown={onFormKeyDown}
            >
              {/* name */}
              {prevNextIndex === 0 ? (
                <AddLeadsFormField
                  htmlFor={"leadsName"}
                  type={"text"}
                  labelName={"What is your new lead's name?"}
                  id={"leadsName"}
                  name={"leadsName"}
                  placeholder={"Eg. Ian McKEllen"}
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
                <>
                  <AddLeadsFormField
                    htmlFor={"leadsEmail"}
                    type={"email"}
                    labelName={`${values.leadsName}'s email address`}
                    id={"leadsEmail"}
                    name={"leadsEmail"}
                    placeholder={"Eg. ianmckellen@hobbit.com"}
                    onChange={handleChange}
                    value={values.leadsEmail}
                    error={errors.leadsEmail}
                  />
                  <div className="text-right mt-40">
                    <button
                      className="add_more_info_lead_button add_more_info_lead_button--email"
                      onClick={handleNext}
                    >
                      Skip
                    </button>
                  </div>
                </>
              ) : (
                ""
              )}

              {/* phone number */}
              {prevNextIndex === 2
                ? //   <AddLeadsPhoneInputField handleChange={this.handleChange} />
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
                  allEmployees={!isEmpty(allEmployees) && allEmployees}
                  activeEmployee={values.activeEmployee}
                  customSelectedText="Selected"
                />
              ) : (
                ""
              )}
              {prevNextIndex === 4 && (
                <>
                  <div className="row mx-0 add-lead-accounts-outer-div justify-content-between flex-nowrap">
                    <div className="add-lead-accounts-display-div">
                      <AddMemberSelectAndDisplayList
                        selectedOptionValue={selectOption}
                        handleChangeSelectClient={handleChangeSelectClient}
                        options={values.options}
                        displayListSelected={values.displayListSelected}
                        handleRemoveMember={handleRemoveMember}
                        error={errors.displayListSelected}
                      />
                    </div>
                    <div className="add-lead-accounts-add-div">
                      <img
                        src={require("../../../assets/img/leads-new/leads-add-accounts.svg")}
                        alt="leads add accounts"
                        className="leads-add-accounts-img"
                      />
                      <h3 className="font-20-semibold leads-add-accounts-text1">
                        Didn't find the account you were <br /> looking for?
                      </h3>
                      <h5 className="font-18-regular leads-add-accounts-text2">
                        {" "}
                        Add a new account
                      </h5>
                      <div className="add_account_button_container mt-0">
                        <AddAccount isMobile={false} />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Set lead level and status */}
              {prevNextIndex === totalFormSlides && (
                <>
                  {" "}
                  <div>
                    {setStatusAndLevel}
                    {worthAmountInputField}
                  </div>{" "}
                  <div className="pt-25 text-right mb-3">
                    <button
                      className="add_more_info_lead_button"
                      onClick={handleSubmit("addMoreFields")}
                    >
                      Add more info
                    </button>
                    <button
                      // type="submit"
                      onClick={handleSubmit("saveLead")}
                      onKeyDown={handleSubmitOnKeyDown}
                      className="save_new_lead_button"
                    >
                      Save
                    </button>
                  </div>{" "}
                </>
              )}
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
    const { selectedOption, currentFollowUp } = values;
    let errors = validationErrors;
    // console.log(this.state.selectedOption);
    return (
      <Fragment>
        <div className="add-lead-modal-container add-lead-modal-container--followUp">
          <h1 className="font-21-bold mb-30">
            {/*Add Follow up for {currentFollowUp && currentFollowUp.name}*/}
            Now Let’s Schedule a follow up for{" "}
            {currentFollowUp && currentFollowUp.name}
          </h1>
          <form noValidate onSubmit={handleSaveFollowUp}>
            <div className="add-lead-form-field-block add-follow-up-main-container">
              <div className="follow-up-select mb-60">
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
                      values.accountLeadsFollowUp === "Make a Call"
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
                      values.accountLeadsFollowUp === "Email"
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
                      values.accountLeadsFollowUp === "Whatsapp"
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
                      values.accountLeadsFollowUp === "SMS"
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

              <div className="follow-up-date-time-section mb-30">
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
                    {/* datepicker */}
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
                    {/* datepicker */}
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
                    <div className="is-invalid">{errors.followUpLocation}</div>
                  )}
                </div>
              )}
            </div>
            {/* buttons */}
            <div className="pt-25 text-right row mx-0 justify-content-end">
              <div className="mr-30">
                <div
                  onClick={onCloseModal}
                  className="add_more_info_lead_button add_more_info_lead_button--email row mx-0 justify-content-center align-items-center cursor-pointer"
                >
                  Skip
                </div>
              </div>
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
    );
  };

  const classNameInMobile = isActive
    ? "font-24-bold floating-btn-options-block__link"
    : "resp-font-12-regular floating-btn-options-block__link";

  // console.log(validationErrors);

  return (
    <>
      {isMobile ? (
        <h6 className={classNameInMobile} onClick={(e) => onOpenModal(e)}>
          {/* &#43; New Leads */}
          {buttonText}
        </h6>
      ) : (
        <div className="display-inline-block">
          <button className={className} onClick={(e) => onOpenModal(e)}>
            {/* &#43; New Lead */}
            {buttonText}
          </button>
        </div>
      )}
      {/* render add more info model */}
      {renderAddMoreInfoModel()}
      <Modal
        open={open}
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
        {addFollowUpForm ? renderFolloupFields() : renderAddLeadFields()}
      </Modal>
    </>
  );
}

export default AddLeadsInPipeline;
