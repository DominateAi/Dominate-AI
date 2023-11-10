import React, { Fragment, useState } from "react";
import Modal from "react-responsive-modal";

export default function ProfileNewReferralsInfoModal() {
  const [values, setValues] = useState({
    open: false,
  });

  const onOpenModal = () => {
    setValues({
      open: true,
    });
  };

  const onCloseModal = () => {
    setValues({
      open: false,
    });
  };

  return (
    <>
      <button className="referral-card__btn-1" onClick={onOpenModal}>
        <span className="font-18-regular referral-card__text-1">
          How does referral work?
        </span>
      </button>

      <Modal
        open={values.open}
        onClose={onCloseModal}
        closeOnEsc={true}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay",
          modal: "customModal customModal--referrals",
          closeButton: "customCloseButton",
        }}
      >
        <span className="closeIconInModal" onClick={onCloseModal} />
        <Fragment>
          <div className="referrals-modal-content add-lead-modal-container container-fluid pr-0 lead_page_component">
            <h1 className="font-30-bold">How does Referral Work?</h1>

            <hr className="referral-link-card__hr" />

            <div className="referral-modal-content__blocks-main">
              <img
                src="/img/desktop-dark-ui/icons/dashed-vertical-line-img.svg"
                alt=""
              />
              <p className="font-24-semibold">1. Refer other firms</p>
              <p className="font-24-semibold">
                2. They Join and create a workspace
              </p>
              <p className="font-24-semibold">3. Get benefits for signups</p>
              <p className="font-24-semibold">
                4. Get commissions if they purchase
              </p>
            </div>
          </div>
        </Fragment>
      </Modal>
    </>
  );
}
