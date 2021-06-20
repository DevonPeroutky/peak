defmodule MyAppWeb.PostController do
  use MyAppWeb, :controller

  alias MyApp.Repo
  alias MyApp.Blog
  alias MyApp.Wiki
  alias MyApp.Library
  alias MyApp.Blog.Post

  action_fallback MyAppWeb.FallbackController

  def index(conn, %{"subdomain" => subdomain, "cursor" => cursor }) do
    %{entries: posts, metadata: cursor_metadata} = Blog.list_posts(subdomain, cursor)
    render(conn, "paginated_index.json", %{posts: posts, cursor_metadata: cursor_metadata })
  end

  def index(conn, %{"subdomain" => subdomain }) do
    %{entries: posts, metadata: cursor_metadata} = Blog.list_posts(subdomain, nil)
    render(conn, "paginated_index.json", %{posts: posts, cursor_metadata: cursor_metadata })
  end

  defp create_post_from_note(note_params) do
    IO.puts "CREATING FOR POST"
    IO.inspect note_params
    Ecto.Multi.new()
    |> Ecto.Multi.run(:post, fn _repo, _changes_thus_far -> Blog.create_post(note_params) end)
    |> Ecto.Multi.run(:note, fn _repo, _changes_thus_far ->
        note = Library.get_book!(note_params["id"])
        Library.update_book(note, %{"privacy_level" => "public"})
    end)
    |> Repo.transaction
  end

  defp create_post_from_page(post_params) do
    Ecto.Multi.new()
    |> Ecto.Multi.run(:post, fn _repo, _changes_thus_far -> Blog.create_post(post_params) end)
    |> Ecto.Multi.run(:deleted_page, fn _repo, _changes_thus_far -> Wiki.delete_page_by_id(post_params["id"]) end)
    |> Repo.transaction
  end

  def create(conn, %{"post" => post_params, "user_id" => user_id, "origin_artifact_type" => origin_artifact_type}) do
    post = if origin_artifact_type == "page" do create_post_from_page(post_params) else create_post_from_note(post_params) end

    with {:ok, %{ post: %Post{} = post } } <- post do
      conn
      |> put_status(:created)
      |> render("show.json", post: post)
    end
  end

  def show(conn, %{"id" => id}) do
    post = Blog.get_post!(id)
    render(conn, "show.json", post: post)
  end

  def update(conn, %{"id" => id, "post" => post_params}) do
    post = Blog.get_post!(id)

    with {:ok, %Post{} = post} <- Blog.update_post(post, post_params) do
      render(conn, "show.json", post: post)
    end
  end

  def delete(conn, %{"id" => id}) do
    post = Blog.get_post!(id)

    with {:ok, %Post{}} <- Blog.delete_post(post) do
      send_resp(conn, :no_content, "")
    end
  end
end
