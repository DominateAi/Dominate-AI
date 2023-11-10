import React from 'react';
const CompanyLogoComponent = ( props ) => {
    let logo = "", token = "";
    if( localStorage.getItem('oraganiationData') && localStorage.getItem('Data')){
        if( JSON.parse( localStorage.getItem('oraganiationData') ).logo && JSON.parse( localStorage.getItem('Data') ).token ){
            token = JSON.parse( localStorage.getItem('Data') ).token;
            logo = JSON.parse( localStorage.getItem('oraganiationData') ).logo + "&token="+token;
        }
    }
    return (
        <div className="company_logo_component_main_container"> 
            <img src={ logo } style={{ height:"100%", width:"100%" }} />
        </div>
    )
}

export default CompanyLogoComponent
