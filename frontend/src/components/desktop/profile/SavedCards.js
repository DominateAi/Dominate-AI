import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import isEmpty from "../../../store/validations/is-empty";
import AddPaymentCards from "./AddPaymentCards";
import {
  RemoveCardForCustomer,
  setDefaultPaymentCardAction,
} from "./../../../store/actions/paymentAction";
import { useDispatch } from "react-redux";

const SavedCards = () => {
  const dispatch = useDispatch();
  const [savedCards, setsavedCards] = useState([]);
  const [allCustomerObject, setcustomerObject] = useState([]);
  const [defaultPaymentCard, setDefaultPaymentCard] = useState([]);

  const allSavedCards = useSelector((state) => state.payment.savedCards);

  const customerObject = useSelector(
    (state) => state.payment.customerStripeObject
  );

  useEffect(() => {
    if (!isEmpty(customerObject && !isEmpty(allSavedCards))) {
      setsavedCards(allSavedCards);
      setcustomerObject(customerObject);

      if (!isEmpty(customerObject)) {
        let defaultCardDetails =
          !isEmpty(allSavedCards) &&
          allSavedCards.filter(
            (ele) =>
              ele.id === customerObject.invoice_settings.default_payment_method
          );

        let otherSavedCards =
          !isEmpty(allSavedCards) &&
          allSavedCards.filter(
            (ele) =>
              ele.id !== customerObject.invoice_settings.default_payment_method
          );

        setDefaultPaymentCard(defaultCardDetails[0]);
        setsavedCards(otherSavedCards);
      }
    }
  }, [customerObject, allSavedCards]);

  const removeCardHnadler = (paymentId) => (e) => {
    e.preventDefault();

    const formData = {
      paymentMethodId: paymentId,
    };
    dispatch(RemoveCardForCustomer(formData));
  };

  const setDefaultCardHanlder = (paymentId) => (e) => {
    e.preventDefault();
    let organisationData = JSON.parse(localStorage.getItem("oraganiationData"));
    const formData = {
      customerId: organisationData.customerId,
      paymentMethodId: paymentId,
    };
    dispatch(setDefaultPaymentCardAction(formData));
  };

  // console.log(defaultPaymentCard);
  // console.log(savedCards);

  return (
    <div className="saved_cards_container">
      {!isEmpty(defaultPaymentCard) && (
        <div className="first-row row mx-0 align-items-start">
          <div>
            <div className="row mx-0 align-items-center default-card-div">
              <h3>Default Card</h3>
            </div>
            {/* <div className="default_card_box">
                <h4 className="default-card-title">Bank Name</h4>
                <p className="defult-card-credit-text">
                  {defaultPaymentCard.card.funding}
                </p>
                <span className="defult-card-credit-no-text">
                  XXXX XXXX XXXX
                  {defaultPaymentCard.card.last4}
                </span>
                <p className="defult-card-expire-text">
                  Expires on{" "}
                  {`${defaultPaymentCard.card.exp_month}/${defaultPaymentCard.card.exp_year}`}
                </p>
              </div> */}
            <div className="default_card_box">
              <div className="default_card_box__visaTextIconBlock">
                <img
                  src="/img/desktop-dark-ui/icons/white-visa-text-icon.svg"
                  alt="visa"
                />
              </div>
              <div className="default_card_box__visaIconBlock">
                <img
                  src="/img/desktop-dark-ui/icons/white-visa-card-icon.svg"
                  alt=""
                />
              </div>
              <p className="defult-card-credit-no-text">
                XXXX XXXX XXXX {defaultPaymentCard.card.last4}
                {/* 3732 */}
              </p>
              <div className="row mx-0 align-items-start">
                <div>
                  <h4 className="defult-card-detail-text-1">Owner Name </h4>
                  <p className="defult-card-detail-text-2">Salman</p>
                </div>
                <div>
                  <h4 className="defult-card-detail-text-1">Expiry</h4>
                  <p className="defult-card-detail-text-2">09/20</p>
                </div>
                <div>
                  <h4 className="defult-card-detail-text-1">CVV</h4>
                  <p className="defult-card-detail-text-2">299</p>
                </div>
              </div>
            </div>
          </div>

          <div className="ml-79">
            <div className="row mx-0 align-items-center default-card-div">
              <h3>Available Balance</h3>
            </div>
            <div className="available_balence_card">
              <h2 className="available_balence_card-title">
                ${!isEmpty(allCustomerObject) && allCustomerObject.balance}
                {/* 0 */}
              </h2>
              <p className="available_balence_card-para">
                As of last transaction on 29/1/2020
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="second-row">
        <div className="row mx-0 align-items-center profile-card-title-text-div">
          <h3> Saved Cards </h3>
          <AddPaymentCards />
        </div>
        {!isEmpty(savedCards) &&
          savedCards !== false &&
          savedCards !== undefined && (
            <table className="table-with-border-row profile-payment-history-table-paymentSavedCard">
              <thead>
                <th>bank name</th>
                <th>last 4 digits</th>
                <th>merchant</th>
                <th>account holder</th>
                <th>expiry date</th>
                <th>action</th>
              </thead>
              <tbody>
                {savedCards.map((data, index) => {
                  return (
                    <Fragment key={index}>
                      <tr className="table-with-border-row__content-row">
                        <td>Bank Name</td>
                        <td>
                          Ending in
                          {data.card.last4}
                          {/* 3732 */}
                        </td>
                        <td>
                          <img
                            src="/img/desktop-dark-ui/icons/white-visa-text-icon.svg"
                            alt="visa"
                            className="merchant-img"
                          />
                        </td>
                        <td>
                          <img
                            src="/img/desktop-dark-ui/dummy/dummy-img-person.png"
                            alt=""
                            className="person-img"
                          />
                          Akshay Nagargoje
                        </td>
                        <td>
                          Expires on
                          {/* <span className="expiry-date">5thApril 2021</span> */}
                          {`${data.card.exp_month}/${data.card.exp_year}`}
                        </td>

                        <td>
                          <button
                            onClick={setDefaultCardHanlder(data.id)}
                            className="profile-set-default-btn"
                          >
                            Set as default card
                          </button>
                          <i
                            onClick={removeCardHnadler(data.id)}
                            className="fa fa-trash"
                            aria-hidden="true"
                          ></i>
                        </td>
                      </tr>
                      <tr className="table-with-border-row__space-row">
                        <td></td>
                      </tr>
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          )}
      </div>
    </div>
  );
};

export default SavedCards;
