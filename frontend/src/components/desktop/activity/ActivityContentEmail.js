import React, { useState, useEffect } from "react";
import ActivityContentEmailAllEmail from "./ActivityContentEmailAllEmail";
import ActivityContentEmailArchivedEmail from "./ActivityContentEmailArchivedEmail";
import ActivityContentEmailComposeModal from "./ActivityContentEmailComposeModal";
import isEmpty from "./../../../store/validations/is-empty";
import { useSelector } from "react-redux";

function ActivityContentEmail({ leadActivityData }) {
  const [values, setValues] = useState({
    isActiveTab1: true,
    isActiveTab2: false,
    allArchiveMails: [],
  });

  const allArchiveMails = useSelector((state) => state.leads.archiveEmails);

  useEffect(() => {
    if (!isEmpty(allArchiveMails)) {
      setValues({
        ...values,
        allArchiveMails: allArchiveMails,
      });
    }
  }, [allArchiveMails]);

  /*=====================================
        handlers
    ===================================== */

  const handleOnClickIsActiveTab1 = () => {
    setValues({
      ...values,
      isActiveTab1: true,
      isActiveTab2: false,
    });
  };

  const handleOnClickIsActiveTab2 = () => {
    setValues({
      ...values,
      isActiveTab1: false,
      isActiveTab2: true,
    });
  };

  return (
    <div className="mt-10">
      {/* title  */}
      <div className="justify-content-space-between mb-30">
        <div className="ac-email-title">
          <h5
            className={values.isActiveTab1 ? "font-21-bold" : "font-21-light"}
            onClick={handleOnClickIsActiveTab1}
          >
            All mails
          </h5>
          <span className="activity-text-border-right"></span>
          <h5
            className={values.isActiveTab2 ? "font-21-bold" : "font-21-light"}
            onClick={handleOnClickIsActiveTab2}
          >
            Deleted mails
          </h5>
        </div>
        <div>
          <ActivityContentEmailComposeModal
            leadActivityData={leadActivityData}
          />
        </div>
      </div>

      {values.isActiveTab1 ? (
        <ActivityContentEmailAllEmail leadActivityData={leadActivityData} />
      ) : (
        <ActivityContentEmailArchivedEmail
          leadActivityData={leadActivityData}
          allArchiveMails={values.allArchiveMails}
        />
      )}
    </div>
  );
}

export default ActivityContentEmail;
