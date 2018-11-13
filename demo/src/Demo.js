import React, { Component } from "react";
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
          DOB: "2083-02-23",
          TOB: "2083-02-23 15:00",
          IsMental: true,
          FavNumber: 7,
          DateTimeSample: "2083-02-23 15:00"
        },
        {
          ID: 2,
          Name: "Charlotte",
          Surname: "KG",
          DOB: "2045-03-24",
          TOB: "2045-03-24 10:20",
          IsMental: false,
          FavNumber: 8,
          DateTimeSample: "2283-02-23 15:00"
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
        readOnly: true
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
        readOnly: false
      },
      {
        header: "TOB",
        accessor: "TOB",
        dataType: "Time",
        readOnly: false
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
      },
      {
        header: "Date Time Sample",
        accessor: "DateTimeSample",
        dataType: "DateTime"
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
            alert(
              `KeyValue: ${keyValue} \n changedColumn(s) : 
              ${changedColumns
                .map(
                  c => `${c.column} : ${c.value} - (sql Value) : ${c.sqlValue}`
                )
                .join(
                  "\n"
                )} \n You must return a promise with {success : Boolean} so the grid can update `
            );
            return new Promise(function(resolve, reject) {
              setTimeout(() => resolve({ success: true }), 1000);
            });
          }}
          addRecord={addedColumns => {
            alert(
              `AddedColumn(s) : 
              ${addedColumns
                .map(
                  c => `${c.column} : ${c.value} - (sql Value) : ${c.sqlValue}`
                )
                .join(
                  "\n"
                )} \n You must return a promise with {success : Boolean} so the grid \n optionally return the inserted record for grid to show it`
            );
            return new Promise(function(resolve, reject) {
              setTimeout(() => resolve({ success: true }), 1000);
            });
          }}
          deleteRecord={keyValue => {
            alert(
              `KeyValue: ${keyValue} \n
After deleting the record return {success:boolean}
* Note: you can show confirmation dialog here `
            );
            return new Promise(function(resolve, reject) {
              setTimeout(() => resolve({ success: true }), 1000);
            });
          }}
        />
      </Paper>
    );
  }
}

export default Demo;
