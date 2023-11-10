import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import isEmpty from "../../../store/validations/is-empty";
import dateFns from "date-fns";

const PaymentHistory = () => {
  const [paymentHis, setpaymentHis] = useState([]);

  const paymentHistory = useSelector((state) => state.payment.paymentHistory);
  useEffect(() => {
    if (!isEmpty(paymentHistory)) {
      setpaymentHis(paymentHistory);
    }
  }, [paymentHistory]);

  if (!isEmpty(paymentHis)) {
    return (
      <table className="table-with-border-row profile-payment-history-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Plan Type</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {paymentHis.map((billing, index) => {
            return (
              <Fragment key={index}>
                <tr className="table-with-border-row__content-row">
                  <td>
                    {dateFns.format(
                      new Date(billing.created * 1000),
                      "Do-MMM-YYYY"
                    )}
                  </td>
                  <td>
                    {billing.amount === 24000
                      ? "SPACESTATION"
                      : billing.amount === 16000
                      ? "SPACESHIP"
                      : billing.amount === 8000
                      ? "ROVER"
                      : "ASTROUNOT"}
                  </td>
                  <td>${billing.amount}</td>
                </tr>
                {/* tr and td added only for spacing */}
                <tr className="table-with-border-row__space-row">
                  <td></td>
                </tr>
              </Fragment>
            );
          })}
        </tbody>
      </table>
    );
  } else {
    return (
      <>
        <div className="text-center vault-not-found-div">
          <img
            // src={require("../../../assets/img/illustrations/profile-payment.svg")}
            src="/img/desktop-dark-ui/illustrations/payment-history-no-data.svg"
            alt="No Payment History"
            className="profile-payment-not-found-img"
          />
          <p className="font-18-medium color-white-79 mb-30">
            {/* No payments have been made till now */}
            No Payment History
          </p>
        </div>
      </>
    );
  }
};

export default PaymentHistory;
