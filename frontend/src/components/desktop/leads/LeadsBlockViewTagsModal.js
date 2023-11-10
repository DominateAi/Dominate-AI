import React from "react";
import Modal from "react-responsive-modal";
import "../common/CustomModalStyle.css";
import AddLeadFormSelectFewTags from "./AddLeadFormSelectFewTags";
import isEmpty from "./../../../store/validations/is-empty";
import { connect } from "react-redux";
import { updateLeadTags } from "./../../../store/actions/leadAction";
import { maxLengths } from "../../../store/validations/maxLengths/MaxLengths";

const defaultTagsValues = ["New", "Imp"];

class LeadsBlockViewTagsModal extends React.Component {
  state = {
    open: false,
    tagsArray: defaultTagsValues,
    tagsInputValue: [],
    success: false,
  };

  /*===============================
          Lifecycle Methods
  ================================*/
  componentDidMount() {
    this.setState({
      tagsArray: this.props.leadData.tags,
      tagsInputValue: this.props.leadData.tags,
    });
  }

  componentDidUpdate() {
    if (
      this.props.apiStatus &&
      this.state.success &&
      !this.state.hasmodalclose
    ) {
      this.setState({
        open: false,
        hasmodalclose: true,
      });
    }
  }

  /*===============================
       Model Event Handlers
  ================================*/

  onOpenModal = () => {
    this.setState({
      open: true,
      success: false,
      hasmodalclose: false,
    });
  };

  onCloseModal = () => {
    this.setState({
      open: false,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    // console.log(this.state);
    const updatedTags = {
      tags: this.state.tagsArray,
    };
    this.props.updateLeadTags(
      this.props.leadData._id,
      this.props.userId,
      updatedTags
    );
    this.setState({
      success: true,
    });
  };

  /*==============================
      Tags Handlers
  ================================*/

  handleSelectTagsOnChange = (e) => {
    this.setState({
      tagsInputValue: [e.target.value],
    });
  };

  handleSelectTagsOnKeyPress = (e) => {
    if (e.keyCode === 13) {
      this.setState({
        prevNextIndex: this.state.prevNextIndex - 1,
      });
      // split the str and remove the empty values
      console.log(this.state.tagsInputValue, "before trim");
      //let tagsInputValue = this.state.tagsInputValue.toString().split(",");
      let tagArray = this.state.tagsInputValue.toString().split(",");
      let tagsInputValue = tagArray.map((string) => string.trim());
      console.log(tagsInputValue, "after trim");
      let len = tagsInputValue.length;
      let i = 0;
      while (len > i) {
        while (tagsInputValue[i] === "") {
          tagsInputValue.splice(i, 1);
        }
        i++;
      }

      //array length
      let tagLength = this.state.tagsArray.length;
      console.log(tagLength);

      if (tagLength >= 5) {
        window.alert("Tags limit reached.");
      } else {
        if (tagsInputValue.length !== 0) {
          // update the states
          this.setState({
            tagsArray:
              [...this.state.tagsArray, ...tagsInputValue].length > 4
                ? [...this.state.tagsArray, ...tagsInputValue].slice(0, 4)
                : [...this.state.tagsArray, ...tagsInputValue],
            tagsInputValue: [],
          });
        }
        // console.log(this.state.tagsArray, this.state.tagsInputValue);
      }
    }
  };

  handleSelectFewTagsOnClick = (e) => {
    //array length
    let tagLength = this.state.tagsArray.length;
    console.log(tagLength);

    if (tagLength >= 5) {
      window.alert("Tags limit reached.");
    } else {
      this.setState({
        tagsArray:
          [...this.state.tagsArray, e.target.innerHTML].length > 4
            ? [...this.state.tagsArray, e.target.innerHTML].slice(0, 4)
            : [...this.state.tagsArray, e.target.innerHTML],
      });
    }
  };

  handleRemoveTag = (val) => {
    var tags = [...this.state.tagsArray];
    var i = tags.indexOf(val);
    if (i !== -1) {
      tags.splice(i, 1);
      this.setState({
        open: true,
        tagsArray: tags,
      });
    }
  };

  render() {
    // console.log(this.props.allTagsData);
    const { allTagsData, leadData } = this.props;
    const {
      open,
      // tagsArray
    } = this.state;
    return (
      // modal link
      <div className="display-inline-block w-100">
        <div className="row w-100 mx-0 justify-content-end">
          <div className="col-11 px-0 text-center">
            <div className="leads-content-block-480__tags-div">
              {!isEmpty(allTagsData) && leadData.status !== "CONVERTED"
                ? allTagsData.map((tag, index) => (
                    <button
                      key={index}
                      className="leads-content-block-480-tags-btn"
                      onClick={this.onOpenModal}
                    >
                      {tag}
                    </button>
                  ))
                : allTagsData.map((tag, index) => (
                    <button
                      key={index}
                      className="leads-content-block-480-tags-btn cursor-default"
                      // onClick={this.onOpenModal}
                    >
                      {tag}
                    </button>
                  ))}
            </div>
          </div>
        </div>

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
          <span className="closeIconInModal" onClick={this.onCloseModal} />
          <div className="add-lead-modal-container container-fluid pr-0">
            <h1 className="font-30-bold mb-61">New Lead</h1>

            <div className="add-lead-form-field-block">
              {/* form */}
              <form onSubmit={this.handleSubmit}>
                <span className="add-lead-label font-24-semibold pt-20">
                  Added tags
                </span>

                <div className="leads-tags-in-input-field leads-tags-in-input-field--addLeadFormSelectTags">
                  <div className="representative-recent-img-text-block leads-tags-in-input-field__block pt-0 mb-30">
                    {this.state.tagsArray.map((tag, index) => (
                      <h6
                        key={index}
                        className="font-18-regular tag-border-block leads-tags-in-input-field__tags"
                      >
                        {tag}
                        <span
                          className="font-18-regular"
                          onClick={() => this.handleRemoveTag(tag)}
                        >
                          &nbsp; &times;
                        </span>
                      </h6>
                    ))}
                  </div>

                  {/* select tags by input type text field */}
                  <AddLeadFormSelectFewTags
                    id="tagsInputValue"
                    name="tagsInputValue"
                    onChange={this.handleSelectTagsOnChange}
                    onClick={this.handleSelectFewTagsOnClick}
                    onKeyDown={this.handleSelectTagsOnKeyPress}
                    value={this.state.tagsInputValue}
                    maxLength={maxLengths.char20}
                  />
                </div>
                {/* buttons */}
                <div className="pt-25 text-right">
                  <button
                    type="submit"
                    className="btn-funnel-view btn-funnel-view--files m-0"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  userId: state.auth.user.id,
  apiStatus: state.auth.status,
});

export default connect(mapStateToProps, { updateLeadTags })(
  LeadsBlockViewTagsModal
);
