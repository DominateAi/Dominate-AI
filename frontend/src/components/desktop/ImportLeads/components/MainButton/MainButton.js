import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import axios from "axios";
import { url } from "../../../../../store/actions/config";
import Modal from "react-responsive-modal";
import "../../../common/CustomModalStyle.css";
import ModalOne from "../ReusableComponents/ModalOne";
import ModelTwo from "../ReusableComponents/ModelTwo";
import ModelThree from "../ReusableComponents/ModelThree";
import { getAllEmployeesWithAdmin } from "../../../../../store/actions/employeeAction";
import XLSX from "xlsx";
import store from "../../../../../store/store";
import {
  SET_FILE_KEYS,
  SET_JSON_FILE,
  SET_STANDERED_FIELDS,
} from "../../store/type";
import {
  jsonImport,
  checkFieldsAction,
  importLeadsFromCsv,
  overwriteExistingLeadsAction,
  notOverwriteExistingLeadsAction,
  importJsonLeads,
} from "../../store/actions/fileUploadAction";
import isEmpty from "../../../../../store/validations/is-empty";
import { CSVLink, CSVDownload } from "react-csv";
import Alert from "react-s-alert";
import PreviewImportLeads from "./../ReusableComponents/PreviewImportLeads";
const csv = require("csvtojson");

const csvData = `name,account_id,email,phoneCode,phone,status,assigned,additionalInfo,worth,source,closingDate,convertedDate,profileImage,about,degree
Akshay,59d5efd0-f989-11ea-b283-89e1bc70434d,prasad00@gmail.com,91,7507354603,NEW_LEAD,91d6cb40-f649-11ea-9d5f-afa78f8a5515,{'sdsd':'sdsd'},20000,facebook,2019-04-14T16:30:50.526Z,2019-04-14T16:30:50.526Z,https://xyz.com,hello,HOT
Akshay,59d5efd0-f989-11ea-b283-89e1bc70434d,prasad0000@gmail.com,91,7507354603,NEW_LEAD,91d6cb40-f649-11ea-9d5f-afa78f8a5515,{'sdsd':'sdsd'},20000,facebook,2019-04-14T16:30:50.526Z,2019-04-14T16:30:50.526Z,https://xyz.com,hello,HOT
Akshay,59d5efd0-f989-11ea-b283-89e1bc70434d,prasaduew@gmail.com,91,7507354603,NEW_LEAD,91d6cb40-f649-11ea-9d5f-afa78f8a5515,{'sdsd':'sdsd'},20000,facebook,2019-04-14T16:30:50.526Z,2019-04-14T16:30:50.526Z,https://xyz.com,hello,HOT
Akshay,59d5efd0-f989-11ea-b283-89e1bc70434d,prasaylew@gmail.com,91,7507354603,NEW_LEAD,91d6cb40-f649-11ea-9d5f-afa78f8a5515,{'sdsd':'sdsd'},20000,facebook,2019-04-14T16:30:50.526Z,2019-04-14T16:30:50.526Z,https://xyz.com,hello,HOT
`;

let componentUpdateCount = 0;
export class MainButton extends Component {
  constructor() {
    super();
    this.state = {
      openModal: false,
      openId: 1,
      fileNameonServer: "",
      fileName: "",
      dateformat: "",
      operation: "",
      operationOptions_ReactDropdown: [
        // { value: "CREATE", label: "Create New entry" },
        {
          value: "UPDATE_WITHOUT_OVERWRITE",
          label: "Create New and update existing leads( without overwrite )",
        },
        {
          value: "UPDATE_AND_OVERWRITE",
          label: "Create New and update existing leads( with overwrite )",
        },
      ],
      phone_format: "",
      assigned: "",
      assignedOptions_ReactDropdown: [],
      fileHeads: [],
      file: {},
      mappingData: {},
      mappingDataOptions_ReactDropdown: [],
      selectFileType: false,
      previewImport: false,
    };
  }

