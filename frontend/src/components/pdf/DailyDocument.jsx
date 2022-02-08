import React, { useEffect, useState } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import PropTypes from "prop-types";
import { getProjectDailyNotes } from "functions/projects.functions";
import parse from "html-react-parser";

const BORDER_COLOR = "#bfbfbf";
const BORDER_STYLE = "solid";
const COL1_WIDTH = 40;
const COLN_WIDTH = (100 - COL1_WIDTH) / 3;
// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 10,
  },
  section: {
    margin: 20,
    padding: 20,
    flexGrow: 1,
  },
  table: {
    // @ts-ignore
    display: "table",
    width: "auto",
    borderStyle: BORDER_STYLE,
    borderColor: BORDER_COLOR,
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableCol1Header: {
    width: COL1_WIDTH + "%",
    borderStyle: BORDER_STYLE,
    borderColor: BORDER_COLOR,
    borderBottomColor: "#000",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableColHeader: {
    width: COLN_WIDTH + "%",
    borderStyle: BORDER_STYLE,
    borderColor: BORDER_COLOR,
    borderBottomColor: "#000",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCol1: {
    width: COL1_WIDTH + "%",
    borderStyle: BORDER_STYLE,
    borderColor: BORDER_COLOR,
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCol: {
    width: COLN_WIDTH + "%",
    borderStyle: BORDER_STYLE,
    borderColor: BORDER_COLOR,
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCellHeader: {
    margin: 5,
    fontSize: 12,
    fontWeight: 500,
  },
  tableCell: {
    margin: 5,
    fontSize: 10,
  },
  hoursSection: {
    paddingTop: 20,
  },
  hoursDate: {
    paddingTop: 5,
    paddingBottom: 10,
    marginLeft: 3,
    fontSize: "10px",
    fontWeight: "thin",
  },
  digitalSignature: {
    maxWidth: 100,
  },
  textLabel: {
    paddingTop: 20,
    paddingBottom: 5,
    fontSize: 14,
  },
  hoursLabel: {
    marginLeft: 2,
    paddingBottom: 10,
    fontSize: 10,
    fontWeight: "thin",
  },
  projectTitle: {
    fontSize: 20,
  },
});

// Create Document Component
const DailyPdfDocument = ({ report }) => {
  const [Notes, setNotes] = useState([]);

  const getNotes = () => {
    return new Promise((resolve, reject) => {
      var date = new Date(report.createdAt);
      getProjectDailyNotes(report.projectId, date, (error, result) => {
        if (error) return reject(error.message);
        if (result) {
          resolve(result);
        }
      });
    });
  };

  const getHours = (hours) => {
    var sum = 0;
    if (!hours) return;
    for (var x = 0; x < hours.length; x++) {
      sum += hours[x].Hours;
    }
    return sum;
  };

  const init = async () => {
    if (!report && !report.id) return;
    try {
      const notes = await getNotes();
      console.log(notes);
      var newNotes = [];
      newNotes.push(notes);
      setNotes(notes);
    } catch (error) {
      return;
    }
  };

  useEffect(() => {
    init();
  }, [report]);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.projectTitle}>{report.projectName}</Text>

        <Text style={styles.textLabel}>Tutte le note</Text>
        <Text style={styles.hoursLabel}>
          Data: {new Date(report.createdAt).toLocaleString().split(",")[0]}
        </Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCol1Header}>
              <Text style={styles.tableCellHeader}>Lavoratore</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Nota</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}></Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}></Text>
            </View>
          </View>
          {Notes &&
            Notes.map((item, index) => {
              return (
                <View key={index} style={styles.tableRow}>
                  <View style={styles.tableCol1}>
                    <Text style={styles.tableCell}>
                      {item.user.firstname} {item.user.lastname}
                    </Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>
                      {parse(`${item.note}`)}
                    </Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}></Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}></Text>
                  </View>
                </View>
              );
            })}
        </View>

        <Text style={styles.textLabel}>Tutte le ore</Text>
        <Text style={styles.hoursLabel}>
          Data: {new Date(report.createdAt).toLocaleString().split(",")[0]}
        </Text>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCol1Header}>
              <Text style={styles.tableCellHeader}>Lavoratore</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Ore</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}></Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}></Text>
            </View>
          </View>
          {report.workers.map((item, index) => {
            return (
              <View key={index} style={styles.tableRow}>
                <View style={styles.tableCol1}>
                  <Text style={styles.tableCell}>
                    {item.firstname} {item.lastname}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{getHours(item.Hours)}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}></Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}></Text>
                </View>
              </View>
            );
          })}
        </View>

        <Text style={styles.textLabel}>Firma digitale</Text>
        {report.digitalSignature && (
          <Image
            style={styles.digitalSignature}
            src={report.digitalSignature}
          />
        )}
      </Page>
    </Document>
  );
};

DailyPdfDocument.propTypes = {
  report: PropTypes.object.isRequired,
};

export default DailyPdfDocument;
