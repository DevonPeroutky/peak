echo "Running the migrations..."
_build/prod/rel/my_app/bin/my_app eval "MyApp.Release.migrate"
echo "Finished!"

# This is setup in Render
export GOOGLE_APPLICATION_CREDENTIALS_JSON=$(cat /etc/secrets/peak-google-app-creds.json)

_build/prod/rel/my_app/bin/my_app start