  componentDidMount() {
    this.props.getAllEmployeesWithAdmin({ query: {} });
  }

  componentDidUpdate() {
    let obj = {};
    if (!isEmpty(this.props.employee.allEmployees)) {
      componentUpdateCount += 1;
    }
    if (
      componentUpdateCount === 1 &&
      !isEmpty(this.props.employee.allEmployees)
    ) {
      this.props.employee.allEmployees.map((data, index) => {
        obj = {
          value: JSON.stringify(data),
          label: `${data.firstName} ${data.lastName}`,
        };
        this.state.assignedOptions_ReactDropdown.push(obj);
      });
    }
  }

  componentWillUnmount() {
    componentUpdateCount = 0;
  }

  resetState = (e) => {
    this.setState({
      openModal: false,
      openId: 1,
      fileNameonServer: "",
      fileName: "",
      dateformat: "",
      operation: "",
      phone_format: "",
      assigned: "",
      fileHeads: [],
      file: {},
      mappingData: {},
      mappingDataOptions_ReactDropdown: [],
    });
  };

  onModalToggler = (value) => (e) => {
    if (value === false) {
      this.resetState();
    }
    this.setState({ selectFileType: value });
  };

  changeModalIdHandler = (value) => (e) => {
    if (value === 2) {
      if (
        this.state.fileNameonServer == "" ||
        this.state.fileName == "" ||
        this.state.dateformat == "" ||
        this.state.operation == ""
        // ||
        // this.state.phone_format == ""
      ) {
        window.alert("Please upload file or select all configurations");
      } else {
        this.onPressNext();
        this.setState({ openId: value });
      }
    } else if (value === 3) {
      // this.onDataProcessing();
      // this.setState({ openId: 2 });
      this.setState({
        previewImport: true,
      });
    } else {
      this.setState({ openId: value });
    }
  };

  onChangeHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onChangeHandlerSelectDateFormat = (e) => {
    this.setState({
      dateformat: e.value,
    });
  };

  onChangeHandlerSelectOperation = (e) => {
    let arrOfDataValue = this.state.operationOptions_ReactDropdown.filter(
      (a) => a.value === e.value
    );
    // console.log(arrOfDataValue[0].value);
    this.setState({
      operation: arrOfDataValue[0].value,
    });
  };

  onChangeHandlerSelectPhoneFormat = (e) => {
    if (e.value === "+91-98765xxxxx") {
      this.setState({
        phone_format: "-",
      });
    } else if (e.value === "+91 98765xxxxx") {
      this.setState({
        phone_format: "space",
      });
    }
  };

  onChangeHandlerSelectAssigned = (e) => {
    let arrOfDataValue = this.state.assignedOptions_ReactDropdown.filter(
      (a) => a.value === e.value
    );
    this.setState({
      assigned: arrOfDataValue[0].value,
    });
  };

  onPressNext = (e) => {
    var reader = new FileReader();
    reader.onload = function (e) {
      var data = new Uint8Array(e.target.result);
      var workbook = XLSX.read(data, { type: "array" });
      var worksheet = workbook.Sheets[workbook.SheetNames[0]];
      var x = XLSX.utils.sheet_to_json(worksheet);
      store.dispatch({
        type: SET_JSON_FILE,
        payload: x,
      });
      store.dispatch({
        type: SET_FILE_KEYS,
        payload: Object.keys(x[0]),
      });
    };
    reader.readAsArrayBuffer(this.state.file);
  };

