
import {Promise} from 'es6-promise'

import { ViewComponent } from "../core/ViewComponent";
import { View } from "../core/View";
import {PropertyDefinitionDatatypes} from "../property-definitions/PropertyDefinitionDatatypes";
import {IPropertyDefinition} from "../connection/models/IPropertyDefinition";
import {PropertyDefinition} from "../connection/models/PropertyDefinition";

// CSS
import "../_style/style-sheets/object-types.scss";
import "../_style/style-sheets/listing-menu-dropdown.scss";

// HTML
const newOTModalTemplate = require("../_view-templates/object-types-new-object-type-modal.html");
const addPDModalTemplate = require("../_view-templates/object-types-add-properties-modal.html");
const newPDModalTemplate = require("../_view-templates/property-definitions-add-modal.html");
const dropDownMenuTemplate = require("../_view-templates/listing-menu-dropdown.html");
const template = require("../_view-templates/object-types.html" );

export class ObjectTypes extends ViewComponent {

    private objectTypesContainer: HTMLElement;
    private addBtn: HTMLButtonElement;
    private modalBackground: HTMLElement;

    private modalOT: HTMLElement;
    private modalOTNameInput: HTMLInputElement;
    private modalOTPropertiesContainer: HTMLElement;
    private modalOTSelectPropertiesBtn: HTMLButtonElement;
    private modalOTCancelBtn: HTMLButtonElement;
    private modalOTOKBtn: HTMLButtonElement;
    private modalOTSetNameBtn: HTMLButtonElement;


    private modalSelectPD: HTMLElement;
    private modalSelectPDPropertyContainer: HTMLElement;
    private modalSelectPDNewPropBtn: HTMLButtonElement;
    private modalSelectPDCancelBtn: HTMLButtonElement;
    private modalSelectPDOKBtn: HTMLButtonElement;


    private modalNewPD: HTMLElement;
    private modalNewPDNameInput: HTMLInputElement;
    private modalNewPDObjectTypeContainer: HTMLElement;
    private modalNewPDDataTypeSelect: HTMLSelectElement;
    private modalNewPDObjectTypeSelect: HTMLSelectElement;
    private modalNewPDCancelBtn: HTMLButtonElement;
    private modalNewPDOKBtn: HTMLButtonElement;


    private dropdownMenuBackground: HTMLElement;
    private dropdownMenu: HTMLElement;
    private dropdownMenuEdit: HTMLElement;
    private dropdownMenuDelete: HTMLElement;

    private activeObjectTypeId: string;

    private availableProperties: any[];
    private selectedProperties: any[];

    private objectTypeNameProperty: string;

    private editMode: boolean;



