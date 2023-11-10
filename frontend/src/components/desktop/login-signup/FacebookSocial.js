import React from "react";
import FacebookLogin from "react-facebook-login";

function FacebookSocial({ responseFacebook, signup }) {
  return (
    <div>
      <FacebookLogin
        appId="441373150306184"
        autoLoad={false}
        fields="name,email"
        // onClick={componentClicked}
        callback={responseFacebook}
        textButton={
          signup === true ? "Sign Up with Facebook" : "Sign In with Facebook"
        }
        icon={"fa-facebook-square"}
        cssClass="facebook-login-btn"
      />
    </div>
  );
}

export default FacebookSocial;
