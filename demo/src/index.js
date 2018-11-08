import React, { Component } from "react";
import { render } from "react-dom";
import LogiDataTable from "../../src/";
import Paper from "@material-ui/core/Paper";

class Demo extends Component {
  state = {
    dataRows: []
  };
  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    this.setState({
      dataRows: [
        {
          ID: 1,
          Name: "Ash",
          Surname: "K",
          DOB: "1983-02-23",
          TOB: "1983-02-23 03:00 PM",
          IsMental: true,
          FavNumber: 7
        },
        {
          ID: 2,
          Name: "Charlotte",
          Surname: "KG",
          DOB: "1986-03-24",
          TOB: "1986-03-24 12:00 AM",
          IsMental: false,
          FavNumber: 8
        }
      ]
    });
  }

  render() {
    const columns = [
      {
        header: "ID",
        accessor: "ID",
        dataType: "Number",
        isReadOnly: true
      },
      {
        header: "Surname",
        accessor: "Surname",
        dataType: "String"
      },
      {
        header: "DOB",
        accessor: "DOB",
        dataType: "Date",
        isReadOnly: false
      },
      {
        header: "TOB",
        accessor: "TOB",
        dataType: "Time",
        isReadOnly: false
      },
      {
        header: "Is Mental",
        accessor: "IsMental",
        dataType: "Boolean"
      },
      {
        header: "FavNumber",
        accessor: "FavNumber",
        dataType: "Number"
      }
    ];

    return (
      <Paper>
        <LogiDataTable
          dataRows={this.state.dataRows}
          columns={columns}
          keyAccessor={"ID"}
          allowEdit={true}
          allowDelete={true}
          allowAddNew={true}
          saveChanges={(keyValue, changedColumns) => {
            return new Promise(function(resolve, reject) {
              setTimeout(() => resolve(true), 1000);
            });
          }}
          addRecord={addedColumns => {
            return new Promise(function(resolve, reject) {
              setTimeout(() => resolve({ success: true }), 1000);
            });
          }}
          deleteRecord={keyValue => {
            return new Promise(function(resolve, reject) {
              setTimeout(() => resolve(true), 1000);
            });
          }}
        />
      </Paper>
    );
  }
}

render(<Demo />, document.querySelector("#demo"));
