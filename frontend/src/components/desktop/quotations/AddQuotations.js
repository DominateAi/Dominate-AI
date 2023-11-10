import React, { Fragment, useState, useEffect } from "react";
import Checkbox from "rc-checkbox";
import "rc-checkbox/assets/index.css";
import Modal from "react-responsive-modal";
import "../common/CustomModalStyle.css";
import isEmpty from "./../../../store/validations/is-empty";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
// import {
//   getAllActiveLeads,
//   updateLeadInQuotation,
// } from "./../../../store/actions/leadAction";
import { updateQuotationById } from "./../../../store/actions/quotationAction";
import AddQuoteFormAssignRepresentative from "./../quotations/AddQuoteFormAssignRepresentative";
import ItemInput from "./ItemInput";
import { validateAddQuotation } from "./../../../store/validations/quotationValidation/quotationValidation";
import { validateQuotationItems } from "./../../../store/validations/quotationValidation/quotationItemsValidation";
import {
  addQuotationAction,
  uploadQuotationLogo,
  uploadQuotationPdf,
} from "./../../../store/actions/quotationAction";
import AddLeadBlueProgressbar from "../leads/AddLeadBlueProgressbar";
import AddLeadsFormField from "../leads/AddLeadsFormField";
import Alert from "react-s-alert";
import { maxLengths } from "../../../store/validations/maxLengths/MaxLengths";
import { useSelector, useDispatch } from "react-redux";
import Select from "react-select";
import EditDiscountModel from "./EditDiscountModel";
import EditTaxModel from "./EditTaxModel";
import AccountsTextarea from "../common/AccountsTextarea";
import { format } from "date-fns";
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";
import { SET_LOADER, CLEAR_LOADER } from "./../../../store/types";
import store from "../../../store/store";
//Dropdown icon
import DropdownIcon from "rc-dropdown";
import "rc-dropdown/assets/index.css";
import Menu, { Item as MenuItem, Divider } from "rc-menu";
import QuotationAddItemButton from "./QuotationAddItemButton";

const totalFormSlides = 1;

