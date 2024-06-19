clear

until read -r -p "Your Package Id : " packageId && test "$packageId" != ""; do
  continue
done

until read -r -p "Your environment Id : " env && test "$env" != ""; do
  continue
done

sf package  install --package "$packageId"  --target-org "$env" -t DeprecateOnly -a package -w 30 -r