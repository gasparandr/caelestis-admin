


import {ViewComponent} from "../core/ViewComponent";
import {View} from "../core/View";



// CSS
import "../_style/style-sheets/objects-create-modal.scss";
import {PropertyDefinitionDatatypes} from "../property-definitions/PropertyDefinitionDatatypes";
import {ObjectNotifications} from "./ObjectNotifications";

// HTML
const template = require( "../_view-templates/objects-create-modal.html" );



export class ObjectCreateModal extends ViewComponent {

    private objectTypeSelect: HTMLSelectElement;
    private propertiesContainer: HTMLElement;
    private cancelBtn: HTMLButtonElement;
    private createBtn: HTMLButtonElement;


    private objectTypes: any;


    constructor(view: View, container: HTMLElement) {
        super( view, container );

        this.objectTypes = {};


        this.container.innerHTML = template;

        this.objectTypeSelect       = document.getElementById( "objects-create-object-type-select" ) as HTMLSelectElement;
        this.propertiesContainer    = document.getElementById( "objects-create-properties-container" );
        this.cancelBtn              = document.getElementById( "objects-create-cancel-btn" ) as HTMLButtonElement;
        this.createBtn              = document.getElementById( "objects-create-create-btn" ) as HTMLButtonElement;


        this.objectTypeSelectChangeListener = this.objectTypeSelectChangeListener.bind( this );
        this.cancelBtnListener              = this.cancelBtnListener.bind( this );
        this.createBtnListener              = this.createBtnListener.bind( this );


        this.enterScene();
    }



    private registerEventListeners(): void {

        this.objectTypeSelect.addEventListener( "change", this.objectTypeSelectChangeListener );
        this.cancelBtn.addEventListener( "click", this.cancelBtnListener );
        this.createBtn.addEventListener( "click", this.createBtnListener );


    }



    private unregisterEventListeners(): void {

        this.objectTypeSelect.removeEventListener( "change", this.objectTypeSelectChangeListener );
        this.cancelBtn.removeEventListener( "click", this.cancelBtnListener );
        this.createBtn.removeEventListener( "click", this.createBtnListener );

    }


    private objectTypeSelectChangeListener(e: any): void {

        this.propertiesContainer.innerHTML = "";
        this.populatePropertyValues();

    }


    private cancelBtnListener(e: any): void {
        this.sendSignal( ObjectNotifications.OBJECTS_CREATE_HIDE );
    }



    private createBtnListener(e: any): void {

        const objectTypeId = this.objectTypeSelect.options[ this.objectTypeSelect.selectedIndex ].value;
        const objectType = this.objectTypes[ objectTypeId ];
        let properties = [];






    }


    public enterScene(): void {
        this.registerEventListeners();

    }



    public exitScene(exitType: string): void {
        super.exitScene( exitType );
        this.unregisterEventListeners();

        this.view.componentExited( this.name );
    }




    public populateObjectTypes(): void {


        this.objectTypeSelect.innerHTML = "";
        this.objectTypes = {};

        this.connection.getObjectTypes(
            (response: any) => {
                const { objectTypes } = response;

                for ( let i = 0; i < objectTypes.length; i++ ) {

                    let otOption = document.createElement( "option" );
                    otOption.value = objectTypes[i]._id;
                    otOption.text = objectTypes[i].name;

                    this.objectTypeSelect.appendChild( otOption );


                    this.objectTypes[ objectTypes[i]._id ] = objectTypes[i];

                }


                this.populatePropertyValues();


            },
            (message: string) => {
                console.warn( message );
            }
        );

    }


    private populatePropertyValues(): void {

        this.propertiesContainer.innerHTML = "";

        const selectedObjectTypeId = this.objectTypeSelect.options[ this.objectTypeSelect.selectedIndex ].value;

        const selectedObjectType = this.objectTypes[ selectedObjectTypeId ];

        for ( let prop of selectedObjectType.properties ) {

            this.connection.getPropertyDefinitionById(
                prop,
                (response: any) => {

                    const { propertyDef } = response;

                    this.createPropertyInputFromPropDef( propertyDef );

                },
                (message: string) => {
                    console.warn( message );
                }
            )

        }

    }


    private createPropertyInputFromPropDef(prop: any) {

        console.log( prop );

        let propValContainer = document.createElement( "div" );
        propValContainer.className = "property-value-container";

        let propValTitle = document.createElement( "span" );
        propValTitle.className = "property-value-name";
        propValTitle.innerHTML = prop.name;

        let propValInput;


        switch ( prop.dataType ) {

            case PropertyDefinitionDatatypes.TEXT :

                propValInput = document.createElement( "input" );
                propValInput.type = "text";
                propValInput.className = "property-value";

                break;

            case PropertyDefinitionDatatypes.NUMBER :

                propValInput = document.createElement( "input" );
                propValInput.type = "number";
                propValInput.className = "property-value";

                break;

            case PropertyDefinitionDatatypes.LOOKUP :

                propValInput = document.createElement( "select" );
                propValInput.className = "property-value";

                break;

            case PropertyDefinitionDatatypes.DATE :

                propValInput = document.createElement( "input" );
                propValInput.type = "date";
                propValInput.className = "property-value";

                break;

            case PropertyDefinitionDatatypes.BOOLEAN :

                propValInput = document.createElement( "input" );
                propValInput.type = "checkbox";
                propValInput.className = "property-value-checkbox";

                break;


            default :
                break;

        }

        propValInput.id = prop._id;

        propValContainer.appendChild( propValTitle );
        propValContainer.appendChild( propValInput );


        this.propertiesContainer.appendChild( propValContainer );

    }


}