function AddQuotations() {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    open: false,
    prevNextIndex: 0,
    leadsName: "",
    selectedLeadId: "",
    selectedLeadData: {},
    leadAssignRepresentative: "",
    errors: {},
    apiErrors: {},
    finalQuatationModel: false,
    allLeads: {},
    billItems: [
      {
        productItem: "",
        itemDescription: "",
        itemQuantity: "",
        itemTax: "",
        itemRate: "",
        itemAmount: "",
        itemDiscount: { value: 0, label: "Price" },
        itemAmountWithTax: "",
        cgst: "",
        sgst: "",
        igst: "",
        vat: "",
        selectedCountry: { value: "India", label: "India" },
        sameState: true,
      },
    ],
    finalQuotationTax: "",
    allLeads: [],
    quotationLeadsOptions: [],
  });
  const [newValues, setNewValues] = useState({
    terms: "",
    additionalNotes: "",
    shippedFrom: "",
    city: "",
    shippingCharge: "",
    toName: "",
    currency: { value: "$", label: "USD ($)" },
    shippingAdd: "",
    billingAdd: "",
    quotationNumber: "",
    toLeadsOptions: [],
    toSelectedLeadId: "",
    fileUrl: "",
  });

  const [image, setImage] = useState({ preview: "" });

  const [viewQuotationModel, setviewQuotationModel] = useState(false);

  const [productOptions, setProductOptions] = useState([]);

  const [currencyOption, setCurrencyOption] = useState([
    { value: "$", label: "USD ($)" },
    { value: "₹", label: "INR (₹)" },
    // { value: "lorem1", label: "lorem1" },
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
      setValues({
        ...values,
        allLeads: allActiveLeads,
        leadAssignRepresentativeId: allActiveLeads[0]._id,
        leadAssignRepresentative: allActiveLeads[0].name,
        activeLead: allActiveLeads[0]._id,
        selectedLeadData: allActiveLeads[0],
        selectedLeadId: allActiveLeads[0]._id,
        billItems: [
          {
            productItem: "",
            itemDescription: "",
            itemQuantity: "",
            itemTax: "",
            itemRate: "",
            itemAmount: "",
            itemDiscount: { value: 0, label: "Price" },
            itemAmountWithTax: "",
            cgst: "",
            sgst: "",
            igst: "",
            vat: "",
            selectedCountry: { value: "India", label: "India" },
            sameState: true,
          },
        ],
      });
    }
  }, [allActiveLeads, values.open]);

  useEffect(() => {
    console.log("final quotation model is true");
  }, [values.finalQuatationModel === true]);

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
      ...values,
      open: false,
      finalQuatationModel: false,
      prevNextIndex: 0,
      leadsName: "",
      selectedLeadId: "",
      selectedLeadData: {},
      leadAssignRepresentative: "",
      activeLead: "",
      billItems: [
        {
          productItem: "",
          itemDescription: "",
          itemQuantity: "",
          itemTax: "",
          itemRate: "",
          itemAmount: "",
          itemDiscount: { value: 0, label: "Price" },
          itemAmountWithTax: "",
          cgst: "",
          sgst: "",
          igst: "",
          vat: "",
          selectedCountry: { value: "India", label: "India" },
          sameState: true,
        },
      ],
      errors: {},
      apiErrors: {},
    });
    setviewQuotationModel(false);
  };

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
      // errors: {},
      apiErrors: {},
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
    // console.log(toName);
    setNewValues({
      ...newValues,
      toName,
      toSelectedLeadId: toName.value,
      shippingAdd: toName.data.account_id.addresses.shipping_line_one,
      billingAdd: toName.data.account_id.addresses.billing_line_one,
    });
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
  /*================================
    Assign lead quotation handlers
  ==================================*/
  const handleRepresentativeOnClick = (lead) => (e) => {
    // console.log(employee);
    e.stopPropagation();
    e.preventDefault();
    setValues({
      ...values,
      leadAssignRepresentative: lead.name,
      selectedLeadId: lead._id,
      activeLead: lead._id,
      selectedLeadData: lead,
      apiErrors: {},
    });
  };

  /*===================================
          Add Item Handler
====================================*/
  const onAddItemClickHandler = (e) => {
    e.preventDefault();
    console.log(values.billItems);
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
  };

  const handleChangeProduct = (index) => (e) => {
    console.log(e);
    let allBillingItem = values.billItems;

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
    if (status === 200) {
      setValues({
        ...values,
        open: false,
        prevNextIndex: 0,
        errors: {},
        apiErrors: {},
        finalQuatationModel: false,
        billItems: [
          {
            productItem: "",
            itemDescription: "",
            itemQuantity: "",
            itemTax: "",
            itemRate: "",
            itemAmount: "",
            itemDiscount: { value: 0, label: "Price" },
            itemAmountWithTax: "",
            cgst: "",
            sgst: "",
            igst: "",
            vat: "",
            selectedCountry: { value: "India", label: "India" },
            sameState: true,
          },
        ],
        finalQuotationTax: "",
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

  const callBackPdfUpdload = (data, status) => {
    const { billItems } = values;

    let subTotalAmount = 0;
    if (
      !isEmpty(billItems[0].itemDescription) &&
      !isEmpty(billItems[0].itemQuantity) &&
      !isEmpty(billItems[0].itemRate)
    ) {
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

      if (data) {
        const newQuotaion = {
          status: status,
          lead: newValues.toSelectedLeadId,
          items: values.billItems,
          subTotal: subTotalAmount,
          taxes: totalAmountTax,
          total: totalAmountWithTax,
          name: newValues.toName.label,
          additionalInfo: {
            terms: newValues.terms,
            additionalNotes: newValues.additionalNotes,
            shippedFrom: newValues.shippedFrom,
            city: newValues.city,
            shippingCharge: newValues.shippingCharge,
            currency: newValues.currency,
            shippingAdd: newValues.shippingAdd,
            billingAdd: newValues.billingAdd,
            quotationNumber: `Q-${newValues.quotationNumber}`,
            fileUrl: newValues.fileUrl,
            attachment: data.fileUrl,
          },
        };

        dispatch(
          addQuotationAction(newQuotaion, "Estimate Sent", closeDraftModel)
        );
      }
    }
  };

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
        dispatch(uploadQuotationPdf(data, callBackPdfUpdload, "Draft"));
      });
  };

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
    const { errors, isValid } = validateAddQuotation(values);

    if (!isValid) {
      setValues({
        ...values,
        errors: errors,
      });
    } else {
      // console.log("Data Submitted on click of SAVE button: ", values);

      let leadData = values.selectedLeadData;
      // console.log(leadData);
      setNewValues({
        ...newValues,
        toName: { value: leadData._id, label: leadData.name },
        toSelectedLeadId: leadData._id,
        shippingAdd: leadData.account_id.addresses.shipping_line_one,
        billingAdd: leadData.account_id.addresses.billing_line_one,
      });
      setValues({
        ...values,
        open: false,
        finalQuatationModel: true,
      });
    }
  };

  const handleMainDivKeyDown = (e) => {
    e.stopPropagation();
    let keyCode = e.keyCode || e.which;
    // Shift + ArrowLeft
    if (e.ctrlKey && keyCode === 37) {
      handlePrev();
    }
    // Shift + ArrowRight
    if (e.ctrlKey && keyCode === 39) {
      handleNext();
    }
  };

  const handlePrev = () => {
    setValues({
      ...values,

      apiErrors: {},

      prevNextIndex:
        values.prevNextIndex > 0
          ? values.prevNextIndex - 1
          : values.prevNextIndex,
    });
  };

  // handle next on key enter
  const onFormKeyDown = (e) => {
    e.stopPropagation();
    let keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
      e.preventDefault();
      handleNext();
    }
  };

  const handleNext = () => {
    const { errors } = validateAddQuotation(values);

    if (values.prevNextIndex === 0) {
      if (errors.leadsName) {
        setValues({
          ...values,
          errors,
          prevNextIndex: values.prevNextIndex,
        });
      } else {
        setValues({
          ...values,
          prevNextIndex: values.prevNextIndex + 1,
          errors: {},
        });
      }
    } else if (values.prevNextIndex === 1) {
      if (errors.leadAssignRepresentative) {
        setValues({
          ...values,
          errors,
          prevNextIndex: values.prevNextIndex,
        });
      } else {
        setValues({
          ...values,
          prevNextIndex: values.prevNextIndex + 1,
          errors: {},
        });
      }
    } else if (values.prevNextIndex === 2) {
      if (
        errors.leadsShippingState ||
        errors.leadsShippingCity ||
        errors.leadsShippingPinCode ||
        errors.leadsShippingBilling
      ) {
        setValues({
          ...values,
          errors,
          prevNextIndex: values.prevNextIndex,
        });
      } else {
        setValues({
          ...values,
          prevNextIndex:
            values.prevNextIndex < totalFormSlides
              ? values.prevNextIndex + 1
              : values.prevNextIndex,
          errors: {},
        });
      }
    } else {
      setValues({
        ...values,
        prevNextIndex:
          values.prevNextIndex < totalFormSlides
            ? values.prevNextIndex + 1
            : values.prevNextIndex,
        errors: {},
      });
    }
  };

  /*============================
    Render Add Quataion Model
  =============================*/

  const renderAddQuatationForm = () => {
    const { open, prevNextIndex, allLeads, leadAssignRepresentative } = values;
    let { errors } = values;

    return (
      <Modal
        open={open}
        onClose={onCloseModal}
        closeOnEsc={true}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay",
          modal: "customModal customModal--addLead",
          closeButton: "customCloseButton",
        }}
      >
        <span className="closeIconInModal" onClick={onCloseModal} />
        <div className="add-lead-modal-container container-fluid pr-0">
          <h1 className="font-30-bold mb-61">New Estimate</h1>
          <div className="add-lead-form-field-block">
            {/* prev next arrows */}
            <div className="add-lead-arrows">
              {prevNextIndex <= 0 ? (
                ""
              ) : (
                <>
                  {/*<img
                  src={require("../../../assets/img/icons/Dominate-Icon_prev-arrow.svg")}
                  alt="previous"
                  className="add-lead-prev-icon"
                  onClick={this.handlePrev}
                />*/}
                  <div className="add-lead-prev-icon" onClick={handlePrev}>
                    <img
                      src={require("../../../assets/img/icons/dominate-white-prev-arrow.png")}
                      alt="previous"
                    />
                  </div>
                </>
              )}

              {prevNextIndex >= totalFormSlides ? (
                ""
              ) : (
                <>
                  {/*<img
                  src={require("../../../assets/img/icons/Dominate-Icon_next-arrow.svg")}
                  alt="previous"
                  className="add-lead-next-icon"
                  onClick={this.handleNext}
                />*/}
                  <div className="add-lead-next-icon" onClick={handleNext}>
                    <img
                      src={require("../../../assets/img/icons/dominate-white-next-arrow-icon.png")}
                      alt="next"
                    />
                  </div>
                </>
              )}
            </div>
            {/* form */}
            <form
              noValidate
              // onSubmit={this.handleSubmit}
              onKeyDown={onFormKeyDown}
            >
              {/* name */}
              {prevNextIndex === 0 ? (
                <AddLeadsFormField
                  htmlFor={"leadsName"}
                  type={"text"}
                  labelName={"Enter title"}
                  id={"leadsName"}
                  name={"leadsName"}
                  placeholder={"Eg. Third phase"}
                  onChange={handleChange}
                  value={values.leadsName}
                  maxLength={maxLengths.char30}
                  error={errors.leadsName}
                />
              ) : (
                ""
              )}

              {prevNextIndex === 1 && (
                <AddQuoteFormAssignRepresentative
                  id="leadAssignRepresentative"
                  name="leadAssignRepresentative"
                  fieldHeading={"Select a Lead"}
                  onChange={handleChange}
                  onClick={handleRepresentativeOnClick}
                  value={leadAssignRepresentative}
                  error={errors.leadAssignRepresentative}
                  allLeads={allLeads ? allLeads : null}
                  activeLead={values.activeLead}
                />
              )}

              {prevNextIndex === totalFormSlides && (
                <>
                  {/* buttons */}
                  <div className="pt-25 text-right">
                    {/* <button
                        className="btn-funnel-view btn-funnel-view--add-lead-save-btn mr-30"
                        onClick={this.handleSaveAboutLead}
                      >
                        Skip
                      </button> */}
                    <button
                      // type="submit"
                      onClick={handleSubmit}
                      onKeyDown={handleSubmitOnKeyDown}
                      className="save_new_lead_button save_new_lead_button--add-quotation-save-btn"
                    >
                      Next
                      {/* <img
                        src={require("../../../assets/img/icons/quotation-right-arrow.svg")}
                        alt=""
                      /> */}
                      {/*Save*/}
                    </button>
                  </div>
                </>
              )}
            </form>
            <div className="opacity-0">
              <AddLeadBlueProgressbar
                percentage={(100 / totalFormSlides) * (prevNextIndex + 0.5)}
                skipButtonFrom={totalFormSlides}
                prevNextIndex={prevNextIndex}
              />
            </div>
          </div>
        </div>
      </Modal>
    );
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

  /*======================================
      Render Final Quotation model
  =======================================*/

  const renderFinalQuatationModel = () => {
    // console.log(this.state.itemErrors);
    const { itemErrors } = values;

    let subTotalAmount = 0;
    values.billItems.forEach((elements) => {
      if (elements.itemAmount && !isNaN(parseInt(elements.itemAmount))) {
        subTotalAmount = subTotalAmount + parseInt(elements.itemAmount);
      }
    });

    let organizationData = JSON.parse(localStorage.getItem("oraganiationData"));
    let data = JSON.parse(localStorage.getItem("Data"));
    const { finalQuatationModel, itemListCount, selectedLeadData } = values;
    return (
      <Modal
        open={finalQuatationModel}
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
        <div className=" container-fluid pr-0 pl-0">
          <form>
            <div className="quatation-to-section">
              {/* Top section of quotation here  */}
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
                    //placeholder="Enter Quote Number"
                    placeholder="Enter Estimate Number"
                    value={newValues.quotationNumber}
                    onChange={handleNewChange}
                  />
                  {/* <div>{values.errors.quotationNumber}</div> */}
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
                      onChange={handleImage}
                      name="imageUpload"
                      accept="image/*"
                      value={values.imageUpload}
                    />
                  </div>
                </div>
                <h3 className="font-24-bold mt-10">Add Company Logo</h3>

                {/*<div className="add-quotation-final-modal-logo">
                  <img
                    // src={`${organizationData.logo}&token=${data.token}`}
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
                  Save as Draft
                </button>
                <button
                  onClick={sendQuotationHandler}
                  className="save_new_lead_button"
                >
                  {/*Send*/}
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
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
                    <th scope="col">Discount </th>
                    <th scope="col">Amount({newValues.currency.value})</th>
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
                        <td>{item.itemDiscount.value}</td>
                        <td>{item.itemAmount}</td>
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
                        value={newValues.shippingCharge}
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
    <Fragment>
      <button
        className="leads-title-block-btn-red-bg mr-30 ml-30"
        onClick={onOpenModal}
      >
        {/* Quotations */}
        &#43; New Estimates
      </button>

      {renderFinalQuatationModel()}
      {renderAddQuatationForm()}
      {renderViewQuotationModel()}
    </Fragment>
  );
}

