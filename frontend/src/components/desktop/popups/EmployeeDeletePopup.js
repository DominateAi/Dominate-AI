import React from "react";
import isEmpty from "../../../store/validations/is-empty";
import Modal from "react-responsive-modal";

const EmployeeDeletePopup = ({
  empDeletePopup,
  employeeDeleteHandler,
  doEmailExist,
  onChangeCheckbox,
  toggle,
  onCloseModal,
  allUsers,
}) => {
  return (
    <div>
      <Modal
        open={empDeletePopup}
        onClose={() => console.log("unable to close")}
        closeOnEsc={true}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay",
          modal: "employee-delete-popup",
          closeButton: "customCloseButton",
        }}
      >
        <span className="closeIconInModal" onClick={onCloseModal} />
        <div className="paymentDeleteModalContentTitleBlock">
          <h1 className="paymentDeleteModalContentTitle">
            Downgrade your plan
          </h1>
        </div>
        <div className="paymentDeleteModalContent">
          <div className="paymentDeleteModalContent__textBlock">
            <p className="font-18-regular pb-10">
              You are exceeding the number of employees in your selected
              downgrade plan. We need you to achieve{" "}
              {/* <b>"{runningPlanEmployeeCreated - planMaxUsers}"</b>  */}1 of
              your employees
            </p>
            <h3 className="font-24-bold">Your Team</h3>
          </div>
          <ul>
            {!isEmpty(allUsers) &&
              allUsers.map((employee, index) => {
                return (
                  <li key={index}>
                    <input
                      type="checkbox"
                      onChange={onChangeCheckbox(employee.email)}
                      checked={
                        doEmailExist(employee.email) ||
                        doEmailExist(employee.email) === 0
                          ? true
                          : false
                      }
                    />
                    <img
                      src={require("./../../../assets/img/leads/ben-1.png")}
                      alt="employee-profile"
                    />
                    <div>
                      <h5 className="font-24-bold mb-10">{employee.name}</h5>
                      <h6 className="font-21-regular">{employee.jobTitle}</h6>
                    </div>
                  </li>
                );
              })}
          </ul>
          <div className="paymentDeleteModalContent__buttonBlock">
            <button onClick={onCloseModal} className="cancelBtnDeleteModal">
              Cancel
            </button>
            <button
              onClick={employeeDeleteHandler}
              className="cancelBtnDeleteModal cancelBtnDeleteModal--delete"
            >
              Archieve
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EmployeeDeletePopup;
