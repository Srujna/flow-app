import React, { useState, useEffect, useContext } from "react";
import { Redirect, Switch, Route } from "react-router-dom";
import { withRouter } from "react-router";
import "./Dashboard.css";
import Create from "./Create";
import Header from "./Header";
import WorkflowList from "./WorkflowList";
import axios from "axios";
import WorkflowsContext from "./WorkflowsContext";

const Dashboard = ({ match }) => {
  const [workflows, setWorkflows] = useState([]);
  const fetchWorkflows = async () => {
    try {
      const apiCall = await axios.get("http://localhost:8000/data");
      setWorkflows(apiCall.data);
    }
    catch(e) {
      console.log(e);
    }
  };

  const [islogout, setIslogout] = useState(false);

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const signOut = () => {
    localStorage.removeItem("token");
    setIslogout(true);
  };
  if (islogout) {
    return <Redirect to="/login" />;
  }
  return (
    <div>
      <div style={{ background: "#a900b0", width: "100%" }}>
        <Header isLogged={!islogout} signOut={signOut} />
      </div>
      <div className="main">
        <WorkflowsContext.Provider value={workflows}>
          <Switch>
            <Route path={`${match.path}/create`}>
              <Create />
            </Route>
            <Route path="*">
              <WorkflowList match={match} />
            </Route>
          </Switch>
        </WorkflowsContext.Provider>
      </div>
    </div>
  );
};

export default withRouter(Dashboard);
