import React, { Component } from "react";
import TemplateOption from "../../ReusableComponents/TemplateOption";
import LineColorComponent from "../../ReusableComponents/LineColorComponent";
import ImageComponent from "../../ReusableComponents/ImageComponent";
import TextComponent from "../../ReusableComponents/TextComponent";

export class OT_TemplateThree extends Component {
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

export default OT_TemplateThree;

export const TemplateArea = (props) => {
  const backgroundColor = props.template_data.backgroundColor;
  console.log(props.template_data);
  return (
    <div
      id="our_team_template_three"
      className="our_team_template_three template_main_container_display_area"
      style={{ backgroundColor: backgroundColor }}
    >
      <LineColorComponent
        noEditMode={props.noEditMode}
        classNameOfLineDiv="our_team_template_three__line"
        classNameString="img_block_line_background"
        backgroundColor={props.template_data.img_block_line_background}
        onTemplateItemChangeWithoutEvent={
          props.onTemplateItemChangeWithoutEvent
        }
        template_index={props.template_index}
        {...props}
      />
          <div className="our_team_template_three_headline">
              <div className="text-area">
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
      <div className="our_team_template_three_bottom">
        <div className="our_team_template_three_bottom_row_container">
          {/* block one */}
          <div className="our_team_template_three_bottom_block">
            <div className="our_team_template_three_bottom_block_img">
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
            <div className="our_team_template_three_bottom_block_headline">
              <TextComponent
                data_text={props.template_data.para_one_headline}
                noEditMode={props.noEditMode}
                onChange={props.onTemplateEditorChangeHandler(
                  "para_one_headline",
                  props.template_index
                )}
              />
            </div>
            <div className="our_team_template_three_bottom_block_para">
              <TextComponent
                data_text={props.template_data.para_one_text}
                noEditMode={props.noEditMode}
                onChange={props.onTemplateEditorChangeHandler(
                  "para_one_text",
                  props.template_index
                )}
              />
            </div>
          </div>

          {/* block two */}
          <div className="our_team_template_three_bottom_block">
            <div className="our_team_template_three_bottom_block_img">
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
            <div className="our_team_template_three_bottom_block_headline">
              <TextComponent
                data_text={props.template_data.para_two_headline}
                noEditMode={props.noEditMode}
                onChange={props.onTemplateEditorChangeHandler(
                  "para_two_headline",
                  props.template_index
                )}
              />
            </div>
            <div className="our_team_template_three_bottom_block_para">
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
          {/* block three */}
          <div className="our_team_template_three_bottom_block">
            <div className="our_team_template_three_bottom_block_img">
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
            <div className="our_team_template_three_bottom_block_headline">
              <TextComponent
                data_text={props.template_data.para_three_headline}
                noEditMode={props.noEditMode}
                onChange={props.onTemplateEditorChangeHandler(
                  "para_three_headline",
                  props.template_index
                )}
              />
            </div>
            <div className="our_team_template_three_bottom_block_para">
              <TextComponent
                data_text={props.template_data.para_three_text}
                noEditMode={props.noEditMode}
                onChange={props.onTemplateEditorChangeHandler(
                  "para_three_text",
                  props.template_index
                )}
              />
            </div>
          </div>
          {/* block four */}
          <div className="our_team_template_three_bottom_block">
            <div className="our_team_template_three_bottom_block_img">
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
            <div className="our_team_template_three_bottom_block_headline">
              <TextComponent
                data_text={props.template_data.para_four_headline}
                noEditMode={props.noEditMode}
                onChange={props.onTemplateEditorChangeHandler(
                  "para_four_headline",
                  props.template_index
                )}
              />
            </div>
            <div className="our_team_template_three_bottom_block_para">
              <TextComponent
                data_text={props.template_data.para_four_text}
                noEditMode={props.noEditMode}
                onChange={props.onTemplateEditorChangeHandler(
                  "para_four_text",
                  props.template_index
                )}
              />
            </div>
          </div>
          {/* block five */}
          <div className="our_team_template_three_bottom_block">
            <div className="our_team_template_three_bottom_block_img">
              <ImageComponent
                image_width={props.template_data.image_five_width}
                image_crop={props.template_data.image_five_crop}
                main_src={props.template_data.image_five_src}
                src={
                  !props.template_data.image_five_cropped_src
                    ? props.template_data.image_five_src
                    : props.template_data.image_five_cropped_src
                }
                name_normal={"image_five_src"}
                stackClass={`image_five_src${props.template_index}`}
                name_cropped={"image_five_cropped_src"}
                crop_name={"image_five_crop"}
                noEditMode={props.noEditMode}
                {...props}
              />
            </div>
            <div className="our_team_template_three_bottom_block_headline">
              <TextComponent
                data_text={props.template_data.para_five_headline}
                noEditMode={props.noEditMode}
                onChange={props.onTemplateEditorChangeHandler(
                  "para_five_headline",
                  props.template_index
                )}
              />
            </div>
            <div className="our_team_template_three_bottom_block_para">
              <TextComponent
                data_text={props.template_data.para_five_text}
                noEditMode={props.noEditMode}
                onChange={props.onTemplateEditorChangeHandler(
                  "para_five_text",
                  props.template_index
                )}
              />
            </div>
          </div>
        </div>
        {/* row 2 */}
        <div className="our_team_template_three_bottom_row_container">
          {/* block six */}
          <div className="our_team_template_three_bottom_block">
            <div className="our_team_template_three_bottom_block_img">
              <ImageComponent
                image_width={props.template_data.image_six_width}
                image_crop={props.template_data.image_six_crop}
                main_src={props.template_data.image_six_src}
                src={
                  !props.template_data.image_six_cropped_src
                    ? props.template_data.image_six_src
                    : props.template_data.image_six_cropped_src
                }
                name_normal={"image_six_src"}
                stackClass={`image_six_src${props.template_index}`}
                name_cropped={"image_six_cropped_src"}
                crop_name={"image_six_crop"}
                noEditMode={props.noEditMode}
                {...props}
              />
            </div>
            <div className="our_team_template_three_bottom_block_headline">
              <TextComponent
                data_text={props.template_data.para_six_headline}
                noEditMode={props.noEditMode}
                onChange={props.onTemplateEditorChangeHandler(
                  "para_six_headline",
                  props.template_index
                )}
              />
            </div>
            <div className="our_team_template_three_bottom_block_para">
              <TextComponent
                data_text={props.template_data.para_six_text}
                noEditMode={props.noEditMode}
                onChange={props.onTemplateEditorChangeHandler(
                  "para_six_text",
                  props.template_index
                )}
              />
            </div>
          </div>

          {/* block seven */}
          <div className="our_team_template_three_bottom_block">
            <div className="our_team_template_three_bottom_block_img">
              <ImageComponent
                image_width={props.template_data.image_seven_width}
                image_crop={props.template_data.image_seven_crop}
                main_src={props.template_data.image_seven_src}
                src={
                  !props.template_data.image_seven_cropped_src
                    ? props.template_data.image_seven_src
                    : props.template_data.image_seven_cropped_src
                }
                name_normal={"image_seven_src"}
                stackClass={`image_seven_src${props.template_index}`}
                name_cropped={"image_seven_cropped_src"}
                crop_name={"image_seven_crop"}
                noEditMode={props.noEditMode}
                {...props}
              />
            </div>
            <div className="our_team_template_three_bottom_block_headline">
              <TextComponent
                data_text={props.template_data.para_seven_headline}
                noEditMode={props.noEditMode}
                onChange={props.onTemplateEditorChangeHandler(
                  "para_seven_headline",
                  props.template_index
                )}
              />
            </div>
            <div className="our_team_template_three_bottom_block_para">
              <TextComponent
                data_text={props.template_data.para_seven_text}
                noEditMode={props.noEditMode}
                onChange={props.onTemplateEditorChangeHandler(
                  "para_seven_text",
                  props.template_index
                )}
              />
            </div>
          </div>
          {/* block eight */}
          <div className="our_team_template_three_bottom_block">
            <div className="our_team_template_three_bottom_block_img">
              <ImageComponent
                image_width={props.template_data.image_eight_width}
                image_crop={props.template_data.image_eight_crop}
                main_src={props.template_data.image_eight_src}
                src={
                  !props.template_data.image_eight_cropped_src
                    ? props.template_data.image_eight_src
                    : props.template_data.image_eight_cropped_src
                }
                name_normal={"image_eight_src"}
                stackClass={`image_eight_src${props.template_index}`}
                name_cropped={"image_eight_cropped_src"}
                crop_name={"image_eight_crop"}
                noEditMode={props.noEditMode}
                {...props}
              />
            </div>
            <div className="our_team_template_three_bottom_block_headline">
              <TextComponent
                data_text={props.template_data.para_eight_headline}
                noEditMode={props.noEditMode}
                onChange={props.onTemplateEditorChangeHandler(
                  "para_eight_headline",
                  props.template_index
                )}
              />
            </div>
            <div className="our_team_template_three_bottom_block_para">
              <TextComponent
                data_text={props.template_data.para_eight_text}
                noEditMode={props.noEditMode}
                onChange={props.onTemplateEditorChangeHandler(
                  "para_eight_text",
                  props.template_index
                )}
              />
            </div>
          </div>
          {/* block nine */}
          <div className="our_team_template_three_bottom_block">
            <div className="our_team_template_three_bottom_block_img">
              <ImageComponent
                image_width={props.template_data.image_nine_width}
                image_crop={props.template_data.image_nine_crop}
                main_src={props.template_data.image_nine_src}
                src={
                  !props.template_data.image_nine_cropped_src
                    ? props.template_data.image_nine_src
                    : props.template_data.image_nine_cropped_src
                }
                name_normal={"image_nine_src"}
                stackClass={`image_nine_src${props.template_index}`}
                name_cropped={"image_nine_cropped_src"}
                crop_name={"image_nine_crop"}
                noEditMode={props.noEditMode}
                {...props}
              />
            </div>
            <div className="our_team_template_three_bottom_block_headline">
              <TextComponent
                data_text={props.template_data.para_nine_headline}
                noEditMode={props.noEditMode}
                onChange={props.onTemplateEditorChangeHandler(
                  "para_nine_headline",
                  props.template_index
                )}
              />
            </div>
            <div className="our_team_template_three_bottom_block_para">
              <TextComponent
                data_text={props.template_data.para_nine_text}
                noEditMode={props.noEditMode}
                onChange={props.onTemplateEditorChangeHandler(
                  "para_nine_text",
                  props.template_index
                )}
              />
            </div>
          </div>
          {/* block five */}
          <div className="our_team_template_three_bottom_block">
            <div className="our_team_template_three_bottom_block_img">
              <ImageComponent
                image_width={props.template_data.image_ten_width}
                image_crop={props.template_data.image_ten_crop}
                main_src={props.template_data.image_ten_src}
                src={
                  !props.template_data.image_ten_cropped_src
                    ? props.template_data.image_ten_src
                    : props.template_data.image_ten_cropped_src
                }
                name_normal={"image_ten_src"}
                stackClass={`image_ten_src${props.template_index}`}
                name_cropped={"image_ten_cropped_src"}
                crop_name={"image_ten_crop"}
                noEditMode={props.noEditMode}
                {...props}
              />
            </div>
            <div className="our_team_template_three_bottom_block_headline">
              <TextComponent
                data_text={props.template_data.para_ten_headline}
                noEditMode={props.noEditMode}
                onChange={props.onTemplateEditorChangeHandler(
                  "para_ten_headline",
                  props.template_index
                )}
              />
            </div>
            <div className="our_team_template_three_bottom_block_para">
              <TextComponent
                data_text={props.template_data.para_ten_text}
                noEditMode={props.noEditMode}
                onChange={props.onTemplateEditorChangeHandler(
                  "para_ten_text",
                  props.template_index
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
