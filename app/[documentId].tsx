import Checkbox from "expo-checkbox";
import { db } from "@/firebaseConfig";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import styles from "../components/styles";
import { FirebaseClient } from "@/api/firebase/firebaseClient";
import { COLLECTION_NAME } from "@/components/consts";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

export default function SingleDocument() {
  const { documentId } = useLocalSearchParams<{ documentId: string }>();

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [shared, setShared] = useState(false);

  const router = useRouter();

  const onDateChange = (_: DateTimePickerEvent, selectedDate?: Date) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
    setShowDatePicker(false);
  };

  const loadData = async (documentId: string) => {
    setButtonDisabled(true);
    try {
      const docRef = doc(db, COLLECTION_NAME, documentId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        setAmount(data.amount.toString());
        setDescription(data.description);
        setDate(new Date(data.date));
        setShared(data.shared);
      } else {
        alert("Terjadi kesalahan saat memuat data");
        return;
      }
    } catch (err) {
      alert(err);
    }
    setButtonDisabled(false);
  };

  const setAmountNumber = (value: string) => {
    setAmount(value.replace(/[^0-9]/g, ""));
  };

  const updateSpending = async (documentId: string) => {
    let amountNumber = Number(amount);
    let dateString = date.toISOString().split("T")[0];

    try {
      await FirebaseClient.updateDocument(COLLECTION_NAME, documentId, {
        amount: amountNumber,
        description: description,
        date: dateString,
        shared: shared,
      });

      router.push("/");
    } catch (error) {
      alert(error);
    }
  };

  const deleteSpending = async (documentId: string) => {
    try {
      await FirebaseClient.deleteDocument(COLLECTION_NAME, documentId);

      router.push("/");
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    loadData(documentId);
  }, [documentId]);

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

      <View style={styles.buttonsContainer}>
        <View style={styles.button}>
          <Button
            title="Simpan"
            disabled={buttonDisabled}
            onPress={async () => {
              await updateSpending(documentId);
            }}
          />
        </View>
        <View style={styles.button}>
          <Button
            color={"#D84040"}
            disabled={buttonDisabled}
            title="Hapus"
            onPress={async () => {
              await deleteSpending(documentId);
            }}
          />
        </View>
      </View>
    </View>
  );
}
