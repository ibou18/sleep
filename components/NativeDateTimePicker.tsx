import { useAppTheme } from "@/context/ThemeContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  Modal,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

interface NativeDateTimePickerProps {
  value: string; // Format "HH:mm"
  onTimeChange: (time: string) => void;
  placeholder?: string;
  label?: string;
}

export default function NativeDateTimePicker({
  value,
  onTimeChange,
  placeholder = "Sélectionnez l'heure",
  label,
}: NativeDateTimePickerProps) {
  const { theme } = useAppTheme();
  const [showPicker, setShowPicker] = useState(false);
  const [tempValue, setTempValue] = useState<Date | null>(null);

  // Couleurs du thème
  const background = useThemeColor({}, "background") as string;
  const textColor = useThemeColor({}, "text") as string;
  const accent = useThemeColor({}, "accent") as string;
  const surface = useThemeColor({}, "surface") as string;
  const muted = useThemeColor({}, "muted") as string;

  // Convertir la valeur string en objet Date
  const getDateFromValue = () => {
    if (!value) {
      return new Date();
    }
    const [hours, minutes] = value.split(":").map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    return date;
  };

  // Gérer le changement de temps (stockage temporaire)
  const handleTimeChange = (event: any, selectedDate?: Date) => {
    if (selectedDate && event.type !== "dismissed") {
      setTempValue(selectedDate);
    }
  };

  // Valider et appliquer le choix
  const validateChoice = () => {
    if (tempValue) {
      const hours = tempValue.getHours().toString().padStart(2, "0");
      const minutes = tempValue.getMinutes().toString().padStart(2, "0");
      onTimeChange(`${hours}:${minutes}`);
    }
    setShowPicker(false);
    setTempValue(null);
  };

  // Annuler le choix
  const cancelChoice = () => {
    setShowPicker(false);
    setTempValue(null);
  };

  // Bouton pour ouvrir le picker
  const openPicker = () => {
    setTempValue(getDateFromValue());
    setShowPicker(true);
  };

  // Bouton "Maintenant"
  const setCurrentTime = () => {
    const now = new Date();
    setTempValue(now);
  };

  return (
    <View style={styles.container}>
      {/* Bouton principal */}
      <TouchableOpacity
        onPress={openPicker}
        style={[
          styles.timeButton,
          {
            backgroundColor: background,
            borderColor: muted,
          },
        ]}
      >
        <ThemedText
          style={[styles.timeText, { color: value ? textColor : muted }]}
        >
          {value || placeholder}
        </ThemedText>
        <ThemedText style={[styles.clockIcon, { color: accent }]}>
          🕐
        </ThemedText>
      </TouchableOpacity>

      {label && (
        <ThemedText style={[styles.label, { color: muted }]}>
          {label}
        </ThemedText>
      )}

      {/* Bouton "Maintenant" */}
      <TouchableOpacity
        onPress={setCurrentTime}
        style={[styles.nowButton, { borderColor: muted }]}
      >
        <ThemedText style={[styles.nowButtonText, { color: muted }]}>
          🕐 Maintenant
        </ThemedText>
      </TouchableOpacity>

      {/* DateTimePicker natif dans une modal */}
      <Modal
        visible={showPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <ThemedView
            style={[styles.pickerContainer, { backgroundColor: surface }]}
          >
            {/* En-tête de la modal */}
            <View style={styles.pickerHeader}>
              <TouchableOpacity onPress={cancelChoice}>
                <ThemedText style={[styles.cancelButton, { color: muted }]}>
                  Annuler
                </ThemedText>
              </TouchableOpacity>

              <ThemedText style={[styles.pickerTitle, { color: textColor }]}>
                Sélectionner l&apos;heure
              </ThemedText>

              <TouchableOpacity onPress={setCurrentTime}>
                <ThemedText style={[styles.nowButtonModal, { color: accent }]}>
                  Maintenant
                </ThemedText>
              </TouchableOpacity>
            </View>

            {/* DateTimePicker natif */}
            <DateTimePicker
              value={tempValue || getDateFromValue()}
              mode="time"
              is24Hour={true}
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleTimeChange}
              themeVariant={theme === "dark" ? "dark" : "light"}
              style={styles.nativePicker}
            />

            {/* Bouton OK pour valider */}
            <View style={styles.validationControls}>
              <TouchableOpacity
                onPress={validateChoice}
                style={[styles.okButton, { backgroundColor: accent }]}
              >
                <ThemedText style={[styles.okButtonText, { color: "white" }]}>
                  OK
                </ThemedText>
              </TouchableOpacity>
            </View>
          </ThemedView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
  },
  timeButton: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  timeText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  clockIcon: {
    fontSize: 20,
    marginLeft: 8,
  },
  label: {
    fontSize: 12,
    marginTop: 8,
    textAlign: "center",
    opacity: 0.7,
  },
  nowButton: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  nowButtonText: {
    fontSize: 12,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  pickerContainer: {
    width: "90%",
    maxWidth: 400,
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  pickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  cancelButton: {
    fontSize: 16,
    fontWeight: "500",
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  nowButtonModal: {
    fontSize: 16,
    fontWeight: "600",
  },
  nativePicker: {
    width: "100%",
    height: Platform.OS === "ios" ? 200 : 120,
  },
  validationControls: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 20,
  },
  okButton: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 12,
    minWidth: 120,
    alignItems: "center",
  },
  okButtonText: {
    fontSize: 18,
    fontWeight: "600",
  },
  androidControls: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  iosPicker: {
    width: "100%",
    marginTop: 20,
  },
  iosPickerControls: {
    width: "100%",
    alignItems: "center",
    marginTop: 15,
  },
  doneButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
