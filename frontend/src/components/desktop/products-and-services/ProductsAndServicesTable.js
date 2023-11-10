import React, { Fragment, useState, useEffect } from "react";
import EditProductAndServices from "./EditProductAndServices";
import { useSelector, useDispatch } from "react-redux";
import isEmpty from "../../../store/validations/is-empty";
import {
  deleteProductOrServiceById,
  productAndServicesSearch,
} from "./../../../store/actions/productAndSevicesAction";
import AddProductAndServices from "./AddProductAndServices";

const dummyData = [1, 2, 3];

export default function ProductsAndServicesTable({ setActivefilter }) {
  const dispatch = useDispatch();
  const [allItems, setAllItems] = useState([]);
  const [filteredFinaldata, setfiltereddata] = useState([]);

  const [values, setValues] = useState({
    isActiveProduct: "all",
  });
  const handleChangeProduct = (activeBtn) => (e) => {
    e.preventDefault();
    setValues({
      ...values,
      isActiveProduct: activeBtn,
    });
    setActivefilter(activeBtn);
    let queryItem = {};
    if (activeBtn === "all") {
      queryItem = {
        query: {},
      };
    } else {
      queryItem = {
        query: {
          type: activeBtn === "products" ? "PRODUCT" : "SERVICE",
        },
      };
    }

    dispatch(productAndServicesSearch(queryItem));
  };

  const allProductOrServices = useSelector(
    (state) => state.productAndServices.allProductAndServices
  );

  useEffect(() => {
    if (!isEmpty(allProductOrServices)) {
      setfiltereddata(allProductOrServices);
      setAllItems(allProductOrServices);
    } else {
      setfiltereddata(allProductOrServices);
      setAllItems([]);
    }
  }, [allProductOrServices]);

  const searchText = useSelector((state) => state.search.searchInAllPage);

  useEffect(() => {
    // Search
    let filtereddata = [];
    if (!isEmpty(searchText)) {
      let search = new RegExp(searchText, "i");
      filtereddata = allItems.filter((getall) => {
        if (search.test(getall.name)) {
          return getall;
        }
        // if (search.test(getall.company)) {
        //   return getall;
        // }
        // if (search.test(getall.email)) {
        //   return getall;
        // }
      });

      setfiltereddata(filtereddata);
      // console.log(filtereddata);
    } else {
      filtereddata = allItems;
      setfiltereddata(filtereddata);
    }
  }, [searchText]);

  const handleEdit = () => {
    console.log("On click handle edit");
  };

  const handleDelete = (data) => (e) => {
    dispatch(deleteProductOrServiceById(data._id, "Item deleted"));
  };

  const handleShow = () => {
    console.log("On click handle show");
  };

  console.log(values.isActiveProduct);

  return (
    <div>
      <div className="row mx-0 align-items-start product-and-services-btn">
        <button
          onClick={handleChangeProduct("all")}
          className={
            values.isActiveProduct === "all"
              ? "product-and-services-btn--active"
              : "product-and-services-btn--inactive"
          }
        >
          All
        </button>
        <button
          onClick={handleChangeProduct("products")}
          className={
            values.isActiveProduct === "products"
              ? "product-and-services-btn--active"
              : "product-and-services-btn--inactive"
          }
        >
          Products
        </button>
        <button
          onClick={handleChangeProduct("services")}
          className={
            values.isActiveProduct === "services"
              ? "product-and-services-btn--active"
              : "product-and-services-btn--inactive"
          }
        >
          Services
        </button>
      </div>
      {!isEmpty(filteredFinaldata) ? (
        <>
          <div className="row mx-0 product-and-services-details-card-title-row">
            <div className="product-and-services-details-card-title-row_colm1">
              <span>Code</span>
            </div>
            <div className="product-and-services-details-card-title-row_colm2">
              <span>
                {" "}
                {values.isActiveProduct === "all"
                  ? "Name"
                  : values.isActiveProduct === "products"
                  ? "Name of Product"
                  : "Name of Service"}
              </span>
            </div>
            <div className="product-and-services-details-card-title-row_colm3">
              <span>Type</span>
            </div>
            <div className="product-and-services-details-card-title-row_colm4">
              <span>Vendor Name</span>
            </div>
            <div className="product-and-services-details-card-title-row_colm5">
              <span>Cost</span>
            </div>
            <div className="product-and-services-details-card-title-row_colm6">
              <span>TAX</span>
            </div>
            <div className="product-and-services-details-card-title-row_colm7">
              <span>Actions</span>
            </div>
          </div>
          {!isEmpty(filteredFinaldata) &&
            filteredFinaldata.map((data, key) => (
              <div className="product-and-services-details-card" key={key}>
                <div className="row mx-0 align-items-start flex-nowrap product-and-services-details-card__row1">
                  <div className="flex-nowrap product-and-services-details-card__row1_colm1">
                    <span className="font-18-bold">
                      {!isEmpty(data.code) ? data.code : "---"}
                    </span>
                  </div>
                  <div className="flex-nowrap product-and-services-details-card__row1_colm2">
                    <span className="font-18-bold">
                      {" "}
                      {!isEmpty(data.name) ? data.name : "---"}
                    </span>
                  </div>
                  <div className="flex-nowrap product-and-services-details-card__row1_colm3">
                    <span className="font-18-bold">
                      {!isEmpty(data.type) ? data.type : "---"}
                    </span>
                  </div>
                  <div className="flex-nowrap product-and-services-details-card__row1_colm4">
                    <span className="font-18-bold">
                      {!isEmpty(data.vendor) ? data.vendor : "---"}
                    </span>
                  </div>
                  <div className="flex-nowrap product-and-services-details-card__row1_colm5">
                    <span className="font-18-bold">
                      {!isEmpty(data.cost) ? data.cost : "---"}
                    </span>
                  </div>
                  <div className="flex-nowrap product-and-services-details-card__row1_colm6">
                    <span className="font-18-bold">
                      {!isEmpty(data.tax) ? data.tax : "---"}
                    </span>
                  </div>
                  <div className="row mx-0 product-and-services-details-card__row1_colm7">
                    {/*<button onClick={handleShow}>
                  <i className="fa fa-eye"></i>
        </button>*/}
                    <EditProductAndServices itemData={data} />

                    {/*<button onClick={handleEdit}>
                  <i className="fa fa-pencil"></i>
        </button>*/}
                    <EditProductAndServices isEdit={"edit"} itemData={data} />
                    <button onClick={handleDelete(data)}>
                      <i className="fa fa-trash"></i>
                    </button>
                  </div>
                </div>
                <div className="row mx-0 align-items-start flex-nowrap product-and-services-details-card__row2">
                  <div className="product-and-services-details-card__row2_colm1">
                    <span>Description</span>
                    <span className="product-and-services-desc-colon-text">
                      :
                    </span>
                  </div>
                  <div className="product-and-services-details-card__row2_colm2">
                    <p>
                      {!isEmpty(data.description) ? data.description : "---"}
                      {/* <button className="products-read-more-btn">
                      read more
                    </button> */}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </>
      ) : (
        <div className="text-center product-and-services-not-found-div">
          {values.isActiveProduct === "products" ? (
            <>
              <img
                src="/img/desktop-dark-ui/illustrations/product-and-services.svg"
                alt=""
                className="product-and-services-not-found-img"
              />
              <p className="font-18-medium color-white-79 mb-30">
                No Products Added yet
              </p>
              <AddProductAndServices title={"+ Add Now"} isProduct={true} />
            </>
          ) : values.isActiveProduct === "services" ? (
            <>
              <img
                src="/img/desktop-dark-ui/illustrations/product-and-services.svg"
                alt=""
                className="product-and-services-not-found-img"
              />
              <p className="font-18-medium color-white-79 mb-30">
                No Services Added yet
              </p>
              <AddProductAndServices title={"+ Add Now"} />
            </>
          ) : (
            <>
              <img
                // src={require("../../../assets/img/illustrations/product-and-services.svg")}
                src="/img/desktop-dark-ui/illustrations/product-and-services.svg"
                alt=""
                className="product-and-services-not-found-img"
              />
              <p className="font-18-medium color-white-79 mb-30">
                {/* No Data Found */}
                No Products &amp; Services Added yet
              </p>
              <AddProductAndServices title={"+ Add Now"} isAll={true} />
            </>
          )}
        </div>
      )}
    </div>
  );
}
