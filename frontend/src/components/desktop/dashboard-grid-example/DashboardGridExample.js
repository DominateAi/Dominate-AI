import React, { Component, Fragment } from "react";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { WidthProvider, Responsive } from "react-grid-layout";

/*=========================================================================
        react-grid-layout
==========================================================================*/

const ResponsiveReactGridLayout = WidthProvider(Responsive);
const originalLayouts = getFromLS("layouts") || {};
console.log(originalLayouts);

function getFromLS(key) {
  let ls = {};
  if (global.localStorage) {
    try {
      ls = JSON.parse(global.localStorage.getItem("rgl-8")) || {};
    } catch (e) {
      /*Ignore*/
    }
  }
  return ls[key];
}

function saveToLS(key, value) {
  if (global.localStorage) {
    global.localStorage.setItem(
      "rgl-8",
      JSON.stringify({
        [key]: value,
      })
    );
  }
}
/*=========================================================================
        react-grid-layout
==========================================================================*/

export class DashboardGridExample extends Component {
  constructor(props) {
    super(props);

    this.state = {
      layouts: JSON.parse(JSON.stringify(originalLayouts)),
    };
  }

  /*=========================================================================
        react-grid-layout
  ==========================================================================*/

  // static get defaultProps() {
  //   return {
  //     className: "layout",
  //     cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
  //     rowHeight: 30,
  //   };
  // }

  resetLayout() {
    this.setState({ layouts: {} });
  }

  onLayoutChange(layout, layouts) {
    saveToLS("layouts", layouts);
    console.log(layouts);
    this.setState({ layouts });
  }

  /*=========================================================================
        react-grid-layout
  ==========================================================================*/

  render() {
    return (
      <Fragment>
        {/* react-grid-layout */}
        <button onClick={() => this.resetLayout()}>Reset Layout</button>
        <ResponsiveReactGridLayout
          className="layout"
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={30}
          layouts={this.state.layouts}
          onLayoutChange={(layout, layouts) =>
            this.onLayoutChange(layout, layouts)
          }
          onDragStart={() => console.log("Drag Started")}
          onDrag={() => console.log("Drag movement")}
          onDragStop={() => console.log("Drag completed")}
        >
          <div
            style={{ backgroundColor: "gray" }}
            key="1"
            // data-grid={{ w: 6, h: 4, x: 4, y: 4 }}
            data-grid={{
              w: 2,
              h: 3,
              x: 0,
              y: 0,
              // minW: 4,
              // maxW: 4,
              // static: true,
            }}
          >
            1 static
          </div>
          <div
            style={{ backgroundColor: "gray" }}
            key="2"
            data-grid={{ w: 2, h: 3, x: 2, y: 0 }}
          >
            2
          </div>
          <div
            style={{ backgroundColor: "gray" }}
            key="3"
            data-grid={{ w: 2, h: 3, x: 4, y: 0 }}
          >
            3
          </div>
          <div
            style={{ backgroundColor: "gray" }}
            key="4"
            data-grid={{ w: 2, h: 3, x: 6, y: 0 }}
          >
            4
          </div>
          <div
            style={{ backgroundColor: "gray" }}
            key="5"
            data-grid={{ w: 2, h: 3, x: 8, y: 0, minW: 2, minH: 3 }}
          >
            5
          </div>
        </ResponsiveReactGridLayout>
        {/* react-grid-layout end */}
      </Fragment>
    );
  }
}

export default DashboardGridExample;
