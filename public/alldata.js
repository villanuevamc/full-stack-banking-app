function AllData() {
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    // fetch all account from API
    var token, res;
    (async () => {
      token = await auth.currentUser.getIdToken();
      res = await fetch("/account/all", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    })();

    console.log(res);
    setData(res.json());
  }, []);

  return (
    <Card
      bgcolor="dark"
      txtcolor="white"
      header="ALL DATA"
      body={
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Password</th>
              <th scope="col">Balance</th>
            </tr>
          </thead>
          <tbody>
            {data.map((account) => (
              <tr key={account}>
                <td>{account.name}</td>
                <td>{account.email}</td>
                <td>{account.password}</td>
                <td>{account.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      }
    />
  );
}
