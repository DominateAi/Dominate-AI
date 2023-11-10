import React from "react";
import ActivityContentEmailComposeModalSubjectInputField from "../../activity/ActivityContentEmailComposeModalSubjectInputField";
import { useState, useEffect } from "react";
import isEmpty from "../../../../store/validations/is-empty";

function CreateTemplateSubject({ errors }) {
  const [subject, setSubject] = useState("");

  let subjectData = JSON.parse(
    localStorage.getItem("createTemplateMailSubject")
  );
  useEffect(() => {
    if (!isEmpty(subjectData)) {
      setSubject(subjectData);
    } else {
      setSubject("");
    }
  }, [subjectData]);

  const handleOnChange = (e) => {
    setSubject(e.target.value);
    localStorage.setItem(
      "createTemplateMailSubject",
      JSON.stringify(e.target.value)
    );
  };

  return (
    <div>
      <ActivityContentEmailComposeModalSubjectInputField
        name="activityTabEmailModalSubject"
        onChange={handleOnChange}
        value={subject}
        error={errors.activityTabEmailModalSubject}
        autoFocus={true}
      />
    </div>
  );
}

export default CreateTemplateSubject;
