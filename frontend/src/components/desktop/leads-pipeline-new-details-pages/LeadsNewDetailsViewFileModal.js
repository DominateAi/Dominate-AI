import React, { useState, useEffect, Fragment } from "react";
import Modal from "react-responsive-modal";
import "../common/CustomModalStyle.css";
import isEmpty from "../../../store/validations/is-empty";
import { connect } from "react-redux";
import { updateLogById } from "./../../../store/actions/leadsActivityAction";
import { useDispatch, useSelector } from "react-redux";

const dummyData = [1, 2, 3];

function LeadsNewDetailsViewFileModal({ logData }) {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    open: false,
    logData: [],
  });

  const leadActivitySummary = useSelector(
    (state) => state.leads.leadActivitySummary
  );

  useEffect(() => {
    if (!isEmpty(logData)) {
      setValues({
        ...values,
        logData: logData,
      });
    }
  }, [logData]);

  /*===============================
      Model Open Handlers
  =================================*/

  const onOpenModal = () => {
    setValues({
      ...values,
      open: true,
    });
  };

  const onCloseModal = () => {
    setValues({
      ...values,
      open: false,
    });
  };

  const updateLogCallback = (status) => {
    if (status === 200) {
      setValues({
        ...values,
        logData: this.state.newData,
      });
    }
  };

  const handleOnClickDelete = (file) => (e) => {
    const { logData } = values;
    let formData = logData;
    const index = formData.files.indexOf(file);
    if (index > -1) {
      formData.files.splice(index, 1);
    }
    console.log(formData);
    setValues({
      ...values,
      newData: formData,
    });

    dispatch(
      updateLogById(
        formData._id,
        formData,
        leadActivitySummary._id,
        updateLogCallback
      )
    );
    // console.log("clicked on delete");
  };

  const handleOnClickDownload = (fileData) => (e) => {
    var userData = JSON.parse(localStorage.getItem("Data"));
    // console.log("clicked on download");

    var a = document.createElement("A");
    a.href = `https://login.dominate.ai/public/download?filename=${fileData}&token=${userData.token}`;
    a.target = "_blank";
    a.download = "save.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Fragment>
      {/* link */}
      <button
        className="leads-new-inner-page-profile-row__colm2-btn"
        onClick={onOpenModal}
      >
        <img
          src={require("../../../../src/assets/img/leads-new/view-files.svg")}
          alt=""
        />
        <span className="font-15-bold">view files</span>
      </button>

      {/* content */}
      <Modal
        open={values.open}
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
        <h1 className="font-30-bold mb-61  ml-30">View Files</h1>

        <div className="leads-new-details-activity-view-files__block">
          {!isEmpty(logData.files)
            ? logData.files.map((file, index) => (
                <div
                  key={index}
                  className="row mx-0 align-items-center leads-new-details-activity-view-files__row"
                >
                  <div className="leads-new-details-activity-view-files__fileNameBlock">
                    <h3 className="font-18-semibold">{file}</h3>
                  </div>
                  <i
                    className="fa fa-trash mr-30 cursor-pointer"
                    onClick={handleOnClickDelete(file)}
                  ></i>
                  <p
                    className="mb-0 cursor-pointer"
                    onClick={handleOnClickDownload(file)}
                  >
                    <i className="fa fa-download"></i>
                    <span className="font-12-bold">Download file</span>
                  </p>
                </div>
              ))
            : "No files found"}
        </div>
      </Modal>
    </Fragment>
  );
}

export default LeadsNewDetailsViewFileModal;
