import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
// import TopNavigationBar from './TopNavigationBar';
// import StripeSampleFooter from './StripeSampleFooter';
import PaymentForm from "./PaymentForm";
import Product from "./Product";
import isEmpty from "../../../store/validations/is-empty";
import { useSelector, useDispatch } from "react-redux";
import {
  getPriceIdByProduct,
  updateCustomerAddress,
} from "./../../../store/actions/paymentAction";
import { deleteEmployeeInPlans } from "./../../../store/actions/employeeAction";
import Modal from "react-responsive-modal";
import Alert from "react-s-alert";

import WarningPopup from "./../popups/WarningPopup";
import PrePaymentPopup from "./../popups/PrePaymentPopup";
import EmployeeDeletePopup from "./../popups/EmployeeDeletePopup";
import AddPaymentAddress from "./../popups/AddPaymentAddress";

const Prices = ({ location }) => {
  const dispatch = useDispatch();
  const [currentProductData, setCurrentProductData] = useState("");
  const [productSelected, setProduct] = useState(null);
  const [customerId, setCustomerId] = useState("");
  const [allProducts, setProducts] = useState([]);
  const [priceId, setPriceId] = useState("");
  const [activePlan, setActivePlan] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [deleteEmployeeList, setDeleteEmployeeList] = useState([]);
  const [stripeCustomerObject, setStripeCustomerObject] = useState({});

  //popup states

  const [downgradeWarningPopup, setDowngradeWarningPopup] = useState(false);
  const [prePaymentPopup, setPrePaymentPopup] = useState(false);
  const [cardDetailPopup, setCardDetailPopup] = useState(false);
  const [empDeletePopup, setempDeletePopup] = useState(false);
  const [addPaymentAddresspopup, setaddPaymentAddresspopup] = useState(false);

  //componentDidMount
  useEffect(() => {
    let organizationData = JSON.parse(localStorage.getItem("oraganiationData"));
    if (!isEmpty(organizationData)) {
      setCustomerId(organizationData.customerId);
      // if (organizationData.planStatus === "CANCELLED") {
      //   dispatch(getPriceIdByProduct("prod_Is22903iNPobxo", callBackGetPrice));
      // } else
      if (!isEmpty(organizationData.productId)) {
        const formData = {
          productId: organizationData.productId,
          currency: organizationData.currency,
        };
        dispatch(getPriceIdByProduct(formData, callBackGetPrice));
      }
    }
  }, []);

  //static getderived

  const customerObject = useSelector(
    (state) => state.payment.customerStripeObject
  );

  const allPlans = useSelector((state) => state.plans.plans);

  const allActiveUsersWithoutAdmin = useSelector(
    (state) => state.employee.allEmployees
  );

  useEffect(() => {
    if (!isEmpty(customerObject)) {
      setStripeCustomerObject(customerObject);
    }
  }, [customerObject]);

  useEffect(() => {
    if (!isEmpty(allPlans)) {
      let organizationData = JSON.parse(
        localStorage.getItem("oraganiationData")
      );
      setProducts(allPlans);

      //   if (!isEmpty(organizationData.productId)) {
      //     let currentProduct = {};
      //     currentProduct = allPlans.filter(
      //       (ele) => ele.id === organizationData.productId
      //     );
      //     setCurrentProductData(currentProduct[0]);
      //     setProduct(currentProduct[0]);
      //     setActivePlan(currentProduct[0].name);
      //   } else {
      //     // let currentProduct = {};
      //     // currentProduct = allPlans.filter(
      //     //   (ele) => ele.id === "prod_IXDyftQuNSM441"
      //     // );
      //     // setCurrentProductData(currentProduct[0]);
      //     // setProduct(currentProduct[0]);
      //     // setActivePlan(currentProduct[0].name);
      //   }
    }
  }, [allPlans]);

  useEffect(() => {
    if (!isEmpty(allActiveUsersWithoutAdmin)) {
      let filterData = allActiveUsersWithoutAdmin.filter(
        (user) =>
          user.role.name !== "Administrator" && user.status === "INVITED"
      );
      setAllUsers(filterData);
    }
  }, [allActiveUsersWithoutAdmin]);

  function handleClick(product) {
    let organizationData = JSON.parse(localStorage.getItem("oraganiationData"));
    //setting data in state
    const formData = {
      productId: product.id,
      currency: organizationData.currency,
    };
    dispatch(getPriceIdByProduct(formData, callBackGetPrice));
    setProduct(product);
    setActivePlan(product.name);

    // console.log(product);

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

  const onCloseHandler = () => {
    setCardDetailPopup(false);
    setPrePaymentPopup(false);
    setDowngradeWarningPopup(false);
  };

  const continueHandler = () => {
    if (
      !isEmpty(stripeCustomerObject) &&
      stripeCustomerObject.address === null
    ) {
      setaddPaymentAddresspopup(true);
    } else {
      setCardDetailPopup(true);
    }
  };

  const continuePrepaymentHandler = () => {
    setPrePaymentPopup(true);
    setDowngradeWarningPopup(false);
  };

  const payNowHandler = () => {
    /*================================================
                        OLD FLOW
    ==================================================*/

    // let organizationData = JSON.parse(localStorage.getItem("oraganiationData"));
    // if (isEmpty(activePlan)) {
    //   // alert("Please select plan to continue");
    //   Alert.success("<h4>Please select plan to continue</h4>", {
    //     position: "top-right",
    //     effect: "slide",
    //     beep: false,
    //     html: true,
    //     timeout: 5000,
    //     // offset: 100
    //   });
    // } else {
    //   if (parseInt(productSelected.metadata.maxUsers) < allUsers.length + 1) {
    //     console.log("delete popup");
    //     setempDeletePopup(true);
    //   } else {
    //     console.log("continue");
    //     //check for downgrade and proceed popup
    //     if (!isEmpty(organizationData.productId)) {
    //       if (
    //         parseInt(productSelected.metadata.maxUsers) <
    //         parseInt(currentProductData.metadata.maxUsers)
    //       ) {
    //         setDowngradeWarningPopup(true);
    //       } else {
    //         setPrePaymentPopup(true);
    //       }
    //     } else {
    //       setPrePaymentPopup(true);
    //     }
    //   }
    // }

    if (
      !isEmpty(stripeCustomerObject) &&
      stripeCustomerObject.address === null
    ) {
      setaddPaymentAddresspopup(true);
    } else {
      setCardDetailPopup(true);
    }
  };

  const renderTakeCardDetails = () => {
    return (
      <Modal
        open={cardDetailPopup}
        onClose={() => console.log("unable to close")}
        // closeOnEsc={true}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay",
          modal: "customModal-warning customModal--card-details",
          closeButton: "customCloseButton",
        }}
      >
        <span className="closeIconInModal" onClick={onCloseHandler} />
        <PaymentForm
          productSelected={productSelected}
          customerId={customerId}
          productPriceId={allPlans.priceId}
        />
      </Modal>
    );
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

  const onCloseModal = () => {
    setempDeletePopup(false);
    setaddPaymentAddresspopup(false);
  };

  const callBackAddAdress = (status) => {
    if (status === 200) {
      setaddPaymentAddresspopup(false);
      setCardDetailPopup(true);
    }
  };

  const saveAddressHandler = (values, selectedCountry) => (e) => {
    e.preventDefault();
    // console.log(values, selectedCountry);
    const formData = {
      customerId: organizationData.customerId,
      payLoad: {
        address: {
          city: values.city,
          country: selectedCountry,
          line1: values.companyAddress,
          line2: null,
          postal_code: values.pincode,
          state: values.state,
        },
      },
    };

    dispatch(updateCustomerAddress(formData, callBackAddAdress));
  };

  // console.log(deleteEmployeeList);
  let organizationData = JSON.parse(localStorage.getItem("oraganiationData"));
  return (
    <div className="p-6">
      {/* <TopNavigationBar /> */}

      <AddPaymentAddress
        addPaymentAddresspopup={addPaymentAddresspopup}
        onCloseModal={onCloseModal}
        saveAddressHandler={saveAddressHandler}
      />

      <WarningPopup
        onCloseHandler={onCloseHandler}
        downgradeWarningPopup={downgradeWarningPopup}
        currentProductData={currentProductData}
        productSelected={productSelected}
        continueHandler={continuePrepaymentHandler}
      />
      <PrePaymentPopup
        onCloseHandler={onCloseHandler}
        prePaymentPopup={prePaymentPopup}
        productSelected={productSelected}
        continueHandler={continueHandler}
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

      <>
        <div className="md:w-1/3 w-full mr-4 md:mb-8">
          <div className="plan-heading text-pasha font-bold text-2xl mt-4 mb-6">
            {organizationData.planStatus === "CANCELLED"
              ? "Pay now to continue"
              : ""}
          </div>
          <>
            <p className="font-24-semibold profile_current_card_title">
              You are currently using{" "}
              <span className="profile_current_card_title__blue-text">
                free
              </span>{" "}
              plan
            </p>
            <div
              //style={{
              //  display: "flex",
              //  justifyContent: "center",
              //  alignItems: "center",
              //  background: "lightgray",
              //  height: "165px",
              //  marginBottom: "20px",
              //}}
              className="profile_current_plan_card"
            >
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
            <p className="font-24-semibold profile_current_card_title">
              Upgrade to Premium to add your team!
            </p>
            <div className="profile_premium_card_outer_div">
              <div className="row mx-0 flex-nowrap profile_premium_card_div">
                {!isEmpty(allProducts) &&
                  allProducts.tiers.map((product, index) => {
                    return (
                      <Product
                        key={index}
                        index={index}
                        product={product}
                        // handleClick={handleClick}
                        // activePlan={activePlan}
                      />
                    );
                  })}
              </div>

              {/* </div> */}
            </div>
          </>
          <div className="text-center">
            <button
              className="make-payment make-payment--profile"
              onClick={payNowHandler}
            >
              {/* Lets go <span className="make-payment-span-text">Premium!</span> */}
              Upgrade to Premium!
            </button>
          </div>
          {renderTakeCardDetails()}
          {/* {productSelected
            ? renderTakeCardDetails()
            : // <PaymentForm
              //   productSelected={productSelected}
              //   customerId={customerId}
              //   productPriceId={priceId}
              // />
              null} */}
        </div>
      </>

      {/* <StripeSampleFooter /> */}
    </div>
  );
};

export default withRouter(Prices);
