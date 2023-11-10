import React, { Component } from "react";
import Modal from "react-responsive-modal";
import "../common/CustomModalStyle.css";
import OverviewDemoModalScreen0 from "./OverviewDemoModalScreen0";
import OverviewDemoModalScreen1 from "./OverviewDemoModalScreen1";
import OverviewDemoModalScreen2 from "./OverviewDemoModalScreen2";
import OverviewDemoModalScreen3 from "./OverviewDemoModalScreen3";
import OverviewDemoModalScreen4 from "./OverviewDemoModalScreen4";
import OverviewDemoModalScreen5 from "./OverviewDemoModalScreen5";
import OverviewDemoModalScreen6 from "./OverviewDemoModalScreen6";
import OverviewDemoModalScreen7 from "./OverviewDemoModalScreen7";
import OverviewDemoModalScreen8 from "./OverviewDemoModalScreen8";
import OverviewDemoModalScreen9 from "./OverviewDemoModalScreen9";
import OverviewDemoModalScreen10 from "./OverviewDemoModalScreen10";
import OverviewDemoModalScreen11 from "./OverviewDemoModalScreen11";
import OverviewDemoModalScreen12 from "./OverviewDemoModalScreen12";
import OverviewDemoModalScreen13 from "./OverviewDemoModalScreen13";
import OverviewDemoModalScreen14 from "./OverviewDemoModalScreen14";
import OverviewDemoModalScreen15 from "./OverviewDemoModalScreen15";
import OverviewDemoModalScreen16 from "./OverviewDemoModalScreen16";
import OverviewDemoModalScreen17 from "./OverviewDemoModalScreen17";

const imgPath = {
  imgPath0:
    "https://res.cloudinary.com/dd4krpktw/image/upload/v1580904950/dominate-overview-demo/screen-0_q5nd9b.png",
  imgPath1:
    "https://res.cloudinary.com/dd4krpktw/image/upload/v1580904950/dominate-overview-demo/screen-1_ksfxlp.png",
  imgPath2:
    "https://res.cloudinary.com/dd4krpktw/image/upload/v1580904951/dominate-overview-demo/screen-2_fwap4q.png",
  imgPath3:
    "https://res.cloudinary.com/dd4krpktw/image/upload/v1580904952/dominate-overview-demo/screen-3_ayi2wi.png",
  imgPath4:
    "https://res.cloudinary.com/dd4krpktw/image/upload/v1580904950/dominate-overview-demo/screen-4_eh8miz.png",
  imgPath5:
    "https://res.cloudinary.com/dd4krpktw/image/upload/v1580904951/dominate-overview-demo/screen-5_sqimxk.png",
  imgPath6:
    "https://res.cloudinary.com/dd4krpktw/image/upload/v1580904953/dominate-overview-demo/screen-6_avmeeu.png",
  imgPath7:
    "https://res.cloudinary.com/dd4krpktw/image/upload/v1580904953/dominate-overview-demo/screen-7_podswh.gif",
  imgPath8:
    "https://res.cloudinary.com/dd4krpktw/image/upload/v1580904953/dominate-overview-demo/screen-8_u71dof.png",
  imgPath9:
    "https://res.cloudinary.com/dd4krpktw/image/upload/v1580904952/dominate-overview-demo/screen-9_km6gwd.png",
  imgPath10:
    "https://res.cloudinary.com/dd4krpktw/image/upload/v1580904954/dominate-overview-demo/screen-10_vlziig.png",
  imgPath11:
    "https://res.cloudinary.com/dd4krpktw/image/upload/v1580904954/dominate-overview-demo/screen-11_eszzp5.png",
  imgPath12:
    "https://res.cloudinary.com/dd4krpktw/image/upload/v1580904954/dominate-overview-demo/screen-12_pfaw21.png",
  imgPath13:
    "https://res.cloudinary.com/dd4krpktw/image/upload/v1580904955/dominate-overview-demo/screen-13_xzn6kx.png",
  imgPath14:
    "https://res.cloudinary.com/dd4krpktw/image/upload/v1580904955/dominate-overview-demo/screen-14_j3yoa9.png",
  imgPath15:
    "https://res.cloudinary.com/dd4krpktw/image/upload/v1580904955/dominate-overview-demo/screen-15_nt2hgz.png",
  imgPath16:
    "https://res.cloudinary.com/dd4krpktw/image/upload/v1580904955/dominate-overview-demo/screen-16_zdszux.png",
  imgPath17:
    "https://res.cloudinary.com/dd4krpktw/image/upload/v1580904956/dominate-overview-demo/screen-17_isvxsr.png"
};

class OverviewDemoModal extends Component {
  state = {
    open: false,
    prevNext: 0
  };

  handlePrev = () => {
    this.setState({ prevNext: this.state.prevNext - 1 });
  };

