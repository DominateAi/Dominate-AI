import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import LeadsBlockViewTagsModal from "./LeadsBlockViewTagsModal";
import { connect } from "react-redux";
import {
  updateKanBanLeadAction,
  updateLeadTags,
  deleteLead,
} from "./../../../store/actions/leadAction";
import Modal from "react-responsive-modal";
import "../common/CustomModalStyle.css";
import AddLeadFormSelectFewTags from "./AddLeadFormSelectFewTags";
import { SET_KANBAN_VIEW } from "./../../../store/types";
import store from "../../../store/store";
import displaySmallText from "./../../../store/utils/sliceString";
import { maxLengths } from "../../../store/validations/maxLengths/MaxLengths";
import { useDispatch, useSelector } from "react-redux";
import isEmpty from "./../../../store/validations/is-empty";
import { useHistory } from "react-router-dom";

// const emojiOption = ['&#128165;', '&#127808;', '&#128169;'];
// const emojiOption = ["💥", "🍀", "💩"];
const emojiOption = ["🌋", "☀️", "☕", "❄️️"];

function LeadsContentBlockCard({
  leadData,
  leadName,
  leadFollowUp,
  leadFiles,
  leadContacted,
  leadNotes,
  leadTags,
  tagsArray,
}) {
  const history = useHistory();
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    emojiDropdownOption: emojiOption[0],
    addTagsPopup: false,
    tagsArray: [],
    tagsInputValue: [],
    success: false,
  });

  const leadFilterName = useSelector((state) => state.filterName.filterName);

  useEffect(() => {
    if (!isEmpty(leadData)) {
      if (leadData.degree === "SUPER_HOT") {
        setValues({
          ...values,
          emojiDropdownOption: emojiOption[0],
        });
      } else if (leadData.degree === "HOT") {
        setValues({
          ...values,
          emojiDropdownOption: emojiOption[1],
        });
      } else if (leadData.degree === "WARM") {
        setValues({
          ...values,
          emojiDropdownOption: emojiOption[2],
        });
      } else if (leadData.degree === "COLD") {
        setValues({
          ...values,
          emojiDropdownOption: emojiOption[3],
        });
      }
    }
  }, [leadData]);

  //   /*============================
  //       Event Handlers
  //   =============================*/
  //   addTagsHandler = () => {
  //     this.setState({
  //       success: false,
  //       hasmodalclose: false,
  //       addTagsPopup: true,
  //       tagsArray: [],
  //       tagsInputValue: [],
  //     });
  //   };

  const onAllLeadDropdownSelect = (leadData) => (e) => {
    console.log("Selected: " + e.value);
    var data = JSON.parse(localStorage.getItem("Data"));
    if (e.value === "🌋") {
      dispatch(
        updateKanBanLeadAction(
          leadData._id,
          { degree: "SUPER_HOT" },
          data.id,
          leadFilterName
        )
      );
    } else if (e.value === "☀️") {
      dispatch(
        updateKanBanLeadAction(
          leadData._id,
          { degree: "HOT" },
          data.id,
          leadFilterName
        )
      );
    } else if (e.value === "☕") {
      dispatch(
        updateKanBanLeadAction(
          leadData._id,
          { degree: "WARM" },
          data.id,
          leadFilterName
        )
      );
    } else if (e.value === "❄️️") {
      dispatch(
        updateKanBanLeadAction(leadData._id, { degree: "COLD" }, leadFilterName)
      );
    } else {
      console.log("not selected");
    }
  };

  /*===============================
       Model Event Handlers
  ================================*/

  const onCloseModal = () => {
    setValues({
      ...values,
      addTagsPopup: false,
      tagsArray: [],
      tagsInputValue: [],
    });
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   // console.log(this.state.tagsArray);
  //   const updatedTags = {
  //     tags: this.state.tagsArray,
  //   };
  //   this.props.updateLeadTags(
  //     this.props.leadData._id,
  //     this.props.userId,
  //     updatedTags
  //   );
  //   this.setState({
  //     success: true,
  //   });
  // };

  //   /*==============================
  //       Tags Handlers
  //   ================================*/

  //   handleSelectTagsOnChange = (e) => {
  //     this.setState({
  //       tagsInputValue: [e.target.value],
  //     });
  //   };

  //   handleSelectTagsOnKeyPress = (e) => {
  //     if (e.keyCode === 13) {
  //       this.setState({
  //         prevNextIndex: this.state.prevNextIndex - 1,
  //       });
  //       // split the str and remove the empty values
  //       console.log(this.state.tagsInputValue, "before trim");
  //       //let tagsInputValue = this.state.tagsInputValue.toString().split(",");
  //       let tagArray = this.state.tagsInputValue.toString().split(",");
  //       let tagsInputValue = tagArray.map((string) => string.trim());
  //       console.log(tagsInputValue, "after trim");
  //       let len = tagsInputValue.length;
  //       let i = 0;
  //       while (len > i) {
  //         while (tagsInputValue[i] === "") {
  //           tagsInputValue.splice(i, 1);
  //         }
  //         i++;
  //       }

  //       //array length
  //       let tagLength = this.state.tagsArray.length;
  //       console.log(tagLength);

  //       if (tagLength >= 5) {
  //         window.alert("Tags limit reached.");
  //       } else {
  //         if (tagsInputValue.length !== 0) {
  //           // update the states
  //           this.setState({
  //             tagsArray:
  //               [...this.state.tagsArray, ...tagsInputValue].length > 4
  //                 ? [...this.state.tagsArray, ...tagsInputValue].slice(0, 4)
  //                 : [...this.state.tagsArray, ...tagsInputValue],
  //             tagsInputValue: [],
  //           });
  //         }
  //         // console.log(this.state.tagsArray, this.state.tagsInputValue);
  //       }
  //     }
  //   };

  //   handleSelectFewTagsOnClick = (e) => {
  //     //array length
  //     let tagLength = this.state.tagsArray.length;
  //     console.log(tagLength);

  //     if (tagLength >= 5) {
  //       window.alert("Tags limit reached.");
  //     } else {
  //       this.setState({
  //         tagsArray:
  //           [...this.state.tagsArray, e.target.innerHTML].length > 4
  //             ? [...this.state.tagsArray, e.target.innerHTML].slice(0, 4)
  //             : [...this.state.tagsArray, e.target.innerHTML],
  //       });
  //     }
  //   };

  //   handleRemoveTag = (val) => {
  //     var tags = [...this.state.tagsArray];
  //     var i = tags.indexOf(val);
  //     if (i !== -1) {
  //       tags.splice(i, 1);
  //       this.setState({
  //         open: true,
  //         tagsArray: tags,
  //       });
  //     }
  //   };

  const deleteKanbanLeadHandler = (leadData) => (e) => {
    var data = JSON.parse(localStorage.getItem("Data"));
    e.preventDefault();
    console.log(leadData);
    dispatch(deleteLead(leadData._id, "All Leads", data.id));
  };

  const goToDetailHandler = (leadData) => (e) => {
    e.preventDefault();
    console.log(leadData);
    store.dispatch({
      type: SET_KANBAN_VIEW,
      payload: true,
    });

    history.push({
      pathname: "/leads-new-details",
      state: { detail: leadData },
    });
  };

  //   /*=================================
  //     Render add kanban tags Popup
  //   ===================================*/
  //   renderAddKnaBanTags = () => {
  //     const { addTagsPopup } = this.state;
  //     return (
  //       <Fragment>
  //         <Modal
  //           open={addTagsPopup}
  //           onClose={this.onCloseModal}
  //           closeOnEsc={false}
  //           closeOnOverlayClick={false}
  //           center
  //           classNames={{
  //             overlay: "customOverlay",
  //             modal: "customModal customModal--addLead",
  //             closeButton: "customCloseButton",
  //           }}
  //         >
  //           <span className="closeIconInModal" onClick={this.onCloseModal} />
  //           <div className="add-lead-modal-container container-fluid pr-0">
  //             <h1 className="font-30-bold mb-61">New Lead</h1>

  //             <div className="add-lead-form-field-block">
  //               {/* form */}
  //               <form onSubmit={this.handleSubmit}>
  //                 <span className="add-lead-label font-24-semibold pt-20">
  //                   Added tags
  //                 </span>

  //                 <div className="leads-tags-in-input-field leads-tags-in-input-field--addLeadFormSelectTags">
  //                   <div className="representative-recent-img-text-block leads-tags-in-input-field__block pt-0 mb-30">
  //                     {this.state.tagsArray.map((tag, index) => (
  //                       <h6
  //                         key={index}
  //                         className="font-18-regular tag-border-block leads-tags-in-input-field__tags"
  //                       >
  //                         {tag}
  //                         <span
  //                           className="font-18-regular"
  //                           onClick={() => this.handleRemoveTag(tag)}
  //                         >
  //                           &nbsp; &times;
  //                         </span>
  //                       </h6>
  //                     ))}
  //                   </div>

  //                   {/* select tags by input type text field */}
  //                   <AddLeadFormSelectFewTags
  //                     id="tagsInputValue"
  //                     name="tagsInputValue"
  //                     onChange={this.handleSelectTagsOnChange}
  //                     onClick={this.handleSelectFewTagsOnClick}
  //                     onKeyDown={this.handleSelectTagsOnKeyPress}
  //                     value={this.state.tagsInputValue}
  //                     maxLength={maxLengths.char20}
  //                   />
  //                 </div>
  //                 {/* buttons */}
  //                 <div className="pt-25 text-right">
  //                   <button
  //                     type="submit"
  //                     className="btn-funnel-view btn-funnel-view--files m-0"
  //                   >
  //                     Save
  //                   </button>
  //                 </div>
  //               </form>
  //             </div>
  //           </div>
  //         </Modal>
  //       </Fragment>
  //     );
  //   };

  /*==========================================
  Render Emojis in converted section cards
============================================*/
  const renderEmojiConvertedSection = () => {
    // const { leadData } = this.props;
    return (
      <div className="kanban-board-emoji">
        {leadData.degree === "SUPER_HOT"
          ? emojiOption[0]
          : leadData.degree === "HOT"
          ? emojiOption[1]
          : leadData.degree === "WARM"
          ? emojiOption[2]
          : leadData.degree === "COLD"
          ? emojiOption[3]
          : ""}
      </div>
    );
  };

  return (
    <Fragment>
      {/* render add kanban tags model */}
      {/* {this.renderAddKnaBanTags()}
        <div className="container-fluid px-0">
          <div className="row w-100 mx-0">
            <div className="col-3 col-lg-2 px-0">
              <Link
                to={{
                  pathname: "/activity",
                  state: { detail: leadData }
                }}
              >
                <img
                  src={require("../../../assets/img/leads/lead_default_img.svg")}
                  alt="lead"
                  className="leads-content-img"
                />
              </Link>
            </div>
            <div className="col-6 col-lg-7 px-0 text-left">
              <Link
                to={{
                  pathname: "/activity",
                  state: { detail: leadData }
                }}
              >
                <h3 className="font-24-semibold">{leadName}</h3>
              </Link>
            </div>
            <div className="col-3 px-0 text-right">
              {leadData.status === "CONVERTED" ? (
                this.renderEmojiConvertedSection()
              ) : (
                <Dropdown
                  className="font-24-semibold lead-status-dropDown lead-status-dropDown--emoji"
                  options={emojiOption}
                  value={this.state.emojiDropdownOption}
                  onChange={this.onAllLeadDropdownSelect(leadData)}
                />
              )}
            </div>
          </div>

          <div className="row w-100 mb-8 mx-0">
            <div className="col-3 col-lg-2 px-0"></div>
            <div className="col-6 col-lg-7 px-0 text-left">
              <h5 className="font-18-regular">Follow up: {leadFollowUp}</h5>
            </div>
            <div className="col-3 px-0 text-right">
              <h5 className="font-18-regular">
                <b>{leadFiles}</b> Files
              </h5>
            </div>
          </div>

          <div className="row w-100 mb-8 mx-0">
            <div className="col-3 col-lg-2 px-0"></div>
            <div className="col-6 col-lg-7 px-0 text-left">
              <h5 className="font-18-regular">
                Last Contacted: {leadContacted}
              </h5>
            </div>
            <div className="col-3 px-0 text-right">
              <h5 className="font-18-regular">
                <b>{leadNotes}</b> Notes
              </h5>
            </div>
          </div>
          {leadTags ? (
            <LeadsBlockViewTagsModal
              allTagsData={tagsArray}
              leadData={leadData}
            />
          ) : (
            <button
              onClick={this.addTagsHandler}
              className="btn badge-info add-tags-button-kanban"
            >
              Add Tags
            </button>
          )}
        </div>
       */}
      {/* new structure */}
      {/* {renderAddKnaBanTags()} */}
      <div className="container-fluid px-0">
        <div className="row mx-0">
          <div className="col-2 px-0">
            <Link
              to={{
                pathname: "/leads-new-details",
                // "/activity",
                state: { detail: leadData },
              }}
            >
              <img
                src={require("../../../assets/img/leads/lead_default_img.svg")}
                alt="lead"
                className="leads-content-img"
              />
            </Link>
          </div>

          <div className="col-10 pr-0">
            <div className="row mx-0 align-items-center">
              <div className="w-100 row mx-0 justify-content-between flex-nowrap">
                {/* <Link
                    to={{
                      pathname: "/leads-new-details",
                      state: { detail: leadData },
                    }}
                    // to={{
                    //   pathname: "/activity",
                    //   state: { detail: leadData },
                    // }}
                  > */}
                <h3
                  onClick={goToDetailHandler(leadData)}
                  className="font-18-semibold mb-8"
                >
                  {displaySmallText(leadName, 15, true)}{" "}
                </h3>
                {/* </Link> */}

                <div>
                  {leadData.status === "CONVERTED" ? (
                    renderEmojiConvertedSection()
                  ) : (
                    <Dropdown
                      className="font-21-semibold lead-status-dropDown lead-status-dropDown--emoji"
                      options={emojiOption}
                      value={values.emojiDropdownOption}
                      onChange={onAllLeadDropdownSelect(leadData)}
                    />
                  )}
                </div>
              </div>
              <h5 className="font-16-medium pr-20">
                <span
                  className="font-16-medium"
                  role="img"
                  aria-labelledby="notes"
                >
                  📝
                </span>
                &nbsp;&nbsp;{leadNotes}
              </h5>
              <h5 className="font-16-medium">
                <span
                  className="font-16-medium"
                  role="img"
                  aria-labelledby="files"
                >
                  🗒
                </span>
                &nbsp;&nbsp;{leadData.followups}
                <span>
                  <i
                    onClick={deleteKanbanLeadHandler(leadData)}
                    className="fa fa-trash kanban-delete-icon"
                    aria-hidden="true"
                  ></i>
                </span>
              </h5>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default LeadsContentBlockCard;
