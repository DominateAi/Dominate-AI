import React, { Component } from "react";
import ReactDOM from "react-dom";
import PDFLoader from "./ReusableComponents/PdfGeneratingBanner";
import HeadingComponent from "./ReusableComponents/HeadingComponents";
import SidePanelComponent from "./ReusableComponents/SidePanelComponent";
import TemplateViewComponent from "./ReusableComponents/TemplateViewComponent";
import PreviewPanel from "./ReusableComponents/PreviewComponent";
import TemplateEditorComponent from "./ReusableComponents/TemplateEditoComponent";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
// import Modal from "react-bootstrap/Modal";

// ERROR MODALS
import { NoTemplateSelected } from "./ReusableComponents/ErrorModals";

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { getAllActiveLeads } from "../../../../store/actions/leadAction";
import { normalImageUpload } from "../../../../store/actions/authAction";

// FRONTPAGE
import FP_TemplateOne from "./Templates/FrontPage/FP_TemplateOne";
import FP_TemplateTwo from "./Templates/FrontPage/FP_TemplateTwo";
import FP_TemplateThree from "./Templates/FrontPage/FP_TemplateThree";
import FP_TemplateFour from "./Templates/FrontPage/FP_TemplateFour";

// INTRODUCTION
import I_TemplateOne from "./Templates/Introduction/I_TemplateOne";
import I_TemplateTwo from "./Templates/Introduction/I_TemplateTwo";
import I_TemplateThree from "./Templates/Introduction/_I_TemplateThree";
import I_TemplateFour from "./Templates/Introduction/_I_TemplateFour";

// ABOUT US
import AU_TemplateOne from "./Templates/AboutUs/AU_TemplateOne";
import AU_TemplateTwo from "./Templates/AboutUs/AU_TemplateTwo";
import AU_TemplateThree from "./Templates/AboutUs/AU_TemplateThree";
import AU_Template_four from "./Templates/AboutUs/AU_TemplateFour";
//OUR MISSION

import OM_TemplateOne from "./Templates/OurMission/OM_TemplateOne";
import OM_TemplateTwo from "./Templates/OurMission/OM_TemplateTwo";
import OM_TemplateThree from "./Templates/OurMission/OM_TemplateThree";
import OM_TemplateFour from "./Templates/OurMission/OM_TemplateFour";

//OUR PORTFOLIO
import OP_TemplateOne from "./Templates/OurPortfolio/OP_TemplateOne";
import OP_TemplateTwo from "./Templates/OurPortfolio/OP_TemplateTwo";
import OP_TemplateThree from "./Templates/OurPortfolio/OP_TemplateThree";
import OP_TemplateFour from "./Templates/OurPortfolio/OP_TemplateFour";

// OUR CLIENTS
import OC_TemplateOne from "./Templates/OurClients/OC_TemplateOne";
import OC_TemplateTwo from "./Templates/OurClients/OC_TemplateTwo";
import OC_TemplateThree from "./Templates/OurClients/OC_TemplateThree";
import OC_TemplateFour from "./Templates/OurClients/OC_TemplateFour";

// WHAT WE DO
import WWD_TemplateOne from "./Templates/WhatWeDo/WWD_TemplateOne";
import WWD_TemplateTwo from "./Templates/WhatWeDo/WWD_TemplateTwo";
import WWD_TemplateThree from "./Templates/WhatWeDo/WWD_TemplateThree";
import WWD_TemplateFour from "./Templates/WhatWeDo/WWD_TemplateFour";

//OUR TEAM
import OT_TemplateOne from "./Templates/OurTeam/OT_TemplateOne";
import OT_TemplateTwo from "./Templates/OurTeam/OT_TemplateTwo";
import OT_TemplateThree from "./Templates/OurTeam/OT_TemplateThree";
import OT_TemplateFour from "./Templates/OurTeam/OT_TemplateFour";

//OUR PROCESS
import OProcess_TemplateOne from "./Templates/OurProcess/OProcess_TemplateOne";
import OProcess_TemplateTwo from "./Templates/OurProcess/OProcess_TemplateTwo";
import OProcessThree from "./Templates/OurProcess/OProcessThree";
import OProcess_TemplateFour from "./Templates/OurProcess/OProcess_TemplateFour";

