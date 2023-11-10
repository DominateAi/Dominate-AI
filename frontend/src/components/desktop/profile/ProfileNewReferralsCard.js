import React from "react";
import ProfileNewReferralsInfoModal from "./ProfileNewReferralsInfoModal";
import ProfileNewReferralsGenerateLinkCodeModal from "./ProfileNewReferralsGenerateLinkCodeModal";

export default function ProfileNewReferralsCard({ handleGenerateCodeAndLink }) {
  return (
    <div className="referral-card">
      <h3 className="font-24-semibold mb-30">Like Dominate?</h3>
      <h4 className="font-36-bold">
        Start Referring it to your friends &amp; companies
      </h4>
      <div className="referral-card__img-block">
        <img
          src="/img/desktop-dark-ui/illustrations/referrals-card-illustration.svg"
          alt=""
        />
      </div>
      <p className="font-24-semibold mb-38">To get started</p>
      <ProfileNewReferralsGenerateLinkCodeModal
        handleGenerateCodeAndLink={handleGenerateCodeAndLink}
      />
      <br />
      <ProfileNewReferralsInfoModal />
    </div>
  );
}
