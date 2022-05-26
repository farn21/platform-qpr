/** @jsx jsx */
import * as React from "react";
import PropTypes from "prop-types";
import { jsx } from "@emotion/core";
import styled from "@emotion/styled";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import {
  filteredPlacesSelector,
  placesPropType,
} from "../../state/ducks/places";
import {
  placeConfigSelector,
  placeConfigPropType,
} from "../../state/ducks/place-config";
import {
  uiVisibilitySelector,
  updateCurrentTemplate,
} from "../../state/ducks/ui";
import PlaceListItem from "../molecules/place-list-item";
import AddNewsButton from "../molecules/add-news-button";
import Button from "@material-ui/core/Button";
import { TextInput } from "../atoms/input";
import { CloseButton, BackButton } from "../atoms/buttons";

import {
  AutoSizer,
  List,
  CellMeasurer,
  CellMeasurerCache,
} from "react-virtualized";

// Most of react-virtualized's styles are functional (eg position, size).
// Functional styles are applied directly to DOM elements.
// The Table component ships with a few presentational styles as well.
// They are optional, but if you want them you will need to also import the CSS file.
// This only needs to be done once; probably during your application's bootstrapping process.
import "react-virtualized/styles.css";

const cache = new CellMeasurerCache({
  defaultHeight: 160,
  fixedWidth: true,
});

const ListViewContainer = styled("div")({
  backgroundColor: "#fff",
  width: "100%",
  // HACK: We are horizonally centering all content, and clipping the
  // height at 80%, to work around a layout issue where the scrollbars
  // are getting clipped off the right edge. This is because the html
  // body element is larger than 100% for some reason...
  // We should be able to fix this when we port over base.hbs.
  height: "80%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const ListViewContent = styled("div")({
  marginTop: "80px",
  height: "100%",
  width: "100%",
});

const MAX_LIST_WIDTH = "1120px";
const ListHeader = styled("div")({
  margin: "8px auto 24px auto",
  maxWidth: MAX_LIST_WIDTH,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexDirection: "column",
});

const SearchContainer = styled("div")({
  display: "flex",
  alignItems: "center",
});

const SortButton = buttonProps => (
  <div className="filter-button-container">
    <Button
      className={buttonProps.className}
      css={theme => ({
        marginRight: "16px",
        fontFamily: theme.text.headerFontFamily,
      })}
      onClick={buttonProps.onClick}
    >
      {buttonProps.children}
    </Button>
    <div
      className={buttonProps.checkboxClassName}
      onClick={buttonProps.onClick}
    >
      <i className="fas fa-check"></i>
    </div>
  </div>
);

const ButtonContainer = styled("div")({});

class PlaceList extends React.Component {
  componentDidMount() {
    this.props.updateCurrentTemplate("placeList");
  }

  _sortAndFilterPlaces = (places, sortBy, query) => {
    // only render place surveys that are flagged with 'includeOnList':
    const includedPlaces = places.filter(place => {
      const placeDetailConfig = this.props.placeConfig.place_detail.find(
        survey => survey.category === place.location_type,
      );

      return typeof placeDetailConfig === "undefined"
        ? false
        : placeDetailConfig.includeOnList;
    });
    const filteredPlaces = query
      ? includedPlaces.filter(place => {
          return Object.values(place).some(field => {
            // TODO: make sure the field is only within the matching
            // fields - we don't want false positives from the Place
            // model's `dataset` field, for example.
            return (
              typeof field === "string" && field.toLowerCase().includes(query)
            );
          });
        })
      : [...includedPlaces];
    const sortedFilteredPlaces = filteredPlaces.sort((a, b) => {
      if (sortBy === "dates") {
        return new Date(b.created_datetime) - new Date(a.created_datetime);
      } else if (sortBy === "supports") {
        const bSupports = b.submission_sets.support || [];
        const aSupports = a.submission_sets.support || [];
        return bSupports.length - aSupports.length;
      } else if (sortBy === "comments") {
        const bComments = b.submission_sets.comments || [];
        const aComments = a.submission_sets.comments || [];
        return bComments.length - aComments.length;
      }
    });
    return sortedFilteredPlaces;
  };

  _setSortAndFilterPlaces = () => {
    const sortedFilteredPlaces = this._sortAndFilterPlaces(
      this.props.places,
      this.state.sortBy,
      this.state.query.toLowerCase(),
    );
    cache.clearAll();
    this.setState({
      places: sortedFilteredPlaces,
    });
    this.virtualizedList.forceUpdateGrid();
  };

  virtualizedList = null;
  setVirtualizedList = element => {
    this.virtualizedList = element;
  };

