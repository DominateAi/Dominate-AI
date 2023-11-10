import React, { useState, useEffect, Fragment } from "react";
import DropdownIcon from "rc-dropdown";
import Menu, { Item as MenuItem, Divider } from "rc-menu";
import { connect } from "react-redux";
import { deleteEmail } from "./../../../store/actions/leadsActivityAction";
import isEmpty from "./../../../store/validations/is-empty";
import dateFns from "date-fns";
import { useDispatch, useSelector } from "react-redux";

function ActivityContentEmailAllEmail({ leadActivityData }) {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    leadsAllEmails: [],
  });

  const leadsAllEmails = useSelector((state) => state.leads.email);

  useEffect(() => {
    if (!isEmpty(leadsAllEmails)) {
      setValues({
        ...values,
        leadsAllEmails: leadsAllEmails,
      });
    } else {
      setValues({
        ...values,
        leadsAllEmails: [],
      });
    }
  }, [leadsAllEmails]);

  /*=====================================
        handler
    ===================================== */
  const onVisibleChange = (visible) => {
    console.log(visible);
  };

  const onClickDeleteHandler = (emailData, leadId) => (e) => {
    e.preventDefault();
    dispatch(deleteEmail(emailData._id, leadId));
    // console.log(leadId);
  };

  const renderEmailDelete = (emailData) => {
    const menu = (
      <Menu>
        <MenuItem
          onClick={() => this.onSelect(emailData, leadActivityData._id)}
        >
          Archive
        </MenuItem>
      </Menu>
    );
    return (
      <DropdownIcon
        trigger={["click"]}
        overlay={menu}
        animation="none"
        onVisibleChange={this.onVisibleChange}
      >
        <img
          className="ac-email-edit-dropdown-img ml-70"
          src={require("./../../../assets/img/icons/Dominate-Icon_3dots.svg")}
          alt="dropdown menu"
        />
      </DropdownIcon>
    );
  };

  /*=====================================
        render card
    ===================================== */
  const renderCard = () => {
    const { leadsAllEmails } = values;
    let dataToken = JSON.parse(localStorage.getItem("Data"));
    return (
      <Fragment>
        {!isEmpty(leadsAllEmails) ? (
          leadsAllEmails.map((email, index) => {
            return (
              <div
                key={index}
                className="ac-activity-card ac-activity-card--email"
              >
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
                    <div className="row mx-0 flex-nowrap justify-content-between">
                      <h6 className="font-20-regular mr-30 whitespace-nowrap">
                        {dateFns.format(email.createdAt, "h:mm a")}
                      </h6>
                      <img
                        src={require("../../../assets/img/icons/Dominate-Icon_dustbin.svg")}
                        alt="delete"
                        className="ac-email-template-delete-img opacity-62"
                        onClick={onClickDeleteHandler(
                          email,
                          leadActivityData._id
                        )}
                      />
                    </div>
                  </div>
                  <div className="justify-content-space-between pr-70">
                    <p className="font-18-regular">{email.body}</p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
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
              No mails yet
            </p>
          </div>
        )}
      </Fragment>
    );
  };

  return <>{renderCard()}</>;
}

export default ActivityContentEmailAllEmail;
