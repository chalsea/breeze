module Breeze
  module Content
    class NavigationItem < Item
      include Mongoid::Document
      identity :type => String
      
      field :title
      field :subtitle
      field :show_in_navigation, :type => Boolean, :default => true
      field :ssl, :type => Boolean, :default => false
      
      include Mixins::TreeStructure
      include Mixins::Permalinks
      
      validates_presence_of :title
      
      def editable?
        false
      end
      
      def to_s; title; end
      
      def protocol
        "http#{:s if ssl?}://"
      end
      
      def render(controller, request)
        if (ssl? ^ request.ssl?) && !Rails.env.development?
          controller.send :redirect_to, "#{protocol}#{request.host}#{request.request_uri}"
        else
          super
        end
      end
            
      def duplicate(attrs = {})
        new_slug, i = slug, 2
        while Breeze::Content::Item.where(:slug => new_slug, :parent_id => attrs[:parent_id] || parent_id).count > 0
          new_slug, i = "#{slug}-#{i}", i + 1
        end
        super(attrs.merge(:slug => new_slug, :position => position + 1)).tap do |new_item|
          unless children.empty?
            children.each { |child| child.duplicate(:parent_id => new_item.id) }
          end
        end
      end
    end
  end
end
