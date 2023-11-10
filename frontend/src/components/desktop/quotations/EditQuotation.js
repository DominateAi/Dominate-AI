import React, { Fragment, useState, useEffect } from "react";
import Checkbox from "rc-checkbox";
import "rc-checkbox/assets/index.css";
import Modal from "react-responsive-modal";
import "../common/CustomModalStyle.css";

import isEmpty from "./../../../store/validations/is-empty";

import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

import {
  updateQuotationById,
  getQuotationById,
  uploadQuotationLogo,
  uploadQuotationPdf,
} from "./../../../store/actions/quotationAction";

import AddQuoteFormAssignRepresentative from "./../quotations/AddQuoteFormAssignRepresentative";
import ItemInput from "./ItemInput";
import { validateAddQuotation } from "./../../../store/validations/quotationValidation/quotationValidation";
import { validateQuotationItems } from "./../../../store/validations/quotationValidation/quotationItemsValidation";
import { addQuotationAction } from "./../../../store/actions/quotationAction";

import Alert from "react-s-alert";
import { maxLengths } from "../../../store/validations/maxLengths/MaxLengths";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import EditDiscountModel from "./EditDiscountModel";
import EditTaxModel from "./EditTaxModel";
import AccountsTextarea from "../common/AccountsTextarea";
import { format } from "date-fns";
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";
import { SET_LOADER, CLEAR_LOADER } from "./../../../store/types";
import store from "../../../store/store";

