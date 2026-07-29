import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import TextField from "../../components/common/TextField";
import ChipToggle from "../../components/common/ChipToggle";
import GenderToggle from "../../components/carpool/GenderToggle";
import { colors, spacing, typography } from "../../theme/tokens";
import { createRide } from "../../services/rideService";

const SEAT_OPTIONS = [1, 2, 3, 4, 5, 6].map((n) => ({ label: String(n), value: n }));

function toDepartureIso(date, time) {
  const parsed = new Date(`${date}T${time}`);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString();
}

export default function OfferRideScreen() {
  const navigate = useNavigate();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [pricePerSeat, setPricePerSeat] = useState("");
  const [seatsTotal, setSeatsTotal] = useState(null);
  const [genderPreference, setGenderPreference] = useState("any");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isComplete =
    origin.trim() &&
    destination.trim() &&
    date.trim() &&
    time.trim() &&
    pricePerSeat.trim() &&
    seatsTotal;

  async function handleSubmit() {
    setError(null);

    const departureIso = toDepartureIso(date.trim(), time.trim());
    if (!departureIso) {
      setError("Enter a valid date (YYYY-MM-DD) and time (HH:MM).");
      return;
    }

    setIsSubmitting(true);
    try {
      await createRide({
        origin: origin.trim(),
        destination: destination.trim(),
        departure_time: departureIso,
        price_per_seat: Number(pricePerSeat),
        seats_total: seatsTotal,
        gender_preference: genderPreference,
        notes: notes.trim() || undefined,
      });
      window.alert("Ride posted — your ride is now live on Browse Rides.");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>Offer a ride</h1>
        <p style={styles.subtitle}>Fill in the details so riders know what to expect.</p>

        <TextField
          label="From"
          placeholder="North Campus Hostel"
          value={origin}
          onChangeText={setOrigin}
        />
        <TextField
          label="To"
          placeholder="Central Railway Station"
          value={destination}
          onChangeText={setDestination}
        />

        <div style={styles.row}>
          <div style={styles.half}>
            <TextField
              label="Date"
              placeholder="2026-07-30"
              value={date}
              onChangeText={setDate}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </div>
          <div style={styles.half}>
            <TextField
              label="Time"
              placeholder="18:30"
              value={time}
              onChangeText={setTime}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.half}>
            <TextField
              label="Price per seat (₹)"
              placeholder="60"
              keyboardType="number-pad"
              value={pricePerSeat}
              onChangeText={(text) => setPricePerSeat(text.replace(/[^0-9.]/g, ""))}
            />
          </div>
        </div>

        <ChipToggle label="Seats" options={SEAT_OPTIONS} value={seatsTotal} onChange={setSeatsTotal} />

        <div style={styles.label}>Gender preference</div>
        <div style={styles.genderWrap}>
          <GenderToggle value={genderPreference} onChange={setGenderPreference} />
        </div>

        <TextField
          label="Notes (optional)"
          placeholder="Leaving right after breakfast, can wait 10 min max."
          value={notes}
          onChangeText={setNotes}
          multiline
        />

        {error ? <div style={styles.error}>{error}</div> : null}
      </div>
      <div style={styles.footer}>
        <Button
          title="Post ride"
          onPress={handleSubmit}
          loading={isSubmitting}
          disabled={!isComplete}
        />
      </div>
    </div>
  );
}

const styles = {
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    paddingLeft: spacing.xl,
    paddingRight: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    overflowY: "auto",
  },
  title: {
    fontSize: typography.size.title,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    margin: 0,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.size.body,
    color: colors.textSecondary,
    margin: 0,
    marginBottom: spacing.lg,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    gap: spacing.sm,
  },
  half: {
    flex: 1,
  },
  label: {
    fontSize: typography.size.bodySmall,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  genderWrap: {
    marginBottom: spacing.md,
  },
  error: {
    fontSize: typography.size.bodySmall,
    color: colors.error,
    marginTop: spacing.xs,
  },
  footer: {
    padding: spacing.xl,
    display: "flex",
    flexDirection: "column",
  },
};
