import React, { useState } from "react";
import Modal from "react-responsive-modal";
import ToggleSwitch from "../common/ToggleSwitch";
import EditProducts from "./EditProducts";
import EditServices from "./EditServices";
import isEmpty from "../../../store/validations/is-empty";

export default function EditProductAndServices({ isEdit, itemData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [values, setValues] = useState({
    isToggle: true,
  });
  const handleModalOpen = () => {
    setIsOpen(!isOpen);
  };

  const toggleFunction = (e) => {
    setValues({
      [e.target.name]: e.target.checked,
    });
    console.log(values.isToggle);
  };
  return (
    <>
      {isEdit === "edit" ? (
        <>
          <button onClick={handleModalOpen}>
            <i className="fa fa-pencil"></i>
          </button>
        </>
      ) : (
        <>
          <button onClick={handleModalOpen}>
            <i className="fa fa-eye"></i>
          </button>
        </>
      )}

      <Modal
        open={isOpen}
        onClose={handleModalOpen}
        closeOnEsc={true}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay customOverlay--warning_before_five_days",
          modal: "customModal customModal--add-products-and-services",
          closeButton: "customCloseButton",
        }}
      >
        <span className="closeIconInModal" onClick={handleModalOpen} />
        <div className="products-and-services-padding-div">
          {isEdit === "edit" ? (
            <h1 className="font-30-bold mb-61">Edit form</h1>
          ) : (
            <h1 className="font-30-bold mb-61">Display Form</h1>
          )}
          {/* <ToggleSwitch
            name="isToggle"
            currentState={values.isToggle}
            type={"checkbox"}
            spantext1={"Product"}
            spantext2={"Service"}
            toggleclass={"toggle toggle--edit-account"}
            toggleinputclass={"toggle__switch toggle__switch--edit-account"}
            onChange={toggleFunction}
            defaultChecked={true}
          /> */}
        </div>
        {/* {values.isToggle === false ? ( */}
        {!isEmpty(itemData) && itemData.type === "SERVICE" ? (
          <EditServices
            itemData={itemData}
            isEdit={isEdit}
            setIsOpen={setIsOpen}
          />
        ) : (
          <EditProducts
            itemData={itemData}
            isEdit={isEdit}
            setIsOpen={setIsOpen}
          />
        )}

        {/* ) : ( */}

        {/* )} */}
      </Modal>
    </>
  );
}
