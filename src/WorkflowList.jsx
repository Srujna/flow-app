import { Link } from "react-router-dom";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import {
  Paper,
  Grid,
  IconButton,
  Typography,
  Button,
  Input,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
} from "@material-ui/core";
import { useHistory } from "react-router";
import axios from "axios";
import DeleteIcon from "@material-ui/icons/Delete";
import SearchIcon from "@material-ui/icons/Search";
import { useEffect, useState, useContext } from "react";
import { green, grey } from "@material-ui/core/colors";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import AddIcon from "@material-ui/icons/Add";
import WorkflowsContext from "./WorkflowsContext";
import DialogComponent from "./DialogComponent";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    margin: theme.spacing(4),
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
  margin: {
    width: "100%",
    paddingLeft: "10%",
    paddingRight: "10%",
    margin: theme.spacing(1),
  },
  box: {
    position: "relative",
    width: "90%",
    height: "200px",
    backgroundColor: "white",
    border: "1px solid black",
    boxShadow: "3px 3px 8px #888888",
    borderRadius: "5px",
  },
  icon: {
    padding: "10px",
    width: "20px",
    height: "20px",
    position: "absolute",
    right: "-5px",
    top: "-35px",
  },
  content: {
    padding: theme.spacing(2),
    margin: theme.spacing(2),
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

const WorkflowList = ({ match }) => {
  const workflows = useContext(WorkflowsContext);
  const [workflowsList, setList] = useState([]);
  useEffect(() => {
    setList(workflows);
  }, [workflows]);

  const classes = useStyles();
  const [cardId, setId] = useState(null);
  const [deleteID, setDeleteID] = useState(null);
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [msgopen, setMsgOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const history = useHistory();

  const handleDeleteAction = () => {
    try {
      axios({
        method: "DELETE",
        url: `http://localhost:8000/data/${deleteID}`,
      });
      history.push("/");
    } catch (e) {
      console.log(e);
    }
  };

  const updateWorkflowStatus = (workflow) => {
    console.log(workflow);
    try {
      axios.patch(`http://localhost:8000/data/${workflow.id}`, workflow);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={classes.root}>
      <br />
      <Grid container spacing={8}>
        <Grid item xs={4}>
          <FormControl className={classes.margin}>
            <Input
              id="input-with-icon-adornment"
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              }
              onChange={(e) => {
                setList(
                  workflows.filter(
                    (workflow) =>
                      workflow.workflowName
                        .toUpperCase()
                        .indexOf(e.target.value.toUpperCase()) > -1
                  )
                );
              }}
            />
          </FormControl>
        </Grid>
        <Grid item xs={2}>
          <FormControl className={classes.margin}>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={filter}
              onChange={(e) => {
                if (e.target.value === "Completed")
                  setList(
                    workflows.filter(
                      (workflow) => workflow.status === "Completed"
                    )
                  );
                else if (e.target.value === "Pending")
                  setList(
                    workflows.filter(
                      (workflow) => workflow.status === "Pending"
                    )
                  );
                else setList(workflows);
                setFilter(e.target.value);
              }}
            >
              <MenuItem value={"all"}>ALL</MenuItem>
              <MenuItem value={"Completed"}>COMPLETED</MenuItem>
              <MenuItem value={"Pending"}>PENDING</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={3}></Grid>
        <Grid item xs={3}>
          <GreenButton
            component={Link}
            variant="contained"
            color="primary"
            component={Link}
            to={`${match.path}/create`}
          >
            <AddIcon />
            Create New Workflow
          </GreenButton>
        </Grid>
      </Grid>
      <hr></hr>
      <Grid container spacing={8} className={classes.container}>
        {workflowsList &&
          workflowsList.map((workflow, id) => {
            return (
              <Grid
                item
                xs={3}
                key={`gridItem-${id}`}
                onMouseEnter={() => setId(id)}
                onMouseLeave={() => setId(null)}
              >
                <div className={classes.box}>
                  <div className={classes.icon}>
                    {
                      <IconButton
                        aria-label="settings"
                        onClick={() => {
                          setDeleteID(workflow.id);
                          setDialogMessage(
                            `Are you sure to delete ${workflow.workflowName}`
                          );
                          setOpen(true);
                        }}
                      >
                        {cardId === id && <DeleteIcon color="secondary" />}
                      </IconButton>
                    }
                  </div>
                  <Paper
                    className={classes.paper}
                    onClick={() => {
                      console.log(id);
                    }}
                  >
                    {workflow.workflowName}
                  </Paper>
                  <Typography
                    className={classes.content}
                    color="textPrimary"
                    component="p"
                  >
                    {workflow.status.toUpperCase()}
                    <IconButton
                      aria-label="settings"
                      onClick={() => {
                        if (workflow.status.toUpperCase() === "COMPLETED") {
                          workflow.status = "PENDING";
                          updateWorkflowStatus(workflow);
                        } else {
                          if (
                            workflow.nodes.filter(
                              (node) =>
                                node.status.toUpperCase() !== "COMPLETED"
                            ).length
                          ) {
                            setMsgOpen(true);
                          } else {
                            workflow.status = "COMPLETED";
                            updateWorkflowStatus(workflow);
                          }
                        }
                      }}
                    >
                      {workflow.status.toUpperCase() === "COMPLETED" ? (
                        <CheckCircleIcon
                          style={{ color: green[500] }}
                          fontSize="large"
                        />
                      ) : (
                        <CheckCircleIcon
                          style={{ color: grey[500] }}
                          fontSize="large"
                        />
                      )}
                    </IconButton>
                  </Typography>
                </div>
              </Grid>
            );
          })}
      </Grid>
      {open && (
        <DialogComponent
          dialogHeader={"Confirm action!!"}
          dialogMessage={dialogMessage}
          closeAction={() => {
            setOpen(false);
          }}
          primaryAction={() => {
            handleDeleteAction();
            setOpen(false);
            history.push("/");
          }}
          closeLabel={"Cancel"}
          primaryLabel={"Delete"}
          okOnly={false}
        />
      )}

      {msgopen && (
        <DialogComponent
          dialogHeader={"Cant complete the workflow!!"}
          dialogMessage={
            <div>
              Cannot move this workflow to completed status.
              <br></br>
              All tasks in this workflow should be in completed status for that.
            </div>
          }
          closeAction={() => {
            setMsgOpen(false);
          }}
          primaryLabel={"Ok"}
          okOnly
        />
      )}
    </div>
  );
};

export default WorkflowList;
