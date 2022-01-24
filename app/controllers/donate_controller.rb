# frozen_string_literal: true

class DonateController < ApplicationController
  layout "bootstrap"
  before_action do
    @responsive = true
    @footless = true
    @no_footer_gap = true
    @shareable_image_url = helpers.image_url( "donate-banner.png" )
  end

  def index
    new_params = redirect_params
    return redirect_to donate_url( new_params ) if new_params
  end

  def monthly_supporters
    new_params = redirect_params
    return redirect_to donate_url( new_params ) if new_params
  end

  private

  def redirect_params
    # Ensure utm_source is set to the site domain, defaulting to the default
    # site's domain. Note that donorbox will not save *any* utm_ values unless
    # utm_source is not blank
    utm_source = begin
      URI.parse( @site.domain )&.host || @site.domain
    rescue URI::InvalidURIError
      nil
    end
    utm_source ||= URI.parse( Site.default.domain )&.host || Site.default.domain
    if Site.default && @site && @site.id != Site.default.id
      {
        host: Site.default.domain,
        utm_source: utm_source
      }.merge( request.query_parameters.reject {| k, _v | k.to_s == "inat_site_id" } )
    elsif params[:utm_source].blank?
      # We're doing this because the donorbox iframe only seems to derive utm
      # params from the URL of the parent window, and will ignore them all if
      # utm_source isn't set
      {
        host: Site.default.domain,
        utm_source: utm_source,
        utm_medium: "web"
      }.merge( request.query_parameters.reject {| k, _v | k.to_s == "inat_site_id" } )
    end
  end
end
