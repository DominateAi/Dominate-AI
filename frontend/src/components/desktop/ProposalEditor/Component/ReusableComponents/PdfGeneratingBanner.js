import React from 'react';
import Loader from 'react-loader-spinner';

const PdfGeneratingBanner = () => {
    return (
        <div className="pdf_generating_banner_main_container">
            <div className="pdf_generating_banner_container">
                <div className="pdf_generating_banner_loader">
                    <Loader
                        type="Triangle"
                        color="#502EFF"
                        height={100}
                        width={100}
                        timeout={10000} //3 secs
                    />
                </div>
                <div className="pdf_generating_banner_text">Please wait "PDF" is being generated . . . </div>
            </div>
        </div>
    )
}

export default PdfGeneratingBanner;
