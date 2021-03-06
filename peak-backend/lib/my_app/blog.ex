defmodule MyApp.Blog do
  @moduledoc """
  The Blog context.
  """

  import Ecto.Query, warn: false
  alias MyApp.Repo

  alias MyApp.Blog.Subdomain

  @page_size 2

  @doc """
  Returns the list of subdomains.

  ## Examples

      iex> list_subdomains()
      [%Subdomain{}, ...]

  """
  def list_subdomains do
    Repo.all(Subdomain)
  end

  @doc """
  Gets a single subdomain.

  Raises `Ecto.NoResultsError` if the Subdomain does not exist.

  ## Examples

      iex> get_subdomain!(123)
      %Subdomain{}

      iex> get_subdomain!(456)
      ** (Ecto.NoResultsError)

  """
  def get_subdomain_by_id!(id), do: Repo.get!(Subdomain, id)

  def get_subdomain(subdomain_title) do
    subdomain = from(s in Subdomain, where: s.subdomain == ^subdomain_title) |> Repo.one()
    case subdomain do
      %Subdomain{}  -> {:ok, subdomain}
      _             -> {:error, :not_found}
    end
  end

  def get_user_subdomain(user_id) do
    subdomain = from(s in Subdomain, where: s.user_id == ^user_id) |> Repo.one()
    case subdomain do
      %Subdomain{}  -> {:ok, subdomain}
      _             -> {:error, :not_found}
    end
  end

  def get_subdomain!(subdomain) do
    from(s in Subdomain, where: s.subdomain == ^subdomain)
    |> Repo.one()
  end

  @doc """
  Creates a subdomain.

  ## Examples

      iex> create_subdomain(%{field: value})
      {:ok, %Subdomain{}}

      iex> create_subdomain(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_subdomain(attrs \\ %{}) do
    %Subdomain{}
    |> Subdomain.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a subdomain.

  ## Examples

      iex> update_subdomain(subdomain, %{field: new_value})
      {:ok, %Subdomain{}}

      iex> update_subdomain(subdomain, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_subdomain(%Subdomain{} = subdomain, attrs) do
    subdomain
    |> Subdomain.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a subdomain.

  ## Examples

      iex> delete_subdomain(subdomain)
      {:ok, %Subdomain{}}

      iex> delete_subdomain(subdomain)
      {:error, %Ecto.Changeset{}}

  """
  def delete_subdomain(%Subdomain{} = subdomain) do
    Repo.delete(subdomain)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking subdomain changes.

  ## Examples

      iex> change_subdomain(subdomain)
      %Ecto.Changeset{data: %Subdomain{}}

  """
  def change_subdomain(%Subdomain{} = subdomain, attrs \\ %{}) do
    Subdomain.changeset(subdomain, attrs)
  end

  alias MyApp.Blog.Post

  @doc """
  Returns the list of posts.

  ## Examples

      iex> list_posts(subdomain)
      [%Post{}, ...]

  """
  def list_posts(subdomain, cursor) do
    query = from(p in Post, where: p.subdomain_id == ^subdomain, order_by: [desc: p.inserted_at])
    fetch_post_page(query, cursor)
  end

  defp fetch_post_page(query, cursor) when is_nil(cursor) do
    Repo.paginate(query, cursor_fields: [{:inserted_at, :desc}, {:id, :desc}], limit: @page_size)
  end

  defp fetch_post_page(query, cursor) do
    Repo.paginate(query, after: cursor, cursor_fields: [{:inserted_at, :desc}, {:id, :desc}], limit: @page_size)
  end

  @doc """
  Gets a single post.

  Raises `Ecto.NoResultsError` if the Post does not exist.

  ## Examples

      iex> get_post!(123)
      %Post{}

      iex> get_post!(456)
      ** (Ecto.NoResultsError)

  """
  def get_post!(id), do: Repo.get!(Post, id)

  @doc """
  Creates a post.

  ## Examples

      iex> create_post(%{field: value})
      {:ok, %Post{}}

      iex> create_post(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_post(attrs \\ %{}) do
    %Post{}
    |> Post.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a post.

  ## Examples

      iex> update_post(post, %{field: new_value})
      {:ok, %Post{}}

      iex> update_post(post, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_post(%Post{} = post, attrs) do
    post
    |> Post.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a post.

  ## Examples

      iex> delete_post(post)
      {:ok, %Post{}}

      iex> delete_post(post)
      {:error, %Ecto.Changeset{}}

  """
  def delete_post(%Post{} = post) do
    Repo.delete(post)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking post changes.

  ## Examples

      iex> change_post(post)
      %Ecto.Changeset{data: %Post{}}

  """
  def change_post(%Post{} = post, attrs \\ %{}) do
    Post.changeset(post, attrs)
  end

  alias MyApp.Blog.Subscriber

  @doc """
  Returns the list of subscribers.

  ## Examples

      iex> list_subscribers()
      [%Subscriber{}, ...]

  """
  def list_subscribers do
    Repo.all(Subscriber)
  end

  @doc """
  Gets a single subscriber.

  Raises `Ecto.NoResultsError` if the Subscriber does not exist.

  ## Examples

      iex> get_subscriber!(123)
      %Subscriber{}

      iex> get_subscriber!(456)
      ** (Ecto.NoResultsError)

  """
  def get_subscriber!(id), do: Repo.get!(Subscriber, id)

  @doc """
  Creates a subscriber.

  ## Examples

      iex> create_subscriber(%{field: value})
      {:ok, %Subscriber{}}

      iex> create_subscriber(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_subscriber(attrs \\ %{}) do
    %Subscriber{}
    |> Subscriber.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a subscriber.

  ## Examples

      iex> update_subscriber(subscriber, %{field: new_value})
      {:ok, %Subscriber{}}

      iex> update_subscriber(subscriber, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_subscriber(%Subscriber{} = subscriber, attrs) do
    subscriber
    |> Subscriber.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a subscriber.

  ## Examples

      iex> delete_subscriber(subscriber)
      {:ok, %Subscriber{}}

      iex> delete_subscriber(subscriber)
      {:error, %Ecto.Changeset{}}

  """
  def delete_subscriber(%Subscriber{} = subscriber) do
    Repo.delete(subscriber)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking subscriber changes.

  ## Examples

      iex> change_subscriber(subscriber)
      %Ecto.Changeset{data: %Subscriber{}}

  """
  def change_subscriber(%Subscriber{} = subscriber, attrs \\ %{}) do
    Subscriber.changeset(subscriber, attrs)
  end
end
