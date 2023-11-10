import React, { Fragment, useState, useEffect } from "react";
import Prices from "./Prices";
import Account from "./Account";
import isEmpty from "../../../store/validations/is-empty";
import dateFns from "date-fns";
import AlreadyCanceledSubscription from "./../popups/AlreadyCanceledSubscription";
import { useDispatch, useSelector } from "react-redux";
import { getAllLeadsCount } from "./../../../store/actions/leadAction";
import { getAllEmployees } from "./../../../store/actions/employeeAction";

const PaymentMain = () => {
  const dispatch = useDispatch();
  const [freeTrialScreen, setFreeTrial] = useState("");

  const [alreadySubscribedUser, setPaidUser] = useState("");

  const [canceledSubscriptionPopup, setCanceledSubscriptionPopup] =
    useState(false);

  const [leadsCount, setLeadsCount] = useState("");

  const [memebreCount, setMemebreCount] = useState("");

  //selectors from state
  const allLeadsCount = useSelector((state) => state.leads.allLeadCount);

  const allMembers = useSelector((state) => state.employee.allEmployees);

  useEffect(() => {
    if (!isEmpty(allLeadsCount)) {
      setLeadsCount(allLeadsCount);
    }
  }, [allLeadsCount]);

  useEffect(() => {
    if (!isEmpty(allMembers)) {
      // console.log(allMembers);
      setMemebreCount(allMembers.length);
    }
  }, [allMembers]);

  useEffect(() => {
    let organizationData = JSON.parse(localStorage.getItem("oraganiationData"));
    if (organizationData.planStatus === "CANCELLED") {
      setCanceledSubscriptionPopup(true);
    }
    // console.log(organizationData);
    if (!isEmpty(organizationData) && organizationData.planStatus === "TRIAL") {
      setFreeTrial(true);
    } else if (
      !isEmpty(organizationData) &&
      organizationData.planStatus === "PAID"
    ) {
      setPaidUser(true);
    } else {
      // setPaidUser(true);
    }
    dispatch(getAllLeadsCount());
    dispatch(getAllEmployees());
  }, []);

  const firstApperanceClick = (e) => {
    setFreeTrial(false);
  };

  const onCloseHandler = () => {
    setCanceledSubscriptionPopup(false);
  };

  if (freeTrialScreen === true) {
    let organizationData = JSON.parse(localStorage.getItem("oraganiationData"));
    return (
      <Fragment>
        <div className="free_trail_top_description text-center">
          <p>Hi there!</p>
          <h3> Want to invite your team ?</h3>
          <h2>You can by upgrading your plan!!</h2>
        </div>
        <div className="free_trail_image_section">
          <div className="leads_employees_count text-center">
            <img
              src={require("./../../../assets/img/profile/freetrial.svg")}
              alt=""
              className="right_img"
            />
            <p>Leads on board</p>
            <span> {!isEmpty(leadsCount) && leadsCount} </span>
          </div>
          <div className=" text-center">
            <img
              src={require("./../../../assets/img/profile/Asset _1free trial.svg")}
              alt=""
              className="middle_img"
            />
            <div className="free_trail_middle_section">
              <p>
                Pay now to collaborate and track sales of your sales team on
                Dominate
              </p>
              <button onClick={firstApperanceClick}>Go to Plans</button>
            </div>
          </div>
          <div className="leads_employees_count text-center">
            <img
              src={require("./../../../assets/img/profile/Group-Right.png")}
              alt=""
              className="right_img"
            />
            <p>Your team size</p>
            <span>{!isEmpty(memebreCount) && memebreCount}</span>
          </div>
        </div>
      </Fragment>
    );
  } else {
    if (alreadySubscribedUser) {
      return <Account />;
    } else {
      return (
        <>
          <AlreadyCanceledSubscription
            canceledSubscriptionPopup={canceledSubscriptionPopup}
            onCloseHandler={onCloseHandler}
          />

          <Prices />
        </>
      );
    }
  }
};

export default PaymentMain;
