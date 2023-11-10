import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Tabs, Tab, TabPanel, TabList } from "react-web-tabs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Modal from "react-responsive-modal";
// import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import AddLead from "../leads/AddLead";
import AddLeadsInPipeline from "./../leadsPipeline/AddLeadsInPipeline";
import LeadsFunnelView from "./LeadsFunnelView";
import KanbanBoard from "../kanbanBoard/KanbanBoard";
import PipelineKanbanBoard from "../leadsPipeline/PipelineKanbanBoard";
import {
  getAllLeads,
  getAllHiddenleads,
  getMyLeads,
  getKanBanLeads,
  searchLeadAction,
  filterLeadsByDate,
  myLeadSearchAction,
  hiddenLeadSearchAction,
  filterHiddenLeadsByDate,
  filterMyLeadsByDate,
  leadsFilterByStatus,
  archiveLeadSearchAction,
  importAllLeads,
  exportAllLeads,
  getOverallLeadClosureEfficiency,
  getOverviewFilterForCount,
} from "./../../../store/actions/leadAction";
import {
  getMyLeadsOfPipeline,
  getAllLeadsOfPipeline,
} from "./../../../store/actions/leadsPipelineAction";
import {
  getFunelView,
  getAllLeadsCount,
} from "./../../../store/actions/leadAction";
import isEmpty from "./../../../store/validations/is-empty";
// import dateFns from "date-fns";
import store from "./../../../store/store";
import {
  SET_FILTER_NAME,
  SET_KANBAN_VIEW,
  SET_OVERVIEW_FILTERNAME,
  SET_KANBAN_SEARCH,
} from "./../../../store/types";
import { CSVLink } from "react-csv";
import { SET_SEARCH_IN_ALL_PAGE } from "./../../../store/types";
import { validateImportCsvFile } from "../../../store/validations/leadsValidation/importFileValidation";
import LeadsNewOverviewBlock from "./LeadsNewOverviewBlock";
import LeadsNewContentListView from "./LeadsNewContentListView";
import LeadsPipelineNewContentListView from "./../leadsPipeline/LeadsPipelineNewContentListView";
import ImportLeadNew from "./../../../components/desktop/ImportLeads/components/MainButton/MainButton";
import { startOfDay, endOfDay } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import LeadsPipelineFunnelView from "../leadsPipeline/LeadsPipelineFunnelView";

const allLeadOptions = [
  "All Leads",
  "My Leads",
  "Hidden Leads",
  "Archive Leads",
];

const allLeadOptionsOfPipeline = ["All Leads", "My Leads"];

