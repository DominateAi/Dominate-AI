import React from "react";
import FrontPage from "../../asset/thumbnails/FrontPage/index";
import Introduction from "../../asset/thumbnails/Introduction/index";
import AboutUs from "../../asset/thumbnails/AboutUs/index";
import Whatwedo from "../../asset/thumbnails/Whatwedo/index";
import ProjectDetails from "../../asset/thumbnails/ProjectDetails/index";
import ThankYou from "../../asset/thumbnails/ThankYou/index";
import OurMission from "../../asset/thumbnails/OurMission/index";
import OurPortfolio from "../../asset/thumbnails/OurPortfolio/index";
import OurClients from "../../asset/thumbnails/OurClients/index";
import OurTeam from "../../asset/thumbnails/OurTeam/index";
import OurProcess from "../../asset/thumbnails/OurProcess/index";
import OurCapabilities from "../../asset/thumbnails/OurCapabilities/index";
import Vision from "../../asset/thumbnails/Vision/index";
import BusinessModel from "../../asset/thumbnails/BusinessModel/index";
import FinancialAnalysis from "../../asset/thumbnails/FinancialAnalysis/index";
import ContactUs from "../../asset/thumbnails/ContactUs/index";
import SWOT from "../../asset/thumbnails/SWOT/index";

const TemplateViewComponent = (props) => {
  return (
    <div className="template_view_component_main_container">
      <div className="template_view_headline">
        Start creating your presentation
      </div>
      <SingleTemplateView
        name="Cover Page"
        valueTemplate={FrontPage}
        {...props}
      />

      <SingleTemplateView
        name="Introduction"
        valueTemplate={Introduction}
        {...props}
      />

      <SingleTemplateView name="About Us" valueTemplate={AboutUs} {...props} />

      <SingleTemplateView
        name="Our Mission"
        valueTemplate={OurMission}
        {...props}
      />

      <SingleTemplateView
        name="Our Portfolio"
        valueTemplate={OurPortfolio}
        {...props}
      />

      <SingleTemplateView
        name="Our Clients"
        valueTemplate={OurClients}
        {...props}
      />

      <SingleTemplateView
        name="What We Do"
        valueTemplate={Whatwedo}
        {...props}
      />

      <SingleTemplateView name="Our Team" valueTemplate={OurTeam} {...props} />

      <SingleTemplateView
        name="Our Process"
        valueTemplate={OurProcess}
        {...props}
      />

      <SingleTemplateView
        name="Project Details"
        valueTemplate={ProjectDetails}
        {...props}
      />

      <SingleTemplateView
        name="Our Capabilities"
        valueTemplate={OurCapabilities}
        {...props}
      />

      <SingleTemplateView name="Vision" valueTemplate={Vision} {...props} />

      <SingleTemplateView
        name="Business Model"
        valueTemplate={BusinessModel}
        {...props}
      />

      <SingleTemplateView
        name="Financial Analysis"
        valueTemplate={FinancialAnalysis}
        {...props}
      />

      <SingleTemplateView
        name="Contact Us"
        valueTemplate={ContactUs}
        {...props}
      />

      <SingleTemplateView
        name="SWOT Analysis"
        valueTemplate={SWOT}
        {...props}
      />
      <SingleTemplateView
        name="Thank You"
        valueTemplate={ThankYou}
        {...props}
      />
    </div>
  );
};

export default TemplateViewComponent;

export const SingleTemplateView = (props) => {
  return (
    <div className="single_template_view">
      <div className="single_template_view_headline">{props.name}</div>
      <div className="signle_template_view_card_display_area">
        {props.valueTemplate.map((template, index) => (
          <div
            key={index}
            className="thumbnail_view"
            onClick={props.onClickSelectTemplateHandler(template)}
          >
            <img
              src={template.thumbnail}
              alt="thumbnailview"
              style={{ height: "100%", width: "100%" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
