import React, { useState } from "react";
import VaultDeleteConfirmation from "../vault/VaultDeleteConfirmation";
import { deleteAccount } from "./../../../store/actions/accountsAction";
import { useDispatch } from "react-redux";

export default function AccountsDeletePopup({ cardData }) {
  const dispatch = useDispatch();
  const [confirmDeleteModel, setConfirmDeleteModel] = useState(false);
  const cardDataId = cardData;

  const onCloseHandler = (e) => {
    setConfirmDeleteModel(false);
  };

  const onOpenHandler = (e) => {
    setConfirmDeleteModel(true);
  };

  const callbackDelete = (status) => {
    if (status === 200) {
      setConfirmDeleteModel(false);
    }
  };
  const onYesHandler = (e) => {
    dispatch(deleteAccount(cardDataId, callbackDelete));
  };
  return (
    <div>
      {console.log(cardDataId)}
      <VaultDeleteConfirmation
        confirmDeleteModel={confirmDeleteModel}
        onCloseHandler={onCloseHandler}
        openModel={onOpenHandler}
        yesHandler={onYesHandler}
        customText={"Deactivate"}
        buttonClassName={"rc-button-edit-account"}
      />
    </div>
  );
}
