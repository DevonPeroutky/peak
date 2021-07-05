defmodule MyAppWeb.SubscriberController do
  use MyAppWeb, :controller

  alias MyApp.Blog
  alias MyApp.Blog.Subscriber

  action_fallback MyAppWeb.FallbackController

  def index(conn, %{"subdomain_id" => subdomain_id}) do
    subscribers = Blog.list_subscribers()
    render(conn, "index.json", subscribers: subscribers)
  end

  def create(conn, %{"subscriber" => subscriber_params}) do
    with {:ok, %Subscriber{} = subscriber} <- Blog.create_subscriber(subscriber_params) do
      conn
      |> put_status(:created)
#      |> put_resp_header("location", Routes.subscriber_path(conn, :show, subscriber))
      |> render("show.json", subscriber: subscriber)
    end
  end

  def show(conn, %{"id" => id}) do
    subscriber = Blog.get_subscriber!(id)
    render(conn, "show.json", subscriber: subscriber)
  end

  def update(conn, %{"id" => id, "subscriber" => subscriber_params}) do
    subscriber = Blog.get_subscriber!(id)

    with {:ok, %Subscriber{} = subscriber} <- Blog.update_subscriber(subscriber, subscriber_params) do
      render(conn, "show.json", subscriber: subscriber)
    end
  end

  def delete(conn, %{"id" => id}) do
    subscriber = Blog.get_subscriber!(id)

    with {:ok, %Subscriber{}} <- Blog.delete_subscriber(subscriber) do
      send_resp(conn, :no_content, "")
    end
  end
end
