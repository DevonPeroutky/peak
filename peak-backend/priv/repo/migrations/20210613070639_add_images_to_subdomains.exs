defmodule MyApp.Repo.Migrations.AddImagesToSubdomains do
  use Ecto.Migration

  def change do
    alter table(:subdomains) do
      add :cover_image_url, :string, null: true, size: 2025
      add :fav_icon_url, :string, null: true, size: 2025
      add :twitter_url, :string, null: true, size: 2025
      add :linkedin_url, :string, null: true, size: 2025
      add :github_url, :string, null: true, size: 2025
      add :instagram_url, :string, null: true, size: 2025
    end
  end
end
