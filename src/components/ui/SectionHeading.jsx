export default function SectionHeading({ eyebrow, title, action, center = false }) {
  return (
    <div className={`flex items-end justify-between gap-4 ${center ? "flex-col items-center text-center" : ""}`}>
      <div>
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h2 className="heading-display text-3xl md:text-4xl text-noir">{title}</h2>
      </div>
      {action}
    </div>
  );
}