    constructor(view: View, container: HTMLElement) {
        super( view, container );

        this.availableProperties = [];
        this.selectedProperties = [];
        this.objectTypeNameProperty = null;
        this.editMode = false;


        this.container.innerHTML = template;

        this.objectTypesContainer       = document.getElementById( "object-types-container" );
        this.addBtn                     = document.getElementById( "object-types-add-btn" ) as HTMLButtonElement;

        this.modalBackground            = document.createElement( "div" );
        this.modalBackground.id         = "object-types-modal-background";
        this.modalBackground.innerHTML  = newOTModalTemplate;

        this.modalBackground.insertAdjacentHTML( "beforeend", addPDModalTemplate );
        this.modalBackground.insertAdjacentHTML( "beforeend", newPDModalTemplate );


        this.container.appendChild( this.modalBackground );

        this.modalOT                        = document.getElementById( "object-types-modal-container" );
        this.modalOTNameInput               = document.getElementById( "ot-modal-input-name" ) as HTMLInputElement;
        this.modalOTPropertiesContainer     = document.getElementById( "ot-modal-properties-container" );
        this.modalOTSelectPropertiesBtn     = document.getElementById( "ot-modal-edit-property-btn" ) as HTMLButtonElement;
        this.modalOTCancelBtn               = document.getElementById( "ot-modal-cancel-btn" ) as HTMLButtonElement;
        this.modalOTOKBtn                   = document.getElementById( "ot-modal-ok-btn" ) as HTMLButtonElement;
        this.modalOTSetNameBtn              = document.getElementById( "ot-modal-set-name-property-btn" ) as HTMLButtonElement;


        this.modalSelectPD                     = document.getElementById( "ot-select-properties-modal-container" );
        this.modalSelectPDPropertyContainer    = document.getElementById( "ot-select-properties-modal-property-container" );
        this.modalSelectPDNewPropBtn           = document.getElementById( "ot-select-properties-modal-new-property-btn" ) as HTMLButtonElement;
        this.modalSelectPDCancelBtn            = document.getElementById( "ot-select-properties-cancel-btn" ) as HTMLButtonElement;
        this.modalSelectPDOKBtn                = document.getElementById( "ot-select-properties-ok-btn" ) as HTMLButtonElement;


        this.modalNewPD                     = document.getElementById( "property-definitions-modal-container" );
        this.modalNewPDNameInput            = document.getElementById( "pd-modal-input-name" ) as HTMLInputElement;
        this.modalNewPDDataTypeSelect       = document.getElementById( "pd-modal-select-data-type" ) as HTMLSelectElement;
        this.modalNewPDObjectTypeContainer  = document.getElementById( "pd-modal-object-type-container" ) as HTMLElement;
        this.modalNewPDObjectTypeSelect     = document.getElementById( "pd-modal-select-object-type" ) as HTMLSelectElement;
        this.modalNewPDCancelBtn            = document.getElementById( "pd-modal-add-cancel" ) as HTMLButtonElement;
        this.modalNewPDOKBtn                = document.getElementById( "pd-modal-add-ok" ) as HTMLButtonElement;


        this.container.insertAdjacentHTML( "beforeend", dropDownMenuTemplate );

        this.dropdownMenuBackground     = document.getElementById( "listing-menu-dropdown-background" );
        this.dropdownMenu               = document.getElementById( "listing-menu-dropdown" );
        this.dropdownMenuEdit           = document.getElementById( "listing-menu-dropdown-item-edit" );
        this.dropdownMenuDelete         = document.getElementById( "listing-menu-dropdown-item-delete" );



        this.modalBackgroundListener            = this.modalBackgroundListener.bind( this );
        this.modalOTaddBtnListener              = this.modalOTaddBtnListener.bind( this );
        this.modalOTCancelBtnListener           = this.modalOTCancelBtnListener.bind( this );
        this.modalOTOKBtnListener               = this.modalOTOKBtnListener.bind( this );
        this.modalOTEditPropertiesListener      = this.modalOTEditPropertiesListener.bind( this );
        this.modalEditPDCancelBtnListener       = this.modalEditPDCancelBtnListener.bind( this );
        this.modalEditPDNewPropBtnListener      = this.modalEditPDNewPropBtnListener.bind( this );
        this.modalNewPDCancelBtnListener        = this.modalNewPDCancelBtnListener.bind( this );
        this.modalNewPDDataTypeChangeListener   = this.modalNewPDDataTypeChangeListener.bind( this );
        this.modalNewPDOKBtnListener            = this.modalNewPDOKBtnListener.bind( this );
        this.modalEditPDOKBtnListener           = this.modalEditPDOKBtnListener.bind( this );
        this.modalOTPropertySelectionListener   = this.modalOTPropertySelectionListener.bind( this );
        this.modalOTSetNameBtnListener          = this.modalOTSetNameBtnListener.bind( this );
        this.dropdownMenuBackgroundListener     = this.dropdownMenuBackgroundListener.bind( this );
        this.dropDownMenuEditListener           = this.dropDownMenuEditListener.bind( this );
        this.dropDownMenuDeleteListener         = this.dropDownMenuDeleteListener.bind( this );
        this.objectTypeItemMousedownListener    = this.objectTypeItemMousedownListener.bind( this );


        this.enterScene();
    }



