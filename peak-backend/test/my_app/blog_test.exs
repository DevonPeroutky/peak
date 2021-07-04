defmodule MyApp.BlogTest do
  use MyApp.DataCase

  alias MyApp.Blog

  describe "subscribers" do
    alias MyApp.Blog.Subscriber

    @valid_attrs %{email: "some email", peak_user_id: "some peak_user_id"}
    @update_attrs %{email: "some updated email", peak_user_id: "some updated peak_user_id"}
    @invalid_attrs %{email: nil, peak_user_id: nil}

    def subscriber_fixture(attrs \\ %{}) do
      {:ok, subscriber} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Blog.create_subscriber()

      subscriber
    end

    test "list_subscribers/0 returns all subscribers" do
      subscriber = subscriber_fixture()
      assert Blog.list_subscribers() == [subscriber]
    end

    test "get_subscriber!/1 returns the subscriber with given id" do
      subscriber = subscriber_fixture()
      assert Blog.get_subscriber!(subscriber.id) == subscriber
    end

    test "create_subscriber/1 with valid data creates a subscriber" do
      assert {:ok, %Subscriber{} = subscriber} = Blog.create_subscriber(@valid_attrs)
      assert subscriber.email == "some email"
      assert subscriber.peak_user_id == "some peak_user_id"
    end

    test "create_subscriber/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Blog.create_subscriber(@invalid_attrs)
    end

    test "update_subscriber/2 with valid data updates the subscriber" do
      subscriber = subscriber_fixture()
      assert {:ok, %Subscriber{} = subscriber} = Blog.update_subscriber(subscriber, @update_attrs)
      assert subscriber.email == "some updated email"
      assert subscriber.peak_user_id == "some updated peak_user_id"
    end

    test "update_subscriber/2 with invalid data returns error changeset" do
      subscriber = subscriber_fixture()
      assert {:error, %Ecto.Changeset{}} = Blog.update_subscriber(subscriber, @invalid_attrs)
      assert subscriber == Blog.get_subscriber!(subscriber.id)
    end

    test "delete_subscriber/1 deletes the subscriber" do
      subscriber = subscriber_fixture()
      assert {:ok, %Subscriber{}} = Blog.delete_subscriber(subscriber)
      assert_raise Ecto.NoResultsError, fn -> Blog.get_subscriber!(subscriber.id) end
    end

    test "change_subscriber/1 returns a subscriber changeset" do
      subscriber = subscriber_fixture()
      assert %Ecto.Changeset{} = Blog.change_subscriber(subscriber)
    end
  end
end
