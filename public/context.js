const Route = ReactRouterDOM.Route;
const HashRouter = ReactRouterDOM.HashRouter;
const UserContext = React.createContext(null);

function Card(props) {
  function classes() {
    const bg = props.bgcolor ? " bg-" + props.bgcolor : " ";
    const txt = props.txtcolor ? " text-" + props.txtcolor : " text-white";
    const width = props.header === "ALL DATA" ? " w-75" : " ";
    return "card text-center mb-3 " + bg + txt + width;
  }

  function style() {
    return props.header !== "ALL DATA"
      ? { maxWidth: "18rem" }
      : { maxWidth: "75%" };
  }

  return (
    <div className={classes()} style={style()}>
      {props.header && <div className="card-header">{props.header}</div>}
      <div className="card-body">
        {props.title && <h5 className="card-title">{props.title}</h5>}
        {props.text && <p className="card-text">{props.text}</p>}
        {props.body}
        {props.status && <div id="createStatus">{props.status}</div>}
      </div>
    </div>
  );
}
