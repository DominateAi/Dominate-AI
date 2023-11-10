import React, { Component } from "react";
import TemplateOption from "../../ReusableComponents/TemplateOption";
import LineColorComponent from "../../ReusableComponents/LineColorComponent";
import ImageComponent from "../../ReusableComponents/ImageComponent";
import TextComponent from "../../ReusableComponents/TextComponent";
import IconTextComponent from "../../ReusableComponents/IconTextComponent";

export class Vision_TemplateThree extends Component {
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

export default Vision_TemplateThree;
export const TemplateArea = (props) => {
  const backgroundColor = props.template_data.backgroundColor;
  console.log(props.template_data);
  return (
    <div
      id="vission_template_three"
      className="vission_template_three template_main_container_display_area"
      style={{ backgroundColor: backgroundColor }}
    >
      <div className="vission_template_three_left">
        <div className="vission_template_three_left_top">
          <div className="vission_template_three_left_headline">
            <TextComponent
              data_text={props.template_data.headline}
              noEditMode={props.noEditMode}
              onChange={props.onTemplateEditorChangeHandler(
                "headline",
                props.template_index
              )}
            />
          </div>
          <LineColorComponent
            noEditMode={props.noEditMode}
            classNameOfLineDiv="vission_template_three_top_line"
            classNameString="img_block_line_background"
            backgroundColor={props.template_data.img_block_line_background}
            onTemplateItemChangeWithoutEvent={
              props.onTemplateItemChangeWithoutEvent
            }
            template_index={props.template_index}
            {...props}
          />
        </div>
        <div className="vission_template_three_left_para">
          <IconTextComponent
            classNameOfLineDiv="vission_template_three_left_para_outer"
            classNameOfOuterDiv="vission_template_three_left_para_inner"
            classNameOfheadlineDiv="vission_template_three_left_para_head"
            classNameOfParaDiv="vission_template_three_left_para_para"
            data_text={props.template_data.para_one_headline}
            noEditMode={props.noEditMode}
            onChange={props.onTemplateEditorChangeHandler(
              "para_one_headline",
              props.template_index
            )}
            data_text_two={props.template_data.para_one_text}
            onChange_two={props.onTemplateEditorChangeHandler(
              "para_one_text",
              props.template_index
            )}
            backgroundColor={props.template_data.img_block_line_background_two}
            onTemplateItemChangeWithoutEvent={
              props.onTemplateItemChangeWithoutEvent
            }
            noEditMode={props.noEditMode}
            classNameString="img_block_line_background_two"
            template_index={props.template_index}
            {...props}
          />
        </div>
      </div>
      <div className="vission_template_three_right">
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
