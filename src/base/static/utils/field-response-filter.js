import constants from "../constants";

export default (fieldConfigs, place) => {
  if (!fieldConfigs) {
    return [];
  }
  return fieldConfigs.filter(
      fieldConfig =>
        ![
          constants.SUBMIT_FIELD_TYPENAME,
          constants.ATTACHMENT_FIELD_TYPENAME,
          constants.PUBLISH_CONTROL_TOOLBAR_TYPENAME,
          constants.INFORMATIONAL_HTML_FIELD_TYPENAME,
        ].includes(fieldConfig.type) &&
        ![
          constants.LOCATION_TYPE_PROPERTY_NAME,
          constants.TITLE_PROPERTY_NAME,
          "submitter_name",
          "name",
        ].includes(fieldConfig.name),
    )
    .filter(fieldConfig => fieldConfig.name.indexOf("private-") !== 0)
    .filter(fieldConfig => {
      if(
        place[fieldConfig.name] && 
        !place[fieldConfig.name].includes('undefined') &&
        place[fieldConfig.name] != 'no' // Maybe take some other value for check
      )
        return true
      return false
    });
};