    private registerEventListeners(): void {

        this.addBtn.addEventListener( "click", this.modalOTaddBtnListener );
        this.modalBackground.addEventListener( "click", this.modalBackgroundListener );
        this.modalOTCancelBtn.addEventListener( "click", this.modalOTCancelBtnListener );
        this.modalOTOKBtn.addEventListener( "click", this.modalOTOKBtnListener );
        this.modalOTSelectPropertiesBtn.addEventListener( "click", this.modalOTEditPropertiesListener );
        this.modalSelectPDCancelBtn.addEventListener( "click", this.modalEditPDCancelBtnListener );
        this.modalSelectPDNewPropBtn.addEventListener( "click", this.modalEditPDNewPropBtnListener );
        this.modalNewPDCancelBtn.addEventListener( "click", this.modalNewPDCancelBtnListener );
        this.modalNewPDDataTypeSelect.addEventListener( "change", this.modalNewPDDataTypeChangeListener );
        this.modalNewPDOKBtn.addEventListener( "click", this.modalNewPDOKBtnListener );
        this.modalSelectPDOKBtn.addEventListener( "click", this.modalEditPDOKBtnListener );
        this.modalOTSetNameBtn.addEventListener( "click", this.modalOTSetNameBtnListener );
        this.dropdownMenuBackground.addEventListener( "click", this.dropdownMenuBackgroundListener );
        this.dropdownMenuEdit.addEventListener( "click", this.dropDownMenuEditListener );
        this.dropdownMenuDelete.addEventListener( "click", this.dropDownMenuDeleteListener );


    }



    private unregisterEventListeners(): void {

        this.addBtn.removeEventListener( "click", this.modalOTaddBtnListener );
        this.modalBackground.removeEventListener( "click", this.modalBackgroundListener );
        this.modalOTCancelBtn.removeEventListener( "click", this.modalOTCancelBtnListener );
        this.modalOTOKBtn.removeEventListener( "click", this.modalOTOKBtnListener );
        this.modalOTSelectPropertiesBtn.removeEventListener( "click", this.modalOTEditPropertiesListener );
        this.modalSelectPDCancelBtn.removeEventListener( "click", this.modalEditPDCancelBtnListener );
        this.modalSelectPDNewPropBtn.removeEventListener( "click", this.modalEditPDNewPropBtnListener );
        this.modalNewPDCancelBtn.removeEventListener( "click", this.modalNewPDCancelBtnListener );
        this.modalNewPDDataTypeSelect.removeEventListener( "change", this.modalNewPDDataTypeChangeListener );
        this.modalNewPDOKBtn.removeEventListener( "click", this.modalNewPDOKBtnListener );
        this.modalSelectPDOKBtn.removeEventListener( "click", this.modalEditPDOKBtnListener );
        this.modalOTSetNameBtn.removeEventListener( "click", this.modalOTSetNameBtnListener );
        this.dropdownMenuBackground.removeEventListener( "click", this.dropdownMenuBackgroundListener );
        this.dropdownMenuEdit.removeEventListener( "click", this.dropDownMenuEditListener );
        this.dropdownMenuDelete.removeEventListener( "click", this.dropDownMenuDeleteListener );


    }



    private modalOTaddBtnListener(e: any): void {
        this.modalBackground.style.display = "block";
        this.modalOTOKBtn.innerHTML = "CREATE";
        this.editMode = false;
    }



    private modalBackgroundListener(e: any): void {
        if ( e.target.id === this.modalBackground.id ) this.hideModals();
    }



    private modalOTCancelBtnListener(e: any): void {

        console.info( "cancel btn clicked" );
        this.hideModals();
    }



    private modalOTEditPropertiesListener(e: any): void {
        this.populateEditPropertiesModal();
        this.modalOT.style.display = "none";
        this.modalSelectPD.style.display = "block";
    }



    private modalEditPDCancelBtnListener(e: any): void {
        this.modalSelectPD.style.display = "none";
        this.modalOT.style.display = "block";
    }



    private modalEditPDNewPropBtnListener(e: any): void {
        this.modalSelectPD.style.display = "none";
        this.modalNewPD.style.display = "block";
    }



