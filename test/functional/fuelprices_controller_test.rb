require 'test_helper'

class FuelpricesControllerTest < ActionController::TestCase
  setup do
    @fuelprice = fuelprices(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:fuelprices)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create fuelprice" do
    assert_difference('Fuelprice.count') do
      post :create, fuelprice: {  }
    end

    assert_redirected_to fuelprice_path(assigns(:fuelprice))
  end

  test "should show fuelprice" do
    get :show, id: @fuelprice
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @fuelprice
    assert_response :success
  end

  test "should update fuelprice" do
    put :update, id: @fuelprice, fuelprice: {  }
    assert_redirected_to fuelprice_path(assigns(:fuelprice))
  end

  test "should destroy fuelprice" do
    assert_difference('Fuelprice.count', -1) do
      delete :destroy, id: @fuelprice
    end

    assert_redirected_to fuelprices_path
  end
end
