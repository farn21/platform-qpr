/** @jsx jsx */
import * as React from "react";
import { jsx, css } from "@emotion/core";
import PropTypes from "prop-types";
import "moment-timezone";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { connect } from "react-redux";
import FormField from "../form-fields/form-field";
import { Button } from "../atoms/buttons";
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import config from "config";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { datasetPlacesSelector } from "../../state/ducks/places";
import mapseedApiClient from "../../client/mapseed-api-client";
import { Map, OrderedMap } from "immutable";
import { RegularText } from "../atoms/typography";

import {
  datasetsConfigPropType,
  datasetsConfigSelector,
} from "../../state/ducks/datasets-config";
import {
  dashboardConfigSelector,
  DashboardsConfig,
} from "../../state/ducks/dashboard-config";
import { appConfigSelector, AppConfig } from "../../state/ducks/app-config";
import {
  placeFormsConfigSelector,
  PlaceFormsConfig,
  formFieldsConfigSelector,
  FormFieldsConfig,
} from "../../state/ducks/forms-config";
import { hasAdminAbilities } from "../../state/ducks/user";
import { RegularTitle, SmallText, ExternalLink, TinyTitle } from "../atoms/typography";
import { FontAwesomeIcon } from "../atoms/imagery";
import ChartWrapper from "../organisms/dashboard/chart-wrapper";

import constants from "../../constants";

type StateProps = {
  dashboardConfig: DashboardsConfig;
  appConfig: AppConfig;
  hasAdminAbilities: Function;
  datasetPlacesSelector: Function;
  placeFormsConfig: PlaceFormsConfig;
  formFieldsConfig: FormFieldsConfig;
  datasetsConfig: PropTypes.InferProps<typeof datasetsConfigPropType>;
};

const HEADER_HEIGHT = "56px";


type OwnProps = {
  apiRoot: string;
};

type Props = StateProps & OwnProps & RouteComponentProps<{}>;

interface State {
  fieldPassword: any;
  fieldUsername: any;
  anchorEl: any;
  dashboard: any;
}

class Dashboard extends React.Component<Props, State> {
  allowedDashboardConfigs;
  state: State = {
    fieldUsername: OrderedMap(),
    fieldPassword: OrderedMap(),
    anchorEl: null,
    dashboard: null,
  };

  componentDidMount() {
    this.allowedDashboardConfigs = this.props.dashboardConfig.filter(config =>
      this.props.hasAdminAbilities(config.datasetSlug),
    );

    if (this.allowedDashboardConfigs.length < 1) {
      // If the current user has no admin privileges in any dataset configured
      // for a dashboard, then route away from the dashboard.
      this.props.history.push("/");
    } else {
      this.setState({
        dashboard: this.allowedDashboardConfigs[0],
      });
    }
  }

  toggleDashboardDropdown = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  closeDashboardDropdown = () => {
    this.setState({ anchorEl: null });
  };

  selectAndCloseDashboardDropdown = newDashboardConfig => {
    this.setState({
      anchorEl: null,
      dashboard: newDashboardConfig,
    });
  };

  onCreateUser(event) {
    var f = document.querySelector("#userNewForm")
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    var formData = new FormData(f)
    mapseedApiClient.user.create(config.app.api_root, formData)
    event.preventDefault();
  }