const EditQuotation = ({ quotationData }) => {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    open: false,
    errors: {},
    billItems: [],
    itemErrors: [],
    quotationAllData: {},
  });

  const [newValues, setNewValues] = useState({
    terms: "",
    additionalNotes: "",
    shippedFrom: "",
    city: "",
    shippingCharge: "",
    toName: "",
    currency: "",
    shippingAdd: "",
    billingAdd: "",
    quotationNumber: "",
    toLeadsOptions: [],
    toSelectedLeadId: "",
  });

  const [image, setImage] = useState({ preview: "" });

  const [viewQuotationModel, setviewQuotationModel] = useState(false);

  const [productOptions, setProductOptions] = useState([]);

  const [currencyOption, setCurrencyOption] = useState([
    { value: "$", label: "USD ($)" },
    { value: "₹", label: "INR (₹)" },
  ]);

  const allActiveLeads = useSelector((state) => state.leads.activeLeads);

  const allProductAndServices = useSelector(
    (state) => state.productAndServices.allProductAndServices
  );

  useEffect(() => {
    if (!isEmpty(allProductAndServices)) {
      let productOption = [];
      allProductAndServices.forEach((ele) => {
        productOption.push({ value: ele.name, label: ele.name, data: ele });
      });
      setProductOptions(productOption);
    } else {
      setProductOptions([]);
    }
  }, [allProductAndServices]);

  useEffect(() => {
    if (!isEmpty(allActiveLeads)) {
      let leadOptions = [];
      allActiveLeads.forEach((ele) => {
        leadOptions.push({ value: ele._id, label: ele.name, data: ele });
      });

      setNewValues({
        ...newValues,
        toLeadsOptions: leadOptions,
      });
    }
  }, [allActiveLeads]);

  useEffect(() => {
    if (!isEmpty(quotationData)) {
      dispatch(getQuotationById(quotationData._id));
      // setValues({
      //   ...values,
      //   billItems: quotationData.items,
      // });
    }
  }, [quotationData, values.open === true]);

  const selectedQuotationData = useSelector(
    (state) => state.quotation.selectedQuotationData
  );
  useEffect(() => {
    if (!isEmpty(selectedQuotationData)) {
      setValues({
        ...values,
        billItems: selectedQuotationData.items,
        quotationAllData: selectedQuotationData,
      });
      console.log(selectedQuotationData);
      setNewValues({
        ...newValues,
        toName: {
          value: selectedQuotationData.lead._id,
          label: selectedQuotationData.lead.name,
        },
        shippingAdd: selectedQuotationData.additionalInfo.shippingAdd,
        billingAdd: selectedQuotationData.additionalInfo.billingAdd,
        toSelectedLeadId: selectedQuotationData.lead._id,
        shippedFrom: selectedQuotationData.additionalInfo.shippedFrom,
        currency: selectedQuotationData.additionalInfo.currency,
        terms: selectedQuotationData.additionalInfo.terms,
        additionalNotes: selectedQuotationData.additionalInfo.additionalNotes,
        city: selectedQuotationData.additionalInfo.city,
        quotationNumber: selectedQuotationData.additionalInfo.quotationNumber,
        shippingCharge: selectedQuotationData.additionalInfo.shippingCharge,
      });
      setImage({
        preview: selectedQuotationData.additionalInfo.fileUrl,
      });
    }
  }, [selectedQuotationData]);

  /*===============================
      Model Open Handlers
  =================================*/

  const onOpenModal = () => {
    setValues({
      ...values,
      open: true,
    });
  };

  const onCloseModal = () => {
    setValues({
      open: false,
      billItems: [],
    });
    setviewQuotationModel(false);
  };

  /*===================================
          Add Item Handler
====================================*/
  const onAddItemClickHandler = (e) => {
    e.preventDefault();
    // console.log(values.billItems);
    const { errors, isValid } = validateQuotationItems(values.billItems);
    console.log(errors);
    if (isValid) {
      let allBillingItem = values.billItems;
      allBillingItem.push({
        productItem: "",
        itemDescription: "",
        itemQuantity: "",
        itemTax: "",
        itemRate: "",
        itemAmount: "",
        itemDiscount: { value: 0, label: "Price" },
        cgst: "",
        sgst: "",
        igst: "",
        vat: "",
        selectedCountry: { value: "India", label: "India" },
        sameState: true,
      });
      setValues({
        ...values,
        billItems: allBillingItem,
      });
    } else {
      setValues({
        ...values,
        itemErrors: errors,
      });
    }
  };

  const onRemoveItemHandler = (index) => (e) => {
    let allBillingItem = values.billItems;
    if (allBillingItem.length === 1) {
      // window.alert("1 billing item is required");
      allBillingItem.splice(index, 1);
      setValues({
        ...values,
        billItems: allBillingItem,
      });
    } else {
      allBillingItem.splice(index, 1);
      setValues({
        ...values,
        billItems: allBillingItem,
      });
    }
  };

  /*====================================
      onChange handlers
=====================================*/
  const onChangeHandler = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleNewChange = (e) => {
    setNewValues({
      ...newValues,
      [e.target.name]: e.target.value,
    });
    console.log(newValues);
  };
  const handleChangeName = (toName) => {
    setNewValues({
      ...newValues,
      toName,
      toSelectedLeadId: toName.value,
      shippingAdd: toName.data.account_id.addresses.shipping_line_one,
      billingAdd: toName.data.account_id.addresses.billing_line_one,
    });
    console.log(newValues.toName, "name");
  };

  const handleChangeCurrency = (currency) => {
    setNewValues({
      ...newValues,
      currency,
    });
    console.log(newValues.currency, "name");
  };

  const callBackImageUpload = (fileData) => {
    if (fileData) {
      setNewValues({
        ...newValues,
        fileUrl: fileData.fileUrl,
      });
      setImage({
        preview: fileData.fileUrl,
      });
    }
  };

  const handleImage = (e) => {
    e.preventDefault();
    // setImage({
    //   preview: URL.createObjectURL(e.target.files[0]),
    //   //raw: e.target.files[0],
    // });
    const data = new FormData();
    // data.append("image", e.target.files[0].name);
    data.append("file", e.target.files[0]);
    //console.log(e.target.files[0]);
    console.log(image.preview);
    dispatch(uploadQuotationLogo(data, callBackImageUpload));
  };

  /*==================================
      Onchange billing section handler
  ====================================*/
  const onChangeBillingSectionHandler = (index) => (e) => {
    let allBillingItem = values.billItems;
    if (e.target.name === "itemDiscount") {
      let allBillingItem = values.billItems;
      allBillingItem[index][e.target.name] = {
        value:
          isNaN(parseInt(e.target.value)) || isEmpty(e.target.value)
            ? ""
            : parseInt(e.target.value),
        label: allBillingItem[index]["itemDiscount"].label,
      };
      setValues({
        ...values,
        billItems: allBillingItem,
        itemErrors: "",
      });
      console.log(allBillingItem);
    } else {
      let allBillingItem = values.billItems;
      allBillingItem[index][e.target.name] = e.target.value;
      setValues({
        ...values,
        billItems: allBillingItem,
        itemErrors: "",
      });
    }
    if (
      e.target.name === "itemRate" ||
      e.target.name === "itemQuantity" ||
      e.target.name === "itemDiscount"
    ) {
      let data = amountGenerater(index);
      let allBillingItem = values.billItems;
      allBillingItem[index]["itemAmount"] = data;
      setValues({
        ...values,
        billItems: allBillingItem,
        itemErrors: "",
      });
    }
    if (
      e.target.name === "itemTax" ||
      e.target.name === "itemRate" ||
      e.target.name === "itemQuantity" ||
      e.target.name === "itemDiscount"
    ) {
      let data = generateAmountWithTax(index);
      let allBillingItem = values.billItems;
      allBillingItem[index]["itemAmountWithTax"] = data;
      setValues({
        ...values,
        billItems: allBillingItem,
        itemErrors: "",
      });
    }
    if (
      e.target.name === "itemRate" ||
      e.target.name === "itemQuantity" ||
      e.target.name === "itemDiscount"
    ) {
      let descount = generateAmountWithDiscount(index);
      allBillingItem[index]["itemAmount"] = descount;
      setValues({
        ...values,
        billItems: allBillingItem,
        itemErrors: "",
      });
    }
  };

  /*=================================
        On Save Item Handler
  ==================================*/
  const onSaveItemHandler = (e) => {
    e.preventDefault();
    setValues({
      ...values,
      disabled: !values.disabled,
      isSaveEnabled: !values.isSaveEnabled,
    });
    console.log("submitted");
  };

  const handleChangeProduct = (index) => (e) => {
    console.log(e);
    let allBillingItem = values.billItems;

    allBillingItem[index]["productItem"] = e.value;
    allBillingItem[index]["productItem"] = e.value;
    allBillingItem[index]["itemRate"] = e.data.cost.toString();
    allBillingItem[index]["itemDescription"] = e.data.description;
    setValues({
      ...values,
      billItems: allBillingItem,
      itemErrors: "",
    });
  };

  const closeDraftModel = (status) => {
    console.log(status);
    if (status === 200) {
      onCloseModal();
      setValues({
        ...values,
        open: false,
      });
      setviewQuotationModel(false);
      store.dispatch({
        type: CLEAR_LOADER,
      });
    }
  };

  /*=================================
        On Send Quote Handler
  ==================================*/

  const sendQuotationHandler = async (e) => {
    e.preventDefault();

    await setviewQuotationModel(true);

    store.dispatch({
      type: SET_LOADER,
    });

    htmlToImage
      .toPng(document.getElementById("editor"))
      .then(function (dataUrl) {
        var link = document.createElement("a");
        link.download = "my-image-name.jpeg";
        const pdf = new jsPDF("p", "px", "a3", true);
        // const width_Var = pdf.internal.pageSize.getWidth();
        // const height_Var = pdf.internal.pageSize.getHeight();
        pdf.addImage(dataUrl, "PNG", 30, 30, "", "", "", "FAST");
        // pdf.addPage();

        var pdfasblob = pdf.output("blob");
        console.log(pdfasblob);
        // pdf.save("download.pdf");
        const data = new FormData();
        // data.append("image", e.target.files[0].name);
        data.append("file", pdfasblob);
        dispatch(uploadQuotationPdf(data, callBackPdfUpdload, "Sent"));
      });
  };

  /*==================================
        On Save as Draft Handler
  ====================================*/
  const callBackPdfUpdload = (data, status) => {
    const { billItems } = values;
    let subTotalAmount = 0;
    // console.log("saved");
    values.billItems.forEach((elements) => {
      // console.log(elements)
      if (elements.itemAmount && !isNaN(parseInt(elements.itemAmount))) {
        subTotalAmount = subTotalAmount + parseInt(elements.itemAmount);
      }
      // console.log(subTotalAmount);
    });

    let totalAmountWithTax = 0;
    values.billItems.forEach((elements) => {
      // console.log(elements)
      if (
        elements.itemAmountWithTax &&
        !isNaN(parseInt(elements.itemAmountWithTax))
      ) {
        totalAmountWithTax =
          totalAmountWithTax + parseInt(elements.itemAmountWithTax);
      }
      // console.log(subTotalAmount);
    });

    let totalAmountTax = totalAmountWithTax - subTotalAmount;

    let formData = values.quotationAllData;
    formData.items = values.billItems;
    formData.terms = newValues.terms;
    formData.lead = newValues.toSelectedLeadId;
    formData.subTotal = subTotalAmount;
    formData.taxes = totalAmountTax;
    formData.total = totalAmountWithTax;
    formData.name = newValues.toName.label;
    formData.additionalInfo.additionalNotes = newValues.additionalNotes;
    formData.additionalInfo.shippedFrom = newValues.shippedFrom;
    formData.additionalInfo.city = newValues.city;
    formData.additionalInfo.shippingCharge = newValues.shippingCharge;
    formData.additionalInfo.currency = newValues.currency;
    formData.additionalInfo.shippingAdd = newValues.shippingAdd;
    formData.additionalInfo.billingAdd = newValues.billingAdd;
    formData.additionalInfo.quotationNumber = newValues.quotationNumber;
    formData.additionalInfo.fileUrl = image.preview;
    formData.additionalInfo.attachment = data.fileUrl;
    if (status === "Sent") {
      formData.status = "Sent";
    }
    dispatch(
      updateQuotationById(
        formData._id,
        formData,
        "Estimate Saved",
        closeDraftModel
      )
    );
  };

  const onSaveAsDraftHandler = async (e) => {
    e.preventDefault();

    await setviewQuotationModel(true);

    store.dispatch({
      type: SET_LOADER,
    });

    htmlToImage
      .toPng(document.getElementById("editor"))
      .then(function (dataUrl) {
        var link = document.createElement("a");
        link.download = "my-image-name.jpeg";
        const pdf = new jsPDF("p", "px", "a3", true);
        // const width_Var = pdf.internal.pageSize.getWidth();
        // const height_Var = pdf.internal.pageSize.getHeight();
        pdf.addImage(dataUrl, "PNG", 30, 30, "", "", "", "FAST");
        // pdf.addPage();

        var pdfasblob = pdf.output("blob");
        console.log(pdfasblob);
        // pdf.save("download.pdf");
        const data = new FormData();
        // data.append("image", e.target.files[0].name);
        data.append("file", pdfasblob);
        dispatch(uploadQuotationPdf(data, callBackPdfUpdload, ""));
      });
  };

  /*==============================
      Form Events Handlers
  ================================*/

  const handleSubmitOnKeyDown = (e) => {
    let keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
      e.preventDefault();
      handleSubmitFunctionMain();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSubmitFunctionMain();
  };

  const handleSubmitFunctionMain = () => {
    const { errors, isValid } = validateAddQuotation(this.state);
    // const { errors, isValid } = validateQuotationItems(this.state.billItems);

    if (!isValid) {
      setValues({
        ...values,
        errors: errors,
      });
    } else {
      console.log("Data Submitted on click of SAVE button: ", this.state);

      // console.log(this.state.selectedLeadData);
      let leadData = this.state.selectedLeadData;
      // leadData.shippingAddress.city = this.state.leadsShippingCity;
      // leadData.shippingAddress.pincode = this.state.leadsShippingPinCode;
      // leadData.shippingAddress.state = this.state.leadsShippingState;
      // leadData.shippingAddress.website = this.state.leadsShippingWebsite;
      // leadData.billingAddress = this.state.leadsShippingBilling;
      // console.log(leadData);
      // this.props.updateLeadInQuotation(leadData._id, leadData);
      setValues({
        ...values,
        open: false,
        finalQuatationModel: true,
      });
    }

    // if (isEmpty(this.state.apiErrors)) {
    //   this.onCloseModal();
    // }
  };

  /*======================================
      Generater Fuctions
  ========================================*/
  const amountGenerater = (index) => {
    const { billItems } = values;
    console.log(index);
    console.log(billItems[index].itemQuantity);
    let singleItemQuantity = billItems[index].itemQuantity;
    let singleItemRate = billItems[index].itemRate;
    let singleItemDiscount = billItems[index].itemDiscount;
    // console.log(singleItemQuantity);
    // let generatedAmount = billItems[index].

    let amount = singleItemQuantity * singleItemRate;

    if (singleItemDiscount.label === "Price") {
      amount = amount - singleItemDiscount.value;
    } else {
      amount = amount - (amount / 100) * singleItemDiscount.value;
      // console.log("apply percent discount");
    }
    return amount;
  };

  const generateAmountWithTax = (index) => {
    const { billItems } = values;
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

  const generateAmountWithDiscount = (index) => {
    const { billItems } = values;
    let singleItemQuantity = billItems[index].itemQuantity;
    let singleItemRate = billItems[index].itemRate;
    let singleItemDiscount = billItems[index].itemDiscount;

    let amount = singleItemQuantity * singleItemRate;
    if (singleItemDiscount.label === "Price") {
      amount = amount - singleItemDiscount.value;
    } else {
      amount = amount - (amount / 100) * singleItemDiscount.value;
      // console.log("apply percent discount");
    }

    return amount;
  };

  /*===========================================
    Render Quotation model for Draft quotation
  =============================================*/

  const renderDraftQuotationModel = () => {
    let organizationData = JSON.parse(localStorage.getItem("oraganiationData"));
    let data = JSON.parse(localStorage.getItem("Data"));
    let totalAmount = 0;
    values.billItems.forEach((elements) => {
      if (elements.itemAmount && !isNaN(parseInt(elements.itemAmount))) {
        totalAmount = totalAmount + parseInt(elements.itemAmount);
      }
    });
    const {
      open,
      itemListCount,
      selectedLeadData,
      selectedQuotationData,
      itemErrors,
    } = values;

    return (
      <Modal
        open={open}
        onClose={onCloseModal}
        closeOnEsc={true}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay",
          modal:
            "customModal customModal--addquotation customModal--addquotation--new",
          closeButton: "customCloseButton",
        }}
      >
        <Fragment>
          <span className="closeIconInModal" onClick={onCloseModal} />
          <div className=" container-fluid pr-0 pl-0">
            <form>
              <div className="quatation-to-section">
                {/* Bottom section of quotation here  */}
                <div>
                  <div className="add-quotation-name-div">
                    <h2 className="font-24-bold">To</h2>
                    {/*<h1>Akshay</h1>*/}
                    <Select
                      className="react-select-container"
                      name="toName"
                      classNamePrefix="react-select-elements"
                      value={newValues.toName}
                      onChange={handleChangeName}
                      options={newValues.toLeadsOptions}
                      placeholder="Select name"
                      isSearchable={false}
                    />
                  </div>
                  <div className="select-currency-div">
                    <h5 className="font-20-semibold">Select Currency</h5>
                    <Select
                      className="react-select-container"
                      name="currency"
                      classNamePrefix="react-select-elements"
                      value={newValues.currency}
                      onChange={handleChangeCurrency}
                      options={currencyOption}
                      placeholder="USD ($)"
                      isSearchable={false}
                    />
                  </div>
                  <div className="row mx-0 align-items-start flex-nowrap">
                    <AccountsTextarea
                      checkboxClass="add-quotation-from-row"
                      htmlFor={"shippingAdd"}
                      labelName={"Shipping Address"}
                      id={"shippingAdd"}
                      name={"shippingAdd"}
                      onChange={handleNewChange}
                      value={newValues.shippingAdd}
                    />
                    <AccountsTextarea
                      checkboxClass="add-quotation-from-row add-quotation-from-row--2"
                      htmlFor={"billingAdd"}
                      labelName={"Billing Address"}
                      id={"billingAdd"}
                      name={"billingAdd"}
                      onChange={handleNewChange}
                      value={newValues.billingAdd}
                    />
                  </div>
                </div>
                <div>
                  <div className="add-quotation-number-div">
                    <input
                      type="text"
                      name="quotationNumber"
                      placeholder="Enter Quote Number"
                      value={newValues.quotationNumber}
                      onChange={handleNewChange}
                    />
                    {/* <div>{values.errors.quotationNumber}</div> */}
                  </div>
                  <h2 className="font-24-semibold font-24-semibold--issued">
                    {" "}
                    Issued :{" "}
                    {format(
                      !isEmpty(values.quotationAllData) &&
                        values.quotationAllData.updatedAt,
                      "Do MMMM YY"
                    )}
                  </h2>
                  <div className="add-quotation-image-upload-div">
                    <div className="add-quotation-image-upload-content">
                      {/* profile image */}
                      {image.preview ? (
                        <img
                          src={`${image.preview}&token=${data.token}`}
                          alt="quotation"
                          className="img-fluid"
                        />
                      ) : (
                        <></>
                      )}
                      <label htmlFor="fileUpload">
                        <div className="add-quotation-image-upload-btn">
                          <img
                            src={require("../../../assets/img/quotations/add-quotation-camera-icon.svg")}
                            alt="upload"
                            className="add-quotation-upload-img-camera-icon"
                          />
                        </div>
                      </label>
                      <input
                        hidden
                        id="fileUpload"
                        type="file"
                        onChange={handleImage}
                        name="imageUpload"
                        accept="image/*"
                        value={values.imageUpload}
                      />
                    </div>
                  </div>
                  <h3 className="font-24-bold mt-10">Edit Company Logo</h3>
                  {/*<div className="add-quotation-final-modal-logo">
                    <img
                      // src={`${
                      //   organizationData ? organizationData.logo : ""
                      // }&token=${data.token}`}
                      src={require("../../../assets/img/quotations/quotations-dummy-img.svg")}
                      alt="logo"
                    />
                    </div>*/}
                </div>
              </div>
              <BillingItemsSection
                state={values}
                onAddItemClickHandler={onAddItemClickHandler}
                onRemoveItemHandler={onRemoveItemHandler}
                onChangeBillingSectionHandler={onChangeBillingSectionHandler}
                onSaveItemHandler={onSaveItemHandler}
                onChangeHandler={onChangeHandler}
                handleChangeProduct={handleChangeProduct}
                itemErrors={itemErrors}
                productOptions={productOptions}
                setValues={setValues}
                handleNewChange={handleNewChange}
                newValues={newValues}
              />
              <div className="quatation-from-section">
                {/* Bottom section of quotation here  */}
                <div className="quotation-button-section">
                  <button
                    onClick={onSaveAsDraftHandler}
                    className="save-draft-btn"
                  >
                    Save
                  </button>
                  <button
                    onClick={sendQuotationHandler}
                    className="save_new_lead_button"
                  >
                    Send
                  </button>
                </div>
              </div>
            </form>
          </div>
        </Fragment>
      </Modal>
    );
  };

  /*===========================================
        Render View Quatation model
  =============================================*/

  const renderViewQuotationModel = () => {
    let subTotalAmount = 0;
    values.billItems.forEach((elements) => {
      // console.log(elements)
      if (elements.itemAmount && !isNaN(parseInt(elements.itemAmount))) {
        subTotalAmount = subTotalAmount + parseInt(elements.itemAmount);
      }
      // console.log(subTotalAmount);
    });

    let totalTaxApplied = 0;
    values.billItems.forEach((elements) => {
      // console.log(elements)
      if (elements.itemTax && !isNaN(parseInt(elements.itemTax))) {
        totalTaxApplied = totalTaxApplied + parseInt(elements.itemTax);
      }
      // console.log(subTotalAmount);
    });

    let totalAmountWithTax = 0;
    values.billItems.forEach((elements) => {
      // console.log(elements)
      if (
        elements.itemAmountWithTax &&
        !isNaN(parseInt(elements.itemAmountWithTax))
      ) {
        totalAmountWithTax =
          totalAmountWithTax + parseInt(elements.itemAmountWithTax);
      }
      // console.log(subTotalAmount);
    });

    let data = JSON.parse(localStorage.getItem("Data"));
    console.log(newValues);
    return (
      <Modal
        open={viewQuotationModel}
        onClose={onCloseModal}
        closeOnEsc={true}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay",
          modal:
            "customModal customModal--addquotation customModal--addquotation--new",
          closeButton: "customCloseButton",
        }}
      >
        <span className="closeIconInModal" onClick={onCloseModal} />
        <div className="container-fluid pr-0 pl-0">
          <form id="editor">
            <div className="quatation-to-section">
              {/* Bottom section of quotation here  */}
              <div>
                <div className="add-quotation-name-div">
                  <h2 className="font-24-bold">To</h2>
                  {/*<h1>Akshay</h1>*/}
                  <Select
                    className="react-select-container"
                    name="toName"
                    classNamePrefix="react-select-elements"
                    value={newValues.toName}
                    //onChange={handleChangeName}
                    //options={nameOption}
                    placeholder="Select name"
                    isSearchable={false}
                    isDisabled={true}
                  />
                </div>
                <div className="select-currency-div">
                  <h5 className="font-20-semibold">Select Currency</h5>
                  <Select
                    className="react-select-container"
                    name="currency"
                    classNamePrefix="react-select-elements"
                    value={newValues.currency}
                    //onChange={handleChangeCurrency}
                    //options={currencyOption}
                    placeholder="USD ($)"
                    isSearchable={false}
                    isDisabled={true}
                  />
                </div>
                <div className="row mx-0 align-items-start flex-nowrap">
                  <AccountsTextarea
                    checkboxClass="add-quotation-from-row"
                    htmlFor={"shippingAdd"}
                    labelName={"Shipping Address"}
                    id={"shippingAdd"}
                    name={"shippingAdd"}
                    //onChange={handleNewChange}
                    value={newValues.shippingAdd}
                    isDisabled={true}
                  />
                  <AccountsTextarea
                    checkboxClass="add-quotation-from-row add-quotation-from-row--2"
                    htmlFor={"billingAdd"}
                    labelName={"Billing Address"}
                    id={"billingAdd"}
                    name={"billingAdd"}
                    //onChange={handleNewChange}
                    value={newValues.billingAdd}
                    isDisabled={true}
                  />
                </div>
              </div>
              <div>
                <div className="add-quotation-number-div">
                  <input
                    type="text"
                    name="quotationNumber"
                    placeholder="Enter Quote Number"
                    value={newValues.quotationNumber}
                    //onChange={handleNewChange}
                    disabled={true}
                  />
                </div>
                <h2 className="font-24-semibold font-24-semibold--issued">
                  {" "}
                  Issued : {format(new Date(), "Do MMMM YY")}
                </h2>
                <div className="add-quotation-image-upload-div">
                  <div className="add-quotation-image-upload-content">
                    {/* profile image */}
                    {image.preview ? (
                      <img
                        src={`${image.preview}&token=${data.token}`}
                        alt="quotation"
                        className="img-fluid"
                      />
                    ) : (
                      <></>
                    )}
                    <label htmlFor="fileUpload">
                      <div className="add-quotation-image-upload-btn">
                        <img
                          src={require("../../../assets/img/quotations/add-quotation-camera-icon.svg")}
                          alt="upload"
                          className="add-quotation-upload-img-camera-icon"
                        />
                      </div>
                    </label>
                    <input
                      hidden
                      id="fileUpload"
                      type="file"
                      //onChange={handleImage}
                      name="imageUpload"
                      accept="image/*"
                      value={values.imageUpload}
                      disabled={true}
                    />
                  </div>
                </div>
                {/*<div className="add-quotation-final-modal-logo">
                    <img
                      // src={`${organizationData.logo}&token=${data.token}`}
                      src={require("../../../assets/img/quotations/quotations-dummy-img.svg")}
                      alt="logo"
                    />
                      </div>*/}
              </div>
            </div>
            <div className="add-item-section">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Product/Item</th>
                    <th scope="col">Qty.</th>
                    <th scope="col">Rate({newValues.currency.value})</th>
                    <th scope="col">Amount({newValues.currency.value})</th>
                    <th scope="col">Discount </th>
                    <th scope="col">Tax(%)</th>
                    <th scope="col">
                      Amount + tax({newValues.currency.value})
                    </th>
                    <th scope="col">X</th>
                  </tr>
                </thead>
                <tbody>
                  {!isEmpty(values) &&
                    values.billItems.map((item, index) => (
                      <tr className="single_item_tr" key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>
                          {item.productItem}{" "}
                          <textarea
                            className="text-area-disabled"
                            // onChange={props.onChangeBillingSectionHandler(
                            //   index
                            // )}
                            id="itemDescription"
                            placeholder="Description"
                            name="itemDescription"
                            rows="4"
                            cols="50"
                            value={item.itemDescription}
                            disabled
                          ></textarea>
                        </td>
                        <td>{item.itemQuantity}</td>
                        <td>{item.itemRate}</td>
                        <td>{item.itemAmount}</td>
                        <td>{item.itemDiscount.value}</td>
                        <td>{!isEmpty(item.itemTax) ? item.itemTax : 0}</td>
                        <td>{item.itemAmountWithTax}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <div className="row mx-0 align-items-start">
                <div className="col-8 p-0">
                  <div className="quotation-textarea-div">
                    <label htmlFor="terms">Terms &amp; Conditions</label>
                    <textarea
                      id="terms"
                      //onChange={props.handleNewChange}
                      name="terms"
                      value={newValues.terms}
                      disabled={true}
                    />
                  </div>
                  <div className="quotation-textarea-div">
                    <label htmlFor={"additionalNotes"}>Additional Notes</label>
                    <textarea
                      id="additionalNotes"
                      //onChange={props.handleNewChange}
                      name="additionalNotes"
                      value={newValues.additionalNotes}
                      disabled={true}
                    />
                  </div>
                  <div className="row flex-nowrap mx-0 align-items-start">
                    <div className="quotation-new-input-div">
                      <label htmlFor="shippedFrom">Shipped from</label>
                      <input
                        id={"shippedFrom"}
                        type="text"
                        //onChange={props.handleNewChange}
                        name="shippedFrom"
                        value={newValues.shippedFrom}
                        disabled={true}
                      />
                    </div>
                    <div className="quotation-new-input-div">
                      <label htmlFor="city">City</label>
                      <input
                        id="city"
                        type="text"
                        //onChange={props.handleNewChange}
                        name="city"
                        value={newValues.city}
                        disabled={true}
                      />
                    </div>
                    <div className="quotation-new-input-div quotation-new-input-div--shipping-charges">
                      <label htmlFor="shippingCharge">Shipping Charges</label>
                      <input
                        id="shippingCharge"
                        type="number"
                        //onChange={props.handleNewChange}
                        name="shippingCharge"
                        value={parseInt(newValues.shippingCharge)}
                        disabled={true}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-4 p-0">
                  <table className="quotation_total_subtotal_section">
                    <tbody>
                      <tr>
                        <td>
                          <p>SubTotal</p>
                        </td>
                        <td>
                          <p>{subTotalAmount}</p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p>TAX</p>
                        </td>
                        <td>
                          {!isEmpty(totalAmountWithTax) ? totalTaxApplied : 0}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p>Total</p>
                        </td>
                        <td>
                          <p>{totalAmountWithTax}</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </form>
        </div>
      </Modal>
    );
  };

  return (
    <div>
      {" "}
      <Fragment>
        <button
          onClick={onOpenModal}
          // className="quotation-view-btn quotation-view-btn--edit mr-0"
          className="quotation-send-btn"
        >
          {/* Edit */}
          <img
            src={"/img/desktop-dark-ui/icons/pencil-with-underscore.svg"}
            alt="quotation edit"
            className="quotation-edit-img"
          />
        </button>

        {renderDraftQuotationModel()}
        {renderViewQuotationModel()}
      </Fragment>
    </div>
  );
};

