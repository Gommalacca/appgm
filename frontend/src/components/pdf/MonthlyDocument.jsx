import React, { useEffect, useState } from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import PropTypes from "prop-types";
import { getProjectNotes } from "functions/projects.functions";
import { MonthEN } from "../../data/month";
import parse from "html-react-parser";
// Create Document Component

const MonthlyPdfDocument = ({ Project, Workers }) => {
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
      display: "flex",
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
      paddingBottom: 5,
      fontSize: 10,
      fontWeight: "thin",
    },
    projectTitle: {
      fontSize: 20,
    },
  });

  const [Notes, setNotes] = useState([]);
  const [WorkersMonthly, setMonthlyWorkers] = useState([]);

  const getNotes = () => {
    return new Promise((resolve, reject) => {
      getProjectNotes(Project.id, (error, result) => {
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

  const getWorkersByMonth = (month) => {
    if (Workers.length == 0) return;
    if (month > 11) return;
    const date = new Date();
    date.setMonth(month + 1);
    var monthAfter = new Date(date.getFullYear(), date.getMonth(), 1, 0);
    date.setMonth(month - 1);
    var monthBefore = new Date(date.getFullYear(), date.getMonth() + 1);
    return new Promise((resolve) => {
      var arr = [];
      Workers.forEach((element) => {
        if (!element.Hours) return;
        const _hour = element.Hours.filter((item) => {
          let date = new Date(item.createdAt);
          return monthBefore < date && monthAfter > date;
        });
        if (_hour.length == 0) return;
        let obj = {
          userId: element.id,
          firstname: element.firstname,
          lastname: element.lastname,
          hours: _hour,
        };
        arr.push(obj);
      });
      if (arr.length == 0) return;
      resolve(arr);
    });
  };

  const getWorkers = () => {
    return new Promise((resolve, reject) => {
      try {
        var workersArr = [];
        MonthEN.forEach(async (element, index) => {
          const workers = await getWorkersByMonth(index);
          if (!workers) return;
          if (workers.length == 0) return;
          workersArr.push({
            month: index,
            workers: workers,
          });
        });
        resolve(workersArr);
      } catch (error) {
        reject(error);
      }
    });
  };

  const initAll = async () => {
    if (!Project.id) return;
    try {
      const workers = await getWorkers();
      const notes = await getNotes();
      var newNotes = [];
      newNotes.push(notes);
      setNotes(notes);
      setMonthlyWorkers(workers);
    } catch (error) {
      return;
    }
  };

  useEffect(() => {
    initAll();
  }, [Project, Workers]);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.projectTitle}>{Project.name}</Text>
        <Text style={styles.textLabel}>Tutte le note</Text>
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
          Data: {new Date(Project.createdAt).toLocaleString()}
        </Text>
        {WorkersMonthly &&
          WorkersMonthly.map((item, index) => {
            return (
              <React.Fragment key={index}>
                <Text style={styles.textLabel}>
                  MESE: {MonthEN[item.month].label}
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

                  {item.workers.map((_worker, zIndex) => {
                    return (
                      <View key={zIndex} style={styles.tableRow}>
                        <View style={styles.tableCol1}>
                          <Text style={styles.tableCell}>
                            {_worker.firstname} {_worker.lastname}
                          </Text>
                        </View>
                        <View style={styles.tableCol}>
                          <Text style={styles.tableCell}>
                            {getHours(_worker.hours)}
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
              </React.Fragment>
            );
          })}
      </Page>
    </Document>
  );
};

MonthlyPdfDocument.propTypes = {
  Project: PropTypes.object.isRequired,
  Workers: PropTypes.array.isRequired,
};

export default MonthlyPdfDocument;
