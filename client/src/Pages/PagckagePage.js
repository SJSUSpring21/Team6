import { useEffect, useState } from "react";
import jsonp from "jsonp";
import { DataGrid } from "@material-ui/data-grid";
import {
  Button,
  FormControl,
  FormGroup,
  IconButton,
  Snackbar,
  TextField,
  Typography,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import ResourcePage from "./ResourcePage";
import { useLocation } from "react-router";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function PackagePage(params) {
  const urlQuery = useQuery();
  console.log(urlQuery);
  let id = urlQuery.get("id");
  const [title, setTitle] = useState("");
  const [packageNLGData, setPackageNLGData] = useState({
    Scale: "",
    Nativity: "",
    Gender: "",
    Race_and_Ethnicity: "",
    Age_Group: "",
    Title: "",
  });
  const [packageDisplayData, setPackageDisplayData] = useState({
    title: "",
    name: "",
    notes: "",
  });
  const [rowData, setRowData] = useState({});
  const [rows, setRows] = useState([]);
  const columns = [
    {
      field: "id",
      headerName: "id",
      hide: true,
    },
    {
      field: "name",
      headerName: "Region",
      // valueFormatter: (params) => {
      //   return (params.value.split("(")[0]);
      // },
      width: 500,
    },
    {
      field: "description",
      headerName: "Year info",
      width: 150,
    },
  ];
  const [warning, setWarning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resourceMode, setResourceMode] = useState(false);
  let myUrl = "";
  const closeWarning = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setWarning(false);
  };
  const createUrl = () => {
    const base = "https://data.diversitydatakids.org/api/3/action/package_show";
    myUrl = new URL(base);
    myUrl.searchParams.append("id", id);
  };

  useEffect(() => {
    fetchCkanData();
  }, []);

  const fetchCkanData = () => {
    if (id === "") {
      setWarning(true);
      return;
    }
    createUrl();
    setLoading(true);
    jsonp(myUrl.toString(), null, function (err, res) {
      if (err) {
        setWarning(true);
        setLoading(false);
        return;
      } else {
        setPackageNLGData({
          Scale: res.result.Scale,
          Nativity: res.result.Nativity,
          Gender: res.result.Gender,
          Race_and_Ethnicity: res.result["Available by Race and Ethnicity"],
          Age_Group: res.result["Age Group"],
          Title: res.result.title.split("(")[0],
        });
        setPackageDisplayData({
          title: res.result.title,
          name: res.result.name,
          notes: res.result.notes,
        });
        setTitle(res.result.title);
        setRows(res.result.resources);
        setLoading(false);
      }
    });
  };
  if (resourceMode) {
    return (
      <div>
        {/* <Button
          style={{ margin: "8px", display: "block", marginRight: "auto" }}
          variant="contained"
          color="primary"
          onClick={() => {
            setResourceMode(false);
          }}
        >
          Go back
        </Button> */}
        <IconButton style={{position:"absolute"}}
          // className={classes.iconButton}
          aria-label="Back"
          onClick={(e) => {
            setResourceMode(false);
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <ResourcePage
          data={{
            NLGData: packageNLGData,
            resourceName: rowData.data.name,
            yearFormat: rowData.data.description,
            resourceId: rowData.data.id,
            displayData: packageDisplayData,
          }}
        ></ResourcePage>
      </div>
    );
  }
  return (
    <div className="App">
      <div style={{margin:"8px",display:"block",textAlign:"center"}}>
        <Snackbar open={warning} autoHideDuration={6000} onClose={closeWarning}>
          <Alert onClose={closeWarning} severity="error">
            Please enter correct package id
          </Alert>
        </Snackbar>
        <Typography variant="h6" gutterBottom style={{ margin: "auto" }}>
          {title}
        </Typography>
      </div>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.id}
          pageSize={20}
          onRowSelected={(rowData) => {
            setRowData(rowData);
          }}
        />
      </div>
      <Button
        style={{ margin: "8px", display: "block", marginLeft: "auto" }}
        variant="contained"
        color="primary"
        disabled={!(rowData && rowData.isSelected)}
        onClick={() => {
          setResourceMode(true);
        }}
      >
        Get Dataset
      </Button>
    </div>
  );
}
export default PackagePage;
