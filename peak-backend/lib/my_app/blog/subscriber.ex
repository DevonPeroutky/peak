defmodule MyApp.Blog.Subscriber do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "subscribers" do
    field :email, :string
    field :peak_user_id, :binary_id
    belongs_to :subdomain, MyApp.Blog.Subdomain, [foreign_key: :subdomain_id, type: :binary_id]

    timestamps()
  end

  @doc false
  def changeset(subscriber, attrs) do
    subscriber
    |> cast(attrs, [:email, :peak_user_id, :subdomain_id])
    |> validate_required([:email, :subdomain_id])
    |> unique_constraint(:unique_email, name: :unique_email_subscriber)
  end
end
