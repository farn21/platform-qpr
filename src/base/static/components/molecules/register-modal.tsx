/** @jsx jsx */
import * as React from "react";
import mapseedApiClient from "../../client/mapseed-api-client";
import { jsx, css } from "@emotion/core";
import FormField from "../form-fields/form-field";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Divider from "@material-ui/core/Divider";
import { Map, OrderedMap } from "immutable";

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import config from "config";
import { LoginProvider, AppConfig } from "../../state/ducks/app-config";
import {
  MuiDiscourseIcon,
  MuiFacebookFIcon,
  MuiTwitterIcon,
  MuiLoginIcon,
  MuiGoogleIcon,
  MuiRegisterIcon,
} from "../atoms/icons";
import { Button } from "../atoms/buttons";
import { RegularText } from "../atoms/typography";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import { makeStyles, createStyles } from "@material-ui/core";
import Link from "@material-ui/core/Link";

import IconButton from "@material-ui/core/IconButton";
import { withTranslation, WithTranslation } from "react-i18next";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(() =>
  createStyles({
    button: {
      position: "absolute",
    },
  }),
);

type Props = {
  appConfig: AppConfig;
  disableRestoreFocus?: boolean;
  render: (openModal: () => void) => React.ReactNode;
} & WithTranslation;

const RegisterModal = ({
  appConfig,
  disableRestoreFocus = false,
  render,
  t
}: Props) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const openModal = () => setIsOpen(true);
  const registrateClick = () => {
    setIsOpen(false)
  }
  const fieldUsername = OrderedMap() ;
  const fieldPassword = OrderedMap();
  const fieldCheckbox = OrderedMap();
  const fieldEmail = OrderedMap();
  const onCreateUser = async (event) => {
    var f = document.querySelector("#userNewForm") as HTMLFormElement | null;
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    var ret = f.checkValidity()
    if (!ret) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
      f.reportValidity()
      return false;
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    var formData = new FormData(f)
    var response = await mapseedApiClient.user.create(config.app.api_root, formData)
    if (f != null) {
      f.style.display = "none";
    }
    var thanks = document.querySelector("#thanksRegister") as HTMLElement | null;
    if (thanks != null) {
      thanks.style.display = "block"; 
    }
    setTimeout(function(){
      setIsOpen(false);
      setTimeout(function() {
        if (thanks != null) {
          thanks.style.display = "none";
        }
        if (f != null) {
          f.style.display = "block";
        }
      }, 1000)
    }, 2000)
    event.preventDefault();
  }
  const classes = useStyles();
  const backgroundColor = "gray";
  return (
    <React.Fragment>
      {render(openModal)}
      <Dialog
        onClose={() => {
          setIsOpen(false);
        }}
        aria-labelledby="simple-dialog-title"
        open={isOpen}
        disableRestoreFocus={disableRestoreFocus}
      >
        <DialogTitle
          css={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          disableTypography
        >
          <Typography css={{ textAlign: "center", width: "100%" }} variant="h5">
            {t("registerMsg", "Registrate")}
          </Typography>
          <IconButton
            css={{
              color: "#ff5e99",
              width: "32px",
              height: "32px",
              margin: "8px 8px 0 0",
              top: 0,
              right: 0,
            }}
            classes={{ root: classes.button, label: classes.button }}
            aria-label="close"
            onClick={() => setIsOpen(false)}
          >
            {"✕"}
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent
          css={{
            padding: "24px",
            minWidth: "240px",
          }}
        > 
        <div id="thanksRegister" style={{display: 'none'}}>
            GRACIAS POR REGISTRARTE
        </div>
                    <form id="userNewForm" onSubmit={onCreateUser} css={css`margin-bottom: 50px; width: 500px;`} className="place-form" >
              <FormField formId="userNewForm" fieldState={fieldUsername} fieldConfig={{required: true, placeholder: "Usuario", display_prompt: "Usuario", name:"username", type: "text", prompt: "Usuario"}} onFieldChange={()=>{}} showValidityStatus={true} >
              </FormField>
              <FormField formId="userNewForm" fieldState={fieldEmail} fieldConfig={{required: true, placeholder: "Correo", display_prompt: "Correo", name:"email", type: "text", prompt: "Correo"}} onFieldChange={()=>{}} showValidityStatus={true} >
              </FormField>
              <FormField formId="userNewForm" fieldState={fieldPassword} fieldConfig={{required: true, placeholder: "Contraseña", display_prompt: "Contraseña", name:"password1", type: "password", prompt: "Contraseña"}} onFieldChange={()=>{}} showValidityStatus={true} >
              </FormField>
              <input type="checkbox" required />
              <DialogContentText
            css={{ paddingLeft: "20px", display: "inline", fontSize: ".8em" }}
            variant="body2"
            align="center"
          >
            {"Al registrarte, confirmas que leiste y aceptás el "}
            <Link
              target="_blank"
              href="https://drive.google.com/file/d/1vK9oYpbuxP5Wh09Na9wPFAWYBqfFxGI8/view"
              underline="always"
            >
              {"consentimiento informado de QPR"}
            </Link>
          </DialogContentText>
          
              <Button css={{marginTop: "20px"}} variant="flat"
              onClick={onCreateUser}
              color="primary"
              size="regular" >
              <RegularText>{"Crear"}</RegularText>
              </Button>
            </form>

        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default withTranslation("RegisterModal")(RegisterModal);
