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
import { Paper } from "@material-ui/core";

const style = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto"
  },
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
      <Paper className={classes.root}>
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
                  this.props.saveChanges(
                    row[this.props.keyAccessor],
                    changedCols
                  )
                }
                deleteRecord={() =>
                  this.props.deleteRecord(row[this.props.keyAccessor])
                }
              />
            ))}
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

LogiDataTable.propTypes = {
  /** Array of Objects for the data rows that you want to display */
  dataRows: PropTypes.array.isRequired,
  /** TODO: show Loading if true */
  loading: PropTypes.bool,
  /** accessor (property/column name for the key column) */
  keyAccessor: PropTypes.string,
  /** Array of Objects defining columns
   * {header, accessor, dataType, isReadOnly, isHidden}*/
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
  /** Obvs */
  allowEdit: PropTypes.bool,
  /** Obvs */
  allowDelete: PropTypes.bool,
  /** Obvs */
  allowAddNew: PropTypes.bool,
  /** LogiDataTable will call this function with the changedColumns {ColName, Value, sqlValue}
   * and expects to get back a promise */
  saveChanges: PropTypes.func,
  /** LogiDataTable will call this function, sending it the key Value of the record to be deleted
   * expects to receive back a promise resolving to true or false
   */
  deleteRecord: PropTypes.func,
  /** LogiDataTable will call this function with new columns {ColName, Value, sqlValue}
   * and expects to get back a promise which will resolve to
   * {Success: True/False, Record: {optionally return the newly added record }
   */
  addRecord: PropTypes.func
};

//exporting like this so Docz will pick the props!
export default (LogiDataTable = withStyles(style)(LogiDataTable));
