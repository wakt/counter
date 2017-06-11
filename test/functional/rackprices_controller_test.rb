require 'test_helper'

class RackpricesControllerTest < ActionController::TestCase
  setup do
    @rackprice = rackprices(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:rackprices)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create rackprice" do
    assert_difference('Rackprice.count') do
      post :create, rackprice: {  }
    end

    assert_redirected_to rackprice_path(assigns(:rackprice))
  end

  test "should show rackprice" do
    get :show, id: @rackprice
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @rackprice
    assert_response :success
  end

  test "should update rackprice" do
    put :update, id: @rackprice, rackprice: {  }
    assert_redirected_to rackprice_path(assigns(:rackprice))
  end

  test "should destroy rackprice" do
    assert_difference('Rackprice.count', -1) do
      delete :destroy, id: @rackprice
    end

    assert_redirected_to rackprices_path
  end
end
