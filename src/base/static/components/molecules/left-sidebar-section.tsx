/** @jsx jsx */
import * as React from "react";
import { connect } from "react-redux";
import styled from "../../utils/styled";
import { withTranslation, WithTranslation } from "react-i18next";
import { jsx, css } from "@emotion/core";

import { FontAwesomeIcon, LoadingSpinner } from "../atoms/imagery";
import { HorizontalRule } from "../atoms/layout";
import { TinyTitle } from "../atoms/typography";
import { Button } from "../atoms/buttons";
import InfoModal from "../organisms/info-modal";

import {
  sourcesMetadataSelector,
  layerGroupsSelector,
  updateLayerGroupVisibility,
  LayerGroups,
  SourcesMetadata,
} from "../../state/ducks/map-style";
import {
  LeftSidebarSection,
  LeftSidebarOption,
} from "../../state/ducks/left-sidebar";
import { MapSourcesLoadStatus } from "../../state/ducks/map";

const MapLayerSelectorContainer = styled("div")(
  (props: { isWithModal: boolean }) => ({
    display: "flex",
    alignItems: "center",
    paddingLeft: "16px",
    paddingRight: props.isWithModal ? "16px" : "40px",
    marginBottom: "16px",
  }),
);

const LayerGroupsStatusContainer = styled("span")({
  display: "flex",
  alignItems: "center",
  width: "24px",
  height: "24px",
  marginLeft: "16px",
});

const SpinnerContainer = styled("div")({
  flex: 1,
  position: "relative",
  marginLeft: "8px",
});

const LayerGroupStatusIcon = styled(props => (
  <FontAwesomeIcon
    className={props.className}
    faClassname={props.faClassname}
    color={props.color}
  />
))({
  marginLeft: "8px",
  textAlign: "center",
});

const statusIcons = {
  loaded: "fas fa-check",
  error: "fas fa-times",
};

const statusColors = {
  loaded: "#22c722",
  error: "#ff0000",
};

type MapLayerSelectorProps = {
  isLayerGroupVisible: boolean;
  icon?: string;
  id: string;
  loadStatus: string;
  onToggleLayerGroup: any;
  isSelected: boolean;
  t: Function;
  option: LeftSidebarOption;
  onClickInfoIcon: (modal: { header: string; body: string[] }) => void;
};

const OptionSelector: React.FunctionComponent<MapLayerSelectorProps> = props => {
  return (
    <MapLayerSelectorContainer
      isWithModal={Boolean(props.option.modal)}
      className="mapseed-map-layer-selector-container"
    >
      <span
        css={{
          display: "flex",
          flex: 1,
          alignItems: "center",

          "&:hover": {
            cursor: "pointer",
          },
        }}
        onClick={props.onToggleLayerGroup}
      >
        <span
          css={theme => ({
            flex: 6,
            backgroundColor: props.isLayerGroupVisible ? "#f0a300" : "initial",
            fontFamily: theme.text.bodyFontFamily,

            "&:hover": {
              backgroundColor: props.isLayerGroupVisible
                ? "#f0a300"
                : "#ffffd4",
            },
          })}
        >
          {props.t(`layerPanelOption${props.id}`, props.option.title)}
        </span>
        <LayerGroupsStatusContainer>
          {props.isLayerGroupVisible && props.loadStatus === "loading" && (
            <SpinnerContainer className="map-layer-status-spinner">
              <LoadingSpinner size={10} />
            </SpinnerContainer>
          )}
          {props.isLayerGroupVisible &&
            (props.loadStatus === "loaded" || props.loadStatus === "error") && (
              <LayerGroupStatusIcon
                faClassname={statusIcons[props.loadStatus]}
                color={statusColors[props.loadStatus]}
              />
            )}
        </LayerGroupsStatusContainer>
      </span>
      {props.option.modal && (
        <Button
          css={css`
            padding: 0 0 0 8px;
            background: transparent;
          `}
          onClick={() => props.onClickInfoIcon(props.option.modal!)}
        >
          <FontAwesomeIcon color="#aaa" faClassname="fas fa-info-circle" />
        </Button>
      )}
    </MapLayerSelectorContainer>
  );
};

type OwnProps = {
  section: LeftSidebarSection;
  mapSourcesLoadStatus: MapSourcesLoadStatus;
  layerPanelSectionIndex: number;
};

type StateProps = {
  layerGroups: LayerGroups;
  sourcesMetadata: SourcesMetadata;
};

type DispatchProps = {
  updateLayerGroupVisibility: typeof updateLayerGroupVisibility;
};

type Props = OwnProps & StateProps & DispatchProps & WithTranslation;

type State = {
  isInfoModalOpen: boolean;
  infoModalHeader: string;
  infoModalBody: string[];
};

class LeftSidebarSectionSelector extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      isInfoModalOpen: false,
      infoModalHeader: "",
      infoModalBody: [],
    };
  }

  onToggleLayerGroup = layerGroup => {
    if (layerGroup.isBasemap && layerGroup.isVisible) {
      // Prevent toggling the current visible basemap.
      return;
    }

    this.props.updateLayerGroupVisibility(layerGroup.id, !layerGroup.isVisible);
  };

  render() {
    return (
      <span>
        <div>
          <HorizontalRule spacing="tiny" />
          <TinyTitle
            css={css`
              margin-bottom: 16px;
            `}
          >
            {this.props.t(
              `layerPanelSectionTitle${this.props.layerPanelSectionIndex}`,
              this.props.section.title,
            )}
          </TinyTitle>
          {this.props.section.options.map(option => {
            // Assume at first that all sources consumed by layers in this
            // layerGroup have loaded.
            let loadStatus = "loaded";
            const layerGroup = this.props.layerGroups.byId[option.layerGroupId];
            const sourcesStatus = layerGroup.sourceIds.map(sourceId =>
              this.props.mapSourcesLoadStatus[sourceId]
                ? this.props.mapSourcesLoadStatus[sourceId]
                : "unloaded",
            );

            if (sourcesStatus.includes("error")) {
              // If any source has an error, set the entire layerGroupPanel's
              // status to "error".
              loadStatus = "error";
            } else if (sourcesStatus.includes("loading")) {
              // Otherwise, if any source is still loading, set the entire
              // layerGroupPanel's status to "loading".
              loadStatus = "loading";
            }

            return (
              <OptionSelector
                key={option.layerGroupId}
                id={option.layerGroupId}
                option={option}
                loadStatus={loadStatus}
                isLayerGroupVisible={layerGroup.isVisible}
                isSelected={true}
                onClickInfoIcon={(modalContent: {
                  header: string;
                  body: string[];
                }) => {
                  this.setState({
                    isInfoModalOpen: true,
                    infoModalHeader: modalContent.header,
                    infoModalBody: modalContent.body,
                  });
                }}
                onToggleLayerGroup={() => this.onToggleLayerGroup(layerGroup)}
                t={this.props.t}
              />
            );
          })}
        </div>
        <InfoModal
          isModalOpen={this.state.isInfoModalOpen}
          header={this.state.infoModalHeader}
          body={this.state.infoModalBody}
          onClose={() => {
            this.setState({ isInfoModalOpen: false });
          }}
        />
      </span>
    );
  }
}

const mapStateToProps = (state: any, ownProps: OwnProps): StateProps => ({
  layerGroups: layerGroupsSelector(state),
  sourcesMetadata: sourcesMetadataSelector(state),
  ...ownProps,
});

const mapDispatchToProps = {
  updateLayerGroupVisibility,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation("MapLayerPanelSection")(LeftSidebarSectionSelector));
