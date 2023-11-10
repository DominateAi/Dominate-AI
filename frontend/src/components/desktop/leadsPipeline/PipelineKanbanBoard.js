import React, { Fragment, useState, useEffect } from "react";
import LeadsPipelineContentBlockCard from "./LeadsPipelineContentBlockCard";
import {
  getKanBanLeads,
  // updateKanBanLeadAction,
  updateLeadAction,
  dropLeadAction,
  getAllActiveLeads,
} from "./../../../store/actions/leadAction";
import isEmpty from "./../../../store/validations/is-empty";
import Modal from "react-responsive-modal";
import "../common/CustomModalStyle.css";
import {
  GET_KANBAN_STATUS_CHANGE,
  SET_CONFETTI_ANIMATION,
  SET_LOADER,
  CLEAR_LOADER,
} from "./../../../store/types";
import store from "./../../../store/store";
import Alert from "react-s-alert";
import "react-s-alert/dist/s-alert-css-effects/jelly.css";
import { getAllAccounts } from "./../../../store/actions/accountsAction";

// phone flags country code
import "react-phone-input-2/lib/style.css";
import { maxLengths } from "../../../store/validations/maxLengths/MaxLengths";
import AddNewFormModal from "./AddNewFormModal";
import AddNewStage from "./AddNewStage";
import { useSelector, useDispatch } from "react-redux";
import {
  getAllLeadsPipelineStages,
  getAllKanbanLeadsOfPipeline,
  updateKanBanLeadOfPipelineAction,
} from "./../../../store/actions/leadsPipelineAction";

// const kanbanStatus = [
//   { name: "New Leads", status: "NEW_LEAD" },
//   { name: "Contacted Leads", status: "CONTACTED_LEADS" },
//   { name: "Qualified Leads", status: "QUALIFIED_LEADS" },
//   { name: "On Hold Leads", status: "ON_HOLD" },
//   { name: "Opportunity Leads", status: "OPPORTUNITIES" },
//   { name: "Converted Leads", status: "CONVERTED" },
// ];

