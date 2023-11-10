import React, { Component } from "react";
import TemplateOption from "../../ReusableComponents/TemplateOption";
import LineColorComponent from "../../ReusableComponents/LineColorComponent";
import ImageComponent from "../../ReusableComponents/ImageComponent";
import TextComponent from "../../ReusableComponents/TextComponent";

export class OC_TemplateThree extends Component {
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

export default OC_TemplateThree;

export const TemplateArea = (props) => {
  const backgroundColor = props.template_data.backgroundColor;
  console.log(props.template_data);
  return (
    <div
      id="our_clients_template_three"
      className="our_clients_template_three template_main_container_display_area"
      style={{ backgroundColor: backgroundColor }}
    >
      <div className="our_clients_template_three_top">
        <div className="our_clients_template_three_top_headline">
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
          classNameOfLineDiv="our_clients_template_three__vertical_line"
          classNameString="img_block_line_background_two"
          backgroundColor={props.template_data.img_block_line_background_two}
          onTemplateItemChangeWithoutEvent={
            props.onTemplateItemChangeWithoutEvent
          }
          template_index={props.template_index}
          {...props}
        />
        <LineColorComponent
          noEditMode={props.noEditMode}
          classNameOfLineDiv="our_clients_template_three__horizontal_line"
          classNameString="img_block_line_background"
          backgroundColor={props.template_data.img_block_line_background}
          onTemplateItemChangeWithoutEvent={
            props.onTemplateItemChangeWithoutEvent
          }
          template_index={props.template_index}
          {...props}
        />
      </div>
      <div className="our_clients_template_three__bottom_container">
        <div className="our_clients_template_three__bottom">
          <div className="our_clients_template_three__bottom_img"></div>
          <div className="our_clients_template_three__bottom_img">
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
          <div className="our_clients_template_three__bottom_img">
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
          <div className="our_clients_template_three__bottom_img">
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
        </div>
        <div className="our_clients_template_three__bottom">
          <div className="our_clients_template_three__bottom_img">
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
          <div className="our_clients_template_three__bottom_img">
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
          <div className="our_clients_template_three__bottom_img">
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
          <div className="our_clients_template_three__bottom_img">
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
        </div>
      </div>
    </div>
  );
};