  onFileUpload = async (e) => {
    try {
      const file = e.target.files[0];

      const fileName = e.target.files[0].name;
      var ext = fileName.match(/\.([^\.]+)$/)[1];
      // if (ext === "xlsx" || ext === "csv" || ext === "xls")
      console.log(file);
      if (ext === "csv") {
        if (file.size !== 0) {
          let formData = new FormData();
          formData.append("file", file);
          let file_path = URL.createObjectURL(e.target.files[0]);
          // let { data } = await axios.post(`${url}/api/upload`, formData, {
          //   headers: { "Content-Type": "multipart/form-data" },
          // });
          // if (data) {
          if (this.state.csvFileDataFormatType === "custom") {
            this.props.checkFieldsAction(formData, this.callBackCheckFields);
          } else {
            // this.props.importLeadsFromCsv(formData, this.callBackLeadsImport);
            this.readFileContent(file);
          }
          this.setState({
            fileName: fileName,
            // fileNameonServer: data.systemFileName,
            file_path: file_path,
            file: file,
            selectFileType: false,
            fileFormData: formData,
          });
          // }
        } else {
          window.alert("Uploaded file is empty");
        }
      } else {
        window.alert("Only .csv are supported");
      }
    } catch (err) {
      window.alert("Unable to upload file");
    }
  };

  importLeadsFinal = () => {
    const { fileFormData, csvFileDataFormatType } = this.state;
    if (csvFileDataFormatType === "custom") {
      this.onDataProcessing();
    } else {
      this.props.importLeadsFromCsv(fileFormData, this.callBackLeadsImport);
    }
  };

  onCloseHanlder = () => {
    this.setState({
      previewImport: false,
    });
  };

  backHandler = () => {
    this.setState({
      selectFileType: true,
      openModal: false,
    });
  };

  readFileContent(file) {
    const { csvFileDataFormatType } = this.state;
    const reader = new FileReader();
    reader.onload = (event) => {
      csv({
        noheader: true,
        output: "json",
      })
        .fromString(event.target.result)
        .then((csvRows) => {
          const toJson = [];
          csvRows.forEach((aCsvRow, i) => {
            if (i !== 0) {
              const builtObject = {};

              Object.keys(aCsvRow).forEach((aKey) => {
                const valueToAddInBuiltObject = aCsvRow[aKey];
                const keyToAddInBuiltObject = csvRows[0][aKey];
                builtObject[keyToAddInBuiltObject] = valueToAddInBuiltObject;
              });

              toJson.push(builtObject);
            }
          });
          store.dispatch({
            type: SET_JSON_FILE,
            payload: toJson,
          });
        });
    };
    this.setState({
      previewImport: true,
    });

    reader.readAsText(file);
  }

  mappingOnChangeHandler = (key) => (e) => {
    let mappingData = this.state.mappingData;

    const value = e.value;
    // console.log(value, key);

    // for react dropdown
    const indexOfDataLabel = !isEmpty(
      this.state.mappingDataOptions_ReactDropdown
    )
      ? this.state.mappingDataOptions_ReactDropdown.findIndex(
          (a) => a.key === key
        )
      : -1;
    let arrOfDataLabel = [...this.state.mappingDataOptions_ReactDropdown];

    // console.log(arrOfDataLabel);

    // main mappingData
    if (value.includes(".")) {
      let splitValue = value.split(".");
      let mainObj = splitValue[0];
      let secObj = splitValue[1];
      if (secObj == "additionalInfo") {
        if (mappingData.additionalInfo == undefined) {
          let additionalInfo = {};
          additionalInfo[key] = key;
          mappingData.additionalInfo = additionalInfo;
        } else {
          mappingData["additionalInfo"][key] = key;
        }
      } else {
        if (mappingData[mainObj] == undefined) {
          let data = {};
          data[secObj] = key;
          mappingData[mainObj] = data;
        } else {
          mappingData[mainObj][secObj] = key;
        }
      }
    } else if (value === "combineName") {
      if (mappingData[value] == undefined) {
        let combineName = [];
        combineName.push(key);
        mappingData.combineName = combineName;
      } else {
        mappingData.combineName.push(key);
      }
    } else {
      mappingData[e.value] = key;
    }

    // for react dropdown
    if (indexOfDataLabel > -1) {
      arrOfDataLabel[indexOfDataLabel] = {
        ...arrOfDataLabel[indexOfDataLabel],
        label: e.label,
      };
    } else {
      arrOfDataLabel.push({ key: key, label: e.label });
    }

    console.log(mappingData, arrOfDataLabel);

    this.setState({
      mappingData: mappingData,
      mappingDataOptions_ReactDropdown: arrOfDataLabel,
    });
  };

