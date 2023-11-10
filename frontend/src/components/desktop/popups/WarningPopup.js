import React from "react";
import Modal from "react-responsive-modal";
import isEmpty from "../../../store/validations/is-empty";
import getSymbolFromCurrency from "currency-symbol-map";

const WarningPopup = ({
  downgradeWarningPopup,
  currentProductData,
  productSelected,
  onCloseHandler,
  continueHandler,
}) => {
  // console.log(currentProductData);

  let organizationData = JSON.parse(localStorage.getItem("oraganiationData"));

  if (!isEmpty(currentProductData) && !isEmpty(productSelected)) {
    return (
      <div>
        <Modal
          open={downgradeWarningPopup}
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
          {/* <span className="closeIconInModal" onClick={this.WarningModalClose} /> */}
          <div className="employee-warning-popup-container">
            <h3>Downgrade your plan</h3>
          </div>
          <div className="warning-downgarade-section">
            <div className="current-plan-section">
              <h3>Your Current Plan</h3>
              <div className="detail-section">
                <img
                  src={
                    currentProductData.name === "ROVER"
                      ? require("./../../../assets/img/plans/plans1.svg")
                      : currentProductData.name === "ASTRONAUT"
                      ? require("./../../../assets/img/plans/plans0.svg")
                      : currentProductData.name === "SPACESHIP"
                      ? require("./../../../assets/img/plans/plans3.svg")
                      : currentProductData.name === "SPACESTATION"
                      ? require("./../../../assets/img/plans/plans2.svg")
                      : require("./../../../assets/img/plans/free.svg")
                  }
                  alt={""}
                />
                <div>
                  <h4>{currentProductData.name}</h4>
                  <p>
                    {" "}
                    {currentProductData.name === "ASTRONAUT"
                      ? `${
                          !isEmpty(currentProductData) &&
                          currentProductData.metadata.maxUsers
                        } User`
                      : currentProductData.name === "ROVER"
                      ? `2-${
                          !isEmpty(currentProductData) &&
                          currentProductData.metadata.maxUsers
                        } Users`
                      : currentProductData.name === "SPACESHIP"
                      ? `6-${
                          !isEmpty(currentProductData) &&
                          currentProductData.metadata.maxUsers
                        } Users`
                      : currentProductData.name === "SPACESTATION"
                      ? `11-${
                          !isEmpty(currentProductData) &&
                          currentProductData.metadata.maxUsers
                        } Users`
                      : ""}
                  </p>
                  <p>
                    {" "}
                    {!isEmpty(currentProductData) && (
                      <>{currentProductData.metadata.monthlyPrice}/Mo</>
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div className="downgrading-plan-section">
              <h3>You are downgrading to the plan:</h3>
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
                      : ""
                  }
                  alt="plans"
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
                        {organizationData.currency === "inr"
                          ? "Rs."
                          : getSymbolFromCurrency(
                              organizationData.currency.toUpperCase()
                            )}
                        {productSelected.priceData.unit_amount / 100}/Mo
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

export default WarningPopup;
