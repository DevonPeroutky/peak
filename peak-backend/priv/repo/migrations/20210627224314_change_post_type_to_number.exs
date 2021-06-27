defmodule MyApp.Repo.Migrations.ChangePostTypeToNumber do
  use Ecto.Migration

#  def change do
#    alter table(:posts) do
#      modify :post_type, :integer, using post_type::integer
#    end
#  end
  def up do
        execute """
          alter table posts alter column post_type type integer using (post_type::integer)
         """
     end

     def down do
        execute """
          alter table posts alter column post_type type character varying(255);
         """
     end
end