function PipelineKanbanBoard() {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    allKanLead: [],
    dragStartData: [],
    setData: false,
    leadDataOfStatusChanged: [],
    errors: {},
  });

  const [allPipelineStages, setAllPipelineStages] = useState([]);

  //COMPONENT DID MOUNT
  useEffect(() => {
    var data = JSON.parse(localStorage.getItem("Data"));
    let leadPipelineData = JSON.parse(localStorage.getItem("leadPipelineData"));

    store.dispatch({
      type: GET_KANBAN_STATUS_CHANGE,
      payload: [],
    });
    // dispatch(getKanBanLeads(data.id));

    const allLeadQuery = {
      query: {},
    };

    dispatch(getAllActiveLeads(allLeadQuery));
    dispatch(getAllAccounts());
    dispatch(
      getAllLeadsPipelineStages({
        query: {
          pipeline: leadPipelineData._id,
        },
      })
    );
    dispatch(
      getAllKanbanLeadsOfPipeline({
        query: {
          isKanban: true,
          isHidden: false,
          status: { $ne: "ARCHIVE" },
          pipeline: leadPipelineData._id,
        },
      })
    );

    // handle prev and next screen by keyboard
    // document.addEventListener("keydown", handleMainDivKeyDown);

    return () => {
      // handle prev and next screen by keyboard
      store.dispatch({
        type: SET_CONFETTI_ANIMATION,
        payload: false,
      });
      // document.removeEventListener("keydown", handleMainDivKeyDown);
    };
  }, []);

  // STATIC GET DERIVED
  const leadDataOfStatusChanged = useSelector(
    (state) => state.leads.kanbanLeadStatusChangedData
  );
  // const kanBanLeads = useSelector((state) => state.leads.kanBanLeads);
  const allLeadsOfPipeline = useSelector(
    (state) => state.leadsPipeline.allKanbanLeadsOfPipeline
  );

  const allAccounts = useSelector((state) => state.account.allAccounts);
  const allLeads = useSelector((state) => state.leads.allLeads);
  const filterName = useSelector((state) => state.filterName.filterName);
  const allPipelineStage = useSelector(
    (state) => state.leadsPipeline.allPipelineStages
  );
  const kanbanSearch = useSelector((state) => state.search.kanbanSearch);

  useEffect(() => {
    if (!isEmpty(allPipelineStage)) {
      setAllPipelineStages(allPipelineStage);
      //   let newPipelineOptions =
      //     !isEmpty(getAllPipelines) &&
      //     getAllPipelines.map((pipeline) => ({
      //       value: pipeline._id,
      //       label: pipeline.name,
      //     }));
      //   setPipelineOptions(newPipelineOptions);
      // } else {
      //   setPipelineOptions([]);
    } else {
      setAllPipelineStages([]);
    }
  }, [allPipelineStage]);

  // useEffect(() => {
  //   if (!isEmpty(leadDataOfStatusChanged)) {
  //     var data = JSON.parse(localStorage.getItem("Data"));
  //     setValues({
  //       ...values,
  //       leadDataOfStatusChanged: leadDataOfStatusChanged,
  //     });

  //     // set drop lead model

  //     if (leadDataOfStatusChanged.status === "DROPPED_LEAD") {
  //       setValues({
  //         ...values,
  //         openDropLeadFormModal: true,
  //       });
  //     }
  //   }
  // }, [leadDataOfStatusChanged]);

  useEffect(() => {
    if (!isEmpty(allLeadsOfPipeline)) {
      setValues({
        ...values,

        allKanLead: allLeadsOfPipeline,
      });
    }
  }, [allLeadsOfPipeline]);

  /*===================================
        Drag And Drop Event Handlers
  =====================================*/
  const onDragEndHandler = (e) => {
    e.target.style.opacity = "";
    e.currentTarget.style.background = "#ffffff";
    e.currentTarget.style.color = "#000000";
  };
  const onDragStartHandler = (data, index) => (e) => {
    // console.log("Drag Start", data, index );
    store.dispatch({
      type: GET_KANBAN_STATUS_CHANGE,
      payload: [],
    });
    setValues({
      ...values,
      dragStartData: data,
      setPopup: false,
    });
    e.target.style.opacity = 0.4;
    e.target.style.background =
      "linear-gradient(305deg, #1488cc, #1488cc, #20bdff, #a5fecb)";
    e.currentTarget.style.color = "#ffffff";
  };

  const onDropHandler = (stageId) => (e) => {
    e.preventDefault();
    var data = JSON.parse(localStorage.getItem("Data"));
    console.log(stageId);
    const { dragStartData } = values;
    dragStartData.stage = stageId;
    dispatch(
      updateKanBanLeadOfPipelineAction(
        dragStartData._id,
        dragStartData,
        data.id,
        filterName
      )
    );
  };
  const onDragOverHandler = (e) => {
    e.preventDefault();
    // console.log("DragOver", e);
  };

  /*===================================
            Render New Leads
  ====================================*/

  let filtereddata = [];
  if (!isEmpty(kanbanSearch)) {
    let search = new RegExp(kanbanSearch, "i");
    filtereddata = allLeadsOfPipeline.filter((getall) => {
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
    filtereddata = allLeadsOfPipeline;
  }

  const renderKanbanLeads = (stageId) => {
    let filteredLeads = filtereddata.filter((ele) => ele.stage === stageId);

    let list = [];
    if (!isEmpty(filteredLeads)) {
      list = filteredLeads.map((data, index) => (
        <div
          key={index}
          className="lead-single-card-container"
          draggable="true"
          onDragStart={onDragStartHandler(data, index)}
          onDragEnd={onDragEndHandler}
        >
          <LeadsPipelineContentBlockCard
            leadName={data.name}
            /* leadEmoji={this.props.lead.leadEmoji} */
            // leadEmoji="&#128165;"
            leadFollowUp={[]}
            leadFiles={"1"}
            leadContacted={"05-09-2019"}
            leadNotes={[]}
            leadTags={!isEmpty(data.tags) ? true : false}
            tagsArray={!isEmpty(data.tags) && data.tags}
            leadData={data}
            style={values.style}
          />
        </div>
      ));
    }

    return list;
  };

  const renderLeadsCount = (status) => {
    let filteredLeads = filtereddata.filter((ele) => ele.status === status);
    return <span>{filteredLeads.length} Leads</span>;
  };

  const {} = values;

  return (
    <Fragment>
      {/* {renderOnBoardCustomerPopup()}
      {renderConvertedLeadModel()}
      {renderDropLeadFormModal()} */}
      {/* {!isEmpty(allLeadsOfPipeline) ? ( */}
      <div className="leads-content-container">
        {!isEmpty(allPipelineStages) &&
          allPipelineStages.map((data, index) => {
            return (
              <div key={index} className="leads-content-container__colms">
                <div className="heads">
                  <h3 className="heads__title">
                    {/* <span role="img" aria-labelledby="emoji">
                          👶
                        </span> */}
                    {data.leadStageName}
                    {/* {renderLeadsCount(data._id)} */}
                    {/* <span>{!isEmpty(newLeads) ? newLeads.length : 0} Leads</span> */}
                  </h3>
                </div>
                <AddNewFormModal initialStatusDropDownOption={index} />
                <div
                  className="new_leads_container"
                  onDrop={onDropHandler(data._id)}
                  onDragOver={onDragOverHandler}
                >
                  {renderKanbanLeads(data._id)}
                </div>
              </div>
            );
          })}
        <AddNewStage />
      </div>
      {/* ) : (
        <div className="container-fluid task-list-table-illustration-container">
         
          <img
            src={require("../../../assets/img/illustrations/leads-kanban.svg")}
            alt="illustration"
            className="w-100"
          />
        </div>
      )} */}
    </Fragment>
  );
}

export default PipelineKanbanBoard;
