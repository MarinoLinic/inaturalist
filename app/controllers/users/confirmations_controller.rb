# frozen_string_literal: true

module Users
  class ConfirmationsController < Devise::ConfirmationsController
    include Users::CustomDeviseModule

    before_action :load_registration_form_data

    # This is supposed to indicate to the view that it should not be
    # establishing connections to other domains, e.g. by loading remote
    # assets, in order to prevent those domains to getting access to
    # semi-secret information in a URL's querystring, e.g. a confirmation
    # token
    before_action { @skip_external_connections = true }

    skip_before_action :verify_authenticity_token

    before_action :return_here, only: []

    before_action do
      if current_user&.confirmed?
        set_flash_message :notice, :confirmed if is_navigational_format?
        redirect_to dashboard_path
      end
    end
  end
end
