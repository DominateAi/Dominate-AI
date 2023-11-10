import React, { useState, useEffect } from "react";
import LeadsFunnelViewCard from "../leads/LeadsFunnelViewCard";
import isEmpty from "./../../../store/validations/is-empty";
import { useSelector, useDispatch } from "react-redux";
import {
  getFunnelViewByPipelineId,
  getAllLeadsCountOfPipeline,
} from "./../../../store/actions/leadsPipelineAction";

function LeadsPipelineFunnelView() {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    allLeadsPipelineCount: {},
  });

  const [loading, setLoader] = useState(true);
  const [pipelineFunnelView, setPipelineFunnelView] = useState([]);
  //REDUCERS

  const allLeadsPipelineCount = useSelector(
    (state) => state.leadsPipeline.allLeadsPipelineCount
  );

  const loader = useSelector((state) => state.auth.loader);
  const pipelineFunnelViewReducer = useSelector(
    (state) => state.leadsPipeline.pipelineFunnelView
  );

  useEffect(() => {
    let leadPipelineData = JSON.parse(localStorage.getItem("leadPipelineData"));
    dispatch(getFunnelViewByPipelineId(leadPipelineData._id));
    dispatch(
      getAllLeadsCountOfPipeline({
        query: {
          pipeline: leadPipelineData._id,
        },
      })
    );
  }, []);

  useEffect(() => {
    if (!isEmpty(allLeadsPipelineCount)) {
      // console.log(allLeadCount);
      setValues({
        ...values,
        allLeadsPipelineCount: allLeadsPipelineCount,
      });
    }
  }, [allLeadsPipelineCount]);

  useEffect(() => {
    if (!isEmpty(loader)) {
      setLoader(loader);
    }
  }, [loader]);

  useEffect(() => {
    if (!isEmpty(pipelineFunnelViewReducer)) {
      setPipelineFunnelView(pipelineFunnelViewReducer);
    } else {
      setPipelineFunnelView([]);
    }
  }, [pipelineFunnelViewReducer]);

  // render new lead percantage

  const renderNewLeadsPercantage = (stageCount) => {
    const { allLeadsPipelineCount } = values;

    let newLeadCount = stageCount;

    let newLeadPercent = 0;
    if (newLeadCount !== 0 && allLeadsPipelineCount !== 0) {
      newLeadPercent = (newLeadCount / allLeadsPipelineCount) * 100;
    } else {
      newLeadPercent = 0;
    }
    return newLeadPercent;
  };

  if (loading === true || isEmpty(pipelineFunnelView)) {
    return (
      <div
        style={{ justifyContent: "center" }}
        className="funnel-view-outer-div"
      >
        <div className="text-center">
          <img
            // src={require("../../../assets/img/illustrations/dashboard-leads-status.svg")}
            src="/img/desktop-dark-ui/illustrations/dashboard-lead-status-funnel-view.svg"
            alt="dashboard leads status no found"
            className="dashboard-leads-status-img"
          />
          <h5 className="reports-graph-not-found-text">There is no data</h5>
        </div>
      </div>
    );
  } else {
    return (
      <div className="funnel-view-outer-div">
        {!isEmpty(pipelineFunnelView) &&
          pipelineFunnelView.map((data, index) => {
            if (index <= 5) {
              return (
                <LeadsFunnelViewCard
                  key={index}
                  type={`${data.stageName.toUpperCase()}`}
                  number={data.count}
                  colorLight={
                    index === 0
                      ? "#B3C9FE"
                      : index === 1
                      ? "#EBC1FE"
                      : index === 2
                      ? "#FAE7B0"
                      : index === 3
                      ? "#FFFFA7"
                      : index === 4
                      ? "#A8FFA5"
                      : "#FFAEAE"
                  }
                  colorDark={
                    index === 0
                      ? "#3F77FF"
                      : index === 1
                      ? "#CA53FF"
                      : index === 2
                      ? "#FFD65E"
                      : index === 3
                      ? "#FFFF51"
                      : index === 4
                      ? "#3FFF39"
                      : "#FF5D5D"
                  }
                  percent={
                    allLeadsPipelineCount !== 0
                      ? `${renderNewLeadsPercantage(data.count)}%`
                      : `${2}%`
                  }
                  blockNum={`${index + 1}`}
                />
              );
            }
          })}
      </div>
    );
  }
}

export default LeadsPipelineFunnelView;
