import React, { Component, Fragment } from "react";
import Scrollspy from "react-scrollspy";
import Navbar from "../header/Navbar";
import SalesCentreMenuCard from "./SalesCentreMenuCard";
import { workspaceId } from "./../../../store/actions/config";

// api
import { connect } from "react-redux";
import {
  getOrganizationDetaisAction,
  logoutUser,
  updateUserAfterLogout,
} from "./../../../store/actions/authAction";
import { SET_PAGETITLE } from "./../../../store/types";
import store from "./../../../store/store";
import OverviewDemoNewSalesCentre1 from "../overview-demo-new/OverviewDemoNewSalesCentre1";
import OverviewDemoNewSalesCentre2 from "../overview-demo-new/OverviewDemoNewSalesCentre2";
import OverviewDemoNewSalesCentre3 from "../overview-demo-new/OverviewDemoNewSalesCentre3";
import OverviewDemoNewSalesCentre4 from "../overview-demo-new/OverviewDemoNewSalesCentre4";
import BreadcrumbMenu from "../header/BreadcrumbMenu";

const engage = [
  // {
  //   link: "/sales-contacts",
  //   // img: require("../../../assets/img/sales-centre/new-contacts-menu-icon.svg"),
  //   img: "/img/desktop-dark-ui/sales-centre/sales-contacts.png",
  //   title: "Contacts",
  // },
  // {
  //   link: "/mailbox",
  //   // img: require("../../../assets/img/sales-centre/new-mailbox-menu-icon.svg"),
  //   img: "/img/desktop-dark-ui/sales-centre/sales-mailbox.png",
  //   title: "Mailbox",
  // },
  // {
  //   link: "/presentations",
  //   // img: require("../../../assets/img/sales-centre/new-proposals-menu-icon.svg"),
  //   img: "/img/desktop-dark-ui/sales-centre/sales-presentation.png",
  //   title: "Presentations",
  // },
  {
    link: "/quotations",
    // img: require("../../../assets/img/sales-centre/new-quotations-menu-icon.svg"),
    img: "/img/desktop-dark-ui/sales-centre/sales-estimates.png",
    title: "Estimates",
  },
  // {
  //   link: "/proposals-by-craft",
  //   // img: require("../../../assets/img/sales-centre/new-proposal-craftjs.png"),
  //   img: "/img/desktop-dark-ui/sales-centre/sales-proposals.png",
  //   title: "Proposals",
  // },
];

const track = [
  {
    // link: "/accounts",
    link: "/accounts-new",
    // img: require("../../../assets/img/sales-centre/new-account-menu-icon.svg"),
    img: "/img/desktop-dark-ui/sales-centre/sales-accounts.png",
    title: "Accounts",
  },
  {
    link: "/leads-pipeline",
    // img: require("../../../assets/img/sales-centre/new-leads-menu-icon.svg"),
    img: "/img/desktop-dark-ui/sales-centre/sales-leads-pipeline.png",
    title: "Leads Pipeline",
  },
  {
    link: "/deal-pipelines",
    // img: require("../../../assets/img/sales-centre/new-deal-pipelines-menu-icon.svg"),
    img: "/img/desktop-dark-ui/sales-centre/sales-deal-pipelines.png",
    title: "Deal Pipelines",
  },
  {
    link: "/products-and-services",
    // img: require("../../../assets/img/sales-centre/new-services&product.png"),
    img: "/img/desktop-dark-ui/sales-centre/sales-product-and-services.png",
    title: "Products & Services",
  },
];

// const prospect = [
//   //  {
//   //    link: "/linkedin-search",
//   //    //img: require("../../../assets/img/sales-centre/domain-based-menu-icon.svg"),
//   //    img: require("../../../assets/img/sales-centre/new-linkedin-search-menu-icon.svg"),
//   //    title: "Lead Search",
//   //  },
//   //  {
//   //    link: "/domain-based",
//   //    //img: require("../../../assets/img/sales-centre/domain-based-menu-icon.svg"),
//   //    img: require("../../../assets/img/sales-centre/new-domain-based-menu-icon.svg"),
//   //    title: "Domain Based",
//   //  },
//   //  {
//   //    link: "/intent-based",
//   //    //img: require("../../../assets/img/sales-centre/intent-based-menu-icon.svg"),
//   //    img: require("../../../assets/img/sales-centre/new-intent-based-menu-icon.svg"),
//   //    title: "Intent Based",
//   //  },
//   {
//     link: "/find-look-alike",
//     //img: require("../../../assets/img/sales-centre/find-look-alike-menu-icon.svg"),
//     img: require("../../../assets/img/sales-centre/new-find-look-alike-menu-icon.svg"),
//     title: "Find Look-alike",
//   },
//   {
//     link: "/email-data-scrape",
//     //img: require("../../../assets/img/sales-centre/email-scrape-menu-icon.svg"),
//     img: require("../../../assets/img/sales-centre/new-email-scrape-menu-icon.svg"),
//     title: "Email Data Scrape",
//   },
// ];

