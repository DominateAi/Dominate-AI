export let renderName = function (params) {
  return `<div class="ag-grid-table__textCircleOuterBlock">
              <div class="ag-grid-table__textCircleBlock">
                <span>${params.value.charAt(0)}</span>
              </div> 
              <span class="ag-grid-table__overflowText">${params.value}</span>
            </div>`;
};

export let statusRenderer = function (params) {
  if (params.value) {
    return `<span class="ag-grid-email-data__valid"><i class="fa fa-check"></i> Successfully Verified</span>`;
  } else {
    return `<span class="ag-grid-email-data__invalid"><i class="fa fa-times"></i> Not Valid</span> 
              <span class="ag-grid-email-data__invalid-delete"><i class="fa fa-trash ag-grid-fa-times"></i></span>`;
  }
};

export let renderTitle = function (params) {
  return `<span class="ag-grid-table__purpleText">${params.value}</span>`;
};

export let linkRenderer = function (params) {
  return `<a href=${params.value} rel="noopener noreferrer" target="_blank">
              <span class="ag-grid-table__linkText">${params.value}</span>
            </a>`;
};

export let editRenderer = function (params) {
  return `<span><i class="fa fa-pencil ag-grid-fa-times"></i></span>`;
};

export let deleteRenderer = function (params) {
  return `<span><i class="fa fa-trash ag-grid-fa-times"></i></span>`;
};