export default AddQuotations;

/*===============================
    Billing item model items
================================*/

export const BillingItemsSection = (props) => {
  console.log(props.itemErrors);

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

  let productItemLength = props.productOptions.length;

  return (
    <Fragment>
      <div className="add-item-section">
        <h4 className="quoted-items-text"> Quoted Items</h4>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Product/Item</th>
              <th scope="col">Qty.</th>
              <th scope="col">Rate({props.newValues.currency.value})</th>
              <th scope="col">Discount</th>
              <th scope="col">Amount({props.newValues.currency.value})</th>
              <th scope="col">Tax(%)</th>
              <th scope="col">
                Amount + tax({props.newValues.currency.value} )
              </th>
              <th scope="col">X</th>
            </tr>
          </thead>
          <tbody>
            {props.state.billItems.map((list, index) => (
              <tr key={index} className="single_item_tr" key={index}>
                <th scope="row">{index + 1}</th>
                <td>
                  {props.state.disabled ? (
                    <p style={{ marginBottom: "0px" }}>{list.productItem}</p>
                  ) : (
                    <div>
                      {productItemLength > 0 ? (
                        <>
                          <div>
                            <Select
                              className="react-select-container react-select-container--quotation-product-item mb-20"
                              name="productItem"
                              classNamePrefix="react-select-elements"
                              value={{
                                value: list.productItem,
                                label: list.productItem,
                              }}
                              onChange={props.handleChangeProduct(index)}
                              options={props.productOptions}
                              placeholder="Select item"
                              isSearchable={true}
                            />
                            {!isEmpty(props.itemErrors) ? (
                              <div className="is-invalid">
                                {props.itemErrors[index].productItem}
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          <QuotationAddItemButton />
                        </>
                      )}
                    </div>
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
                    disabled={"disabled"}
                  ></ItemInput>
                </td>

                <td>{list.itemAmount}</td>

                <td>
                  <EditTaxModel
                    setValues={props.setValues}
                    state={props.state}
                    index={index}
                    onChangeBillingSectionHandler={
                      props.onChangeBillingSectionHandler
                    }
                    generateAmountWithTax={props.generateAmountWithTax}
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
                    disabled={"disabled"}
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
              + Add Row
            </button>
          )}

          <button
            className="save-edit-button"
            onClick={props.onSaveItemHandler}
          >
            {props.state.isSaveEnabled ? "Edit" : "Save"} Items
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
                value={props.terms}
              />
            </div>
            <div className="quotation-textarea-div">
              <label htmlFor="additionalNotes">Additional Notes</label>
              <textarea
                id="additionalNotes"
                onChange={props.handleNewChange}
                name="additionalNotes"
                value={props.additionalNotes}
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
                  value={props.shippedFrom}
                />
              </div>
              <div className="quotation-new-input-div">
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  type="text"
                  onChange={props.handleNewChange}
                  name="city"
                  value={props.city}
                />
              </div>
              <div className="quotation-new-input-div quotation-new-input-div--shipping-charges">
                <label htmlFor="shippingCharge">Shipping Charges</label>
                <input
                  id="shippingCharge"
                  type="number"
                  onChange={props.handleNewChange}
                  name="shippingCharge"
                  // placeholder="Ex. 40"
                  value={props.shippingCharge}
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
