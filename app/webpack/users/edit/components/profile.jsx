import React, { createRef } from "react";
import PropTypes from "prop-types";
import Dropzone from "react-dropzone";
import moment from "moment";

import CheckboxRowContainer from "../containers/checkbox_row_container";
import SettingsItem from "./settings_item";
import ChangePassword from "./change_password";
import UserImage from "../../../shared/components/user_image";

const Profile = ( {
  profile,
  handleInputChange,
  handlePhotoUpload,
  onFileDrop,
  removePhoto,
  changePassword,
  resendConfirmation
} ) => {
  const hiddenFileInput = createRef( null );
  const iconDropzone = createRef( );

  const showFileDialog = ( ) => iconDropzone.current.open( );

  const showUserIcon = ( ) => {
    if ( profile.icon && profile.icon.preview ) {
      return <img alt="user-icon" src={profile.icon.preview} className="user-profile-preview" />;
    }
    return <UserImage user={profile} />;
  };

  // this gets rid of the React warning about inputs being controlled vs. uncontrolled
  // by ensuring user data is fetched before the Profile & User page loads
  if ( !profile.login && !profile.email ) {
    return null;
  }

  const showError = ( errorType, attribute ) => {
    const errors = profile.errors && profile.errors[errorType];

    return (
      <div className={!errors ? "hidden" : null}>
        {errors && profile.errors[errorType].map( reason => (
          <div className="error-message" key={reason}>
            {`${I18n.t( attribute || errorType )} ${reason}`}
          </div>
        ) )}
      </div>
    );
  };

  let emailConfirmation = (
    <div className="text-success">
      Confirmed on
      { " " }
      { moment( profile.confirmed_at ).format( I18n.t( "momentjs.date_long" ) )}
    </div>
  );
  if ( !profile.confirmed_at ) {
    emailConfirmation = (
      <div
        className={`alert alert-${profile.confirmation_sent_at ? "warning" : "danger"}`}
      >
        {
          profile.confirmation_sent_at
            ? `Confirmation email sent at ${moment( profile.confirmation_sent_at ).format( I18n.t( "momentjs.datetime_with_zone_no_year" ) )}`
            : "You have not confirmed your email address!"
        }
        { " " }
        <button
          type="button"
          className="btn btn-nostyle alert-link"
          onClick={
            // TODO replace this will with a react modal, e.g. ConfirmModal
            ( ) => {
              if ( confirm( "After you resend the confirmation email, you will be signed out and you will not be able to sign in to your account until you click the link in the email, so make absolutely sure you have entered your email address correctly." ) ) {
                console.log( "[DEBUG] confirmed, resending" );
                resendConfirmation( );
              }
            }
          }
        >
          Re-send confirmation email
        </button>
      </div>
    );
  }

  return (
    <div className="row">
      <div className="col-md-5 col-sm-10">
        <h4>{I18n.t( "profile" )}</h4>
        <SettingsItem header={I18n.t( "profile_picture" )} htmlFor="user_icon">
          <Dropzone
            ref={iconDropzone}
            className="dropzone"
            onDrop={droppedFiles => onFileDrop( droppedFiles )}
            activeClassName="hover"
            disableClick
            accept="image/png,image/jpeg,image/gif"
            multiple={false}
          >
            <div className="flex-no-wrap">
              <div className="user-profile-image">
                {showUserIcon( )}
              </div>
              <div className="add-remove-user-photo">
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={showFileDialog}
                >
                  {I18n.t( "upload_new_photo" )}
                </button>
                <input
                  id="user_icon"
                  className="hide"
                  value=""
                  type="file"
                  ref={hiddenFileInput}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                />
                <button className="btn btn-default remove-photo-margin" type="button" onClick={removePhoto}>
                  {I18n.t( "remove_photo" )}
                </button>
              </div>
            </div>
          </Dropzone>
        </SettingsItem>
        <SettingsItem header={I18n.t( "username" )} required htmlFor="user_login">
          <div className="text-muted help-text">{I18n.t( "username_description" )}</div>
          {showError( "login", "username" )}
          <input
            id="user_login"
            type="text"
            className="form-control"
            value={profile.login}
            name="login"
            onChange={handleInputChange}
          />
        </SettingsItem>
        <SettingsItem header={I18n.t( "email" )} required htmlFor="user_email">
          <div className="text-muted help-text">{I18n.t( "email_description" )}</div>
          {showError( "email" )}
          <input
            id="user_email"
            type="text"
            className="form-control"
            value={profile.email}
            name="email"
            onChange={handleInputChange}
          />
          { emailConfirmation }
        </SettingsItem>
        <ChangePassword changePassword={changePassword} showError={showError} />
      </div>
      <div className="col-md-offset-1 col-md-6 col-sm-10">
        <SettingsItem header={I18n.t( "display_name" )} htmlFor="user_name">
          <div className="text-muted help-text">{I18n.t( "display_name_description" )}</div>
          <input
            id="user_name"
            type="text"
            className="form-control"
            value={profile.name || ""}
            name="name"
            onChange={handleInputChange}
          />
        </SettingsItem>
        <SettingsItem header={I18n.t( "bio" )} htmlFor="user_description">
          <div className="text-muted help-text">{I18n.t( "bio_description" )}</div>
          <textarea id="user_description" className="form-control user-description" value={profile.description || ""} name="description" onChange={handleInputChange} />
        </SettingsItem>
        <SettingsItem header={I18n.t( "badges" )} htmlFor="user_prefers_monthly_supporter_badge">
          <CheckboxRowContainer
            name="prefers_monthly_supporter_badge"
            label={I18n.t( "display_monthly_supporter_badge" )}
            description={(
              <p
                className="text-muted"
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                  __html: I18n.t( "views.users.edit.monthly_supporter_desc_html", {
                    url: "https://www.inaturalist.org/monthly-supporters?utm_campaign=monthly-supporter&utm_content=inline-link&utm_medium=web&utm_source=inaturalist.org&utm_term=account-settings"
                  } )
                }}
              />
            )}
            disabled={!profile.monthly_supporter}
          />
        </SettingsItem>
      </div>
    </div>
  );
};

Profile.propTypes = {
  profile: PropTypes.object,
  handleInputChange: PropTypes.func,
  handlePhotoUpload: PropTypes.func,
  onFileDrop: PropTypes.func,
  removePhoto: PropTypes.func,
  changePassword: PropTypes.func,
  resendConfirmation: PropTypes.func
};

export default Profile;