  render() {
    const dataset =
      this.state.dashboard &&
      this.props.datasetsConfig.find(
        config => config.slug === this.state.dashboard.datasetSlug,
      );

    return this.state.dashboard ? (
      <div
        css={css`
          overflow: auto;
          width: 100%;
          height: calc(100% - ${constants.HEADER_HEIGHT}px);
          background-color: ${this.state.dashboard.backgroundColor ||
          "#ece6e6"};

          &::-webkit-scrollbar {
            width: 0;
          }
        `}
      >
        <div
          css={css`
            width: 95%;
            margin-left: auto;
            margin-right: auto;
            margin-top: 48px;
            display: flex;
            align-items: center;
          `}
        >
          <div
            css={css`
              display: flex;
              width: 100%;
              justify-content: space-between;
              border-bottom: 1px solid #ccc;
            `}
          >
            <RegularTitle>{this.state.dashboard.header}</RegularTitle>
            <div
              css={css`
                display: flex;
                align-items: center;
              `}
            >
              {this.allowedDashboardConfigs.length > 1 && (
                <div>
                  <Button
                    variant="badge"
                    color="#cd8888"
                    onClick={this.toggleDashboardDropdown}
                  >
                    <SmallText
                      weight="black"
                      css={css`
                        color: white;
                        margin-right: 8px;
                      `}
                    >
                      View Another Dataset
                    </SmallText>
                    <FontAwesomeIcon
                      fontSize="0.7rem"
                      color="#fff"
                      faClassname="fa fa-chevron-down"
                    />
                  </Button>
                  <Menu
                    id="simple-menu"
                    anchorEl={this.state.anchorEl}
                    open={Boolean(this.state.anchorEl)}
                    onClose={this.closeDashboardDropdown}
                  >
                    {this.allowedDashboardConfigs.map(dashboardConfig => {
                      const dataset = this.props.datasetsConfig.find(
                        config => config.slug === dashboardConfig.datasetSlug,
                      );

                      return (
                        <MenuItem
                          selected={
                            dashboardConfig.datasetSlug ===
                            this.state.dashboard.datasetSlug
                          }
                          key={dashboardConfig.datasetSlug}
                          onClick={() => {
                            this.selectAndCloseDashboardDropdown(
                              dashboardConfig,
                            );
                          }}
                        >{`${dataset.clientSlug}`}</MenuItem>
                      );
                    })}
                  </Menu>
                </div>
              )}
              {this.state.dashboard.isExportable && (
                <Button
                  css={css`
                    margin-left: 8px;
                  `}
                  variant="badge"
                  color="#cd8888"
                >
                  <ExternalLink
                    css={css`
                      display: flex;
                    `}
                    href={`${this.props.apiRoot}smartercleanup/datasets/${dataset.slug}/mapseed-places.csv?format=csv&include_submissions&include_private_places&include_private_fields&page_size=10000`}
                  >
                    <SmallText
                      weight="black"
                      css={css`
                        color: white;
                        margin-right: 8px;
                      `}
                    >
                      Exportar en csv
                    </SmallText>
                    <FontAwesomeIcon
                      fontSize="0.7rem"
                      color="#fff"
                      faClassname="fa fa-chevron-right"
                    />
                  </ExternalLink>
                </Button>
              )}
            </div>
          </div>
        </div>
        <div
          css={css`
            display: grid;
            grid-template-columns: repeat(12, 1fr); // 12-column grid
            grid-gap: 8px;
            grid-auto-rows: auto;
            margin: 24px auto 24px auto;
            width: 95%;
            box-sizing: border-box;
          `}
        >
          {this.state.dashboard.widgets.map((widget, i) => (
            <ChartWrapper
              key={i}
              widget={widget}
              widgetIndex={i}
              timeZone={this.props.appConfig.time_zone}
              places={this.props.datasetPlacesSelector(
                this.state.dashboard.datasetSlug,
              )}
            />
          ))}
          <div
            ref="asdasd"
            css={css`
              background-color: #fff;
              margin: 8px;
              border-radius: 4px;
              box-sizing: border-box;
              box-shadow: 0 2px 3px hsla(0, 0%, 0%, 0.3),
                0 3px 5px hsla(0, 0%, 0%, 0.1);
            `}
          >
          <div
          css={css`
            height: ${HEADER_HEIGHT};
            max-height: ${HEADER_HEIGHT};
            color: #777;
            font-weight: 900;
            border-top-right-radius: 4px;
            border-top-left-radius: 4px;
            background-color: #f5f5f5;
            padding: 8px 16px 8px 16px;
            box-sizing: border-box;
          `}
        >
        <FontAwesomeIcon
        color="#777"
        hoverColor="#777"
        faClassname=""
      />
      <TinyTitle
        css={css`
          margin: 0 0 0 12px;
          display: inline-block;
        `}
      >
      Creación de Usuarios
      </TinyTitle>
    </div>
    <div
    css={css`
      width: 100%;
      height: calc(100% - ${HEADER_HEIGHT});
    `}
  >
  <div
  key="asdasd"
  css={css`
    margin-top: 32px;
    padding-left: 16px;
    padding-right: 16px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  `}
>
            <form id="userNewForm" onSubmit={this.onCreateUser} css={css`margin-bottom: 50px; width: 500px;`} className="place-form" >
              <FormField formId="userNewForm" fieldState={this.state.fieldUsername} fieldConfig={{placeholder: "Usuario", display_prompt: "Usuario", name:"username", type: "text", prompt: "Usuario"}} onFieldChange={()=>{}} showValidityStatus={true} >
              </FormField>
              <FormField formId="userNewForm" fieldState={this.state.fieldPassword} fieldConfig={{placeholder: "Contraseña", display_prompt: "Contraseña", name:"password1", type: "text", prompt: "Contraseña"}} onFieldChange={()=>{}} showValidityStatus={true} >
              </FormField>
              <Button  variant="flat"
              onClick={this.onCreateUser}
              color="primary"
              size="regular" >
              <RegularText>{"Crear"}</RegularText>
              </Button>
            </form>
          </div>
        </div>
          </div>
        </div>
      </div>
    ) : null;
  }
}

type MapseedReduxState = any;

const mapStateToProps = (state: MapseedReduxState): StateProps => ({
  appConfig: appConfigSelector(state),
  hasAdminAbilities: datasetSlug => hasAdminAbilities(state, datasetSlug),
  datasetPlacesSelector: datasetSlug =>
    datasetPlacesSelector(datasetSlug, state),
  dashboardConfig: dashboardConfigSelector(state),
  placeFormsConfig: placeFormsConfigSelector(state),
  formFieldsConfig: formFieldsConfigSelector(state),
  datasetsConfig: datasetsConfigSelector(state),
});

export default withRouter(
  connect<StateProps, OwnProps>(mapStateToProps)(Dashboard),
);