// const capture = [
//   {
//     link: "/sales-centre",
//     img: require("../../../assets/img/sales-centre/web-form-menu-icon.svg"),
//     title: "Web Form",
//   },
//   {
//     link: "/sales-centre",
//     img: require("../../../assets/img/sales-centre/chat-window-menu-icon.svg"),
//     title: "Chat Window",
//   },
// ];

const automate = [
  {
    link: "/email-sequence",
    // img: require("../../../assets/img/sales-centre/new-email-sequence-menu-icon.svg"),
    img: "/img/desktop-dark-ui/sales-centre/sales-email-sequencing.png",
    title: "Email Sequencing",
  },
  //{
  //  link: "/sales-centre",
  //  img: require("../../../assets/img/sales-centre/workflow-menu-icon.svg"),
  //  title: "Workflow",
  //},
];

export class SalesCentreMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  /*===========================================================
    lifecycle methods
  ===========================================================*/

  componentDidMount() {
    store.dispatch({
      type: SET_PAGETITLE,
      payload: "Sales Centre",
    });
  }

  onClickMailboxHanlder = () => {
    console.log("sd");

    //variables
    var LastReportGenerated = "Jul 11 2013",
      baseDomain = ".dominate.ai",
      expireAfter = new Date();

    //setting up  cookie expire date after a week
    expireAfter.setDate(expireAfter.getDate() + 7);

    //now setup cookie
    document.cookie =
      "workspace=" +
      workspaceId +
      "; domain=" +
      baseDomain +
      "; expires=" +
      expireAfter +
      "; path=/";

    window.location.href = "https://login.dominate.ai/mailbox";
  };

  /*===========================================================
    main
  ===========================================================*/

  render() {
    return (
      <div>
        <Navbar {...this.props} />

        <BreadcrumbMenu
          extraClassName="breadcrumb-menu--salesCentre"
          menuObj={[
            {
              title: "Sales Centre",
            },
          ]}
        />

        {this.props.activeWalkthroughPage === "sales-centre-1" && (
          <OverviewDemoNewSalesCentre1 />
        )}

        {this.props.activeWalkthroughPage === "sales-centre-2" && (
          <OverviewDemoNewSalesCentre2 />
        )}

        {(this.props.activeWalkthroughPage === "sales-centre-3" ||
          localStorage.getItem("activeWalkthrough") === "sales-centre-3") && (
          <>
            <OverviewDemoNewSalesCentre3 />
          </>
        )}

        {(this.props.activeWalkthroughPage === "sales-centre-4" ||
          localStorage.getItem("activeWalkthrough") === "sales-centre-4") && (
          <>
            <OverviewDemoNewSalesCentre4 />
          </>
        )}

        <div className="sales-centre-scrollspy__main-div">
          <div className="sales-centre-scrollspy__menus-fixed pt-0">
            <h2 className="page-title-new pl-0">Sales Centre</h2>
            <p className="sales-centre-scrollspy__page-title-2">
              Collection Of Sales Tools To Help You Sell Better
            </p>
            {/* <div className="text-center">
              <img
                src={require("../../../assets/img/logo-new/new-dominate-small-logo.svg")}
                alt="dominate"
                className="sales-center-dominate-logo"
              />
              <h3 className="sales-centre-scrollspy__page-title-1">
                Welcome to Dominate's Sales Centre
              </h3> */}

            {/* </div> */}

            <div
              className={
                this.props.activeWalkthroughPage === "sales-centre-1"
                  ? "sales-centre-scrollspy__menus new-walkthrough-sales-centre-active"
                  : "sales-centre-scrollspy__menus"
              }
            >
              <Scrollspy
                items={[
                  "engage",
                  "track",
                  // "prospect",
                  // "capture",
                  // "automate",
                ]}
                // currentClassName="is-current"
              >
                <li
                  className={
                    this.props.history.location.hash === "#engage"
                      ? "is-current"
                      : ""
                  }
                >
                  <a
                    href="#engage"
                    className="font-20-medium sales-centre-scrollspy__menus-link"
                  >
                    Engage
                  </a>
                </li>
                <li
                  className={
                    this.props.history.location.hash === "#track"
                      ? "is-current"
                      : ""
                  }
                >
                  <a
                    href="#track"
                    className="font-20-medium sales-centre-scrollspy__menus-link"
                  >
                    Track
                  </a>
                </li>
                {/* <li
                  className={
                    this.props.history.location.hash === "#prospect"
                      ? "is-current"
                      : ""
                  }
                >
                  <a
                    href="#prospect"
                    className="font-20-medium sales-centre-scrollspy__menus-link"
                  >
                    Prospect
                  </a>
                </li> */}
                {/* <li
                  className={
                    this.props.history.location.hash === "#capture"
                      ? "is-current"
                      : ""
                  }
                >
                  <a
                    href="#capture"
                    className="font-20-medium sales-centre-scrollspy__menus-link"
                  >
                    Capture
                  </a>
                </li>*/}
                {/* <li
                  className={
                    this.props.history.location.hash === "#automate"
                      ? "is-current"
                      : ""
                  }
                >
                  <a
                    href="#automate"
                    className="font-20-medium sales-centre-scrollspy__menus-link"
                  >
                    Automate
                  </a>
                </li> */}
              </Scrollspy>
            </div>
          </div>

          <div className="sales-centre-scrollspy__sections">
            <section id="engage">
              <div className="sales-centre-scrollspy__sections-blue-text-div">
                <h3 className="sales-centre-scrollspy__sections-blue-text">
                  Engage
                </h3>
              </div>
              <div className="sales-centre-scrollspy__section-cards-div">
                {process.env.NODE_ENV !== "development"
                  ? engage.map((data, index) =>
                      data.title === "Mailbox" ? (
                        <SalesCenterMailboxCard
                          key={index}
                          img={data.img}
                          title={data.title}
                          onClickMailboxHanlder={this.onClickMailboxHanlder}
                        />
                      ) : (
                        <Fragment key={index}>
                          <SalesCentreMenuCard
                            link={data.link}
                            img={data.img}
                            title={data.title}
                          />
                        </Fragment>
                      )
                    )
                  : engage.map((data, index) => (
                      <Fragment key={index}>
                        <SalesCentreMenuCard
                          link={data.link}
                          img={data.img}
                          title={data.title}
                        />
                      </Fragment>
                    ))}
              </div>
            </section>
            <section id="track">
              <div className="sales-centre-scrollspy__sections-blue-text-div">
                <h3 className="sales-centre-scrollspy__sections-blue-text">
                  Track
                </h3>
              </div>
              <div className="sales-centre-scrollspy__section-cards-div">
                {track.map((data, index) => (
                  <Fragment key={index}>
                    <SalesCentreMenuCard
                      link={data.link}
                      img={data.img}
                      title={data.title}
                      extraClassName={
                        (this.props.activeWalkthroughPage ===
                          "sales-centre-2" &&
                          data.title === "Accounts") ||
                        ((this.props.activeWalkthroughPage ===
                          "sales-centre-3" ||
                          localStorage.getItem("activeWalkthrough") ===
                            "sales-centre-3") &&
                          data.title === "Leads") ||
                        ((this.props.activeWalkthroughPage ===
                          "sales-centre-4" ||
                          localStorage.getItem("activeWalkthrough") ===
                            "sales-centre-4") &&
                          data.title === "Deal Pipelines")
                          ? "new-walkthrough-sales-centre-menu-active"
                          : ""
                      }
                    />
                  </Fragment>
                ))}
              </div>
            </section>
            {/* <section id="prospect">
              <div className="sales-centre-scrollspy__sections-blue-text-div">
                <h3 className="sales-centre-scrollspy__sections-blue-text">
                  Prospect
                </h3>
              </div>
              <div className="sales-centre-scrollspy__section-cards-div">
                {prospect.map((data, index) => (
                  <Fragment key={index}>
                    <SalesCentreMenuCard
                      link={data.link}
                      img={data.img}
                      title={data.title}
                    />
                  </Fragment>
                ))}
              </div>
            </section> */}
            {/* <section id="capture">
              <div className="sales-centre-scrollspy__sections-blue-text-div">
                <h3 className="sales-centre-scrollspy__sections-blue-text">
                  Capture
                </h3>
              </div>
              <div className="sales-centre-scrollspy__section-cards-div">
                {capture.map((data, index) => (
                  <Fragment key={index}>
                    <SalesCentreMenuCard
                      link={data.link}
                      img={data.img}
                      title={data.title}
                    />
                  </Fragment>
                ))}
              </div>
                </section>*/}
            {/* <section id="automate">
              <div className="sales-centre-scrollspy__sections-blue-text-div">
                <h3 className="sales-centre-scrollspy__sections-blue-text">
                  Automate
                </h3>
              </div>
              <div className="sales-centre-scrollspy__section-cards-div">
                {automate.map((data, index) => (
                  <Fragment key={index}>
                    <SalesCentreMenuCard
                      link={data.link}
                      img={data.img}
                      title={data.title}
                    />
                  </Fragment>
                ))}
              </div>
            </section> */}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  userPayload: state.auth.user,
  activeWalkthroughPage: state.auth.activeWalkthroughPage,
});

export default connect(mapStateToProps, {
  getOrganizationDetaisAction,
  logoutUser,
  updateUserAfterLogout,
})(SalesCentreMenu);

export const SalesCenterMailboxCard = ({
  img,
  title,
  onClickMailboxHanlder,
}) => {
  return (
    <div
      className={"sales-centre-scrollspy__card-link sales_center_mailbox_card"}
    >
      <div
        onClick={onClickMailboxHanlder}
        className="sales-centre-scrollspy__card"
      >
        <div className="sales-centre-scrollspy__card-img-div">
          <img src={img} alt={title} />
        </div>
        <p className="font-20-medium sales-centre-scrollspy__card-text">
          {title}
        </p>
      </div>
    </div>
  );
};
