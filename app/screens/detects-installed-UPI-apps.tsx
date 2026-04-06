import * as Linking from "expo-linking";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type UpiApp = {
  name: string;
  scheme: string;
  color: string;
  emoji: string;
};

const UPI_APPS: UpiApp[] = [
  { name: "PhonePe", scheme: "phonepe", color: "#5f259f", emoji: "💜" },
  { name: "GPay", scheme: "tez", color: "#4285F4", emoji: "🔵" },
  { name: "Paytm", scheme: "paytmmp", color: "#00BAF2", emoji: "🔷" },
  { name: "BHIM", scheme: "upi", color: "#FF6B00", emoji: "🟠" },
];

const buildUpiUrl = (
  scheme: string,
  { upiId, name, amount, note, transactionId }: PaymentParams,
) => {
  // Each app has its own path format
  const paths: Record<string, string> = {
    phonepe: `phonepe://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note ?? "Payment")}${transactionId ? `&tr=${transactionId}` : ""}`,
    tez: `tez://upi/pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note ?? "Payment")}${transactionId ? `&tr=${transactionId}` : ""}`,
    paytmmp: `paytmmp://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note ?? "Payment")}${transactionId ? `&tr=${transactionId}` : ""}`,
    upi: `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note ?? "Payment")}${transactionId ? `&tr=${transactionId}` : ""}`,
  };
  return paths[scheme] ?? paths["upi"];
};

type PaymentParams = {
  upiId: string;
  name: string;
  amount: number;
  note?: string;
  transactionId?: string;
};

const PAYMENT_PARAMS: PaymentParams = {
  upiId: "9161009514-2@ybl", // @ybl = PhonePe VPA suffix
  name: "jasim khan",
  amount: 1,
  note: "Phone pe test payment",
};

const UpiPaymentTest = () => {
  const [loadingApp, setLoadingApp] = useState<string | null>(null);

  //   for ios only

  const handlePay = async (app: UpiApp) => {
    setLoadingApp(app.name);
    try {
      const url = buildUpiUrl(app.scheme, {
        ...PAYMENT_PARAMS,
        transactionId: `TXN${Date.now()}`,
      });

      // ❌ Don't use canOpenURL on iOS — always false without entitlements
      // ✅ Just openURL directly and catch if it fails
      await Linking.openURL(url);
    } catch {
      Alert.alert(
        `${app.name} Not Found`,
        `Please install ${app.name} and try again.`,
      );
    } finally {
      setLoadingApp(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>UPI Payment Test</Text>
      <Text style={styles.sub}>Select app to open directly</Text>

      <View style={styles.infoCard}>
        <Row label="UPI ID" value={PAYMENT_PARAMS.upiId} />
        <Row label="Name" value={PAYMENT_PARAMS.name} />
        <Row label="Amount" value={`₹${PAYMENT_PARAMS.amount}.00`} />
      </View>

      <View style={styles.appsGrid}>
        {UPI_APPS.map((app) => (
          <TouchableOpacity
            key={app.name}
            style={[styles.appBtn, { borderColor: app.color }]}
            onPress={() => handlePay(app)}
            activeOpacity={0.8}
            disabled={!!loadingApp}
          >
            {loadingApp === app.name ? (
              <ActivityIndicator color={app.color} />
            ) : (
              <>
                <Text style={styles.appEmoji}>{app.emoji}</Text>
                <Text style={[styles.appName, { color: app.color }]}>
                  {app.name}
                </Text>
              </>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.hint}>
        ℹ️ If app is not installed, you'll see an alert
      </Text>
    </View>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>{value}</Text>
  </View>
);

export default UpiPaymentTest;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 20,
    justifyContent: "center",
    gap: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
    textAlign: "center",
  },
  sub: {
    fontSize: 13,
    color: "#888",
    textAlign: "center",
    marginTop: -8,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    gap: 10,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rowLabel: {
    fontSize: 13,
    color: "#888",
  },
  rowValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111",
  },
  appsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  appBtn: {
    flex: 1,
    minWidth: "40%",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1.5,
    paddingVertical: 16,
    alignItems: "center",
    gap: 6,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  appEmoji: {
    fontSize: 28,
  },
  appName: {
    fontSize: 13,
    fontWeight: "700",
  },
  hint: {
    fontSize: 12,
    color: "#aaa",
    textAlign: "center",
  },
});