  handleNext = () => {
    this.setState({ prevNext: this.state.prevNext + 1 });
  };

  /*=====================================
        modal handlers
    ===================================== */

  onOpenModal = () => {
    this.setState({
      open: true
    });
  };

  onCloseModal = () => {
    this.setState({
      open: false,
      prevNext: 0
    });
  };

  render() {
    const { open, prevNext } = this.state;
    return (
      <div>
        <button
          className="overview-demo-outline-button"
          onClick={this.onOpenModal}
        >
          Watch Overview Again
        </button>

        {/* modal content */}
        <Modal
          open={open}
          onClose={this.onCloseModal}
          closeOnEsc={false}
          closeOnOverlayClick={false}
          center
          classNames={{
            overlay: "customOverlay",
            modal: "customModal customModal--addLead customModal--overviewDemo",
            closeButton: "customCloseButton"
          }}
        >
          {/* close modal */}
          <span className="closeIconInModal" onClick={this.onCloseModal} />
          {prevNext === 0 && (
            <OverviewDemoModalScreen0
              imgPath={imgPath.imgPath0}
              handleNext={this.handleNext}
            />
          )}
          {prevNext === 1 && (
            <OverviewDemoModalScreen1
              imgPath={imgPath.imgPath1}
              handleNext={this.handleNext}
            />
          )}
          {prevNext === 2 && (
            <OverviewDemoModalScreen2
              imgPath={imgPath.imgPath2}
              handlePrev={this.handlePrev}
              handleNext={this.handleNext}
            />
          )}
          {prevNext === 3 && (
            <OverviewDemoModalScreen3
              imgPath={imgPath.imgPath3}
              handlePrev={this.handlePrev}
              handleNext={this.handleNext}
            />
          )}
          {prevNext === 4 && (
            <OverviewDemoModalScreen4
              imgPath={imgPath.imgPath4}
              handlePrev={this.handlePrev}
              handleNext={this.handleNext}
            />
          )}
          {prevNext === 5 && (
            <OverviewDemoModalScreen5
              imgPath={imgPath.imgPath5}
              handlePrev={this.handlePrev}
              handleNext={this.handleNext}
            />
          )}
          {prevNext === 6 && (
            <OverviewDemoModalScreen6
              imgPath={imgPath.imgPath6}
              handlePrev={this.handlePrev}
              handleNext={this.handleNext}
            />
          )}
          {prevNext === 7 && (
            <OverviewDemoModalScreen7
              imgPath={imgPath.imgPath7}
              handlePrev={this.handlePrev}
              handleNext={this.handleNext}
            />
          )}
          {prevNext === 8 && (
            <OverviewDemoModalScreen8
              imgPath={imgPath.imgPath8}
              handlePrev={this.handlePrev}
              handleNext={this.handleNext}
            />
          )}
          {prevNext === 9 && (
            <OverviewDemoModalScreen9
              imgPath={imgPath.imgPath9}
              handlePrev={this.handlePrev}
              handleNext={this.handleNext}
            />
          )}
          {prevNext === 10 && (
            <OverviewDemoModalScreen10
              imgPath={imgPath.imgPath10}
              handlePrev={this.handlePrev}
              handleNext={this.handleNext}
            />
          )}
          {prevNext === 11 && (
            <OverviewDemoModalScreen11
              imgPath={imgPath.imgPath11}
              handlePrev={this.handlePrev}
              handleNext={this.handleNext}
            />
          )}
          {prevNext === 12 && (
            <OverviewDemoModalScreen12
              imgPath={imgPath.imgPath12}
              handlePrev={this.handlePrev}
              handleNext={this.handleNext}
            />
          )}
          {prevNext === 13 && (
            <OverviewDemoModalScreen13
              imgPath={imgPath.imgPath13}
              handlePrev={this.handlePrev}
              handleNext={this.handleNext}
            />
          )}
          {prevNext === 14 && (
            <OverviewDemoModalScreen14
              imgPath={imgPath.imgPath14}
              handlePrev={this.handlePrev}
              handleNext={this.handleNext}
            />
          )}
          {prevNext === 15 && (
            <OverviewDemoModalScreen15
              imgPath={imgPath.imgPath15}
              handlePrev={this.handlePrev}
              handleNext={this.handleNext}
            />
          )}
          {prevNext === 16 && (
            <OverviewDemoModalScreen16
              imgPath={imgPath.imgPath16}
              handlePrev={this.handlePrev}
              handleNext={this.handleNext}
            />
          )}
          {prevNext === 17 && (
            <OverviewDemoModalScreen17
              imgPath={imgPath.imgPath17}
              handlePrev={this.handlePrev}
              onCloseModal={this.onCloseModal}
            />
          )}
        </Modal>
      </div>
    );
  }
}

export default OverviewDemoModal;
