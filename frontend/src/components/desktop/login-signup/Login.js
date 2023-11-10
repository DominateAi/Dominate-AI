import React, { useState, useEffect, Fragment } from "react";
import { Tabs, Tab, TabPanel, TabList } from "react-web-tabs";
import LoginFormFields from "./LoginFormFields";
import SignUpFormFilds from "./SignUpFormFilds";
import isEmpty from "./../../../store/validations/is-empty";
import SignUpFormFildsMobile from "../../mobile-new/auth/SignUpFormFilds";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { useSelector, useDispatch } from "react-redux";
import cookie from "react-cookies";
import WorkSpaceLogin from "./WorkSpaceLogin";
import {
  checkIfUserExist,
  getAllRolesPublic,
} from "./../../../store/actions/authAction";

function Login() {
  const dispatch = useDispatch();
  const [displayLogin, setdisplayLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [defaultTab, setDefaultTab] = useState("one");

  const loader = useSelector((state) => state.auth.loader);

  useEffect(() => {
    setLoading(loader);
  }, [loader]);

  // useEffect(() => {
  //   async function fetchMyAPI() {
  //     let response = await dispatch(checkIfUserExist());
  //     let rolesResponse = await dispatch(getAllRolesPublic());
  //   }

  //   fetchMyAPI();
  // }, []);

  /*=================================
     Dispaly signup and login toggler
  ===================================*/

  const displayloginandSignUpToggler = (e) => {
    if (
      (e.target.name === "one" && !displayLogin) ||
      (e.target.name === "two" && displayLogin)
    ) {
      setdisplayLogin(!displayLogin);
    }
  };
  /*===========================
    Render signup top content
  ============================*/

  const renderSignUpContent = () => {
    const content = (
      <Fragment>
        <div className="signup-content-div">
          <h3>Create Your workspace!</h3>
          <p>
            welcome to dominate, start off by creating a space that your team
            can remember. your team can then sign in and start collaborating
            with you.
          </p>
        </div>
      </Fragment>
    );
    return content;
  };

  const renderInvisibleSignUpContent = () => {
    return (
      <div className="signup-content-div invisible">
        <h3>Create Your workspace!</h3>
        <p>
          welcome to dominate, start off by creating a space that your team can
          remember. your team can then sign in and start collaborating with you.
        </p>
      </div>
    );
  };

  return (
    <Fragment>
      {loading === true && (
        <Loader
          type="Triangle"
          color="#502EFF"
          height={100}
          width={100}
          // timeout={2000} //3 secs
          className="dominate-loader"
        />
      )}

      <div className="container-fluid login-container">
        <div className="row">
          <div className="col-md-2" />
          <div className="col-md-8">
            <div className="dominate-login-logo">
              <a
                href="https://www.dominate.ai"
                target="_self"
                rel="noopener noreferrer"
              >
                <img
                  src="/img/desktop-dark-ui/logo/logo-color-white.svg"
                  alt="logo"
                />
              </a>
            </div>
            {/* {!displayLogin && this.renderSignUpContent()} */}
            {/* {displayLogin && this.renderInvisibleSignUpContent()} */}
            <div className="login-signup-tabs-container">
              <Tabs
                // defaultTab="one"
                defaultTab={`${defaultTab}`}
                onChange={(tabId) => {
                  window.scrollTo(0, 0);
                }}
              >
                <TabList>
                  <Tab
                    tabFor="one"
                    name="one"
                    onClick={displayloginandSignUpToggler}
                  >
                    Log In{" "}
                    {displayLogin && <div className="heading-divider"></div>}
                  </Tab>
                  <Tab
                    tabFor="two"
                    name="two"
                    onClick={displayloginandSignUpToggler}
                  >
                    Sign Up
                    {!displayLogin && <div className="heading-divider"></div>}
                  </Tab>
                </TabList>
                <TabPanel tabId="one">
                  {/* <LoginFormFields />  */}
                  <WorkSpaceLogin
                    setDefaultTab={setDefaultTab}
                    setdisplayLogin={setdisplayLogin}
                  />
                </TabPanel>
                <TabPanel tabId="two">
                  {/* desktop view */}
                  <div className="d-none d-md-block">
                    <SignUpFormFilds />
                  </div>
                  {/* mobile view */}
                  <div className="d-md-none">
                    <SignUpFormFildsMobile />
                  </div>
                </TabPanel>
              </Tabs>
            </div>
          </div>
          <div className="col-md-2" />
          <div className="col-12 p-0 text-center">
            <p className="copyright_text">
              © Copyrighted all rights reserved 2021
            </p>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default Login;
