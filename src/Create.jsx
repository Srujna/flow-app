import { useHistory } from "react-router";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import {
  Grid,
  Card,
  CardHeader,
  IconButton,
  CardContent,
  Typography,
  Button,
  TextField,
} from "@material-ui/core";
import axios from "axios";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import { useState, useContext, useEffect } from "react";
import { green, grey, purple, blue, red } from "@material-ui/core/colors";
import ShuffleIcon from "@material-ui/icons/Shuffle";
import CloseIcon from "@material-ui/icons/Close";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import AddIcon from "@material-ui/icons/Add";
import WorkflowsContext from "./WorkflowsContext";
import DialogComponent from "./DialogComponent";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginTop: "30px",
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    fontSize: "20px",
    color: theme.palette.text.primary,
  },
  container: {
    padding: theme.spacing(6),
  },
  header: {
    minHeight: "40px",
    paddingTop: "-10px",
    paddingBottom: "0",
  },
  text: {
    width: "100%",
    marginLeft: "40px",
    margin: theme.spacing(1),
  },
  buttons: {
    marginTop: "30px",
  },
}));

const GreenButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(green[500]),
    backgroundColor: green[500],
    "&:hover": {
      backgroundColor: green[700],
    },
  },
}))(Button);

const PurpleButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: purple[500],
    "&:hover": {
      backgroundColor: purple[700],
    },
  },
}))(Button);

const RedButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(red[500]),
    backgroundColor: red[500],
    "&:hover": {
      backgroundColor: red[700],
    },
  },
}))(Button);

const BlueButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(blue[500]),
    backgroundColor: blue[500],
    "&:hover": {
      backgroundColor: blue[700],
    },
  },
}))(Button);

const shuffle = (array) => {
  let currentIndex = array.length;
  while (0 !== currentIndex) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    let temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
};

const ColoredLine = ({ color }) => (
  <hr
    style={{
      color: color,
      backgroundColor: color,
      height: 0,
    }}
  />
);

