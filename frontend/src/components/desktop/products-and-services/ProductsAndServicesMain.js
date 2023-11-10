import React, { Fragment, useState, useEffect } from "react";
import Navbar from "../header/Navbar";
import AddProductAndServices from "./AddProductAndServices";
import ProductsAndServicesTable from "./ProductsAndServicesTable";
import { useDispatch } from "react-redux";
import { getAllProductOrServices } from "./../../../store/actions/productAndSevicesAction";
import ImportProductOrService from "./ImportProductOrService";
import { useSelector } from "react-redux";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import isEmpty from "../../../store/validations/is-empty";
import { SET_SEARCH_IN_ALL_PAGE } from "./../../../store/types";
import store from "../../../store/store";
import { SET_PAGETITLE } from "./../../../store/types";
import BreadcrumbMenu from "../header/BreadcrumbMenu";

export default function ProductsAndServicesMain() {
  const dispatch = useDispatch();
  const [productCount, setproductCount] = useState(0);
  const [activeFilter, setActivefilter] = useState("all");

  const [loading, setLoading] = useState("");

  const [values, setValues] = useState({
    productsSearch: "",
  });

  const loader = useSelector((state) => state.auth.loader);

  useEffect(() => {
    if (!isEmpty(loader)) {
      setLoading(loader);
    }
  }, [loader]);

  useEffect(() => {
    dispatch(getAllProductOrServices());

    store.dispatch({
      type: SET_PAGETITLE,
      // payload: "Products & Services",
      payload: "Sales Centre",
    });
  }, []);

  const allProductOrServices = useSelector(
    (state) => state.productAndServices.allProductAndServices
  );

  useEffect(() => {
    if (!isEmpty(allProductOrServices)) {
      setproductCount(allProductOrServices.length);
    } else {
      setproductCount(0);
    }
  }, [allProductOrServices]);

  const handleOnChange = (event) => {
    store.dispatch({
      type: SET_SEARCH_IN_ALL_PAGE,
      payload: event.target.value,
    });
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const handleOnSubmitSearch = () => {
    console.log(values);
  };

  /*=========================
    render searchBlock
==========================*/
  const renderSearchBlock = () => {
    return (
      <div className="row mx-0 justify-content-end">
        <div className="leads-title-block-container__new-search-title-block m-0 p-0 lead-search-block--cust row mx-0 align-items-center">
          <div className="message-search-block px-0 mb-md-0">
            <form onSubmit={handleOnSubmitSearch}>
              <input
                type="text"
                name="productsSearch"
                className="message-search-block__input mb-0 mr-0"
                placeholder="search for product name"
                //placeholder="Search"
                onChange={handleOnChange}
                value={values.productsSearch}
              />
              <img
                src="/img/desktop-dark-ui/icons/search-icon.svg"
                alt="search"
                className="message-search-block__icon"
                onClick={handleOnSubmitSearch}
              />
            </form>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Fragment>
      <Navbar />
      <BreadcrumbMenu
        menuObj={[
          {
            title: "Sales Centre",
            link: "/sales-centre#engage",
          },
          {
            title: "Products & Services",
          },
        ]}
      />

      {loading && (
        <Loader type="Triangle" color="#00BFFF" className="dominate-loader" />
      )}
      <div className="products-and-services-main-div">
        <div className="row mx-0 justify-content-between">
          <div className="row mx-0 align-items-center">
            <button
              className="go-back-yellow-arrow-new-leads"
              onClick={(e) => (
                (window.location.href = "/sales-centre#track"),
                e.preventDefault()
              )}
            >
              <img
                src="/img/desktop-dark-ui/icons/white-back-arrow-circle.svg"
                alt="prev arrow"
              />
            </button>

            <h2 className="page-title-new pl-0">Products &amp; Services</h2>
            <h3 className="products-count-text">
              ({productCount}{" "}
              {activeFilter === "all"
                ? "Products and services"
                : activeFilter === "products"
                ? "Products"
                : "Services"}{" "}
              )
            </h3>
          </div>
          <div className="row mx-0 align-items-center">
            <ImportProductOrService />
            <AddProductAndServices isAll={true} title={"+ Add New"} />
          </div>
        </div>
        <hr className="page-title-border-bottom page-title-border-bottom--quotation" />

        <div className="products-and-services-search-block">
          {renderSearchBlock()}
        </div>
        <ProductsAndServicesTable setActivefilter={setActivefilter} />
      </div>
    </Fragment>
  );
}
