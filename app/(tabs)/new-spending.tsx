import Checkbox from "expo-checkbox";
import { Button, View, Text, TextInput } from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useState } from "react";
import { useRouter } from "expo-router";
import styles from "@/components/styles";
import { FirebaseClient } from "@/api/firebase/firebaseClient";
import { COLLECTION_NAME } from "@/components/consts";

export default function Tab() {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [disableSave, setDisableSave] = useState(false);

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date());
  const [shared, setShared] = useState(false);

  const router = useRouter();

  const onDateChange = (_: DateTimePickerEvent, selectedDate?: Date) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
    setShowDatePicker(false);
  };

  const resetFields = () => {
    setDescription("");
    setAmount("");
    setDate(new Date());
  };

  const saveSpending = async () => {
    if (!description || !amount || !date) {
      alert("Ada data yang kosong");
      return;
    }

    setDisableSave(true);

    try {
      let amountNumber = Number(amount);
      let dateString = date.toISOString().split("T")[0];

      await FirebaseClient.insertDocument(COLLECTION_NAME, {
        amount: amountNumber,
        description: description,
        date: dateString,
        shared: shared,
        timestamp: new Date().getTime(),
      });

      resetFields();
      router.push("/");
    } catch (err) {
      alert(err);
    } finally {
      setDisableSave(false);
    }
  };

  const setAmountNumber = (value: string) => {
    setAmount(value.replace(/[^0-9]/g, ""));
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Tanggal:</Text>
        <Text
          style={styles.inputBox}
          onPress={() => {
            setShowDatePicker(true);
          }}
        >
          {date.toLocaleDateString()}
        </Text>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={onDateChange}
          />
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Keterangan: </Text>
        <TextInput
          onChangeText={setDescription}
          value={description}
          placeholder="Keterangan pengeluaran"
          style={styles.inputBox}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Jumlah: </Text>
        <TextInput
          onChangeText={setAmountNumber}
          value={amount}
          placeholder="Jumlah pengeluaran"
          inputMode="numeric"
          style={styles.inputBox}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Patungan:</Text>
        <Checkbox value={shared} onValueChange={setShared} />
      </View>

      <Button
        title="Simpan"
        disabled={disableSave}
        onPress={async () => {
          await saveSpending();
        }}
      />
    </View>
  );
}
