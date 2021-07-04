defmodule MyAppWeb.SubscriberControllerTest do
  use MyAppWeb.ConnCase

  alias MyApp.Blog
  alias MyApp.Blog.Subscriber

  @create_attrs %{
    email: "some email",
    peak_user_id: "some peak_user_id"
  }
  @update_attrs %{
    email: "some updated email",
    peak_user_id: "some updated peak_user_id"
  }
  @invalid_attrs %{email: nil, peak_user_id: nil}

  def fixture(:subscriber) do
    {:ok, subscriber} = Blog.create_subscriber(@create_attrs)
    subscriber
  end

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all subscribers", %{conn: conn} do
      conn = get(conn, Routes.subscriber_path(conn, :index))
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create subscriber" do
    test "renders subscriber when data is valid", %{conn: conn} do
      conn = post(conn, Routes.subscriber_path(conn, :create), subscriber: @create_attrs)
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get(conn, Routes.subscriber_path(conn, :show, id))

      assert %{
               "id" => id,
               "email" => "some email",
               "peak_user_id" => "some peak_user_id"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, Routes.subscriber_path(conn, :create), subscriber: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update subscriber" do
    setup [:create_subscriber]

    test "renders subscriber when data is valid", %{conn: conn, subscriber: %Subscriber{id: id} = subscriber} do
      conn = put(conn, Routes.subscriber_path(conn, :update, subscriber), subscriber: @update_attrs)
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get(conn, Routes.subscriber_path(conn, :show, id))

      assert %{
               "id" => id,
               "email" => "some updated email",
               "peak_user_id" => "some updated peak_user_id"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn, subscriber: subscriber} do
      conn = put(conn, Routes.subscriber_path(conn, :update, subscriber), subscriber: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete subscriber" do
    setup [:create_subscriber]

    test "deletes chosen subscriber", %{conn: conn, subscriber: subscriber} do
      conn = delete(conn, Routes.subscriber_path(conn, :delete, subscriber))
      assert response(conn, 204)

      assert_error_sent 404, fn ->
        get(conn, Routes.subscriber_path(conn, :show, subscriber))
      end
    end
  end

  defp create_subscriber(_) do
    subscriber = fixture(:subscriber)
    %{subscriber: subscriber}
  end
end
