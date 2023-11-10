import React, { Fragment, useState, useEffect } from "react";
import LeadsContentBlockCard from "./../leads/LeadsContentBlockCard";
import { Accordion } from "react-accessible-accordion";
import isEmpty from "./../../../store/validations/is-empty";
import Modal from "react-responsive-modal";
import "../common/CustomModalStyle.css";
import { validateAddNewDeal } from "../../../store/validations/dealPipelinesValidation/addNewDealValidation";

import store from "./../../../store/store";
import Alert from "react-s-alert";
import "react-s-alert/dist/s-alert-css-effects/jelly.css";

import { useSelector, useDispatch } from "react-redux";
import TaskKanbanBoardCard from "./TaskKanbanBoardCard";
import { updateTaskAction } from "./../../../store/actions/taskAction";

const kanbanStatus = [
  { name: "NOT STARTED", status: "NOT_STARTED" },
  { name: "IN PROGRESS", status: "ONGOING" },
  { name: "COMPLETED", status: "COMPLETED" },
];

function TaskKanbanBoard({ taskAssignedSelected }) {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    allKanbanTasks: [],
    dragStartData: [],
  });

  const allTask = useSelector((state) => state.tasks.tasks);

  //COMPONENT DID MOUNT
  useEffect(() => {
    if (!isEmpty(allTask)) {
      setValues({
        ...values,
        allKanbanTasks: allTask,
      });
    } else {
      setValues({
        ...values,
        allKanbanTasks: [],
      });
    }
  }, [allTask]);

  // STATIC GET DERIVED

  const kanBanTasks = [{ name: "task", status: "COMPLETED" }];
  // useSelector((state) => state.leads.kanBanLeads);
  const kanbanSearch = useSelector((state) => state.search.kanbanSearch);

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
    setValues({
      ...values,
      dragStartData: data,
      // setPopup: false,
    });
    e.target.style.opacity = 0.4;
    e.target.style.background =
      "linear-gradient(305deg, #1488cc, #1488cc, #20bdff, #a5fecb)";
    e.currentTarget.style.color = "#ffffff";
  };
  const onDropHandler = (value) => (e) => {
    e.preventDefault();
    var data = JSON.parse(localStorage.getItem("Data"));

    const { dragStartData } = values;

    const updateTask = dragStartData;
    updateTask.status = value;

    dispatch(
      updateTaskAction(updateTask._id, updateTask, taskAssignedSelected)
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
    filtereddata = values.allKanbanTasks.filter((getall) => {
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
    filtereddata = values.allKanbanTasks;
  }

  const renderKanbanTasks = (status) => {
    let filteredLeads = filtereddata.filter((ele) => ele.status === status);

    let list = [];
    if (!isEmpty(filteredLeads)) {
      list = filteredLeads.map((data, index) => (
        <div
          key={index}
          className="lead-single-card-container-task"
          draggable="true"
          onDragStart={onDragStartHandler(data, index)}
          onDragEnd={onDragEndHandler}
        >
          {/* <LeadsContentBlockCard
            leadName={data.name}            
            leadFollowUp={data.followups}
            leadFiles={"1"}
            leadContacted={"05-09-2019"}
            leadNotes={data.notes}
            leadTags={!isEmpty(data.tags) ? true : false}
            tagsArray={!isEmpty(data.tags) && data.tags}
            leadData={data}
            style={values.style}
          /> */}
          <TaskKanbanBoardCard
            taskData={data}
            taskAssignedSelected={taskAssignedSelected}
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

  return (
    <Fragment>
      {!isEmpty(values.allKanbanTasks) ? (
        <div className="leads-content-container">
          {kanbanStatus.map((data, index) => {
            return (
              <div key={index} className="leads-content-container__colms">
                <div className="heads">
                  <h3 className="heads__title">
                    <p className="task-progress-title">
                      <span
                        className={
                          index === 0
                            ? "progress-dots-red"
                            : index === 1
                            ? "progress-dots-yellow"
                            : "progress-dots-green"
                        }
                      >
                        <i className="fa fa-circle" />
                      </span>{" "}
                      {data.name}
                    </p>
                    {/* {renderLeadsCount(data.status)} */}
                  </h3>
                </div>
                {/* <AddNewFormModal initialStatusDropDownOption={index} /> */}
                <div
                  className="new_leads_container"
                  onDrop={onDropHandler(data.status)}
                  onDragOver={onDragOverHandler}
                >
                  <Accordion
                    className="leads-accordion leads-accordion--customers"
                    allowZeroExpanded={true}
                  >
                    {renderKanbanTasks(data.status)}
                  </Accordion>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="container-fluid text-center">
          {/* <h3>No leads added to kanban view</h3> */}
          <img
            // src={require("../../../assets/img/illustrations/leads-kanban.svg")}
            src={require("../../../assets/img/illustrations/tasklist.svg")}
            alt="illustration"
            className="new-task-list-table-illustration"
          />
          <p className="reports-graph-not-found-text">No tasks added yet</p>
        </div>
      )}
    </Fragment>
  );
}

export default TaskKanbanBoard;
