import React, { useState, useEffect } from "react";
import Modal from "react-responsive-modal";
import "../common/CustomModalStyle.css";
import ToggleSwitch from "./../common/ToggleSwitch";
import ItemInput from "./ItemInput";

const EditDiscountModel = ({
  setValues,
  index,
  state,
  onChangeBillingSectionHandler,
}) => {
  const [toggle, setToggle] = useState({
    isToggle: "",
  });
  const [editDiscountModel, seteditDiscountModel] = useState(false);

  useEffect(() => {
    let allBillingItem = state.billItems;
    let itemDiscount = allBillingItem[index].itemDiscount;
    console.log(itemDiscount);
    if (itemDiscount.label === "Price") {
      setToggle({
        isToggle: true,
      });
    } else {
      setToggle({
        isToggle: false,
      });
    }
    // let allBillingItem = state.billItems;
    // allBillingItem[index]["itemDiscount"] =
  }, [editDiscountModel]);

  const toggleFunction = (e) => {
    setToggle({
      [e.target.name]: e.target.checked,
    });

    // applying item discount to price
    let allBillingItem = state.billItems;
    allBillingItem[index]["itemDiscount"] = {
      value: 0,
      label: e.target.checked === false ? "Discount" : "Price",
    };
    console.log(allBillingItem);

    setValues({
      ...state,
      billItems: allBillingItem,
    });
    // console.log(index, e.target.checked);
  };

  const onCloseModal = () => {
    seteditDiscountModel(false);
  };

  const editDiscountHandler = (e) => {
    seteditDiscountModel(true);
  };
  const handleSave = (e) => {
    console.log("On click save");
    seteditDiscountModel(false);
  };

  const renderToggle = () => {
    return (
      <div className="toggle  toggle--edit-tax">
        <label
          className="resp-font-12-regular"
          htmlFor="qutation-discount-toggle"
        >
          {toggle.isToggle ? <b>Number</b> : <>Number</>}
        </label>

        <div className="toggle-chk-circle">
          <input
            type={"checkbox"}
            name="isToggle"
            // className={`${toggleinputclass}`}
            onChange={toggleFunction}
            defaultChecked={toggle.isToggle}
            id="qutation-discount-toggle"
          />
          <span className="toggle__switch toggle__switch--edit-account"></span>
        </div>
        <label
          className="resp-font-12-regular"
          htmlFor="qutation-discount-toggle"
        >
          {toggle.isToggle ? <> Percentage </> : <b>Percentage</b>}
        </label>
      </div>
    );
  };

  return (
    <div>
      <i
        className="fa fa-pencil"
        aria-hidden="true"
        onClick={editDiscountHandler}
      ></i>

      <Modal
        open={editDiscountModel}
        onClose={onCloseModal}
        closeOnEsc={true}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay",
          modal: "customModal customModal--quotation_edit_discount",
          closeButton: "customCloseButton",
        }}
      >
        <span className="closeIconInModal" onClick={onCloseModal} />
        <h5 className="set-discount-title">Set Discount</h5>
        {/*<ToggleSwitch
          name="isToggle"
          currentState={toggle.isToggle}
          type={"checkbox"}
          //spantext1={"Price"}
          //spantext2={"Discount"}
          spantext1={"Number"}
          spantext2={"Percentage"}
          toggleclass={"toggle  toggle--edit-tax"}
          toggleinputclass={"toggle__switch toggle__switch--edit-account"}
          onChange={toggleFunction}
          defaultChecked={toggle.isToggle}
        />*/}
        {renderToggle()}
        <div className="add-quotation-number-div">
          <ItemInput
            type="number"
            className={
              state.isSaveEnabled
                ? "input_disabled item-number-type normal-text"
                : "item-number-type normal-text"
            }
            value={state.billItems[index].itemDiscount.value}
            name={"itemDiscount"}
            onChange={onChangeBillingSectionHandler(index)}
            disabled={state.disabled ? "disabled" : ""}
          ></ItemInput>
        </div>
        <div className="text-right">
          <button className="save_new_lead_button" onClick={handleSave}>
            Save
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default EditDiscountModel;
