import React, { useState, useEffect } from "react";
import Modal from "react-responsive-modal";
import "../common/CustomModalStyle.css";
import ToggleSwitch from "./../common/ToggleSwitch";
import ItemInput from "./ItemInput";
import Select from "react-select";
import isEmpty from "../../../store/validations/is-empty";

const EditTaxModel = ({
  setValues,
  state,
  index,
  onChangeBillingSectionHandler,
}) => {
  const [countryOptions, setcountryOptions] = useState([
    { value: "India", label: "India" },
    { value: "United States", label: "United States" },
    { value: "Australia", label: "Australia" },
  ]);

  const [toggle, setToggle] = useState({
    isToggle: true,
  });
  const [editTaxModel, seteditTaxModel] = useState(false);

  useEffect(() => {
    let allBillingItem = state.billItems;
    console.log(allBillingItem);
    let country = allBillingItem[index].selectedCountry;
    // console.log(country, index);
  }, [editTaxModel]);

  // handlers

  const toggleFunction = (e) => {
    console.log(e.target.checked, index);
    let allBillingItem = state.billItems;
    allBillingItem[index].sameState = e.target.checked;
    setValues({
      ...state,
      billItems: allBillingItem,
    });

    if (e.target.checked === false) {
      let allBillingItem = state.billItems;
      allBillingItem[index].sgst = "";
      setValues({
        ...state,
        billItems: allBillingItem,
      });
    } else {
      let allBillingItem = state.billItems;
      allBillingItem[index].igst = "";
      setValues({
        ...state,
        billItems: allBillingItem,
      });
    }
  };

  const onCloseModal = () => {
    seteditTaxModel(false);
  };

  const editTaxHandler = (e) => {
    seteditTaxModel(true);
  };

  const handleChangeCountry = (e) => {
    let allBillingItem = state.billItems;
    allBillingItem[index].selectedCountry = e;
    setValues({
      ...state,
      billItems: allBillingItem,
    });
    if (e.value === "India") {
      let allBillingItem = state.billItems;
      allBillingItem[index].vat = "";
      setValues({
        ...state,
        billItems: allBillingItem,
      });
    } else {
      let allBillingItem = state.billItems;
      allBillingItem[index].cgst = "";
      allBillingItem[index].sgst = "";
      allBillingItem[index].igst = "";
      console.log(allBillingItem);
      setValues({
        ...state,
        billItems: allBillingItem,
      });
    }
  };

  const onchangeHandler = (e) => {
    e.preventDefault();
    console.log(e.target.name);
    let allBillingItem = state.billItems;
    allBillingItem[index][e.target.name] = e.target.value;

    setValues({
      ...state,
      billItems: allBillingItem,
    });
  };
  const handleSave = (e) => {
    console.log("On click save");
    let allBillingItem = state.billItems;
    let selectedCountry = allBillingItem[index].selectedCountry;
    let sameState = allBillingItem[index].sameState;
    let cgst = allBillingItem[index].cgst;
    let sgst = allBillingItem[index].sgst;
    let igst = allBillingItem[index].igst;
    let vat = allBillingItem[index].vat;
    if (selectedCountry.value === "India") {
      let itemTax = "";
      if (sameState === true) {
        itemTax =
          parseInt(cgst === "" ? 0 : cgst) + parseInt(sgst === "" ? 0 : sgst);
      } else {
        itemTax =
          parseInt(cgst === "" ? 0 : cgst) + parseInt(igst === "" ? 0 : igst);
      }
      allBillingItem[index].itemTax = itemTax.toString();
      setValues({
        ...state,
        billItems: allBillingItem,
      });
    } else {
      allBillingItem[index].itemTax = vat;
      setValues({
        ...state,
        billItems: allBillingItem,
      });
    }
    const amountWithTax = generateAmountWithTax(index);
    allBillingItem[index]["itemAmountWithTax"] = amountWithTax;
    setValues({
      ...state,
      billItems: allBillingItem,
    });
    seteditTaxModel(false);
  };

  const generateAmountWithTax = (index) => {
    const { billItems } = state;
    let singleItemQuantity = billItems[index].itemQuantity;
    let singleItemRate = billItems[index].itemRate;
    let singleItemDiscount = billItems[index].itemDiscount;
    let singleAmountWithoutTax = singleItemQuantity * singleItemRate;
    let singleTax = billItems[index].itemTax;
    let totalamt =
      singleAmountWithoutTax + (singleTax * singleAmountWithoutTax) / 100;

    if (singleItemDiscount.label === "Price") {
      totalamt = totalamt - singleItemDiscount.value;
    } else {
      totalamt = totalamt - (totalamt / 100) * singleItemDiscount.value;
      // console.log("apply percent discount");
    }

    return totalamt;
  };
  return (
    <div>
      <i
        className="fa fa-pencil"
        aria-hidden="true"
        onClick={editTaxHandler}
      ></i>

      <Modal
        open={editTaxModel}
        onClose={onCloseModal}
        closeOnEsc={true}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay",
          modal: "customModal customModal--quotation_edit_tax",
          closeButton: "customCloseButton",
        }}
      >
        <span className="closeIconInModal" onClick={onCloseModal} />
        <div className="quotation_edit_tax_container">
          <p className="quotation_edit_tax_container-title">Enter Tax</p>

          <div className="select_country_section">
            <Select
              className="react-select-container mb-20"
              name="productItem"
              classNamePrefix="react-select-elements"
              value={state.billItems[index].selectedCountry}
              onChange={handleChangeCountry}
              options={countryOptions}
              placeholder="Select country"
              isSearchable={false}
            />
          </div>
          {state.billItems[index].selectedCountry.value === "India" && (
            <div className="description_section">
              <p className="description_section_text">
                Is Sender and Receiver’s state same?
              </p>
              <ToggleSwitch
                name="isToggle"
                currentState={state.billItems[index].sameState}
                type={"checkbox"}
                spantext1={"Yes"}
                spantext2={"No"}
                toggleclass={"toggle toggle--edit-tax"}
                toggleinputclass={"toggle__switch toggle__switch--edit-account"}
                onChange={toggleFunction}
                defaultChecked={state.billItems[index].sameState}
              />
            </div>
          )}

          <div className="tax_section">
            <p className="quotation_edit_tax_container-title">
              TAXs applicable as per country
            </p>

            {state.billItems[index].selectedCountry.value === "India" && (
              <div className="row mx-0">
                {/* CGST */}

                <div className="col-10 col-md-6 pl-0 add-quotation-number-div add-quotation-number-div--tax">
                  <label htmlFor="state">CGST</label>
                  <input
                    type="number"
                    name="cgst"
                    onChange={onchangeHandler}
                    value={state.billItems[index].cgst}
                  />
                </div>

                {/* SGST */}
                {state.billItems[index].sameState === true && (
                  <div className="col-10 col-md-6 pl-0 add-quotation-number-div add-quotation-number-div--tax">
                    <label htmlFor="city">SGST</label>
                    <input
                      type="number"
                      name="sgst"
                      onChange={onchangeHandler}
                      value={state.billItems[index].sgst}
                    />
                  </div>
                )}
                {state.billItems[index].sameState === false && (
                  <div className="col-10 col-md-6 pl-0 add-quotation-number-div add-quotation-number-div--tax">
                    <label htmlFor="state">IGST</label>
                    <input
                      type="number"
                      name="igst"
                      onChange={onchangeHandler}
                      value={state.billItems[index].igst}
                    />
                  </div>
                )}
              </div>
            )}

            <div className="row mx-0">
              {/* VAT */}
              {state.billItems[index].selectedCountry.value !== "India" && (
                <div className="col-10 col-md-6 pl-0 add-quotation-number-div add-quotation-number-div--tax">
                  <label htmlFor="city">VAT</label>
                  <ItemInput
                    type="number"
                    className={
                      state.isSaveEnabled
                        ? "input_disabled item-number-type normal-text"
                        : "item-number-type normal-text"
                    }
                    value={state.billItems[index].vat}
                    name={"vat"}
                    onChange={onchangeHandler}
                    disabled={state.disabled ? "disabled" : ""}
                  ></ItemInput>
                </div>
              )}
            </div>
            <h5 className="edit-tax-italic-font">taxes will be added</h5>
            <div className="text-right">
              <button className="save_new_lead_button" onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EditTaxModel;
