import React, { Component, useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import SingleOverviewBlock from "../common/SingleOverviewBlock";
import { connect } from "react-redux";
import {
  // getLeadsOverview,
  getOverviewFilterForCount,
  filterLeadsByLevel,
  filterLeadsByfollowUpsAndMeet,
  searchFollowupsAndMeetings,
} from "./../../../store/actions/leadAction";
import isEmpty from "./../../../store/validations/is-empty";
import { useSelector, useDispatch } from "react-redux";
import { SET_OVERVIEW_FILTERNAME } from "./../../../store/types";
import store from "../../../store/store";

function LeadsNewOverviewBlock() {
  const dispatch = useDispatch();
  const [leadsOverview, setOverview] = useState([]);
  const [windowWidth, setwindowWidth] = useState(window.innerWidth);

  const leadsAllOverview = useSelector((state) => state.leads.leadsOverview);
  const filterName = useSelector((state) => state.filterName.filterName);

  useEffect(() => {
    var userData = JSON.parse(localStorage.getItem("Data"));
    const myLeadOverviewQuery = {
      assigned: userData.id,
      status: { $ne: "ARCHIVE" },
      // $and: [
      //   { createdAt: { $lte: "2021-05-30T18:29:59.999Z" } },
      //   { createdAt: { $gte: "2021-04-30T18:30:00.000Z" } },
      // ],
    };
    // this.props.getLeadsOverview();

    setTimeout(() => {
      dispatch(getOverviewFilterForCount(myLeadOverviewQuery));
    }, 50);

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  useEffect(() => {
    if (!isEmpty(leadsAllOverview)) {
      setOverview(leadsAllOverview);
    }
  }, [leadsAllOverview]);

  /*========================================================
                mobile view event handlers
  ========================================================*/

  const handleWindowResize = () => {
    setwindowWidth(window.innerWidth);
  };

  /*========================================================
                end mobile view event handlers
  ========================================================*/

  /*=================================
    Leads Overview Filter Handler
  ===================================*/

  const onClickEmployeeOverviewFilter = (level) => {
    // const { filterName } = this.props;
    var userData = JSON.parse(localStorage.getItem("Data"));
    store.dispatch({
      type: SET_OVERVIEW_FILTERNAME,
      payload: level,
    });
    if (level === "followups") {
      if (filterName === "My Leads") {
        const myLeadQuery = {
          entity: "FOLLOWUP",
          query: {
            assigned: userData.id,
            status: { $ne: "ARCHIVE" },
          },
        };
        dispatch(searchFollowupsAndMeetings(myLeadQuery));
      } else if (filterName === "All Leads") {
        const allLeadQuery = {
          entity: "FOLLOWUP",
          query: {
            status: { $ne: "ARCHIVE" },
          },
        };
        dispatch(searchFollowupsAndMeetings(allLeadQuery));
      } else if (filterName === "Hidden Leads") {
        const hiddenLeadQuery = {
          entity: "FOLLOWUP",
          query: {
            isHidden: true,
          },
        };
        dispatch(searchFollowupsAndMeetings(hiddenLeadQuery));
      } else if (filterName === "Archive Leads") {
        const archiveLeadQuery = {
          entity: "FOLLOWUP",
          query: {
            status: "ARCHIVE",
          },
        };
        dispatch(searchFollowupsAndMeetings(archiveLeadQuery));
      }
    } else if (level === "meetings") {
      if (filterName === "My Leads") {
        const myLeadQuery = {
          entity: "MEETING",
          query: {
            assigned: userData.id,
            status: { $ne: "ARCHIVE" },
          },
        };
        dispatch(searchFollowupsAndMeetings(myLeadQuery));
      } else if (filterName === "All Leads") {
        const allLeadQuery = {
          entity: "MEETING",
          query: {
            status: { $ne: "ARCHIVE" },
          },
        };
        dispatch(searchFollowupsAndMeetings(allLeadQuery));
      } else if (filterName === "Hidden Leads") {
        const hiddenLeadQuery = {
          entity: "MEETING",
          query: {
            isHidden: true,
          },
        };
        dispatch(searchFollowupsAndMeetings(hiddenLeadQuery));
      } else if (filterName === "Archive Leads") {
        const archiveLeadQuery = {
          entity: "MEETING",
          query: {
            status: "ARCHIVE",
          },
        };
        dispatch(searchFollowupsAndMeetings(archiveLeadQuery));
      }
    } else {
      if (filterName === "My Leads") {
        const filterLeadByLevel = {
          query: {
            assigned: userData.id,
            status: { $ne: "ARCHIVE" },
            degree: level,
          },
        };
        dispatch(filterLeadsByLevel(filterLeadByLevel));
      } else if (filterName === "All Leads") {
        const filterLeadByLevel = {
          query: {
            status: { $ne: "ARCHIVE" },
            degree: level,
          },
        };
        dispatch(filterLeadsByLevel(filterLeadByLevel));
      } else if (filterName === "Hidden Leads") {
        const filterLeadByLevel = {
          query: {
            isHidden: true,
            degree: level,
          },
        };
        dispatch(filterLeadsByLevel(filterLeadByLevel));
      } else if (filterName === "Archive Leads") {
        const filterLeadByLevel = {
          query: {
            status: "ARCHIVE",
            degree: level,
          },
        };
        dispatch(filterLeadsByLevel(filterLeadByLevel));
      }
    }
  };

  // settings for slider
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

  return (
    <div>
      <>
        {windowWidth >= 768 && (
          <div className="leads-overview-container leads-overview-container--leadsNew">
            <div className="gradient-block-container">
              <SingleOverviewBlock
                count={leadsOverview.superhot}
                status={"Super Hot"}
                blockClassName={"leads-hot-block-gradient"}
                onClick={() => onClickEmployeeOverviewFilter("SUPER_HOT")}
              />
              <SingleOverviewBlock
                count={leadsOverview.hot}
                status={"Hot Leads"}
                blockClassName={"leads-purple-gradient-block"}
                onClick={() => onClickEmployeeOverviewFilter("HOT")}
              />
              <SingleOverviewBlock
                count={leadsOverview.warm}
                status={"Warm Leads"}
                blockClassName={"leads-meetings-block-gradient"}
                onClick={() => onClickEmployeeOverviewFilter("WARM")}
              />
              <SingleOverviewBlock
                count={leadsOverview.cold}
                status={"Cold Leads"}
                blockClassName={"leads-red-gradient-block"}
                onClick={() => onClickEmployeeOverviewFilter("COLD")}
              />
              <SingleOverviewBlock
                count={leadsOverview.followups}
                status={"Follow Ups"}
                blockClassName={"leads-warm-block-gradient"}
                onClick={() => onClickEmployeeOverviewFilter("followups")}
              />
              <SingleOverviewBlock
                count={leadsOverview.meetings}
                status={"Meetings"}
                blockClassName={"leads-blue-gradient-block"}
                onClick={() => onClickEmployeeOverviewFilter("meetings")}
              />
            </div>
          </div>
        )}

        {windowWidth <= 767 && (
          <div className="leads-mobile-overview-block">
            <Slider {...settings}>
              <SingleOverviewBlock
                count={leadsOverview.superHot}
                status={"Super Hot"}
                blockClassName={"leads-hot-block-gradient"}
                onClick={() => onClickEmployeeOverviewFilter("SUPER_HOT")}
              />
              <SingleOverviewBlock
                count={leadsOverview.hot}
                status={"Hot Leads"}
                blockClassName={"leads-purple-gradient-block"}
                onClick={() => onClickEmployeeOverviewFilter("HOT")}
              />
              <SingleOverviewBlock
                count={leadsOverview.warm}
                status={"Warm Leads"}
                blockClassName={"leads-meetings-block-gradient"}
                onClick={() => onClickEmployeeOverviewFilter("WARM")}
              />
              <SingleOverviewBlock
                count={leadsOverview.cold}
                status={"Cold Leads"}
                blockClassName={"leads-red-gradient-block"}
                onClick={() => onClickEmployeeOverviewFilter("COLD")}
              />
              <SingleOverviewBlock
                count={leadsOverview.followups}
                status={"Follow Ups"}
                blockClassName={"leads-warm-block-gradient"}
                onClick={() => onClickEmployeeOverviewFilter("follow-ups")}
              />
              <SingleOverviewBlock
                count={leadsOverview.meetings}
                status={"Meetings"}
                blockClassName={"leads-blue-gradient-block"}
                onClick={() => onClickEmployeeOverviewFilter("meetings")}
              />
            </Slider>
          </div>
        )}
      </>
    </div>
  );
}

export default LeadsNewOverviewBlock;
