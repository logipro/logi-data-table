import React from "react";
import TextField from "@material-ui/core/TextField";
import PropTypes from "prop-types";
import DateFnsUtils from "material-ui-pickers/utils/date-fns-utils";
import MuiPickersUtilsProvider from "material-ui-pickers/MuiPickersUtilsProvider";
import TimePicker from "material-ui-pickers/TimePicker";
import DatePicker from "material-ui-pickers/DatePicker";
import DateTimePicker from "material-ui-pickers/DateTimePicker";
import Checkbox from "@material-ui/core/Checkbox";

function EditableTableCell(props) {
  if (props.editMode && !props.readOnly) {
    const onDateInputChange = date => props.changeValue(date.toISOString());
    switch (props.dataType) {
      case "Date":
        return (
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker
              value={
                props.dataRow[`$E-${props.columnName}`] !== undefined
                  ? props.dataRow[`$E-${props.columnName}`]
                  : props.dataRow[props.columnName]
              }
              onChange={onDateInputChange}
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
    //if datetime wrap it in wrapper without allowing change for better render!
    // if (["Date", "DateTime", "Time"].includes(props.dataType))
    //   return (
    //     <MuiPickersUtilsProvider utils={DateFnsUtils}>
    //       <DateTimePicker
    //         value={props.dataRow[props.columnName]}
    //         onChange={() => {
    //           alert("Not allowed to edit");
    //         }}
    //       />
    //     </MuiPickersUtilsProvider>
    //   );
    switch (props.dataType) {
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
