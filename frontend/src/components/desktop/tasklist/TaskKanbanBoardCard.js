import React from "react";
import {
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel,
} from "react-accessible-accordion";
import dateFns from "date-fns";
import DropdownIcon from "rc-dropdown";
import "rc-dropdown/assets/index.css";
import Menu, { Item as MenuItem, Divider } from "rc-menu";
import EditTaskModal from "./EditTaskModal";
import { useDispatch } from "react-redux";
import { deleteTask } from "./../../../store/actions/taskAction";
import isEmpty from "../../../store/validations/is-empty";

export default function TaskKanbanBoardCard({
  taskData,
  taskAssignedSelected,
}) {
  const dispatch = useDispatch();
  /***************************
   * @DESC - OVERDUE CALCULATOR
   ********************************/
  const overDueCalculator = (toDate) => {
    var dateFirst = new Date(dateFns.format(new Date(), "MM/DD/YYYY"));
    var dateSecond = new Date(dateFns.format(toDate, "MM/DD/YYYY"));
    var timeDiff = dateSecond.getTime() - dateFirst.getTime();
    var diffDays = Math.ceil(Math.abs(timeDiff) / (1000 * 3600 * 24));
    let overdue = timeDiff < 0 ? -1 : 1;
    return {
      overdue,
      diffDays,
    };
  };

  let text =
    overDueCalculator(taskData.toDate).diffDays === 1
      ? "Day Overdue"
      : "Days Overdue";

  const onVisibleChange = (visible) => {
    console.log(visible);
  };

  const onSelect = (action) => {
    if (action === "delete") {
      dispatch(deleteTask(taskData._id));
    }
  };

  const menu = (
    <Menu>
      {/*<MenuItem onClick={() => this.onSelect("edit")}>Edit</MenuItem>*/}
      <MenuItem>
        <EditTaskModal
          addTaskButtonClassName="lead-new-detail-edit-button"
          addTaskButtonText="Edit"
          taskData={taskData}
          taskAssignedSelected={taskAssignedSelected}
        />
      </MenuItem>
      <Divider />
      {/*<MenuItem onClick={() => this.onSelect("delete")}>Delete</MenuItem>*/}
      <MenuItem onClick={() => onSelect("delete")}>Delete</MenuItem>
    </Menu>
  );

  const renderTextDeadline = (text) => {
    return (
      <>
        <br />
        <span className="font-18-regular color-white-79 text-center">
          {text}
        </span>
      </>
    );
  };

  return (
    <>
      <AccordionItem>
        <div className="lead-single-card-container-task__editDropdown">
          <DropdownIcon
            trigger={["click"]}
            overlay={menu}
            animation="none"
            onVisibleChange={onVisibleChange}
            overlayClassName="add-account-dropdown"
          >
            <img
              className="accounts-new-card-edit-card-img"
              src={require("./../../../assets/img/icons/edit-card-icon.svg")}
              alt=""
            />
          </DropdownIcon>
        </div>
        <AccordionItemHeading>
          <AccordionItemButton>
            <div className="d-flex flex-nowrap justify-content-between">
              <p className="font-18-semibold">
                <img
                  src="/img/desktop-dark-ui/icons/white-tasks-6-dots.svg"
                  alt=""
                  className="task-new-accordion-6-dots-img"
                />
                {taskData.name}
              </p>
              <div className="flex-shrink-0">
                {/* <img
                  src="/img/desktop-dark-ui/icons/white-arrow-up-circle.svg"
                  alt=""
                  className="task-new-accordion-arrow-up-img"
                /> */}
                <img
                  src="/img/desktop-dark-ui/icons/white-arrow-down-circle.svg"
                  alt=""
                  className="task-new-accordion-arrow-down-img"
                />
              </div>
            </div>
          </AccordionItemButton>
        </AccordionItemHeading>
        <AccordionItemPanel>
          <div className="task-new-accordion-desc-block">
            <p className="font-18-regular task-new-accordion-desc-text-1">
              <span className="task-new-accordion-desc-text-1__span-1">
                Description
              </span>
              <span className="task-new-accordion-desc-text-1__span-2">:</span>
              {taskData.description}
            </p>
          </div>
          <div className="d-flex align-items-center flex-nowrap task-new-accordion-text-block-1">
            <div className="task-new-accordion-text-block-1__colm1">
              <p className="task-new-accordion-date-text-1">
                <img
                  src="/img/desktop-dark-ui/icons/white-calendar-icon.svg"
                  alt=""
                />
                {dateFns.format(taskData.fromDate, "YYYY-MM-DD")}
                <span className="task-new-accordion-date-text-1__span-1">
                  to
                </span>
                {dateFns.format(taskData.toDate, "YYYY-MM-DD")}
              </p>
              <p className="task-new-accordion-assign-text-1 mb-0">
                <img
                  src="/img/desktop-dark-ui/icons/blue-profile-icon.svg"
                  alt=""
                />
                assigned by
                <span className="task-new-accordion-assign-text-1__span-1">
                  {!isEmpty(taskData.assignedBy) && taskData.assignedBy.name}
                </span>
              </p>
            </div>
            <div>
              <p className="font-36-regular font-36-regular--task color-white-79 text-center">
                {taskData.status === "COMPLETED" ? (
                  renderTextDeadline("Task Completed")
                ) : overDueCalculator(taskData.toDate).overdue < 0 ? (
                  <>
                    {overDueCalculator(taskData.toDate).diffDays}
                    {renderTextDeadline(text)}
                  </>
                ) : overDueCalculator(taskData.toDate).diffDays === 0 ? (
                  renderTextDeadline("Deadline Today")
                ) : overDueCalculator(taskData.toDate).diffDays === 1 ? (
                  <>
                    {overDueCalculator(taskData.toDate).diffDays}
                    {renderTextDeadline("Days to Deadline")}
                  </>
                ) : (
                  <>
                    {overDueCalculator(taskData.toDate).diffDays}
                    {renderTextDeadline("Days to Deadline")}
                  </>
                )}
              </p>
            </div>
          </div>
        </AccordionItemPanel>
      </AccordionItem>
    </>
  );
}
