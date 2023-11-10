import React, { useState } from "react";
import GoogleSocialLogin from "react-google-login";

function GoogleSocial({ responseGoogle, signup }) {
  const [googleResponse, setgoogleResponse] = useState({});

  return (
    <div>
      <GoogleSocialLogin
        clientId="933120268799-42l05b21pda7cgvinbgdq2evi2brifh2.apps.googleusercontent.com"
        // buttonText="Login"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy={"single_host_origin"}
        icon={false}
        className="google-social-login-div"
      >
        <div className="row mx-0 align-items-center">
          <div className="google-social-google-icon-div">
            <img
              src={require("../../../assets/img/auth/google-icon.svg")}
              alt=""
              className="google-icon-img"
            />
            {/*<i className="fa fa-google" aria-hidden="true"></i>*/}
          </div>
          <span className="google-social-google-text">
            {" "}
            {signup === true ? "Sign Up" : "Sign In"} with Google
          </span>
        </div>
      </GoogleSocialLogin>
    </div>
  );
}

export default GoogleSocial;
