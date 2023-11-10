import React, { Component, Fragment } from "react";
import ActivitySummaryEmojiText from "../common/ActivitySummaryEmojiText";
import ActivitySummaryImgText from "../common/ActivitySummaryImgText";
import isEmpty from "./../../../store/validations/is-empty";

class EmployeesDataActivitySummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // require for responsive window
      windowWidth: window.innerWidth
    };
  }

  /*========================================================
                mobile view event handlers
  ========================================================*/

  componentDidMount() {
    window.addEventListener("resize", this.handleWindowResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleWindowResize);
  }

  handleWindowResize = () => {
    this.setState({
      windowWidth: window.innerWidth
    });
  };

  /*========================================================
                end mobile view event handlers
  ========================================================*/

  handleOnClick = () => {
    console.log("button clicked");
  };

  /*=========================
    Render Buttons
 ==========================*/
  renderActivityPageBtn = () => {
    const LeadProfileBtn = (
      <Fragment>
        {/* buttons */}

        <div>
          <button
            className="btn-funnel-view btn-funnel-view--activitySummary"
            onClick={this.handleOnClick}
          >
            Call
          </button>

          <button
            className="btn-funnel-view btn-funnel-view--activitySummary mr-0"
            onClick={this.handleOnClick}
          >
            Create Mail
          </button>

          <button
            className="btn-funnel-view btn-funnel-view--activitySummary"
            onClick={this.handleOnClick}
          >
            View Profile
          </button>

          <button
            className="btn-funnel-view btn-funnel-view--activitySummary mr-0"
            onClick={this.handleOnClick}
          >
            Follow up
          </button>
        </div>
      </Fragment>
    );

    const employeeDatabtn = (
      <Fragment>
        {/* buttons */}

        <div className="text-center">
          <button
            className="btn-funnel-view btn-funnel-view--activitySummary"
            onClick={this.handleOnClick}
          >
            Message Alex
          </button>
        </div>
      </Fragment>
    );

    return <Fragment>{employeeDatabtn}</Fragment>;
  };

  /*=========================
    Render About info
 ==========================*/

  // renderAbout = () => {
  //   const { employeeData } = this.props;
  //   return (
  //     <div className="activity-summary-about">
  //       <h6 className="font-21-semibold">About</h6>
  //       <p className="font-18-regular">{employeeData.about}</p>
  //     </div>
  //   );
  // };

  /*=========================
    Render Contact info
 ==========================*/

  rendeConatct = () => {
    const { employeeData } = this.props;
    const mobileClassNameContactBlock =
      this.state.windowWidth >= 768
        ? "activity-summary-about"
        : "activity-summary-about activity-summary-about__mobileDisplay";
    return (
      <div className={mobileClassNameContactBlock}>
        {this.state.windowWidth >= 768 && (
          <h6 className="font-21-semibold">Contact</h6>
        )}
        {/* <ActivitySummaryEmojiText
          emojiClassName="summary-outlookImg"
          emoji="&#128222;"
          alt="Telephone Receiver"
          text={employeeData.phone}
          link="tel:&#43;91 8410920987"
          rel={null}
        /> */}

        <ActivitySummaryEmojiText
          emojiClassName="summary-outlookImg"
          emoji="&#128231;"
          alt="E-Mail"
          text={employeeData.email}
          link="mailto:xyz&#64;tezt&#46;com"
          rel={null}
        />

        {/* <ActivitySummaryImgText
          imgClassName="summary-gmailImg"
          imgPath={require("../../../assets/img/icons/Dominate-Icon_gmail.png")}
          alt="gmail"
          text={leadActivityData.email}
          link="mailto:xyz&#64;gmail&#46;com"
          rel={null}
        /> */}

        {/* {this.state.windowWidth >= 768 &&
          isEmpty(employeeData.media[0].other) && (
            <ActivitySummaryImgText
              imgClassName="summary-outlookImg"
              imgPath={require("../../../assets/img/icons/Dominate-Icon_outlook.png")}
              alt="outlook"
              text="xyz&#64;outlook&#46;com"
              link="mailto:xyz&#64;outlook&#46;com"
              rel={null}
            />
          )} */}
      </div>
    );
  };

  /*=========================
        Render Location
  ==========================*/

  // renderLocation = () => {
  //   const { employeeData } = this.props;
  //   return (
  //     <div className="activity-summary-about">
  //       <h6 className="font-21-semibold">Location</h6>
  //       <a
  //         className="contact-content-block summary-border-bottom"
  //         href="https://www.google.com/maps"
  //         rel="noopener noreferrer"
  //         target="_blank"
  //       >
  //         <div className="contact-content-block__imgDiv">
  //           <span
  //             className="summaryLocation"
  //             role="img"
  //             aria-labelledby="location"
  //           >
  //             &#128205;
  //           </span>
  //         </div>
  //         <div className="summaryLocationText">
  //           <span className="font-18-regular">
  //             {isEmpty(employeeData.billingAddress)
  //               ? "Address not added"
  //               : employeeData.billingAddress +
  //                 "," +
  //                 employeeData.shippingAddress.pincode}
  //           </span>
  //         </div>
  //       </a>
  //     </div>
  //   );
  // };

  /*=========================
    Render Contact info
 ==========================*/
  // renderSocialMedia = () => {
  //   const { employeeData } = this.props;
  //   if (
  //     isEmpty(employeeData.media[0].linkedIn) &&
  //     isEmpty(employeeData.media[0].instagram) &&
  //     isEmpty(employeeData.media[0].facebook) &&
  //     isEmpty(employeeData.media[0].other)
  //   ) {
  //     return (
  //       <div className="activity-summary-about">
  //         <h6 className="font-21-semibold">Social media</h6>
  //         <div className="pb-16">
  //           <p>No social Media Found</p>
  //         </div>
  //       </div>
  //     );
  //   } else {
  //     return (
  //       <div className="activity-summary-about">
  //         <h6 className="font-21-semibold">Social media</h6>
  //         <div className="pb-16">
  //           {!isEmpty(employeeData.media[0].facebook) && (
  //             <ActivitySummaryImgText
  //               imgClassName="summary-outlookImg"
  //               imgPath={require("../../../assets/img/icons/Dominate-Icon_facebook.png")}
  //               alt="facebook"
  //               text="xyz&#64;tezt&#46;com"
  //               link="http://www.facebook.com/"
  //               rel="noopener noreferrer"
  //             />
  //           )}
  //         </div>

  //         <div className="pb-16">
  //           {!isEmpty(employeeData.media[0].instagram) && (
  //             <ActivitySummaryImgText
  //               imgClassName="summary-outlookImg"
  //               imgPath={require("../../../assets/img/icons/Dominate-Icon_instagram.png")}
  //               alt="instagram"
  //               text={employeeData.media[0].instagram}
  //               link="https://www.instagram.com/"
  //               rel="noopener noreferrer"
  //             />
  //           )}
  //         </div>
  //         <div className="pb-16">
  //           {!isEmpty(employeeData.media[0].linkedIn) && (
  //             <ActivitySummaryImgText
  //               imgClassName="summary-outlookImg"
  //               imgPath={require("../../../assets/img/icons/Dominate-Icon_linkedin.svg")}
  //               alt="linkedIn"
  //               text={employeeData.media[0].linkedIn}
  //               link="https://www.linkedin.com/"
  //               rel="noopener noreferrer"
  //             />
  //           )}
  //         </div>
  //         <div className="pb-16">
  //           {!isEmpty(employeeData.media[0].other) && (
  //             <ActivitySummaryEmojiText
  //               emojiClassName="summary-outlookImg"
  //               emoji="&#128231;"
  //               alt="other"
  //               text={employeeData.media[0].other}
  //               link="https://www.instagram.com/"
  //               rel={null}
  //             />
  //           )}
  //         </div>
  //       </div>
  //     );
  //   }
  // };

  render() {
    const { employeeData } = this.props;
    return (
      <div>
        {/* desktop view */}
        {this.state.windowWidth >= 768 && (
          <>
            {/* title */}
            <div className="activity-title-img-text">
              <img
                src={require("../../../assets/img/leads/ben-1.png")}
                alt="person"
                className="activity-page-lead-img"
              />
              <h3 className="font-24-semibold">{employeeData.name}</h3>
            </div>

            {/* buttons */}
            {this.renderActivityPageBtn()}

            {/* about */}
            {/* {this.renderAbout()} */}
          </>
        )}

        {/* mobile view */}
        {this.state.windowWidth <= 767 && (
          <div className="d-flex align-items-end mb-61">
            {/* title */}
            <div className="mr-30 text-center">
              <img
                src={require("../../../assets/img/leads/ben-1.png")}
                alt="person"
                className="resp-activity-page-lead-img"
              />
              <h3 className="font-24-semibold">Alex Heard</h3>
            </div>

            {/* buttons */}
            {this.renderActivityPageBtn()}
          </div>
        )}

        {/* contact */}
        {this.rendeConatct()}

        {/* desktop view */}
        {this.state.windowWidth >= 768 && (
          <>
            {/* location */}
            {/* {this.renderLocation()} */}

            {/* social media */}
            {/* {this.renderSocialMedia()} */}
          </>
        )}

        {/* mobile view */}
        {this.state.windowWidth <= 767 && (
          <>
            {/* about */}
            {/* {this.renderAbout()} */}
          </>
        )}
      </div>
    );
  }
}

export default EmployeesDataActivitySummary;
