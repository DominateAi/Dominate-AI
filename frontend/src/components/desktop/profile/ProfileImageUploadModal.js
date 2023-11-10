import React from "react";
import isEmpty from "./../../../store/validations/is-empty";
import Modal from "react-responsive-modal";
import "../common/CustomModalStyle.css";
import { connect } from "react-redux";
import { userProfileUpload } from "./../../../store/actions/authAction";
import axios from "axios";
import { url } from "./../../../store/actions/config";
import { changeUserProfile } from "./../../../store/actions/authAction";
import { validateUploadProfileImage } from "../../../store/validations/profileValidation/profileImageValidation";

class ProfileImageUploadModal extends React.Component {
  state = {
    open: false,
    fileName: "",
    errorUploadProfileImage: {},
    fileInfo: [],
    newFilename: "",
    fileData: {},
  };

  /*=====================================
              Lifecycle Methods
  ======================================*/
  componentDidUpdate() {
    if (
      this.props.apiStatus &&
      this.state.success &&
      !this.state.hasClosedModal
    ) {
      this.setState({
        open: false,
        hasClosedModal: true,
        fileName: "",
      });
    }
  }

  /*=====================================
        modal handlers
    ===================================== */

  onOpenModal = () => {
    this.setState({
      open: true,
      success: false,
      hasClosedModal: false,
    });
  };

  onCloseModal = () => {
    this.setState({
      open: false,
      errorUploadProfileImage: {},
    });
  };

  /*=====================================
       custom handlers
    ===================================== */

  handleOnChange = (e) => {
    console.log(e.target.files[0]);
    const data = new FormData();
    // data.append("image", e.target.files[0].name);
    data.append("file", e.target.files[0]);
    this.setState({
      fileData: data,
    });

    this.setState({
      fileName:
        e.target.files.length > 0 ? e.target.files[0].name : e.target.value,
      fileInfo: e.target.files.length > 0 ? e.target.files[0] : e.target.value,
    });
  };

  handleOnClickDiscard = () => {
    this.setState({
      fileName: "",
      fileInfo: [],
      errorUploadProfileImage: {},
      open: false,
    });
  };

  handleOnClickSave = (e) => {
    e.preventDefault();
    console.log(this.state);
    const { errors, isValid } = validateUploadProfileImage(this.state);

    if (!isValid) {
      this.setState({ errorUploadProfileImage: errors });
    }

    if (isValid) {
      this.props.changeUserProfile(
        this.state.fileData,
        this.props.userData.id,
        this.props.userData
      );
      this.setState({
        success: true,
      });
      // this.onCloseModal();
    }
  };

  /*=====================================
        main method
    ===================================== */
  render() {
    const { open } = this.state;
    const { userData } = this.props;
    // console.log(this.props.userData);
    return (
      <>
        {/* modal link */}
        {this.props.isMobile ? (
          <img
            className="resp-top-header__profileImg mb-30"
            src={require("./../../../assets/img/mobile/profile-image.png")}
            alt="profile"
            onClick={this.onOpenModal}
          />
        ) : (
          <div className="profile-img-div">
            <img
              src={`${userData.profileImage}&token=${userData.token}`}
              alt="lead"
              className="profile-page-img mb-30"
              //onClick={this.onOpenModal}
            />
            <div className="profile-pencil-div" onClick={this.onOpenModal}>
              <i className="fa fa-pencil" />
            </div>
          </div>
        )}
        {/* modal content */}
        <Modal
          open={open}
          onClose={this.onCloseModal}
          closeOnEsc={false}
          closeOnOverlayClick={false}
          center
          classNames={{
            overlay: "customOverlay",
            modal: "customModal customModal--addLead",
            closeButton: "customCloseButton",
          }}
        >
          <div className="ac-files-modal-container">
            {/* close modal */}
            <span className="closeIconInModal" onClick={this.onCloseModal} />

            {/* content title*/}
            <h3 className="font-21-bold mb-48">Update profile image</h3>

            <form>
              {/* select file */}
              <div className="ac-input-file-block">
                <div className="font-21-regular ac-input-file-block__textInput">
                  {this.state.fileName === ""
                    ? "Select the file"
                    : this.state.fileName}
                </div>
                <input
                  type="file"
                  accept="image/jpeg, image/png"
                  title=""
                  className="font-21-regular ac-input-file-block__fileInput"
                  onChange={this.handleOnChange}
                />
                <span className="ac-input-file-block__border-onfocus"></span>
              </div>
              <div>
                <p className="font-15-regular ac-input-file-block__note">
                  &#40;Only supports jpeg and png file&#41;
                </p>
              </div>

              <div className="ac-input-file-block__errorBlock">
                {this.state.errorUploadProfileImage.fileName && (
                  <div className="is-invalid add-lead-form-field-errors ml-0">
                    {this.state.errorUploadProfileImage.fileName}
                  </div>
                )}
              </div>

              {/* buttons */}
              <div className="ac-files-buttons-container">
                <button
                  type="button"
                  className="btn-funnel-view btn-funnel-view--files"
                  onClick={this.handleOnClickDiscard}
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="btn-funnel-view btn-funnel-view--files"
                  onClick={this.handleOnClickSave}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  apiStatus: state.auth.status,
});

export default connect(mapStateToProps, { changeUserProfile })(
  ProfileImageUploadModal
);
