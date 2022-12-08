function AllData() {
  const [data, setData] = React.useState([]);
  const { user } = React.useContext(UserContext);

  React.useEffect(() => {
    async function fetchData() {
      var token = await user.getIdToken();
      const url = `/account/all`;
      await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Couldn't get accounts: ${response}`);
          }

          return res.json();
        })
        .then((jsonRes) => {
          setData(jsonRes);
        })
        .catch((error) => {
          console.log("Couldn't get account data: ", error);
          alert("Sorry, we couldn't pull account data right now");
        });
    }
    fetchData();
  }, [user]);

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
