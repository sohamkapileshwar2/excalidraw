import React from "react";
import {
  Distribution,
  DistToParameters,
  ExcalidrawElement,
} from "../element/types";
import { t } from "../i18n";
import { AppState } from "../types";
import { Dialog } from "./Dialog";
import "./ShowBlockProperties.scss";
import { arrayToMap } from "../utils";
import { getSelectedElements } from "../scene";
import { changeProperty } from "../actions/actionProperties";
import { ActionManager } from "../actions/manager";
import SimpleListMenu from "./SimpleMenuList";

const Header = () => (
  <div className="blockPropertiesDialog--header">
    <a
      className="blockPropertiesDialog--btn"
      href="https://github.com/excalidraw/excalidraw#documentation"
      target="_blank"
      rel="noopener noreferrer"
    >
      {t("blockPropertiesDialog.documentation")}
    </a>
    <a
      className="blockPropertiesDialog--btn"
      href="https://blog.excalidraw.com"
      target="_blank"
      rel="noopener noreferrer"
    >
      {t("blockPropertiesDialog.blog")}
    </a>
    <a
      className="blockPropertiesDialog--btn"
      href="https://github.com/excalidraw/excalidraw/issues"
      target="_blank"
      rel="noopener noreferrer"
    >
      {t("blockPropertiesDialog.github")}
    </a>
  </div>
);

const Section = (props: { title: string; children: React.ReactNode }) => (
  <>
    <h3>{props.title}</h3>
    {props.children}
  </>
);

const Columns = (props: { children: React.ReactNode }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    }}
  >
    {props.children}
  </div>
);

const Column = (props: { children: React.ReactNode }) => (
  <div style={{ width: "49%" }}>{props.children}</div>
);

const SubSection = (props: {
  caption: string;
  children: React.ReactNode | void;
}) => (
  <div className="blockPropertiesDialog--island">
    <h3 className="blockPropertiesDialog--island-title">{props.caption}</h3>
    {props.children}
  </div>
);

