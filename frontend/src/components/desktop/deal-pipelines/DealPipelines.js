import React, { Fragment, useEffect } from "react";
import DealPipelinesOverview from "./DealPipelinesOverview";
import DealPipelinesContent from "./DealPipelinesContent";
import Navbar from "../header/Navbar";
import { connect } from "react-redux";
import store from "./../../../store/store";
import { SET_PAGETITLE } from "./../../../store/types";
import {
  getAllPipeline,
  seachPipelineAction,
} from "./../../../store/actions/dealsPipelineAction";
import OverviewDemoNewDealPipelines1 from "../overview-demo-new/OverviewDemoNewDealPipelines1";
import OverviewDemoNewDealPipelines2 from "../overview-demo-new/OverviewDemoNewDealPipelines2";
import OverviewDemoNewDealPipelines3 from "../overview-demo-new/OverviewDemoNewDealPipelines3";
import { getDealsOverview } from "./../../../store/actions/dealsAction";
import { useDispatch, useSelector } from "react-redux";
import BreadcrumbMenu from "../header/BreadcrumbMenu";
// import { startOfDay, endOfDay } from "date-fns";

function DealPipelines() {
  const dispatch = useDispatch();

  const activeWalkthroughPage = useSelector(
    (state) => state.auth.activeWalkthroughPage
  );

  useEffect(() => {
    const formData = {
      // pageNo: 1,
      // pageSize: 3,
      query: {},
    };
    dispatch(seachPipelineAction(formData));

    dispatch(getDealsOverview());
    // this.props.getAllPipeline();
    store.dispatch({
      type: SET_PAGETITLE,
      // payload: "Deal Pipelines",
      payload: "Sales Centre",
    });
  }, []);

  return (
    <Fragment>
      <Navbar />
      <BreadcrumbMenu
        menuObj={[
          {
            title: "Sales Centre",
            link: "/sales-centre#engage",
          },
          {
            title: "Deal Pipelines",
          },
        ]}
      />
      {activeWalkthroughPage === "deal-pipelines-1" && (
        <OverviewDemoNewDealPipelines1 />
      )}

      {activeWalkthroughPage === "deal-pipelines-2" && (
        <OverviewDemoNewDealPipelines2 />
      )}

      {activeWalkthroughPage === "deal-pipelines-3" && (
        <OverviewDemoNewDealPipelines3 />
      )}

      <div className="deals-background">
        <DealPipelinesOverview />
        <DealPipelinesContent />
      </div>
    </Fragment>
  );
}

export default DealPipelines;

// import React, { Component, Fragment } from "react";
// import DealPipelinesOverview from "./DealPipelinesOverview";
// import DealPipelinesContent from "./DealPipelinesContent";
// import Navbar from "../header/Navbar";
// import { connect } from "react-redux";
// import store from "./../../../store/store";
// import { SET_PAGETITLE } from "./../../../store/types";
// import {
//   getAllPipeline,
//   seachPipelineAction,
// } from "./../../../store/actions/dealsPipelineAction";
// import OverviewDemoNewDealPipelines1 from "../overview-demo-new/OverviewDemoNewDealPipelines1";
// import OverviewDemoNewDealPipelines2 from "../overview-demo-new/OverviewDemoNewDealPipelines2";
// import { getDealsOverview } from "./../../../store/actions/dealsAction";
// // import { startOfDay, endOfDay } from "date-fns";

// class DealPipelines extends Component {
//   /*========================================
//              Lifecycle methods
//   =========================================*/
//   componentDidMount() {
//     const formData = {
//       // pageNo: 1,
//       // pageSize: 3,
//       query: {},
//     };
//     this.props.seachPipelineAction(formData);

//     this.props.getDealsOverview();
//     // this.props.getAllPipeline();
//     store.dispatch({
//       type: SET_PAGETITLE,
//       payload: "Deal Pipelines",
//     });
//   }
//   render() {
//     return (
//       <Fragment>
//         <Navbar />

//         {this.props.activeWalkthroughPage === "deal-pipelines-1" && (
//           <OverviewDemoNewDealPipelines1 />
//         )}

//         {this.props.activeWalkthroughPage === "deal-pipelines-2" && (
//           <OverviewDemoNewDealPipelines2 />
//         )}

//         <div className="deals-background">
//           <DealPipelinesOverview />
//           <DealPipelinesContent />
//         </div>
//       </Fragment>
//     );
//   }
// }

// const mapStateToprops = (state) => ({
//   activeWalkthroughPage: state.auth.activeWalkthroughPage,
// });

// export default connect(mapStateToprops, {
//   getAllPipeline,
//   getDealsOverview,
//   seachPipelineAction,
// })(DealPipelines);