export default EditQuotation;

// /*===============================
//     Billing item model items
// ================================*/

export const BillingItemsSection = (props) => {
  // console.log(props.itemErrors);

  let subTotalAmount = 0;
  props.state.billItems.forEach((elements) => {
    // console.log(elements)
    if (elements.itemAmount && !isNaN(parseInt(elements.itemAmount))) {
      subTotalAmount = subTotalAmount + parseInt(elements.itemAmount);
    }
    // console.log(subTotalAmount);
  });

  let totalTaxApplied = 0;
  props.state.billItems.forEach((elements) => {
    // console.log(elements)
    if (elements.itemTax && !isNaN(parseInt(elements.itemTax))) {
      totalTaxApplied = totalTaxApplied + parseInt(elements.itemTax);
    }
    // console.log(subTotalAmount);
  });

  let totalAmountWithTax = 0;
  props.state.billItems.forEach((elements) => {
    // console.log(elements)
    if (
      elements.itemAmountWithTax &&
      !isNaN(parseInt(elements.itemAmountWithTax))
    ) {
      totalAmountWithTax =
        totalAmountWithTax + parseInt(elements.itemAmountWithTax);
    }
    // console.log(subTotalAmount);
  });

  let totalAmountTax = totalAmountWithTax - subTotalAmount;

  // console.log(props.state.billItems);

  return (
    <Fragment>
      <div className="add-item-section">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Product/Item</th>
              <th scope="col">Qty.</th>
              <th scope="col">Rate({props.newValues.currency.value})</th>
              <th scope="col">Amount({props.newValues.currency.value})</th>
              <th scope="col">Discount </th>
              <th scope="col">Tax(%)</th>
              <th scope="col">
                Amount + tax({props.newValues.currency.value})
              </th>
              <th scope="col">X</th>
            </tr>
          </thead>
          <tbody>
            {props.state.billItems.map((list, index) => (
              <tr className="single_item_tr" key={index}>
                <th scope="row">{index + 1}</th>
                <td>
                  {props.state.disabled ? (
                    <p style={{ marginBottom: "0px" }}>{list.productItem}</p>
                  ) : (
                    <>
                      <Select
                        className="react-select-container mb-20"
                        name="productItem"
                        classNamePrefix="react-select-elements"
                        value={{
                          value: list.productItem,
                          label: list.productItem,
                        }}
                        onChange={props.handleChangeProduct(index)}
                        options={props.productOptions}
                        placeholder="Select item"
                        isSearchable={false}
                      />
                      {!isEmpty(props.itemErrors) ? (
                        <div className="is-invalid">
                          {props.itemErrors[index].productItem}
                        </div>
                      ) : (
                        ""
                      )}
                    </>
                  )}

                  <textarea
                    onChange={props.onChangeBillingSectionHandler(index)}
                    id="itemDescription"
                    placeholder="Description"
                    name="itemDescription"
                    rows="4"
                    cols="50"
                    value={list.itemDescription}
                    disabled={props.state.disabled ? "disabled" : ""}
                  ></textarea>
                  {!isEmpty(props.itemErrors) ? (
                    <div className="is-invalid text-area-validation">
                      {props.itemErrors[index].itemDescription}
                    </div>
                  ) : (
                    ""
                  )}
                </td>
                <td>
                  <ItemInput
                    type="number"
                    className={
                      props.state.isSaveEnabled
                        ? "input_disabled item-number-type normal-text"
                        : "item-number-type normal-text"
                    }
                    value={list.itemQuantity}
                    name={"itemQuantity"}
                    onChange={props.onChangeBillingSectionHandler(index)}
                    disabled={props.state.disabled ? "disabled" : ""}
                  ></ItemInput>
                  {!isEmpty(props.itemErrors) ? (
                    <div className="is-invalid">
                      {props.itemErrors[index].itemQuantity}
                    </div>
                  ) : (
                    ""
                  )}
                </td>
                <td>
                  <ItemInput
                    type="number"
                    className={
                      props.state.isSaveEnabled
                        ? "input_disabled item-number-type normal-text"
                        : "item-number-type normal-text"
                    }
                    value={list.itemRate}
                    name={"itemRate"}
                    onChange={props.onChangeBillingSectionHandler(index)}
                    disabled={props.state.disabled ? "disabled" : ""}
                  ></ItemInput>
                  {!isEmpty(props.itemErrors) ? (
                    <div className="is-invalid">
                      {props.itemErrors[index].itemRate}
                    </div>
                  ) : (
                    ""
                  )}
                </td>

                <td>
                  {/* <ItemInput
                    type="number"
                    className={
                      props.state.isSaveEnabled
                        ? "input_disabled item-number-type amount-font"
                        : "item-number-type amount-font"
                    }
                    value={props.amountGenerater(index)}
                    name={"itemAmount"}
                    onChange={props.onChangeBillingSectionHandler(index)}
                    disabled={props.state.disabled ? "disabled" : ""}
                  ></ItemInput> */}
                  {list.itemAmount}
                </td>
                <td>
                  <EditDiscountModel
                    setValues={props.setValues}
                    state={props.state}
                    index={index}
                    onChangeBillingSectionHandler={
                      props.onChangeBillingSectionHandler
                    }
                  />
                  <ItemInput
                    type="number"
                    className={
                      props.state.isSaveEnabled
                        ? "input_disabled item-number-type normal-text"
                        : "item-number-type normal-text"
                    }
                    value={list.itemDiscount.value}
                    name={"itemDiscount"}
                    onChange={props.onChangeBillingSectionHandler(index)}
                    disabled={props.state.disabled ? "disabled" : ""}
                  ></ItemInput>
                </td>
                <td>
                  <EditTaxModel
                    setValues={props.setValues}
                    state={props.state}
                    index={index}
                    onChangeBillingSectionHandler={
                      props.onChangeBillingSectionHandler
                    }
                  />
                  <ItemInput
                    type="number"
                    className={
                      props.state.isSaveEnabled
                        ? "input_disabled item-number-type normal-text"
                        : "item-number-type normal-text"
                    }
                    value={list.itemTax}
                    name={"itemTax"}
                    onChange={props.onChangeBillingSectionHandler(index)}
                    disabled={props.state.disabled ? "disabled" : ""}
                  ></ItemInput>
                </td>
                <td>{list.itemAmountWithTax}</td>
                <td>
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={props.onRemoveItemHandler(index)}
                  >
                    <img
                      src="/img/desktop-dark-ui/icons/lead-delete.svg"
                      alt="remove row"
                      className="add-quotation-delete-row-icon"
                    />
                    {/*<i className="fa fa-trash" aria-hidden="true"></i>*/}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="button-section">
          {props.state.isSaveEnabled ? null : (
            <button
              className="add-item add-item--add-row"
              onClick={props.onAddItemClickHandler}
            >
              {/*Add Item*/}+ Add Row
            </button>
          )}

          <button
            className="save-edit-button"
            onClick={props.onSaveItemHandler}
          >
            {props.state.isSaveEnabled ? "Edit" : "Save"} Bill
          </button>
        </div>
        <div className="row mx-0 align-items-start">
          <div className="col-8 p-0">
            <div className="quotation-textarea-div">
              <label htmlFor="terms">Terms &amp; Conditions</label>
              <textarea
                id="terms"
                onChange={props.handleNewChange}
                name="terms"
                value={props.newValues.terms}
              />
            </div>
            <div className="quotation-textarea-div">
              <label htmlFor="additionalNotes">Additional Notes</label>
              <textarea
                id="additionalNotes"
                onChange={props.handleNewChange}
                name="additionalNotes"
                value={props.newValues.additionalNotes}
              />
            </div>
            <div className="row flex-nowrap mx-0 align-items-start">
              <div className="quotation-new-input-div">
                <label htmlFor="shippedFrom">Shipped from</label>
                <input
                  id="shippedFrom"
                  type="text"
                  onChange={props.handleNewChange}
                  name="shippedFrom"
                  value={props.newValues.shippedFrom}
                />
              </div>
              <div className="quotation-new-input-div">
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  type="text"
                  onChange={props.handleNewChange}
                  name="city"
                  value={props.newValues.city}
                />
              </div>
              <div className="quotation-new-input-div quotation-new-input-div--shipping-charges">
                <label htmlFor="shippingCharge">Shipping Charges</label>
                <input
                  id="shippingCharge"
                  type="number"
                  onChange={props.handleNewChange}
                  name="shippingCharge"
                  value={parseInt(props.newValues.shippingCharge)}
                />
              </div>
            </div>
          </div>
          <div className="col-4 p-0">
            <table className="quotation_total_subtotal_section">
              <tbody>
                <tr>
                  <td>
                    <p>SubTotal</p>
                  </td>
                  <td>
                    <p>{subTotalAmount}</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p>TAX</p>
                  </td>
                  <td>{!isEmpty(totalAmountWithTax) ? totalTaxApplied : 0}</td>
                </tr>
                <tr>
                  <td>
                    <p>Total</p>
                  </td>
                  <td>
                    <p>{totalAmountWithTax}</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
