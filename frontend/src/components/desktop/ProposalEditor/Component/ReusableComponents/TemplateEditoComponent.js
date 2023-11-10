import React from "react";

const TemplateEditoComponent = (props) => {
  const allselectedTemplates = props.state.data.allselectedTemplates;
  const selectedTemplateCurrentIndex =
    props.state.data.selectedTemplateCurrentIndex;
  if (
    selectedTemplateCurrentIndex !== "" &&
    allselectedTemplates.length !== 0
  ) {
    const selectedTemplateObject =
      allselectedTemplates[selectedTemplateCurrentIndex];
    if (selectedTemplateObject) {
      let selectedTemplate = props.template_config.filter(
        (data) => data.name === selectedTemplateObject.id
      );
      if (selectedTemplate.length !== 0) {
        const SelectedTemplate = selectedTemplate[0].value;
        return (
          <div className="template_editor_component_main">
            <SelectedTemplate
              template_data={selectedTemplateObject}
              template_index={selectedTemplateCurrentIndex}
              {...props}
            />
          </div>
        );
      }
    }
  }

  return (
    <div className="template_editor_componane_null">Select a template !</div>
  );
};

export default TemplateEditoComponent;
