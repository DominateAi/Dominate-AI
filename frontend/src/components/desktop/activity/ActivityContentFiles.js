import React, { useState, useEffect } from "react";
import ActivityContentFilesModal from "./ActivityContentFilesModal";
import { connect } from "react-redux";
import { deleteLeadFile } from "./../../../store/actions/leadsActivityAction";
import isEmpty from "./../../../store/validations/is-empty";
import displaySmallText from "./../../../store/utils/sliceString";
import { useDispatch, useSelector } from "react-redux";

function ActivityContentFiles({ leadActivityData }) {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    leadSearch: "",
    searchBlockStyle: "",
    allFiles: "",
  });

  const allFiles = useSelector((state) => state.leads.allFiles);

  useEffect(() => {
    if (!isEmpty(allFiles)) {
      setValues({
        ...values,
        allFiles: allFiles,
      });
    } else {
      setValues({
        ...values,
        allFiles: [],
      });
    }
  }, [allFiles]);

  /*=====================================
        handlers
    ===================================== */

  const handleOnChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearchClick = () => {
    setValues({
      ...values,
      searchBlockStyle: "searchBlockStyle",
    });
  };

  const handleOnClickDelete = (fileId) => (e) => {
    console.log("clicked on delete icon");
    dispatch(deleteLeadFile(fileId, leadActivityData._id));
  };

  const handleOnSubmitSearch = (e) => {
    e.preventDefault();
    // alert(this.state.leadSearch);
    setValues({
      ...values,
      searchBlockStyle: "",
    });
  };

  const onClickOnCardHandler = (fileUrl) => (e) => {
    let dataToken = JSON.parse(localStorage.getItem("Data"));
    window.open(`${fileUrl}&token=${dataToken.token}`, "_blank");
  };

  /*=====================================
        render search
    ===================================== */
  const renderSearch = () => {
    return (
      <div className="lead-search-block mr-30">
        <form onSubmit={handleOnSubmitSearch}>
          <input
            type="text"
            name="leadSearch"
            /* className={`add-lead-input-field font-18-regular add-lead-input-field--lead-search ${this.state.searchBlockStyle}`} */
            className="add-lead-input-field font-18-regular add-lead-input-field--lead-search searchBlockStyle"
            placeholder=""
            onChange={handleOnChange}
            onClick={handleSearchClick}
            value={values.leadSearch}
          />
          <img
            src="/img/desktop-dark-ui/icons/search-icon.svg"
            alt="search"
            className="lead-search-block__icon"
            onClick={handleOnSubmitSearch}
          />
        </form>
      </div>
    );
  };

  /*=====================================
        render card
    ===================================== */
  const renderCard = () => {
    const { allFiles } = values;

    let filtereddata = [];
    if (!isEmpty(values.leadSearch)) {
      let search = new RegExp(values.leadSearch, "i");
      filtereddata = allFiles.filter((getall) => {
        if (search.test(getall.originalName)) {
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
      filtereddata = allFiles;
    }

    if (!isEmpty(filtereddata)) {
      return filtereddata.map((file, index) => {
        return (
          <div key={index} className="ac-notes-cards-container__card">
            <div className="ac-notes-cards-container__cardOverflow">
              <div className="notes-3-dots-div">
                <img
                  src={require("../../../assets/img/icons/Dominate-Icon_dustbin.svg")}
                  alt="delete"
                  className="ac-email-edit-dropdown-img notes-3-dots-img ml-70"
                  onClick={handleOnClickDelete(file._id)}
                />
              </div>
              <h6 className="font-21-regular mb-10">
                {displaySmallText(file.originalName, 15, true)}{" "}
              </h6>
              <p className="font-18-regular">
                {" "}
                {displaySmallText(file.name, 20, true)}
              </p>
              <button
                className="files-open-btn"
                onClick={onClickOnCardHandler(file.url)}
                // style={{ marginTop: "10px" }}
              >
                {" "}
                Open File
              </button>
            </div>
          </div>
        );
      });
    } else {
      return (
        <div className="leads-new-no-data-illustration-div">
          <div className="row mx-0 justify-content-center align-items-start">
            <img
              // src={require("../../../../src/assets/img/illustrations/leads-new-no-files.svg")}
              src="/img/desktop-dark-ui/illustrations/leads-new-no-files.svg"
              alt="no files"
              className="leads-new-no-data-illustration-div__no-files-img"
            />
          </div>
          <p className="font-18-medium color-white-79 mb-30 text-center">
            No files added yet
          </p>
        </div>
      );
    }
  };

  return (
    <>
      {/* title block */}
      <div className="justify-content-space-between pr-20">
        {/* title */}
        <h5 className="font-21-bold">All Files</h5>
        <div className="d-flex">
          {/* search block */}
          {renderSearch()}
          {/* add note button modal */}
          <ActivityContentFilesModal leadActivityData={leadActivityData} />
        </div>
      </div>

      {/* cards */}
      <div className="ac-notes-cards-container">{renderCard()}</div>
    </>
  );
}

export default ActivityContentFiles;
