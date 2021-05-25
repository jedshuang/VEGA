# Compile tutorial creator server and client
echo "Compiling apollo server and client"
mvn package
echo ""

cp "$APOLLO/target/apollo.jar" "$APOLLO/target/apollod.jar" "$APOLLO/bin"
