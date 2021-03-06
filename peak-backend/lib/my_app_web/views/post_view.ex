defmodule MyAppWeb.PostView do
  use MyAppWeb, :view
  alias MyAppWeb.PostView

  def render("paginated_index.json", %{posts: posts, cursor_metadata: cursor_metadata}) do
    %{
      posts: render_many(posts, PostView, "post.json"),
      pagination_metadata: %{
        cursor: cursor_metadata.after,
        cursorBefore: cursor_metadata.before,
        limit: cursor_metadata.limit
      }
    }
  end

  def render("index.json", %{posts: posts}) do
    %{posts: render_many(posts, PostView, "post.json")}
  end

  def render("show.json", %{post: post}) do
    %{post: render_one(post, PostView, "post.json")}
  end

  def render("post.json", %{post: post}) do
    %{id: post.id,
      title: post.title,
      subtitle: post.subtitle,
      cover_image: post.cover_image,
      snippet: post.snippet,
      created_at: post.inserted_at,
      updated_at: post.updated_at,
      body: post.body,
      tag_ids: post.tag_ids,
      user_id: post.user_id,
      privacy_level: post.privacy_level,
      post_type: post.post_type}
  end
end
