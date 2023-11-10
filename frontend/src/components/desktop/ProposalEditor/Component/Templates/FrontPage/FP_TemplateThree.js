import React, { Component } from "react";
import TemplateOption from "../../ReusableComponents/TemplateOption";
import CompanyLogo from "../../ReusableComponents/CompanyLogoComponent";
import ImageComponent from "../../ReusableComponents/ImageComponent";
import TextComponent from "../../ReusableComponents/TextComponent";
import IconComponent from "../../ReusableComponents/IconSelectionComponent";
import LineColorComponent from "../../ReusableComponents/LineColorComponent";

export class FP_TemplateThree extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

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
            display_logo_setting={true}
            {...this.props}
          />
        ) : null}
        <div className="template_display_area">
          <TemplateArea
            {...this.props}
            openBgColorPaletteModal={this.state.openBgColorPaletteModal}
            colorPaletteModalHandler={this.colorPaletteModalHandler}
          />
        </div>
      </div>
    );
  }
}

export default FP_TemplateThree;

export const TemplateArea = (props) => {
  const backgroundColor = props.template_data.backgroundColor;
  console.log(props.template_data);
  return (
    <div
      id="front_page_template_three"
      className="front_page_template_three__template_main_container_display_area"
      style={{ backgroundColor: backgroundColor }}
    >
      <div className="front_page_template_three__top">
        {/* gray block left  */}
        <LineColorComponent
          noEditMode={props.noEditMode}
          classNameOfLineDiv="front_page_template_three__image_container_line"
          classNameString="img_block_line_background"
          backgroundColor={props.template_data.img_block_line_background}
          onTemplateItemChangeWithoutEvent={
            props.onTemplateItemChangeWithoutEvent
          }
          template_index={props.template_index}
          {...props}
        />
        <div className="front_page_template_three__left_logo_area_container">
          {props.template_data.display_logo ? <CompanyLogo {...props} /> : null}
        </div>
      </div>
      {/* gray block left end */}
      <div className="front_page_template_three__middle">
        <div className="front_page_template_three__left">
          <div className="front_page_template_three__left_text_area_headline">
            <TextComponent
              data_text={props.template_data.headline}
              noEditMode={props.noEditMode}
              onChange={props.onTemplateEditorChangeHandler(
                "headline",
                props.template_index
              )}
            />
          </div>
        </div>

        <div
          className="front_page_template_three__right__image_container"
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
      {/* gray block left  */}
      <div className="float-right">
        <LineColorComponent
          noEditMode={props.noEditMode}
          classNameOfLineDiv="front_page_template_three__image_container_line front_page_template_three__image_container_line--right"
          classNameString="img_block_line_background"
          backgroundColor={props.template_data.img_block_line_background}
          onTemplateItemChangeWithoutEvent={
            props.onTemplateItemChangeWithoutEvent
          }
          template_index={props.template_index}
          {...props}
        />
        {/* gray block left end */}
      </div>
    </div>
  );
};
