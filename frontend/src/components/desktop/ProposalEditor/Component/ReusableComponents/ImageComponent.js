import React, { useState, Component } from "react";
import Modal from "react-bootstrap/Modal";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { normalImageUpload } from "../../../../../store/actions/authAction";
import Loader from "react-loader-spinner";

export class ImageComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedStack: "",
      src: "",
      oldImage: "",
    };
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (nextState.oldImage !== nextProps.src) {
      return {
        src: "",
      };
    }
    return null;
  }

  componentDidMount() {
    let token = JSON.parse(localStorage.getItem("Data")).token;
    this.returnImageUrl(this.props.src + `&token=${token}`);
  }

  componentDidMount() {
    window.addEventListener("click", this.checkStackSelection);
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.checkStackSelection);
  }

  getDataUri = (url) => {
    return new Promise((resolve) => {
      var image = new Image();
      image.setAttribute("crossOrigin", "anonymous"); //getting images from external domain

      image.onload = function () {
        var canvas = document.createElement("canvas");
        canvas.width = this.naturalWidth;
        canvas.height = this.naturalHeight;

        //next three lines for white background in case png has a transparent background
        // var ctx = canvas.getContext("2d");
        // ctx.fillStyle = "#fff"; /// set white fill style
        // ctx.fillRect(0, 0, canvas.width, canvas.height);

        canvas.getContext("2d").drawImage(this, 0, 0);

        resolve(canvas.toDataURL("image/png"));
      };
      image.src = url;
    });
  };

  checkStackSelection = (e) => {
    if (!this.props.noEditMode && this.state.src) {
      if (document.getElementById(this.props.stackClass).contains(e.target)) {
        this.setState({ selectedStack: this.props.stackClass });
      } else if (document.getElementById(this.props.name_cropped) !== null) {
        this.setState({ selectedStack: this.props.stackClass });
      } else {
        this.setState({ selectedStack: "" });
      }
    } else {
      this.setState({ selectedStack: "" });
    }
  };

  returnImageUrl = async (imgUrl) => {
    var logo = await this.getDataUri(imgUrl);
    if (logo) {
      this.setState({
        src: logo,
        oldImage: this.props.src,
      });
    }
  };
  render() {
    if (this.state.src === "") {
      let token = JSON.parse(localStorage.getItem("Data")).token;
      this.returnImageUrl(this.props.src + `&token=${token}`);
    }
    let token = "";
    if (localStorage.getItem("Data")) {
      if (JSON.parse(localStorage.getItem("Data")).token) {
        token = JSON.parse(localStorage.getItem("Data")).token;
      }
    }
    if (this.state.src) {
      return (
        <>
          <div
            id={this.props.stackClass}
            className={
              this.state.selectedStack === this.props.stackClass
                ? "image_component_main_container_selected"
                : "image_component_main_container"
            }
            style={{ width: this.props.image_width, position: "relative" }}
          >
            {this.state.selectedStack === this.props.stackClass ? (
              <ImageSetting {...this.props} token={token} />
            ) : null}
            <img
              src={this.state.src}
              alt="logo_images"
              style={{ height: "auto", width: "100%" }}
            />
          </div>
        </>
      );
    }
    return (
      <>
        <div
          id={this.props.stackClass}
          className={
            this.state.selectedStack === this.props.stackClass
              ? "image_component_main_container_selected"
              : "image_component_main_container"
          }
          style={{
            width: this.props.image_width,
            position: "relative",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Loader
            type="Oval"
            color="#502EFF"
            height={100}
            width={100}
            timeout={10000} //3 secs
          />
        </div>
      </>
    );
    // this.returnImageUrl(this.props.src +`&token=${token}`);
  }
}

export default ImageComponent;

export const ImageSetting = (props) => {
  const [imageSetting, imageSettingHandler] = useState(false);
  return (
    <>
      <div onClick={() => imageSettingHandler(true)} className="image_cogs">
        <i className="fa fa-cog fa-lg" aria-hidden="true"></i>
      </div>
      <div className="image-setting-div">
        <Modal
          show={imageSetting}
          //size={"sm"}
          className="prposal-image-component-modal"
          centered
          onHide={() => imageSettingHandler(false)}
        >
          <Modal.Body>
            <div id={props.name_cropped} className="modal_main_container">
              <div className="modal__close_icon_container">
                <div
                  className="modal__close_icon"
                  onClick={() => imageSettingHandler(false)}
                >
                  <i className="fa fa-times fa-lg" aria-hidden="true"></i>
                </div>
              </div>
              <div className="image_component__modal_container">
                <div className="template_headline text-center">
                  Image setting
                </div>
                <div className="row flex-nowrap mx-0 image_block_upload_crop_row">
                  <ImageCropping {...props} />
                  <div className="image_block_upload">
                    <div className="image_block_one">
                      {/*<div className="template_icon">
                      <i className="fa fa-upload fa-lg" aria-hidden="true"></i>
  </div>*/}
                      <div>
                        <label htmlFor="imge-upload">
                          <img
                            src={require("../../../../../assets/img/proposal/upload.png")}
                            alt=""
                            className="proposal-crop-img"
                          />
                        </label>
                      </div>
                    </div>
                    <div className="image_block_two">
                      <div className="template_text">Upload new images</div>
                      <div className="template_text_input">
                        <ImageUploading {...props} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal__button_container modal__button_container--img-setting">
                <button onClick={() => imageSettingHandler(false)}>
                  Save &amp; Close
                </button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

export class ImageUploading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadingImage: false,
    };
  }
  onFileUpload = async (e) => {
    this.setState({ uploadingImage: true });
    const file = e.target.files[0];
    console.log(file);
    let formData = new FormData();
    formData.append("file", file);
    console.log(file);
    let returnData = await normalImageUpload(formData);
    if (returnData.success) {
      this.setState({ uploadingImage: false });
      this.props.onTemplateItemChangeWithoutEvent(
        this.props.name_normal,
        this.props.template_index,
        returnData.imageResponse.fileUrl
      );
      this.props.onTemplateItemChangeWithoutEvent(
        this.props.name_cropped,
        this.props.template_index,
        ""
      );
      this.props.onTemplateItemChangeWithoutEvent(
        this.props.crop_name,
        this.props.template_index,
        { unit: "%" }
      );
    } else {
      console.log(returnData, "false");
      this.setState({ uploadingImage: false });
    }
  };
  render() {
    return (
      <>
        {!this.state.uploadingImage ? (
          <div className="image_uploading_main_component">
            <input
              type="file"
              id="imge-upload"
              onChange={this.onFileUpload}
              hidden
            />
          </div>
        ) : (
          <div className="text-center">
            Please wait. Image is uploading. . .
          </div>
        )}
      </>
    );
  }
}

