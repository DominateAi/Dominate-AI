import React from "react";
import ReactDOM from "react-dom";
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";

const oncloseModal = (c) => {
  ReactDOM.render("", document.getElementById("error_message"));
  c();
};

const oncloseModalWithoutCallback = () => {
  ReactDOM.render("", document.getElementById("error_message"));
};

export const NoTemplateSelected = (props) => {
  return (
    <Modal
      show={true}
      size="md"
      centered
      onHide={() => oncloseModalWithoutCallback()}
    >
      <ModalBody>
        <div className="modal_main_container">
          <div className="modal__close_icon_container">
            <div
              className="modal__close_icon"
              onClick={() => oncloseModalWithoutCallback()}
            >
              <i className="fa fa-times fa-lg" aria-hidden="true"></i>
            </div>
          </div>
          <div className="no_template_selected_message">
            <div>Please select a template !</div>
            <div>
              to save as <i>"Draft"</i>
            </div>
            <div>
              or to <i>"Send"</i>
            </div>
            <div>
              or to <i>"Download"</i>
            </div>
          </div>
          <div className="modal__button_container">
            <button onClick={() => oncloseModalWithoutCallback()}>
              {" "}
              Close
            </button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export const ProposalSendAndSaved = (props) => {
  return (
    <Modal
      show={true}
      //size="md"
      className="go-back-main-modal"
      centered
      onHide={() => oncloseModal(props.callback)}
    >
      <ModalBody>
        <div className="modal_main_container">
          <div className="modal__close_icon_container">
            <div
              className="modal__close_icon"
              onClick={() => oncloseModal(props.callback)}
            >
              <i className="fa fa-times fa-lg" aria-hidden="true"></i>
            </div>
          </div>
          <div className="no_template_selected_message">
            <div>Presentation has been sent successfully!</div>
          </div>
          <div className="modal__button_container">
            <button onClick={() => oncloseModal(props.callback)}> Close</button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export const ProposalSaved = (props) => {
  return (
    <Modal
      show={true}
      size="md"
      centered
      onHide={() => oncloseModal(props.callback)}
    >
      <ModalBody>
        <div className="modal_main_container">
          <div className="modal__close_icon_container">
            <div
              className="modal__close_icon"
              onClick={() => oncloseModal(props.callback)}
            >
              <i className="fa fa-times fa-lg" aria-hidden="true"></i>
            </div>
          </div>
          <div className="no_template_selected_message">
            <div>Presentation has been saved successfully!</div>
          </div>
          <div className="modal__button_container">
            <button onClick={() => oncloseModal(props.callback)}> Close</button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export const ErrorWhileSaving = (props) => {
  return (
    <Modal
      show={true}
      size="md"
      centered
      onHide={() => oncloseModalWithoutCallback()}
    >
      <ModalBody>
        <div className="modal_main_container">
          <div className="modal__close_icon_container">
            <div
              className="modal__close_icon"
              onClick={() => oncloseModalWithoutCallback()}
            >
              <i className="fa fa-times fa-lg" aria-hidden="true"></i>
            </div>
          </div>
          <div className="no_template_selected_message">
            <div>Unable to process your query!</div>
            <div>Please try after sometime.</div>
            <div>Our Engineer are working on it.</div>
          </div>
          <div className="modal__button_container">
            <button onClick={() => oncloseModalWithoutCallback()}>
              {" "}
              Close
            </button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};
