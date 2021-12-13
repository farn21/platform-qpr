import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";

import { Header3, Paragraph } from "../atoms/typography";

import "./form-stage-header-bar.scss";

const FormStageHeaderBar = props => {
  return (
    <div
      className={classNames("form-stage-header-bar", {
        "form-stage-header-bar--without-image": !props.stageConfig.icon_url,
      })}
    >
    <div style={{display: "flex", justifyContent: "flex-start", margin: 0, padding: 0, paddingBottom: '10px'}}>
      <Header3 classes="form-stage-header-bar__header">
        {props.stageConfig.icon_url && (
          <img
            className="form-stage-header-bar__icon"
            src={props.stageConfig.icon_url}
          />
        )}
        {props.stageConfig.header}
      </Header3>
      <img style={{width: '36px', marginLeft: '8px'}} src={'/static/css/images/markers/marker-agua.svg'} alt={'icono de formulario'} />
      </div>      
  
      <Paragraph className="form-stage-header-bar__description">
        {props.stageConfig.description}
      </Paragraph>
    </div>
  );
};

FormStageHeaderBar.propTypes = {
  stageConfig: PropTypes.shape({
    header: PropTypes.string,
    description: PropTypes.string,
    icon_url: PropTypes.string,
    modal: PropTypes.shape({
      headerImgSrc: PropTypes.string,
      header: PropTypes.string,
      body: PropTypes.arrayOf(PropTypes.string),
    }),
  }),
};

export default FormStageHeaderBar;
