require 'test_helper'

class RamcardsControllerTest < ActionController::TestCase
  setup do
    @ramcard = ramcards(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:ramcards)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create ramcard" do
    assert_difference('Ramcard.count') do
      post :create, ramcard: {  }
    end

    assert_redirected_to ramcard_path(assigns(:ramcard))
  end

  test "should show ramcard" do
    get :show, id: @ramcard
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @ramcard
    assert_response :success
  end

  test "should update ramcard" do
    put :update, id: @ramcard, ramcard: {  }
    assert_redirected_to ramcard_path(assigns(:ramcard))
  end

  test "should destroy ramcard" do
    assert_difference('Ramcard.count', -1) do
      delete :destroy, id: @ramcard
    end

    assert_redirected_to ramcards_path
  end
end
