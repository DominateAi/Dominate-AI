import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { connect } from "react-redux";
// import {
//   updateKanBanLeadAction,
//   deleteLead,
// } from "./../../../store/actions/leadAction";
import {
  updateKanBanLeadOfPipelineAction,
  deletePipelineLead,
  // deleteLead,
} from "./../../../store/actions/leadsPipelineAction";
import "../common/CustomModalStyle.css";
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

function LeadsPipelineContentBlockCard({
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
        updateKanBanLeadOfPipelineAction(
          leadData._id,
          { degree: "SUPER_HOT" },
          data.id,
          leadFilterName
        )
      );
    } else if (e.value === "☀️") {
      dispatch(
        updateKanBanLeadOfPipelineAction(
          leadData._id,
          { degree: "HOT" },
          data.id,
          leadFilterName
        )
      );
    } else if (e.value === "☕") {
      dispatch(
        updateKanBanLeadOfPipelineAction(
          leadData._id,
          { degree: "WARM" },
          data.id,
          leadFilterName
        )
      );
    } else if (e.value === "❄️️") {
      dispatch(
        updateKanBanLeadOfPipelineAction(
          leadData._id,
          { degree: "COLD" },
          leadFilterName
        )
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

  const deleteKanbanLeadHandler = (leadData) => (e) => {
    var data = JSON.parse(localStorage.getItem("Data"));
    e.preventDefault();
    console.log(leadData);
    dispatch(deletePipelineLead(leadData._id, leadFilterName, data.id, ""));

    // formData.isKanban = false;
    // dispatch(
    //   updateKanBanLeadOfPipelineAction(
    //     leadData._id,
    //     formData,
    //     data.id,
    //     leadFilterName
    //   )
    // );
    // dispatch(deleteLead(leadData._id, "All Leads", data.id));
  };

  const goToDetailHandler = (leadData) => (e) => {
    e.preventDefault();
    console.log(leadData);
    store.dispatch({
      type: SET_KANBAN_VIEW,
      payload: true,
    });

    history.push({
      pathname: "/leads-new-pipeline-details",
      state: { detail: leadData },
    });
  };

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
              {/* <h5 className="font-16-medium pr-20">
                <span
                  className="font-16-medium"
                  role="img"
                  aria-labelledby="notes"
                >
                  📝
                </span>
                &nbsp;&nbsp;{leadNotes}
              </h5> */}
              <h5 className="font-16-medium text-right w-100 pt-10 pr-20">
                {/* <span
                  className="font-16-medium"
                  role="img"
                  aria-labelledby="files"
                >
                  🗒
                </span>
                &nbsp;&nbsp;{leadData.followups} */}
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

export default LeadsPipelineContentBlockCard;
