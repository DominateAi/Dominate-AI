import React, { Component, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { SketchPicker } from 'react-color';
import IconList from '../../asset/iconList';

const faSize= [
    { name:"normal" , value:"fa-lg" },
    { name:"1x" , value:"fa-1x" },
    { name:"2x" , value:"fa-2x" },
    { name:"3x" , value:"fa-3x" },
]

export class IconSelectionComponent extends Component{
    constructor( props ){
        super( props );
        this.state = {
            selectedStack:""
        }
    }

    componentDidMount(){
        window.addEventListener('click', this.checkStackSelection )
    }

    componentWillUnmount(){
        window.removeEventListener('click', this.checkStackSelection )
    }

  checkStackSelection = ( e ) => {
    if( !this.props.noEditMode ){
        if( document.getElementById(this.props.stackClass).contains( e.target ) ){
            this.setState({ selectedStack: this.props.stackClass})
          } else if(  document.getElementById(this.props.icon_modal_name) !== null ){
              this.setState({ selectedStack: this.props.stackClass})
          } 
          else {
            this.setState({ selectedStack:"" })
          }
    }  
  }

    render(){
        return (
            <div id={this.props.stackClass} 
                className={ this.state.selectedStack === this.props.stackClass ? "icon_selection_component_main_container_selected" : "icon_selection_component_main_container" } 
                style={{ backgroundColor:this.props.icon_background , position:'relative' }}
            >
                {this.state.selectedStack === this.props.stackClass ? <IconSetting { ...this.props } /> : null }
                <i style={{ color: this.props.icon_color }} className={`fa ${this.props.icon_name} ${this.props.icon_size}`}></i>            
            </div>
        )
    }
}

export default IconSelectionComponent;


export const IconSetting = ( props ) => {
    const [ imageSetting, imageSettingHandler ] = useState( false );
    return (
        <>
        <div id={ props.icon_modal_name }  onClick={ () => imageSettingHandler( true )  } className="image_cogs"><i className="fa fa-cog fa-lg" aria-hidden="true"></i></div>
        <Modal  show={ imageSetting } size={"sm"} centered onHide={ () => imageSettingHandler( false ) } >
        <Modal.Body>
            <div  id={ props.icon_modal_name } className="modal_main_container">
                <div className="modal__close_icon_container">
                    <div className="modal__close_icon" onClick={ () => imageSettingHandler( false ) }><i className="fa fa-times" aria-hidden="true"></i>
</div>
                </div>
                <div className="image_component__modal_container">
                    <div className="template_headline">Icon setting</div>
                </div>
                <div className="icon_setting_main_container">
                    <div className="dispaly_selected_icon">
                        <div className="icon_selection_component_main_container" style={{ backgroundColor:props.icon_background, border:"2px solid grey"  }}>
                            <i className={`fa ${props.icon_name} ${props.icon_size}`}></i>  
                        </div>
                        <IconSelector {...props}/>
                    </div>
                    <div className="icon_setting_size_row">
                        {
                            faSize.map( ( isize, index ) => (
                                <div key={ index } className={ props.icon_size === isize.value ? "icons_size_button_selected" : "icons_size_button" } onClick={ props.onTemplateItemChange(props.icon_size_name, props.template_index, isize.value) }>{ isize.name }</div>
                            ) )
                        }
                    </div>
                    <div className="icon_background_color">
                        <div className="icon_headline">Icon background color</div>
                        <div className="background_color">
                            <SketchPicker 
                                color={ props.icon_background }
                                onChangeComplete={ (e) => props.onTemplateItemChangeWithoutEvent( props.icon_background_name, props.template_index, e.hex ) }
                            />
                        </div>
                    </div>
                    <div className="icon_background_color">
                        <div className="icon_headline">Icon color</div>
                        <div className="background_color">
                            <SketchPicker 
                                color={ props.icon_color }
                                onChangeComplete={ (e) => props.onTemplateItemChangeWithoutEvent( props.icon_color_name, props.template_index, e.hex ) }
                            />
                        </div>
                    </div>
                </div>
                
                <div className="modal__button_container">
                    <button onClick={() => imageSettingHandler( false ) }>Save & Close</button>
                </div>
            </div>
        </Modal.Body>
    </Modal>
    </>
    )
}


export const IconSelector = ( props ) => {
    console.log( IconList.length )
    const [ iconSelector, iconSelectorHandler ] = useState( false );
    return (
        <>
            <div className="select_new_icon_container" onClick={ () => iconSelectorHandler( true ) }>Select New Icon</div>
            <Modal  show={ iconSelector } size={"xl"} centered onHide={ () => iconSelectorHandler( false ) } >
                <Modal.Body>
                    <div  id={ props.icon_modal_name } className="modal_main_container">
                        <div className="modal__close_icon_container">
                            <div className="modal__close_icon" onClick={ () => iconSelectorHandler( false ) }><i className="fa fa-times" aria-hidden="true"></i>
</div>
                        </div>
                        <div className="image_component__modal_container">
                            <div className="template_headline">Click on icon to select</div>
                        </div>
                        <div className="icon_display_list_container__second_modal">
                            {
                                IconList.map( ( icon, index ) => (
                                    <div 
                                        onClick={ (e) => props.onTemplateItemChangeWithoutEvent( props.icon_name_id, props.template_index, icon )}
                                        key={ index } className={ icon === props.icon_name ? "icon_disp_block_selected" : "icon_disp_block" }>
                                        <i className={`fa ${icon} fa-lg`}></i>            
                                    </div>
                                ) )
                            }
                        </div>

                        <div className="modal__button_container">
                            <button onClick={() => iconSelectorHandler( false ) }>Save & Close</button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}