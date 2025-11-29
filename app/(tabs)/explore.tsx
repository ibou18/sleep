import { StyleSheet } from "react-native";

import { Collapsible } from "@/components/Collapsible";
import { ExternalLink } from "@/components/ExternalLink";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function SleepEducationScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#f9f9f9", dark: "#091e48" }}
      showThemeToggle={true}
      showWeather={true}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Guide du Sommeil</ThemedText>
        <ThemedText type="subtitle">
          Conseils et explications pour mieux dormir
        </ThemedText>
      </ThemedView>

      <Collapsible title="🌙 Pourquoi les cycles de 90 minutes ?">
        <ThemedText>
          Notre sommeil suit des{" "}
          <ThemedText type="defaultSemiBold">
            cycles naturels de 90 minutes
          </ThemedText>
          en moyenne. Chaque cycle comprend plusieurs phases :
        </ThemedText>
        <ThemedText style={styles.listItem}>
          • <ThemedText type="defaultSemiBold">Sommeil léger</ThemedText> :
          Transition vers le sommeil profond
        </ThemedText>
        <ThemedText style={styles.listItem}>
          • <ThemedText type="defaultSemiBold">Sommeil profond</ThemedText> :
          Récupération physique
        </ThemedText>
        <ThemedText style={styles.listItem}>
          •{" "}
          <ThemedText type="defaultSemiBold">
            Sommeil paradoxal (REM)
          </ThemedText>{" "}
          : Récupération mentale et rêves
        </ThemedText>
        <ThemedText style={styles.highlight}>
          💡 Se réveiller à la fin d&apos;un cycle vous aide à vous sentir plus
          reposé !
        </ThemedText>
      </Collapsible>

      <Collapsible title="⏰ L'importance de l'heure de coucher">
        <ThemedText>
          L&apos;application calcule vos heures de coucher idéales en tenant
          compte du
          <ThemedText type="defaultSemiBold">
            {" "}
            temps d&apos;endormissement moyen de 14 minutes
          </ThemedText>
          .
        </ThemedText>
        <ThemedText style={styles.tipBox}>
          🎯 <ThemedText type="defaultSemiBold">Conseil :</ThemedText> Essayez
          de vous coucher à la même heure chaque soir pour réguler votre horloge
          biologique naturelle.
        </ThemedText>
      </Collapsible>

      <Collapsible title="😴 Combien d'heures faut-il dormir ?">
        <ThemedText style={styles.ageGroup}>
          <ThemedText type="defaultSemiBold">Adultes (18-64 ans) :</ThemedText>{" "}
          7-9 heures
        </ThemedText>
        <ThemedText style={styles.ageGroup}>
          <ThemedText type="defaultSemiBold">
            Personnes âgées (65+ ans) :
          </ThemedText>{" "}
          7-8 heures
        </ThemedText>
        <ThemedText style={styles.ageGroup}>
          <ThemedText type="defaultSemiBold">
            Adolescents (14-17 ans) :
          </ThemedText>{" "}
          8-10 heures
        </ThemedText>
        <ThemedText style={styles.warningBox}>
          ⚠️ Moins de 6 heures ou plus de 10 heures de sommeil régulièrement
          peut affecter votre santé.
        </ThemedText>
      </Collapsible>

      <Collapsible title="🛏️ Conseils pour mieux s'endormir">
        <ThemedText style={styles.listItem}>
          🌡️ <ThemedText type="defaultSemiBold">Température :</ThemedText>{" "}
          Gardez votre chambre entre 16-19°C
        </ThemedText>
        <ThemedText style={styles.listItem}>
          🌑 <ThemedText type="defaultSemiBold">Obscurité :</ThemedText>{" "}
          Utilisez des rideaux occultants
        </ThemedText>
        <ThemedText style={styles.listItem}>
          📱 <ThemedText type="defaultSemiBold">Écrans :</ThemedText> Évitez-les
          1h avant le coucher
        </ThemedText>
        <ThemedText style={styles.listItem}>
          ☕ <ThemedText type="defaultSemiBold">Caféine :</ThemedText> Évitez
          après 14h
        </ThemedText>
        <ThemedText style={styles.listItem}>
          🧘 <ThemedText type="defaultSemiBold">Relaxation :</ThemedText>{" "}
          Pratiquez la méditation ou la lecture
        </ThemedText>
      </Collapsible>

      <Collapsible title="⏰ Comprendre votre chronotype">
        <ThemedText>
          Votre <ThemedText type="defaultSemiBold">chronotype</ThemedText>{" "}
          détermine vos heures naturelles de veille et de sommeil :
        </ThemedText>
        <ThemedText style={styles.chronotype}>
          🌅{" "}
          <ThemedText type="defaultSemiBold">Lève-tôt (Alouette) :</ThemedText>{" "}
          Coucher vers 21h-22h, lever vers 5h-6h
        </ThemedText>
        <ThemedText style={styles.chronotype}>
          🦉{" "}
          <ThemedText type="defaultSemiBold">Couche-tard (Hibou) :</ThemedText>{" "}
          Coucher vers 23h-minuit, lever vers 7h-8h
        </ThemedText>
        <ThemedText style={styles.tipBox}>
          💡 Respectez votre chronotype naturel autant que possible pour un
          sommeil optimal.
        </ThemedText>
      </Collapsible>

      <Collapsible title="📊 Signification des recommandations">
        <ThemedText>
          L&apos;application classe vos heures de sommeil selon leur qualité :
        </ThemedText>
        <ThemedText style={styles.qualityGood}>
          💚 <ThemedText type="defaultSemiBold">Optimal :</ThemedText> 7.5-9
          heures (5-6 cycles complets)
        </ThemedText>
        <ThemedText style={styles.qualityOk}>
          💛 <ThemedText type="defaultSemiBold">Bon :</ThemedText> 6-7.5 heures
          (4-5 cycles)
        </ThemedText>
        <ThemedText style={styles.qualityPoor}>
          💔 <ThemedText type="defaultSemiBold">Insuffisant :</ThemedText> Moins
          de 6 heures (moins de 4 cycles)
        </ThemedText>
      </Collapsible>

      <Collapsible title="🔬 Les bienfaits d'un bon sommeil">
        <ThemedText style={styles.listItem}>
          🧠 <ThemedText type="defaultSemiBold">Mémoire :</ThemedText>{" "}
          Consolidation des apprentissages
        </ThemedText>
        <ThemedText style={styles.listItem}>
          💪 <ThemedText type="defaultSemiBold">Récupération :</ThemedText>{" "}
          Réparation des tissus musculaires
        </ThemedText>
        <ThemedText style={styles.listItem}>
          🛡️ <ThemedText type="defaultSemiBold">Immunité :</ThemedText>{" "}
          Renforcement du système immunitaire
        </ThemedText>
        <ThemedText style={styles.listItem}>
          😊 <ThemedText type="defaultSemiBold">Humeur :</ThemedText> Régulation
          émotionnelle
        </ThemedText>
        <ThemedText style={styles.listItem}>
          ⚖️ <ThemedText type="defaultSemiBold">Poids :</ThemedText> Régulation
          de l&apos;appétit
        </ThemedText>
      </Collapsible>

      <Collapsible title="📚 En savoir plus">
        <ThemedText>
          Pour approfondir vos connaissances sur le sommeil :
        </ThemedText>
        <ExternalLink href="https://www.sleepfoundation.org/">
          <ThemedText type="link">Sleep Foundation (EN)</ThemedText>
        </ExternalLink>
        <ExternalLink href="https://institut-sommeil-vigilance.org/">
          <ThemedText type="link">Institut National du Sommeil (FR)</ThemedText>
        </ExternalLink>
        <ExternalLink href="https://www.who.int/news-room/fact-sheets/detail/mental-disorders">
          <ThemedText type="link">Organisation Mondiale de la Santé</ThemedText>
        </ExternalLink>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#4A90E2",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  listItem: {
    fontSize: 14,
    lineHeight: 22,
    marginVertical: 4,
    paddingLeft: 8,
  },
  highlight: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "rgba(74, 144, 226, 0.1)",
    borderLeftWidth: 4,
    borderLeftColor: "#4A90E2",
    fontStyle: "italic",
  },
  tipBox: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "rgba(52, 199, 89, 0.1)",
    borderLeftWidth: 4,
    borderLeftColor: "#34C759",
  },
  ageGroup: {
    fontSize: 14,
    lineHeight: 22,
    marginVertical: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: "rgba(74, 144, 226, 0.05)",
  },
  warningBox: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "rgba(255, 149, 0, 0.1)",
    borderLeftWidth: 4,
    borderLeftColor: "#FF9500",
  },
  chronotype: {
    fontSize: 14,
    lineHeight: 22,
    marginVertical: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "rgba(142, 142, 147, 0.1)",
  },
  qualityGood: {
    fontSize: 14,
    lineHeight: 22,
    marginVertical: 4,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: "rgba(52, 199, 89, 0.1)",
  },
  qualityOk: {
    fontSize: 14,
    lineHeight: 22,
    marginVertical: 4,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: "rgba(255, 204, 0, 0.1)",
  },
  qualityPoor: {
    fontSize: 14,
    lineHeight: 22,
    marginVertical: 4,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: "rgba(255, 59, 48, 0.1)",
  },
});
