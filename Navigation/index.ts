/* eslint-disable no-undef */
import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class Navigation implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    /**
        * Variable for HTML elements
        */
    private nextButtonElement: HTMLElement;
    private previousButtonElement: HTMLElement;
    private spaceElement: HTMLElement;

    /**
     * Variable for Properties
     */
    private inputValue: number | undefined = undefined;


    /**
     * Variables for event Listener
     */

    private nextButtonClicked: EventListenerOrEventListenerObject;
    private PreviousButtonClicked: EventListenerOrEventListenerObject;

    /**
     *Local Variables
     */
    private localNotifyOutputChanged: () => void;

    /**
     * Empty constructor.
     */
    constructor() {

    }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement): void {
        // Add control initialization code

        //init local variable
        this.localNotifyOutputChanged = notifyOutputChanged;


        //Configure buttons
        this.nextButtonElement = document.createElement("a");
        this.nextButtonElement.setAttribute("class", "next");
        this.nextButtonElement.addEventListener("click", this.nextOnClick.bind(this));

        this.previousButtonElement = document.createElement("a");
        this.previousButtonElement.setAttribute("class", "previous");
        this.previousButtonElement.addEventListener("click", this.previousOnClick.bind(this));

        //space element
        this.spaceElement = document.createElement("span");

        //Add Elements to the container
        let _previous = container.appendChild(this.previousButtonElement);
        let _space = container.appendChild(this.spaceElement);
        let _next = container.appendChild(this.nextButtonElement);

        //Set the value of the input
        _previous.innerHTML = "&laquo; Previous";
        _space.innerHTML = "&nbsp;";
        _next.innerHTML = "Next &raquo;";
    }


    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void {
        // Add code to update control view
        this.inputValue = context.parameters.CurrentValue.raw ?? 0;
        if (this.inputValue === undefined) {
            this.inputValue = 0;
        }
        try {
            //@ts-ignore
            let tabs = Xrm.Page.ui.tabs;
            //@ts-ignore
            let maxCount = tabs.getAll().length;
            let minCount = 0;

            if (this.inputValue > maxCount && this.inputValue < minCount) {
                this.inputValue = 0;
            }

            tabs.get(this.inputValue).setFocus();
            let attributeName = context.parameters.CurrentValue.attributes == undefined ? "" : context.parameters.CurrentValue.attributes.LogicalName;

            if (attributeName != "") {
                //@ts-ignore
                Xrm.Page.getAttribute(attributeName).setValue(this.inputValue);
            }
        }
        catch (ex) {
            console.log(ex);
        }
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs {
        return {
            CurrentValue: this.inputValue
        };
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
    }

    /**
     * Custom Event Handlers
     */
    private nextOnClick(event: Event): void {
        if (this.inputValue === undefined) {
            this.inputValue = 0;
        } else {
            this.inputValue++;
        }
        this.localNotifyOutputChanged();
    }

    private previousOnClick(event: Event): void {
        if (this.inputValue === undefined) {
            this.inputValue = 0;
        } else {
            this.inputValue--;
        }
        this.localNotifyOutputChanged();
    }
}
