defmodule MyApp.Blog.Subscriber do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "subscribers" do
    field :email, :string
    field :peak_user_id, :binary
    field :subdomain, :binary_id

    timestamps()
  end

  @doc false
  def changeset(subscriber, attrs) do
    subscriber
    |> cast(attrs, [:email, :peak_user_id])
    |> validate_required([:email, :peak_user_id])
  end
end
