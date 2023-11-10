import React, { Fragment, useState } from "react";
import Modal from "react-responsive-modal";
import { useDispatch } from "react-redux";
import { createReferralCode } from "./../../../store/actions/referralAction";
import isEmpty from "../../../store/validations/is-empty";

export default function ProfileNewReferralsGenerateLinkCodeModal({
  handleGenerateCodeAndLink,
}) {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    open: false,
  });
  const [referralCodeInfo, setCodeInfo] = useState([]);

  const onOpenModal = () => {
    var userData = JSON.parse(localStorage.getItem("Data"));
    const formData = {
      userId: userData.id,
    };
    dispatch(createReferralCode(formData, callBackCreateReferral));
  };

  const callBackCreateReferral = (status, data) => {
    if (status === 200) {
      setValues({
        open: true,
      });
      if (!isEmpty(data)) {
        setCodeInfo(data);
      }
    }
  };

  const onCloseModal = () => {
    setValues({
      open: false,
    });
  };

  const handleOnClickCopyLink = () => {
    const copyLink = document.getElementById("copyLink");
    copyLink.select();
    copyLink.setSelectionRange(0, 99999);

    navigator.clipboard.writeText(copyLink.value);
  };

  const handleOnClickCopyCode = () => {
    const copyCode = document.getElementById("copyCode");
    copyCode.select();
    copyCode.setSelectionRange(0, 99999);

    navigator.clipboard.writeText(copyCode.value);
  };

  console.log(referralCodeInfo);

  return (
    <>
      <button className="referral-card__blue-btn" onClick={onOpenModal}>
        Generate Code &amp; Link
      </button>
      <Modal
        open={values.open}
        onClose={onCloseModal}
        closeOnEsc={true}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay",
          modal:
            "customModal customModal--referrals customModal--referrals--notification",
          closeButton: "customCloseButton",
        }}
      >
        <span className="closeIconInModal" onClick={onCloseModal} />
        <Fragment>
          <div className="referrals-modal-content-notification add-lead-modal-container container-fluid pr-0 lead_page_component">
            <h1 className="font-24-semibold">Generate new Code &amp; Link</h1>

            <hr className="referral-link-card__hr" />

            <div className="referrals-modal-content-link-code-block">
              <h2 className="font-24-semibold mb-18">
                Here are the new details
              </h2>
              <div className="d-flex align-items-start referrals-modal-content-link-code-block__row">
                <div className="referrals-modal-content-link-code-block__row__colm1">
                  <h3 className="font-18-regular mb-42">Code</h3>
                  <input
                    className="referral-link-input-field"
                    type="text"
                    value={
                      !isEmpty(referralCodeInfo) &&
                      referralCodeInfo.referralCode
                    }
                    id="copyCode"
                    readOnly
                  />
                  <div className="text-right">
                    <button
                      className="referral-card__blue-btn"
                      onClick={handleOnClickCopyCode}
                    >
                      Copy Code
                    </button>
                  </div>
                </div>

                <div className="referrals-modal-content-link-code-block__row__colm2">
                  <h3 className="font-18-regular mb-42">Link</h3>
                  <input
                    className="referral-link-input-field"
                    type="text"
                    value={!isEmpty(referralCodeInfo) && referralCodeInfo.URL}
                    id="copyLink"
                    readOnly
                  />
                  <div className="text-right">
                    <button
                      className="referral-card__blue-btn"
                      onClick={handleOnClickCopyLink}
                    >
                      Copy Link
                    </button>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <button
                  className="referral-card__blue-btn"
                  onClick={handleGenerateCodeAndLink}
                >
                  Ok, Got it
                </button>
              </div>
            </div>
          </div>
        </Fragment>
      </Modal>
    </>
  );
}
