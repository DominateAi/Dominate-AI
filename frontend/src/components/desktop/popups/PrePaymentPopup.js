import React from "react";
import Modal from "react-responsive-modal";
import isEmpty from "../../../store/validations/is-empty";
import getSymbolFromCurrency from "currency-symbol-map";

const PrePaymentPopup = ({
  prePaymentPopup,
  productSelected,
  onCloseHandler,
  continueHandler,
}) => {
  let organizationData = JSON.parse(localStorage.getItem("oraganiationData"));
  // NEW PAYMENT FLOW
  // organizationData.currency = "inr";

  if (!isEmpty(productSelected)) {
    return (
      <div>
        <Modal
          open={prePaymentPopup}
          onClose={() => console.log("unable to close")}
          closeOnEsc={true}
          closeOnOverlayClick={false}
          center
          classNames={{
            overlay: "customOverlay",
            modal:
              "warning-employee-model customModal-warning customModal--addLead",
            closeButton: "customCloseButton",
          }}
        >
          <span className="closeIconInModal" onClick={onCloseHandler} />
          <div className="employee-warning-popup-container">
            {organizationData.planStatus === "CANCELLED" ||
            organizationData.planStatus === "TRIAL" ||
            organizationData.planStatus === "TRIAL_OVER" ? (
              <h3>Proceed To Payment</h3>
            ) : (
              <h3>Proceed To Upgrade</h3>
            )}
          </div>
          <div className="warning-downgarade-section">
            <div className="current-plan-section">
              <h3>Your Selected Plan</h3>
              <div className="detail-section">
                <img
                  src={
                    productSelected.name === "ROVER"
                      ? require("./../../../assets/img/plans/plans1.svg")
                      : productSelected.name === "ASTRONAUT"
                      ? require("./../../../assets/img/plans/plans0.svg")
                      : productSelected.name === "SPACESHIP"
                      ? require("./../../../assets/img/plans/plans3.svg")
                      : productSelected.name === "SPACESTATION"
                      ? require("./../../../assets/img/plans/plans2.svg")
                      : require("./../../../assets/img/plans/free.svg")
                  }
                  alt={""}
                />
                <div>
                  <h4>{productSelected.name}</h4>
                  <p>
                    {" "}
                    {productSelected.name === "ASTRONAUT"
                      ? `${
                          !isEmpty(productSelected) &&
                          productSelected.metadata.maxUsers
                        } User`
                      : productSelected.name === "ROVER"
                      ? `2-${
                          !isEmpty(productSelected) &&
                          productSelected.metadata.maxUsers
                        } Users`
                      : productSelected.name === "SPACESHIP"
                      ? `6-${
                          !isEmpty(productSelected) &&
                          productSelected.metadata.maxUsers
                        } Users`
                      : productSelected.name === "SPACESTATION"
                      ? `11-${
                          !isEmpty(productSelected) &&
                          productSelected.metadata.maxUsers
                        } Users`
                      : ""}
                  </p>
                  <p>
                    {!isEmpty(productSelected) && (
                      <>
                        {" "}
                        {organizationData.currency === "inr"
                          ? "Rs."
                          : getSymbolFromCurrency(
                              organizationData.currency.toUpperCase()
                            )}
                        {productSelected.priceData.unit_amount / 100}
                        /Mo
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="btn-section">
              <button onClick={onCloseHandler} className="cancel-btn">
                Cancel
              </button>
              <button onClick={continueHandler} className="continue-btn">
                Continue
              </button>
            </div>
          </div>
        </Modal>
      </div>
    );
  } else {
    return null;
  }
};

export default PrePaymentPopup;
