import React, { useState } from "react";
import Modal from "react-responsive-modal";
import ToggleSwitch from "../common/ToggleSwitch";
import AddProducts from "./AddProducts";
import AddServices from "./AddServices";

export default function AddProductAndServices({
  isAll,
  title,
  isProduct,
  fromQuotation,
  fromQuotationClass,
}) {
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
    // console.log(values.isToggle);
  };

  return (
    <div>
      {fromQuotation ? (
        <div className={fromQuotationClass} onClick={handleModalOpen}>
          <span>{title}</span>
        </div>
      ) : (
        <button
          className="leads-title-block-btn-red-bg"
          onClick={handleModalOpen}
        >
          {title}
        </button>
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
          <h1 className="font-30-bold mb-61">Create a new</h1>
        </div>
        {isAll ? (
          <>
            <div className="products-and-services-padding-div">
              <ToggleSwitch
                name="isToggle"
                currentState={values.isToggle}
                type={"checkbox"}
                spantext1={"Product"}
                spantext2={"Service"}
                toggleclass={"toggle toggle--edit-account"}
                toggleinputclass={"toggle__switch toggle__switch--edit-account"}
                onChange={toggleFunction}
                defaultChecked={true}
              />
            </div>
            {values.isToggle === false ? (
              <AddServices setIsOpen={setIsOpen} />
            ) : (
              <AddProducts setIsOpen={setIsOpen} />
            )}
          </>
        ) : isProduct ? (
          <>
            <AddProducts setIsOpen={setIsOpen} />
          </>
        ) : (
          <AddServices setIsOpen={setIsOpen} />
        )}
      </Modal>
    </div>
  );
}
