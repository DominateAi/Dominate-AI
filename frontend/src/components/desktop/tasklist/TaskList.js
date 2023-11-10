import React, { Component, Fragment } from "react";
import Navbar from "./../header/Navbar";
import TaskTableRow from "./TaskTableRow";
import { connect } from "react-redux";
import { getAllTasks } from "./../../../store/actions/taskAction";
import isEmpty from "./../../../store/validations/is-empty";

import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import { SET_PAGETITLE } from "./../../../store/types";
import store from "./../../../store/store";
import AddTask from "./AddTask";
import BreadcrumbMenu from "../header/BreadcrumbMenu";
import TaskKanbanBoard from "./TaskKanbanBoard";
import AddTaskOld from "./AddTaskOld";

// pagination
const totalRecordsInOnePage = 5;

const tasksAssignedOptions = ["Tasks Assigned to me", "Tasks Assigned by me"];

export class TaskList extends Component {
  constructor() {
    super();
    this.state = {
      taskAssignedSelected: tasksAssignedOptions[0],
      // pagination
      currentPagination: 1,
      // api
      getItemsList: {},
    };
  }

  /*================================
      Comppnent Lifecycle Method
  ==================================*/
  componentDidMount() {
    let organisationData = JSON.parse(localStorage.getItem("oraganiationData"));
    let userData = JSON.parse(localStorage.getItem("Data"));
    // if (
    //   organisationData.planStatus === "CANCELLED" ||
    //   organisationData.planStatus === "PAYMENT_FAILED"
    // ) {
    //   this.props.history.push("/profile");
    // }
    store.dispatch({
      type: SET_PAGETITLE,
      payload: "Tasks",
    });

    const allTask = {
      query: {
        assignee: userData.id,
      },
    };
    this.props.getAllTasks(allTask);
  }

  onAllLeadDropdownSelect = (data) => (e) => {
    let userData = JSON.parse(localStorage.getItem("Data"));

    if (data === "Tasks Assigned by me") {
      const allTask = {
        query: {
          createdBy: userData.email,
        },
      };
      this.props.getAllTasks(allTask);
    } else {
      const allTask = {
        query: {
          assignee: userData.id,
        },
      };
      this.props.getAllTasks(allTask);
    }
    this.setState({
      taskAssignedSelected: data,
    });
  };

  // pagination
  onChangePagination = (page) => {
    this.setState({
      currentPagination: page,
    });
  };

  renderTopBarNew = () => {
    return (
      <div className="row mx-0 align-items-center justify-content-end progress-dots progress-dots--new">
        <p>
          <span className="progress-dots-green">
            <i className="fa fa-circle" />
          </span>{" "}
          Completed
        </p>
        <p>
          <span className="progress-dots-yellow">
            <i className="fa fa-circle" />
          </span>{" "}
          In Progress
        </p>
        <p>
          <span className="progress-dots-red">
            <i className="fa fa-circle" />
          </span>{" "}
          Not Started
        </p>
      </div>
    );
  };

  /*==============================
          Render Table list
  ===============================*/

  renderTaskTableList = () => {
    if (!isEmpty(this.props.allTask)) {
      const { allTasks } = this.state;
      return (
        <>
          <div className="task-list-table-container">
            <div className="task-list-table">
              <table className="table task-list-table-title mb-0">
                <thead>
                  <tr>
                    <th className="task-name-column">Task Title</th>
                    <th className="duration-column">Duration</th>
                    <th className="time-left-column">Time Left</th>
                    <th>Status</th>
                  </tr>
                </thead>
              </table>
            </div>
            <div className="task-list-view-container">
              <table className="table-with-border-row task-list-table">
                <tbody>
                  <TaskTableRow
                    allTask={!isEmpty(allTasks) && allTasks}
                    currentPagination={this.state.currentPagination}
                    totalRecordsInOnePage={totalRecordsInOnePage}
                  />
                </tbody>
              </table>
            </div>
          </div>
          <div className="add-lead-pagination add-lead-pagination--tasklist">
            <Pagination
              onChange={this.onChangePagination}
              current={this.state.currentPagination}
              defaultPageSize={totalRecordsInOnePage}
              total={this.state.getItemsList.length}
              showTitle={false}
            />
          </div>
        </>
      );
    } else {
      return (
        <div className="container-fluid task-list-table-illustration-container">
          <h3 className="font-24-medium mt-20">No Tasks Found</h3>
          {/* <img
            src={require("../../../assets/img/illustrations/task.svg")}
            alt="illustration"
            className="w-100"
          /> */}
        </div>
      );
    }
  };

  render() {
    // console.log(this.state.userId);
    return (
      <Fragment>
        <Navbar />
        <BreadcrumbMenu
          menuObj={[
            {
              title: "Task",
            },
          ]}
        />
        <div className="row mx-0 align-items-center justify-content-between">
          <h2 className="page-title-new">My Task List</h2>
          <div className="mr-30">
            <AddTask
              addTaskButtonText="+ Add New Task"
              addTaskButtonClassName="leads-title-block-btn-red-bg mr-30 ml-30"
            />
            {/* <AddTaskOld
              addTaskButtonText="+ Add New Task"
              addTaskButtonClassName="leads-title-block-btn-red-bg mr-30 ml-30"
            /> */}
          </div>
        </div>
        <hr className="page-title-border-bottom" />

        <div className="new-task-content">
          <div className="leads-new-filter-button-block">
            {tasksAssignedOptions.map((data, index) => (
              <button
                key={index}
                onClick={this.onAllLeadDropdownSelect(data)}
                className={
                  tasksAssignedOptions[index] ===
                  this.state.taskAssignedSelected
                    ? "leads-new-filter-button leads-new-filter-button--active"
                    : "leads-new-filter-button"
                }
              >
                {data}
              </button>
            ))}
          </div>
          <TaskKanbanBoard
            // allTasks={this.props.allTask}
            taskAssignedSelected={this.state.taskAssignedSelected}
          />
        </div>

        {/* {this.renderTopBarNew()} */}
        {/* <div className="task-page-bg">{this.renderTaskTableList()}</div> */}
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  allTask: state.tasks.tasks,
  // userId: state.auth.user.id,
  userProfileImg: state.auth.user,
});

export default connect(mapStateToProps, {
  getAllTasks,
})(TaskList);
