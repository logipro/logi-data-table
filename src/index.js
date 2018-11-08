import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import LogiDataRow from "./LogiDataRow";

const style = theme => ({
  table: {
    minWidth: 700
  }
});

const AddButton = ({ onExecute }) => (
  <IconButton color="secondary" onClick={onExecute} title="Add Record">
    <AddIcon />
  </IconButton>
);

class LogiDataTable extends Component {
  state = { newlyAddedRecord: [] };
  addingNewRecord() {
    //---if already there is new record then ignore!
    if (this.state.newRecord) return;
    //create new empty record
    var newRecord = {};
    this.props.columns.forEach(col => {
      newRecord[col.accessor] = "";
      newRecord[`$E-${col.accessor}`] = "";
    });

    this.setState({ newRecord });
  }

  addNewRecord(addedCols) {
    return new Promise((resolve, reject) => {
      this.props
        .addRecord(addedCols)
        .then(response => {
          var newlyAddedRecord = {};
          if (response.success) {
            //if the response has the record as well we add it from response
            if (response.record) {
              newlyAddedRecord = response.record;
            } //add new record to set of newly added records
            else {
              this.props.columns.forEach(col => {
                var addedCol = addedCols.find(ac => ac.column === col.accessor);
                newlyAddedRecord[col.accessor] = addedCol ? addedCol.value : "";
              });
            }
            this.setState({
              newRecord: undefined,
              newlyAddedRecord: this.state.newlyAddedRecord.concat([
                newlyAddedRecord
              ])
            });
            resolve(response.success);
          } //insert has failed
          else {
            reject(false);
          }
        })
        .catch(() => reject(false));
    });
  }

  render() {
    const { classes, columns, dataRows } = this.props;
    return (
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            {this.props.allowEdit || this.props.allowDelete ? (
              <TableCell>
                {this.props.allowAddNew ? (
                  <AddButton onExecute={() => this.addingNewRecord()} />
                ) : null}
              </TableCell>
            ) : null}

            {columns
              .filter(c => !c.isHidden)
              .map(c => (
                <TableCell key={c.accessor}>{c.header}</TableCell>
              ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {this.state.newRecord ? (
            <LogiDataRow
              row={this.state.newRecord}
              columns={columns}
              index={-1}
              newRow={true}
              allowEdit={true}
              saveChanges={addedCols => this.addNewRecord(addedCols)}
              newRowCanceled={() => this.setState({ newRecord: undefined })}
            />
          ) : null}
          {this.state.newlyAddedRecord.map((row, index) => (
            <LogiDataRow
              key={`N${index}`}
              row={row}
              columns={columns}
              index={index}
              allowEdit={false}
              allowDelete={false}
              allowAddNew={this.props.allowAddNew}
              newlyAdded
            />
          ))}
          {dataRows.map((row, index) => (
            <LogiDataRow
              key={index}
              row={row}
              columns={columns}
              index={index}
              allowEdit={this.props.allowEdit}
              allowDelete={this.props.allowDelete}
              allowAddNew={this.props.allowAddNew}
              saveChanges={changedCols =>
                this.props.saveChanges(row[this.props.keyAccessor], changedCols)
              }
              deleteRecord={() =>
                this.props.deleteRecord(row[this.props.keyAccessor])
              }
            />
          ))}
        </TableBody>
      </Table>
    );
  }
}

LogiDataTable.propTypes = {
  dataRows: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  keyAccessor: PropTypes.string,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.string.isRequired,
      accessor: PropTypes.string.isRequired,
      dataType: PropTypes.oneOf([
        "String",
        "Number",
        "Date",
        "DateTime",
        "Time",
        "Boolean"
      ]),
      isReadOnly: PropTypes.bool,
      isHidden: PropTypes.bool //if not available will be shown
    })
  ),
  allowEdit: PropTypes.bool,
  allowDelete: PropTypes.bool,
  allowAddNew: PropTypes.bool,
  saveChanges: PropTypes.func,
  deleteRecord: PropTypes.func
};

export default withStyles(style)(LogiDataTable);
