import React, { Fragment, useState } from "react";
import Modal from "react-responsive-modal";

export default function ProfileNewReferralsNotificationModal() {
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
            <h1 className="font-24-semibold">Congratulations</h1>

            <hr className="referral-link-card__hr" />

            <div className="referrals-notification-block">
              <div className="referrals-notification-block__img-block">
                <img
                  src="/img/desktop-dark-ui/illustrations/referrals-congratulations.png"
                  alt=""
                />
              </div>
              <p className="font-24-semibold text-center">
                Username has joined the platform using your
                <br /> referral code!
              </p>
            </div>
          </div>
        </Fragment>
      </Modal>
    </>
  );
}
