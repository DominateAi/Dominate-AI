import React, { Component } from "react";

class InvoiceTemplate1Responsive extends Component {
  render() {
    return (
      <table style={{ width: "100vw" }}>
        <thead>
          <tr style={{ boxShadow: "0 0.5vw 1vw #80808029" }}>
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
            <td style={{ padding: "11.26vw 7.56vw 0 7.05vw" }}>
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
                        fontSize: "2.52vw",
                        lineHeight: "3.86vw",
                        fontFamily: "Inter-Bold, sans-serif, Helvetica",
                        textAlign: "left",
                        paddingBottom: "6.05vw",
                      }}
                    >
                      17th Jan 2020
                    </td>
                    <td
                      style={{
                        width: "68%",
                        wordBreak: "break-all",
                        color: "#502EFF",
                        fontSize: "3.03vw",
                        lineHeight: "4.54vw",
                        fontFamily: "Inter-Bold, sans-serif, Helvetica",
                        textAlign: "right",
                        paddingBottom: "6.05vw",
                        wordSpacing: "21px",
                        paddingLeft: "3.36vw",
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
                        fontSize: "3.03vw",
                        lineHeight: "4.54vw",
                        fontFamily: "Inter-Bold, sans-serif, Helvetica",
                        textAlign: "left",
                        paddingBottom: "1.85vw",
                        paddingRight: "5.04vw",
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
                        fontSize: "2.52vw",
                        lineHeight: "3.86vw",
                        fontFamily: "Inter-SemiBold, sans-serif, Helvetica",
                        textAlign: "left",
                        paddingBottom: "6.05vw",
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
                              fontSize: "2.52vw",
                              lineHeight: "3.86vw",
                              fontFamily:
                                "Inter-SemiBold, sans-serif, Helvetica",
                              textAlign: "left",
                            }}
                          >
                            <th
                              style={{ padding: "2.52vw 3.36vw", width: "40%" }}
                            >
                              Description
                            </th>
                            <th
                              style={{ padding: "2.52vw 3.36vw", width: "30%" }}
                            >
                              Plan Type
                            </th>
                            <th
                              style={{
                                padding: "2.52vw 3.36vw",
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
                              fontSize: "2.52vw",
                              lineHeight: "3.86vw",
                              fontFamily:
                                "Inter-Regular, sans-serif, Helvetica",
                              textAlign: "left",
                            }}
                          >
                            <td style={{ padding: "3.36vw" }}>
                              Dominate Monthly Subscription
                            </td>
                            <td style={{ padding: "3.36vw" }}>Astronaut</td>
                            <td
                              style={{
                                padding: "3.36vw",
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
                              fontSize: "2.52vw",
                              lineHeight: "3.86vw",
                              fontFamily:
                                "Inter-SemiBold, sans-serif, Helvetica",
                              textAlign: "left",
                            }}
                          >
                            <td></td>
                            <td></td>
                            <td
                              style={{
                                padding: "2.52vw 3.36vw",
                                paddingBottom: "1.68vw",
                              }}
                            >
                              Total Amount
                            </td>
                          </tr>
                          <tr
                            style={{
                              backgroundColor: "#F8F8F8",
                              color: "#000000",
                              fontSize: "2.52vw",
                              lineHeight: "3.86vw",
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
                                padding: "2.52vw 3.36vw",
                                paddingTop: "0",
                                paddingBottom: "3.36vw",
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
                fontSize: "2.52vw",
                lineHeight: "3.86vw",
                fontFamily: "Inter-Regular, sans-serif, Helvetica",
                textAlign: "center",
                paddingTop: "30.08vw",
                paddingBottom: "3.70vw",
              }}
            >
              Copyright &copy; 2019. Dominate. All Rights Reserved
            </td>
          </tr>
        </tfoot>
      </table>
    );
  }
}

export default InvoiceTemplate1Responsive;
