import React from "react";
import TextField from "@material-ui/core/TextField";
import PropTypes from "prop-types";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider } from "material-ui-pickers";
import { TimePicker } from "material-ui-pickers";
import { DatePicker } from "material-ui-pickers";
import { DateTimePicker } from "material-ui-pickers";
import Checkbox from "@material-ui/core/Checkbox";
import ArrowForward from "@material-ui/icons/ArrowForward";
import ArrowBack from "@material-ui/icons/ArrowBack";

function EditableTableCell(props) {
  if (props.editMode && !props.readOnly) {
    const onDateInputChange = date => props.changeValue(date.toISOString());
    switch (props.dataType) {
      case "Date":
        return (
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker
              autoOk={true}
              value={
                props.dataRow[`$E-${props.columnName}`] !== undefined
                  ? props.dataRow[`$E-${props.columnName}`]
                  : props.dataRow[props.columnName]
              }
              onChange={onDateInputChange}
              rightArrowIcon={<ArrowForward />}
              leftArrowIcon={<ArrowBack />}
            />
          </MuiPickersUtilsProvider>
        );
      case "Time":
        return (
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <TimePicker
              value={
                props.dataRow[`$E-${props.columnName}`] !== undefined
                  ? props.dataRow[`$E-${props.columnName}`]
                  : props.dataRow[props.columnName]
              }
              onChange={onDateInputChange}
            />
          </MuiPickersUtilsProvider>
        );
      case "DateTime":
        return (
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DateTimePicker
              value={
                props.dataRow[`$E-${props.columnName}`] !== undefined
                  ? props.dataRow[`$E-${props.columnName}`]
                  : props.dataRow[props.columnName]
              }
              onChange={onDateInputChange}
              rightArrowIcon={<ArrowForward />}
              leftArrowIcon={<ArrowBack />}
            />
          </MuiPickersUtilsProvider>
        );
      case "Boolean":
        return (
          <Checkbox
            onChange={e => {
              props.changeValue(e.target.checked);
            }}
            checked={
              props.dataRow[`$E-${props.columnName}`] !== undefined
                ? props.dataRow[`$E-${props.columnName}`]
                : props.dataRow[props.columnName]
            }
          />
        );
      case "Number":
      case "String":
      default:
        return (
          <TextField
            type={props.dataType === "Number" ? "number" : "text"}
            value={
              props.dataRow[`$E-${props.columnName}`] !== undefined
                ? props.dataRow[`$E-${props.columnName}`]
                : props.dataRow[props.columnName]
            }
            onChange={e => props.changeValue(e.target.value)}
          />
        );
    }
  } //read only mode
  else {
    switch (props.dataType) {
      case "Date":
        return (
          <React.Fragment>
            {new Date(props.dataRow[props.columnName]).toLocaleDateString()}
          </React.Fragment>
        );
      case "DateTime":
        return (
          <React.Fragment>
            {new Date(props.dataRow[props.columnName]).toLocaleString()}
          </React.Fragment>
        );
      case "Time":
        return (
          <React.Fragment>
            {new Date(props.dataRow[props.columnName]).toLocaleTimeString()}
          </React.Fragment>
        );
      case "Boolean":
        return <Checkbox checked={props.dataRow[props.columnName]} />;
      default:
        return (
          <React.Fragment>{props.dataRow[props.columnName]}</React.Fragment>
        );
    }
  }
}

EditableTableCell.propTypes = {
  dataRow: PropTypes.object.isRequired,
  columnName: PropTypes.string.isRequired,
  readOnly: PropTypes.bool,
  changeValue: PropTypes.func.isRequired,
  dataType: PropTypes.oneOf([
    "String",
    "Number",
    "Date",
    "DateTime",
    "Time",
    "Boolean"
  ]).isRequired
};

EditableTableCell.defaultProps = {
  editMode: false,
  readOnly: false
};

export default EditableTableCell;
