import {
  SET_CONTACTS_WITH_EMAILS,
  SET_ELIST_CONTACTS,
  SET_ALL_ELISTS,
  SET_SINGLE_ELIST_DATA,
  SET_ALL_REGITERED_AND_NOT_MAILS,
  SET_ALL_CAMPAIGNS,
  SET_SINGLE_CAMPAIGN_ALL_DATA,
  SET_CAMPAIGN_EMAIL_TEMPLATES,
} from "./../types";

const initialState = {
  allElists: [],
  elistContactsWithEmail: [],
  contactsOfElist: [],
  singleElistData: {},
  getAllAddedMails: [],
  allCampaigns: [],
  singleCampaignData: {},
  allEmailTemplates: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_ALL_ELISTS:
      return {
        ...state,
        allElists: action.payload,
      };
    case SET_CONTACTS_WITH_EMAILS:
      return {
        ...state,
        elistContactsWithEmail: action.payload,
      };
    case SET_ELIST_CONTACTS:
      return {
        ...state,
        contactsOfElist: action.payload,
      };
    case SET_SINGLE_ELIST_DATA:
      return {
        ...state,
        singleElistData: action.payload,
      };
    case SET_ALL_REGITERED_AND_NOT_MAILS:
      return {
        ...state,
        getAllAddedMails: action.payload,
      };
    case SET_ALL_CAMPAIGNS:
      return {
        ...state,
        allCampaigns: action.payload,
      };
    case SET_SINGLE_CAMPAIGN_ALL_DATA:
      return {
        ...state,
        singleCampaignData: action.payload,
      };
    case SET_CAMPAIGN_EMAIL_TEMPLATES:
      return {
        ...state,
        allEmailTemplates: action.payload,
      };
    default:
      return state;
  }
}