    private modalNewPDCancelBtnListener(e: any): void {
        this.modalNewPD.style.display = "none";
        this.modalSelectPD.style.display = "block";
    }



    private modalNewPDDataTypeChangeListener(e: any): void {

        const selectValue = parseInt( this.modalNewPDDataTypeSelect.options[ this.modalNewPDDataTypeSelect.selectedIndex ].value );

        if ( selectValue === PropertyDefinitionDatatypes.LOOKUP ) {

            this.modalNewPDObjectTypeContainer.style.display = "block";

            const self = this;

            this.connection.getObjectTypes( (response: any) => {

                const objectTypes = response.objectTypes;

                for ( let i = 0; i < objectTypes.length; i++ ) {

                    let option = document.createElement( "option" );
                    option.text = objectTypes[i].name;
                    option.value = objectTypes[i]._id;

                    self.modalNewPDObjectTypeSelect.add( option );
                }


            }, (message: string) => {
                console.warn( message );
            });

        } else {
            this.modalNewPDObjectTypeContainer.style.display = "none";
        }

    }



    private modalNewPDOKBtnListener(e: any): void {
        const propDef = this.createPropertyDefinition();

        this.modalNewPD.style.display = "none";
        this.modalNewPDDataTypeSelect.value = "1";
        this.modalNewPDObjectTypeContainer.style.display = "none";
        this.modalSelectPD.style.display = "block";


        this.connection.createPropertyDefinition(
            propDef,
            (response: any) => {

                const { propertyDef } = response;

                this.availableProperties.push( propertyDef );

                let propDefItem = document.createElement( "li" );
                propDefItem.id = propertyDef._id;
                propDefItem.className = "ot-select-properties-property";

                let required = document.createElement( "input");
                required.type = "checkbox";
                required.id = propertyDef._id + "-checkbox";
                required.className = "ot-select-properties-modal-property-required-checkbox";

                let propDefName = document.createElement( "span" );
                propDefName.className = "ot-select-properties-modal-property-name";
                propDefName.innerHTML = propertyDef.name;

                let propDefDataType = document.createElement( "span" );
                propDefDataType.className = "ot-select-properties-modal-property-data-type";
                propDefDataType.innerHTML = this.parseDataType( propertyDef.dataType );

                propDefItem.appendChild( required );
                propDefItem.appendChild( propDefName );
                propDefItem.appendChild( propDefDataType );

                this.modalSelectPDPropertyContainer.appendChild( propDefItem );


            },
            (message: string) => {
                console.warn( message );
            }


        )


    }



    private modalEditPDOKBtnListener(e: any): void {




        const propDefElements = this.modalSelectPDPropertyContainer.children;

        for ( let i = 0; i < propDefElements.length; i++ ) {
            let checkbox = document.getElementById( propDefElements[i].id + "-checkbox" ) as HTMLInputElement;

            let result = this.availableProperties.filter( prop => prop._id === propDefElements[i].id );

            if ( result.length > 1 ) console.warn( "Warning, multiple properties with the same id found in the properties collection." );

            if ( ! result.length ){
                console.warn( "Selected property not found in the properties collection." );
                return;
            }

            let prop = result[0];


            if ( checkbox.checked ) {

                if ( this.selectedProperties.filter( p => p._id === prop._id ).length < 1 ) {
                    this.selectedProperties.push( prop );
                }

            } else {

                if ( this.selectedProperties.filter( p => p._id === prop._id ).length > 0 ) {

                    this.selectedProperties = this.selectedProperties.filter( p => p._id !== prop._id );

                }
            }
        }


        this.modalOTPropertiesContainer.innerHTML = "";

        for ( let i = 0; i < this.selectedProperties.length; i++ ) {

            let property = this.selectedProperties[i];

            let propDefItem = document.createElement( "li" );
            propDefItem.id = property._id;
            propDefItem.className = "ot-modal-property";

            let propDefName = document.createElement( "span" );
            propDefName.className = "ot-modal-property-name";
            propDefName.innerHTML = property.name;

            let propDefDataType = document.createElement( "span" );
            propDefDataType.className = "ot-modal-property-data-type";
            propDefDataType.innerHTML = this.parseDataType( property.dataType );


            let propDefRequiredCheckbox = document.createElement( "input" );
            propDefRequiredCheckbox.id = property._id + "-checkbox-required";
            propDefRequiredCheckbox.type = "checkbox";
            propDefRequiredCheckbox.className = "ot-modal-property-required-checkbox";

            if ( property.required ) propDefRequiredCheckbox.checked = true;

            propDefItem.appendChild( propDefName );
            propDefItem.appendChild( propDefRequiredCheckbox );
            propDefItem.appendChild( propDefDataType );

            this.modalOTPropertiesContainer.appendChild( propDefItem );


            propDefItem.addEventListener( "click", this.modalOTPropertySelectionListener );

            propDefRequiredCheckbox.addEventListener( "change", (e: any) => {

                const id = e.target.parentElement.id;

                for ( let i = 0; i < this.selectedProperties.length; i++ ) {

                    if ( this.selectedProperties[i]._id === id ) {

                        this.selectedProperties[i].required = e.target.checked;

                        break;
                    }

                }

            });

        }


        this.modalSelectPD.style.display = "none";
        this.modalOT.style.display = "block";


    }



