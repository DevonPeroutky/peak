defmodule MyAppWeb.SubscriberView do
  use MyAppWeb, :view
  alias MyAppWeb.SubscriberView

  def render("index.json", %{subscribers: subscribers}) do
    %{data: render_many(subscribers, SubscriberView, "subscriber.json")}
  end

  def render("show.json", %{subscriber: subscriber}) do
    %{data: render_one(subscriber, SubscriberView, "subscriber.json")}
  end

  def render("subscriber.json", %{subscriber: subscriber}) do
    %{id: subscriber.id,
      email: subscriber.email,
      peak_user_id: subscriber.peak_user_id}
  end
end