//PROJECT DETAILS
import PD_TemplateOne from "./Templates/ProjectDetails/PD_TemplateOne";
import PD_TemplateTwo from "./Templates/ProjectDetails/PD_TemplateTwo";
import PD_TemplateThree from "./Templates/ProjectDetails/PD_TemplateThree";
import PD_TemplateFour from "./Templates/ProjectDetails/PD_TemplateFour";

//OUR CAPABILITIES
import OCapabilities_TemplateOne from "./Templates/OurCapabilities/OCapabilities_TemplateOne";
import OCapabilities_TemplatesTwo from "./Templates/OurCapabilities/OCapabilities_TemplatesTwo";
import OCapabilities_TemplateThree from "./Templates/OurCapabilities/OCapabilities_TemplateThree";
import OCapabilities_TemplateFour from "./Templates/OurCapabilities/OCapabilities_TemplateFour";

//VISION
import Vision_TemplateOne from "./Templates/Vision/Vision_TemplateOne";
import Vision_TemplateTwo from "./Templates/Vision/Vision_TemplateTwo";
import Vision_TemplateThree from "./Templates/Vision/Vision_TemplateThree";
import Vision_TemplateFour from "./Templates/Vision/Vision_TemplateFour";

//Business Model
import BM_TemplateOne from "./Templates/BusinessModel/BM_TemplateOne";
import BM_TemplateTwo from "./Templates/BusinessModel/BM_TemplateTwo";
import BM_TemplateThree from "./Templates/BusinessModel/BM_TemplateThree";
import BM_TemplateFour from "./Templates/BusinessModel/BM_TemplateFour";

//FINANCIAL ANALYSIS
import FA_TemplateOne from "./Templates/FinancialAnalysis/FA_TemplateOne";
import FA_TemplateTwo from "./Templates/FinancialAnalysis/FA_TemplateTwo";
import FA_TemplateThree from "./Templates/FinancialAnalysis/FA_TemplateThree";
import FA_TemplateFour from "./Templates/FinancialAnalysis/FA_TemplateFour";

//CONTACT US
import ContactUs_TemplateOne from "./Templates/ContactUs/ContactUs_TemplateOne";
import ContactUs_TemplateTwo from "./Templates/ContactUs/ContactUs_TemplateTwo";
import ContactUs_TemplateThree from "./Templates/ContactUs/ContactUs_TemplateThree";
import ContactUs_TemplateFour from "./Templates/ContactUs/ContactUs_TemplateFour";

//SWOT
import Swot_TemplateOne from "./Templates/Swot/Swot_TemplateOne";
import Swot_TemplateTwo from "./Templates/Swot/Swot_TemplateTwo";
import Swot_TemplateFour from "./Templates/Swot/Swot_TemplateFour";
import Swot_TemplateThree from "./Templates/Swot/Swot_TemplateThree";

// THANKS YOU
import TY_TemplateOne from "./Templates/ThankYou/TY_TemplateOne";
import TY_TemplateTwo from "./Templates/ThankYou/TY_TemplateTwo";
import TY_TemplateThree from "./Templates/ThankYou/TY_TemplateThree";
import TY_TemplateFour from "./Templates/ThankYou/TY_TemplateFour";

// ACTIONS
import {
  create_new_propsal,
  get_selected_proposal_data,
  update_proposal,
  save_new_propsal,
  autoSavingProposal,
  updateAutosavingProposal,
  delete_proposal_data,
} from "../store/actions/proposalActions";
import store from "../../../../store/store";
import {
  SET_PROPOSAL_INITIAL_DATA,
  READ_PROPOSAL,
  SET_SELECTED_TEMPLATES_BY_USER,
} from "../store/types";