  onDataProcessing = (e) => {
    const json_data = this.props.importLeads.import_lead.json_data;
    console.log(json_data);
    const mappingData = this.state.mappingData;
    console.log(mappingData);
    let formData = [];
    // const assigned_user = JSON.parse(this.state.assigned);
    // console.log(assigned_user);

    json_data.forEach((element) => {
      let data = {};
      data.name = element[mappingData.name];
      data.email = element[mappingData.email];
      data.worth = element[mappingData.worth];
      data.tags = element[mappingData.tags] ? element[mappingData.tags] : [];
      data.status = element[mappingData.status]
        ? element[mappingData.status]
        : "NEW_LEAD";
      data.source = element[mappingData.source]
        ? element[mappingData.source]
        : "";
      data.profileImage = element[mappingData.profileImage];
      data.phoneCode = element[mappingData.phoneCode].toString();
      data.phone = element[mappingData.phone].toString();
      data.media = element[mappingData.media];
      data.lastModifiedBy = element[mappingData.lastModifiedBy];
      data.isKanban = element[mappingData.isKanban]
        ? element[mappingData.isKanban]
        : false;
      data.isHidden = element[mappingData.isHidden]
        ? element[mappingData.isHidden]
        : false;
      data.degree = element[mappingData.degree]
        ? element[mappingData.degree]
        : "COLD";
      data.createdBy = this.props.auth.user.email;
      data.convertedDate = element[mappingData.convertedDate];
      data.assigned = this.props.auth.user.id;
      data.additionalInfo = element[mappingData.additionalInfo];
      data.account_id = element[mappingData.account_id]
        ? element[mappingData.account_id]
        : "0123456789";
      data.about = element[mappingData.about] ? element[mappingData.about] : "";
      formData.push(data);
    });

    console.log(formData);

    // let data = [
    //   {
    //     name: "akhil",
    //     email: "akhilABCD@gmail.com",
    //     account_id: "0123456789",
    //     phone: "47832902",
    //     phoneCode: "231",
    //     status: "NEW_LEAD",
    //     degree: "COLD",
    //     additionalInfo: "hello",
    //   },
    // ];

    this.props.importJsonLeads(formData, this.callBackImportJson);

    // const items = formData;
    // const replacer = (key, value) => (value === null ? "" : value); // specify how you want to handle null values here
    // const header = Object.keys(items[0]);
    // let csv = items.map((row) =>
    //   header
    //     .map((fieldName) => JSON.stringify(row[fieldName], replacer))
    //     .join(",")
    // );
    // csv.unshift(header.join(","));
    // csv = csv.join("\r\n");

    // console.log(csv);

    // json_data.forEach((element) => {
    //   let data = {};
    //   let name = "";
    //   if (mappingData.combineName !== undefined) {
    //     mappingData.combineName.forEach((elem) => {
    //       name = name + "" + element[elem];
    //     });
    //   } else {
    //     name = element[mappingData.name];
    //   }
    //   console.log(element);
    //   data.name = name.trim();
    //   data.company = element[mappingData.company]
    //     ? element[mappingData.company]
    //     : "";
    //   data.email = element[mappingData.email];
    //   data.phone = element[mappingData.phone] ? element[mappingData.phone] : "";
    //   // data.country = element[mappingData.phone]
    //   //   ? element[mappingData.phone].split(this.state.phone_format)[0]
    //   //   : "+1";
    //   data.status = "NEW_LEAD";
    //   data.degree = "COLD";
    //   data.isHidden = false;
    //   data.isKanban = false;
    //   data.assigned = assigned_user._id;
    //   // data.billingAddress = element[mappingData.billingAddress]
    //   //   ? element[mappingData.billingAddress]
    //   //   : "";
    //   data.worth = element[mappingData.worth] ? element[mappingData.worth] : "";
    //   data.source = element[mappingData.source]
    //     ? element[mappingData.source]
    //     : "";
    //   data.createdBy = this.props.auth.user.email;
    //   data.lastModifiedBy = this.props.auth.user.email;
    //   // if (mappingData.shipping !== undefined) {
    //   //   let shipping = {};
    //   //   Object.keys(mappingData.shipping).forEach((elem) => {
    //   //     shipping[elem] = mappingData.shipping[elem];
    //   //   });
    //   //   data.shipping = shipping;
    //   //   data.shipping.countryCode = "+1";
    //   // } else {
    //   //   data.shipping = { countryCode: "+1" };
    //   // }
    //   if (mappingData.media !== undefined) {
    //     let media = {};
    //     Object.keys(mappingData.media).forEach((elem) => {
    //       media[elem] = mappingData.media[elem];
    //     });
    //     data.media = media;
    //   }
    //   // if (mappingData.additionalInfo !== undefined) {
    //   //   let additionalInfo = {};
    //   //   Object.keys(mappingData.additionalInfo).forEach((elem) => {
    //   //     let user_elem = elem.replace(/ +/g, "");
    //   //     additionalInfo[user_elem] = mappingData.additionalInfo[elem];
    //   //   });
    //   //   data.additionalInfo = JSON.stringify(additionalInfo);
    //   // }
    //   console.log(data);
    //   formData.push(data);
    // });
    // let operation = this.state.operation;
    // console.log(operation);
    // this.props.jsonImport({ leads: json_data, options: operation });
    // console.log(formData);
  };