    private modalOTOKBtnListener(): void {

        const id = this.activeObjectTypeId;
        const name = this.modalOTNameInput.value;
        const nameProperty = this.objectTypeNameProperty;

        const properties = [];

        for ( let prop of this.selectedProperties ) {
            properties.push( { id: prop._id, required: prop.required } );
        }

        this.modalBackground.style.display = "none";
        this.modalOTNameInput.value = "";
        this.modalOTPropertiesContainer.innerHTML = "";

        if ( ! this.editMode ) {

            this.connection.createObjectType(
                {
                    name,
                    nameProperty,
                    properties
                },
                (response: any) => {
                    const { objectType } = response;

                    this.createListItemFromObjectType( objectType );

                },
                (message: string) => {
                    console.warn( message );
                });

        } else {

            this.connection.editObjectType(
                {
                    id,
                    name,
                    nameProperty,
                    properties
                },
                (response: any) => {

                    const { objectType } = response;

                    this.createListItemFromObjectType( objectType );

                },
                (message: string) => {
                    console.warn( message );
                }
            )
        }
    }



    private modalOTPropertySelectionListener(e: any): void {

        const properties = document.getElementsByClassName( "ot-modal-property" );

        for ( let i = 0; i < properties.length; i++ ) {
            properties[i].classList.remove( "property-selected" );
        }


        if ( e.target.classList.contains( "ot-modal-property" ) ) {
            e.target.classList.add( "property-selected" );
        } else {
            e.target.parentElement.classList.add( "property-selected" );
        }

    }



    private modalOTSetNameBtnListener(e: any): void {

        console.log( "set name clicked" );
        console.log( document.getElementsByClassName( "property-selected" ) );

        if ( ! document.getElementsByClassName( "property-selected" ).length ) return;

        console.log( "no return" );

        const property = document.getElementsByClassName( "property-selected" )[0];

        this.objectTypeNameProperty = property.id;

        console.log( "name property " + this.objectTypeNameProperty );

        const checkboxes = document.getElementsByClassName( "ot-modal-property-required-checkbox" );

        console.log( "checkboxes" );
        console.log( checkboxes );

        for ( let i = 0; i < checkboxes.length; i++ ) {
            (checkboxes[i] as HTMLInputElement).disabled = false;
        }

        const checkbox = document.getElementById( property.id + "-checkbox-required" ) as HTMLInputElement;

        console.log( checkbox );

        checkbox.checked = true;
        checkbox.disabled = true;


    }



    private dropdownMenuBackgroundListener(e: any): void {
        if ( e.target.id == this.dropdownMenuBackground.id ) this.dropdownMenuBackground.style.display = "none";
    }



