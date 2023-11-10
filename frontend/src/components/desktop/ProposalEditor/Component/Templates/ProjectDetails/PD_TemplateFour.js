import React, { Component } from "react";
import TemplateOption from "../../ReusableComponents/TemplateOption";
import LineColorComponent from "../../ReusableComponents/LineColorComponent";
import ImageComponent from "../../ReusableComponents/ImageComponent";
import TextComponent from "../../ReusableComponents/TextComponent";
import IconComponent from "../../ReusableComponents/IconSelectionComponent";

export class PD_TemplateFour extends Component {
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

export default PD_TemplateFour;

export const TemplateArea = (props) => {
  const backgroundColor = props.template_data.backgroundColor;
  console.log(props.template_data);
  return (
    <div
      id="project_details_four"
      className="project_details_four template_main_container_display_area"
      style={{ backgroundColor: backgroundColor }}
    >
      <div className="project_details_four_left">
        <div className="project_details_four_top">
          <TextComponent
            data_text={props.template_data.headline}
            noEditMode={props.noEditMode}
            onChange={props.onTemplateEditorChangeHandler(
              "headline",
              props.template_index
            )}
          />
        </div>
        <div className="project_details_four_left_bottom">
          <div className="project_details_four_left_bottom_container">
            {/* block 1 */}
            <div className="project_details_four_left_bottom_block">
              <div className="project_details_four_left_bottom_block_left">
                <IconComponent
                  icon_name={props.template_data.icon_name_one}
                  icon_background={props.template_data.icon_background_one}
                  icon_size={props.template_data.icon_size_one}
                  icon_color={props.template_data.icon_one_color}
                  icon_name_id={"icon_name_one"}
                  stackClass={`icon_name_one${props.template_index}`}
                  icon_background_name={"icon_background_one"}
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
              <div className="project_details_four_left_bottom_block_right">
                <div className="project_details_four_left_bottom_block_right_headline">
                  <TextComponent
                    data_text={props.template_data.para_one_headline}
                    noEditMode={props.noEditMode}
                    onChange={props.onTemplateEditorChangeHandler(
                      "para_one_headline",
                      props.template_index
                    )}
                  />
                </div>
                <div className="project_details_four_left_bottom_block_right_para">
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
            </div>
            {/* 2nd block */}
            <div className="project_details_four_left_bottom_block">
              <div className="project_details_four_left_bottom_block_left">
                <IconComponent
                  icon_name={props.template_data.icon_name_two}
                  icon_background={props.template_data.icon_background_two}
                  icon_size={props.template_data.icon_size_two}
                  icon_color={props.template_data.icon_two_color}
                  icon_name_id={"icon_name_two"}
                  stackClass={`icon_name_two${props.template_index}`}
                  icon_background_name={"icon_background_two"}
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
              <div className="project_details_four_left_bottom_block_right">
                <div className="project_details_four_left_bottom_block_right_headline">
                  <TextComponent
                    data_text={props.template_data.para_two_headline}
                    noEditMode={props.noEditMode}
                    onChange={props.onTemplateEditorChangeHandler(
                      "para_two_headline",
                      props.template_index
                    )}
                  />
                </div>
                <div className="project_details_four_left_bottom_block_right_para">
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
          <div className="project_details_four_left_bottom_container">
            {/* 3 rd */}
            <div className="project_details_four_left_bottom_block">
              <div className="project_details_four_left_bottom_block_left">
                <IconComponent
                  icon_name={props.template_data.icon_name_three}
                  icon_background={props.template_data.icon_background_three}
                  icon_size={props.template_data.icon_size_three}
                  icon_color={props.template_data.icon_three_color}
                  icon_name_id={"icon_name_three"}
                  stackClass={`icon_name_three${props.template_index}`}
                  icon_background_name={"icon_background_three"}
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
              <div className="project_details_four_left_bottom_block_right">
                <div className="project_details_four_left_bottom_block_right_headline">
                  <TextComponent
                    data_text={props.template_data.para_three_headline}
                    noEditMode={props.noEditMode}
                    onChange={props.onTemplateEditorChangeHandler(
                      "para_three_headline",
                      props.template_index
                    )}
                  />
                </div>
                <div className="project_details_four_left_bottom_block_right_para">
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
            </div>
            {/* 4th */}
            <div className="project_details_four_left_bottom_block">
              <div className="project_details_four_left_bottom_block_left">
                <IconComponent
                  icon_name={props.template_data.icon_name_four}
                  icon_background={props.template_data.icon_background_four}
                  icon_size={props.template_data.icon_size_four}
                  icon_color={props.template_data.icon_four_color}
                  icon_name_id={"icon_name_four"}
                  stackClass={`icon_name_four${props.template_index}`}
                  icon_background_name={"icon_background_four"}
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
              <div className="project_details_four_left_bottom_block_right">
                <div className="project_details_four_left_bottom_block_right_headline">
                  <TextComponent
                    data_text={props.template_data.para_four_headline}
                    noEditMode={props.noEditMode}
                    onChange={props.onTemplateEditorChangeHandler(
                      "para_four_headline",
                      props.template_index
                    )}
                  />
                </div>
                <div className="project_details_four_left_bottom_block_right_para">
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
            </div>
          </div>

          <div className="project_details_four_left_bottom_container">
            {/* 3 rd */}
            <div className="project_details_four_left_bottom_block">
              <div className="project_details_four_left_bottom_block_left">
                <IconComponent
                  icon_name={props.template_data.icon_name_five}
                  icon_background={props.template_data.icon_background_five}
                  icon_size={props.template_data.icon_size_five}
                  icon_color={props.template_data.icon_five_color}
                  icon_name_id={"icon_name_five"}
                  stackClass={`icon_name_five${props.template_index}`}
                  icon_background_name={"icon_background_five"}
                  icon_size_name={"icon_size_five"}
                  icon_modal_name={"icon_five_modal"}
                  icon_color_name={"icon_five_color"}
                  onTemplateItemChange={props.onTemplateItemChange}
                  onTemplateItemChangeWithoutEvent={
                    props.onTemplateItemChangeWithoutEvent
                  }
                  template_index={props.template_index}
                  noEditMode={props.noEditMode}
                />
              </div>
              <div className="project_details_four_left_bottom_block_right">
                <div className="project_details_four_left_bottom_block_right_headline">
                  <TextComponent
                    data_text={props.template_data.para_five_headline}
                    noEditMode={props.noEditMode}
                    onChange={props.onTemplateEditorChangeHandler(
                      "para_five_headline",
                      props.template_index
                    )}
                  />
                </div>
                <div className="project_details_four_left_bottom_block_right_para">
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
            {/* 4th */}
            <div className="project_details_four_left_bottom_block">
              <div className="project_details_four_left_bottom_block_left">
                <IconComponent
                  icon_name={props.template_data.icon_name_six}
                  icon_background={props.template_data.icon_background_six}
                  icon_size={props.template_data.icon_size_six}
                  icon_color={props.template_data.icon_six_color}
                  icon_name_id={"icon_name_six"}
                  stackClass={`icon_name_six${props.template_index}`}
                  icon_background_name={"icon_background_six"}
                  icon_size_name={"icon_size_six"}
                  icon_modal_name={"icon_six_modal"}
                  icon_color_name={"icon_six_color"}
                  onTemplateItemChange={props.onTemplateItemChange}
                  onTemplateItemChangeWithoutEvent={
                    props.onTemplateItemChangeWithoutEvent
                  }
                  template_index={props.template_index}
                  noEditMode={props.noEditMode}
                />
              </div>
              <div className="project_details_four_left_bottom_block_right">
                <div className="project_details_four_left_bottom_block_right_headline">
                  <TextComponent
                    data_text={props.template_data.para_six_headline}
                    noEditMode={props.noEditMode}
                    onChange={props.onTemplateEditorChangeHandler(
                      "para_six_headline",
                      props.template_index
                    )}
                  />
                </div>
                <div className="project_details_four_left_bottom_block_right_para">
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
            </div>
          </div>
        </div>
      </div>
      <div className="project_details_four_right">
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