  localProps = {
    onFileUpload: this.onFileUpload,
    onChangeHandler: this.onChangeHandler,
    onChangeHandlerSelectOperation: this.onChangeHandlerSelectOperation,
    onChangeHandlerSelectDateFormat: this.onChangeHandlerSelectDateFormat,
    onChangeHandlerSelectPhoneFormat: this.onChangeHandlerSelectPhoneFormat,
    onChangeHandlerSelectAssigned: this.onChangeHandlerSelectAssigned,
    changeModalIdHandler: this.changeModalIdHandler,
    mappingOnChangeHandler: this.mappingOnChangeHandler,
    backHandler: this.backHandler,
  };

  /*=======================================================================
                    Render file type select option
  ========================================================================*/

  onCloseHandler = () => {
    this.setState({
      selectFileType: false,
    });
  };

  callBackCheckFields = (data) => {
    if (data) {
      console.log(data);
      var reader = new FileReader();
      reader.onload = function (e) {
        var data = new Uint8Array(e.target.result);
        var workbook = XLSX.read(data, { type: "array" });
        var worksheet = workbook.Sheets[workbook.SheetNames[0]];
        var x = XLSX.utils.sheet_to_json(worksheet);
        store.dispatch({
          type: SET_JSON_FILE,
          payload: x,
        });
      };
      reader.readAsArrayBuffer(this.state.file);
      store.dispatch({
        type: SET_FILE_KEYS,
        payload: data.userFields,
      });

      store.dispatch({
        type: SET_STANDERED_FIELDS,
        payload: data.standardFields,
      });
      this.setState({
        selectFileType: false,
        openId: 2,
      });
    }
  };

  callBackLeadsImport = (data) => {
    console.log(data);
    if (!isEmpty(data.existing_leads)) {
      this.setState({
        previewImport: false,
        selectFileType: false,
        openId: 3,
        existingLeads: data.existing_leads,
      });
    } else {
      this.setState({
        openModal: false,
        openId: 1,
        previewImport: false,
      });
      Alert.success(`<h4>Leads imported successfully</h4>`, {
        position: "top-right",
        effect: "slide",
        beep: false,
        html: true,
        timeout: 5000,
        // offset: 100
      });
    }
  };

