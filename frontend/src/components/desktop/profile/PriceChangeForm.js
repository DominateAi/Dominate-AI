import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { url, workspaceId } from "./../../../store/actions/config";
import isEmpty from "../../../store/validations/is-empty";
import WarningPopup from "./../popups/WarningPopup";
import PrePaymentPopup from "./../popups/PrePaymentPopup";

// let userData = JSON.parse(localStorage.getItem("Data"));

function getFormattedAmount(amount) {
  // Format price details and detect zero decimal currencies
  let amountToFormat = amount;
  let numberFormat = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    currencyDisplay: "symbol",
  });
  let parts = numberFormat.formatToParts(amountToFormat);
  let zeroDecimalCurrency = true;
  for (let part of parts) {
    if (part.type === "decimal") {
      zeroDecimalCurrency = false;
    }
  }
  amountToFormat = zeroDecimalCurrency ? amount : amount / 100;
  let formattedAmount = numberFormat.format(amountToFormat);
  console.log(formattedAmount);

  return formattedAmount;
}

function getDateStringFromUnixTimestamp(date) {
  let nextPaymentAttemptDate = new Date(date * 1000);
  let day = nextPaymentAttemptDate.getDate();
  let month = nextPaymentAttemptDate.getMonth() + 1;
  let year = nextPaymentAttemptDate.getFullYear();

  return month + "/" + day + "/" + year;
}

function PriceChangeForm({
  customerId,
  subscriptionId,
  currentProductSelected,
  newProductSelected,
  setShowChangePriceForm,
  setSelectedProduct,
  priceId,
  userData,
  currentProductData,
  productSelected,
  continueHandler,
  onCloseHandler,
  downgradeWarningPopup,
  setDowngradeWarningPopup,
  prePaymentPopup,
  setPrePaymentPopup,
}) {
  let [invoicePreview, setInvoicePreview] = useState({});

  useEffect(() => {
    if (
      parseInt(productSelected.metadata.maxUsers) <
      parseInt(currentProductData.metadata.maxUsers)
    ) {
      setDowngradeWarningPopup(true);
    } else {
      setPrePaymentPopup(true);
    }
    // console.log(parseInt(productSelected.metadata.maxUsers));
    // console.log(parseInt(currentProductData.metadata.maxUsers));
  }, [productSelected]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`${url}/api/retrieve-upcoming-invoice`, {
        method: "post",
        headers: {
          "Content-type": "application/json",
          workspaceId: workspaceId,
          Authorization: `Bearer  ${userData.token}`,
        },
        body: JSON.stringify({
          customerId: customerId,
          subscriptionId: subscriptionId,
          newPriceId: "price_1Hw9WGFg4BCOwMSzjiQSSI5H",
        }),
      });
      const responseBody = await response.json();

      setInvoicePreview(responseBody);
    }
    fetchData();
  }, [customerId, subscriptionId, newProductSelected]);

  function confirmPriceChange() {
    return fetch(`${url}/api/update-subscription`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        workspaceId: workspaceId,
        Authorization: `Bearer ${userData.token}`,
      },
      body: JSON.stringify({
        subscriptionId: subscriptionId,
        priceId: priceId,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        setSelectedProduct(newProductSelected);
        setShowChangePriceForm(false);
        // props.history.push('/prices?customerId=' + customer.id);
      });
  }

  // function cancelPriceChange() {
  //   setShowChangePriceForm(false);
  // }

  return (
    <div>
      {/* {parseInt(productSelected.metadata.maxUsers) <
      parseInt(currentProductData.metadata.maxUsers) ? ( */}
      <WarningPopup
        onCloseHandler={onCloseHandler}
        downgradeWarningPopup={downgradeWarningPopup}
        currentProductData={currentProductData}
        productSelected={productSelected}
        continueHandler={continueHandler}
      />
      {/* ) : ( */}
      <PrePaymentPopup
        onCloseHandler={onCloseHandler}
        prePaymentPopup={prePaymentPopup}
        productSelected={productSelected}
        continueHandler={continueHandler}
      />
      {/* )} */}
    </div>
    // <div className="flex justify-center">
    //   {newProductSelected !== currentProductSelected ? (
    //     <div className="w-full rounded overflow-hidden border rounded-md p-4 mb-4">
    //       <div className="flex justify-between text-gray-600 text-m">
    //         <div>Current price</div>
    //         <div className="font-bold text-m">{currentProductSelected}</div>
    //       </div>

    //       <div className="flex justify-between text-gray-600 text-m">
    //         <div>New price</div>
    //         <div className="font-bold text-m">{newProductSelected}</div>
    //       </div>

    //       <div>
    //         <p className="mt-4 mb-4 text-gray-600">
    //           You will be charged {console.log(invoicePreview)}
    //           {(invoicePreview &&
    //             getFormattedAmount(invoicePreview.amount_due)) ||
    //             ""}{" "}
    //           on{" "}
    //           <span>
    //             {(invoicePreview.next_payment_attempt &&
    //               getDateStringFromUnixTimestamp(
    //                 invoicePreview.next_payment_attempt
    //               )) ||
    //               ""}
    //           </span>
    //         </p>
    //         <button
    //           onClick={() => confirmPriceChange()}
    //           className="bg-pasha hover:bg-white hover:shadow-outline hover:text-pasha hover:border hover:border-black focus:shadow-outline text-white focus:bg-white focus:text-pasha font-light py-2 px-4 rounded-lg mr-2"
    //           type="submit"
    //         >
    //           <div className="w-auto -mx-2 md:mx-0">
    //             <span>Confirm change</span>
    //           </div>
    //         </button>
    //         <button
    //           onClick={() => cancelPriceChange()}
    //           className="bg-pasha hover:bg-white hover:shadow-outline hover:text-pasha hover:border hover:border-black focus:shadow-outline text-white focus:bg-white focus:text-pasha font-light py-2 px-4 rounded-lg"
    //           type="submit"
    //         >
    //           <div className="w-auto -mx-2 md:mx-0">
    //             <span>Cancel</span>
    //           </div>
    //         </button>
    //       </div>
    //     </div>
    //   ) : null}
    // </div>
  );
}

export default withRouter(PriceChangeForm);
