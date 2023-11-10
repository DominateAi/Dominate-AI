import React from "react";
import { Link } from "react-router-dom";
import DropdownIcon from "rc-dropdown";
import "rc-dropdown/assets/index.css";
import Menu, { Item as MenuItem, Divider } from "rc-menu";
import { deletePipelineById } from "./../../../store/actions/dealsPipelineAction";
import { useHistory } from "react-router-dom";
import displaySmallText from "./../../../store/utils/sliceString";
import EditPipeline from "./EditPipeline";
import { useDispatch } from "react-redux";

function DealPipelinesCard({
  link,
  img,
  title,
  onClickPipelineCard,
  cardData,
  extraCLassName,
}) {
  const history = useHistory();
  const dispatch = useDispatch();

  /*==================================================
    handlers
  ===================================================*/

  const onVisibleChange = (visible) => {
    // console.log(visible);
  };
  const onSelect = (action) => {
    // console.log(cardData);
    if (action === "delete") {
      dispatch(deletePipelineById(cardData._id));
    } else {
      alert("edit popup");
    }
  };

  const gotoPipelineDetail = (e) => {
    e.preventDefault();
    console.log("sd");
    // const { cardData } = this.props;
    history.push({
      pathname: "/deal-pipelines-detail",

      state: { detail: cardData },
    });
  };

  const menu = (
    <Menu>
      {/*<MenuItem onClick={() => this.onSelect("edit")}>Edit</MenuItem>*/}
      <MenuItem>
        <EditPipeline cardData={cardData} />
      </MenuItem>
      <MenuItem onClick={() => onSelect("delete")}>Delete</MenuItem>
    </Menu>
  );

  return (
    <div onClick={onClickPipelineCard} className="deal-pipelines__card">
      <div className={`deal-pipelines__card-link ${extraCLassName}`}>
        {/* <Link to={link}> */}
        <div
          className="pipelineCard-clickable-part"
          onClick={gotoPipelineDetail}
        >
          <div className="deal-pipelines__card-img-div">
            <img src={img} alt={title} />
          </div>
        </div>

        {/* </Link> */}

        <div className="row mx-0 flex-nowrap align-items-center justify-content-between deal-pipelines__card-bottom-block">
          <p className="font-18-semibold ">
            {displaySmallText(title, 15, true)}
          </p>
          <DropdownIcon
            trigger={["click"]}
            overlay={menu}
            animation="none"
            onVisibleChange={onVisibleChange}
            overlayClassName="deal-pipline-dropdown"
          >
            <img
              className="deal-pipelines__edit-card-img"
              src={require("./../../../assets/img/icons/edit-card-icon.svg")}
              alt=""
            />
          </DropdownIcon>
        </div>
      </div>
    </div>
  );
}

export default DealPipelinesCard;

// import React, { Component } from "react";
// import { Link } from "react-router-dom";
// import DropdownIcon from "rc-dropdown";
// import "rc-dropdown/assets/index.css";
// import Menu, { Item as MenuItem, Divider } from "rc-menu";
// import { connect } from "react-redux";
// import { deletePipelineById } from "./../../../store/actions/dealsPipelineAction";
// import { withRouter } from "react-router-dom";
// import displaySmallText from "./../../../store/utils/sliceString";
// import EditPipeline from "./EditPipeline";

// export class DealPipelinesCard extends Component {
//   /*==================================================
//     handlers
//   ===================================================*/

//   onVisibleChange = (visible) => {
//     // console.log(visible);
//   };
//   onSelect = (action) => {
//     const { cardData } = this.props;
//     // console.log(cardData);
//     if (action === "delete") {
//       this.props.deletePipelineById(cardData._id);
//     } else {
//       alert("edit popup");
//     }
//   };

//   gotoPipelineDetail = (e) => {
//     e.preventDefault();
//     console.log("sd");
//     const { cardData } = this.props;
//     this.props.history.push({
//       pathname: "/deal-pipelines-detail",

//       state: { detail: cardData },
//     });
//   };

//   /*==================================================
//     main
//   ===================================================*/
//   render() {
//     const { link, img, title, onClickPipelineCard, cardData, extraCLassName } =
//       this.props;

//     const menu = (
//       <Menu>
//         {/*<MenuItem onClick={() => this.onSelect("edit")}>Edit</MenuItem>*/}
//         <MenuItem>
//           <EditPipeline cardData={cardData} />
//         </MenuItem>
//         <MenuItem onClick={() => this.onSelect("delete")}>Delete</MenuItem>
//       </Menu>
//     );

//     return (
//       <div onClick={onClickPipelineCard} className="deal-pipelines__card">
//         <div className={`deal-pipelines__card-link ${extraCLassName}`}>
//           {/* <Link to={link}> */}
//           <div
//             className="pipelineCard-clickable-part"
//             onClick={this.gotoPipelineDetail}
//           >
//             <div className="deal-pipelines__card-img-div">
//               <img src={img} alt={title} />
//             </div>
//           </div>

//           {/* </Link> */}

//           <div className="row mx-0 flex-nowrap align-items-center justify-content-between deal-pipelines__card-bottom-block">
//             <p className="font-18-semibold ">
//               {displaySmallText(title, 15, true)}
//             </p>
//             <DropdownIcon
//               trigger={["click"]}
//               overlay={menu}
//               animation="none"
//               onVisibleChange={this.onVisibleChange}
//               overlayClassName="deal-pipline-dropdown"
//             >
//               <img
//                 className="deal-pipelines__edit-card-img"
//                 src={require("./../../../assets/img/icons/edit-card-icon.svg")}
//                 alt=""
//               />
//             </DropdownIcon>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }

// export default connect(null, { deletePipelineById })(
//   withRouter(DealPipelinesCard)
// );
