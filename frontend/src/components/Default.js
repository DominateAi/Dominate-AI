import React, { Component } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { Container, Draggable } from "react-smooth-dnd";

const optionsAssignedTo = [
  // "Status",
  "John Doe",
  "Anna Mull",
  "Paul Molive",
];

class Default extends Component {
  render() {
    let items = [
      { name: "hello", id: "sdsd" },
      { name: "hello2", id: "sdszzd" },
      { name: "hello3", id: "sdsdxc" },
    ];
    return (
      <div className="text-center mt-5">
        <h1>Page Not Found</h1>

        {/* <Container
          getChildPayload={(data) => console.log(data)}
          onDrop={this.onDropHandler}
          onDragEnd={(data) => console.log(data)}
        >
          {items.map((item) => {
            return (
              <Draggable key={item.id}>
                
                <div class="box_main">
                  <span>{item.name}</span>
                 
                </div>
              </Draggable>
            );
          })}
        </Container> */}
      </div>
    );
  }
}

export default Default;
