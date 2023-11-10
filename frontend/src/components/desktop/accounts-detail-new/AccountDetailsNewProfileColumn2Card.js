import React, { useState, useEffect, Fragment } from "react";
import ActivitySummaryCreateMailModal from "../activity/ActivitySummaryCreateMailModal";
import ActivitySummaryFollowUpModal from "../activity/ActivitySummaryFollowUpModal";
import AddFollowupForAccountLead from "./AddFollowupForAccountLead";
import { AddTask } from "../tasklist/AddTask";
import EditNotes from "./EditNotes";
import AddNotes from "./AddNotes";
// import { connect } from "react-redux";
import AccumulatedRevenueBarChart from "../accounts-new/AccumulatedRevenueBarChart";
import isEmpty from "../../../store/validations/is-empty";
import AccountEditModal from "./../accounts/AccountEditModal";
import { deleteNoteById } from "./../../../store/actions/accountsAction";
import ActivityContentEmailComposeModal from "./AccountDetailsComposeModel";
import store from "../../../store/store";
import { GET_NOTE_DATA } from "./../../../store/types";
import dateFns from "date-fns";
import displaySmallText from "./../../../store/utils/sliceString";
import { useDispatch, useSelector } from "react-redux";

const dummyData = [1, 2, 3];

function AccountDetailsNewProfileColumn2Card() {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    isButtonPinClicked: false,
    isNotesTrue: false,
    singleNoteData: "",
    accountAllNotes: [],
    accountSingleNote: {},
  });

  const singleAccountData = useSelector(
    (state) => state.account.singleAccountData
  );
  const accountAllNotes = useSelector((state) => state.account.accountAllNotes);
  const accountSingleNote = useSelector(
    (state) => state.account.accountSingleNote
  );

  useEffect(() => {
    if (!isEmpty(singleAccountData)) {
      setValues({
        ...values,
        singleAccountData: singleAccountData,
      });
    }
  }, [singleAccountData]);

  useEffect(() => {
    if (!isEmpty(accountAllNotes)) {
      setValues({
        ...values,
        accountAllNotes: accountAllNotes,
      });
    }
  }, [accountAllNotes]);

  useEffect(() => {
    if (!isEmpty(accountSingleNote)) {
      setValues({
        ...values,
        accountSingleNote: accountSingleNote,
      });
    }
  }, [accountSingleNote]);

  /*===================================================================
          handlers
  ===================================================================*/
  const handleOnClickEdit = () => {
    console.log("clicked on edit button");
  };

  const handleOnClickNotesEdit = () => {
    console.log("clicked on notes edit button");
  };
  const handleOnClickNotesClose = (data) => (e) => {
    const { singleAccountData } = this.state;
    e.preventDefault();
    dispatch(deleteNoteById(data._id, singleAccountData._id));
  };
  const handleDispayNote = (noteData) => (e) => {
    // console.log("clicked on notes add button");
    store.dispatch({
      type: GET_NOTE_DATA,
      payload: noteData,
    });
    setValues({ ...values, isNotesTrue: true });
  };

  const closeNotesView = () => {
    setValues({
      ...values,
      isNotesTrue: false,
    });
  };
  /*===================================================================
          renderFold1
  ===================================================================*/
  // handler
  const handleOnClickButtonPin = () => {
    setValues({
      ...values,
      isButtonPinClicked: !this.state.isButtonPinClicked,
    });
  };

  // renderFold1
  const renderFold1 = () => {
    const { isButtonPinClicked, singleAccountData } = values;
    return (
      <div className="accounts-view-detail-new-colm2__fold1">
        {/* img block */}
        <div className="accounts-view-detail-new-colm2__fold1-img-block">
          {/* <img
            // src={require("../../../../src/assets/img/accounts/profile.svg")}            
            alt=""
          /> */}

          {/* <button
            className="accounts-view-detail-new-colm2__fold1-img-block-button"
            onClick={this.handleOnClickButtonPin}
          >
            {isButtonPinClicked ? (
              <img
                src={require("../../../../src/assets/img/accounts-new/pinned-icon.svg")}
                alt="pinned"
              />
            ) : (
              <img
                src={require("../../../../src/assets/img/accounts-new/pin-icon.svg")}
                alt="pin"
              />
            )}
          </button> */}
        </div>
        {/* text */}
        <h2 className="accounts-view-detail-new-colm2__fold1-text-1 font-20-medium">
          {!isEmpty(singleAccountData) &&
            displaySmallText(singleAccountData.accountname, 15, true)}
        </h2>
        <p className="accounts-view-detail-new-colm2__fold1-text-2">
          <i className="fa fa-map-marker"></i>
          {!isEmpty(singleAccountData) && singleAccountData.location}
        </p>
      </div>
    );
  };

  /*===================================================================
          renderFold2
  ===================================================================*/
  const renderFold2 = () => {
    const { singleAccountData } = values;
    const addTaskButtonText = (
      <>
        <img
          src="/img/desktop-dark-ui/icons/lead-add-logs.svg"
          alt=""
          className="leads-new-inner-page-profile-row__delete-icon"
        />{" "}
        <span className="font-15-bold">Add Note</span>
      </>
    );
    return (
      <>
        <div className="row mx-0 align-items-center accounts-view-detail-new-colm2__fold2-row">
          <div className="col-3 px-0 text-left">
            {/* <ActivitySummaryCreateMailModal leadActivityData={""} /> */}
            <ActivityContentEmailComposeModal leadActivityData={""} />
          </div>
          <div className="col-5 px-0">
            <AddFollowupForAccountLead leadActivityData={singleAccountData} />
          </div>
          <div className="col-4 px-0 text-right">
            {/* add task */}
            <AddNotes
              // {...this.props}
              addTaskButtonClassName="leads-new-inner-page-profile-row__colm2-btn"
              addTaskButtonText={addTaskButtonText}
            />
          </div>
          {/* border bottom */}
          <div className="col-12 px-0 accounts-view-detail-new-colm2__fold2-row-border-bottom"></div>
        </div>
      </>
    );
  };

  const renderFold3 = () => {
    const addTaskButtonText = (
      <>
        {/* <div className="account-add-notes-btn"> */}
        {/* note-add-icon-img-div */}
        <img
          // src={require("../../../../src/assets/img/accounts-new/note-add-icon.svg")}
          src={"/img/desktop-dark-ui/icons/gray-plus-icon.png"}
          alt=""
        />

        <span className="font-14-semibold">add new</span>
        {/* </div> */}
      </>
    );

    const editTaskButtonText = (
      <>
        <div
          // className="account-details-notes-edit-btn"
          onClick={handleOnClickNotesEdit}
        >
          {/* <i className="fa fa-pencil" /> */}
          <img
            src={"/img/desktop-dark-ui/icons/pencil-with-underscore.svg"}
            alt=""
            className="account-edit-note-icon mr-0"
          />
        </div>
      </>
    );
    const { singleAccountData, accountAllNotes } = values;

    let leadData = [];
    if (
      !isEmpty(singleAccountData) &&
      singleAccountData !== false &&
      !isEmpty(singleAccountData.leadsData)
    ) {
      leadData = singleAccountData.leadsData;
    }

    let userData = [];

    if (
      !isEmpty(singleAccountData) &&
      singleAccountData !== false &&
      !isEmpty(singleAccountData.usersData)
    ) {
      userData = singleAccountData.usersData;
    }

    let userToken = JSON.parse(localStorage.getItem("Data"));

    return (
      <div className="row mx-0">
        {/* lead name */}
        <div className="col-6 pl-0">
          <p className="accounts-view-detail-new-colm2__fold3-gray-text font-18-semibold">
            <img
              // src={require("../../../../src/assets/img/accounts-new/1-orange-circle-icon.svg")}
              src={"img/desktop-dark-ui/icons/white-person.svg"}
              alt=""
            />
            <span>Owner Name</span>
          </p>

          <div className="row mx-0 flex-nowrap align-items-center accounts-view-detail-new-colm2__fold3-desc-div">
            <div className="">
              {!isEmpty(userData) &&
                userData.map((data, index) => (
                  <div
                    key={index}
                    className="accounts-new-details-us-blue-circle-icon-block"
                  >
                    <img
                      key={index}
                      src={`${data.profileImage}&token=${userToken.token}`}
                      alt=""
                    />
                  </div>
                ))}
            </div>
            {!isEmpty(userData) ? (
              <div className="accounts-new-details-us-text-3--width-colm2-fold3">
                <span className=" font-14-medium">
                  {/* accounts-new-details-us-text-3 */}
                  {userData.length === 1
                    ? `${userData[0].name}`
                    : `${userData[0].name} &amp; ${userData.length} More`}
                </span>
              </div>
            ) : (
              "No owner"
            )}
          </div>
        </div>
        {/* sales representatives */}
        <div className="col-6 pl-0">
          <p className="accounts-view-detail-new-colm2__fold3-gray-text font-18-semibold">
            <img
              // src={require("../../../../src/assets/img/accounts-new/2-purple-circle-icon.svg")}
              src={"img/desktop-dark-ui/icons/white-person-star.svg"}
              alt=""
              className="account-leads-icon"
            />
            <span>Account Leads</span>
          </p>

          <div className="row mx-0 flex-nowrap align-items-center accounts-view-detail-new-colm2__fold3-desc-div pl-0">
            <div className="row mx-0 align-items-center flex-nowrap accounts-new-details-us-blue-circle-icon-block-multiImg">
              {!isEmpty(leadData) &&
                leadData.map((data, index) => (
                  <div
                    key={index}
                    className="accounts-new-details-us-blue-circle-icon-block"
                  >
                    <img
                      key={index}
                      src={require("../../../../src/assets/img/leads/lead_default_img.svg")}
                      alt=""
                    />
                  </div>
                ))}
            </div>
            {!isEmpty(leadData) ? (
              <div className="accounts-new-details-us-text-3--width-colm2-fold3">
                <span className=" font-14-medium">
                  {/* accounts-new-details-us-text-3 */}
                  {leadData.length === 1
                    ? `${displaySmallText(leadData[0].name, 15, true)}`
                    : `${leadData[0].name} & ${leadData.length - 1} More`}
                </span>
              </div>
            ) : (
              "No leads"
            )}
          </div>
        </div>

        {/* Hours Invested */}
        {/* <div className="col-7 pl-0"> */}
        <div className="col-12 pl-0">
          <p className="accounts-view-detail-new-colm2__fold3-gray-text font-18-semibold">
            <img
              // src={require("../../../../src/assets/img/accounts-new/5-blue-circle-icon.svg")}
              src={"/img/desktop-dark-ui/icons/account-accumulated-revenue.svg"}
              alt=""
              className="account-projected-revenue-icon"
            />
            <span>Accumulated Revenue(USD)</span>
          </p>
          <div className="accounts-view-detail-new-colm2__fold3-graph-desc-div row mx-0 align-items-start flex-nowrap">
            {!isEmpty(singleAccountData) &&
              singleAccountData.accumulatedRevenue !== 0 && (
                <div className="account-new-card-graph-block">
                  {/* <img
               src={require("../../../assets/img/accounts-new/graph-icon.svg")}
               alt="graph"
             /> */}
                  <AccumulatedRevenueBarChart />
                </div>
              )}

            <p className="font-14-medium ">
              {/* accounts-new-details-us-text-1 accounts-new-details-us-text-1--light-blue */}
              {!isEmpty(singleAccountData) &&
                singleAccountData.accumulatedRevenue}
            </p>
          </div>
          {/* <p className="accounts-view-detail-new-colm2__fold3-gray-text">
            <img
              src={require("../../../../src/assets/img/accounts-new/4-violet-circle-icon.svg")}
              alt=""
            />
            <span>Hours Invested</span>
          </p>
          <div className="accounts-view-detail-new-colm2__fold3-desc-div">
            <p className="accounts-new-details-us-text-1 accounts-new-details-us-text-1--black">
              231 Hours
            </p>
          </div> */}
        </div>

        {/* Projected Revenue */}
        {/* <div className="col-5 pl-0"> */}
        <div className="col-12 pl-0">
          <p className="accounts-view-detail-new-colm2__fold3-gray-text font-18-semibold">
            <img
              src={"/img/desktop-dark-ui/icons/account-projected-revenue.svg"}
              // src={require("../../../../src/assets/img/accounts-new/3-dark-purple-circle-icon.svg")}
              alt=""
              className="account-projected-revenue-icon"
            />
            <span>Projected Revenue</span>
          </p>
          <div className="accounts-view-detail-new-colm2__fold3-desc-div">
            <p className="font-14-medium ">
              {/* accounts-new-details-us-text-1 accounts-new-details-us-text-1--black */}
              {!isEmpty(singleAccountData) &&
                singleAccountData.projectedRevenue.toFixed()}
            </p>
          </div>
        </div>

        {/* Accumulated Revenue(USD) */}
        {/* <div className="col-12 pl-0">
        
        </div> */}

        {/* Tasks */}
        <div className="col-12 pl-0 pr-0">
          <div className="row mx-0 align-items-center justify-content-between">
            <p className="accounts-view-detail-new-colm2__fold3-gray-text font-18-semibold">
              <img
                // src={require("../../../../src/assets/img/accounts-new/6-light-blue-circle-icon.svg")}
                src={"img/desktop-dark-ui/icons/account-note-icon.png"}
                alt=""
                className="account-note-icon"
              />
              <span>Notes</span>
              {/*<span>Tasks</span>*/}
            </p>
            <AddNotes
              // {...this.props}
              // addTaskButtonClassName="leads-new-inner-page-profile-row__colm2-btn"
              addTaskButtonText={addTaskButtonText}
              addTaskButtonClassName="account-add-notes-btn"
            />
          </div>
          <div className="accounts-view-detail-new-colm2__fold3-task-desc-div">
            {!isEmpty(accountAllNotes) ? (
              accountAllNotes.map((data, index) => (
                <div
                  key={index}
                  className="row mx-0 align-items-center flex-nowrap justify-content-between accounts-view-detail-new-colm2__fold3-notes-div"
                >
                  <p className="font-14-semibold accounts-new-details-us-text-3">
                    {/* <i className="fa fa-square"></i> */}
                    <img
                      // src={require("../../../../src/assets/img/accounts-new/6-light-blue-circle-icon.svg")}
                      src={
                        "img/desktop-dark-ui/icons/account-note-gray-icon.svg"
                      }
                      alt=""
                      className="account-gray-note-icon"
                    />
                    {/*Task Name*/}
                    {data.title}
                  </p>
                  <div className="row mx-0 align-items-center">
                    <span
                      className="view_account_note"
                      onClick={handleDispayNote(data)}
                    >
                      <img
                        src={
                          "/img/desktop-dark-ui/icons/account-view-note-icon.png"
                        }
                        alt="view note"
                        // className="account-details-view-note-icon"
                      />{" "}
                      {/* View */}
                    </span>
                    <EditNotes
                      // {...this.props}
                      // leads-new-inner-page-profile-row__colm2-btna
                      addTaskButtonClassName="account-details-notes-edit-btn"
                      addTaskButtonText={editTaskButtonText}
                      noteData={data}
                    />
                    <button
                      className="account-details-notes-edit-btn mr-0"
                      onClick={handleOnClickNotesClose(data)}
                    >
                      {/* <i className="fa fa-close" /> */}
                      <img
                        src={"/img/desktop-dark-ui/icons/close-icon.svg"}
                        alt="close"
                        className="account-details-close-icon"
                      />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no_notes_found">
                <img
                  // src={require("../../../../src/assets/img/accounts-new/no_notes_found.png")}
                  src="/img/desktop-dark-ui/illustrations/accounts-no-notes-found.svg"
                  alt="notes"
                  className="no_notes_img"
                />
                <p className="font-18-medium color-white-79">
                  No Notes Added yet
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderNotesDisplaySection = () => {
    const editNoteIcon = (
      <img
        src={require("../../../assets/img/accounts-new/edit-light-circle-icon.svg")}
        alt="edit"
      />
    );
    const { singleNoteData } = values;
    return (
      <div className="display_notes_section">
        <div className="row mx-0 flex-nowrap align-items-start">
          <img
            src={require("../../../assets/img/accounts-new/account-close-notes.svg")}
            alt="edit"
            className="account-notes-back-img"
            onClick={closeNotesView}
          />
          <div>
            <div className="row mx-0 flex-nowrap align-items-start">
              <p className="font-24-semibold notes-title">
                {singleNoteData.title}
              </p>
              <EditNotes
                {...this.props}
                addTaskButtonClassName="leads-new-inner-page-profile-row__colm2-btn"
                addTaskButtonText={editNoteIcon}
                noteData={singleNoteData}
              />
              <button className="leads-new-inner-page-profile-row__colm2-btn">
                <img
                  onClick={closeNotesView}
                  src={require("../../../assets/img/accounts/account-new-notes-cross.png")}
                  alt="edit"
                />
              </button>
            </div>
            <h5 className="no-lead-found-text pl-0">
              Last edited{" "}
              {dateFns.format(singleNoteData.updatedAt, "Do MMM at HH:mm aa")}
            </h5>
            <p className="account-notes-desc">{singleNoteData.data}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderAccountCardSection = () => {
    const { singleAccountData } = values;
    return (
      <Fragment>
        <div className="text-right">
          {!isEmpty(singleAccountData) && (
            <AccountEditModal
              cardData={singleAccountData}
              buttonClassName={"accounts-new-pinned-card-edit-button"}
              isImage={true}
            />
          )}
        </div>
        {renderFold1()}
        {renderFold2()}
        {renderFold3()}
      </Fragment>
    );
  };

  return (
    <>
      <div className="accounts-view-detail-new-colm2 flex-grow-1">
        {values.isNotesTrue === true
          ? renderNotesDisplaySection()
          : renderAccountCardSection()}
      </div>
    </>
  );
}

export default AccountDetailsNewProfileColumn2Card;
