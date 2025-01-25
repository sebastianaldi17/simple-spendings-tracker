import { Button, SectionList, Text, TextInput, View } from "react-native";
import React, { useCallback, useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import { useFocusEffect } from "expo-router";
import styles from "@/components/styles";
import { Spending, SpendingSection } from "@/components/classes";
import { currencyFormatter } from "@/components/utils";
import { FirebaseClient } from "@/api/firebase/firebaseClient";
import { COLLECTION_NAME, monthItems } from "@/components/consts";
import SpendingItem from "@/components/spending-item";

export default function Tab() {
  const [chosenMonth, setChosenMonth] = useState<string>("01");
  const [chosenYear, setChosenYear] = useState<string>("2025");
  const [data, setData] = useState<SpendingSection[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [sharedTotal, setSharedTotal] = useState<number>(0);
  const [loadButtonDisabled, setLoadButtonDisabled] = useState<boolean>(false);

  const loadData = async (year: string, month: string) => {
    setLoadButtonDisabled(true);

    try {
      const snapshot = await FirebaseClient.getCollectionWithDateFilter(
        COLLECTION_NAME,
        `${year}-${month}-01`,
        `${year}-${month}-31`,
      );
      let spendingsBySection: SpendingSection[] = [];
      let currentTotal = 0;
      let currentSharedTotal = 0;

      snapshot.forEach((doc) => {
        const data = doc.data();
        const spending = new Spending();
        spending.id = doc.id;
        spending.amount = data.amount;
        spending.description = data.description;
        spending.date = data.date;
        spending.shared = data.shared;
        spending.timestamp = data.timestamp;

        currentTotal += spending.amount;
        if (data.shared) {
          currentSharedTotal += spending.amount;
        }

        const section = spendingsBySection.find(
          (section) => section.title === spending.date,
        );
        if (section) {
          section.data.push(spending);
        } else {
          spendingsBySection.push({
            title: spending.date,
            data: [spending],
          });
        }
      });

      for (let i = 0; i < spendingsBySection.length; i += 1) {
        spendingsBySection[i].data = spendingsBySection[i].data.sort((a, b) => {
          return a.timestamp < b.timestamp ? 1 : -1;
        });
      }

      spendingsBySection = spendingsBySection.sort((a, b) => {
        return a.title < b.title ? 1 : -1;
      });

      setData(spendingsBySection);
      setTotal(currentTotal);
      setSharedTotal(currentSharedTotal);
    } catch (err) {
      alert(err);
    } finally {
      setLoadButtonDisabled(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const now = new Date();
      setChosenYear(now.getFullYear().toString());
      setChosenMonth((now.getMonth() + 1).toString().padStart(2, "0"));

      loadData(
        now.getFullYear().toString(),
        (now.getMonth() + 1).toString().padStart(2, "0"),
      );
    }, []),
  );

  return (
    <View style={styles.mainContainer}>
      <View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Tahun: </Text>
          <TextInput
            style={styles.inputBox}
            onChangeText={setChosenYear}
            value={chosenYear}
            placeholder="Tahun"
            inputMode="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Bulan: </Text>
          <Dropdown
            autoScroll={false}
            data={monthItems}
            value={chosenMonth}
            labelField="label"
            valueField="value"
            onChange={(item) => {
              setChosenMonth(item.value);
            }}
            style={styles.inputBox}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Tampilkan"
            disabled={loadButtonDisabled}
            onPress={() => {
              loadData(chosenYear, chosenMonth);
            }}
          />
        </View>

        <Text style={styles.totalText}>
          Total pengeluaran: {currencyFormatter.format(total)}
        </Text>
        <Text style={styles.totalText}>
          Total patungan: {currencyFormatter.format(sharedTotal)}
        </Text>
      </View>

      <SectionList
        style={styles.sectionList}
        sections={data}
        renderItem={({ item }) => {
          return (
            <SpendingItem
              link={item.id}
              amount={item.amount}
              description={item.description}
              shared={item.shared}
            />
          );
        }}
        renderSectionHeader={({ section: { title } }) => {
          return <Text style={styles.title}>{title}</Text>;
        }}
      />
    </View>
  );
}