  selectFileTypeHandler = (type) => (e) => {
    this.setState({
      selectFileType: false,
    });
    if (type === "custom") {
      this.setState({
        csvFileDataFormatType: type,
        openModal: true,
      });
      console.log("call check fields api");
      // this.props.checkFieldsAction(
      //   this.state.fileData,
      //   this.callBackCheckFields
      // );
    } else {
      this.setState({
        csvFileDataFormatType: type,
        openModal: true,
      });
      // this.props.importLeadsFromCsv(
      //   this.state.fileData,
      //   this.callBackLeadsImport
      // );
      console.log("call import lead api");
    }
  };

  callBackImportExistingLeads = (status) => {
    if (status === 200) {
      this.resetState();
      this.setState({
        openModal: false,
      });
    }
  };

  updateExistingLeads = (e) => {
    const { operation, existingLeads } = this.state;
    if (operation === "UPDATE_WITHOUT_OVERWRITE") {
      this.props.notOverwriteExistingLeadsAction(
        existingLeads,
        this.callBackImportExistingLeads
      );
    } else {
      this.props.overwriteExistingLeadsAction(
        existingLeads,
        this.callBackImportExistingLeads
      );
    }
  };

  callBackImportJson = (status) => {
    if (status === 200) {
      this.setState({
        openModal: false,
        openId: 1,
        previewImport: false,
      });
    }
  };

  renderSelectFileFieldsOptions = () => {
    return (
      <Modal
        open={this.state.selectFileType}
        onClose={this.onModalToggler(false)}
        closeOnEsc={true}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay",
          modal: "customModal customModal--importLeads-select-filetype",
          closeButton: "customCloseButton",
        }}
      >
        <span className="closeIconInModal" onClick={this.onCloseHandler} />
        <div className="import_leads_select_filetype">
          <h1 className="font-30-bold">Import Lead</h1>
          <p className="import_leads_select_filetype--steps-title-text">
            Steps for easy import of leads
          </p>
          <div className="select_file_type_bottons">
            {/** block one */}
            <div
              //style={{
              //  border: "1px solid",
              //  padding: "10px",
              //  marginBottom: "10px",
              //}}
              className="import_leads_select_filetype_block_one"
            >
              <h3 className="font-24-bold import_leads_select_filetype_block_one-text1">
                <span> 01.</span> Download the sample CSV{" "}
              </h3>
              <p className="font-18-semibold import_leads_select_filetype_block_one-text2">
                file to organise your leads
              </p>
              <div className="text-center">
                <img
                  src={require("./../../../../../assets/img/leads-new/sample-ccv.svg")}
                  alt="import to leads sample ccv"
                  className="import-to-leads-sample-ccv-img"
                />
              </div>
              <CSVLink data={csvData} filename={"dominate-leads-format.csv"}>
                <button>Download Sample CSV</button>
              </CSVLink>{" "}
            </div>
            {/** block two */}
            <div
              //style={{
              //  border: "1px solid",
              //  padding: "10px",
              //  marginBottom: "10px",
              //}}
              className="import_leads_select_filetype_block_one import_leads_select_filetype_block_one--two"
            >
              <h3 className="font-24-bold import_leads_select_filetype_block_one-text1">
                <span>02.</span> Arrange your Data
              </h3>
              <p className="font-18-semibold import_leads_select_filetype_block_one-text2">
                based on the downloaded sample file
              </p>
              <img
                src={require("./../../../../../assets/img/leads-new/arrange-your-data.svg")}
                alt="import to leads arrange your data"
                className="import-to-leads-arrange-your-data-img"
              />
            </div>
            {/** block three */}
            <div
              //style={{
              //  border: "1px solid",
              //  padding: "10px",
              //  marginBottom: "10px",
              //}}
              className="import_leads_select_filetype_block_one import_leads_select_filetype_block_one--two"
            >
              <h3 className="font-24-bold import_leads_select_filetype_block_one-text1">
                <span> 03.</span> Import
              </h3>
              <p className="font-18-semibold import_leads_select_filetype_block_one-text2">
                your arranged data
              </p>
              <div className="text-center">
                <img
                  src={require("./../../../../../assets/img/leads-new/import-leads-import.svg")}
                  alt="import leads import"
                  className="import-leads-import-img"
                />
              </div>
              <button
                onClick={this.selectFileTypeHandler("standered")}
                className="standerd_file_button"
              >
                Upload Arranged CSV
              </button>
            </div>

