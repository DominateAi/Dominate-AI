import {
  SET_GENERATED_REFERRAL_CODE,
  SET_ALL_REFERRALS_DATA,
  SET_REFERRAL_DATA_OF_LOGEDIN_USER,
} from "./../types";

const initialState = {
  generatedReferralCode: [],
  allReferrals: [],
  referralDataOfLogedInUser: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_GENERATED_REFERRAL_CODE:
      return {
        ...state,
        generatedReferralCode: action.payload,
      };
    case SET_ALL_REFERRALS_DATA:
      return {
        ...state,
        allReferrals: action.payload,
      };
    case SET_REFERRAL_DATA_OF_LOGEDIN_USER:
      return {
        ...state,
        referralDataOfLogedInUser: action.payload,
      };

    default:
      return state;
  }
}
