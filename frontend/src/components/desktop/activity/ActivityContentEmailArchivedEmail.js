import React from "react";
// import DropdownIcon from "rc-dropdown";
// import Menu, { Item as MenuItem, Divider } from "rc-menu";
import isEmpty from "./../../../store/validations/is-empty";
import dateFns from "date-fns";

function ActivityContentEmailArchivedEmail({ allArchiveMails }) {
  /*=====================================
        handler
    ===================================== */
  const onVisibleChange = (visible) => {
    console.log(visible);
  };

  /*=====================================
        render card
    ===================================== */
  const renderCard = () => {
    // console.log(this.props.allArchiveMails);
    let dataToken = JSON.parse(localStorage.getItem("Data"));
    if (!isEmpty(allArchiveMails)) {
      return allArchiveMails.map((email, index) => {
        return (
          <div key={index} className="ac-activity-card ac-activity-card--email">
            <div>
              <img
                className="ac-email-lead-img"
                src={`https://login.dominate.ai${email.organizer.profileImage}&token=${dataToken.token}`}
                alt="lead"
              />
            </div>
            <div className="w-100">
              <div className="justify-content-space-between mb-10 pr-70">
                <h6 className="font-18-semibold mr-30">{email.subject}</h6>
                <h6 className="font-20-regular whitespace-nowrap">
                  {" "}
                  {dateFns.format(email.createdAt, "h:mm a")}
                </h6>
              </div>
              <div className="justify-content-space-between pr-70">
                <p className="font-18-regular">{email.body}</p>
              </div>
            </div>
          </div>
        );
      });
    } else {
      return (
        <div className="leads-new-no-data-illustration-div">
          <div className="row mx-0 justify-content-center align-items-start">
            <img
              // src={require("../../../../src/assets/img/illustrations/leads-new-no-mails.svg")}
              src="/img/desktop-dark-ui/illustrations/leads-new-no-mails.svg"
              alt="no mails"
              className="leads-new-no-data-illustration-div__no-mails-img"
            />
          </div>
          <p className="font-18-medium color-white-79 mb-30 text-center">
            No mails found
          </p>
        </div>
      );
    }
  };

  return <>{renderCard()}</>;
}

export default ActivityContentEmailArchivedEmail;
