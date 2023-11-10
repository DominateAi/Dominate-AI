import React, { Component } from "react";
import { Droppable } from "react-beautiful-dnd";
import KanbanLead from "./KanbanLead";

class KanbanColumn extends Component {
  render() {
    return (
      <div className="leads-content-container__colm">
        <h2 className="font-24-semibold leads-content-container__colmTitle">
          {this.props.column.title}
        </h2>
        <Droppable droppableId={this.props.column.id}>
          {provided => (
            <div
              className="leads-content-container__colmContent"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {this.props.leads.map((lead, index) => (
                <KanbanLead key={lead.id} lead={lead} index={index} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    );
  }
}

export default KanbanColumn;
