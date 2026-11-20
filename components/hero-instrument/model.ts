export const CYCLE_MS = 12000;
export const TANK_CAPACITY_L = 33000;
export const STATIC_PHASE = 0.62;

const START_L = 24418;
const SOLD_PER_LOOP = 9000; // litres sold during the drive
const LOSS_PER_LOOP = 140; // litres that go missing during the drive
const DELIVERY_L = SOLD_PER_LOOP + LOSS_PER_LOOP; // what the truck brings, so the loop closes
const DRIVE_END = 0.85; // the truck arrives at 85% of the loop
const DELIVERY_END = 0.97; // the tank is refilled by 97%

/** Loop phase in [0, 1) for a clock reading and the time the loop's phase 0 occurred. */
export const phaseAt = (now: number, origin: number) => ((((now - origin) % CYCLE_MS) + CYCLE_MS) % CYCLE_MS) / CYCLE_MS;

/** Origin that makes the loop continue from `heldPhase` when resumed at `now`. */
export const resumeOrigin = (now: number, heldPhase: number) => now - heldPhase * CYCLE_MS;

const ease = (t: number) => t * t * (3 - 2 * t);

export function instrumentState(rawPhase: number) {
  const phase = ((rawPhase % 1) + 1) % 1;
  const drive = Math.min(phase / DRIVE_END, 1);
  const unload = phase <= DRIVE_END ? 0 : Math.min((phase - DRIVE_END) / (DELIVERY_END - DRIVE_END), 1);

  const sold = Math.round(SOLD_PER_LOOP * drive);
  const lost = Math.round(LOSS_PER_LOOP * drive);
  const delivered = Math.round(DELIVERY_L * ease(unload));
  const tankLitres = START_L - sold - lost + delivered;

  return {
    tankLitres,
    tankFraction: tankLitres / TANK_CAPACITY_L,
    truckProgress: ease(drive),
    delivered,
    sold,
    unaccounted: delivered - sold - (tankLitres - START_L),
  };
}
