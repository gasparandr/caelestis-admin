

import { PropertyDefinitionDatatypes } from "../property-definitions/PropertyDefinitionDatatypes";
import { ObjectNotifications } from "./ObjectNotifications";
import { ViewComponent } from "../core/ViewComponent";
import { View } from "../core/View";


// CSS
import "../_style/style-sheets/objects-edit-modal.scss";

// HTML
const template = require( "../_view-templates/objects-edit-modal.html" );






export class ObjectEditModal extends ViewComponent {

    private objectId: string;

    private objectTypeName: HTMLElement;
    private propertiesContainer: HTMLElement;
    private cancelBtn: HTMLButtonElement;
    private saveBtn: HTMLButtonElement;





    constructor(view: View, container: HTMLElement) {
        super( view, container );

        this.objectId               = null;

        this.container.innerHTML    = template;

        this.objectTypeName         = document.getElementById( "objects-edit-modal-object-type" );
        this.propertiesContainer    = document.getElementById( "objects-edit-properties-container" );
        this.cancelBtn              = document.getElementById( "objects-edit-cancel-btn" ) as HTMLButtonElement;
        this.saveBtn                 = document.getElementById( "objects-edit-create-btn" ) as HTMLButtonElement;


        this.cancelBtnListener              = this.cancelBtnListener.bind( this );
        this.saveBtnListener              = this.saveBtnListener.bind( this );

        this.enterScene();
    }


    private registerEventListeners(): void {

        this.cancelBtn.addEventListener( "click", this.cancelBtnListener );
        this.saveBtn.addEventListener( "click", this.saveBtnListener );


    }



    private unregisterEventListeners(): void {

        this.cancelBtn.removeEventListener( "click", this.cancelBtnListener );
        this.saveBtn.removeEventListener( "click", this.saveBtnListener );

    }



    private cancelBtnListener(e: any): void {
        this.sendSignal( ObjectNotifications.OBJECTS_EDIT_HIDE );
    }



    private saveBtnListener(e: any): void {

        this.sendSignal( ObjectNotifications.OBJECTS_EDIT_HIDE );

        const propertyInputs = document.getElementsByClassName( "property-value" );

        const id = this.objectId;
        let properties = [];

        for ( let i = 0; i < propertyInputs.length; i++ ) {

            const input = ( propertyInputs[i] ) as HTMLInputElement;

            if ( input.type === "checkbox" ) {
                properties.push(
                    {
                        propertyDef: input.id,
                        value: input.checked
                    }
                )
            } else {
                properties.push(
                    {
                        propertyDef: input.id,
                        value: input.value
                    }
                )
            }


        }


        this.connection.editObject(
            {
                id,
                properties
            },
            (response: any) => {
                const { object } = response;

                console.log( object );

                this.sendSignal( ObjectNotifications.OBJECTS_EDIT_OBJECT_EDITED, object );
            },
            (message: string) => {
                console.warn( message );
            }
        )


    }



    public enterScene(): void {
        this.registerEventListeners();

    }



    public exitScene(exitType: string): void {
        super.exitScene( exitType );
        this.unregisterEventListeners();

        this.view.componentExited( this.name );
    }



    public loadObject(id: string): void {

        this.propertiesContainer.innerHTML = "";

        this.connection.getObjectById(
            id,
            (response: any) => {
                const { object } = response;
                console.log( object );

                if ( object ) this.objectId = object._id;

                this.objectTypeName.innerHTML = object.type.name;

                for ( let property of object.properties ) {
                    this.createPropertyInputFromPropertyValue( property );
                }
            },
            (message: string) => {
                console.warn( message );
            }
        )

    }



    private createPropertyInputFromPropertyValue(propertyValue: any): void {

        let propValContainer = document.createElement( "div" );
        propValContainer.className = "property-value-container";

        let propValTitle = document.createElement( "span" );
        propValTitle.className = "property-value-name";
        propValTitle.innerHTML = propertyValue.name;

        let propValInput: any;

        switch ( propertyValue.dataType ) {

            case PropertyDefinitionDatatypes.TEXT :

                propValInput = document.createElement( "input" );
                propValInput.type = "text";
                propValInput.className = "property-value";
                if ( propertyValue.value ) propValInput.value = propertyValue.value;

                break;

            case PropertyDefinitionDatatypes.NUMBER :

                propValInput = document.createElement( "input" );
                propValInput.type = "number";
                propValInput.className = "property-value";
                if ( propertyValue.value ) propValInput.value = propertyValue.value;

                break;

            case PropertyDefinitionDatatypes.LOOKUP :

                propValInput = document.createElement( "select" );
                propValInput.className = "property-value property-value-select";
                let initialOption: HTMLOptionElement = null;

                if ( propertyValue.value ) {
                    let option = document.createElement( "option" );
                    option.value = propertyValue.value;

                    option.text = propertyValue.displayValue;

                    propValInput.add( option );
                    initialOption = option;
                }

                propValInput.addEventListener( "focus", () => {
                    const { objectType } = propertyValue.propertyDef;

                    this.connection.getObjectByType(
                        objectType,
                        (response: any) => {
                            const { objects } = response;

                            console.log( objects );


                            if ( ! objects.length ) return;

                            propValInput.innerHTML = "";
                            if ( initialOption ) propValInput.add( initialOption );



                            for ( let object of objects ) {

                                if ( initialOption && object._id === (initialOption as HTMLOptionElement).value ) continue;

                                let option = document.createElement( "option" );
                                option.value = object._id;

                                const titleProp = object.properties.filter( (p: any) => p.propertyDef._id === object.type.nameProperty )[0];

                                option.text = titleProp.value;

                                propValInput.add( option );
                            }
                        },
                        (message: string) => {
                            console.error( message );
                        }
                    )
                });


                break;

            case PropertyDefinitionDatatypes.DATE :

                propValInput = document.createElement( "input" );
                propValInput.type = "date";
                propValInput.className = "property-value";
                if ( propertyValue.value ) {

                    console.log( propertyValue.value );

                    propValInput.valueAsDate = new Date( propertyValue.value );


                }

                console.log( "date value: " + new Date( propertyValue.value ).getDate() );

                break;

            case PropertyDefinitionDatatypes.BOOLEAN :

                propValInput = document.createElement( "input" );
                propValInput.type = "checkbox";
                propValInput.className = "property-value property-value-checkbox";

                if ( propertyValue.value ) propValInput.checked = propertyValue.value;

                break;


            default :
                break;

        }


        propValInput.id = propertyValue.propertyDef._id;

        propValContainer.appendChild( propValTitle );
        propValContainer.appendChild( propValInput );

        this.propertiesContainer.appendChild( propValContainer );
    }

}
