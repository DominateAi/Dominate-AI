import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { SketchPicker } from "react-color";

const TemplateOption = (props) => {
  const [openTemplate, onTemplateHandler] = useState(false);
  return (
    <>
      <div className="template_option_main_container">
        <div
          className="template_option_icon"
          onClick={() => onTemplateHandler(true)}
        >
          {props.optionicon}
        </div>
      </div>
      <Modal
        show={openTemplate}
        size={"sm"}
        centered
        onHide={() => onTemplateHandler(false)}
      >
        <Modal.Body>
          <div className="modal_main_container">
            <div className="modal__close_icon_container">
              <div
                className="modal__close_icon"
                onClick={() => onTemplateHandler(false)}
              >
                {props.closeicon}
              </div>
            </div>
            <div className="template_option_main_container__modal">
              {props.display_logo_setting ? (
                <>
                  <div className="template_headline">Logo Setting</div>
                  <div className="template_logo_toggler">
                    <input
                      type="checkbox"
                      checked={props.displayLogo}
                      onChange={() =>
                        props.onTemplateItemChangeWithoutEvent(
                          "display_logo",
                          props.template_index,
                          !props.displayLogo
                        )
                      }
                    />
                    &emsp; Display Logo
                  </div>
                </>
              ) : null}
              <div className="template_headline mt-5">Background color</div>
              <div className="background_color">
                <SketchPicker
                  color={props.backgroundColor}
                  onChangeComplete={(e) =>
                    props.onTemplateItemChangeWithoutEvent(
                      "backgroundColor",
                      props.template_index,
                      e.hex
                    )
                  }
                />
              </div>
            </div>
            <div className="modal__button_container">
              <button onClick={() => onTemplateHandler(false)}>
                Save & Close
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default TemplateOption;