const TextField = (props: {
  placeholder: string;
  initialValue?: string;
  fieldType: "String" | "Number";
  attributeName: string;
  elementState: any;
  setElementState: any;
}) => {
  const fieldOnChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    fieldType: "String" | "Number",
  ) => {
    const newState = { ...props.elementState };
    if (fieldType === "String") {
      newState[props.attributeName] = event.target.value;
    } else if (fieldType === "Number") {
      newState[props.attributeName] = Number(event.target.value);
    }

    props.setElementState(newState);
  };

  return (
    <div className="blockPropertiesDialog--field">
      <div
        style={{
          display: "flex",
          margin: "0",
          padding: "4px 8px",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          style={{ width: "100%" }}
          placeholder={props.placeholder}
          defaultValue={props.initialValue ? props.initialValue : ""}
          onChange={(event) => {
            fieldOnChange(event, props.fieldType);
          }}
        />
      </div>
    </div>
  );
};

const TextFieldWithName = (props: {
  parameterName: string;
  value: any;
  callback: (enteredValue: number) => void;
}) => {
  return (
    <div className="blockPropertiesDialog--field">
      <div
        style={{
          display: "flex",
          margin: "0",
          padding: "4px 8px",
          alignItems: "center",
        }}
      >
        <div
          style={{
            lineHeight: 1.4,
          }}
        >
          {props.parameterName}
        </div>
        <div
          style={{
            display: "flex",
            flex: "0 0 auto",
            justifyContent: "flex-end",
            marginInlineStart: "auto",
            minWidth: "30%",
          }}
        >
          <input
            type="text"
            //   style={{ width: "100%" }}
            placeholder={props.parameterName}
            defaultValue={props.value}
            onChange={(event) => {
              if (Number(event.target.value)) {
                props.callback(Number(event.target.value));
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

type ShowBlockPropertiesProps = {
  onClose?: () => void;
  appState: AppState;
  elements: readonly ExcalidrawElement[];
  actionManager: ActionManager;
};

type ShowBlockPropertiesState = {
  name: string;
  description: string;
  units: "Hour";
  initialAge: number;
  failureDistribution: Distribution;
  correctiveMaintenanceDistribution: Distribution;
  RF_corrective: number;
  preventiveMaintenanceDistribution: Distribution;
  preventiveMaintenanceType: 0 | 1;
  maintenanceDuration: number;
  RF_preventive: number;
};

export class ShowBlockProperties extends React.Component<
  ShowBlockPropertiesProps,
  ShowBlockPropertiesState
> {
  private elements: readonly ExcalidrawElement[];
  private appState: AppState;
  private onClose: (() => void) | undefined;
  private actionManager: ActionManager;

  constructor(props: ShowBlockPropertiesProps) {
    super(props);
    this.elements = props.elements;
    this.appState = props.appState;
    this.onClose = props.onClose;
    this.actionManager = props.actionManager;

    const selectedElementIds = arrayToMap(
      getSelectedElements(props.elements, props.appState),
    );

    const onlyOneElementSelected = selectedElementIds.size === 1;

    const Element = onlyOneElementSelected
      ? selectedElementIds.entries().next().value[1]
      : null;

    this.state = onlyOneElementSelected
      ? {
          name: Element.name,
          description: Element.description,
          units: Element.units,
          initialAge: Element.initialAge,
          failureDistribution: Element.failureDistribution,
          correctiveMaintenanceDistribution:
            Element.correctiveMaintenanceDistribution,
          RF_corrective: Element.RF_corrective,
          preventiveMaintenanceDistribution:
            Element.preventiveMaintenanceDistribution,

          preventiveMaintenanceType: Element.preventiveMaintenanceType,
          maintenanceDuration: Element.maintenanceDuration,
          RF_preventive: Element.RF_preventive,
        }
      : {
          name: "",
          description: "",
          units: "Hour",
          initialAge: 0,
          failureDistribution: {
            distributionName: "Weibull",
            parameters: DistToParameters["Weibull"],
          },
          correctiveMaintenanceDistribution: {
            distributionName: "Normal",
            parameters: DistToParameters["Normal"],
          },
          RF_corrective: 0,
          preventiveMaintenanceDistribution: {
            distributionName: "DefaultNone",
            parameters: DistToParameters["DefaultNone"],
          },
          preventiveMaintenanceType: 0,
          maintenanceDuration: 0,
          RF_preventive: 0,
        };

    this.setState = this.setState.bind(this);
  }

  handleClose = () => {
    if (this.onClose) {
      this.onClose();
    }
  };

  private setStatePromise(newState: any) {
    return new Promise((resolve: any) => {
      this.setState(newState, () => {
        resolve();
      });
    });
  }

  changeState = (
    key:
      | "failureDistribution"
      | "correctiveMaintenanceDistribution"
      | "preventiveMaintenanceDistribution",
    key2: "distributionName" | "parameters",
    value: any,
  ): Promise<unknown> => {
    const newState: any = { ...this.state };
    newState[key][key2] = value;
    return this.setStatePromise(newState);
    // console.log(elementState, newState);
  };

  changeElementAttributes = (element: ExcalidrawElement) => {
    if (element.type === "block") {
      return {
        ...element,
        ...this.state,
      };
    }
    return element;
  };

  render(): React.ReactNode {
    return (
      <>
        <Dialog
          onCloseRequest={this.handleClose}
          title={t("blockPropertiesDialog.title")}
          className={"blockPropertiesDialog"}
        >
          {/* <Header /> */}
          <Section title={t("blockPropertiesDialog.block")}>
            <Columns>
              <Column>
                <SubSection caption={t("blockPropertiesDialog.name")}>
                  <TextField
                    placeholder="Block Name"
                    initialValue={this.state.name}
                    fieldType="String"
                    attributeName="name"
                    elementState={this.state}
                    setElementState={this.setState}
                  />
                </SubSection>
                <SubSection caption={t("blockPropertiesDialog.units")}>
                  <SimpleListMenu
                    defaultIndex={["Hour"].indexOf(this.state.units)}
                    options={["Hour"]}
                    callback={(event: any, index: number, option: any) => {
                      // this.changeState("units", option);
                    }}
                  />
                </SubSection>
                <SubSection caption={t("blockPropertiesDialog.distribution")}>
                  <SimpleListMenu
                    defaultIndex={["Weibull"].indexOf(
                      this.state.failureDistribution.distributionName,
                    )}
                    options={["Weibull"]}
                    callback={(
                      event: any,
                      index: number,
                      option: "Weibull",
                    ) => {
                      this.changeState(
                        "failureDistribution",
                        "distributionName",
                        option,
                      ).then((_) => {
                        this.changeState(
                          "failureDistribution",
                          "parameters",
                          DistToParameters[option],
                        );
                      });
                    }}
                  />
                </SubSection>
              </Column>
              <Column>
                <SubSection caption={t("blockPropertiesDialog.description")}>
                  <TextField
                    placeholder="Block Description"
                    initialValue={this.state.description}
                    fieldType="String"
                    attributeName="description"
                    elementState={this.state}
                    setElementState={this.setState}
                  />
                </SubSection>
                <SubSection caption={t("blockPropertiesDialog.currentAge")}>
                  <TextField
                    placeholder="Current Age"
                    initialValue={String(this.state.initialAge)}
                    fieldType="Number"
                    attributeName="initialAge"
                    elementState={this.state}
                    setElementState={this.setState}
                  />
                </SubSection>
                <SubSection
                  caption={t("blockPropertiesDialog.fittedParameters")}
                >
                  {Object.entries(
                    this.state.failureDistribution.parameters,
                  ).map((item, index) => {
                    return (
                      <TextFieldWithName
                        key={item[0]}
                        parameterName={item[0]}
                        value={item[1]}
                        callback={(enteredValue: number) => {
                          const newParameters: any = {
                            ...this.state.failureDistribution.parameters,
                          };
                          newParameters[item[0]] = enteredValue;
                          this.changeState(
                            "failureDistribution",
                            "parameters",
                            newParameters,
                          );
                        }}
                      />
                    );
                  })}
                </SubSection>
              </Column>
            </Columns>
          </Section>

          <Section title={t("blockPropertiesDialog.correctiveMaintenance")}>
            <Columns>
              <Column>
                <SubSection caption={t("blockPropertiesDialog.distribution")}>
                  <SimpleListMenu
                    defaultIndex={["DefaultNone", "Normal"].indexOf(
                      this.state.correctiveMaintenanceDistribution
                        .distributionName,
                    )}
                    options={["DefaultNone", "Normal"]}
                    callback={(
                      event: any,
                      index: number,
                      option: "DefaultNone" | "Normal",
                    ) => {
                      this.changeState(
                        "correctiveMaintenanceDistribution",
                        "distributionName",
                        option,
                      ).then((_) => {
                        this.changeState(
                          "correctiveMaintenanceDistribution",
                          "parameters",
                          DistToParameters[option],
                        );
                      });
                    }}
                  />
                </SubSection>
                <SubSection caption={t("blockPropertiesDialog.RF")}>
                  <TextField
                    placeholder="Restoration Factor for corrective maintenance"
                    initialValue={String(this.state.RF_corrective)}
                    fieldType="Number"
                    attributeName="RF_corrective"
                    elementState={this.state}
                    setElementState={this.setState}
                  />
                </SubSection>
              </Column>
              <Column>
                <SubSection
                  caption={t("blockPropertiesDialog.fittedParameters")}
                >
                  {Object.entries(
                    this.state.correctiveMaintenanceDistribution.parameters,
                  ).map((item, index) => {
                    return (
                      <TextFieldWithName
                        key={item[0]}
                        parameterName={item[0]}
                        value={item[1]}
                        callback={(enteredValue: number) => {
                          const newParameters: any = {
                            ...this.state.correctiveMaintenanceDistribution
                              .parameters,
                          };
                          newParameters[item[0]] = enteredValue;
                          this.changeState(
                            "correctiveMaintenanceDistribution",
                            "parameters",
                            newParameters,
                          );
                        }}
                      />
                    );
                  })}
                </SubSection>
              </Column>
            </Columns>
          </Section>

          <Section title={t("blockPropertiesDialog.preventiveMaintenance")}>
            <Columns>
              <Column>
                <SubSection caption={t("blockPropertiesDialog.type")}>
                  <SimpleListMenu
                    defaultIndex={[0, 1].indexOf(
                      this.state.preventiveMaintenanceType,
                    )}
                    options={["Time Based", "Age Based"]}
                    callback={(event: any, index: number, option: any) => {
                      // console.log(option)
                      const newState: any = {
                        ...this.state,
                        preventiveMaintenanceType: [
                          "Time Based",
                          "Age Based",
                        ].indexOf(option),
                      };
                      this.setState(newState);
                    }}
                  />
                </SubSection>
                <SubSection caption={t("blockPropertiesDialog.distribution")}>
                  <SimpleListMenu
                    defaultIndex={["DefaultNone", "Normal"].indexOf(
                      this.state.preventiveMaintenanceDistribution
                        .distributionName,
                    )}
                    options={["DefaultNone", "Normal"]}
                    callback={(
                      event: any,
                      index: number,
                      option: "DefaultNone" | "Normal",
                    ) => {
                      this.changeState(
                        "preventiveMaintenanceDistribution",
                        "distributionName",
                        option,
                      ).then((_) => {
                        this.changeState(
                          "preventiveMaintenanceDistribution",
                          "parameters",
                          DistToParameters[option],
                        );
                      });
                    }}
                  />
                </SubSection>
                <SubSection caption={t("blockPropertiesDialog.RF")}>
                  <TextField
                    placeholder="Restoration Factor for preventive maintenance"
                    initialValue={String(this.state.RF_preventive)}
                    fieldType="Number"
                    attributeName="RF_preventive"
                    elementState={this.state}
                    setElementState={this.setState}
                  />
                </SubSection>
              </Column>
              <Column>
                <SubSection caption={t("blockPropertiesDialog.interval")}>
                  <TextField
                    placeholder="Fixed Interval for preventive maintenance"
                    initialValue={String(this.state.maintenanceDuration)}
                    fieldType="Number"
                    attributeName="maintenanceDuration"
                    elementState={this.state}
                    setElementState={this.setState}
                  />
                </SubSection>
                <SubSection
                  caption={t("blockPropertiesDialog.fittedParameters")}
                >
                  {Object.entries(
                    this.state.preventiveMaintenanceDistribution.parameters,
                  ).map((item, index) => {
                    return (
                      <TextFieldWithName
                        key={item[0]}
                        parameterName={item[0]}
                        value={item[1]}
                        callback={(enteredValue: number) => {
                          const newParameters: any = {
                            ...this.state.preventiveMaintenanceDistribution
                              .parameters,
                          };
                          newParameters[item[0]] = enteredValue;
                          this.changeState(
                            "preventiveMaintenanceDistribution",
                            "parameters",
                            newParameters,
                          );
                        }}
                      />
                    );
                  })}
                </SubSection>
              </Column>
            </Columns>
          </Section>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              style={{ marginRight: "10px", width: "70px", height: "35px" }}
              onClick={() => {
                this.actionManager.updater({
                  elements: changeProperty(
                    this.elements,
                    this.appState,
                    this.changeElementAttributes,
                  ),
                  appState: this.appState,
                  commitToHistory: true,
                });
                this.handleClose();
              }}
            >
              {t("buttons.Save")}
            </button>
            <button
              style={{ marginRight: "10px", width: "70px", height: "35px" }}
              onClick={() => {
                this.handleClose();
              }}
            >
              {t("buttons.cancel")}
            </button>
          </div>
        </Dialog>
      </>
    );
  }
}
