import React, { useEffect, useState } from "react";
import Navbar from "./../header/Navbar";
import store from "../../../store/store";
import { SET_PAGETITLE } from "./../../../store/types";
import AddLeadsPipeline from "./../../desktop/leadsPipeline/AddLeadsPipeline";
import { Link } from "react-router-dom";
import {
  getAllLeadsPipelines,
  getLeadsPipelineCountData,
} from "./../../../store/actions/leadsPipelineAction";
import { useDispatch, useSelector } from "react-redux";
import isEmpty from "../../../store/validations/is-empty";
import { useHistory } from "react-router-dom";
import BreadcrumbMenu from "../header/BreadcrumbMenu";

// let defaultPipeline = [
//   {
//     leadPipelineName: "Default Pipeline",
//     description: "",
//     additionalInfo: {
//       defaultPipeline: true,
//     },
//   },
// ];
function LeadsPipelineMain() {
  const dispatch = useDispatch();
  const history = useHistory();

  const [allLeadsPipeline, setAllLeadsPipeline] = useState([]);
  const [leadsLevelCount, setLeadsLevelCount] = useState([]);
  useEffect(() => {
    dispatch(getAllLeadsPipelines());
    dispatch(getLeadsPipelineCountData());
    store.dispatch({
      type: SET_PAGETITLE,
      // payload: "Leads",
      payload: "Sales Centre",
    });
  }, []);

  const allLeadsPipelineReducer = useSelector(
    (state) => state.leadsPipeline.allLeadsPipeline
  );

  const allLeadsPipelineLevelCount = useSelector(
    (state) => state.leadsPipeline.allLeadsPipelineLevelCount
  );

  useEffect(() => {
    if (!isEmpty(allLeadsPipelineReducer)) {
      setAllLeadsPipeline(allLeadsPipelineReducer);
    } else {
      setAllLeadsPipeline([]);
    }
  }, [allLeadsPipelineReducer]);

  useEffect(() => {
    if (!isEmpty(allLeadsPipelineLevelCount)) {
      setLeadsLevelCount(allLeadsPipelineLevelCount);
    } else {
      setLeadsLevelCount([]);
    }
  }, [allLeadsPipelineLevelCount]);

  const deletePipelineHandler = (pipelineData) => {
    console.log(pipelineData);
  };
  const onClickLeadsPipelineHandler = (pipelineData) => (e) => {
    localStorage.setItem("leadPipelineData", JSON.stringify(pipelineData));
    history.push("/leads-new");
  };

  // const renderDefaultPipelineCard = () => {
  //   if (!isEmpty(defaultPipeline)) {
  //     return defaultPipeline.map((data, index) => {
  //       return (
  //         <div
  //           key={index}
  //           className="customers-list-view-container customers-list-view-container--leadsNew"
  //         >
  //           <div className={"leads-new-list-container"}>
  //             <div className="row mx-0 leads-new-list-container__row1">
  //               <div className="leads-new-list-container__row1__colm1 row mx-0 flex-nowrap align-items-center">
  //                 <div>
  //                   <img
  //                     src={require("../../../assets/img/leads/lead_default_img.svg")}
  //                     className="leads-new-list-container__row1__colm1-img"
  //                     alt="lead"
  //                   />
  //                 </div>
  //                 <span className="leads-new-list-container__row1__colm1-text">
  //                   Default lead pipeline
  //                 </span>
  //               </div>
  //             </div>
  //             <div className="row mx-0 leads-new-list-container__row2">
  //               <div className="row mx-0 leads-new-list-container__row2-block-img-text">
  //                 <div
  //                   onClick={onClickLeadsPipelineHandler(data)}
  //                   className="leads-new-view-details"
  //                 >
  //                   VIEW DETAILS
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       );
  //     });
  //   }
  // };

  const getLeadsLevelCount = (pipelineId) => {
    console.log(pipelineId);
    let filteredData = leadsLevelCount.filter(
      (pipeline) => pipeline.id === pipelineId
    );

    return filteredData[0];
  };

  const renderAllLeadsPipelineCard = () => {
    console.log(leadsLevelCount);

    if (!isEmpty(allLeadsPipeline)) {
      return allLeadsPipeline.map((data, index) => {
        return (
          <div
            key={index}
            className="leads-pipeline-card row mx-0 flex-nowrap align-items-center"
          >
            <div className="leads-pipeline-card__img-block flex-shrink-0">
              {/* <img
                src=""
                alt=""
              /> */}
            </div>
            <h4 className="leads-pipeline-card__text1">
              {data.leadPipelineName}
            </h4>
            <p className="leads-pipeline-card__text2">
              <span className="leads-pipeline-card__text2__emoji">🌋 </span>
              <span className="font-13-medium">Super hot</span>
              <b>
                {!isEmpty(getLeadsLevelCount(data._id)) &&
                  getLeadsLevelCount(data._id).superHot}{" "}
                Leads
              </b>
            </p>
            <p className="leads-pipeline-card__text2">
              <span className="leads-pipeline-card__text2__emoji">☀️ </span>
              <span className="font-13-medium">Hot</span>
              <b>
                {!isEmpty(getLeadsLevelCount(data._id)) &&
                  getLeadsLevelCount(data._id).hot}{" "}
                Leads
              </b>
            </p>
            <p className="leads-pipeline-card__text2">
              <span className="leads-pipeline-card__text2__emoji">☕ </span>
              <span className="font-13-medium">Warm</span>
              <b>
                {!isEmpty(getLeadsLevelCount(data._id)) &&
                  getLeadsLevelCount(data._id).warm}{" "}
                Leads
              </b>
            </p>
            <p className="leads-pipeline-card__text2">
              <span className="leads-pipeline-card__text2__emoji">❄️ </span>
              <span className="font-13-medium">Cold</span>
              <b>
                {!isEmpty(getLeadsLevelCount(data._id)) &&
                  getLeadsLevelCount(data._id).cold}{" "}
                Leads
              </b>
            </p>
            <button
              onClick={onClickLeadsPipelineHandler(data)}
              // to={{
              //   pathname: "/leads-new",
              //   // state: { detail: lead },
              // }}
              className="leads-new-view-details flex-shrink-0"
            >
              VIEW DETAILS
            </button>
            {/* <button onClick={deletePipelineHandler}>Delete</button> */}
          </div>
        );
      });
    }
  };

  return (
    <>
      <Navbar />
      <BreadcrumbMenu
        menuObj={[
          {
            title: "Sales Centre",
            link: "/sales-centre#engage",
          },
          {
            title: "Leads Pipeline",
          },
        ]}
      />
      <div className="leads-container px-0">
        <div className="cmd-centre-block cmd-centre-block--leadsNew">
          <div className="row cmd-centre-block--leadsNew__pageTitleRow cmd-centre-block--leadsNew__pageTitleRow--leadsPipeline">
            <div className="row mx-0 align-items-center">
              <button
                className="go-back-yellow-arrow-new-leads cursor-default"
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

              <h2 className="page-title-new pl-0">Leads Pipeline</h2>
            </div>
            <AddLeadsPipeline
              buttonClassName="leads-title-block-btn-red-bg leads-title-block-btn-red-bg--leadsPipeline"
              buttonText={"+ Add New Pipeline"}
            />
          </div>
          <div className="leads-pipeline-page-content">
            <h3 className="font-14-semibold leads-pipeline-page-content__text1">
              list of pipelines
            </h3>
            {/* {renderDefaultPipelineCard()} */}
            {renderAllLeadsPipelineCard()}
          </div>
        </div>
      </div>
    </>
  );
}

export default LeadsPipelineMain;
