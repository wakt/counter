require 'test_helper'

class OffsetsControllerTest < ActionController::TestCase
  setup do
    @offset = offsets(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:offsets)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create offset" do
    assert_difference('Offset.count') do
      post :create, offset: {  }
    end

    assert_redirected_to offset_path(assigns(:offset))
  end

  test "should show offset" do
    get :show, id: @offset
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @offset
    assert_response :success
  end

  test "should update offset" do
    put :update, id: @offset, offset: {  }
    assert_redirected_to offset_path(assigns(:offset))
  end

  test "should destroy offset" do
    assert_difference('Offset.count', -1) do
      delete :destroy, id: @offset
    end

    assert_redirected_to offsets_path
  end
end