const template_config = [
  { name: "front_page_template_one", value: FP_TemplateOne },
  { name: "front_page_template_two", value: FP_TemplateTwo },
  { name: "front_page_template_three", value: FP_TemplateThree },
  { name: "front_page_template_four", value: FP_TemplateFour },

  { name: "introduction_template_one", value: I_TemplateOne },
  { name: "introduction_template_two", value: I_TemplateTwo },
  { name: "introduction_template_three", value: I_TemplateThree },
  { name: "introduction_template_four", value: I_TemplateFour },

  { name: "about_us_template_one", value: AU_TemplateOne },
  { name: "about_us_template_two", value: AU_TemplateTwo },
  { name: "about_us_template_three", value: AU_TemplateThree },
  { name: "about_us_template_four", value: AU_Template_four },

  { name: "our_mission_page_template_one", value: OM_TemplateOne },
  { name: "our_mission_page_template_two", value: OM_TemplateTwo },
  { name: "our_mission_page_template_three", value: OM_TemplateThree },
  { name: "our_mission_page_template_four", value: OM_TemplateFour },

  { name: "our_portfolio_template_one", value: OP_TemplateOne },
  { name: "our_portfolio_template_two", value: OP_TemplateTwo },
  { name: "our_portfolio_template_three", value: OP_TemplateThree },
  { name: "our_portfolio_template_four", value: OP_TemplateFour },

  { name: "our_clients_template_one", value: OC_TemplateOne },
  { name: "our_clients_template_two", value: OC_TemplateTwo },
  { name: "our_clients_template_three", value: OC_TemplateThree },
  { name: "our_clients_template_four", value: OC_TemplateFour },

  { name: "what_we_do_template_one", value: WWD_TemplateOne },
  { name: "what_we_do_template_two", value: WWD_TemplateTwo },
  { name: "what_we_do_template_three", value: WWD_TemplateThree },
  { name: "what_we_do_template_four", value: WWD_TemplateFour },

  { name: "our_team_template_one", value: OT_TemplateOne },
  { name: "our_team_template_two", value: OT_TemplateTwo },
  { name: "our_team_template_three", value: OT_TemplateThree },
  { name: "our_team_template_four", value: OT_TemplateFour },

  { name: "our_process_page_template_one", value: OProcess_TemplateOne },
  { name: "our_process_page_template_two", value: OProcess_TemplateTwo },
  { name: "our_process_page_template_three", value: OProcessThree },
  { name: "our_process_page_template_four", value: OProcess_TemplateFour },

  { name: "project_details_one", value: PD_TemplateOne },
  { name: "project_details_two", value: PD_TemplateTwo },
  { name: "project_details_three", value: PD_TemplateThree },
  { name: "project_details_four", value: PD_TemplateFour },

  { name: "our_capabilities_template_one", value: OCapabilities_TemplateOne },
  { name: "our_capabilities_template_two", value: OCapabilities_TemplatesTwo },
  {
    name: "our_capabilities_template_three",
    value: OCapabilities_TemplateThree,
  },
  { name: "our_capabilities_template_four", value: OCapabilities_TemplateFour },

  { name: "vission_template_one", value: Vision_TemplateOne },
  { name: "vission_template_two", value: Vision_TemplateTwo },
  { name: "vission_template_three", value: Vision_TemplateThree },
  { name: "vission_template_four", value: Vision_TemplateFour },

  { name: "business_model_template_one", value: BM_TemplateOne },
  { name: "business_model_template_two", value: BM_TemplateTwo },
  { name: "business_model_template_three", value: BM_TemplateThree },
  { name: "business_model_template_four", value: BM_TemplateFour },

  { name: "financial_analysis_template_one", value: FA_TemplateOne },
  { name: "financial_analysis_template_two", value: FA_TemplateTwo },
  { name: "financial_analysis_template_three", value: FA_TemplateThree },
  { name: "financial_analysis_template_four", value: FA_TemplateFour },

  { name: "contact_us_template_one", value: ContactUs_TemplateOne },
  { name: "contact_us_template_two", value: ContactUs_TemplateTwo },
  { name: "contact_us_template_three", value: ContactUs_TemplateThree },
  { name: "contact_us_template_four", value: ContactUs_TemplateFour },

  { name: "swot_template_one", value: Swot_TemplateOne },
  { name: "swot_template_two", value: Swot_TemplateTwo },
  { name: "swot_template_three", value: Swot_TemplateThree },
  { name: "swot_template_four", value: Swot_TemplateFour },

  { name: "thank_you_one", value: TY_TemplateOne },
  { name: "thank_you_two", value: TY_TemplateTwo },
  { name: "thank_you_three", value: TY_TemplateThree },
  { name: "thank_you_four", value: TY_TemplateFour },
];

