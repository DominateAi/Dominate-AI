import React, { useState, useEffect } from "react";
import Modal from "react-responsive-modal";
import isEmpty from "../../../store/validations/is-empty";
import "../common/CustomModalStyle.css";
import AddEmployeesFormFields from "../employees/AddEmployeesFormFields";
import { updatePipelineById } from "./../../../store/actions/dealsPipelineAction";
import { useDispatch } from "react-redux";

export default function EditPipeline({ cardData }) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const [values, setValues] = useState({
    pipelinesName: "",
  });

  useEffect(() => {
    if (!isEmpty(cardData)) {
      setValues({ pipelinesName: cardData.name });
    }
  }, [cardData]);
  /*=====================================
           handler
  ======================================*/
  const handleOpen = () => {
    setOpen(true);
  };

  const handleChange = (e) => {
    setValues({
      [e.target.name]: e.target.value,
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const callBackUpdate = () => {
    setOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(values);
    // setOpen(!open);
    let formData = cardData;
    formData.name = values.pipelinesName;
    dispatch(updatePipelineById(formData._id, formData, callBackUpdate));
  };

  return (
    <>
      <button className="deal-pipeline-rc-option" onClick={handleOpen}>
        Edit
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        closeOnEsc={true}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay",
          modal: "customModal customModal--addLead",
          closeButton: "customCloseButton",
        }}
      >
        <span className="closeIconInModal" onClick={handleClose} />
        <div className="add-lead-modal-container container-fluid pr-0">
          <h1 className="font-30-bold mb-61">Edit Pipeline</h1>

          <div className="add-lead-form-field-block">
            <form noValidate onSubmit={handleSubmit}>
              {/* name */}
              <AddEmployeesFormFields
                type="text"
                htmlFor={"pipelinesName"}
                labelName={"What is the deal pipeline's name?"}
                id={"pipelinesName"}
                name={"pipelinesName"}
                placeholder={"Eg. name"}
                onChange={handleChange}
                value={values.pipelinesName}
              />
              <div className="pt-25 text-right">
                <button
                  // type="submit"
                  onClick={handleSubmit}
                  //onKeyDown={this.handleSubmitOnKeyDown}
                  className="new-save-btn-blue"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </>
  );
}