    private dropDownMenuEditListener(e: any): void {

        this.editMode = true;

        console.info( "edit clicked" );
        this.dropdownMenuBackground.style.display = "none";
        this.modalBackground.style.display = "block";
        this.modalOTOKBtn.innerHTML = "SAVE";

        this.modalOTNameInput.value = "";
        this.modalOTPropertiesContainer.innerHTML = "";

        this.connection.getObjectTypeById(
            this.activeObjectTypeId,
            (response: any) => {
                const { objectType } = response;

                this.modalOTNameInput.value = objectType.name;
                this.selectedProperties = objectType.properties;

                for ( let property of objectType.properties ) {

                    let propDefItem = document.createElement( "li" );
                    propDefItem.id = property._id;
                    propDefItem.className = "ot-modal-property";

                    let propDefName = document.createElement( "span" );
                    propDefName.className = "ot-modal-property-name";
                    propDefName.innerHTML = property.name;

                    let propDefDataType = document.createElement( "span" );
                    propDefDataType.className = "ot-modal-property-data-type";
                    propDefDataType.innerHTML = this.parseDataType( property.dataType );


                    let propDefRequiredCheckbox = document.createElement( "input" );
                    propDefRequiredCheckbox.id = property._id + "-checkbox-required";
                    propDefRequiredCheckbox.type = "checkbox";
                    propDefRequiredCheckbox.className = "ot-modal-property-required-checkbox";

                    if ( property.required ) propDefRequiredCheckbox.checked = true;

                    if ( objectType.nameProperty === property._id ) {
                        propDefRequiredCheckbox.checked = true;
                        propDefRequiredCheckbox.disabled = true;
                    }

                    propDefItem.appendChild( propDefName );
                    propDefItem.appendChild( propDefRequiredCheckbox );
                    propDefItem.appendChild( propDefDataType );

                    this.modalOTPropertiesContainer.appendChild( propDefItem );

                    propDefItem.addEventListener( "click", this.modalOTPropertySelectionListener );


                    propDefRequiredCheckbox.addEventListener( "change", (e: any) => {

                        const id = e.target.parentElement.id;

                        for ( let i = 0; i < this.selectedProperties.length; i++ ) {

                            if ( this.selectedProperties[i]._id === id ) {

                                this.selectedProperties[i].required = e.target.checked;

                                break;
                            }

                        }

                    });


                }
            },
            (message: string) => {
                console.warn( message );
            }

        )

    }



    private dropDownMenuDeleteListener(e: any): void {
        console.info( "delete clicked" );
        this.dropdownMenuBackground.style.display = "none";
    }



    private objectTypeItemMousedownListener(e: any): void {
        if ( e.which === 3 ) {
            this.dropdownMenu.style.top = e.pageY + "px";
            this.dropdownMenu.style.left = e.pageX + "px";

            this.activeObjectTypeId = e.target.id;
            this.dropdownMenuBackground.style.display = "block";
        }
    }



    private createListItemFromObjectType(objectType: any): void {
        let otItem = document.createElement( "div" );
        otItem.id = objectType._id;
        otItem.className = "object-type-item";


        let propDefTitle = document.createElement( "p" );
        propDefTitle.className = "object-type-item-title";
        propDefTitle.innerHTML = objectType.name;

        let propDefType = document.createElement( "p" );
        propDefType.className = "object-type-item-properties";
        propDefType.innerHTML = objectType.properties.length;


        otItem.appendChild( propDefTitle );
        otItem.appendChild( propDefType );

        this.objectTypesContainer.appendChild( otItem );

        otItem.addEventListener( "mousedown", this.objectTypeItemMousedownListener );
    }



    private createPropertyDefinition(): IPropertyDefinition {

        const name = this.modalNewPDNameInput.value;
        const dataType = parseInt( this.modalNewPDDataTypeSelect.options[ this.modalNewPDDataTypeSelect.selectedIndex ].value );

        if ( dataType === PropertyDefinitionDatatypes.LOOKUP ) {

            return new PropertyDefinition(
                name,
                dataType,
                this.modalNewPDObjectTypeSelect.options[ this.modalNewPDObjectTypeSelect.selectedIndex ].value,
                []
            )
        } else {
            return new PropertyDefinition(
                name,
                dataType,
                null,
                []
            )
        }


    }



