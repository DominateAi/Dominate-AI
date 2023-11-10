import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../common/CustomModalStyle.css";
import SkyLight from "react-skylight";
import { employeeBlockCardPopupAction } from "./../../../store/actions/employeeAction";
import { connect } from "react-redux";
import isEmpty from "./../../../store/validations/is-empty";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
export class EmployeeMainBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      singleCard: false,
    };
  }

  /*======================================
            Lifecycle Methods
  ========================================*/
  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.employeeBlockViewPopupData) &&
      nextProps.employeeBlockViewPopupData !==
        nextState.employeeBlockViewPopupData
    ) {
      return {
        employeeBlockViewPopupData: nextProps.employeeBlockViewPopupData,
      };
    }
    return null;
  }

  /*============================
        Model Events
  =============================*/

  onOpenModal = () => {
    this.setState({ open: true });
  };

  onCloseModal = () => {
    this.setState({
      open: false,
    });
  };

  crdToggler = (e) => {
    this.setState({
      singleCard: !this.state.singleCard,
    });
  };

  handleDelete = () => {
    console.log("clicked on delete icon");
  };

  /*==================================
      Block popup Hnalder
  ===================================*/
  onClickBlockHandler = (employeeData) => (e) => {
    e.preventDefault();
    console.log(employeeData);
    this.props.employeeBlockCardPopupAction(employeeData._id);
    this.animated.show();
  };

  render() {
    const { open } = this.state;
    const { employeeData } = this.props;
    // console.log(this.state.employeeBlockViewPopupData);
    const { employeeBlockViewPopupData } = this.state;
    return (
      <>
        {this.state.singleCard ? (
          <EmployeesSingleCard
            onClick={this.crdToggler}
            handleDelete={this.handleDelete}
          />
        ) : null}
        {!this.state.singleCard ? (
          <EmployeesBlockView
            onClick={this.onClickBlockHandler(employeeData)}
            profileImg={this.props.profileImg}
            name={this.props.name}
            position={this.props.position}
            status={employeeData.status}
          />
        ) : null}
        <SkyLight
          hideOnOverlayClicked
          ref={(ref) => (this.animated = ref)}
          title=""
          transitionDuration={1000}
        >
          <div className="employees-large-card-popup">
            <div className="row">
              <EmployeesSingleCard
                employeeData={employeeData}
                handleDelete={this.handleDelete}
                employeeBlockViewPopupData={employeeBlockViewPopupData}
              />
            </div>
          </div>
        </SkyLight>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  employeeBlockViewPopupData: state.employee.employeeBlockViewPopupData,
});

export default connect(mapStateToProps, { employeeBlockCardPopupAction })(
  EmployeeMainBlock
);

/*==============================
  Employee Block View func compo
================================*/

export const EmployeesBlockView = ({
  profileImg,
  name,
  position,
  status,
  onClick,
}) => {
  return (
    <div className="col-md-2" onClick={onClick}>
      <div className="employees-profile_card text-center">
        <img src={profileImg} alt="member" />
        <h3>{name}</h3>
        <p>{position}</p>
        <p>
          {status === "ACTIVE"
            ? "Active"
            : status === "INVITED"
            ? "Inactive"
            : status === "ARCHIVE"
            ? "Archive"
            : ""}
        </p>
      </div>
    </div>
  );
};

/*================================
 Employee Block View Single Card
==================================*/
export const EmployeesSingleCard = ({
  employeeData,
  onClick,
  handleDelete,
  employeeBlockViewPopupData,
}) => {
  console.log(employeeBlockViewPopupData);
  let dataToken = JSON.parse(localStorage.getItem("Data"));

  let dataInArray = [];
  if (employeeBlockViewPopupData) {
    dataInArray = employeeBlockViewPopupData;
  }
  const percentage = !isEmpty(dataInArray.conversionRate)
    ? dataInArray.conversionRate
    : 0;
  return (
    <div className="col-sm-12" onClick={onClick}>
      <div className="employees-large-card">
        <div className="text-center">
          <img
            src={`${employeeData.profileImage}&token=${dataToken.token}`}
            alt="employee"
            className="employees-large-card__profileImg"
          />
          <div className="button-section">
            <Link
              to={{
                pathname: "/employee-data",
                state: { detail: employeeData },
              }}
            >
              <button className="btn-funnel-view btn-funnel-view--activitySummary btn-funnel-view--emp">
                View Profile
              </button>
            </Link>

            <Link to="/message">
              <button className="btn-funnel-view btn-funnel-view--activitySummary btn-funnel-view--emp">
                Message
              </button>
            </Link>
            {/* <h2>Present today</h2> */}
          </div>
        </div>
        <div className="employee-card-content">
          <h2 className="font-30-medium mb-42">
            {employeeData.name}
            {/* <img
              src={require("../../../assets/img/icons/Dominate-Icon_dustbin-black.svg")}
              alt="delete"
              className="view-profile-icon-delete"
              onClick={handleDelete}
            /> */}
          </h2>
          <div className="current-task mb-42">
            <h3 className="font-26-semibold mb-21">Current task</h3>
            {!isEmpty(dataInArray.assignedTask)
              ? dataInArray.assignedTask.map((task, index) => {
                  return (
                    <p key={index} className="font-21-regular mb-21">
                      {task.name}
                    </p>
                  );
                })
              : "No task found"}
          </div>
          <div className="upcoming-leaves mb-42">
            <h3 className="font-26-semibold mb-21">Upcoming Leaves:</h3>
            {!isEmpty(dataInArray.upcomingLeaves)
              ? dataInArray.upcomingLeaves.map((leave, index) => {
                  return (
                    <p key={index} className="font-21-regular mb-21">
                      10th November
                    </p>
                  );
                })
              : "No upcoming leaves found"}
          </div>
        </div>
        <div className="lead-closure-rate-sphere text-center">
          {/* <div className="circle" /> */}
          <CircularProgressbar
            value={percentage}
            text={`${percentage}%`}
            styles={buildStyles({
              // Rotation of path and trail, in number of turns (0-1)
              rotation: 0.25,

              // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
              strokeLinecap: "round",

              // Text size
              textSize: "16px",

              // How long animation takes to go from one percentage to another, in seconds
              pathTransitionDuration: 0.5,

              // Can specify path transition in more detail, or remove it entirely
              // pathTransition: 'none',

              // Colors
              pathColor: `rgba(62, 152, 199, ${percentage / 100})`,
              // textColor: "#ffffff",
              trailColor: "#d6d6d6",
              backgroundColor: "#3e98c7",
            })}
          />
          <p className="font-18-medium">Lead closure rate</p>
        </div>
        <div className="attendance">
          <div className="leaves-taken text-center">
            <h3>{dataInArray.leavesTaken}</h3>
            <p>Leaves taken</p>
          </div>
          <div className="leads-assigned text-center">
            <h3>{dataInArray.leadsCount}</h3>
            <p>Leads assigned</p>
          </div>
        </div>
      </div>
    </div>
  );
};
