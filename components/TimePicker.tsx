import { useAppTheme } from "@/context/ThemeContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

interface TimePickerProps {
  value: string; // Format "HH:mm"
  onTimeChange: (time: string) => void;
  placeholder?: string;
  label?: string;
}

export default function TimePicker({
  value,
  onTimeChange,
  placeholder = "00:00",
  label,
}: TimePickerProps) {
  const [showPicker, setShowPicker] = useState(false);
  const { theme } = useAppTheme();

  const muted = useThemeColor({}, "muted") as string;
  const accent = useThemeColor({}, "accent") as string;
  const textColor = useThemeColor({}, "text") as string;
  const surface = useThemeColor({}, "surface") as string;

  // Extraire heures et minutes du value
  const [hours, minutes] = value ? value.split(":").map(Number) : [0, 0];

  const handleTimeSelect = (newHours: number, newMinutes: number) => {
    const timeString = `${newHours.toString().padStart(2, "0")}:${newMinutes
      .toString()
      .padStart(2, "0")}`;
    onTimeChange(timeString);
    setShowPicker(false);
  };

  const renderTimeSelector = () => (
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
          <View style={styles.pickerHeader}>
            <TouchableOpacity onPress={() => setShowPicker(false)}>
              <ThemedText style={[styles.cancelButton, { color: muted }]}>
                Annuler
              </ThemedText>
            </TouchableOpacity>
            <ThemedText style={[styles.pickerTitle, { color: textColor }]}>
              Sélectionner l&apos;heure
            </ThemedText>
            <TouchableOpacity
              onPress={() => {
                const now = new Date();
                handleTimeSelect(now.getHours(), now.getMinutes());
              }}
            >
              <ThemedText style={[styles.nowButton, { color: accent }]}>
                Maintenant
              </ThemedText>
            </TouchableOpacity>
          </View>

          <View style={styles.timePickers}>
            {/* Sélecteur d'heures */}
            <View style={styles.timeColumn}>
              <ThemedText style={[styles.columnTitle, { color: muted }]}>
                Heures
              </ThemedText>
              <View style={styles.pickerWrapper}>
                {/* Indicateur de sélection */}
                <View
                  style={[
                    styles.selectionIndicator,
                    { backgroundColor: accent + "20", borderColor: accent },
                  ]}
                />
                <ScrollView
                  style={styles.scrollPicker}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={50} // Hauteur de chaque élément pour un snap précis
                  decelerationRate="fast"
                  contentContainerStyle={styles.scrollContent}
                >
                  {/* Espacement en haut */}
                  <View style={styles.spacer} />
                  {Array.from({ length: 24 }, (_, i) => (
                    <TouchableOpacity
                      key={i}
                      style={[
                        styles.timeOption,
                        hours === i && styles.selectedTimeOption,
                      ]}
                      onPress={() => handleTimeSelect(i, minutes)}
                    >
                      <ThemedText
                        style={[
                          styles.timeOptionText,
                          { color: hours === i ? accent : textColor },
                          hours === i && styles.selectedTimeText,
                        ]}
                      >
                        {i.toString().padStart(2, "0")}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                  {/* Espacement en bas */}
                  <View style={styles.spacer} />
                </ScrollView>
              </View>
            </View>

            {/* Séparateur */}
            <ThemedText style={[styles.separator, { color: accent }]}>
              :
            </ThemedText>

            {/* Sélecteur de minutes */}
            <View style={styles.timeColumn}>
              <ThemedText style={[styles.columnTitle, { color: muted }]}>
                Minutes
              </ThemedText>
              <View style={styles.pickerWrapper}>
                {/* Indicateur de sélection */}
                <View
                  style={[
                    styles.selectionIndicator,
                    { backgroundColor: accent + "20", borderColor: accent },
                  ]}
                />
                <ScrollView
                  style={styles.scrollPicker}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={50}
                  decelerationRate="fast"
                  contentContainerStyle={styles.scrollContent}
                >
                  {/* Espacement en haut */}
                  <View style={styles.spacer} />
                  {Array.from({ length: 60 }, (_, i) => (
                    <TouchableOpacity
                      key={i}
                      style={[
                        styles.timeOption,
                        minutes === i && styles.selectedTimeOption,
                      ]}
                      onPress={() => handleTimeSelect(hours, i)}
                    >
                      <ThemedText
                        style={[
                          styles.timeOptionText,
                          { color: minutes === i ? accent : textColor },
                          minutes === i && styles.selectedTimeText,
                        ]}
                      >
                        {i.toString().padStart(2, "0")}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                  {/* Espacement en bas */}
                  <View style={styles.spacer} />
                </ScrollView>
              </View>
            </View>
          </View>
        </ThemedView>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setShowPicker(true)}
        style={[
          styles.timeButton,
          {
            backgroundColor: theme === "dark" ? "#1a1a1a" : "#f8f9fa",
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
        onPress={() => {
          const now = new Date();
          const timeString = `${now
            .getHours()
            .toString()
            .padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
          onTimeChange(timeString);
        }}
        style={[styles.nowButtonSmall, { borderColor: muted }]}
      >
        <ThemedText style={[styles.nowButtonText, { color: muted }]}>
          🕐 Maintenant
        </ThemedText>
      </TouchableOpacity>

      {renderTimeSelector()}
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
  nowButtonSmall: {
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  nowButtonText: {
    fontSize: 10,
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
  nowButton: {
    fontSize: 16,
    fontWeight: "600",
  },
  timePickers: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 200,
  },
  timeColumn: {
    flex: 1,
    alignItems: "center",
  },
  pickerWrapper: {
    position: "relative",
    height: 200,
    width: "100%",
  },
  selectionIndicator: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    height: 50,
    marginTop: -25,
    borderWidth: 2,
    borderRadius: 12,
    zIndex: 1,
    pointerEvents: "none",
  },
  columnTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
  },
  separator: {
    fontSize: 36,
    fontWeight: "bold",
    marginHorizontal: 20,
  },
  scrollPicker: {
    height: 200,
    flex: 1,
  },
  scrollContent: {
    paddingTop: 75,
    paddingBottom: 75,
  },
  spacer: {
    height: 75,
  },
  timeOption: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  selectedTimeOption: {
    backgroundColor: "transparent", // Géré par l'indicateur
  },
  timeOptionText: {
    fontSize: 24,
    fontWeight: "500",
    textAlign: "center",
  },
  selectedTimeText: {
    fontSize: 28,
    fontWeight: "700",
  },
});
