defmodule MyApp.Repo.Migrations.CreateSubscribers do
  use Ecto.Migration

  def change do
    create table(:subscribers, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :email, :string, null: false
      add :peak_user_id, :binary, null: true
      add :subdomain, references(:subdomains, on_delete: :nothing, type: :binary_id)

      timestamps()
    end

    create index(:subscribers, [:subdomain])
  end
end
