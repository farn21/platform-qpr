/** @jsx jsx */
import React from "react";
import { connect } from "react-redux";
import { css, jsx } from "@emotion/core";
import moment from "moment";

import { UserAvatar } from "../atoms/imagery";
import { SmallText, RegularText } from "../atoms/typography";
import { withTranslation, WithTranslation } from "react-i18next";

import {
  commentFormConfigSelector,
  CommentFormConfig,
} from "../../state/ducks/forms-config";
import { appConfigSelector, AppConfig } from "../../state/ducks/app-config";

type OwnProps = {
  actionText: string;
  createdDatetime: string;
  label: string;
  numComments: number;
  submitterName: string;
  submitterAvatarUrl?: string;
  visits: number;
};

type StateProps = {
  appConfig: AppConfig;
  commentFormConfig: CommentFormConfig;
};

type MetadataBarProps = OwnProps & StateProps & WithTranslation;

const MetadataBar = (props: MetadataBarProps) => (
  <div
    css={theme => css`
      font-family: ${theme.text.bodyFontFamily};
      position: relative;
      line-height: 0.9rem;
    `}
  >
    <div
      css={css`
        position: absolute;
        top: 0;
        left: 0;
      `}
    >
      <UserAvatar size="large" src={props.submitterAvatarUrl} />
    </div>
    <div
      css={css`
        margin-left: 60px;
        margin-right: 8px;
      `}
    >
      <div>
        <RegularText weight="black">{props.submitterName}</RegularText>{" "}
        <RegularText
          css={css`
            line-height: 0.9rem;
            font-size: 1rem;
            margin-bottom: 1rem;
          `}
        >
          {props.t("placeActionText", `${props.actionText}`)}{" "}
          {props.t("en", "en")} {props.label}
        </RegularText>
      </div>
      <div>
        <SmallText
          css={css`
            line-height: 0.9rem;
            font-size: 1rem;
          `}
          display="block"
        >
          {props.numComments}{" "}
          {props.numComments === 1
            ? props.t(
                "surveyResponseName",
                props.commentFormConfig.response_name,
              )
            : props.t(
                "surveyResponsePluralName",
                props.commentFormConfig.response_plural_name,
              )}
        </SmallText>
        <SmallText
          css={css`
            line-height: 0.9rem;
          `}
          display="block"
        >
          {props.visits} visitas
        </SmallText>
        {props.appConfig.show_timestamps && (
          <SmallText
            css={css`
              line-height: -0.9rem;
              width: 100%;
            `}
            display="block"
            textTransform="uppercase"
          >
            <time>{moment(props.createdDatetime).format('LLL')}</time>
          </SmallText>
        )}
      </div>
    </div>
  </div>
);

const mapStateToProps = (state: any): StateProps => ({
  appConfig: appConfigSelector(state),
  commentFormConfig: commentFormConfigSelector(state),
});

export default connect(mapStateToProps)(
  withTranslation("MetadataBar")(MetadataBar),
);
