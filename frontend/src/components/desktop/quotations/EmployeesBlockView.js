import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../common/CustomModalStyle.css";
import SkyLight from "react-skylight";
export class EmployeeMainBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      singleCard: false
    };
  }

  /*============================
        Model Events
  =============================*/

  onOpenModal = () => {
    this.setState({ open: true });
  };

  onCloseModal = () => {
    this.setState({
      open: false
    });
  };

  crdToggler = e => {
    this.setState({
      singleCard: !this.state.singleCard
    });
  };

  handleDelete = () => {
    console.log("clicked on delete icon");
  };

  render() {
    const { open } = this.state;
    const { employeeData } = this.props;
    // console.log(this.props.employeeData);
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
            onClick={() => this.animated.show()}
            profileImg={this.props.profileImg}
            name={this.props.name}
            position={this.props.position}
          />
        ) : null}
        <SkyLight
          hideOnOverlayClicked
          ref={ref => (this.animated = ref)}
          title=""
          transitionDuration={1000}
        >
          <div className="employees-large-card-popup">
            <div className="row">
              <EmployeesSingleCard
                employeeData={employeeData}
                handleDelete={this.handleDelete}
              />
            </div>
          </div>
        </SkyLight>
      </>
    );
  }
}

export default EmployeeMainBlock;

/*==============================
  Employee Block View func compo
================================*/

export const EmployeesBlockView = ({ profileImg, name, position, onClick }) => {
  return (
    <div className="col-md-2" onClick={onClick}>
      <div className="employees-profile_card text-center">
        <img src={profileImg} alt="" />
        <h3>{name}</h3>
        <p>{position}</p>
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
  handleDelete
}) => {
  return (
    <div className="col-sm-12" onClick={onClick}>
      <div className="employees-large-card">
        <div className="text-center">
          <img
            src={require("./../../../assets/img/employees/employees.png")}
            alt="employee"
            className="employees-large-card__profileImg"
          />
          <div className="button-section">
            <Link
              to={{
                pathname: "/employee-data",
                state: { detail: employeeData }
              }}
            >
              <button className="btn-funnel-view btn-funnel-view--activitySummary btn-funnel-view--emp">
                View Profile
              </button>
            </Link>

            <button className="btn-funnel-view btn-funnel-view--activitySummary btn-funnel-view--emp">
              Message
            </button>
            <h2>Present today</h2>
          </div>
        </div>
        <div className="employee-card-content">
          <h2 className="font-30-medium mb-42">
            {employeeData.name}
            <img
              src={require("../../../assets/img/icons/Dominate-Icon_dustbin-black.svg")}
              alt="delete"
              className="view-profile-icon-delete"
              onClick={handleDelete}
            />
          </h2>
          <div className="current-task mb-42">
            <h3 className="font-26-semibold mb-21">Current task</h3>
            <p className="font-21-regular mb-21">Current task name</p>
            <p className="font-21-regular mb-21">Current task name</p>
          </div>
          <div className="upcoming-leaves mb-42">
            <h3 className="font-26-semibold mb-21">Upcoming Leaves:</h3>
            <p className="font-21-regular mb-21">10th November</p>
            <p className="font-21-regular mb-21">10th November</p>
          </div>
        </div>
        <div className="lead-closure-rate-sphere text-center">
          <div className="circle" />
          <p className="font-18-medium">Lead closure rate</p>
        </div>
        <div className="attendance">
          <div className="leaves-taken text-center">
            <h3>02</h3>
            <p>Leaves taken</p>
          </div>
          <div className="leads-assigned text-center">
            <h3>35</h3>
            <p>Leads assigned</p>
          </div>
        </div>
      </div>
    </div>
  );
};
