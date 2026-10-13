/** The railway that runs the full height of the page and ends at a buffer stop. */
export default function Track() {
  return (
    <div className="track" data-track aria-hidden="true">
      <div className="track-bed" />
      <div className="rail rail--l" />
      <div className="rail rail--r" />
      <div className="buffer" data-buffer>
        <span className="buffer-beam" />
        <span className="buffer-lamp" />
        <span className="buffer-lamp" />
      </div>
    </div>
  );
}
