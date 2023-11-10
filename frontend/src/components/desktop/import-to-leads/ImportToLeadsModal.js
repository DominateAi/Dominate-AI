import React, { useState, useEffect } from "react";

import Modal from "react-responsive-modal";
import "../common/CustomModalStyle.css";
import ImportToLeadModalOne from "./ImportToLeadModalOne";
import ImportToLeadsModalTwo from "./ImportToLeadsModalTwo";
import ImportToLeadsModalThree from "./ImportToLeadsModalThree";
import ImportToLeadsModalFour from "./ImportToLeadsModalFour";
import { connect } from "react-redux";
import isEmpty from "./../../../store/validations/is-empty";
import Alert from "react-s-alert";
import { importContactsToLead } from "./../../../store/actions/contactAction";
import { useSelector, useDispatch } from "react-redux";
import { validateImportToLead } from "./../../../store/validations/contactValidation/importToLeadValidation";
import store from "./../../../store/store";
import { SET_CONTACT_VALIDATION_ERROR } from "./../../../store/types";

export default function ImportToLeadsModal({ importButtonClassName }) {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    open: false,
    openTwo: false,
    openThree: false,
    openFour: false,
    selectedContacts: [],
  });

  const [assignedUser, setAssignedUser] = useState({});

  const [assignedAccount, setAssignedAccount] = useState({});

  const [selectedContacts, setSelectedContacts] = useState([]);

  const selectedAllContacts = useSelector(
    (state) => state.contact.selectedContacts
  );
  const selectedUser = useSelector((state) => state.contact.assignedUser);
  const selectedAccount = useSelector((state) => state.contact.assignedAccount);

  useEffect(() => {
    if (!isEmpty(selectedAllContacts)) {
      setSelectedContacts(selectedAllContacts);
    } else {
      setSelectedContacts([]);
    }
  }, [selectedAllContacts]);

  useEffect(() => {
    if (!isEmpty(selectedUser)) {
      console.log(selectedUser);
      setAssignedUser(selectedUser);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (!isEmpty(selectedAccount)) {
      console.log(selectedAccount);
      setAssignedAccount(selectedAccount);
    }
  }, [selectedAccount]);

  /*===============================
                 
        Model Open Handlers
  
  =================================*/

  const onOpenModal = () => {
    // const { selectedContacts } = this.state;
    if (!isEmpty(selectedContacts)) {
      setValues({
        ...values,
        open: true,
      });
    } else {
      Alert.success(`<h4>Please select contacts</h4>`, {
        position: "top-right",
        effect: "slide",
        beep: false,
        html: true,
        timeout: 5000,
        // offset: 100
      });
    }
  };

  const onOpenModalTwo = () => {
    setValues({
      ...values,
      openTwo: true,
    });
  };

  const onOpenModalThree = () => {
    const { errors, isValid } = validateImportToLead(selectedContacts);
    if (!isValid) {
      console.log(errors);
      store.dispatch({
        type: SET_CONTACT_VALIDATION_ERROR,
        payload: errors,
      });
    } else {
      setValues({
        ...values,
        openThree: true,
      });
    }
  };

  const onOpenModalFour = () => {
    // const { selectedContacts, assignedUser, assignedAccount } = this.state;
    console.log(selectedContacts);
    let finalArray = [];
    selectedContacts.forEach((element) => {
      finalArray.push({
        name: element.name,
        email: element.email,
        city: element.city,
        phone: element.additionalInfo.phoneCode + element.phone,
        phoneCode: element.additionalInfo.phoneCode,
        designation: element.designation,
        companyName: element.companyName,
        additionalInfo: "nodejs",
      });
    });

    // setTimeout(() => {
    //   this.props.importContactsToLead(finalArray, assignedUser.value);
    // }, 5000);

    if (isEmpty(assignedAccount.value)) {
      alert("Please select account");
    } else {
      dispatch(
        importContactsToLead(
          finalArray,
          assignedUser.value,
          assignedAccount.value,
          callBackImportContatcToLeads
        )
      );
    }

    // this.setState({
    //   openFour: true,
    // });
  };

  const callBackImportContatcToLeads = (status) => {
    if (status === 200) {
      onCloseModal();
    }
  };

  /*=============================

            Modal Close Handlers

     ===========================*/

  const onCloseModal = () => {
    setValues({
      ...values,
      open: false,
      openTwo: false,
      openThree: false,
      openFour: false,
    });
  };

  /*========= render Modal One =============*/
  const renderModalOne = () => {
    return (
      <Modal
        open={values.open}
        onClose={onCloseModal}
        closeOnEsc={true}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay",
          modal: "customModal customModal--import-to-leads-modal",
          closeButton: "customCloseButton",
        }}
      >
        <span className="closeIconInModal" onClick={onCloseModal} />
        <ImportToLeadModalOne />
        {renderModalTwo()}
      </Modal>
    );
  };

  /*============= render Modal Two ========= */
  const renderModalTwo = () => {
    return (
      <>
        <div className="row justify-content-center">
          <button
            className="leads-title-block-btn-red-bg leads-title-block-btn-red-bg--verify-fields mt-45"
            onClick={onOpenModalTwo}
          >
            Next
          </button>
        </div>
        <Modal
          open={values.openTwo}
          onClose={onCloseModal}
          closeOnEsc={true}
          closeOnOverlayClick={false}
          //center
          classNames={{
            overlay: "customOverlay",
            modal:
              "customModal customModal--import-to-leads-modal customModal--import-to-leads-modal--two",
            closeButton: "customCloseButton",
          }}
        >
          <span className="closeIconInModal" onClick={onCloseModal} />
          <ImportToLeadsModalTwo />
          {renderModalThree()}
          <h5 className="font-16-medium pt-70 pl-140 import-leads-modal-three-bottom-text">
            *Additional fields will be populated as it is
          </h5>
        </Modal>
      </>
    );
  };

  /*============= render Modal Three ========= */
  const renderModalThree = () => {
    return (
      <>
        <div className="row justify-content-center">
          <button
            className="leads-title-block-btn-red-bg leads-title-block-btn-red-bg--verify-fields mt-45"
            onClick={onOpenModalThree}
          >
            Next
          </button>
        </div>
        <Modal
          open={values.openThree}
          onClose={onCloseModal}
          closeOnEsc={true}
          closeOnOverlayClick={false}
          center
          classNames={{
            overlay: "customOverlay",
            modal: "customModal customModal--import-to-leads-modal",
            closeButton: "customCloseButton",
          }}
        >
          <span className="closeIconInModal" onClick={onCloseModal} />
          <ImportToLeadsModalThree />
          {renderModalFour()}
          <h5 className="font-16-medium pt-70 import-leads-modal-three-bottom-text">
            *Level and Status will be❄️️and
            <b>
              <i> New </i>
            </b>
            by Default
          </h5>
        </Modal>
      </>
    );
  };

  /*============= render Modal four ========= */
  const renderModalFour = () => {
    return (
      <>
        <div className="row justify-content-center">
          <button
            className="leads-title-block-btn-red-bg leads-title-block-btn-red-bg--verify-fields mt-45"
            onClick={onOpenModalFour}
          >
            Finish Importing
          </button>
        </div>
        <Modal
          open={values.openFour}
          onClose={onCloseModal}
          closeOnEsc={true}
          closeOnOverlayClick={false}
          center
          classNames={{
            overlay: "customOverlay",
            modal: "customModal customModal--import-to-leads-modal",
            closeButton: "customCloseButton",
          }}
        >
          <span className="closeIconInModal" onClick={onCloseModal} />
          <ImportToLeadsModalFour />
          <div className="row justify-content-center pt-25">
            <button
              className="leads-title-block-btn-red-bg leads-title-block-btn-red-bg--verify-fields"
              onClick={onCloseModal}
            >
              Finish
            </button>
          </div>
        </Modal>
      </>
    );
  };

  return (
    <div>
      <div>
        <button className={importButtonClassName} onClick={onOpenModal}>
          Import to Leads
        </button>
        {renderModalOne()}
      </div>
    </div>
  );
}
