import React, { Fragment, useState, useEffect } from "react";
import { Checkbox } from "@material-ui/core";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import ProfileNewReferralsCard from "./ProfileNewReferralsCard";
import ProfileNewReferralsInfoModal from "./ProfileNewReferralsInfoModal";
import isEmpty from "../../../store/validations/is-empty";
import { useDispatch, useSelector } from "react-redux";
import {
  getReferralCodeAllInfo,
  getAllReferrals,
  getReferralCount,
} from "./../../../store/actions/referralAction";
import Alert from "react-s-alert";
import dateFns from "date-fns";

// pagination
const totalRecordsInOnePage = 5;

export default function ProfileNewReferrals() {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    isReferred: false,
    currentPagination: 1,
    allReferrals: [
      // {
      //   isSignedUp: false,
      //   isPlanPurchased: false,
      // },
      // {
      //   isSignedUp: false,
      //   isPlanPurchased: false,
      // },
    ],
  });

  const [referralCodeInfo, setReferralCodeInfo] = useState([]);
  const [referralCount, setReferralCount] = useState();

  useEffect(() => {
    var userData = JSON.parse(localStorage.getItem("Data"));
    dispatch(getReferralCodeAllInfo({ query: { userId: userData.id } }));
    dispatch(getAllReferrals({ query: { fromID: userData.id } }));
    dispatch(getReferralCount(callBackGetCount));
  }, []);

  const callBackGetCount = (data) => {
    setReferralCount(data);
  };

  //REDUCERS

  const generatedReferralCode = useSelector(
    (state) => state.referral.generatedReferralCode
  );

  const allReferrals = useSelector((state) => state.referral.allReferrals);

  useEffect(() => {
    if (!isEmpty(generatedReferralCode)) {
      setValues({
        ...values,
        isReferred: true,
      });
      setReferralCodeInfo(generatedReferralCode);
    } else {
      setValues({
        ...values,
        isReferred: false,
      });
      setReferralCodeInfo([]);
    }
  }, [generatedReferralCode]);

  useEffect(() => {
    if (!isEmpty(allReferrals)) {
      // console.log(allReferrals);
      let finalArray = [];
      allReferrals.forEach((referral) => {
        if (referral.paidOn !== undefined) {
          finalArray.push({
            isPlanPurchased: true,
            isSignedUp: true,
            ...referral,
          });
        } else if (referral.paidOn == undefined) {
          finalArray.push({
            isPlanPurchased: false,
            isSignedUp: true,
            ...referral,
          });
        }
      });
      setValues({
        ...values,
        allReferrals: finalArray,
      });
    } else {
    }
  }, [allReferrals]);

  const handleGenerateCodeAndLink = () => {
    dispatch(getReferralCodeAllInfo({ query: {} }));
    // setValues({
    //   ...values,
    //   isReferred: true,
    // });
  };

  // pagination
  const onChangePagination = (page) => {
    setValues({
      ...values,
      currentPagination: page,
    });
  };

  const handleChangeRowSignUpCheckbox = (index) => (e) => {
    const newObj = values.allReferrals;
    newObj[index].isSignedUp = e.target.checked;
    setValues({
      ...values,
      allReferrals: newObj,
    });
  };

  const handleChangeRowPlanCheckbox = (index) => (e) => {
    const newObj = values.allReferrals;
    newObj[index].isPlanPurchased = e.target.checked;

    setValues({
      ...values,
      allReferrals: newObj,
    });
  };

  const renderContentTable = () => {
    return (
      <>
        <h3 className="font-24-semibold">Your Referral History</h3>
        <div className="task-list-table-container task-list-table-container--profile">
          <div className="task-list-table">
            <table className="table task-list-table-title mb-0">
              <thead>
                <tr>
                  <th>name</th>
                  <th>email address</th>
                  <th>workspace</th>
                  <th>signed up on</th>
                  <th>refeeral status</th>
                </tr>
              </thead>
            </table>
          </div>

          {!isEmpty(values.allReferrals) ? (
            <div className="task-list-view-container">
              <table className="table-with-border-row task-list-table">
                <tbody>
                  {values.allReferrals.map((data, index) => (
                    <Fragment key={index}>
                      <tr className="table-with-border-row__content-row">
                        <td>
                          <img
                            src="/img/desktop-dark-ui/dummy/dummy-img-person.png"
                            alt=""
                          />
                          {data.userData[0].name}
                        </td>
                        <td> {data.userData[0].email}</td>
                        <td>{data.toWorkspaceID}</td>
                        <td>{dateFns.format(data.createdAt, "Do MMM YYYY")}</td>
                        <td>
                          <Checkbox
                            checked={data.isSignedUp}
                            onChange={handleChangeRowSignUpCheckbox(index)}
                          />
                          <span className="mr-60 pl-10">Signed Up</span>
                          <Checkbox
                            checked={data.isPlanPurchased}
                            onChange={handleChangeRowPlanCheckbox(index)}
                          />{" "}
                          <span className="pl-10"> Plan Purchased</span>
                        </td>
                      </tr>
                      <tr className="table-with-border-row__space-row">
                        <td></td>
                      </tr>
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="font-24-semibold color-white-79 text-center">
              No Referral Found
            </p>
          )}
        </div>
        {!isEmpty(values.allReferrals) && (
          <div className="add-lead-pagination add-lead-pagination--tasklist">
            <Pagination
              onChange={onChangePagination}
              current={values.currentPagination}
              defaultPageSize={totalRecordsInOnePage}
              total={!isEmpty(referralCount) && referralCount.count}
              showTitle={false}
            />
          </div>
        )}
      </>
    );
  };

  const handleOnClickCopyLink = () => {
    const copyLink = document.getElementById("copyLink");
    copyLink.select();
    copyLink.setSelectionRange(0, 99999);

    navigator.clipboard.writeText(copyLink.value);
    Alert.success("<h4>Link copied</h4>", {
      position: "top-right",
      effect: "slide",
      beep: false,
      html: true,
      timeout: 5000,
      // offset: 100
    });
  };

  const handleOnClickCopyCode = () => {
    const copyCode = document.getElementById("copyCode");
    copyCode.select();
    copyCode.setSelectionRange(0, 99999);

    navigator.clipboard.writeText(copyCode.value);
    Alert.success("<h4>Code copied</h4>", {
      position: "top-right",
      effect: "slide",
      beep: false,
      html: true,
      timeout: 5000,
      // offset: 100
    });
  };

  const renderContent = () => {
    return (
      <>
        <div className="row referral-content-row-1 mb-25">
          <div className="col-6">
            <h3 className="font-24-semibold">Invite Friends and Companies</h3>
            <p className="font-18-semibold referrals-content-text-1">
              and get a{" "}
              <span className="referrals-content-text-1__blue">
                Lorem Ipsum
              </span>{" "}
              free when they sign up or purchase a plan{" "}
            </p>
          </div>
          <div className="col-6 text-right">
            <ProfileNewReferralsInfoModal />
            <div className="d-flex align-items-center justify-content-end">
              <p className="profile-new-text-div-aside-tabs__text1 profile-new-text-div-aside-tabs__text1--signUp">
                <img
                  src="/img/desktop-dark-ui/icons/referral-sign-up-credit-icon.svg"
                  alt=""
                />
                For succesful Sign up
                <span> 25 Credits </span>
              </p>
              <p className="profile-new-text-div-aside-tabs__text1 profile-new-text-div-aside-tabs__text1--plan">
                <img
                  src="/img/desktop-dark-ui/icons/referral-plan-credit-icon.svg"
                  alt=""
                />
                When Plan Purchased
                <span> 50 Credits </span>
              </p>
            </div>
          </div>
        </div>
        <div className="referral-link-card">
          <p className="font-36-bold text-center">
            {!isEmpty(referralCount) && referralCount.count}
          </p>
          <p className="font-13-semibold color-white-79 text-center">
            Referrals succesfully completed
          </p>
          <hr className="referral-link-card__hr" />
          <div className="d-flex">
            <div className="col-6 referral-link-card__row2Colm1">
              <h4 className="font-14-semibold referral-link-card__text-1">
                Referral link
              </h4>
              <div className="d-flex">
                <input
                  className="referral-link-input-field"
                  type="text"
                  value={!isEmpty(referralCodeInfo) && referralCodeInfo[0].URL}
                  id="copyLink"
                  readOnly
                />
                <button
                  className="referral-card__blue-btn"
                  onClick={handleOnClickCopyLink}
                >
                  Copy Link
                </button>
              </div>
            </div>
            <div className="col-6 referral-link-card__row2Colm2">
              <h4 className="font-14-semibold referral-link-card__text-1">
                Referral code
              </h4>
              <div className="d-flex">
                <input
                  className="referral-link-input-field"
                  type="text"
                  value={
                    !isEmpty(referralCodeInfo) &&
                    referralCodeInfo[0].referralCode
                  }
                  id="copyCode"
                  readOnly
                />
                <button
                  className="referral-card__blue-btn"
                  onClick={handleOnClickCopyCode}
                >
                  Copy Code
                </button>
              </div>
            </div>
          </div>
        </div>
        <div>{renderContentTable()}</div>
      </>
    );
  };

  return (
    <>
      {!values.isReferred ? (
        <ProfileNewReferralsCard
          handleGenerateCodeAndLink={handleGenerateCodeAndLink}
        />
      ) : (
        renderContent()
      )}
    </>
  );
}
