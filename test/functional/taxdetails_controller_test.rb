require 'test_helper'

class TaxdetailsControllerTest < ActionController::TestCase
  setup do
    @taxdetail = taxdetails(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:taxdetails)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create taxdetail" do
    assert_difference('Taxdetail.count') do
      post :create, taxdetail: {  }
    end

    assert_redirected_to taxdetail_path(assigns(:taxdetail))
  end

  test "should show taxdetail" do
    get :show, id: @taxdetail
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @taxdetail
    assert_response :success
  end

  test "should update taxdetail" do
    put :update, id: @taxdetail, taxdetail: {  }
    assert_redirected_to taxdetail_path(assigns(:taxdetail))
  end

  test "should destroy taxdetail" do
    assert_difference('Taxdetail.count', -1) do
      delete :destroy, id: @taxdetail
    end

    assert_redirected_to taxdetails_path
  end
end
