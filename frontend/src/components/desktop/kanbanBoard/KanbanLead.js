import React, { Component } from 'react'
import { Draggable } from 'react-beautiful-dnd';
import LeadsContentBlockCard from '../leads/LeadsContentBlockCard';

class KanbanLead extends Component {
    render() {
        return (
            <Draggable draggableId={this.props.lead.id} index={this.props.index}>
                {(provided) =>
                    <div className="leads-content-container__lead"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                    >
                        <LeadsContentBlockCard
                            leadName={this.props.lead.leadName}
                            /* leadEmoji={this.props.lead.leadEmoji} */
                            leadEmoji='&#128165;'
                            leadFollowUp={this.props.lead.leadFollowUp}
                            leadFiles={this.props.lead.leadFiles}
                            leadContacted={this.props.lead.leadContacted}
                            leadNotes={this.props.lead.leadNotes}
                            leadTags={this.props.lead.leadTags}
                        />
                    </div>
                }
            </Draggable>
        )
    }
}

export default KanbanLead;
