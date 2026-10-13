/** Departure board shown while fonts load; journey.ts plays it out and lifts it away. */
export default function Loader() {
  return (
    <div className="loader" data-loader aria-hidden="true">
      <div className="loader-door loader-door--top" data-door="top" />
      <div className="loader-door loader-door--bottom" data-door="bottom" />
      <div className="loader-board" data-loader-board>
        <p className="loader-row">
          <span className="text-[var(--mute)]">Service</span>
          <span data-loader-route>MK-07 · MUMBAI → PRODUCTION</span>
        </p>
        <p className="loader-count">
          <span data-loader-count>000</span>
          <small>%</small>
        </p>
        <div className="loader-line">
          <span data-loader-bar />
        </div>
        <p className="loader-row">
          <span className="text-[var(--mute)]">Status</span>
          <span data-loader-status>Preparing departure</span>
        </p>
      </div>
    </div>
  );
}
