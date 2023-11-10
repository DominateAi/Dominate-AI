import React, { Component } from "react";
import TemplateOption from "../../ReusableComponents/TemplateOption";
import TextComponent from "../../ReusableComponents/TextComponent";
import LineColorComponent from "../../ReusableComponents/LineColorComponent";
import IconTextComponent from "../../ReusableComponents/IconTextComponent";

export class OCapabilities_TemplateThree extends Component {
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

export default OCapabilities_TemplateThree;

export const TemplateArea = (props) => {
  const backgroundColor = props.template_data.backgroundColor;
  // console.log( props.template_data );
  return (
    <div
      id="our_capabilities_template_three"
      className="our_capabilities_template_three template_main_container_display_area"
      style={{ backgroundColor: backgroundColor }}
    >
      <div className="our_capabilities_template_three_top">
        <div className="our_capabilities_template_three_headline">
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
          classNameOfLineDiv="our_capabilities_template_three__top__line"
          classNameString="img_block_line_background"
          backgroundColor={props.template_data.img_block_line_background}
          onTemplateItemChangeWithoutEvent={
            props.onTemplateItemChangeWithoutEvent
          }
          template_index={props.template_index}
          {...props}
        />
      </div>
      <div className="our_capabilities_template_three_bottom">
        {/* block 1 */}
        <IconTextComponent
          classNameOfLineDiv="our_capabilities_template_three_bottom_outer"
          classNameOfOuterDiv="our_capabilities_template_two_bottom_inner"
          classNameOfheadlineDiv="our_capabilities_template_three_bottom_head"
          classNameOfParaDiv="our_capabilities_template_three_bottom_para"
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
        {/* block 2 */}
        <IconTextComponent
          classNameOfLineDiv="our_capabilities_template_three_bottom_outer"
          classNameOfOuterDiv="our_capabilities_template_two_bottom_inner"
          classNameOfheadlineDiv="our_capabilities_template_three_bottom_head"
          classNameOfParaDiv="our_capabilities_template_three_bottom_para"
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
          backgroundColor={props.template_data.img_block_line_background_two}
          onTemplateItemChangeWithoutEvent={
            props.onTemplateItemChangeWithoutEvent
          }
          noEditMode={props.noEditMode}
          classNameString="img_block_line_background_two"
          template_index={props.template_index}
          {...props}
        />
        {/* block 3 */}
        <IconTextComponent
          classNameOfLineDiv="our_capabilities_template_three_bottom_outer"
          classNameOfOuterDiv="our_capabilities_template_two_bottom_inner"
          classNameOfheadlineDiv="our_capabilities_template_three_bottom_head"
          classNameOfParaDiv="our_capabilities_template_three_bottom_para"
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
          backgroundColor={props.template_data.img_block_line_background_two}
          onTemplateItemChangeWithoutEvent={
            props.onTemplateItemChangeWithoutEvent
          }
          noEditMode={props.noEditMode}
          classNameString="img_block_line_background_two"
          template_index={props.template_index}
          {...props}
        />
        {/* block 4 */}
        <IconTextComponent
          classNameOfLineDiv="our_capabilities_template_three_bottom_outer"
          classNameOfOuterDiv="our_capabilities_template_two_bottom_inner"
          classNameOfheadlineDiv="our_capabilities_template_three_bottom_head"
          classNameOfParaDiv="our_capabilities_template_three_bottom_para"
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
  );
};
