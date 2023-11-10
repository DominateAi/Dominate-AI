import React, { Component } from "react";
import TemplateOption from "../../ReusableComponents/TemplateOption";
import ImageComponent from "../../ReusableComponents/ImageComponent";
import TextComponent from "../../ReusableComponents/TextComponent";
import LineColorComponent from "../../ReusableComponents/LineColorComponent";
import LineColorAndText from "../../ReusableComponents/LineColorAndText";
export class Swot_TemplateTwo extends Component {
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

export default Swot_TemplateTwo;

export const TemplateArea = (props) => {
  const backgroundColor = props.template_data.backgroundColor;
  // console.log( props.template_data );
  return (
    <div
      id="swot_template_two"
      className="swot_template_two template_main_container_display_area"
      style={{ backgroundColor: backgroundColor }}
    >
      <div className="swot_template_two_top">
        <div className="swot_template_two_top_headline">
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
          classNameOfLineDiv="swot_template_three_top_line"
          classNameString="img_block_line_background"
          backgroundColor={props.template_data.img_block_line_background}
          onTemplateItemChangeWithoutEvent={
            props.onTemplateItemChangeWithoutEvent
          }
          template_index={props.template_index}
          {...props}
        />
      </div>
      <div className="swot_template_two_bottom">
        {/* block 1 */}
        <div className="swot_template_two_bottom_block">
          <div className="swot_template_two_bottom_block_top">
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
          <LineColorAndText
            data_text={props.template_data.para_one_text}
            noEditMode={props.noEditMode}
            onChange={props.onTemplateEditorChangeHandler(
              "para_one_text",
              props.template_index
            )}
            backgroundColor={props.template_data.backgroundColorText}
            onTemplateItemChangeWithoutEvent={
              props.onTemplateItemChangeWithoutEvent
            }
            template_index={props.template_index}
            {...props}
            //noEditMode={props.noEditMode}
            classNameOfLineDiv="swot_template_two_bottom_block_bottom_para"
            classNameString="backgroundColorText"
          />
        </div>
        {/* block 2 */}
        <div className="swot_template_two_bottom_block">
          <div className="swot_template_two_bottom_block_top">
            <ImageComponent
              image_width={props.template_data.image_two_width}
              image_crop={props.template_data.image_two_crop}
              main_src={props.template_data.image_two_src}
              src={
                !props.template_data.image_two_cropped_src
                  ? props.template_data.image_two_src
                  : props.template_data.image_two_cropped_src
              }
              name_normal={"image_two_src"}
              stackClass={`image_two_src${props.template_index}`}
              name_cropped={"image_two_cropped_src"}
              crop_name={"image_two_crop"}
              noEditMode={props.noEditMode}
              {...props}
            />
          </div>
          <LineColorAndText
            data_text={props.template_data.para_two_text}
            noEditMode={props.noEditMode}
            onChange={props.onTemplateEditorChangeHandler(
              "para_two_text",
              props.template_index
            )}
            backgroundColor={props.template_data.backgroundColorText_two}
            onTemplateItemChangeWithoutEvent={
              props.onTemplateItemChangeWithoutEvent
            }
            template_index={props.template_index}
            {...props}
            //noEditMode={props.noEditMode}
            classNameOfLineDiv="swot_template_two_bottom_block_bottom_para"
            classNameString="backgroundColorText_two"
          />
        </div>

        {/* block 3 */}
        <div className="swot_template_two_bottom_block">
          <div className="swot_template_two_bottom_block_top">
            <ImageComponent
              image_width={props.template_data.image_three_width}
              image_crop={props.template_data.image_three_crop}
              main_src={props.template_data.image_three_src}
              src={
                !props.template_data.image_three_cropped_src
                  ? props.template_data.image_three_src
                  : props.template_data.image_three_cropped_src
              }
              name_normal={"image_three_src"}
              stackClass={`image_three_src${props.template_index}`}
              name_cropped={"image_three_cropped_src"}
              crop_name={"image_three_crop"}
              noEditMode={props.noEditMode}
              {...props}
            />
          </div>
          <LineColorAndText
            data_text={props.template_data.para_three_text}
            noEditMode={props.noEditMode}
            onChange={props.onTemplateEditorChangeHandler(
              "para_three_text",
              props.template_index
            )}
            backgroundColor={props.template_data.backgroundColorText_three}
            onTemplateItemChangeWithoutEvent={
              props.onTemplateItemChangeWithoutEvent
            }
            template_index={props.template_index}
            {...props}
            //noEditMode={props.noEditMode}
            classNameOfLineDiv="swot_template_two_bottom_block_bottom_para"
            classNameString="backgroundColorText_three"
          />
        </div>

        {/* block 4 */}
        <div className="swot_template_two_bottom_block">
          <div className="swot_template_two_bottom_block_top">
            <ImageComponent
              image_width={props.template_data.image_four_width}
              image_crop={props.template_data.image_four_crop}
              main_src={props.template_data.image_four_src}
              src={
                !props.template_data.image_four_cropped_src
                  ? props.template_data.image_four_src
                  : props.template_data.image_four_cropped_src
              }
              name_normal={"image_four_src"}
              stackClass={`image_four_src${props.template_index}`}
              name_cropped={"image_four_cropped_src"}
              crop_name={"image_four_crop"}
              noEditMode={props.noEditMode}
              {...props}
            />
          </div>
          <LineColorAndText
            data_text={props.template_data.para_four_text}
            noEditMode={props.noEditMode}
            onChange={props.onTemplateEditorChangeHandler(
              "para_four_text",
              props.template_index
            )}
            backgroundColor={props.template_data.backgroundColorText_four}
            onTemplateItemChangeWithoutEvent={
              props.onTemplateItemChangeWithoutEvent
            }
            template_index={props.template_index}
            {...props}
            //noEditMode={props.noEditMode}
            classNameOfLineDiv="swot_template_two_bottom_block_bottom_para"
            classNameString="backgroundColorText_four"
          />
        </div>
      </div>
    </div>
  );
};
