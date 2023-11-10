import React, { Component, Fragment } from "react";
import { CSVLink, CSVDownload } from "react-csv";
import Modal from "react-responsive-modal";
import axios from "axios";
import { url } from "./../../../store/actions/config";
import Alert from "react-s-alert";
import isEmpty from "./../../../store/validations/is-empty";
import { importProductAndServices } from "./../../../store/actions/productAndSevicesAction";
import { connect } from "react-redux";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import store from "./../../../store/store";
import { SET_LOADER, CLEAR_LOADER } from "./../../../store/types";

const csvData = `code,name,type,vendor,cost,tax,description
d2n3,web dev,SERVICE,myrl tech,2000,12,best web development company
d2n4,web development,SERVICE,myrl tech,2000,12,best web development company
d2n5,web dev,SERVICE,myrl tech,2000,12,best web development company
d2n6,web dev,SERVICE,myrl tech,2000,12,best web development company
d2n7,web dev,SERVICE,myrl tech,2000,12,best web development company
d2n8,web dev,SERVICE,myrl tech,2000,12,best web development company
d2n9,web dev,SERVICE,myrl tech,2000,12,best web development company
d2n10,web dev,SERVICE,myrl tech,2000,12,best web development company
d2n11,web dev,SERVICE,myrl tech,2000,12,best web development company
d2n12,web dev,SERVICE,myrl tech,2000,12,best web development company
d2n13,web dev,SERVICE,myrl tech,2000,12,best web development company
d2n14,web dev,SERVICE,myrl tech,2000,12,best web development company
d2n15,web dev,SERVICE,myrl tech,2000,12,best web development company
d2n16,web dev,SERVICE,myrl tech,2000,12,best web development company
d2n17,web dev,SERVICE,myrl tech,2000,12,best web development company
d2n18,web dev,SERVICE,myrl tech,2000,12,best web development company
d2n19,web dev,SERVICE,myrl tech,2000,12,best web development company
d2n20,web dev,SERVICE,myrl tech,2000,12,best web development company
d2n21,web dev,SERVICE,myrl tech,2000,12,best web development company
d2n22,web dev,SERVICE,myrl tech,2000,12,best web development company
d2n23,web dev,SERVICE,myrl tech,2000,12,best web development company
d2n24,web dev,SERVICE,myrl tech,2000,12,best web development company
d2n25,web dev,SERVICE,myrl tech,2000,12,best web development company
d2n26,web dev,SERVICE,myrl tech,2000,12,best web development company
d2n27,web dev,SERVICE,myrl tech,2000,12,best web development company`;

export class ImportProductOrService extends Component {
  constructor() {
    super();
    this.state = {
      contactImportModel: false,
      fileName: "",
    };
  }

  /*==========================================================
                        Handlers
  ============================================================*/

  callBackImportProductOrServices = (status) => {
    if (status === 200) {
      store.dispatch({
        type: CLEAR_LOADER,
      });
      this.setState({
        contactImportModel: false,
      });
    }
  };

  finalImportHandler = () => {
    const { fileName, fileData } = this.state;
    if (!isEmpty(fileName)) {
      store.dispatch({
        type: SET_LOADER,
      });
      setTimeout(() => {
        this.props.importProductAndServices(
          fileData,
          this.callBackImportProductOrServices
        );
      }, 5000);
    } else {
      Alert.success(`<h4>Please upload csv file</h4>`, {
        position: "top-right",
        effect: "slide",
        beep: false,
        html: true,
        timeout: 5000,
        // offset: 100
      });
    }
  };

  importContactHandler = () => {
    this.setState({
      contactImportModel: true,
    });
  };

  onCloseHandler = () => {
    this.setState({
      contactImportModel: false,
    });
  };

  /*========================================================
                    File Upload Section
  ==========================================================*/

  onFileUpload = async (e) => {
    try {
      const file = e.target.files[0];
      const fileName = e.target.files[0].name;
      var ext = fileName.match(/\.([^\.]+)$/)[1];
      if (ext === "xlsx" || ext === "csv" || ext === "xls") {
        let formData = new FormData();
        formData.append("file", file);
        let file_path = URL.createObjectURL(e.target.files[0]);
        // let { data } = await axios.post(`${url}/api/upload`, formData, {
        //   headers: { "Content-Type": "multipart/form-data" },
        // });
        // if (data) {
        this.setState({
          fileName: fileName,
          // fileNameonServer: data.systemFileName,
          file_path: file_path,
          file: file,
          fileData: formData,
        });
        // }
      } else {
        window.alert("Only excel format .xlsx and .csv are supported");
      }
    } catch (err) {
      window.alert("Unable to upload file");
    }
  };

  FileUploadSection = () => {
    return (
      <div className="file_upload_section">
        <div className="file_image">
          <i className="fa fa-upload" aria-hidden="true"></i>
        </div>
        <div className="text_file text-center">
          {this.state.fileName
            ? this.state.fileName
            : "Choose a .csv or .xlsx file to upload"}
        </div>
        <div className="upload_button">
          <label className="btn-file button_css">
            {this.state.fileName ? "Change File" : "Upload File"}
            <input
              type="file"
              onChange={this.onFileUpload}
              style={{ display: "none" }}
            />
          </label>
        </div>
        <div className="file-upload-section__note">
          We will automaticatlly remove the duplicate entries with Primary field
          called "email"
        </div>
      </div>
    );
  };

  render() {
    return (
      <Fragment>
        <button
          onClick={this.importContactHandler}
          className="leads-title-block-btn-red-bg leads-title-block-btn-red-bg--products-and-services-bulk-import"
        >
          <img
            src={require("../../../assets/img/products-and-services/products-bulk-import-icon.svg")}
            alt=""
            className="products-bulk-import-icon-img"
          />
          Bulk Import
        </button>

        <Modal
          open={this.state.contactImportModel}
          onClose={this.onCloseHandler}
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

          <div className="import_contacts text-center">
            <h1 className="font-30-bold">Import Product And Services</h1>
            <div className="modal_one_main_container">
              <div className="file_section">{this.FileUploadSection()}</div>
            </div>
            <CSVLink data={csvData} filename={"dominate-product-format.csv"}>
              <button className="contact_import_sample_btn">
                Download Sample
              </button>
            </CSVLink>
            <button
              onClick={this.finalImportHandler}
              className="contact_import_btn"
            >
              Process Data
            </button>
          </div>
        </Modal>
      </Fragment>
    );
  }
}

export default connect(null, { importProductAndServices })(
  ImportProductOrService
);
