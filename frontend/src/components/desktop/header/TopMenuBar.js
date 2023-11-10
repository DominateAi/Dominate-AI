import React, { useState, useEffect } from "react";
import Menus from "./Menus";
import { useSelector } from "react-redux";
import PermissionWarning from "./../popups/PermissionWarning";
import { SET_ERROR_CODE } from "./../../../store/types";
import store from "../../../store/store";

function TopMenuBar() {
  const [values, setValues] = useState({
    pageName: "",
    tooltipName: null,
  });

  const [permissionModel, setPermissionModel] = useState(false);

  //REDUCERS

  const pageTitle = useSelector((state) => state.auth.headingPageTitle);
  const userRole = useSelector((state) => state.auth.user.role.name);
  const activeWalkthroughPage = useSelector(
    (state) => state.auth.activeWalkthroughPage
  );
  const errorCode = useSelector((state) => state.errors.errorCode);

  useEffect(() => {
    setValues({
      ...values,
      pageName: pageTitle,
    });
  }, [pageTitle]);

  useEffect(() => {
    // alert(JSON.stringify(errorCode));
    if (errorCode === 405) {
      setPermissionModel(true);
    }
  }, [errorCode]);

  // handlers

  const handleOnMouseOver = (e) => {
    setValues({
      ...values,
      // pageName: e.target.name,
      tooltipName: e.target.name,
    });
  };

  const handleOnMouseLeave = (e) => {
    // const { pageName } = this.state;
    setValues({
      ...values,
      tooltipName: null,
      // pageName: !isEmpty(pageName) && pageName,
    });
  };

  const onCloseHandler = () => {
    store.dispatch({
      type: SET_ERROR_CODE,
      payload: "",
    });
    setPermissionModel(false);
  };

  return (
    <>
      {/* <PermissionWarning
        permissionWarning={permissionModel}
        onCloseHandler={onCloseHandler}
      /> */}
      <div className="menu-navbar">
        <ul className="dominate-menus-left" role="navabar">
          {/* {userRole === "Administrator" && (
            <Menus
              pageTitle="Command Centre"
              pageName={values.pageName}
              handleOnMouseOver={handleOnMouseOver}
              handleOnMouseLeave={handleOnMouseLeave}
              link={"/command-centre"}
              imgPath="/img/desktop-dark-ui/nav-icons/nav-cmd-white.svg"
              activeImgPath="/img/desktop-dark-ui/nav-icons/nav-cmd-blue.svg"
            />
          )} */}
          <Menus
            pageTitle="Dashboard"
            pageName={values.pageName}
            handleOnMouseOver={handleOnMouseOver}
            handleOnMouseLeave={handleOnMouseLeave}
            link={"/dashboard"}
            imgPath="/img/desktop-dark-ui/nav-icons/nav-dashboard-white.svg"
            activeImgPath="/img/desktop-dark-ui/nav-icons/nav-dashboard-blue.svg"
            extraClassName={
              activeWalkthroughPage === "dashboard-2"
                ? "new-walkthrough-menu-active"
                : ""
            }
          />
          <Menus
            pageTitle="Sales Centre"
            pageName={values.pageName}
            handleOnMouseOver={handleOnMouseOver}
            handleOnMouseLeave={handleOnMouseLeave}
            link={"/sales-centre#engage"}
            imgPath="/img/desktop-dark-ui/nav-icons/nav-sales-white.svg"
            activeImgPath="/img/desktop-dark-ui/nav-icons/nav-sales-blue.svg"
            extraClassName={
              activeWalkthroughPage === "dashboard-3"
                ? "new-walkthrough-menu-active"
                : ""
            }
          />
          <Menus
            pageTitle="Members"
            pageName={values.pageName}
            handleOnMouseOver={handleOnMouseOver}
            handleOnMouseLeave={handleOnMouseLeave}
            link={"/members-new"}
            imgPath="/img/desktop-dark-ui/nav-icons/nav-members-white.svg"
            activeImgPath="/img/desktop-dark-ui/nav-icons/nav-members-blue.svg"
          />
          {/* <Menus
            pageTitle="Reports"
            pageName={values.pageName}
            handleOnMouseOver={handleOnMouseOver}
            handleOnMouseLeave={handleOnMouseLeave}
            link={"/admin-reports"}
            imgPath="/img/desktop-dark-ui/nav-icons/nav-reports-white.svg"
            activeImgPath="/img/desktop-dark-ui/nav-icons/nav-reports-blue.svg"
            extraClassName={
              activeWalkthroughPage === "reports-1"
                ? "new-walkthrough-menu-active"
                : ""
            }
          /> */}
        </ul>

        {/* Right Menus */}

        <ul className="dominate-menus-right">
          <Menus
            pageTitle="Calendar"
            pageName={values.pageName}
            handleOnMouseOver={handleOnMouseOver}
            handleOnMouseLeave={handleOnMouseLeave}
            link={"/main-calender"}
            imgPath="/img/desktop-dark-ui/nav-icons/nav-calendar-white.svg"
            activeImgPath="/img/desktop-dark-ui/nav-icons/nav-calendar-blue.svg"
            tooltipName={values.tooltipName}
          />
          <Menus
            pageTitle="Tasks"
            pageName={values.pageName}
            handleOnMouseOver={handleOnMouseOver}
            handleOnMouseLeave={handleOnMouseLeave}
            link={"/task-list"}
            imgPath="/img/desktop-dark-ui/nav-icons/nav-task-white.svg"
            activeImgPath="/img/desktop-dark-ui/nav-icons/nav-task-blue.svg"
            tooltipName={values.tooltipName}
          />
          {/* <Menus
            pageTitle="Vault"
            pageName={values.pageName}
            handleOnMouseOver={handleOnMouseOver}
            handleOnMouseLeave={handleOnMouseLeave}
            link={"/vault"}
            imgPath="/img/desktop-dark-ui/nav-icons/nav-vault-white.svg"
            activeImgPath="/img/desktop-dark-ui/nav-icons/nav-vault-blue.svg"
            tooltipName={values.tooltipName}
          /> */}

          {/* <Menus
            pageTitle="Chats"
            pageName={values.pageName}
            handleOnMouseOver={handleOnMouseOver}
            handleOnMouseLeave={handleOnMouseLeave}
            link={"/message"}
            imgPath="/img/desktop-dark-ui/nav-icons/nav-chat-white.svg"
            activeImgPath="/img/desktop-dark-ui/nav-icons/nav-chat-blue.svg"
            tooltipName={values.tooltipName}
          /> */}
          {/* <Menus
            pageTitle="Calling"
            pageName={values.pageName}
            handleOnMouseOver={handleOnMouseOver}
            handleOnMouseLeave={handleOnMouseLeave}
            link={"/calling"}
            imgPath={require("./../../../assets/img/newmenu/calls.svg")}
            tooltipName={values.tooltipName}
          /> */}
        </ul>
      </div>
    </>
  );
}

export default TopMenuBar;
