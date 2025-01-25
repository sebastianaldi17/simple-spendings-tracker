import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  // Main containers
  mainContainer: {
    flex: 1,
    padding: 16,
  },
  sectionList: {
    padding: 8,
  },
  sectionListItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
    borderBottomColor: "#989898",
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderTopColor: "#989898",
    borderTopWidth: StyleSheet.hairlineWidth * 2,
  },

  // Text styles
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 8,
    textAlign: "left",
  },
  totalText: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 8,
    textAlign: "center",
  },

  // Input container styles
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  inputLabel: {
    marginRight: 8,
    width: "35%",
  },
  inputBox: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 8,
    padding: 8,
    width: "65%",
  },

  // Button styles
  buttonContainer: {
    marginBottom: 8,
  },
  buttonsContainer: {
    flexDirection: "row",
    width: "100%",
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },

  // list item styles
  leftListItem: {
    textAlign: "left",
    flex: 1,
  },
  rightListItem: {
    textAlign: "right",
  },

  // margins
  mb16: {
    marginBottom: 16,
  },
});

export default styles;
