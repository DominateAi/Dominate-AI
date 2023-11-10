import React, { Component } from "react";
import TemplateOption from "../../ReusableComponents/TemplateOption";
import TextComponent from "../../ReusableComponents/TextComponent";
import LineColorComponent from "../../ReusableComponents/LineColorComponent";
import ImageComponent from "../../ReusableComponents/ImageComponent";
import IconTextComponent from "../../ReusableComponents/IconTextComponent";
import IconComponent from "../../ReusableComponents/IconSelectionComponent";

export class OCapabilities_TemplatesTwo extends Component {
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

export default OCapabilities_TemplatesTwo;
export const TemplateArea = (props) => {
  const backgroundColor = props.template_data.backgroundColor;
  // console.log( props.template_data );
  return (
    <div
      id="our_capabilities_template_two"
      className="our_capabilities_template_two template_main_container_display_area"
      style={{ backgroundColor: backgroundColor }}
    >
      <LineColorComponent
        noEditMode={props.noEditMode}
        classNameOfLineDiv="our_capabilities_template_two__left__line"
        classNameString="img_block_line_background"
        backgroundColor={props.template_data.img_block_line_background}
        onTemplateItemChangeWithoutEvent={
          props.onTemplateItemChangeWithoutEvent
        }
        template_index={props.template_index}
        {...props}
      />
      <div className="our_capabilities_template_two_top">
        <div className="our_capabilities_template_two_headline">
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
          classNameOfLineDiv="our_capabilities_template_two__top__line"
          classNameString="img_block_line_background_two"
          backgroundColor={props.template_data.img_block_line_background_two}
          onTemplateItemChangeWithoutEvent={
            props.onTemplateItemChangeWithoutEvent
          }
          template_index={props.template_index}
          {...props}
        />
      </div>
      <div className="our_capabilities_template_two_bottom">
        <div className="our_capabilities_template_two_bottom_left">
          {/* block 1 */}
          <div className="our_capabilities_template_two_bottom_left_block">
            <div className="our_capabilities_template_two_bottom_left_icon">
              <IconComponent
                icon_name={props.template_data.icon_name_one}
                icon_background={
                  props.template_data.img_block_line_background_three
                }
                icon_size={props.template_data.icon_size_one}
                icon_color={props.template_data.icon_one_color}
                icon_name_id={"icon_name_one"}
                stackClass={`icon_name_one${props.template_index}`}
                icon_background_name={"img_block_line_background_three"}
                icon_size_name={"icon_size_one"}
                icon_modal_name={"icon_one_modal"}
                icon_color_name={"icon_one_color"}
                onTemplateItemChange={props.onTemplateItemChange}
                onTemplateItemChangeWithoutEvent={
                  props.onTemplateItemChangeWithoutEvent
                }
                template_index={props.template_index}
                noEditMode={props.noEditMode}
              />
            </div>
            <div className="our_capabilities_template_two_bottom_left_text">
              <IconTextComponent
                classNameOfOuterDiv="our_capabilities_template_two_bottom_left_outer"
                classNameOfheadlineDiv="our_capabilities_template_two_bottom_left_head"
                classNameOfParaDiv="our_capabilities_template_two_bottom_left_para"
                classNameOfLineDiv="our_capabilities_template_two_bottom_left_background"
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
                backgroundColor={
                  props.template_data.img_block_line_background_three
                }
                onTemplateItemChangeWithoutEvent={
                  props.onTemplateItemChangeWithoutEvent
                }
                // noEditMode={props.noEditMode}
                classNameString="img_block_line_background_three"
                template_index={props.template_index}
                {...props}
              />
            </div>
          </div>
          {/* block end */}
          {/* block 2 */}
          <div className="our_capabilities_template_two_bottom_left_block">
            <div className="our_capabilities_template_two_bottom_left_icon our_capabilities_template_two_bottom_left_icon--2">
              <IconComponent
                icon_name={props.template_data.icon_name_two}
                icon_background={
                  props.template_data.img_block_line_background_three
                }
                icon_size={props.template_data.icon_size_two}
                icon_color={props.template_data.icon_two_color}
                icon_name_id={"icon_name_two"}
                stackClass={`icon_name_two${props.template_index}`}
                icon_background_name={"img_block_line_background_three"}
                icon_size_name={"icon_size_two"}
                icon_modal_name={"icon_two_modal"}
                icon_color_name={"icon_two_color"}
                onTemplateItemChange={props.onTemplateItemChange}
                onTemplateItemChangeWithoutEvent={
                  props.onTemplateItemChangeWithoutEvent
                }
                template_index={props.template_index}
                noEditMode={props.noEditMode}
              />
            </div>
            <div className="our_capabilities_template_two_bottom_left_text">
              <IconTextComponent
                classNameOfOuterDiv="our_capabilities_template_two_bottom_left_outer"
                classNameOfheadlineDiv="our_capabilities_template_two_bottom_left_head"
                classNameOfParaDiv="our_capabilities_template_two_bottom_left_para"
                classNameOfLineDiv="our_capabilities_template_two_bottom_left_background"
                data_text={props.template_data.para_two_headline}
                noEditMode={props.noEditMode}
                onChange={props.onTemplateEditorChangeHandler(
                  "para_two_headline",
                  props.template_index
                )}
                data_text_two={props.template_data.para_two_text}
                onChange_two={props.onTemplateEditorChangeHandler(
                  "para_two_text",
                  props.template_index
                )}
                backgroundColor={
                  props.template_data.img_block_line_background_three
                }
                onTemplateItemChangeWithoutEvent={
                  props.onTemplateItemChangeWithoutEvent
                }
                // noEditMode={props.noEditMode}
                classNameString="img_block_line_background_three"
                template_index={props.template_index}
                {...props}
              />
            </div>
          </div>
          {/* block end */}
          {/* block 3 */}
          <div className="our_capabilities_template_two_bottom_left_block">
            <div className="our_capabilities_template_two_bottom_left_icon">
              <IconComponent
                icon_name={props.template_data.icon_name_three}
                icon_background={
                  props.template_data.img_block_line_background_three
                }
                icon_size={props.template_data.icon_size_three}
                icon_color={props.template_data.icon_three_color}
                icon_name_id={"icon_name_three"}
                stackClass={`icon_name_three${props.template_index}`}
                icon_background_name={"img_block_line_background_three"}
                icon_size_name={"icon_size_three"}
                icon_modal_name={"icon_three_modal"}
                icon_color_name={"icon_three_color"}
                onTemplateItemChange={props.onTemplateItemChange}
                onTemplateItemChangeWithoutEvent={
                  props.onTemplateItemChangeWithoutEvent
                }
                template_index={props.template_index}
                noEditMode={props.noEditMode}
              />
            </div>
            <div className="our_capabilities_template_two_bottom_left_text">
              <IconTextComponent
                classNameOfOuterDiv="our_capabilities_template_two_bottom_left_outer"
                classNameOfheadlineDiv="our_capabilities_template_two_bottom_left_head"
                classNameOfParaDiv="our_capabilities_template_two_bottom_left_para"
                classNameOfLineDiv="our_capabilities_template_two_bottom_left_background"
                data_text={props.template_data.para_three_headline}
                noEditMode={props.noEditMode}
                onChange={props.onTemplateEditorChangeHandler(
                  "para_three_headline",
                  props.template_index
                )}
                data_text_two={props.template_data.para_three_text}
                onChange_two={props.onTemplateEditorChangeHandler(
                  "para_three_text",
                  props.template_index
                )}
                backgroundColor={
                  props.template_data.img_block_line_background_three
                }
                onTemplateItemChangeWithoutEvent={
                  props.onTemplateItemChangeWithoutEvent
                }
                // noEditMode={props.noEditMode}
                classNameString="img_block_line_background_three"
                template_index={props.template_index}
                {...props}
              />
            </div>
          </div>
          {/* block end */}
          {/* block 4 */}
          <div className="our_capabilities_template_two_bottom_left_block">
            <div className="our_capabilities_template_two_bottom_left_icon">
              <IconComponent
                icon_name={props.template_data.icon_name_four}
                icon_background={
                  props.template_data.img_block_line_background_three
                }
                icon_size={props.template_data.icon_size_four}
                icon_color={props.template_data.icon_four_color}
                icon_name_id={"icon_name_four"}
                stackClass={`icon_name_four${props.template_index}`}
                icon_background_name={"img_block_line_background_three"}
                icon_size_name={"icon_size_four"}
                icon_modal_name={"icon_four_modal"}
                icon_color_name={"icon_four_color"}
                onTemplateItemChange={props.onTemplateItemChange}
                onTemplateItemChangeWithoutEvent={
                  props.onTemplateItemChangeWithoutEvent
                }
                template_index={props.template_index}
                noEditMode={props.noEditMode}
              />
            </div>
            <div className="our_capabilities_template_two_bottom_left_text">
              <IconTextComponent
                classNameOfOuterDiv="our_capabilities_template_two_bottom_left_outer"
                classNameOfheadlineDiv="our_capabilities_template_two_bottom_left_head"
                classNameOfParaDiv="our_capabilities_template_two_bottom_left_para"
                classNameOfLineDiv="our_capabilities_template_two_bottom_left_background"
                data_text={props.template_data.para_four_headline}
                noEditMode={props.noEditMode}
                onChange={props.onTemplateEditorChangeHandler(
                  "para_four_headline",
                  props.template_index
                )}
                data_text_two={props.template_data.para_four_text}
                onChange_two={props.onTemplateEditorChangeHandler(
                  "para_four_text",
                  props.template_index
                )}
                backgroundColor={
                  props.template_data.img_block_line_background_three
                }
                onTemplateItemChangeWithoutEvent={
                  props.onTemplateItemChangeWithoutEvent
                }
                // noEditMode={props.noEditMode}
                classNameString="img_block_line_background_three"
                template_index={props.template_index}
                {...props}
              />
            </div>
          </div>
          {/* block end */}
        </div>
        <div className="our_capabilities_template_two_bottom_right">
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
    </div>
  );
};
