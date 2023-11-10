import React, { useEffect, useState } from "react";
import Modal from "react-responsive-modal";
import { useSelector } from "react-redux";
import isEmpty from "./../../../../../store/validations/is-empty";

function PreviewImportLeads({ previewImport, importHandler, onCloseHandler }) {
  const [previewLeads, setPreviewLeads] = useState([]);

  const jsonLeads = useSelector(
    (state) => state.importLeads.import_lead.json_data
  );

  useEffect(() => {
    if (!isEmpty(jsonLeads)) {
      setPreviewLeads(jsonLeads);
    }
  }, [jsonLeads]);

  return (
    <Modal
      open={previewImport}
      onClose={onCloseHandler}
      closeOnEsc={true}
      closeOnOverlayClick={false}
      center
      classNames={{
        overlay: "customOverlay",
        modal: "customModal customModal--prview-import-leads",
        closeButton: "customCloseButton",
      }}
    >
      <span className="closeIconInModal" onClick={onCloseHandler} />
      <div className="import-leads-modal-content model_three_container">
        <h1 className="font-30-bold modal_headline">Import Leads</h1>
        <p>Here is the leads data we found in the file</p>
        {/* preview_leads_container */}
        <div className=" existing_leads_container">
          <table className="existing_leads_table table">
            <thead>
              <tr>
                <th scope="col">NO</th>
                <th scope="col">Lead name</th>
                <th scope="col">email address</th>
                <th scope="col">status</th>
              </tr>
            </thead>
            <tbody>
              {!isEmpty(previewLeads) &&
                previewLeads.map((lead, index) => {
                  return (
                    <tr key={index}>
                      <th scope="row">{index + 1}</th>
                      <td>{!isEmpty(lead.name) && lead.name}</td>
                      <td>{!isEmpty(lead.email) && lead.email}</td>
                      <td>{!isEmpty(lead.status) && lead.status}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <button onClick={importHandler} className="button_css">
          Finish
        </button>
      </div>
    </Modal>
  );
}

export default PreviewImportLeads;
