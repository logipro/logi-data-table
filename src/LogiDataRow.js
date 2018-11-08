import React, { Component } from "react";
import PropTypes from "prop-types";
import TableRow from "@material-ui/core/TableRow";
import EditableTableCell from "./EditableTableCell";
import withStyles from "@material-ui/core/styles/withStyles";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import IconButton from "@material-ui/core/IconButton";
import TableCell from "@material-ui/core/TableCell";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import { Value2SQLValue } from "./Value2SQLValue";

const style = theme => ({
  rowStyle: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.background.default
    }
  },
  progress: {
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2
  }
});

class LogiDataRow extends Component {
  constructor(props) {
    super(props);
    //keep the original row for user cancels edits
    this.originalRow = Object.assign({}, props.row);

    this.state = {
      row: props.row
    };
  }

  updateRecord() {
    this.setState({ actionInProgress: true });
    //create array of changed Items
    let changedCols = [];
    for (let prop in this.state.row) {
      if (prop.startsWith("$E-")) {
        //check if value is modified
        if (this.state.row[prop] !== this.state.row[prop.slice(3)]) {
          changedCols.push({
            column: prop.slice(3),
            value: this.state.row[prop],
            sqlValue: Value2SQLValue.get(
              this.props.columns.find(c => c.accessor === prop.slice(3))
                .dataType
            )(this.state.row[prop])
          });
        }
      }
    }
    if (changedCols.length > 0) {
      this.props
        .saveChanges(changedCols)
        .then(success => {
          if (success) {
            //if the action has been successful update edited values locally
            changedCols.forEach(cc => (this.originalRow[cc.column] = cc.value));
          }
          this.setState({
            success,
            actionInProgress: false,
            editMode: false,
            row: this.originalRow
          });
        })
        .catch(e => {
          this.setState({
            success: false,
            actionInProgress: false,
            editMode: false,
            row: this.originalRow
          });
        });
    } //no column has changed
    else {
      this.setState({
        success: true,
        actionInProgress: false,
        editMode: false
      });
    }
  }

  deleteRecord() {
    this.setState({ actionInProgress: true });
    this.props
      .deleteRecord()
      .then(success => {
        //if record successfully deleted we show Delete in action
        //and user can't do anything with that record. Parent app can decide to refresh/re-fetch data
        this.setState({
          success: success,
          actionInProgress: false,
          deleted: success
        });
      })
      .catch(e => {
        this.setState({
          success: false,
          actionInProgress: false,
          deleted: false
        });
      });
  }

  changeValue(value, columnName) {
    var editedRow = this.state.row;
    editedRow["$E-" + columnName] = value;
    this.setState({ row: editedRow });
  }

  render() {
    const { classes, columns, index } = this.props;
    return (
      <TableRow className={classes.rowStyle}>
        {this.props.newlyAdded ? (
          <TableCell>New</TableCell>
        ) : this.state.deleted ? (
          <TableCell>DELETED</TableCell>
        ) : this.state.actionInProgress ? (
          <TableCell>
            <CircularProgress size={30} className={classes.progress} />
          </TableCell>
        ) : this.state.success !== undefined && !this.state.success ? (
          <TableCell>
            <FailedButton
              onExecute={() => {
                //reset the row to original row
                this.setState({
                  editMode: false,
                  success: undefined,
                  deleted: false,
                  row: this.originalRow
                });
              }}
            />
          </TableCell>
        ) : this.state.editMode || this.props.newRow ? (
          <TableCell>
            <CommitButton onExecute={() => this.updateRecord()} />
            <CancelButton
              onExecute={() => {
                if (this.props.newRow) {
                  this.props.newRowCanceled();
                } else {
                  //reset the row to original row
                  this.setState({ editMode: false, row: this.originalRow });
                }
              }}
            />
          </TableCell>
        ) : this.props.allowEdit ||
        this.props.allowDelete ||
        this.props.allowAddNew ? (
          <TableCell>
            {this.props.allowEdit ? (
              <EditButton
                onExecute={() => {
                  this.setState({ editMode: true });
                }}
              />
            ) : null}
            {this.props.allowDelete ? (
              <DeleteButton onExecute={() => this.deleteRecord()} />
            ) : null}
          </TableCell>
        ) : null}
        {columns.filter(c => !c.isHidden).map(c => (
          <TableCell
            key={`${c.accessor}${index}`}
            component={index === 0 ? "th" : null}
            scope={index === 0 ? "row" : null}
            padding="checkbox"
          >
            <EditableTableCell
              keyAccessor={this.props.keyAccessor}
              dataRow={this.state.row}
              columnName={c.accessor}
              changeValue={value => this.changeValue(value, c.accessor)}
              dataType={c.dataType}
              readOnly={c.readOnly}
              editMode={this.state.editMode || this.props.newRow}
            />
          </TableCell>
        ))}
      </TableRow>
    );
  }
}

LogiDataRow.propTypes = {
  row: PropTypes.object,
  columns: PropTypes.array,
  index: PropTypes.number,
  allowEdit: PropTypes.bool,
  allowDelete: PropTypes.bool,
  saveChanges: PropTypes.func,
  deleteRecord: PropTypes.func
};

export default withStyles(style)(LogiDataRow);

const EditButton = ({ onExecute }) => (
  <IconButton onClick={onExecute} title="Edit row">
    <EditIcon />
  </IconButton>
);

const DeleteButton = ({ onExecute }) => (
  <IconButton onClick={onExecute} title="Delete row">
    <DeleteIcon />
  </IconButton>
);

const CommitButton = ({ onExecute }) => (
  <IconButton onClick={onExecute} title="Save changes">
    <SaveIcon />
  </IconButton>
);

const CancelButton = ({ onExecute }) => (
  <IconButton color="secondary" onClick={onExecute} title="Cancel changes">
    <CancelIcon />
  </IconButton>
);

const FailedButton = ({ onExecute }) => (
  <Button color="primary" onClick={onExecute} title="Action Failed">
    Failed!
  </Button>
);
