import React, { Fragment, useState, useEffect } from "react";
import Modal from "react-responsive-modal";
import "../common/CustomModalStyle.css";
import isEmpty from "../../../store/validations/is-empty";
import AccountsTextarea from "../common/AccountsTextarea";
import Select from "react-select";
import { format } from "date-fns";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as htmlToImage from "html-to-image";

function ViewQuotation({ quotationData }) {
  const bodyRef = React.createRef();

  const [values, setValues] = useState({
    open: false,
    selectedQuotationData: [],
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
  });

  const [image, setImage] = useState({ preview: "" });

  const [nameOption, setNameOption] = useState([
    { value: "Akshay", label: "Akshay" },
    { value: "lorem", label: "lorem" },
    { value: "lorem1", label: "lorem1" },
  ]);

  const [currencyOption, setCurrencyOption] = useState([
    { value: "USD ($)", label: "USD ($)" },
    { value: "lorem", label: "lorem" },
    { value: "lorem1", label: "lorem1" },
  ]);

  useEffect(() => {
    console.log(bodyRef.current);

    if (!isEmpty(quotationData)) {
      console.log(quotationData);
      setValues({
        ...values,
        selectedQuotationData: quotationData,
      });
      setNewValues({
        terms: quotationData.additionalInfo.terms,
        additionalNotes: quotationData.additionalInfo.additionalNotes,
        shippedFrom: quotationData.additionalInfo.shippedFrom,
        city: quotationData.additionalInfo.city,
        shippingCharge: quotationData.additionalInfo.shippingCharge,
        toName: {
          value: quotationData.lead.name,
          label: quotationData.lead.name,
        },
        currency: quotationData.additionalInfo.currency,
        shippingAdd: quotationData.additionalInfo.shippingAdd,
        billingAdd: quotationData.additionalInfo.billingAdd,
        quotationNumber: quotationData.additionalInfo.quotationNumber,
      });

      setImage({ preview: quotationData.additionalInfo.fileUrl });
    }
  }, [quotationData, values.open === true]);

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
    });
  };

  const downloadHandler = async (e) => {
    e.preventDefault();
    if (!isEmpty(bodyRef.current)) {
      // html2canvas(bodyRef.current).then((canvas) => {
      //   const imgData = canvas.toDataURL("image/png");
      //   const pdf = new jsPDF("p", "px", "a3");
      //   const imgProps = pdf.getImageProperties(imgData);
      //   const pdfWidth = pdf.internal.pageSize.getWidth();
      //   const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      //   pdf.addImage(imgData, "PNG", 30, 30, "", "");
      //   pdf.save("download.pdf");
      // });

      // new working
      const input = document.getElementById("editor");
      let canvas = await html2canvas(input, { scale: 2 });
      htmlToImage
        .toPng(document.getElementById("editor"), { quality: 0.95 })
        .then(function (dataUrl) {
          var link = document.createElement("a");
          link.download = "my-image-name.jpeg";
          const pdf = new jsPDF("p", "px", "a3");
          // const width_Var = pdf.internal.pageSize.getWidth();
          // const height_Var = pdf.internal.pageSize.getHeight();
          pdf.addImage(dataUrl, "PNG", 30, 30, "", "");
          // pdf.addPage();

          var pdfasblob = pdf.output("blob");
          console.log(pdfasblob);
          pdf.save("download.pdf");
        });
    }
  };

  /*===========================================
        Render View Quatation model
  =============================================*/

  const renderViewQuotationModel = () => {
    // let organizationData = JSON.parse(localStorage.getItem("oraganiationData"));
    let data = JSON.parse(localStorage.getItem("Data"));
    const { selectedQuotationData, open } = values;
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
        <span className="closeIconInModal" onClick={onCloseModal} />
        <div ref={bodyRef} className="container-fluid pr-0 pl-0">
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
                  Issued :{" "}
                  {format(selectedQuotationData.updatedAt, "Do MMMM YY")}
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
                  {!isEmpty(selectedQuotationData) &&
                    selectedQuotationData.items.map((item, index) => (
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
                          <p>{selectedQuotationData.subTotal}</p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p>TAX</p>
                        </td>
                        <td>{selectedQuotationData.taxes}</td>
                      </tr>
                      <tr>
                        <td>
                          <p>Total</p>
                        </td>
                        <td>
                          <p>{selectedQuotationData.total}</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </form>
          <div className="quatation-from-section">
            {/* Bottom section of quotation here  */}
            {/* <button onClick={downloadHandler}>download</button> */}
          </div>
        </div>
      </Modal>
    );
  };
  return (
    <div>
      <Fragment>
        <button onClick={onOpenModal} className="quotation-view-btn">
          View Details
        </button>

        {renderViewQuotationModel()}
      </Fragment>
    </div>
  );
}

export default ViewQuotation;
