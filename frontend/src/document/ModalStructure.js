import React, { Component, Fragment } from "react";
import Modal from "react-responsive-modal";
import "../common/CustomModalStyle.css";

class ModalStructure extends Component {
  constructor() {
    super();
    this.state = {
      open: false,
    };
  }

  /*===============================
      Model Open Handlers
  =================================*/

  onOpenModal = () => {
    this.setState({
      open: true,
    });
  };

  onCloseModal = () => {
    this.setState({
      open: false,
    });
  };

  /*=================================
      main
  ===================================*/
  render() {
    return (
      <Fragment>
        {/* link */}
        <button
          className="leads-title-block-btn-red-bg mr-30 ml-30"
          onClick={this.onOpenModal}
        >
          &#43; Modal One
        </button>

        {/* content */}
        <Modal
          open={this.state.open}
          onClose={this.onCloseModal}
          closeOnEsc={true}
          closeOnOverlayClick={false}
          center
          classNames={{
            overlay: "customOverlay",
            modal: "customModal customModal--modalStructure",
            closeButton: "customCloseButton",
          }}
        >
          <span className="closeIconInModal" onClick={this.onCloseModal} />
          <h1 className="font-30-bold mb-61">Modal One</h1>
        </Modal>
      </Fragment>
    );
  }
}

export default ModalStructure;