export class ProposalMainEditorPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "Untitiled Proposal",
      description: "Proposal Descrition",
      status: "DRAFT",
      entityType: "LEAD", // LEAD or CUSTOMER
      entityId: "", //LEAD ID,
      attachment: "", // GENERATED PDF LINK,
      // ALL PROPOSAL DATA
      data: {
        allselectedTemplates: [],
        selectedTemplateCurrentIndex: 0,
        isEditOpen: false,
        isPreviewOpen: false,
        isDownloading: false,
      },
      generatingPDF: false, //
    };
  }

  /************************************************
   * @DESC - LIFE CYCLE METHODDS
   ************************************************/
  componentDidMount() {
    // this.props.getAllActiveLeads({query: {}});
    if (this.props.match.params.id) {
      this.props.get_selected_proposal_data(this.props.match.params.id);
    }
    if (localStorage.proposalData) {
      let data = JSON.parse(localStorage.getItem("proposalData"));
      store.dispatch({
        type: SET_PROPOSAL_INITIAL_DATA,
        payload: {
          proposalTitle: data.proposalTitle,
          selectedLeadData: data.selectedLeadData,
        },
      });
      this.setState({
        name: data.proposalTitle,
      });
    }
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      nextProps.proposals.proposalData.selected_proposal_data._id &&
      nextProps.match.params.id &&
      !nextState.hasNotSetData
    ) {
      console.log("Setting old Data reload");
      if (
        nextProps.proposals.proposalData.selected_proposal_data._id !==
        nextState._id
      ) {
        return {
          ...nextProps.proposals.proposalData.selected_proposal_data,
          hasNotSetData: true,
        };
      }
    }
    return null;
  }

  componentWillUnmount() {
    store.dispatch({
      type: READ_PROPOSAL,
      payload: {},
    });
    localStorage.removeItem("proposalData");
  }

  /************************************************
   * @DESC - ONCHANGEHANDLER - NORMAL ONE
   ************************************************/
  onChangeHandlerNormal = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  /************************************
   * @DESC - ON SAVE CLICK HANDLER
   ***********************************/
  onSendClickHandler = async (e) => {
    const data = this.state.data;
    if (data.isPreviewOpen === false) {
      alert("Please go to preview panel first");
    } else if (data.allselectedTemplates.length === 0) {
      ReactDOM.render(
        <NoTemplateSelected />,
        document.getElementById("error_message")
      );
    } else {
      this.setState({ generatingPDF: true });
      let pdffile = await this.onPdfGenerator();
      if (pdffile !== null) {
        var pdf = pdffile.output("blob");
        let formData = new FormData();
        formData.append("file", pdf, "Proposal.pdf");
        let { success, imageResponse } = await normalImageUpload(formData);
        if (success) {
          let jsonData = this.state;
          jsonData.status = "SENT";
          jsonData.name = this.props.proposals.createProposal.proposalTitle;
          jsonData.data.leadinformation =
            this.props.proposals.createProposal.leadInformation;
          jsonData.attachment = imageResponse.fileUrl;
          jsonData.entityId =
            this.props.proposals.createProposal.leadInformation._id;

          delete jsonData.createdAt;
          delete jsonData.createdBy;
          delete jsonData.hasNotSetData;
          delete jsonData.lastModifiedBy;
          delete jsonData.updatedAt;
          delete jsonData.__v;
          delete jsonData._id;

          // new code by akshay
          let proposalAllData = JSON.parse(
            localStorage.getItem("proposalData")
          );
          if (proposalAllData.newProposal) {
            this.props.delete_proposal_data(this.props.match.params.id);
          }
          // new code by akshay ended
          this.props.create_new_propsal(jsonData);
        }
      }
      this.setState({ generatingPDF: false });
    }
  };
  onSaveDraftHandler = (e) => {
    const data = this.state.data;
    if (data.allselectedTemplates.length === 0) {
      ReactDOM.render(
        <NoTemplateSelected />,
        document.getElementById("error_message")
      );
    } else {
      if (this.state._id === "" || this.state._id === undefined) {
        this.setState({ generatingPDF: true });
        let jsonData = this.state;
        jsonData.status = "DRAFT";
        jsonData.name = this.props.proposals.createProposal.proposalTitle;
        jsonData.data.leadinformation =
          this.props.proposals.createProposal.leadInformation;
        jsonData.entityId =
          this.props.proposals.createProposal.leadInformation._id;
        // new code by akshay
        let proposalAllData = JSON.parse(localStorage.getItem("proposalData"));
        if (proposalAllData.newProposal) {
          let jsonData = this.state;
          jsonData.status = "DRAFT";
          jsonData.name = this.props.proposals.createProposal.proposalTitle;
          jsonData.data.leadinformation =
            this.props.proposals.createProposal.leadInformation;
          jsonData.entityId =
            this.props.proposals.createProposal.leadInformation._id;
          this.props.update_proposal(jsonData, this.state._id);
          // this.props.delete_proposal_data(this.props.match.params.id);
        }
        // new code by akshay ended
        this.props.save_new_propsal(jsonData);
        this.setState({ generatingPDF: false });
      } else {
        this.setState({ generatingPDF: true });
        let jsonData = this.state;
        jsonData.status = "DRAFT";
        jsonData.name = this.props.proposals.createProposal.proposalTitle;
        jsonData.data.leadinformation =
          this.props.proposals.createProposal.leadInformation;
        jsonData.entityId =
          this.props.proposals.createProposal.leadInformation._id;
        this.props.update_proposal(jsonData, this.state._id);
        this.setState({ generatingPDF: false });
      }
    }
  };

  onDownloadClickHandler = async (e) => {
    const data = this.state.data;
    if (data.isPreviewOpen === false) {
      alert("Preview your proposal, then click on download");
    } else if (data.allselectedTemplates.length === 0) {
      ReactDOM.render(
        <NoTemplateSelected />,
        document.getElementById("error_message")
      );
    } else {
      this.setState({ generatingPDF: true });
      let docData = await this.onPdfGenerator();
      if (docData !== null) {
        docData.save("Presentation.pdf");
      }
      this.setState({ generatingPDF: false });
    }
  };

  /******************************************************
   * @DESC - TEMPLATE SELECT HANDLER
   * @DESC - ALL HANDLERS
   ******************************************************/
  onClickSelectTemplateHandler = (template) => (e) => {
    const data = this.state.data;
    data.allselectedTemplates.push(JSON.parse(JSON.stringify(template)));
    this.setState({ data: data });

    // this is new code in presentation added by akshay
    let proposalAllData = JSON.parse(localStorage.getItem("proposalData"));
    if (proposalAllData.newProposal) {
      if (this.props.match.params.id === undefined) {
        let jsonData = this.state;
        jsonData.status = "DRAFT";
        jsonData.name = this.props.proposals.createProposal.proposalTitle;
        jsonData.data.leadinformation =
          this.props.proposals.createProposal.leadInformation;
        jsonData.entityId =
          this.props.proposals.createProposal.leadInformation._id;
        this.props.autoSavingProposal(jsonData, this.props.history);
      } else {
        let jsonData = this.state;
        jsonData.status = "DRAFT";
        jsonData.name = this.props.proposals.createProposal.proposalTitle;
        jsonData.data.leadinformation =
          this.props.proposals.createProposal.leadInformation;
        jsonData.entityId =
          this.props.proposals.createProposal.leadInformation._id;
        this.props.updateAutosavingProposal(
          jsonData,
          this.props.match.params.id
        );
      }
    } else {
      // condition for already drafted or sent proposals
      let jsonData = this.state;
      // jsonData.status = "DRAFT";
      jsonData.name = this.props.proposals.createProposal.proposalTitle;
      jsonData.data.leadinformation =
        this.props.proposals.createProposal.leadInformation;
      jsonData.entityId =
        this.props.proposals.createProposal.leadInformation._id;
      this.props.updateAutosavingProposal(jsonData, this.props.match.params.id);
    }
    // this is new code in presentation added by akshay ended
  };
  onClickselectedTemplateCurrentIndex = (index) => (e) => {
    const data = this.state.data;
    data.selectedTemplateCurrentIndex = index;
    this.setState({ data: data });

    // this is new code in presentation added by akshay
    if (this.props.match.params.id !== undefined) {
      let jsonData = this.state;
      // jsonData.status = "DRAFT";
      jsonData.name = this.props.proposals.createProposal.proposalTitle;
      jsonData.data.leadinformation =
        this.props.proposals.createProposal.leadInformation;
      jsonData.entityId =
        this.props.proposals.createProposal.leadInformation._id;
      this.props.updateAutosavingProposal(jsonData, this.props.match.params.id);
    }
    // this is new code in presentation added by akshay ended
    console.log("onclick on template");
  };

  onDeleteSelectedTemplateCurrentIndex = (index) => (e) => {
    const data = this.state.data;
    data.allselectedTemplates.splice(index, 1);
    this.setState({ data: data });
    console.log("delete selected template current index");
  };
  onTemplateItemChange = (name, index, value) => (e) => {
    const data = this.state.data;
    data.allselectedTemplates[index][name] = value;
    this.setState({ data: data });
    console.log("on template change");
  };
  onTemplateItemChangeWithoutEvent = (name, index, value) => {
    const data = this.state.data;
    data.allselectedTemplates[index][name] = value;
    this.setState({ data: data });
    console.log("on template item chnage without event");
  };

  onTemplateEditorChangeHandler = (name, index) => (e) => {
    const data = this.state.data;
    data.allselectedTemplates[index][name] = e.editor.getData();
    this.setState({ data: data });

    // this is new code in presentation added by akshay
    if (this.props.match.params.id !== undefined) {
      let jsonData = this.state;
      // jsonData.status = "DRAFT";
      jsonData.name = this.props.proposals.createProposal.proposalTitle;
      jsonData.data.leadinformation =
        this.props.proposals.createProposal.leadInformation;
      jsonData.entityId =
        this.props.proposals.createProposal.leadInformation._id;
      this.props.updateAutosavingProposal(jsonData, this.props.match.params.id);
    }
    // this is new code in presentation added by akshay ended
  };
  /******************************************************
   * @DESC - PANE CHANGERS
   * @DESC - TWO HANDLERS
   ******************************************************/
  onEditPanelToggler = (value) => (e) => {
    const data = this.state.data;
    data.isEditOpen = value;
    this.setState({ data: data });
  };
  onPreviewPanelToggler = (value) => (e) => {
    const data = this.state.data;
    data.isPreviewOpen = value;
    this.setState({ data: data });
  };

  // akshay new code added here
  onClickGobackHandler = () => {
    if (this.props.match.params.id !== undefined) {
      let jsonData = this.state;
      // jsonData.status = "DRAFT";
      jsonData.name = this.props.proposals.createProposal.proposalTitle;
      jsonData.data.leadinformation =
        this.props.proposals.createProposal.leadInformation;
      jsonData.entityId =
        this.props.proposals.createProposal.leadInformation._id;
      let update = this.props.updateAutosavingProposal(
        jsonData,
        this.props.match.params.id
      );
      if (update) {
        this.props.history.push("/presentations");
      }
    } else {
      this.props.history.push("/presentations");
    }
  };

  // akshay new code added ended here

  /*********************************************************
   * @DESC - PDF DOWNLOADER HANDLERS
   *********************************************************/
  onPdfGenerator = async (e) => {
    let all_templates = this.state.data.allselectedTemplates;
    if (all_templates.length !== 0) {
      const input = document.getElementById(all_templates[0].id);
      let canvas = await html2canvas(input, { scale: 2 });
      // const imageData = canvas.toDataURL('image/png', 0);
      const imageData = canvas.toDataURL({
        format: "jpeg",
        quality: 0.1,
      });
      const docOne = new jsPDF("l", "px", [540, 300], { compress: true });
      const widthOne = docOne.internal.pageSize.getWidth();
      const heightOne = docOne.internal.pageSize.getHeight();
      docOne.addImage(
        imageData,
        "JPEG",
        0,
        0,
        widthOne,
        heightOne,
        undefined,
        "SLOW"
      );

      // IF MORE THAN ONE TEMPLATE
      if (all_templates.length > 1) {
        let i = 1;
        while (i < all_templates.length) {
          const input_var = document.getElementById(all_templates[i].id);
          let canvas_var = await html2canvas(input_var, { scale: 2 });
          // const imgDataOne_var = canvas_var.toDataURL('image/png',0);
          const imgDataOne_var = canvas_var.toDataURL({
            format: "jpeg",
            quality: 0.1,
          });
          const doc_var = new jsPDF("l", "px", [540, 300], { compress: true });
          const width_Var = doc_var.internal.pageSize.getWidth();
          const height_Var = doc_var.internal.pageSize.getHeight();
          docOne.addPage();
          docOne.addImage(
            imgDataOne_var,
            "JPEG",
            0,
            0,
            width_Var,
            height_Var,
            undefined,
            "SLOW"
          );
          i++;
        }
      }
      return docOne;
    } else {
      return null;
    }
  };

  /***********************************************
   * @DESC - ALL CONFIG DATA USED IN THIS PROPOSAL
   ***********************************************/
  config = {
    ...this.props,
    template_config: template_config,
    onChangeHandlerNormal: this.onChangeHandlerNormal,
    closeicon: <i className="fa fa-times fa-lg" aria-hidden="true"></i>,
    lefticon: <i className="fa fa-arrow-left fa-lg" aria-hidden="true"></i>,
    // deleteicon: <i className="fa fa-trash fa-lg" aria-hidden="true"></i>,
    deleteicon: (
      <img src={"/img/desktop-dark-ui/icons/delete-icon.png"} alt="" />
    ),
    // maximizeicon: (
    //   <i className="fa fa-window-maximize fa-lg" aria-hidden="true"></i>
    // ),
    maximizeicon: (
      <img
        src={"/img/desktop-dark-ui/icons/presentation-view-icon.svg"}
        alt=""
      />
    ),
    // editicon: <i className="fa fa-pencil fa-lg" aria-hidden="true"></i>,
    editicon: (
      <>
        <img
          src={"/img/desktop-dark-ui/icons/pencil-with-underscore.svg"}
          alt=""
        />
      </>
    ),
    saveicon: <i className="fa fa-floppy-o fa-lg" aria-hidden="true"></i>,
    previewicon: <i className="fa fa-eye fa-lg" aria-hidden="true"></i>,
    sendicon: <i className="fa fa-paper-plane fa-lg" aria-hidden="true"></i>,
    // optionicon: <i className="fa fa-cogs fa-lg" aria-hidden="true"></i>,
    optionicon: (
      <>
        <img src={"/img/desktop-dark-ui/icons/setting-icon.svg"} alt="" />
      </>
    ),
    onEditPanelToggler: this.onEditPanelToggler,
    onPreviewPanelToggler: this.onPreviewPanelToggler,
    onClickSelectTemplateHandler: this.onClickSelectTemplateHandler,
    onClickselectedTemplateCurrentIndex:
      this.onClickselectedTemplateCurrentIndex,
    onDeleteSelectedTemplateCurrentIndex:
      this.onDeleteSelectedTemplateCurrentIndex,
    onTemplateItemChange: this.onTemplateItemChange,
    onTemplateItemChangeWithoutEvent: this.onTemplateItemChangeWithoutEvent,
    onTemplateEditorChangeHandler: this.onTemplateEditorChangeHandler,
    onSendClickHandler: this.onSendClickHandler,
    onSaveDraftHandler: this.onSaveDraftHandler,
    onDownloadClickHandler: this.onDownloadClickHandler,
    // akshay new code added here
    onClickGobackHandler: this.onClickGobackHandler,
    // akshay new code added ended here
  };
  render() {
    // console.log( this.state );
    // console.log( this.props.proposals.createProposal.leadInformation._id );
    this.config.state = this.state;
    return (
      <>
        {this.state.generatingPDF ? <PDFLoader /> : null}
        <div id={"error_message"} className="error_message"></div>
        <div className="proposal_main_editor_panel_main_container_view">
          <HeadingComponent {...this.config} {...this.props} />
          <div className="proposal_main_editor_panel_bottom_view">
            {!this.state.data.isPreviewOpen ? (
              <>
                <SidePanelComponent {...this.config} {...this.props} />
                <WorkingArea {...this.config} {...this.props} />
              </>
            ) : (
              <PreviewPanel {...this.config} {...this.props} />
            )}
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  proposals: state.proposals,
  allLeads: state.leads.activeLeads,
});

export default connect(mapStateToProps, {
  getAllActiveLeads,
  create_new_propsal,
  get_selected_proposal_data,
  update_proposal,
  save_new_propsal,
  autoSavingProposal,
  updateAutosavingProposal,
  delete_proposal_data,
})(withRouter(ProposalMainEditorPanel));

export const WorkingArea = (props) => {
  return (
    <div className="working_area_main_container">
      {!props.state.data.isEditOpen ? (
        <TemplateViewComponent {...props} />
      ) : (
        <TemplateEditorComponent {...props} />
      )}
    </div>
  );
};