export class ImageCropping extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openModal: false,
      src: "",
      crop: {},
    };
  }
  /*******************************
   * @DESC - LIFE CYCLE METHODS
   *******************************/
  componentDidMount() {
    this.setState({
      src: this.props.main_src + `&token=${this.props.token}`,
      crop: this.props.image_crop,
    });
  }
  static getDerivedStateFromProps(nextProps, nextState) {
    if (nextProps.src !== nextState.src) {
      return {
        src: nextProps.main_src + `&token=${nextProps.token}`,
        crop: nextProps.image_crop,
      };
    }
    return null;
  }
  /*******************************
   * @DESC - MODAL TOGGLER
   *******************************/
  modalToggler = (e) => {
    this.setState({ openModal: !this.state.openModal });
  };

  onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        this.setState({ src: reader.result })
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // If you setState the crop in here you should return false.
  onImageLoaded = (image) => {
    this.imageRef = image;
  };

  onCropComplete = (crop) => {
    this.makeClientCrop(crop);
  };

  onCropChange = (crop, percentCrop) => {
    this.props.onTemplateItemChangeWithoutEvent(
      this.props.crop_name,
      this.props.template_index,
      crop
    );
    this.setState({ crop });
  };

  async makeClientCrop(crop) {
    if (this.imageRef && crop.width && crop.height) {
      const croppedImageUrl = await this.getCroppedImg(
        this.imageRef,
        crop,
        "newFile.jpeg"
      );
      this.props.onTemplateItemChangeWithoutEvent(
        this.props.name_cropped,
        this.props.template_index,
        croppedImageUrl
      );
    }
  }

  getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          //reject(new Error('Canvas is empty'));
          console.error("Canvas is empty");
          return;
        }
        blob.name = fileName;
        let formData = new FormData();
        formData.append("file", blob);
        let returnData = await normalImageUpload(formData);
        console.log(returnData);
        window.URL.revokeObjectURL(this.fileUrl);
        this.fileUrl = returnData.imageResponse.fileUrl;
        resolve(this.fileUrl);
      }, "image/png");
    });
  }
  render() {
    const { crop, src } = this.state;
    return (
      <>
        <div
          className="image_block_upload"
          style={{ cursor: "pointer" }}
          onClick={this.modalToggler}
        >
          <div className="image_block_one">
            {/*<div className="template_icon">
              <i className="fa fa-crop fa-lg" aria-hidden="true"></i>
    </div>*/}
            <div>
              <img
                src={require("../../../../../assets/img/proposal/crop.png")}
                alt=""
                className="proposal-crop-img"
              />
            </div>
          </div>
          <div className="image_block_two">
            <div className="template_text">Crop your image</div>
          </div>
        </div>

        <Modal
          show={this.state.openModal}
          size={"sm"}
          centered
          onHide={this.modalToggler}
        >
          <Modal.Body>
            <div className="modal_main_container">
              <div className="modal__close_icon_container">
                <div className="modal__close_icon" onClick={this.modalToggler}>
                  {this.props.closeicon}
                </div>
              </div>
              <div className="crop_image_modal_container">
                <ReactCrop
                  src={src}
                  crop={crop}
                  ruleOfThirds
                  crossorigin={"anonymous"}
                  onImageLoaded={this.onImageLoaded}
                  onComplete={this.onCropComplete}
                  onChange={this.onCropChange}
                />
              </div>
              <div className="modal__button_container">
                <button onClick={this.modalToggler}>Save & Close</button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}
