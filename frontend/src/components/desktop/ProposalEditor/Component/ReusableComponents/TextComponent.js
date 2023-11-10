import React from "react";
import CKEditor from "ckeditor4-react";

const TextComponent = (props) => {
  window.CKEDITOR_BASEPATH = "../node_modules/ckeditor/";
  return (
    <div className="text_component_main_container">
      <CKEditor
        onBeforeLoad={(CKEDITOR) => (
          (CKEDITOR.disableAutoInline = true),
          (CKEDITOR.removePlugins = "cloudservices")
        )}
        data={props.data_text}
        type="inline"
        onChange={props.onChange}
        readOnly={props.noEditMode}
      />
    </div>
  );
};

export default TextComponent;
