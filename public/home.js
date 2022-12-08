function Home() {
  const { user } = React.useContext(UserContext);
  return (
    <Card
      bgcolor="light"
      txtcolor="black"
      header="BadBank"
      title={
        user.displayName
          ? `Welcome ${user.displayName}!`
          : "Welcome to BadBank!"
      }
      text="Feel free to move around the site using the navigation bar."
      body={<img src="bank.png" className="img-fluid" alt="Responsive image" />}
    />
  );
}
