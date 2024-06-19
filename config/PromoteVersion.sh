clear
until read -r -p "Your Package Id : " packageId && test "$packageId" != ""; do
  continue
done

sf package version promote --package "$packageId" --target-dev-hub DevHubNBS