    private hideModals(): void {
        this.modalBackground.style.display  = "none";
        this.modalSelectPD.style.display    = "none";
        this.modalNewPD.style.display       = "none";
        this.modalOT.style.display          = "block";


        this.modalOTPropertiesContainer.innerHTML       = "";
        this.modalSelectPDPropertyContainer.innerHTML   = "";
        this.modalOTNameInput.value                     = "";

    }



    public enterScene(): void {
        this.registerEventListeners();
        this.populate();
    }



    public exitScene(exitType: string): void {
        super.exitScene( exitType );
        this.unregisterEventListeners();

        this.view.componentExited( this.name );
    }



    private populate(): void {

        this.connection.getObjectTypes(
            (response: any) => {

                const { objectTypes } = response;

                if ( objectTypes.length ) this.objectTypesContainer.innerHTML = "";

                for ( let i = 0; i < objectTypes.length; i++ ) {

                    let otItem = document.createElement( "div" );
                    otItem.id = objectTypes[i]._id;
                    otItem.className = "object-type-item";


                    let propDefTitle = document.createElement( "p" );
                    propDefTitle.className = "object-type-item-title";
                    propDefTitle.innerHTML = objectTypes[i].name;

                    let propDefType = document.createElement( "p" );
                    propDefType.className = "object-type-item-properties";
                    propDefType.innerHTML = objectTypes[i].properties.length;


                    otItem.appendChild( propDefTitle );
                    otItem.appendChild( propDefType );

                    this.objectTypesContainer.appendChild( otItem );

                    otItem.addEventListener( "mousedown", this.objectTypeItemMousedownListener );
                }

            },
            (message: string) => {
                console.warn( message );
            }
        )

    }



    private populateEditPropertiesModal(): void {

        this.connection.getPropertyDefinitions(
            (response: any) => {
                const { properties } = response;

                this.availableProperties = properties;

                const currentPropSelection: string[] = this.selectedProperties.map( p => p._id );

                for ( let i = 0; i < properties.length; i++ ) {

                    if ( currentPropSelection.indexOf( properties[i]._id ) > -1 ) continue;

                    let property = document.createElement( "li" );
                    property.id = properties[i]._id;
                    property.className = "ot-select-properties-property";

                    let checkbox = document.createElement( "input" );
                    checkbox.type = "checkbox";
                    checkbox.id = properties[i]._id + "-checkbox";
                    checkbox.className = "ot-select-properties-modal-property-required-checkbox";

                    let name = document.createElement( "span" );
                    name.id = properties[i]._id + "-name";
                    name.className = "ot-select-properties-modal-property-name";
                    name.innerHTML = properties[i].name;

                    let dataType = document.createElement( "span" );
                    dataType.id = properties[i]._id + "-data-type";
                    dataType.className = "ot-select-properties-modal-property-data-type";
                    dataType.innerHTML = this.parseDataType( properties[i].dataType );

                    property.appendChild( checkbox );
                    property.appendChild( name );
                    property.appendChild( dataType );

                    this.modalSelectPDPropertyContainer.appendChild( property );
                }


            },
            (message: string) => {
                console.warn( message );
            }
        )


    }



    private parseDataType( datatype: number): string {

        let val: string = "";

        switch ( datatype ) {

            case PropertyDefinitionDatatypes.BOOLEAN :
                val = "BOOLEAN";
                break;

            case PropertyDefinitionDatatypes.NUMBER :
                val = "NUMBER";
                break;

            case PropertyDefinitionDatatypes.DATE :
                val = "DATE";
                break;

            case PropertyDefinitionDatatypes.TEXT :
                val = "TEXT";
                break;

            case PropertyDefinitionDatatypes.LOOKUP :
                val = "LOOKUP";
                break;

            default :
                break;


        }

        return val;
    }





}