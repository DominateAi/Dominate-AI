import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
// import './App.css';
import Product from "./Product";
import PriceChangeForm from "./PriceChangeForm";
import isEmpty from "../../../store/validations/is-empty";
import { url, workspaceId } from "./../../../store/actions/config";
import { useSelector, useDispatch } from "react-redux";
import {
  getPriceIdByProduct,
  updateDataAfterPaymentSuccess,
  getFutureInvoice,
} from "./../../../store/actions/paymentAction";
import { deleteEmployeeInPlans } from "./../../../store/actions/employeeAction";
import { logoutUser } from "./../../../store/actions/authAction";

import SubscriptionUpdateSuccess from "./../../desktop/popups/SubscriptionUpdateSuccess";
import CancelSubscription from "./../../desktop/popups/CancelSubscription";
import CancelSubscriptionSuccess from "./../../desktop/popups/CancelSubscriptionSuccess";
import WarningPopup from "./../popups/WarningPopup";
import PrePaymentPopup from "./../popups/PrePaymentPopup";
import EmployeeDeletePopup from "./../popups/EmployeeDeletePopup";
import dateFns from "date-fns";
import axios from "axios";
import Alert from "react-s-alert";
import { useHistory } from "react-router-dom";

function Account({ location }) {
  const history = useHistory();
  let organizationData = JSON.parse(localStorage.getItem("oraganiationData"));
  const dispatch = useDispatch();
  //   const [accountInformation] = useState(location.state.accountInformation);
  const [currentProductData, setCurrentProductData] = useState("");
  const [productSelected, setProduct] = useState(null);
  let [customerPaymentMethod, setCustomerPaymentmethod] = useState(null);
  let [showChangePriceForm, setShowChangePriceForm] = useState(false);
  let [subscriptionCancelled, setSubscriptionCancelled] = useState(false);
  let [newProductSelected, setNewProdctSelected] = useState("");
  let [selectedProducted, setSelectedProduct] = useState("");
  let [subscriptionId, setSubscriptionId] = useState("");
  let [customerId, setCustomerId] = useState("");
  let [userData, setUserData] = useState({});
  const [allProducts, setProducts] = useState([]);
  const [priceId, setPriceId] = useState("");
  const [activePlan, setActivePlan] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [deleteEmployeeList, setDeleteEmployeeList] = useState([]);

  const [futureInvoiceInfo, setFutureInvoiceInfo] = useState({});

  //popup states

  const [downgradeWarningPopup, setDowngradeWarningPopup] = useState(false);
  const [subscriptionUpdateSuccess, setSubscriptionUpdateSuccess] =
    useState(false);
  const [cancelSubscriptionPopup, setCancelSubscription] = useState(false);
  const [cancelSubscriptionSuccess, setCancelSubscriptionSuccess] =
    useState(false);
  const [prePaymentPopup, setPrePaymentPopup] = useState(false);
  const [empDeletePopup, setempDeletePopup] = useState(false);

  //componentDidMount
  useEffect(() => {
    let organizationData = JSON.parse(localStorage.getItem("oraganiationData"));
    let userData = JSON.parse(localStorage.getItem("Data"));
    if (!isEmpty(userData)) {
      setUserData(userData);
    }
    if (!isEmpty(organizationData)) {
      setSelectedProduct(organizationData.priceId);
      setSubscriptionId(organizationData.billingId);
      setCustomerId(organizationData.customerId);
      if (!isEmpty(organizationData.newPriceId)) {
        dispatch(getFutureInvoice(organizationData.newPriceId));
      }
    }
  }, []);

  //static getderived

  const allPlans = useSelector((state) => state.plans.plans);

  const allActiveUsersWithoutAdmin = useSelector(
    (state) => state.employee.allEmployees
  );
  useEffect(() => {
    if (!isEmpty(allPlans)) {
      let organizationData = JSON.parse(
        localStorage.getItem("oraganiationData")
      );
      setProducts(allPlans);

      let currentProduct = {};
      // currentProduct = allPlans.filter(
      //   (ele) => ele.id === organizationData.productId
      // );
      console.log(currentProduct);
      setCurrentProductData(currentProduct[0]);
      setProduct(currentProduct[0]);
      // setActivePlan(currentProduct[0].description);
    }
  }, [allPlans]);

  useEffect(() => {
    if (!isEmpty(allActiveUsersWithoutAdmin)) {
      setAllUsers(allActiveUsersWithoutAdmin);
    }
  }, [allActiveUsersWithoutAdmin]);

  //   useEffect(() => {
  //     async function fetchData() {
  //       // You can await here
  //       const response = await fetch("/retrieve-customer-payment-method", {
  //         method: "post",
  //         headers: {
  //           "Content-type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           paymentMethodId: accountInformation.paymentMethodId,
  //         }),
  //       });
  //       const responseBody = await response.json();
  //       const paymentMethod =
  //         responseBody.card.brand + " •••• " + responseBody.card.last4;

  //       setCustomerPaymentmethod(paymentMethod);
  //     }
  //     fetchData();
  //   }, [accountInformation.paymentMethodId]);

  function handleChangePriceForm() {
    setShowChangePriceForm(true);
  }

  function handleClick(product) {
    let organizationData = JSON.parse(localStorage.getItem("oraganiationData"));
    const formData = {
      productId: product.id,
      currency: organizationData.currency,
    };
    dispatch(getPriceIdByProduct(formData, callBackGetPrice));
    setProduct(product);
    setNewProdctSelected(product.name);
    setActivePlan(product.name);
    // if (
    //   parseInt(product.metadata.maxUsers) <
    //   parseInt(currentProductData.metadata.maxUsers)
    // ) {
    //   setDowngradeWarningPopup(true);
    // } else {
    //   setPrePaymentPopup(true);
    // }
    //check for employee delete popup
    if (parseInt(product.metadata.maxUsers) < allUsers.length + 1) {
      console.log("delete popup");
      setempDeletePopup(true);
    } else {
      console.log("continue");
      //check for downgrade and proceed popup
      if (!isEmpty(organizationData.productId)) {
        if (
          parseInt(product.metadata.maxUsers) <
          parseInt(currentProductData.metadata.maxUsers)
        ) {
          setDowngradeWarningPopup(true);
        } else {
          setPrePaymentPopup(true);
        }
      } else {
        setPrePaymentPopup(true);
      }
    }
  }

  const callBackGetPrice = (priceId) => {
    setPriceId(priceId);
  };

  function cancelSubscription() {
    fetch(`${url}/api/new-cancel-subscription`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        workspaceId: workspaceId,
        Authorization: `Bearer ${userData.token}`,
      },
      body: JSON.stringify({
        subscriptionId: subscriptionId,
        // customerId: customerId,
      }),
    })
      .then((response) => {
        console.log(response.status);
        if (response.status === 200) {
          setCancelSubscription(false);
          setCancelSubscriptionSuccess(true);

          let filterUsers = allUsers.filter(
            (user) => user.role.name !== "Administrator"
          );
          let finalArray = [];
          filterUsers.forEach((element) => {
            finalArray.push(element.email);
          });

          if (!isEmpty(finalArray)) {
            dispatch(deleteEmployeeInPlans(finalArray, callBackEmployeeDelete));
          }
        }

        return response.json();
      })
      .then((cancelSubscriptionResponse) => {
        setSubscriptionCancelled(true);
      });
  }

  const onCloseHandler = () => {
    setNewProdctSelected("");
    setSubscriptionUpdateSuccess(false);
    setCancelSubscription(false);
    setDowngradeWarningPopup(false);
    setPrePaymentPopup(false);
  };

  const continueHandler = () => {
    axios
      .post(
        `${url}/api/update-subscription`,

        {
          subscriptionId: subscriptionId,
          priceId: priceId,
          customerId: customerId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            workspaceId: workspaceId,
            Authorization: `Bearer ${userData.token}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          setSubscriptionUpdateSuccess(true);
          setDowngradeWarningPopup(false);
          setPrePaymentPopup(false);
          dispatch(updateDataAfterPaymentSuccess());
          dispatch(getFutureInvoice(response.data.plan.id));
        }

        // return response.json();
      })
      .catch((result) => {
        // setSelectedProduct(newProductSelected);
        // setShowChangePriceForm(false);
        // props.history.push('/prices?customerId=' + customer.id);
      });
  };

  const continueToUpgradeHandler = () => {
    setPrePaymentPopup(true);
    setDowngradeWarningPopup(false);
  };

  const onClickSubscriptionCancel = () => {
    setCancelSubscription(true);
  };

  const planUpdateHandler = () => {
    console.log("update");
    let organizationData = JSON.parse(localStorage.getItem("oraganiationData"));

    if (parseInt(productSelected.metadata.maxUsers) < allUsers.length + 1) {
      console.log("delete popup");
      setempDeletePopup(true);
    } else {
      console.log("continue");
      //check for downgrade and proceed popup
      if (!isEmpty(organizationData.productId)) {
        if (
          parseInt(productSelected.metadata.maxUsers) <
          parseInt(currentProductData.metadata.maxUsers)
        ) {
          setDowngradeWarningPopup(true);
        } else {
          setPrePaymentPopup(true);
        }
      } else {
        setPrePaymentPopup(true);
      }
    }
  };

  const logoutHandler = () => {
    dispatch(logoutUser());
    history.push("/login");
  };
  /*========================================
            get future Invoice
==========================================*/
  const futureInvoice = useSelector((state) => state.payment.getFutureInvoice);
  useEffect(() => {
    if (!isEmpty(futureInvoice) && !isEmpty(allPlans)) {
      // let futureInvoicePlan = allPlans.filter(
      //   (plan) => plan.id === futureInvoice.plan.product
      // );
      // setFutureInvoiceInfo({
      //   planName: futureInvoicePlan[0].name,
      //   monthlyPrice: futureInvoicePlan[0].metadata.monthlyPrice,
      //   period: new Date(futureInvoice.period.start * 1000),
      // });
    }
  }, [futureInvoice, allPlans]);

  const renderFutureInvoice = () => {
    if (!isEmpty(futureInvoiceInfo)) {
      return (
        <span className="upcoming_plan_info">
          Your upcoming plan is {futureInvoiceInfo.planName} with price{" "}
          {futureInvoiceInfo.monthlyPrice}, which will start on{" "}
          {dateFns.format(futureInvoiceInfo.period, "DD MMM YYYY")}
        </span>
      );
    } else {
      return null;
    }
  };
  // console.log(futureInvoiceInfo.period);

  const onCloseModal = () => {
    setempDeletePopup(false);
    // setaddPaymentAddresspopup(false);
  };

  /*=============================
      Delete Employee Handler
  ==============================*/
  const callBackEmployeeDelete = (status) => {
    if (status === 200) {
      setempDeletePopup(false);
    }
  };

  const employeeDeleteHandler = () => {
    if (isEmpty(deleteEmployeeList)) {
      Alert.success("<h4>Please select employee</h4>", {
        position: "top-right",
        effect: "slide",
        beep: false,
        html: true,
        timeout: 5000,
        // offset: 100
      });
    } else {
      dispatch(
        deleteEmployeeInPlans(deleteEmployeeList, callBackEmployeeDelete)
      );
    }
  };

  /*============================
        Checkbox events handler
  =============================*/

  const doEmailExist = (email) => {
    let obj = deleteEmployeeList.find((emp) => emp === email);
    console.log(obj);
    return obj ? deleteEmployeeList.indexOf(obj) : false;
  };

  const onChangeCheckbox = (email) => (e) => {
    console.log("Checkbox checked:", email);
    let deleteEmployeeLists = deleteEmployeeList;

    let returnValue = doEmailExist(email);
    if (returnValue || returnValue === 0) {
      deleteEmployeeLists.splice(returnValue, 1);
    } else {
      deleteEmployeeLists.push(email);
    }

    // this.setState({
    //   deleteEmployeeList: deleteEmployeeList,
    // });
    setDeleteEmployeeList([...deleteEmployeeLists], deleteEmployeeLists);
  };

  const toggle = () => {
    this.setState((state) => ({
      disabled: !state.disabled,
    }));
  };

  return (
    <div className="p-6">
      <WarningPopup
        onCloseHandler={onCloseHandler}
        downgradeWarningPopup={downgradeWarningPopup}
        currentProductData={currentProductData}
        productSelected={productSelected}
        continueHandler={continueToUpgradeHandler}
      />
      {/* ) : ( */}
      <PrePaymentPopup
        onCloseHandler={onCloseHandler}
        prePaymentPopup={prePaymentPopup}
        productSelected={productSelected}
        continueHandler={continueHandler}
      />
      <SubscriptionUpdateSuccess
        subscriptionUpdateSuccess={subscriptionUpdateSuccess}
        onCloseHandler={onCloseHandler}
      />
      <CancelSubscription
        cancelSubscriptionPopup={cancelSubscriptionPopup}
        onCloseHandler={onCloseHandler}
        cancelSubscriptionHandler={cancelSubscription}
      />
      <CancelSubscriptionSuccess
        cancelSubscriptionSuccess={cancelSubscriptionSuccess}
        logoutHandler={logoutHandler}
      />

      <EmployeeDeletePopup
        allUsers={allUsers}
        empDeletePopup={empDeletePopup}
        employeeDeleteHandler={employeeDeleteHandler}
        doEmailExist={doEmailExist}
        onChangeCheckbox={onChangeCheckbox}
        toggle={toggle}
        onCloseModal={onCloseModal}
      />
      <div>
        <div className="flex flex-wrap justify-center mt-4">
          {/* p-4 */}
          <div className="md:w-2/5 w-full inline-block rounded-md">
            <div id="prices-form" className="w-full md:mb-8">
              {/* {renderFutureInvoice()} */}

              <div className="subscription container">
                <p className="font-24-semibold profile_current_card_title">
                  You are currently using a{" "}
                  <span className="profile-font-36-semibold">Premium</span>
                  <span className="profile-font-36-regular"> Plan</span>
                </p>
                {/* <p className="font-24-semibold profile_current_card_title">
                  Upgrade to Premium to add your team!
                </p> */}
                <div className="profile_premium_card_outer_div">
                  <div className="row mx-0 flex-nowrap profile_premium_card_div">
                    {!isEmpty(allProducts) &&
                      allProducts.tiers.map((product, index) => {
                        return (
                          <Product
                            key={index}
                            index={index}
                            product={product}
                            allUsersCount={allUsers.length}
                            // handleClick={handleClick}
                            // activePlan={activePlan}
                          />
                        );
                      })}
                  </div>
                </div>
                <p className="font-24-semibold profile_current_card_title">
                  Downgrade to Free plan
                </p>
                <div className="profile_current_plan_card">
                  <div className="row mx-0 align-items-center justify-content-center profile_current_plan_card_inner_div">
                    <img
                      src="/img/desktop-dark-ui/plans/pod.png"
                      alt=""
                      className="profile_current_plan_card_img"
                    />
                    <div>
                      <h4 className="profile_product_card_name">Pod</h4>
                      <h5 className="profile_product_card_tier">1 User</h5>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row mx-0 justify-content-center mt-40">
                <button
                  onClick={onClickSubscriptionCancel}
                  className="subscription-cancel"
                >
                  Downgrade
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRouter(Account);
