require 'spec_helper'

feature 'Edit a page in the front end' do
  let!(:p) { Fabricate :page } #homepage

  background do
    sign_in
  end
  
  scenario "adds some text in the first region and saves" do
    visit root_path

  end

end
