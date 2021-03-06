require 'carrierwave/mongoid'

module Breeze
  module Admin
    class AssetsController < AdminController
      def index
        @folder = params[:folder] || "/"
        @assets = Breeze::Content::Asset.where({ :folder => @folder }).order_by([[ :created_at, :asc ]])
        @asset = Breeze::Content::Asset.new
      end

      def create
        @folder = params[:content_asset][:folder] || "/"
        @folder = @folder.sub(/\/$/, '') unless @folder == "/" # Remove trailing / if present
        params[:content_asset][:file].each do |file_param|
          if file_param.content_type.start_with? 'image/'
            @asset = Breeze::Content::Image.create file: file_param, folder: @folder
          else
            @asset = Breeze::Content::Asset.create file: file_param, folder: @folder
          end
          @asset.save
        end
        respond_to do |format|
          format.js
          # format.html { render :partial => "breeze/admin/assets/#{@asset.class.name.demodulize.underscore}", :object => @asset, :layout => false }
          format.json { render json: { filename: @asset[:file], width: @asset.image_width, height: @asset.image_height, title: @asset.basename, id: @asset.id.to_s } }
        end
      end

      def edit
        @asset = Breeze::Content::Asset.find params[:id]
        render :action => "edit_image" if @asset.image?
      end

      def update
        @asset = Breeze::Content::Asset.find params[:id]
        @asset.update_attributes params[:asset]
        respond_to do |format|
          format.js
          format.json { render :json => { :filename => @asset[:file], :width => @asset.image_width, :height => @asset.image_height, :title => @asset.title, :id => @asset.id.to_s } }
        end
      end

      def destroy
        @asset = Breeze::Content::Asset.find params[:id]
        @asset.try :destroy
      end

      def images
        @images = Breeze::Content::Image.by_folder do |i|
          { :filename => i[:file], :width => i.image_width, :height => i.image_height, :title => i.title, :id => i.id.to_s }
        end
        render :json => @images
      end

    protected
      def folders
        @folders ||= Breeze::Content::Asset.folders
      end
      helper_method :folders
    end
  end
end
