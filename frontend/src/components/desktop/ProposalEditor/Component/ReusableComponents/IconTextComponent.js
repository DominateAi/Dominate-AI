import React, { useState } from "react";
import CKEditor from "ckeditor4-react";
import Modal from "react-bootstrap/Modal";
import { SketchPicker } from "react-color";

const IconTextComponent = (props) => {
  window.CKEDITOR_BASEPATH = "../node_modules/ckeditor/";
  const [openBgColorPaletteModal, colorPaletteModalHandler] = useState(false);
  return (
    <>
      <div
        className={props.classNameOfLineDiv}
        style={{
          backgroundColor: props.backgroundColor,
        }}
        onClick={() => colorPaletteModalHandler(true)}
      >
        <div className={props.classNameOfOuterDiv}>
          <div className={props.classNameOfheadlineDiv}>
            <div className="text_component_main_container">
              <CKEditor
                onBeforeLoad={(CKEDITOR) => (
                  (CKEDITOR.disableAutoInline = true),
                  (CKEDITOR.removePlugins = "cloudservices")
                )}
                data={props.data_text}
                type="inline"
                onChange={props.onChange}
                readOnly={props.noEditMode}
              />
            </div>
          </div>
          <div className={props.classNameOfParaDiv}>
            <div className="text_component_main_container">
              <CKEditor
                onBeforeLoad={(CKEDITOR) => (
                  (CKEDITOR.disableAutoInline = true),
                  (CKEDITOR.removePlugins = "cloudservices")
                )}
                data={props.data_text_two}
                type="inline"
                onChange={props.onChange_two}
                readOnly={props.noEditMode}
              />
            </div>
          </div>
        </div>
      </div>
      {!props.noEditMode && (
        <Modal
          show={openBgColorPaletteModal}
          size={"sm"}
          centered
          onHide={() => colorPaletteModalHandler(false)}
        >
          <Modal.Body>
            <div className="modal_main_container">
              <div className="modal__close_icon_container">
                <div
                  className="modal__close_icon"
                  onClick={() => colorPaletteModalHandler(false)}
                >
                  {props.closeicon}
                </div>
              </div>
              <div className="template_option_main_container__modal">
                <div className="template_headline mt-5">Background color</div>
                <div className="background_color">
                  <SketchPicker
                    color={props.backgroundColor}
                    onChangeComplete={(e) =>
                      props.onTemplateItemChangeWithoutEvent(
                        props.classNameString,
                        props.template_index,
                        e.hex
                      )
                    }
                  />
                </div>
              </div>
              <div className="modal__button_container">
                <button onClick={() => colorPaletteModalHandler(false)}>
                  Save & Close
                </button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      )}{" "}
    </>
  );
};

export default IconTextComponent;
