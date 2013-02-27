require File.expand_path(File.dirname(__FILE__) + "/../../../spec_helper")

describe Breeze::Content::Page do

  subject { Fabricate.build :page }

  describe "Factory" do
    it { should be_valid }
  end

  describe "#page_title" do
    it "selects the seo optimized title if possible" do
      subject.page_title.should eq('seo_title')
    end

    it "defaults to the normal title if there is no seo_title" do
      subject.seo_title = ""
      subject.page_title.should eq('my_super_page')
    end
  end

  describe ".[]" do
    it "retrieves a page from its permalink" do
      Breeze::Content::Page[page.permalink].should eq(page)
    end

    it "raises a not found error if nothing has been found" do
      Breeze::Content::Page['trythat'].should raise(:not_found)
    end

  end

end