  state = {
    sortBy: "dates",
    places: this._sortAndFilterPlaces(this.props.places, "dates", ""),
    query: "",
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.places.length !== this.props.places.length ||
      prevState.sortBy !== this.state.sortBy
    ) {
      this._setSortAndFilterPlaces();
    }
  }

  _noRowsRenderer = () => {
    // TODO: a place holder, similar to youtube, would be nice here:
    return null;
  };

  _rowRenderer = ({ index, key, parent, style }) => {
    const place = this.state.places[index];
    return (
      <CellMeasurer
        cache={cache}
        columnIndex={0}
        key={key}
        parent={parent}
        rowIndex={index}
      >
        {/* measures the row height when the PlaceListItem's image has finished loading: */}
        {({ measure }) => (
          <div role="row" style={style} key={place.id}>
            <PlaceListItem
              place={place}
              onLoad={measure}
              router={this.props.router}
              t={this.props.t}
            />
          </div>
        )}
      </CellMeasurer>
    );
  };

  render() {
    return (
      <ListViewContainer className="list-view-container">
        <ListViewContent>
          <CloseButton
            css={{
              position: "absolute",
              top: this.props.layout === "desktop" ? "10px" : "-33px",
              left: this.props.layout === "desktop" ? "-33px" : "10px",
              borderTopLeftRadius: "8px",
              borderTopRightRadius: this.props.layout === "desktop" ? 0 : "8px",
              borderBottomLeftRadius:
                this.props.layout === "desktop" ? "8px" : 0,
              backgroundColor: "#fff",
              outline: "none",
              border: "none",
              fontSize: this.props.layout === "desktop" ? "24px" : "16px",
              color: "#ff5e99",
              boxShadow:
                this.props.layout === "desktop"
                  ? "-4px 4px 3px rgba(0,0,0,0.1)"
                  : "4px -4px 3px rgba(0,0,0,0.1)",
              padding:
                this.props.layout === "desktop"
                  ? "9px 10px 8px 10px"
                  : "10px 16px 10px 16px",

              "&:hover": {
                color: "#cd2c67",
                cursor: "pointer",
              },
            }}
            layout={this.props.layout}
            onClick={evt => {
              evt.preventDefault();
              this.props.history.push("/");
            }}
          />
          <BackButton
            layout={this.props.layout}
            onClick={evt => {
              evt.preventDefault();
              this.props.history.push("/");
            }}
          />
          <h1 className="news-title">Novedades</h1>
          <ListHeader>
            <SearchContainer className="search-container">
              <TextInput
                className="news-search-input"
                placeholder={`${this.props.t("search", "Search")}...`}
                color="accent"
                ariaLabel="search list by text"
                onKeyPress={evt => {
                  if (evt.key === "Enter") {
                    this._setSortAndFilterPlaces();
                  }
                }}
                name="place-list-search"
                value={this.state.query}
                onChange={evt => {
                  this.setState({ query: evt.target.value });
                }}
              />
              <Button
                className="news-search-button"
                css={theme => ({
                  marginLeft: "16px",
                  fontFamily: theme.text.headerFontFamily,
                })}
                color="primary"
                onClick={this._setSortAndFilterPlaces}
                variant="contained"
              >
                {this.props.t("search", "Search")}
              </Button>
            </SearchContainer>
            <h3 className="filter-title">Filtros</h3>
            <ButtonContainer className="filter-container">
              {/**<AddNewsButton onClick={() => {this.props.history.push("/new")}}>Cargar novedad</AddNewsButton> */}

              <SortButton
                className="filter-button"
                checkboxClassName={`filter-checkbox ${
                  this.state.sortBy === "dates" && "selected"
                }`}
                isActive={this.state.sortBy === "dates"}
                onClick={() => this.setState({ sortBy: "dates" })}
              >
                {this.props.t("mostRecent", "Most recent")}
              </SortButton>
              <SortButton
                className="filter-button"
                checkboxClassName={`filter-checkbox ${
                  this.state.sortBy === "supports" && "selected"
                }`}
                isActive={this.state.sortBy === "supports"}
                onClick={() => this.setState({ sortBy: "supports" })}
              >
                {this.props.t("mostSupports", "Most supports")}
              </SortButton>
              <SortButton
                className="filter-button"
                checkboxClassName={`filter-checkbox ${
                  this.state.sortBy === "comments" && "selected"
                }`}
                isActive={this.state.sortBy === "comments"}
                onClick={() => this.setState({ sortBy: "comments" })}
              >
                {this.props.t("mostComments", "Most comments")}
              </SortButton>
            </ButtonContainer>
          </ListHeader>
          <AutoSizer>
            {({ height, width }) => (
              <List
                ref={this.setVirtualizedList}
                height={height}
                width={width}
                containerStyle={{
                  margin: "0 auto",
                  maxWidth: MAX_LIST_WIDTH,
                }}
                overscanRowCount={4}
                noRowsRenderer={this._noRowsRenderer}
                rowCount={this.state.places.length}
                rowRenderer={this._rowRenderer}
                deferredMeasurementCache={cache}
                rowHeight={cache.rowHeight}
              />
            )}
          </AutoSizer>
        </ListViewContent>
      </ListViewContainer>
    );
  }
}

PlaceList.propTypes = {
  places: placesPropType.isRequired,
  placeConfig: placeConfigPropType.isRequired,
  t: PropTypes.func.isRequired,
  updateCurrentTemplate: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  places: filteredPlacesSelector(state),
  placeConfig: placeConfigSelector(state),
});

const mapDispatchToProps = dispatch => ({
  updateCurrentTemplate: templateName =>
    dispatch(updateCurrentTemplate(templateName)),
});

export default withTranslation("PlaceList")(
  withRouter(connect(mapStateToProps, mapDispatchToProps)(PlaceList)),
);
