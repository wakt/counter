require 'test_helper'

class MftrefundsControllerTest < ActionController::TestCase
  setup do
    @mftrefund = mftrefunds(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:mftrefunds)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create mftrefund" do
    assert_difference('Mftrefund.count') do
      post :create, mftrefund: {  }
    end

    assert_redirected_to mftrefund_path(assigns(:mftrefund))
  end

  test "should show mftrefund" do
    get :show, id: @mftrefund
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @mftrefund
    assert_response :success
  end

  test "should update mftrefund" do
    put :update, id: @mftrefund, mftrefund: {  }
    assert_redirected_to mftrefund_path(assigns(:mftrefund))
  end

  test "should destroy mftrefund" do
    assert_difference('Mftrefund.count', -1) do
      delete :destroy, id: @mftrefund
    end

    assert_redirected_to mftrefunds_path
  end
end
