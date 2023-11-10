import React, { Component } from "react";
import TemplateOption from "../../ReusableComponents/TemplateOption";
import ImageComponent from "../../ReusableComponents/ImageComponent";
import TextComponent from "../../ReusableComponents/TextComponent";

export class FA_TemplateFour extends Component {
  render() {
    return (
      <div className="template_main_container">
        {!this.props.noEditMode ? (
          <TemplateOption
            backgroundColor={this.props.template_data.backgroundColor}
            displayLogo={this.props.template_data.display_logo}
            onTemplateItemChangeWithoutEvent={
              this.props.onTemplateItemChangeWithoutEvent
            }
            template_index={this.props.template_index}
            {...this.props}
          />
        ) : null}
        <div className="template_display_area">
          <TemplateArea {...this.props} />
        </div>
      </div>
    );
  }
}

export default FA_TemplateFour;

export const TemplateArea = (props) => {
  const backgroundColor = props.template_data.backgroundColor;
  console.log(props.template_data);
  return (
    <div
      id="financial_analysis_template_four"
      className="financial_analysis_template_four template_main_container_display_area"
      style={{ backgroundColor: backgroundColor }}
    >
      <div className="financial_analysis_template_four_headline">
        <TextComponent
          data_text={props.template_data.headline}
          noEditMode={props.noEditMode}
          onChange={props.onTemplateEditorChangeHandler(
            "headline",
            props.template_index
          )}
        />
      </div>
      <div className="financial_analysis_template_four_middle">
        <div className="financial_analysis_template_four_middle_para">
          <TextComponent
            data_text={props.template_data.para_one_text}
            noEditMode={props.noEditMode}
            onChange={props.onTemplateEditorChangeHandler(
              "para_one_text",
              props.template_index
            )}
          />
        </div>
        <div className="financial_analysis_template_four_middle_para">
          <TextComponent
            data_text={props.template_data.para_two_text}
            noEditMode={props.noEditMode}
            onChange={props.onTemplateEditorChangeHandler(
              "para_two_text",
              props.template_index
            )}
          />
        </div>
      </div>
      <div className="financial_analysis_template_four_middle_bottom">
        <ImageComponent
          image_width={props.template_data.image_one_width}
          image_crop={props.template_data.image_one_crop}
          main_src={props.template_data.image_one_src}
          src={
            !props.template_data.image_one_cropped_src
              ? props.template_data.image_one_src
              : props.template_data.image_one_cropped_src
          }
          name_normal={"image_one_src"}
          stackClass={`image_one_src${props.template_index}`}
          name_cropped={"image_one_cropped_src"}
          crop_name={"image_one_crop"}
          noEditMode={props.noEditMode}
          {...props}
        />
      </div>
    </div>
  );
};
