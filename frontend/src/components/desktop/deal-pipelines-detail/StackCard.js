import React, { Component } from "react";
import { Link } from "react-router-dom";

export class StackCard extends Component {
  handleDelete = () => {
    console.log("Stack  Card Delete");
  };

  render() {
    const {
      viewLinkPath,
      editLinkPath,
      onDragStart,
      onDragEndHandler,
    } = this.props;
    return (
      <div
        onDragStart={onDragStart}
        onDragEndHandler={onDragEndHandler}
        className="stack-card-container"
      >
        <div className="row mx-0 stack-card-container-row1 flex-nowrap">
          <div className="stack-card-img-div">
            <img
              src={require("../../../assets/img/deal-pipelines/deal-profile-img.png")}
              alt="stack"
              className="stack-card-img"
            />
          </div>
          <div className="stack-card-row1-colm2">
            <h3 className="font-18-semibold stack-card-title">Deal Name</h3>
            <h4 className="font-16-medium stack-card-subtitle">Account name</h4>
          </div>
        </div>
        <div className="row mx-0 stack-card-row2 flex-nowrap">
          <h3 className="font-16-medium stack-card-subtitle">Lead Name:</h3>
          <h4 className="font-16-medium stack-card-data">Akhil Sharma</h4>
        </div>
        <div className="row mx-0 stack-card-row2 flex-nowrap">
          <h3 className="font-16-medium stack-card-subtitle">Assigned to:</h3>
          <h4 className="font-16-medium stack-card-data">Anjali</h4>
        </div>
        <div className="row justify-content-between pt-10 mx-0">
          <div className="trash-icon">
            <i className="fa fa-trash" onClick={this.handleDelete} />
          </div>
          <div>
            <Link to={viewLinkPath}>
              <span className="stack-card-btn stack-card-btn-view">View</span>
            </Link>
            <Link to={editLinkPath}>
              <span className="stack-card-btn stack-card-btn-edit">Edit</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default StackCard;
