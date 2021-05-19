defmodule MyApp.Repo.Migrations.CreateSubdomains do
  use Ecto.Migration

  def change do
    create table(:subdomains, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :title, :string
      add :subdomain, :string, null: false
      add :user_id, references(:users, on_delete: :nothing, type: :string)

      timestamps()
    end

    create index(:subdomains, [:user_id])
    create unique_index(:subdomains, [:subdomain])
  end
end
