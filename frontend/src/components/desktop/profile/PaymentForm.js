import React, { useState, useEffect } from "react";
// import "./App.css";
import { loadStripe } from "@stripe/stripe-js";
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Redirect, useHistory } from "react-router-dom";
import { url, workspaceId } from "./../../../store/actions/config";
import isEmpty from "../../../store/validations/is-empty";
import { stripeApiKey } from "./../../../store/actions/config";
import { useSelector } from "react-redux";
import getSymbolFromCurrency from "currency-symbol-map";
import { updateReferralOfUser } from "./../../../store/actions/referralAction";

// NEW PAYMENT FLOW
import { useDispatch } from "react-redux";
// import { createCustomerSourceUsingSourceId } from "./../../../store/actions/paymentAction";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(stripeApiKey);
// if (!process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY) {
//   console.error('**Stripe publishable key environment variable not set**');
//   console.error(
//     '**Add an environemnt variable REACT_APP_STRIPE_PUBLISHABLE_KEY**'
//   );
//   console.error('**Replace .env.example with .env and **');
// }

var userData = JSON.parse(localStorage.getItem("Data"));

const CheckoutForm = ({ productSelected, customerId, productPriceId }) => {
  if (process.env.NODE_ENV === "development") {
    productPriceId = "price_1JSELVFHfcG4tGd9KCnkNV26";
  }

  //  NEW PAYMENT FLOW
  const dispatch = useDispatch();

  const stripe = useStripe();
  const elements = useElements();
  const [subscribing, setSubscribing] = useState(false);
  const [accountInformation, setAccountInformation] = useState(null);
  const [errorToDisplay, setErrorToDisplay] = useState("");
  const history = useHistory();
  const [customerStripeObject, setcustomerStripeObject] = useState({});

  const customerObject = useSelector(
    (state) => state.payment.customerStripeObject
  );

  const referralDataOfLogedInUser = useSelector(
    (state) => state.referral.referralDataOfLogedInUser
  );

  useEffect(() => {
    if (!isEmpty(customerObject)) {
      setcustomerStripeObject(customerObject);
    }
  }, [customerObject]);

  function handlePaymentThatRequiresCustomerAction({
    subscription,
    invoice,
    priceId,
    paymentMethodId,
    isRetry,
  }) {
    // console.log("subscription object", subscription);
    // console.log("invoice", invoice);
    // console.log("priceid", priceId);
    // console.log("paymentmethodid", paymentMethodId);
    // console.log("isretry", isRetry);
    if (subscription && subscription.status === "active") {
      // subscription is active, no customer actions required.
      return { subscription, priceId, paymentMethodId };
    }

    // If it's a first payment attempt, the payment intent is on the subscription latest invoice.
    // If it's a retry, the payment intent will be on the invoice itself.
    const paymentIntent = invoice
      ? invoice.payment_intent
      : subscription.latest_invoice.payment_intent;

    if (
      paymentIntent.status === "requires_action" ||
      (isRetry === true && paymentIntent.status === "requires_payment_method")
    ) {
      return stripe
        .confirmCardPayment(paymentIntent.client_secret, {
          payment_method: paymentMethodId,
        })
        .then((result) => {
          console.log(result);
          if (result.error) {
            setErrorToDisplay(result.error.message);
            // start code flow to handle updating the payment details
            // Display error message in your UI.
            // The card was declined (i.e. insufficient funds, card has expired, etc)
            throw result;
          } else {
            if (result.paymentIntent.status === "succeeded") {
              // There's a risk of the customer closing the window before callback
              // execution. To handle this case, set up a webhook endpoint and
              // listen to invoice.payment_succeeded. This webhook endpoint
              // returns an Invoice.
              return {
                priceId: priceId,
                subscription: subscription,
                invoice: invoice,
                paymentMethodId: paymentMethodId,
              };
            }
          }
        });
    } else {
      // No customer action needed
      return { subscription, priceId, paymentMethodId };
    }
  }

  function handleRequiresPaymentMethod({
    subscription,
    paymentMethodId,
    priceId,
  }) {
    // console.log(subscription);
    if (subscription.status === "active") {
      // subscription is active, no customer actions required.
      return { subscription, priceId, paymentMethodId };
    } else if (
      subscription.latest_invoice.payment_intent.status ===
      "requires_payment_method"
    ) {
      // Using localStorage to store the state of the retry here
      // (feel free to replace with what you prefer)
      // Store the latest invoice ID and status
      localStorage.setItem("latestInvoiceId", subscription.latest_invoice.id);
      localStorage.setItem(
        "latestInvoicePaymentIntentStatus",
        subscription.latest_invoice.payment_intent.status
      );
      throw new Error("Your card was declined.");
    } else {
      return { subscription, priceId, paymentMethodId };
    }
  }

  function retryInvoiceWithNewPaymentMethod({ paymentMethodId, invoiceId }) {
    const priceId = productSelected.name.toUpperCase();
    return (
      fetch("/retry-invoice", {
        method: "post",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          customerId: customerId,
          paymentMethodId: paymentMethodId,
          invoiceId: invoiceId,
        }),
      })
        .then((response) => {
          return response.json();
        })
        // If the card is declined, display an error to the user.
        .then((result) => {
          if (result.error) {
            // The card had an error when trying to attach it to a customer.
            throw result;
          }
          return result;
        })
        // Normalize the result to contain the object returned by Stripe.
        // Add the addional details we need.
        .then((result) => {
          return {
            // Use the Stripe 'object' property on the
            // returned result to understand what object is returned.
            invoice: result,
            paymentMethodId: paymentMethodId,
            priceId: priceId,
            isRetry: true,
          };
        })
        // Some payment methods require a customer to be on session
        // to complete the payment process. Check the status of the
        // payment intent to handle these actions.
        .then(handlePaymentThatRequiresCustomerAction)
        // No more actions required. Provision your service for the user.
        .then(onSubscriptionComplete)
        .catch((error) => {
          console.log(error);
          // An error has happened. Display the failure to the user here.
          setSubscribing(false);
          setErrorToDisplay(error && error.error && error.error.decline_code);
        })
    );
  }

  function onSubscriptionComplete(result) {
    // console.log(result);
    // Payment was successful. Provision access to your service.
    // Remove invoice from localstorage because payment is now complete.
    // clearCache();

    if (result && !result.subscription) {
      const subscription = { id: result.invoice.subscription };
      result.subscription = subscription;
      localStorage.clear();
    }

    setAccountInformation(result);
    history.push("/payment-success");
    // Change your UI to show a success message to your customer.
    // onSubscriptionSampleDemoComplete(result);
    // Call your backend to grant access to your service based on
    // the product your customer subscribed to.
    // Get the product by using result.subscription.price.product
  }

  function updateReferral() {
    console.log(referralDataOfLogedInUser);
    if (!isEmpty(referralDataOfLogedInUser)) {
      let formData = referralDataOfLogedInUser[0];
      formData.status = "PAID";
      formData.paidOn = new Date();
      formData.planPurchased = "Premium";
      dispatch(updateReferralOfUser(formData));
    }
  }

  function createSubscription({ paymentMethodId }) {
    // console.log(customerStripeObject);

    var userData = JSON.parse(localStorage.getItem("Data"));
    let organizationData = JSON.parse(localStorage.getItem("oraganiationData"));
    // const priceId = productSelected.name.toUpperCase();

    let apiForCreateOrRenew = "";
    let apiFormData = {};
    // if (organizationData.planStatus === "CANCELLED") {
    //   apiForCreateOrRenew = "api/renew-subscription";
    //   apiFormData = {
    //     paymentMethodId: paymentMethodId,
    //     customerId: customerId,
    //     priceId: productPriceId,
    //     address: {
    //       line1: customerStripeObject.address.line1,
    //       city: customerStripeObject.address.city,
    //       country: customerStripeObject.address.country,
    //     },
    //   };
    // } else {
    apiForCreateOrRenew = "api/create-subscription";
    apiFormData = {
      // customerId: customerId,
      // paymentMethodId: paymentMethodId,
      // priceId: productPriceId,
      customer: customerId,
      address: {
        line1: customerStripeObject.address.line1,
        city: customerStripeObject.address.city,
        country: customerStripeObject.address.country,
      },
      items: [{ price: productPriceId, quantity: 2 }],
      paymentMethodId: paymentMethodId,
      subscriptionId: organizationData.subscriptionId,
    };
    // }

    return (
      fetch(`${url}/${apiForCreateOrRenew}`, {
        method: "post",
        headers: {
          "Content-type": "application/json",
          workspaceId: workspaceId,
          Authorization: `Bearer ${!isEmpty(userData) && userData.token}`,
        },
        body: JSON.stringify(apiFormData),
      })
        .then((response) => {
          // if (response.status === 200) {
          //   history.push("/payment-success");
          // }
          return response.json();
        })
        // If the card is declined, display an error to the user.
        .then((result) => {
          if (result.error) {
            // The card had an error when trying to attach it to a customer
            throw result;
          }
          return result;
        })
        // Normalize the result to contain the object returned
        // by Stripe. Add the addional details we need.
        .then((result) => {
          return {
            // Use the Stripe 'object' property on the
            // returned result to understand what object is returned.
            subscription: result.updatedSubs
              ? result.updatedSubs
              : result.subscription,
            paymentMethodId: paymentMethodId,
            priceId: productPriceId,
          };
        })
        // Some payment methods require a customer to do additional
        // authentication with their financial institution.
        // Eg: 2FA for cards.
        .then(handlePaymentThatRequiresCustomerAction)
        // If attaching this card to a Customer object succeeds,
        // but attempts to charge the customer fail. You will
        // get a requires_payment_method error.
        .then(handleRequiresPaymentMethod)
        // No more actions required. Provision your service for the user.
        .then(onSubscriptionComplete)
        .then(updateReferral)
        .catch((error) => {
          // An error has happened. Display the failure to the user here.
          // We utilize the HTML element we created.
          console.log(error);
          if (error.statusCode === 500) {
            setSubscribing(false);
            if (!isEmpty(error.code) && error.code === "card_declined") {
              setErrorToDisplay(
                "Your card is declined please add another card details"
              );
            } else if (!isEmpty(error.code) && error.code === "expired_card") {
              setErrorToDisplay(
                "Your card is expired please add another card details"
              );
            } else if (!isEmpty(error.code) && error.code === "incorrect_cvc") {
              setErrorToDisplay("Incorrect cvc entered please add correct cvc");
            } else if (
              !isEmpty(error.code) &&
              error.code === "processing_error"
            ) {
              setErrorToDisplay(
                "Processing error please try again after some time"
              );
            }
          } else {
            setSubscribing(false);
            // setErrorToDisplay(error.message || error.error.decline_code);
          }
          // setSubscribing(false);
          // setErrorToDisplay(error.message || error.error.decline_code);
        })
    );
  }

  const handleSubmit = async (event) => {
    // Block native form submission.
    event.preventDefault();

    setSubscribing(true);

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const cardElement = elements.getElement(CardElement);

    // If a previous payment was attempted, get the lastest invoice
    const latestInvoicePaymentIntentStatus = localStorage.getItem(
      "latestInvoicePaymentIntentStatus"
    );

    // Use your card Element with other Stripe.js APIs
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    /*===============================
        // NEW PAYMENT FLOW step 1
    =================================*/
    // stripe.createSource(cardElement).then(function (result) {
    //   var userData = JSON.parse(localStorage.getItem("Data"));
    //   if (result.error) {
    //     // Inform the user if there was an error
    //     // var errorElement = document.getElementById('card-errors');
    //     // errorElement.textContent = result.error.message;
    //     console.log(result.error);
    //   } else {
    //     // Send the source to your server
    //     // stripeSourceHandler(result.source);
    //     if (result.source) {
    //       console.log("call api");
    //       const formData = {
    //         email: userData.email,
    //         source: result.source.id,
    //       };
    //       dispatch(createCustomerSourceUsingSourceId(formData));
    //     }
    //   }
    // });

    if (error) {
      console.log("[createPaymentMethod error]", error);
      setSubscribing(false);
      setErrorToDisplay(error && error.message);
      return;
    }
    // console.log("[PaymentMethod]", paymentMethod);
    const paymentMethodId = paymentMethod.id;
    if (latestInvoicePaymentIntentStatus === "requires_payment_method") {
      // Update the payment method and retry invoice payment
      const invoiceId = localStorage.getItem("latestInvoiceId");
      retryInvoiceWithNewPaymentMethod({
        paymentMethodId: paymentMethodId,
        invoiceId: invoiceId,
      });
      return;
    }

    // Create the subscription
    createSubscription({
      paymentMethodId: paymentMethodId,
    });
  };

  if (accountInformation) {
    return (
      <Redirect
        to={{
          pathname: "/payment-success",
          state: { accountInformation: accountInformation },
        }}
      />
    );
  } else {
    let organizationData = JSON.parse(localStorage.getItem("oraganiationData"));
    // NEW PAYMENT FLOW
    // organizationData.currency = "inr";
    return (
      <div id="payment-form" className="card-detail-popup flex justify-center">
        <div className="w-full p-4 rounded-md">
          <div className="font-bold text-xl mb-2">
            <h3>Enter your card details.</h3> <br />
            <p>Your subscription will start now.</p>
          </div>
          <p className="text-gray-700 text-base">
            <h4>
              → Total due now{" "}
              <span>
                {" "}
                {organizationData.currency === "inr"
                  ? "Rs."
                  : getSymbolFromCurrency(
                      organizationData.currency.toUpperCase()
                    )}{" "}
                {/* {productSelected.priceData.unit_amount / 100} */}
                {20 / 100}
              </span>
            </h4>
          </p>
          <p className="text-gray-700 text-base mb-4">
            <h4>
              → Subscribing to{" "}
              {/* <span className="font-bold">{productSelected.name}</span> */}
              <span className="font-bold">{"Rover"}</span>
            </h4>
          </p>

          <div className="w-full">
            <div className="flex flex-wrap -mx-3 mb-2">
              <div className="w-full px-3 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Full name
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 rounded-md py-3 px-2 mb-3 leading-tight focus:outline-none focus:bg-white"
                  id="name"
                  type="text"
                  placeholder="First and last name"
                  required
                />
              </div>
            </div>
            <form id="payment-form" onSubmit={handleSubmit}>
              <div className="flex flex-wrap -mx-3 mb-3">
                <div className="w-full px-3 mb-0">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Card
                  </label>
                  <div
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded-md py-3 px-2 leading-tight focus:outline-none focus:bg-white"
                    id="card-element"
                  >
                    <CardElement
                      options={{
                        style: {
                          base: {
                            fontSize: "16px",
                            color: "#32325d",
                            fontFamily:
                              "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
                            "::placeholder": {
                              color: "#a0aec0",
                            },
                          },
                          invalid: {
                            color: "#9e2146",
                          },
                        },
                      }}
                    />
                  </div>
                  <div
                    className="is-invalid text-gray-700 text-base mt-2"
                    role="alert"
                  >
                    {errorToDisplay ? errorToDisplay : null}
                  </div>
                </div>
              </div>
              <button
                id="submit-premium"
                className="subscribe-button w-full bg-pasha hover:bg-white hover:shadow-outline hover:text-pasha hover:border hover:border-black focus:shadow-outline text-white focus:bg-white focus:text-pasha font-light py-2 px-4 rounded-md"
                type="submit"
              >
                <div className="">
                  <div>{subscribing ? "Subscribing..." : "Subscribe"}</div>
                </div>
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
};

const PaymentForm = (props) => (
  <Elements stripe={stripePromise}>
    <CheckoutForm {...props} />
  </Elements>
);

export default PaymentForm;
