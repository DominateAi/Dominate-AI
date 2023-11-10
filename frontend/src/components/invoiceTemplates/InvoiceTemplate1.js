import React, { Component } from "react";
import InvoiceTemplate1Responsive from "./InvoiceTemplate1Responsive";

class InvoiceTemplate1 extends Component {
  renderInvoice = () => {
    return (
      <table style={{ width: "595px", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ boxShadow: "0 3px 6px #80808029" }}>
            <td>
              <img
                src={require("../../assets/img/logo-new/invoice-logo.svg")}
                alt="logo"
                width="100%"
                height="auto"
                style={{ display: "block" }}
              />
            </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: "67px 45px 0 42px" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                }}
              >
                <tbody>
                  {/* fold 1 */}
                  <tr>
                    <td
                      style={{
                        width: "32%",
                        wordBreak: "break-all",
                        color: "#000000",
                        fontSize: "15px",
                        lineHeight: "23px",
                        fontFamily: "Inter-Bold, sans-serif, Helvetica",
                        textAlign: "left",
                        paddingBottom: "36px",
                      }}
                    >
                      17th Jan 2020
                    </td>
                    <td
                      style={{
                        width: "68%",
                        wordBreak: "break-all",
                        color: "#502EFF",
                        fontSize: "18px",
                        lineHeight: "27px",
                        fontFamily: "Inter-Bold, sans-serif, Helvetica",
                        textAlign: "right",
                        paddingBottom: "36px",
                        wordSpacing: "21px",
                        paddingLeft: "20px",
                      }}
                    >
                      Invoice #012312
                    </td>
                  </tr>

                  {/* fold 2 */}
                  <tr>
                    <td
                      colSpan="2"
                      style={{
                        wordBreak: "break-all",
                        color: "#502EFF",
                        fontSize: "18px",
                        lineHeight: "27px",
                        fontFamily: "Inter-Bold, sans-serif, Helvetica",
                        textAlign: "left",
                        paddingBottom: "11px",
                        paddingRight: "30px",
                      }}
                    >
                      To, <br /> Kiran Singh
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        wordBreak: "break-all",
                        color: "#000000",
                        fontSize: "15px",
                        lineHeight: "23px",
                        fontFamily: "Inter-SemiBold, sans-serif, Helvetica",
                        textAlign: "left",
                        paddingBottom: "36px",
                      }}
                    >
                      Billing Address Line1, Billing Address Line2, Billing
                      Address Line3,
                    </td>
                    <td></td>
                  </tr>

                  {/* fold 3 */}
                  <tr>
                    <td colSpan="2">
                      <table
                        style={{
                          width: "100%",
                          borderCollapse: "collapse",
                        }}
                      >
                        <tbody>
                          <tr
                            style={{
                              backgroundColor: "#F8F8F8",
                              color: "#000000",
                              fontSize: "15px",
                              lineHeight: "23px",
                              fontFamily:
                                "Inter-SemiBold, sans-serif, Helvetica",
                              textAlign: "left",
                            }}
                          >
                            <th style={{ padding: "15px 20px", width: "40%" }}>
                              Description
                            </th>
                            <th style={{ padding: "15px 20px", width: "30%" }}>
                              Plan Type
                            </th>
                            <th
                              style={{
                                padding: "15px 20px",
                                width: "30%",
                                textAlign: "center",
                              }}
                            >
                              Price
                            </th>
                          </tr>
                          <tr
                            style={{
                              color: "#000000",
                              fontSize: "15px",
                              lineHeight: "23px",
                              fontFamily:
                                "Inter-Regular, sans-serif, Helvetica",
                              textAlign: "left",
                            }}
                          >
                            <td style={{ padding: "20px" }}>
                              Dominate Monthly Subscription
                            </td>
                            <td style={{ padding: "20px" }}>Astronaut</td>
                            <td
                              style={{
                                padding: "20px",
                                textAlign: "center",
                              }}
                            >
                              $15
                            </td>
                          </tr>
                          <tr
                            style={{
                              backgroundColor: "#F8F8F8",
                              color: "#000000",
                              fontSize: "15px",
                              lineHeight: "23px",
                              fontFamily:
                                "Inter-SemiBold, sans-serif, Helvetica",
                              textAlign: "left",
                            }}
                          >
                            <td></td>
                            <td></td>
                            <td
                              style={{
                                padding: "15px 20px",
                                paddingBottom: "10px",
                              }}
                            >
                              Total Amount
                            </td>
                          </tr>
                          <tr
                            style={{
                              backgroundColor: "#F8F8F8",
                              color: "#000000",
                              fontSize: "15px",
                              lineHeight: "23px",
                              fontFamily:
                                "Inter-SemiBold, sans-serif, Helvetica",
                              textAlign: "left",
                            }}
                          >
                            <td></td>
                            <td></td>
                            <td
                              style={{
                                textAlign: "center",
                                padding: "15px 20px",
                                paddingTop: "0",
                                paddingBottom: "20px",
                              }}
                            >
                              $15
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td
              colSpan="2"
              style={{
                color: "#808080",
                fontSize: "15px",
                lineHeight: "23px",
                fontFamily: "Inter-Regular, sans-serif, Helvetica",
                textAlign: "center",
                paddingTop: "179px",
                paddingBottom: "22px",
              }}
            >
              Copyright &copy; 2020. Dominate. All Rights Reserved
            </td>
          </tr>
        </tfoot>
      </table>
    );
  };
  render() {
    return (
      <>
        <div className="d-none d-sm-block">{this.renderInvoice()}</div>
        <div className="d-block d-sm-none">
          <InvoiceTemplate1Responsive />
        </div>
      </>
    );
  }
}

export default InvoiceTemplate1;
