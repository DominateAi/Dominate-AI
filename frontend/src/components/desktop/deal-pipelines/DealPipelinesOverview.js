import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AddNewPipeline from "./AddNewPipeline";

import SingleOverviewBlock from "./../../desktop/common/SingleOverviewBlock";
import isEmpty from "../../../store/validations/is-empty";
import { useSelector } from "react-redux";

function DealPipelinesOverview() {
  const [values, setValues] = useState({
    //  require for responsive window
    windowWidth: window.innerWidth,
    dealsOverview: [],
  });

  const dealsOverview = useSelector((state) => state.deals.dealsOverview);
  const activeWalkthroughPage = useSelector(
    (state) => state.auth.activeWalkthroughPage
  );

  useEffect(() => {
    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  useEffect(() => {
    if (!isEmpty(dealsOverview)) {
      setValues({
        ...values,
        dealsOverview: dealsOverview,
      });
    }
  }, [dealsOverview]);

  /*========================================================
                mobile view event handlers
  ========================================================*/

  const handleWindowResize = () => {
    setValues({
      ...values,
      windowWidth: window.innerWidth,
    });
  };

  /*========================================================
                end mobile view event handlers
  ========================================================*/

  /*========================================================
        handlers        
  ========================================================*/

  const onClickAccountOverviewFilter = (level) => {
    console.log(level);
  };

  let settings = {
    dots: false,
    multiple: true,
    infinite: true,
    speed: 500,
    draggable: false,
    slidesToShow: 2,
    slidesToScroll: 2,
    className: "widgetListSlider",
  };

  const block1 = (
    <SingleOverviewBlock
      onClick={() => onClickAccountOverviewFilter("Deal Pipelines")}
      count={
        !isEmpty(values.dealsOverview) &&
        !isEmpty(values.dealsOverview.dealsCount)
          ? `${values.dealsOverview.dealsCount}`
          : 0
      }
      status={"Total Deals"}
      blockClassName={"leads-gradient-block bg-color-account1"}
    />
  );

  const block2 = (
    <SingleOverviewBlock
      onClick={() => onClickAccountOverviewFilter("Deal Pipelines")}
      count={
        !isEmpty(values.dealsOverview) &&
        !isEmpty(values.dealsOverview.closedDeals)
          ? `${values.dealsOverview.closedDeals}`
          : 0
      }
      status={"Total Closed Deals"}
      blockClassName={"leads-gradient-block bg-color-account2"}
    />
  );

  const block3 = (
    <SingleOverviewBlock
      onClick={() => onClickAccountOverviewFilter("Deal Pipelines")}
      count={
        !isEmpty(values.dealsOverview) &&
        !isEmpty(values.dealsOverview.recurringDeals)
          ? `${values.dealsOverview.recurringDeals}`
          : 0
      }
      status={"Total reoccurring deals"}
      blockClassName={"leads-gradient-block bg-color-account3"}
    />
  );

  const block4 = (
    <SingleOverviewBlock
      onClick={() => onClickAccountOverviewFilter("Deal Pipelines")}
      count={
        !isEmpty(values.dealsOverview) &&
        !isEmpty(values.dealsOverview.upcomingRevenue)
          ? `${values.dealsOverview.upcomingRevenue}`
          : 0
      }
      status={"Expected upcoming revenue"}
      blockClassName={"leads-gradient-block bg-color-account4"}
    />
  );

  return (
    <>
      {values.windowWidth >= 768 && (
        <div className="quotation-new-container">
          <div className="row mx-0 align-items-center justify-content-between">
            <div className="row mx-0 align-items-center">
              <button
                className="go-back-yellow-arrow-new-leads"
                onClick={(e) => (
                  (window.location.href = "/sales-centre#track"),
                  e.preventDefault()
                )}
              >
                <img
                  src="/img/desktop-dark-ui/icons/white-back-arrow-circle.svg"
                  alt="prev arrow"
                />
              </button>

              <h2 className="page-title-new pl-0">Deal Pipelines</h2>
            </div>
            <div
              className={
                activeWalkthroughPage === "deal-pipelines-1" &&
                "new-walkthrough-accounts-add-btn-active"
              }
            >
              <AddNewPipeline isMobile={false} />
            </div>
          </div>
          <hr className="page-title-border-bottom page-title-border-bottom--quotation" />

          <div className="gradient-block-container quotation-new-container__gradient-div">
            {block1}
            {block2}
            {block3}
            {block4}
          </div>
        </div>
      )}

      {values.windowWidth <= 767 && (
        <div className="leads-mobile-overview-block">
          <Slider {...settings}>
            {block1}
            {block2}
            {block3}
            {block4}
          </Slider>
        </div>
      )}
    </>
  );
}

export default DealPipelinesOverview;

// import React, { Component } from "react";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import AddNewPipeline from "./AddNewPipeline";

// import SingleOverviewBlock from "./../../desktop/common/SingleOverviewBlock";
// import { connect } from "react-redux";
// import isEmpty from "../../../store/validations/is-empty";

// class DealPipelinesOverview extends Component {
//   constructor() {
//     super();
//     this.state = {
//       // require for responsive window
//       windowWidth: window.innerWidth,
//     };
//   }

//   static getDerivedStateFromProps(nextProps, nextState) {
//     if (
//       !isEmpty(nextProps.dealsOverview) &&
//       nextProps.dealsOverview !== nextState.dealsOverview
//     ) {
//       return {
//         dealsOverview: nextProps.dealsOverview,
//       };
//     }
//     return null;
//   }

//   /*================================
//           Lifecycle method
//   =================================*/

//   componentDidMount() {
//     window.addEventListener("resize", this.handleWindowResize);
//   }

//   /*========================================================
//                 mobile view event handlers
//   ========================================================*/

//   componentWillUnmount() {
//     window.removeEventListener("resize", this.handleWindowResize);
//   }

//   handleWindowResize = () => {
//     this.setState({
//       windowWidth: window.innerWidth,
//     });
//   };

//   /*========================================================
//                 end mobile view event handlers
//   ========================================================*/

//   /*========================================================
//         handlers
//   ========================================================*/

//   onClickAccountOverviewFilter = (level) => {
//     console.log(level);
//   };

//   /*========================================================
//         main
//   ========================================================*/
//   render() {
//     const { dealsOverview } = this.state;
//     // settings for slider
//     let settings = {
//       dots: false,
//       multiple: true,
//       infinite: true,
//       speed: 500,
//       draggable: false,
//       slidesToShow: 2,
//       slidesToScroll: 2,
//       className: "widgetListSlider",
//     };

//     const block1 = (
//       <SingleOverviewBlock
//         onClick={() => this.onClickAccountOverviewFilter("Deal Pipelines")}
//         count={!isEmpty(dealsOverview) && dealsOverview.dealsCount}
//         status={"Total Deals"}
//         blockClassName={"leads-gradient-block bg-color-account1"}
//       />
//     );

//     const block2 = (
//       <SingleOverviewBlock
//         onClick={() => this.onClickAccountOverviewFilter("Deal Pipelines")}
//         count={!isEmpty(dealsOverview) && dealsOverview.closedDeals}
//         status={"Total Closed Deals"}
//         blockClassName={"leads-gradient-block bg-color-account2"}
//       />
//     );

//     const block3 = (
//       <SingleOverviewBlock
//         onClick={() => this.onClickAccountOverviewFilter("Deal Pipelines")}
//         count={!isEmpty(dealsOverview) && dealsOverview.recurringDeals}
//         status={"Total reoccurring deals"}
//         blockClassName={"leads-gradient-block bg-color-account3"}
//       />
//     );

//     const block4 = (
//       <SingleOverviewBlock
//         onClick={() => this.onClickAccountOverviewFilter("Deal Pipelines")}
//         count={
//           !isEmpty(dealsOverview) && !isEmpty(dealsOverview.upcomingRevenue)
//             ? `${dealsOverview.upcomingRevenue}`
//             : 0
//         }
//         status={"Expected upcoming revenue"}
//         blockClassName={"leads-gradient-block bg-color-account4"}
//       />
//     );

//     return (
//       <>
//         {this.state.windowWidth >= 768 && (
//           <div className="quotation-new-container">
//             <div className="row mx-0 align-items-center">
//               <button
//                 className="go-back-yellow-arrow-new-leads"
//                 onClick={(e) => (
//                   (window.location.href = "/sales-centre#track"),
//                   e.preventDefault()
//                 )}
//               >
//                 <img
//                   src="/img/desktop-dark-ui/icons/white-back-arrow-circle.svg"
//                   alt="prev arrow"
//                 />
//               </button>

//               <h3 className="font-42-medium new-leads-page-title">
//                 Deal Pipelines
//               </h3>
//               <div
//                 className={
//                   this.props.activeWalkthroughPage === "deal-pipelines-1"
//                     ? "new-walkthrough-accounts-add-btn-active"
//                     : ""
//                 }
//               >
//                 <AddNewPipeline isMobile={false} />
//               </div>
//             </div>

//             <div className="gradient-block-container quotation-new-container__gradient-div">
//               {block1}
//               {block2}
//               {block3}
//               {block4}
//             </div>
//           </div>
//         )}

//         {this.state.windowWidth <= 767 && (
//           <div className="leads-mobile-overview-block">
//             <Slider {...settings}>
//               {block1}
//               {block2}
//               {block3}
//               {block4}
//             </Slider>
//           </div>
//         )}
//       </>
//     );
//   }
// }

// const mapStateToProps = (state) => ({
//   dealsOverview: state.deals.dealsOverview,
//   activeWalkthroughPage: state.auth.activeWalkthroughPage,
// });

// export default connect(mapStateToProps, {})(DealPipelinesOverview);
