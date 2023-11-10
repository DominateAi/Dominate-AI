import React, { Component } from "react";
import isEmpty from "./../../../store/validations/is-empty";
import ProfileImageUploadModal from "./ProfileImageUploadModal";
import dateFns from "date-fns";
import BreadcrumbMenu from "../header/BreadcrumbMenu";
// import OverviewDemoModal from "../overview-demo/OverviewDemoModal";

export class ProfileSummary extends Component {
  render() {
    const { userData } = this.props;
    return (
      <>
        <div className="row align-items-start justify-content-between profile-page-new-fold-1">
          <div>
            <BreadcrumbMenu
              menuObj={[
                {
                  title: "Profile",
                },
              ]}
            />

            <h2 className="page-title-new pl-0">Profile</h2>
          </div>
          <div className="row mx-0 align-items-center">
            <div className="activity-title-img-text">
              <ProfileImageUploadModal
                isMobile={false}
                userData={!isEmpty(userData) && this.props.userData}
              />
            </div>
            <div className="profile-page-new-fold-1__colm2">
              <h3 className="font-24-semibold mb-30">
                {!isEmpty(userData) && this.props.userData.name}
              </h3>
              <div className="row mx-0 align-items-center">
                <div className="profile-page-new-fold-1__colm2__colm1">
                  <p className="profile-page-new-fold-1__text1">
                    {!isEmpty(userData) && this.props.userData.role.name}
                  </p>
                  <p className="profile-page-new-fold-1__text2">
                    {!isEmpty(userData) && this.props.userData.email}
                  </p>
                </div>
                <div className="profile-page-new-fold-1__colm2__colm2">
                  <div className="row mx-0 align-items-center">
                    <h4 className="profile-page-new-fold-1__text3">
                      workspace name
                    </h4>
                    <p className="profile-page-new-fold-1__text4">
                      {!isEmpty(userData) && this.props.userData.workspaceId}
                      .dominate.com
                    </p>
                  </div>
                  <div className="row mx-0 align-items-center">
                    <h4 className="profile-page-new-fold-1__text3">
                      plan valid until
                    </h4>
                    <p className="profile-page-new-fold-1__text4">
                      {dateFns.format(
                        userData.tenantExpiryDate,
                        "Do MMMM YYYY"
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default ProfileSummary;