const Create = () => {
  const workflows = useContext(WorkflowsContext);
  const [workflowsList, setList] = useState([]);

  useEffect(() => {
    setList(workflows);
  }, [workflows]);

  const [workflow, setWorkflow] = useState({
    workflowName: "",
    status: "Pending",
    nodes: [],
  });

  const history = useHistory();
  const [workflowNameError, setWorkflowNameError] = useState(false);
  const [open, setOpen] = useState(false);

  const handleCreateWorkflow = async (wf) => {
    try {
      const response = await axios.post("http://localhost:8000/data", wf);
      history.push("/");
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  };

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={8}>
        <Grid item xs={4} className={classes.text}>
          <TextField
            variant="outlined"
            placeholder="Workflow name"
            margin="normal"
            fullWidth
            id="wfname"
            label="Workflow name"
            autoFocus
            autoComplete="false"
            value={workflow.workflowName}
            required
            error={workflowNameError}
            name="user_id"
            onChange={(e) => {
              if (e.target.value) setWorkflowNameError(false);
              setWorkflow({ ...workflow, workflowName: e.target.value });
            }}
            helperText={workflowNameError ? "Workflow Name is required!" : ""}
          />
        </Grid>
        <Grid item xs={2}></Grid>
        <Grid item xs={5}>
          <Grid container spacing={3}>
            <Grid item>
              <PurpleButton
                variant="contained"
                color="primary"
                className={classes.buttons}
                onClick={() => {
                  let temp = shuffle(workflow.nodes);
                  setWorkflow({ ...workflow, nodes: temp });
                }}
              >
                <ShuffleIcon />
                Shuffle
              </PurpleButton>
            </Grid>
            <Grid item>
              <RedButton
                variant="contained"
                color="primary"
                className={classes.buttons}
                onClick={() => {
                  let nodesOld = workflow.nodes;
                  nodesOld.pop();
                  setWorkflow({ ...workflow, nodes: nodesOld });
                }}
              >
                <CloseIcon />
                Delete
              </RedButton>
            </Grid>
            <Grid item>
              <GreenButton
                variant="contained"
                color="primary"
                className={classes.buttons}
                onClick={() => {
                  let nodesOld = workflow.nodes;
                  nodesOld.push({
                    nodeName: "",
                    nodeDescription: "",
                    status: "Pending",
                  });
                  setWorkflow({ ...workflow, nodes: nodesOld });
                }}
              >
                <AddIcon />
                Add Node
              </GreenButton>
            </Grid>
            <Grid item>
              <BlueButton
                variant="contained"
                color="primary"
                className={classes.buttons}
                onClick={() => {
                  if (
                    workflow.workflowName === "" ||
                    workflow.workflowName === undefined
                  ) {
                    setWorkflowNameError(true);
                    return;
                  }
                  if (
                    workflow.nodes.length === 0 ||
                    workflow.nodes.filter(
                      (task) =>
                        task.nodeName === "" || task.nodeName === undefined
                    ).length
                  ) {
                    setOpen(true);
                    return;
                  }
                  workflow.id = workflowsList.length + 1;
                  handleCreateWorkflow(workflow);
                }}
              >
                Save
              </BlueButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <hr></hr>
      <Grid container spacing={0} className={classes.container}>
        {workflow.nodes.map((task, id) => {
          return (
            <Grid item xs={4} key={`gridKey${id}`}>
              <Grid container alignItems="center" justify="center">
                <Grid item xs={9}>
                  <Card className={classes.root}>
                    <CardHeader
                      className={classes.header}
                      action={
                        <IconButton
                          aria-label="settings"
                          onClick={() => {
                            let tempStatus = task.status;
                            if (task.status === "Completed")
                              tempStatus = "Pending";
                            if (task.status === "Pending")
                              tempStatus = "InProgress";
                            if (task.status === "InProgress")
                              tempStatus = "Completed";
                            let nodesOld = workflow.nodes.map((node, j) => {
                              var temp = Object.assign({}, node);
                              if (j === id) temp.status = tempStatus;
                              return temp;
                            });
                            setWorkflow({ ...workflow, nodes: nodesOld });
                          }}
                        >
                          {task.status === "Completed" && (
                            <CheckCircleIcon
                              style={{ color: green[500] }}
                              fontSize="large"
                            />
                          )}
                          {task.status === "InProgress" && (
                            <CheckCircleIcon
                              style={{ color: blue["A400"] }}
                              fontSize="large"
                            />
                          )}
                          {task.status === "Pending" && (
                            <CheckCircleIcon
                              style={{ color: grey[500] }}
                              fontSize="large"
                            />
                          )}
                        </IconButton>
                      }
                    />
                    <CardContent>
                      <TextField
                        variant="outlined"
                        placeholder="Enter task name"
                        margin="normal"
                        fullWidth
                        id="wfname"
                        label="Task name"
                        autoFocus
                        autoComplete="false"
                        value={task.nodeName}
                        name="user_id"
                        required
                        onChange={(e) => {
                          let nodesOld = workflow.nodes.map((node, j) => {
                            var temp = Object.assign({}, node);
                            if (j === id) temp.nodeName = e.target.value;
                            return temp;
                          });
                          setWorkflow({ ...workflow, nodes: nodesOld });
                        }}
                      />
                      <TextField
                        id="outlined-multiline-static"
                        label="Task note"
                        multiline
                        rows={4}
                        variant="outlined"
                      />
                      <br />
                      <Typography
                        variant="h6"
                        color="textPrimary"
                        component="p"
                      >
                        {task.nodeDescription}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={3}>
                  {id < workflow.nodes.length - 1 && (
                    <Grid container alignItems="center" justify="center">
                      <Grid item xs={9}>
                        <ColoredLine color="red" />
                      </Grid>
                      <Grid item xs={3}>
                        <ArrowRightIcon
                          fontSize="large"
                          style={{
                            marginLeft: "-15px",
                          }}
                        />
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
          );
        })}
      </Grid>
      {open && (
        <DialogComponent
          dialogHeader={"Can't save workflow!!"}
          dialogMessage={<div>
            Cannot save a workflow with unnamed/no tasks.
            <br></br>
            Atleast one task should be there in a task and all added tasks
            should have names
          </div>}
          closeAction={() => {
            setOpen(false);
          }}
          primaryLabel={"Ok"}
          okOnly
        />
      )}
    </div>
  );
};

export default Create;