function LeadsNewTitleBlock() {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    isListViewIcon: false,
    isFunnelView: false,
    isKanBanViewIcon: true,
    startDate: null,
    endDate: null,
    leadSearch: "",
    defaultOption: "",
    allLeadDefaultOption: allLeadOptions[1],
    loginUserId: [],
    importUploadModel: false,
    defaultTab: "one",
    kanbanLeadSearch: "",
  });

  const [csvData, setcsvData] = useState("");
  const [leadOverallEfficiency, setleadOverallEfficiency] = useState("");
  const [defaultLeadPipeline, setDefaultLeadPipeline] = useState(true);

  const kanbanview = useSelector((state) => state.leads.isKanbanView);
  const activeWalkthroughPage = useSelector(
    (state) => state.auth.activeWalkthroughPage
  );

  useEffect(() => {
    let leadPipelineData = JSON.parse(localStorage.getItem("leadPipelineData"));
    if (!isEmpty(leadPipelineData)) {
      setDefaultLeadPipeline(
        leadPipelineData.additionalInfo.Type === "DEFAULT" ? true : false
      );
    }
  }, []);

  const callBackOverallLeadEfficiency = (leadOverallEfficiency) => {
    setleadOverallEfficiency(leadOverallEfficiency);
  };

  const callBackCsvExport = (data) => {
    if (data) {
      setcsvData(data);
    }
  };

  useEffect(() => {
    var data = JSON.parse(localStorage.getItem("Data"));
    if (kanbanview) {
      setValues({
        ...values,
        defaultTab: "two",
      });
    }

    dispatch(getKanBanLeads(data.id));
    const myLeadQuery = {
      // pageNo: 10,
      // pageSize: 0,
      query: {
        assigned: data.id,
        status: { $ne: "ARCHIVE" },
      },
    };
    dispatch(getMyLeads(myLeadQuery));
    dispatch(getFunelView());
    dispatch(getAllLeadsCount());
    dispatch(getOverallLeadClosureEfficiency(callBackOverallLeadEfficiency));
    dispatch(exportAllLeads(callBackCsvExport));
    store.dispatch({
      type: SET_FILTER_NAME,
      payload: values.allLeadDefaultOption,
    });
    setValues({
      ...values,
      loginUserId: data.id,
    });
  }, [dispatch]);

  const handleisListViewIcon = () => {
    setValues({
      ...values,
      isListViewIcon: false,
      isFunnelView: false,
      isKanBanViewIcon: true,
    });
    store.dispatch({
      type: SET_KANBAN_VIEW,
      payload: false,
    });
  };

  const handleKanBanView = () => {
    setValues({
      ...values,
      isListViewIcon: true,
      isFunnelView: false,
      isKanBanViewIcon: false,
    });
    store.dispatch({
      type: SET_KANBAN_VIEW,
      payload: true,
    });
  };

  const handleClickFunnelView = () => {
    store.dispatch({
      type: SET_KANBAN_VIEW,
      payload: true,
    });
    setValues({
      ...values,
      isFunnelView: !values.isFunnelView,
    });
  };

  const submitDateHandler = () => {
    var data = JSON.parse(localStorage.getItem("Data"));
    const { allLeadDefaultOption, loginUserId } = values;

    let newStartDate = startOfDay(values.startDate);
    let endStartDate = endOfDay(values.endDate);
    // let startDate = dateFns.format(this.state.startDate, "YYYY-MM-DD");
    // let endDate = dateFns.format(this.state.endDate, "YYYY-MM-DD");
    // console.log(endDate);
    if (allLeadDefaultOption === "All Leads") {
      // this.props.filterLeadsByDate(startDate, endDate);
      const allLeadQuery = {
        // pageNo: 10,
        // pageSize: 0,
        query: {
          status: { $ne: "ARCHIVE" },
          $and: [
            { createdAt: { $lte: endStartDate } },
            { createdAt: { $gte: newStartDate } },
          ],
        },
      };
      const allLeadOverviewQuery = {
        status: { $ne: "ARCHIVE" },
        $and: [
          { createdAt: { $lte: endStartDate } },
          { createdAt: { $gte: newStartDate } },
        ],
      };

      dispatch(getAllLeads(allLeadQuery));
      dispatch(getOverviewFilterForCount(allLeadOverviewQuery));
    } else if (allLeadDefaultOption === "Hidden Leads") {
      const hiddenLeadQuery = {
        query: {
          isHidden: true,
          $and: [
            { createdAt: { $lte: endStartDate } },
            { createdAt: { $gte: newStartDate } },
          ],
        },
      };
      const hiddenLeadOverviewQuery = {
        isHidden: true,
        $and: [
          { createdAt: { $lte: endStartDate } },
          { createdAt: { $gte: newStartDate } },
        ],
      };
      dispatch(getAllLeads(hiddenLeadQuery));
      dispatch(getOverviewFilterForCount(hiddenLeadOverviewQuery));
    } else if (allLeadDefaultOption === "Archive Leads") {
      const archiveLeads = {
        query: {
          status: "ARCHIVE",
          $and: [
            { createdAt: { $lte: endStartDate } },
            { createdAt: { $gte: newStartDate } },
          ],
        },
      };
      const archiveLeadsOverviewQuery = {
        status: "ARCHIVE",
        $and: [
          { createdAt: { $lte: endStartDate } },
          { createdAt: { $gte: newStartDate } },
        ],
      };
      dispatch(getAllLeads(archiveLeads));
      dispatch(getOverviewFilterForCount(archiveLeadsOverviewQuery));
    } else {
      const myLeadQuery = {
        query: {
          assigned: data.id,
          status: { $ne: "ARCHIVE" },
          $and: [
            { createdAt: { $lte: endStartDate } },
            { createdAt: { $gte: newStartDate } },
          ],
        },
      };
      const myLeadOverviewQuery = {
        assigned: data.id,
        status: { $ne: "ARCHIVE" },
        $and: [
          { createdAt: { $lte: endStartDate } },
          { createdAt: { $gte: newStartDate } },
        ],
      };
      dispatch(getAllLeads(myLeadQuery));
      dispatch(getOverviewFilterForCount(myLeadOverviewQuery));
    }
  };

  const onAllLeadDropdownSelect = (data) => (e) => {
    e.preventDefault();
    var userData = JSON.parse(localStorage.getItem("Data"));
    store.dispatch({
      type: SET_OVERVIEW_FILTERNAME,
      payload: "",
    });
    // console.log(data);
    setValues({
      ...values,
      allLeadDefaultOption: data,
      startDate: null,
      endDate: null,
    });
    store.dispatch({
      type: SET_FILTER_NAME,
      payload: data,
    });
    const { loginUserId } = values;

    if (data === "All Leads") {
      if (defaultLeadPipeline) {
        const allLeadQuery = {
          query: {
            status: { $ne: "ARCHIVE" },
          },
        };
        const overviewQuery = {
          status: { $ne: "ARCHIVE" },
        };
        dispatch(getAllLeads(allLeadQuery));
        setTimeout(() => {
          dispatch(getOverviewFilterForCount(overviewQuery));
        }, 50);
      } else {
        const allLeadQuery = {
          query: {
            pipeline: leadPipelineData._id,
          },
        };
        dispatch(getAllLeadsOfPipeline(allLeadQuery));
      }
    } else if (data === "Hidden Leads") {
      if (defaultLeadPipeline) {
        const hiddenLeadQuery = {
          query: {
            isHidden: true,
          },
        };
        const hiddenLeadOverviewQuery = {
          isHidden: true,
        };
        dispatch(getAllHiddenleads(hiddenLeadQuery));
        setTimeout(() => {
          dispatch(getOverviewFilterForCount(hiddenLeadOverviewQuery));
        }, 50);
      }
    } else if (data === "Archive Leads") {
      if (defaultLeadPipeline) {
        const archiveLeads = {
          query: {
            status: "ARCHIVE",
          },
        };

        const archiveLeadOverviewQuery = {
          status: "ARCHIVE",
        };
        dispatch(leadsFilterByStatus(archiveLeads));
        setTimeout(() => {
          dispatch(getOverviewFilterForCount(archiveLeadOverviewQuery));
        }, 50);
      }
    } else {
      if (defaultLeadPipeline) {
        const myLeadQuery = {
          query: {
            assigned: userData.id,
            status: { $ne: "ARCHIVE" },
          },
        };
        const myLeadOverviewQuery = {
          assigned: userData.id,
          status: { $ne: "ARCHIVE" },
        };
        dispatch(getMyLeads(myLeadQuery));

        setTimeout(() => {
          dispatch(getOverviewFilterForCount(myLeadOverviewQuery));
        }, 50);
      } else {
        const myLeadQuery = {
          // pageNo: 10,
          // pageSize: 0,
          query: {
            assigned: userData.id,
            pipeline: leadPipelineData._id,
          },
        };
        dispatch(getMyLeadsOfPipeline(myLeadQuery));
      }
    }
  };

  const handleOnChange = (e) => {
    store.dispatch({
      type: SET_SEARCH_IN_ALL_PAGE,
      payload: e.target.value,
    });
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnChangeKnabanSearch = (e) => {
    store.dispatch({
      type: SET_KANBAN_SEARCH,
      payload: e.target.value,
    });
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  /*========================================
      CSV FILE UPLOAD HANDLER
  =========================================*/

  const onCloseModal = () => {
    setValues({
      ...values,
      // importUploadModel: false,
      // exportModel: false,
      // fileName: "",
      // errorImportFile: {},
    });
  };

  /*=============================
          Search Handler
  ==============================*/

  const handleOnSubmitSearch = (e) => {
    e.preventDefault();
    const { allLeadDefaultOption, loginUserId } = values;
    var data = JSON.parse(localStorage.getItem("Data"));
    // alert(this.state.leadSearch);
    if (allLeadDefaultOption === "My Leads") {
      dispatch(
        myLeadSearchAction(values.leadSearch, data.id, allLeadDefaultOption)
      );
    } else if (allLeadDefaultOption === "Hidden Leads") {
      dispatch(hiddenLeadSearchAction(values.leadSearch, allLeadDefaultOption));
    } else if (allLeadDefaultOption === "Archive Leads") {
      dispatch(archiveLeadSearchAction(values.leadSearch));
    } else {
      dispatch(searchLeadAction(values.leadSearch));
    }
  };

  /*=========================
      render block
 ==========================*/
  const renderLeftBlock = () => {
    return (
      <>
        <div className="export_leads_button">
          <CSVLink
            filename={"leads.csv"}
            target="_blank"
            data={csvData}
            // onClick={this.exportLeadsHandler}
          >
            Export Leads
          </CSVLink>
        </div>

        <div className="leads_import_button">
          <ImportLeadNew />
        </div>
      </>
    );
  };

  /*=========================
      render datepicker
 ==========================*/

  const handleChangeStart = (date) => {
    if (date === null) {
      setValues({
        ...values,
        startDate: new Date(),
      });
    } else {
      setValues({
        ...values,
        startDate: date,
      });
    }
  };

  const handleChangeEnd = (date) => {
    if (date === null) {
      setValues({
        ...values,
        endDate: new Date(),
      });
    } else {
      setValues({
        ...values,
        endDate: date,
      });
    }
  };

  const handleDateChangeRaw = (e) => {
    e.preventDefault();
  };

  const renderDatePicker = () => {
    return (
      <>
        {/* datepicker */}
        <div className="leads-title-block-container__date-picker mr-0">
          {/* datepicker */}
          <DatePicker
            selected={values.startDate}
            selectsStart
            startDate={values.startDate}
            endDate={values.endDate}
            onChange={handleChangeStart}
            placeholderText="mm/dd/yyyy"
            onChangeRaw={handleDateChangeRaw}
          />
          <span className="font-18-medium">to</span>
          <DatePicker
            selected={values.endDate}
            selectsEnd
            startDate={values.startDate}
            endDate={values.endDate}
            onChange={handleChangeEnd}
            minDate={values.startDate}
            placeholderText="mm/dd/yyyy"
            onChangeRaw={handleDateChangeRaw}
          />
          <img
            onClick={submitDateHandler}
            src="/img/desktop-dark-ui/icons/purple-bg-arrow-next.svg"
            alt="next"
            className="leads-title-block-next-arrow-img"
          />
        </div>
      </>
    );
  };

  /*=========================
      render searchBlock
 ==========================*/
  const renderSearchBlock = () => {
    return (
      <>
        <div className="leads-title-block-container__new-search-title-block m-0 p-0 lead-search-block--cust row mx-0 align-items-center">
          <div className="message-search-block px-0 mb-md-0">
            <form onSubmit={handleOnSubmitSearch}>
              <input
                type="text"
                name="leadSearch"
                className="message-search-block__input mb-0 mr-0"
                placeholder="Search"
                onChange={handleOnChange}
                value={values.leadSearch}
              />
              <img
                src="/img/desktop-dark-ui/icons/search-icon.svg"
                alt="search"
                className="message-search-block__icon"
                onClick={handleOnSubmitSearch}
              />
            </form>
          </div>
        </div>
      </>
    );
  };

  /*=========================
     RENDER KANBAN SEARCH
 ==========================*/

  const renderKanbanSearchBlock = () => {
    return (
      <>
        <div className="kanban_search">
          <div className="leads-title-block-container__new-search-title-block m-0 p-0 lead-search-block--cust row mx-0 align-items-center">
            <div className="message-search-block px-0 mb-md-0">
              <form>
                <input
                  type="text"
                  name="kanbanLeadSearch"
                  className="message-search-block__input mb-0 mr-0"
                  placeholder="Search Kanban Leads"
                  onChange={handleOnChangeKnabanSearch}
                  value={values.kanbanLeadSearch}
                />
                {/* <img
              src="/img/desktop-dark-ui/icons/search-icon.svg"
              alt="search"
              className="message-search-block__icon"
              onClick={handleOnSubmitSearch}
            /> */}
              </form>
            </div>
          </div>
        </div>
      </>
    );
  };

  /*=========================
     RENDER KANBAN SEARCH
 ==========================*/
  const renderDefaultLeadsListViewTab = () => {
    return (
      <>
        <div className="row mx-0 flex-nowrap">
          <div>
            <div className="leads-new-filter-button-block">
              {allLeadOptions.map((data, index) => (
                <button
                  key={index}
                  onClick={onAllLeadDropdownSelect(data)}
                  className={
                    allLeadOptions[index] === values.allLeadDefaultOption
                      ? "leads-new-filter-button leads-new-filter-button--active"
                      : "leads-new-filter-button"
                  }
                >
                  {data}
                </button>
              ))}
            </div>
            <LeadsNewOverviewBlock />
            <div className="row mx-0 flex-nowrap leads-new-datepicker-search-block">
              {renderSearchBlock()}
              <span className="border-right mx-3"></span>
              {renderDatePicker()}
            </div>
            <div className="leads-new-levels-selected-block">
              <p className="font-18-regular">
                Level Selected: <span>Super Hot,</span>
                Assigned to: <span>Anna Mac</span>
              </p>
            </div>
          </div>
          <div className="row mx-0 flex-nowrap leads-new-graph-level-block">
            <div className="leads-new-graph-level-block__levels">
              <p>
                <span>🌋</span>
                <i>Super Hot</i>
              </p>
              <p>
                <span>☀️</span>️<i>Hot</i>
              </p>
              <p>
                <span>☕</span>
                <i>Warm</i>
              </p>
              <p>
                <span>❄️</span>️<i>Cold</i>
              </p>
            </div>
            <div>
              <p className="font-18-medium mb-18">Lead closure efficiency</p>
              <div className="leads-new-graph-level-block__circular-graph-block">
                <CircularProgressbar
                  value={
                    !isEmpty(leadOverallEfficiency) ? leadOverallEfficiency : 0
                  }
                  strokeWidth={10}
                  text={
                    !isEmpty(leadOverallEfficiency)
                      ? `${leadOverallEfficiency.toFixed()}`
                      : "0"
                  }
                />
              </div>
            </div>
          </div>
        </div>
        <LeadsNewContentListView defaultOption={values.allLeadDefaultOption} />
      </>
    );
  };

  /*=========================
     RENDER KANBAN SEARCH
 ==========================*/
  const renderPipelineLeadsListViewTab = () => {
    return (
      <>
        <div className="row mx-0">
          <div>
            <div className="leads-new-filter-button-block">
              {allLeadOptionsOfPipeline.map((data, index) => (
                <button
                  key={index}
                  onClick={onAllLeadDropdownSelect(data)}
                  className={
                    allLeadOptionsOfPipeline[index] ===
                    values.allLeadDefaultOption
                      ? "leads-new-filter-button leads-new-filter-button--active"
                      : "leads-new-filter-button"
                  }
                >
                  {data}
                </button>
              ))}
            </div>
            {/* <LeadsNewOverviewBlock /> */}
            <div className="row mx-0 flex-nowrap leads-new-datepicker-search-block mt-20">
              {renderSearchBlock()}
              {/* <span className="border-right mx-3"></span> */}
              {/* {renderDatePicker()} */}
            </div>
            {/* <div className="leads-new-levels-selected-block">
              <p className="font-18-regular">
                Level Selected: <span>Super Hot,</span> Assigned to:{" "}
                <span>Anna Mac</span>
              </p>
            </div> */}
          </div>
          {/* <div className="row mx-0 leads-new-graph-level-block">
            <div className="leads-new-graph-level-block__levels">
              <p>
                <span>🌋</span>
                <i>Super Hot</i>
              </p>
              <p>
                <span>☀️</span>️<i>Hot</i>
              </p>
              <p>
                <span>☕</span>
                <i>Warm</i>
              </p>
              <p>
                <span>❄️</span>️<i>Cold</i>
              </p>
            </div>
            <div>
              <p className="font-18-medium mb-18">Lead closure efficiency</p>
              <div className="leads-new-graph-level-block__circular-graph-block">
                <CircularProgressbar
                  value={
                    !isEmpty(leadOverallEfficiency) ? leadOverallEfficiency : 0
                  }
                  strokeWidth={10}
                  text={
                    !isEmpty(leadOverallEfficiency)
                      ? `${leadOverallEfficiency.toFixed()}`
                      : "0"
                  }
                />
              </div>
            </div>
          </div> */}
        </div>
        <LeadsPipelineNewContentListView
          defaultOption={values.allLeadDefaultOption}
        />
      </>
    );
  };

  let leadPipelineData = JSON.parse(localStorage.getItem("leadPipelineData"));
  return (
    <div className="cmd-centre-block cmd-centre-block--leadsNew">
      <div className="row mx-0 align-items-center justify-content-between cmd-centre-block--leadsNew__pageTitleRow">
        <div className="row mx-0 align-items-center mb-30">
          <Link to="/leads-pipeline">
            <div className="go-back-yellow-arrow-new-leads">
              <img
                src="/img/desktop-dark-ui/icons/white-back-arrow-circle.svg"
                alt="prev arrow"
              />
            </div>
          </Link>

          <h2 className="page-title-new pl-0">
            {leadPipelineData.leadPipelineName}
          </h2>

          <div
            className={
              activeWalkthroughPage === "leads-1"
                ? "new-walkthrough-accounts-add-btn-active"
                : ""
            }
          >
            {defaultLeadPipeline ? (
              <AddLead
                isMobile={false}
                className="leads-title-block-btn-red-bg mr-30 ml-30"
                buttonText="+ Add New Lead"
              />
            ) : (
              <AddLeadsInPipeline
                isMobile={false}
                className="leads-title-block-btn-red-bg mr-30 ml-30"
                buttonText="+ Add New Lead"
              />
            )}
          </div>
        </div>
        {defaultLeadPipeline ? (
          <div className="row mx-0">{renderLeftBlock()}</div>
        ) : (
          ""
        )}
      </div>

      <Tabs defaultTab={values.defaultTab}>
        <div
          className={
            activeWalkthroughPage === "leads-3"
              ? "new-walkthrough-leads-tabs-active"
              : ""
          }
        >
          <TabList>
            <Tab tabFor="one">
              <i className="fa fa-circle" />
              List View
            </Tab>
            <Tab tabFor="two">
              <i className="fa fa-circle" />
              Kanban View
            </Tab>
            <Tab tabFor="three">
              <i className="fa fa-circle" />
              Funnel View
            </Tab>
          </TabList>
        </div>
        <TabPanel tabId="one">
          {defaultLeadPipeline
            ? renderDefaultLeadsListViewTab()
            : renderPipelineLeadsListViewTab()}
        </TabPanel>
        <TabPanel tabId="two">
          {defaultLeadPipeline
            ? renderKanbanSearchBlock()
            : renderKanbanSearchBlock()}
          {defaultLeadPipeline ? <KanbanBoard /> : <PipelineKanbanBoard />}
        </TabPanel>
        <TabPanel tabId="three">
          {defaultLeadPipeline ? (
            <LeadsFunnelView />
          ) : (
            <LeadsPipelineFunnelView />
          )}
        </TabPanel>
      </Tabs>
    </div>
  );
}

export default LeadsNewTitleBlock;
