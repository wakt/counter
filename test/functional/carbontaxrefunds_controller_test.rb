require 'test_helper'

class CarbontaxrefundsControllerTest < ActionController::TestCase
  setup do
    @carbontaxrefund = carbontaxrefunds(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:carbontaxrefunds)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create carbontaxrefund" do
    assert_difference('Carbontaxrefund.count') do
      post :create, carbontaxrefund: {  }
    end

    assert_redirected_to carbontaxrefund_path(assigns(:carbontaxrefund))
  end

  test "should show carbontaxrefund" do
    get :show, id: @carbontaxrefund
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @carbontaxrefund
    assert_response :success
  end

  test "should update carbontaxrefund" do
    put :update, id: @carbontaxrefund, carbontaxrefund: {  }
    assert_redirected_to carbontaxrefund_path(assigns(:carbontaxrefund))
  end

  test "should destroy carbontaxrefund" do
    assert_difference('Carbontaxrefund.count', -1) do
      delete :destroy, id: @carbontaxrefund
    end

    assert_redirected_to carbontaxrefunds_path
  end
end
