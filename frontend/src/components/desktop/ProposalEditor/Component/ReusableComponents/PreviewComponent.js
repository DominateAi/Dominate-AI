import React from "react";

const PreviewComponent = (props) => {
  return (
    <div className="preview_component_main_container">
      <ButtonPanels {...props} />
      <RenderTemplates {...props} />
    </div>
  );
};

export default PreviewComponent;

export const ButtonPanels = (props) => {
  return (
    <div
      className="button_panel_main_container"
      style={{ justifyContent: "center" }}
    >
      <div className="preview_text">
        Please check you presentation. Then click on "Download" or "Send"
      </div>
      {/* <button onClick={ props.onPreviewPanelToggler( false ) }>Go to Editor</button>&emsp; */}
    </div>
  );
};

export const RenderTemplates = (props) => {
  let displayTemplateList = [],
    displayTemplateListObjects = [];
  const allselectedTemplates = props.state.data.allselectedTemplates;
  if (allselectedTemplates.length !== 0) {
    allselectedTemplates.forEach((element) => {
      let selected_template = props.template_config.filter(
        (data) => element.id === data.name
      );
      selected_template = selected_template[0].value;
      displayTemplateListObjects.push({
        template: selected_template,
        template_data: element,
      });
    });
    displayTemplateList = displayTemplateListObjects.map(
      (data) => data.template
    );
    return (
      <div className="render_template_main_container">
        {displayTemplateList.map((Template, index) => {
          const data = displayTemplateListObjects[index].template_data;
          return (
            <div
              key={index}
              className="single_template_display_container_render"
            >
              <Template
                template_data={data}
                template_index={index}
                noEditMode={true}
                {...props}
              />
            </div>
          );
        })}
      </div>
    );
  }
  return (
    <div className="template_editor_componane_null">Select a template !</div>
  );
};
