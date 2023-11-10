import React, { Component } from "react";
import TemplateOption from "../../ReusableComponents/TemplateOption";
import ImageComponent from "../../ReusableComponents/ImageComponent";
import TextComponent from "../../ReusableComponents/TextComponent";
import LineColorComponent from "../../ReusableComponents/LineColorComponent";

export class I_TemplateThree extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    //template_data
    //template_index
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
            display_logo_setting={true}
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

export default I_TemplateThree;

export const TemplateArea = (props) => {
  const backgroundColor = props.template_data.backgroundColor;

  return (
    <div
      id="introduction_template_three"
      className="introduction_template_three template_main_container_display_area"
      style={{ backgroundColor: backgroundColor }}
    >
      <div className="introduction_template_three__left">
        {/* gray block left  */}
        <LineColorComponent
          noEditMode={props.noEditMode}
          classNameOfLineDiv="introduction_template_three__left__image_container_line"
          classNameString="img_block_line_background"
          backgroundColor={props.template_data.img_block_line_background}
          onTemplateItemChangeWithoutEvent={
            props.onTemplateItemChangeWithoutEvent
          }
          template_index={props.template_index}
          {...props}
        />
        {/* gray block left end */}
        <div
          className="introduction_template_three__left__image_container"
          style={{ width: props.template_data.image_one_width }}
        >
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
      <div className="introduction_template_three__right">
        <div className="introduction_template_three__right_text_area_headline">
          {/* line at start of title  */}
          <LineColorComponent
            noEditMode={props.noEditMode}
            classNameOfLineDiv="introduction_template_headline_sq"
            classNameString="introduction_template_headline_sq__bgColor"
            backgroundColor={
              props.template_data.introduction_template_headline_sq__bgColor
            }
            onTemplateItemChangeWithoutEvent={
              props.onTemplateItemChangeWithoutEvent
            }
            template_index={props.template_index}
            {...props}
          />
          {/* line at start of title end */}

          <TextComponent
            data_text={props.template_data.headline}
            noEditMode={props.noEditMode}
            onChange={props.onTemplateEditorChangeHandler(
              "headline",
              props.template_index
            )}
          />
        </div>
        <div className="introduction_template_three__right_text_area_div">
          <div className="introduction_template_three__right_text_area_headline1">
            <TextComponent
              data_text={props.template_data.heading_one_text}
              noEditMode={props.noEditMode}
              onChange={props.onTemplateEditorChangeHandler(
                "heading_one_text",
                props.template_index
              )}
            />
          </div>
          <div className="introduction_template_three__right_text_area_para1">
            <TextComponent
              data_text={props.template_data.para_one_text}
              noEditMode={props.noEditMode}
              onChange={props.onTemplateEditorChangeHandler(
                "para_one_text",
                props.template_index
              )}
            />
          </div>
          <div className="introduction_template_three__right_text_area_headline1">
            <TextComponent
              data_text={props.template_data.heading_two_text}
              noEditMode={props.noEditMode}
              onChange={props.onTemplateEditorChangeHandler(
                "heading_two_text",
                props.template_index
              )}
            />
          </div>
          <div className="introduction_template_three__right_text_area_para1">
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
      </div>
    </div>
  );
};
