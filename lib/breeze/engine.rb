module Breeze
  class Engine < ::Rails::Engine
    isolate_namespace Breeze

    initializer "breeze.assets.precompile" do |app|
      app.config.assets.precompile += [ "breeze/*", "breeze/icons/*", "breeze/log/*" ]
    end
  end
end
