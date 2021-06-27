defmodule MyApp.Repo.Migrations.ConvertVisibilityToPrivacyLevel do
  use Ecto.Migration

  def change do
    rename table(:posts), :visibility, to: :privacy_level
  end
end
