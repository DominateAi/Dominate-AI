import React, { Component } from "react";
import { connect } from "react-redux";
import isEmpty from "../../../../store/validations/is-empty";

export class NotificationAlerts extends Component {
  constructor() {
    super();
    this.state = {};
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.allNotifications) &&
      nextProps.allNotifications !== nextState.allNotifications
    ) {
      return {
        allNotifications: nextProps.allNotifications,
      };
    }
    return null;
  }

  renderNotificationList = () => {
    const { allNotifications } = this.state;

    if (!isEmpty(allNotifications)) {
      return allNotifications.map((notification, index) => {
        return (
          <li key={index}>
            <img
              src={require("./../../../../assets/img/user-dashboard/notification.svg")}
              alt=""
            />
            {notification.notificationType === "LEAD_CREATED" ? (
              <div>
                <p>
                  {" "}
                  A new lead <span>{notification.notification.name}</span> has
                  been added{" "}
                </p>
              </div>
            ) : notification.notificationType === "MEETING_CREATED" ? (
              <div>
                <p>
                  {" "}
                  Scheduled meeting with{" "}
                  <span>
                    {!isEmpty(notification.notification.assigned) &&
                      notification.notification.assigned.name}
                  </span>{" "}
                  at 05:00 pm{" "}
                </p>
              </div>
            ) : notification.notificationType === "TASK_CREATED" ? (
              <div>
                <p> Task created </p>
              </div>
            ) : notification.notificationType === "TASK_UPDATED" ? (
              <div>
                <p> Task updated </p>
              </div>
            ) : notification.notificationType === "LEAVE_APPROVED" ? (
              <div>
                <p> Leave approved </p>
              </div>
            ) : (
              ""
            )}
          </li>
        );
      });
    } else {
      return (
        <div className="no_data_today">
          <img
            // src={require("../../../../assets/img/illustrations/dashboard-alerts.svg")}
            src="/img/desktop-dark-ui/illustrations/dashboard-alerts.svg"
            alt="no meetings"
            className="dashboard-alerts-empty-img"
          />
          <p className="dashboard-alerts-empty-text">No Alerts Yet</p>
        </div>
      );
    }
  };

  render() {
    // console.log(this.state.allNotifications);
    return (
      <div className="dashboard_notigfication_box">
        <h3 className="text-center">Alerts</h3>
        <ul>{this.renderNotificationList()}</ul>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  allNotifications: state.dashboard.allNotifications,
});

export default connect(mapStateToProps)(NotificationAlerts);