            <div className="row mx-0 align-items-center justify-content-between">
              <div className="text-left">
                <p className="font-18-semibold import_leads_select_filetype_block_one-text3">
                  Having Trouble matching your data?{" "}
                </p>
                <p className="font-18-regular import_leads_select_filetype_block_one-text4">
                  Feel Free to upload a custom file and we will automatically
                  figure it out
                </p>
              </div>
              <button
                onClick={this.selectFileTypeHandler("custom")}
                className="custom_file_button"
              >
                {/*Custom file*/}Upload Custom File
              </button>
            </div>
            {/* <h2>Select File Type</h2> */}
            {/* <div className="import_file_img_section">
              <div className="img_div">
                <img
                  onClick={this.selectFileTypeHandler("custom")}
                  src={require("./../../../../../assets/img/import/import2.svg")}
                  alt=""
                />
                <p>Custom File</p>
              </div>
              <div className="img_div">
                <img
                  onClick={this.selectFileTypeHandler("standered")}
                  src={require("./../../../../../assets/img/import/import1.svg")}
                  alt=""
                />
                <p>Standard File</p>
              </div>
            </div> */}
            {/* <span>Want to know how what format Dominate Prefers</span>
            <br></br>
            <CSVLink data={csvData} filename={"dominate-leads-format.csv"}>
              <button>Download Sample</button>
            </CSVLink> */}

            {/* <button
              onClick={this.selectFileTypeHandler("custom")}
              className="custom_file_button"
            >
              Custom file
            </button>
            <button
              onClick={this.selectFileTypeHandler("standered")}
              className="standerd_file_button"
            >
              Standered file
            </button> */}
          </div>
        </div>
      </Modal>
    );
  };

  render() {
    this.localProps.state = this.state;
    const { openId, previewImport } = this.state;
    // console.log(this.state);
    return (
      <>
        <PreviewImportLeads
          previewImport={previewImport}
          importHandler={this.importLeadsFinal}
          onCloseHandler={this.onCloseHanlder}
        />
        {this.renderSelectFileFieldsOptions()}
        <button
          className="create_email_template_button create_email_template_button--importLeads"
          onClick={this.onModalToggler(true)}
        >
          Import Leads
        </button>
        <Modal
          open={this.state.openModal}
          onClose={this.onModalToggler(false)}
          closeOnEsc={true}
          closeOnOverlayClick={false}
          center
          classNames={{
            overlay: "customOverlay",
            modal:
              openId === 2 || openId === 3
                ? "customModal customModal--importLeads"
                : "customModal customModal--importLeadsFileUpload",
            closeButton: "customCloseButton",
          }}
        >
          <span
            className="closeIconInModal"
            onClick={this.onModalToggler(false)}
          />
          <div className="import-leads-modal-content">
            <h1 className="font-30-bold modal_headline">Import Leads</h1>
            {this.state.openId === 1 ? (
              <ModalOne {...this.props} {...this.localProps} />
            ) : null}
            {this.state.openId === 2 ? (
              <ModelTwo {...this.props} {...this.localProps} />
            ) : null}
            {this.state.openId === 3 ? (
              <ModelThree
                {...this.props}
                {...this.localProps}
                updateExistingLeads={this.updateExistingLeads}
              />
            ) : null}
          </div>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  employee: state.employee,
  importLeads: state.importLeads,
  auth: state.auth,
});

export default connect(mapStateToProps, {
  getAllEmployeesWithAdmin,
  jsonImport,
  checkFieldsAction,
  importLeadsFromCsv,
  overwriteExistingLeadsAction,
  notOverwriteExistingLeadsAction,
  importJsonLeads,
})(withRouter(MainButton));
